import {
  Body,
  Controller,
  Get,
  Inject,
  Injectable,
  Module,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { localizedTextSchema, PLACE_KINDS } from '@salaam/domain';
import { asc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { CurrentActor, Public, Roles, type Actor } from '../../common/auth';
import { ProblemError } from '../../common/problem.filter';
import { normalizeLocalized } from '../../common/text';
import { DB, type Db } from '../../db/client';
import { categories, cities, districts, places } from '../../db/schema';
import { AuditService } from '../audit/audit.service';

export const newPlaceSchema = z.object({
  citySlug: z.string().default('baku'),
  districtSlug: z.string().optional(),
  kind: z.enum(PLACE_KINDS).default('venue'),
  name: localizedTextSchema,
  address: localizedTextSchema.optional(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  website: z.string().url().optional(),
});
export type NewPlace = z.infer<typeof newPlaceSchema>;

type Tx = Parameters<Parameters<Db['transaction']>[0]>[0];

@Injectable()
export class CatalogService {
  constructor(
    @Inject(DB) private readonly db: Db,
    private readonly audit: AuditService,
  ) {}

  async cityBySlug(slug: string, tx: Tx | Db = this.db) {
    const [city] = await tx.select().from(cities).where(eq(cities.slug, slug));
    if (!city) throw new ProblemError(404, 'CITY_NOT_FOUND', `Unknown city '${slug}'`);
    return city;
  }

  /** Curator-created places are verified by the curator on a map (docs/CONTENT_OPERATIONS.md §4). */
  async createPlace(input: NewPlace, actor: Actor, tx?: Tx) {
    const run = async (t: Tx) => {
      const city = await this.cityBySlug(input.citySlug, t);
      let districtId: string | null = null;
      if (input.districtSlug) {
        const [d] = await t
          .select()
          .from(districts)
          .where(sql`${districts.cityId} = ${city.id} AND ${districts.slug} = ${input.districtSlug}`);
        if (!d) throw new ProblemError(404, 'DISTRICT_NOT_FOUND', `Unknown district '${input.districtSlug}'`);
        districtId = d.id;
      }
      const [place] = await t
        .insert(places)
        .values({
          cityId: city.id,
          districtId,
          kind: input.kind,
          name: input.name,
          nameNormalized: normalizeLocalized(input.name),
          address: input.address ?? null,
          lat: input.lat,
          lng: input.lng,
          website: input.website ?? null,
          trustTier: 'T1_official',
          verificationStatus: 'staff_verified',
          lastVerifiedAt: new Date(),
        })
        .returning();
      await this.audit.record(actor, 'place.create', 'place', place!.id, { after: place }, t);
      return place!;
    };
    return tx ? run(tx) : this.db.transaction(run);
  }

  async searchPlaces(q: string, limit = 10) {
    const needle = q.toLocaleLowerCase('az').trim();
    return this.db
      .select({
        id: places.id,
        name: places.name,
        kind: places.kind,
        lat: places.lat,
        lng: places.lng,
        score: sql<number>`similarity(${places.nameNormalized}, ${needle})`,
      })
      .from(places)
      .where(sql`${places.nameNormalized} % ${needle} OR ${places.nameNormalized} ILIKE ${'%' + needle + '%'}`)
      .orderBy(sql`similarity(${places.nameNormalized}, ${needle}) DESC`)
      .limit(limit);
  }

  async getPlace(id: string) {
    const [place] = await this.db.select().from(places).where(eq(places.id, id));
    if (!place || place.verificationStatus === 'pending_review' || place.verificationStatus === 'rejected') {
      throw new ProblemError(404, 'PLACE_NOT_FOUND', 'Place not found');
    }
    return place;
  }

  listCategories() {
    return this.db.select().from(categories).orderBy(asc(categories.sort));
  }

  listDistricts(citySlug: string) {
    return this.db
      .select({ id: districts.id, slug: districts.slug, name: districts.name })
      .from(districts)
      .innerJoin(cities, eq(cities.id, districts.cityId))
      .where(eq(cities.slug, citySlug))
      .orderBy(asc(districts.slug));
  }
}

@Controller('v1')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Public()
  @Get('categories')
  categories() {
    return this.catalog.listCategories();
  }

  @Public()
  @Get('cities/:slug/districts')
  districts(@Param('slug') slug: string) {
    return this.catalog.listDistricts(slug);
  }

  @Public()
  @Get('places/:id')
  place(@Param('id', ParseUUIDPipe) id: string) {
    return this.catalog.getPlace(id);
  }

  @Roles('curator')
  @Get('admin/places/search')
  search(@Query('q') q = '') {
    if (q.trim().length < 2) throw new ProblemError(400, 'QUERY_TOO_SHORT', 'Use at least 2 characters');
    return this.catalog.searchPlaces(q);
  }

  @Roles('curator')
  @Post('admin/places')
  create(@Body() body: unknown, @CurrentActor() actor: Actor) {
    return this.catalog.createPlace(newPlaceSchema.parse(body), actor);
  }
}

@Module({
  providers: [CatalogService],
  controllers: [CatalogController],
  exports: [CatalogService],
})
export class CatalogModule {}
