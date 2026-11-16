CREATE EXTENSION IF NOT EXISTS postgis;--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS pg_trgm;--> statement-breakpoint
CREATE TYPE "public"."automation_level" AS ENUM('L0', 'L1', 'L2', 'L3', 'L4');--> statement-breakpoint
CREATE TYPE "public"."availability" AS ENUM('unknown', 'available', 'sold_out', 'unavailable');--> statement-breakpoint
CREATE TYPE "public"."connector_type" AS ENUM('manual_entry', 'organizer_portal', 'ics_feed', 'rss_feed', 'structured_web', 'instagram_owned_account', 'partner_feed', 'osm_import', 'telegram_channel_bot', 'email_ingest');--> statement-breakpoint
CREATE TYPE "public"."lifecycle_status" AS ENUM('scheduled', 'postponed', 'cancelled', 'ended');--> statement-breakpoint
CREATE TYPE "public"."place_kind" AS ENUM('venue', 'cinema', 'cafe', 'restaurant', 'park', 'museum', 'gallery', 'bike_station', 'landmark', 'other');--> statement-breakpoint
CREATE TYPE "public"."provenance_method" AS ENUM('partner', 'parser', 'llm', 'human');--> statement-breakpoint
CREATE TYPE "public"."review_decision" AS ENUM('approve', 'edit', 'merge', 'reject');--> statement-breakpoint
CREATE TYPE "public"."review_task_status" AS ENUM('open', 'done', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."review_task_type" AS ENUM('new_item', 'possible_duplicate', 'field_conflict', 'lifecycle_signal', 'audit', 'organizer_claim', 'report');--> statement-breakpoint
CREATE TYPE "public"."source_status" AS ENUM('proposed', 'under_review', 'approved', 'suspended', 'retired');--> statement-breakpoint
CREATE TYPE "public"."trust_tier" AS ENUM('T1_official', 'T2_partner', 'T3_organizer_submitted', 'T4_community_submitted', 'T5_ai_extracted');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('pending_review', 'auto_approved', 'staff_verified', 'rejected');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"actor_id" text NOT NULL,
	"actor_role" text NOT NULL,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"before" jsonb,
	"after" jsonb,
	"at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" jsonb NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" jsonb NOT NULL,
	"timezone" text DEFAULT 'Asia/Baku' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "cities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "districts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"city_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"name" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_categories" (
	"event_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT "event_categories_event_id_category_id_pk" PRIMARY KEY("event_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"city_id" uuid NOT NULL,
	"organizer_id" uuid,
	"primary_place_id" uuid,
	"title" jsonb NOT NULL,
	"description" jsonb,
	"original_locale" text,
	"title_normalized" text NOT NULL,
	"ticket_url" text,
	"price_min" numeric(10, 2),
	"price_max" numeric(10, 2),
	"currency" text,
	"is_free" boolean,
	"event_language" text,
	"trust_tier" "trust_tier" NOT NULL,
	"verification_status" "verification_status" DEFAULT 'pending_review' NOT NULL,
	"lifecycle_status" "lifecycle_status" DEFAULT 'scheduled' NOT NULL,
	"availability" "availability" DEFAULT 'unknown' NOT NULL,
	"source_id" uuid,
	"source_item_id" uuid,
	"source_url" text,
	"last_verified_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "events_published_requires_verification" CHECK ("events"."published_at" IS NULL OR "events"."verification_status" IN ('auto_approved','staff_verified'))
);
--> statement-breakpoint
CREATE TABLE "field_provenance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"field" text NOT NULL,
	"method" "provenance_method" NOT NULL,
	"source_item_id" uuid,
	"evidence" text,
	"confidence" real,
	"derived" boolean DEFAULT false NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"verified_by" text,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "occurrences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"place_id" uuid NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone,
	"time_unknown" boolean DEFAULT false NOT NULL,
	"lifecycle_status" "lifecycle_status" DEFAULT 'scheduled' NOT NULL,
	"availability" "availability" DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "occurrences_end_after_start" CHECK ("occurrences"."ends_at" IS NULL OR "occurrences"."ends_at" > "occurrences"."starts_at")
);
--> statement-breakpoint
CREATE TABLE "organizer_members" (
	"organizer_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'editor' NOT NULL,
	CONSTRAINT "organizer_members_organizer_id_user_id_pk" PRIMARY KEY("organizer_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "organizers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" jsonb NOT NULL,
	"website" text,
	"instagram_handle" text,
	"verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "places" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"city_id" uuid NOT NULL,
	"district_id" uuid,
	"kind" "place_kind" DEFAULT 'venue' NOT NULL,
	"name" jsonb NOT NULL,
	"name_normalized" text NOT NULL,
	"address" jsonb,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"location" geography(Point,4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography) STORED,
	"website" text,
	"trust_tier" "trust_tier" DEFAULT 'T1_official' NOT NULL,
	"verification_status" "verification_status" DEFAULT 'pending_review' NOT NULL,
	"last_verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "places_lat_range" CHECK ("places"."lat" BETWEEN -90 AND 90),
	CONSTRAINT "places_lng_range" CHECK ("places"."lng" BETWEEN -180 AND 180)
);
--> statement-breakpoint
CREATE TABLE "review_decisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"decision" "review_decision" NOT NULL,
	"reason_code" text,
	"note" text,
	"diff" jsonb,
	"decided_by" text NOT NULL,
	"decided_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "review_task_type" NOT NULL,
	"status" "review_task_status" DEFAULT 'open' NOT NULL,
	"priority" integer DEFAULT 50 NOT NULL,
	"source_item_id" uuid,
	"event_id" uuid,
	"summary" text NOT NULL,
	"due_at" timestamp with time zone,
	"opened_at" timestamp with time zone DEFAULT now() NOT NULL,
	"closed_at" timestamp with time zone,
	"handling_seconds" integer
);
--> statement-breakpoint
CREATE TABLE "source_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" uuid NOT NULL,
	"external_id" text,
	"url" text,
	"published_at" timestamp with time zone,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"raw_text" text,
	"content_hash" text NOT NULL,
	"submitted_by" text,
	"collected_at" timestamp with time zone DEFAULT now() NOT NULL,
	"purge_after" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"connector_type" "connector_type" NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "source_status" DEFAULT 'proposed' NOT NULL,
	"default_trust_tier" "trust_tier" NOT NULL,
	"automation_level" "automation_level" DEFAULT 'L1' NOT NULL,
	"automation_approved_by" text,
	"automation_approved_at" timestamp with time zone,
	"legal_basis" text,
	"evidence_ref" text,
	"attribution" text,
	"retention_days" integer DEFAULT 90 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sources_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "districts" ADD CONSTRAINT "districts_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_categories" ADD CONSTRAINT "event_categories_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_categories" ADD CONSTRAINT "event_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_organizer_id_organizers_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."organizers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_primary_place_id_places_id_fk" FOREIGN KEY ("primary_place_id") REFERENCES "public"."places"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_source_item_id_source_items_id_fk" FOREIGN KEY ("source_item_id") REFERENCES "public"."source_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "field_provenance" ADD CONSTRAINT "field_provenance_source_item_id_source_items_id_fk" FOREIGN KEY ("source_item_id") REFERENCES "public"."source_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "occurrences" ADD CONSTRAINT "occurrences_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "occurrences" ADD CONSTRAINT "occurrences_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizer_members" ADD CONSTRAINT "organizer_members_organizer_id_organizers_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."organizers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "places" ADD CONSTRAINT "places_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "places" ADD CONSTRAINT "places_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_decisions" ADD CONSTRAINT "review_decisions_task_id_review_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."review_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_tasks" ADD CONSTRAINT "review_tasks_source_item_id_source_items_id_fk" FOREIGN KEY ("source_item_id") REFERENCES "public"."source_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_tasks" ADD CONSTRAINT "review_tasks_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_items" ADD CONSTRAINT "source_items_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE UNIQUE INDEX "districts_city_slug_uq" ON "districts" USING btree ("city_id","slug");--> statement-breakpoint
CREATE INDEX "events_city_status_idx" ON "events" USING btree ("city_id","verification_status","lifecycle_status");--> statement-breakpoint
CREATE INDEX "events_title_trgm" ON "events" USING gin ("title_normalized" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "field_provenance_entity_idx" ON "field_provenance" USING btree ("entity_type","entity_id","field");--> statement-breakpoint
CREATE INDEX "occurrences_starts_idx" ON "occurrences" USING btree ("starts_at");--> statement-breakpoint
CREATE INDEX "occurrences_place_starts_idx" ON "occurrences" USING btree ("place_id","starts_at");--> statement-breakpoint
CREATE INDEX "places_location_gist" ON "places" USING gist ("location");--> statement-breakpoint
CREATE INDEX "places_name_trgm" ON "places" USING gin ("name_normalized" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "review_tasks_status_priority_idx" ON "review_tasks" USING btree ("status","priority");--> statement-breakpoint
CREATE UNIQUE INDEX "source_items_source_hash_uq" ON "source_items" USING btree ("source_id","content_hash");