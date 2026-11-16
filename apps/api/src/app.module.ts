import { Controller, Get, Inject, Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { sql } from 'drizzle-orm';
import { AuthGuard, Public } from './common/auth';
import { ProblemDetailsFilter } from './common/problem.filter';
import { CoreModule } from './core.module';
import { DB, type Db } from './db/client';
import { CatalogModule } from './modules/catalog/catalog.module';
import { EventsModule } from './modules/events/events.module';
import { OrganizerModule } from './modules/organizer/organizer.module';
import { ReviewModule } from './modules/review/review.module';
import { SourcesModule } from './modules/sources/sources.module';

@Controller('v1/health')
class HealthController {
  constructor(@Inject(DB) private readonly db: Db) {}

  @Public()
  @Get()
  async health() {
    await this.db.execute(sql`SELECT 1`);
    return { status: 'ok', db: 'ok' };
  }
}

@Module({
  imports: [CoreModule, CatalogModule, SourcesModule, EventsModule, OrganizerModule, ReviewModule],
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_FILTER, useClass: ProblemDetailsFilter },
  ],
})
export class AppModule {}
