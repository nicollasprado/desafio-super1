-- AlterTable
ALTER TABLE "contracted_service" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "provider_service" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "service_schedule" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "service_variants" ADD COLUMN     "deleted_at" TIMESTAMP(3);
