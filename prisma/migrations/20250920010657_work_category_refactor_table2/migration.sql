-- AlterTable
ALTER TABLE "public"."sponsor_workers" ALTER COLUMN "isActive" SET DEFAULT false;

-- AlterTable
ALTER TABLE "public"."worker_categories" ALTER COLUMN "hasCertificate" SET DEFAULT false,
ALTER COLUMN "isActive" SET DEFAULT false;
