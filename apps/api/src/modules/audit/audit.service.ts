import { Inject, Injectable } from '@nestjs/common';
import type { Actor } from '../../common/auth';
import { DB, type Db } from '../../db/client';
import { auditLogs } from '../../db/schema';

type Tx = Parameters<Parameters<Db['transaction']>[0]>[0];

@Injectable()
export class AuditService {
  constructor(@Inject(DB) private readonly db: Db) {}

  /** Append-only audit record. Pass a transaction to keep it atomic with the change. */
  async record(
    actor: Actor,
    action: string,
    entityType: string,
    entityId: string | null,
    change: { before?: unknown; after?: unknown } = {},
    tx?: Tx,
  ): Promise<void> {
    await (tx ?? this.db).insert(auditLogs).values({
      actorId: actor.id,
      actorRole: actor.role,
      action,
      entityType,
      entityId,
      before: change.before ?? null,
      after: change.after ?? null,
    });
  }
}
