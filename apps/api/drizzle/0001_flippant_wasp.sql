ALTER TABLE "sources" ADD COLUMN "is_synthetic" boolean DEFAULT false NOT NULL;--> statement-breakpoint
UPDATE "sources" SET "is_synthetic" = true WHERE "code" = 'DS-003';
