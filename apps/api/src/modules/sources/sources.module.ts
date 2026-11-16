import {
  Body,
  Controller,
  Get,
  Inject,
  Injectable,
  Module,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  AUTOMATION_LEVELS,
  canAutoApprove,
  CONNECTOR_TYPES,
  SOURCE_STATUSES,
  TRUST_TIERS,
} from '@salaam/domain';
import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { CurrentActor, Roles, type Actor } from '../../common/auth';
import { ProblemError } from '../../common/problem.filter';
import { CONFIG, type AppConfig } from '../../config';
import { DB, type Db } from '../../db/client';
import { sources } from '../../db/schema';
import { AuditService } from '../audit/audit.service';

export type Source = typeof sources.$inferSelect;

const createSourceSchema = z.object({
  code: z.string().regex(/^DS-\d{3}$/),
  name: z.string().min(2).max(200),
  connectorType: z.enum(CONNECTOR_TYPES),
  defaultTrustTier: z.enum(TRUST_TIERS),
  config: z.record(z.unknown()).default({}),
  legalBasis: z.string().max(500).optional(),
  evidenceRef: z.string().max(500).optional(),
  attribution: z.string().max(300).optional(),
  retentionDays: z.number().int().min(1).max(365).default(90),
});
const statusSchema = z.object({ status: z.enum(SOURCE_STATUSES), note: z.string().max(500).optional() });
const automationSchema = z.object({ level: z.enum(AUTOMATION_LEVELS), reason: z.string().min(5).max(500) });

@Injectable()
export class SourcesService {
  constructor(
    @Inject(DB) private readonly db: Db,
    @Inject(CONFIG) private readonly config: AppConfig,
    private readonly audit: AuditService,
  ) {}

  async getByCode(code: string): Promise<Source> {
    const [s] = await this.db.select().from(sources).where(eq(sources.code, code));
    if (!s) throw new ProblemError(404, 'SOURCE_NOT_FOUND', `Source ${code} is not registered`);
    return s;
  }

  async getById(id: string): Promise<Source> {
    const [s] = await this.db.select().from(sources).where(eq(sources.id, id));
    if (!s) throw new ProblemError(404, 'SOURCE_NOT_FOUND', 'Source not found');
    return s;
  }

  /** No connector or submission may use a source without an Approved register record. */
  assertApproved(source: Source): void {
    if (source.status !== 'approved') {
      throw new ProblemError(
        409,
        'SOURCE_NOT_APPROVED',
        `Source ${source.code} is '${source.status}'; it needs an approved register record (docs/DATA_SOURCES_REGISTER.md)`,
      );
    }
  }

  /**
   * Routing decision for a newly collected item. Through MVP-1 every source is L0/L1,
   * so the answer is always 'review' (D-25). Kept as the single decision point.
   */
  route(source: Source): 'review' | 'auto_approve' {
    const allowed =
      this.config.ALLOW_AUTOMATION_ABOVE_L1 &&
      canAutoApprove(source.automationLevel, Boolean(source.automationApprovedAt));
    return allowed ? 'auto_approve' : 'review';
  }

  list() {
    return this.db.select().from(sources).orderBy(asc(sources.code));
  }

  async create(input: z.infer<typeof createSourceSchema>, actor: Actor) {
    return this.db.transaction(async (tx) => {
      const [row] = await tx
        .insert(sources)
        .values({ ...input, status: 'proposed', automationLevel: 'L1' })
        .returning();
      await this.audit.record(actor, 'source.create', 'source', row!.id, { after: row }, tx);
      return row!;
    });
  }

  async setStatus(id: string, input: z.infer<typeof statusSchema>, actor: Actor) {
    const before = await this.getById(id);
    return this.db.transaction(async (tx) => {
      const [row] = await tx
        .update(sources)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(sources.id, id))
        .returning();
      await this.audit.record(actor, 'source.status', 'source', id, { before, after: { ...row, note: input.note } }, tx);
      return row!;
    });
  }

  async setAutomationLevel(id: string, input: z.infer<typeof automationSchema>, actor: Actor) {
    if (actor.role !== 'admin') {
      throw new ProblemError(403, 'FORBIDDEN', 'Only the founder/admin may change automation levels');
    }
    const above = input.level !== 'L0' && input.level !== 'L1';
    if (above && !this.config.ALLOW_AUTOMATION_ABOVE_L1) {
      throw new ProblemError(
        409,
        'AUTOMATION_DISABLED',
        'Automation above L1 is disabled through MVP-1: every item needs human approval (D-25)',
      );
    }
    const before = await this.getById(id);
    return this.db.transaction(async (tx) => {
      const [row] = await tx
        .update(sources)
        .set({
          automationLevel: input.level,
          automationApprovedBy: above ? actor.id : null,
          automationApprovedAt: above ? new Date() : null,
          updatedAt: new Date(),
        })
        .where(eq(sources.id, id))
        .returning();
      await this.audit.record(
        actor,
        'source.automation_level',
        'source',
        id,
        { before: { level: before.automationLevel }, after: { level: input.level, reason: input.reason } },
        tx,
      );
      return row!;
    });
  }
}

@Controller('v1/admin/sources')
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  @Roles('curator')
  @Get()
  list() {
    return this.sourcesService.list();
  }

  @Roles('admin')
  @Post()
  create(@Body() body: unknown, @CurrentActor() actor: Actor) {
    return this.sourcesService.create(createSourceSchema.parse(body), actor);
  }

  @Roles('admin')
  @Patch(':id/status')
  status(@Param('id', ParseUUIDPipe) id: string, @Body() body: unknown, @CurrentActor() actor: Actor) {
    return this.sourcesService.setStatus(id, statusSchema.parse(body), actor);
  }

  @Roles('admin')
  @Patch(':id/automation-level')
  automation(@Param('id', ParseUUIDPipe) id: string, @Body() body: unknown, @CurrentActor() actor: Actor) {
    return this.sourcesService.setAutomationLevel(id, automationSchema.parse(body), actor);
  }
}

@Module({ providers: [SourcesService], controllers: [SourcesController], exports: [SourcesService] })
export class SourcesModule {}
