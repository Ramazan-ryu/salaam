import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import type { Pool } from 'pg';
import { CONFIG, loadConfig } from './config';
import { createDb, createPool, DB, POOL } from './db/client';
import { AuditService } from './modules/audit/audit.service';

@Global()
@Module({
  providers: [
    { provide: CONFIG, useFactory: () => loadConfig() },
    { provide: POOL, inject: [CONFIG], useFactory: (c: ReturnType<typeof loadConfig>) => createPool(c.DATABASE_URL) },
    { provide: DB, inject: [POOL], useFactory: (pool: Pool) => createDb(pool) },
    AuditService,
  ],
  exports: [CONFIG, POOL, DB, AuditService],
})
export class CoreModule implements OnApplicationShutdown {
  constructor(@Inject(POOL) private readonly pool: Pool) {}

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}
