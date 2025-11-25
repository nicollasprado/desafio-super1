/*
  Warnings:

  - You are about to drop the `service_variants` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `service_variant_id` to the `contracted_service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "service_variants" DROP CONSTRAINT "service_variants_provider_service_id_fkey";

-- AlterTable
ALTER TABLE "contracted_service" ADD COLUMN     "service_variant_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "service_variants";

-- CreateTable
CREATE TABLE "service_variant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "provider_service_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "service_variant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "service_variant" ADD CONSTRAINT "service_variant_provider_service_id_fkey" FOREIGN KEY ("provider_service_id") REFERENCES "provider_service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracted_service" ADD CONSTRAINT "contracted_service_service_variant_id_fkey" FOREIGN KEY ("service_variant_id") REFERENCES "service_variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
