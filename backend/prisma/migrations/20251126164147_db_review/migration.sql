/*
  Warnings:

  - You are about to drop the column `service_variant_id` on the `contracted_service` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `contracted_service_date` table. All the data in the column will be lost.
  - You are about to drop the column `service_schedule_id` on the `contracted_service_date` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `contracted_service_date` table. All the data in the column will be lost.
  - You are about to drop the `service_schedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_variant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `variant_id` to the `contracted_service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end` to the `contracted_service_date` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedule_id` to the `contracted_service_date` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `contracted_service_date` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "contracted_service" DROP CONSTRAINT "contracted_service_service_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "contracted_service_date" DROP CONSTRAINT "contracted_service_date_service_schedule_id_fkey";

-- DropForeignKey
ALTER TABLE "service_schedule" DROP CONSTRAINT "service_schedule_provider_service_id_fkey";

-- DropForeignKey
ALTER TABLE "service_variant" DROP CONSTRAINT "service_variant_provider_service_id_fkey";

-- AlterTable
ALTER TABLE "contracted_service" DROP COLUMN "service_variant_id",
ADD COLUMN     "variant_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "contracted_service_date" DROP COLUMN "end_time",
DROP COLUMN "service_schedule_id",
DROP COLUMN "start_time",
ADD COLUMN     "end" TIME NOT NULL,
ADD COLUMN     "schedule_id" TEXT NOT NULL,
ADD COLUMN     "start" TIME NOT NULL;

-- DropTable
DROP TABLE "service_schedule";

-- DropTable
DROP TABLE "service_variant";

-- CreateTable
CREATE TABLE "variant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "provider_service_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule" (
    "id" TEXT NOT NULL,
    "weekday" INTEGER[],
    "start" TIME NOT NULL,
    "end" TIME NOT NULL,
    "provider_service_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "schedule_provider_service_id_weekday_key" ON "schedule"("provider_service_id", "weekday");

-- AddForeignKey
ALTER TABLE "variant" ADD CONSTRAINT "variant_provider_service_id_fkey" FOREIGN KEY ("provider_service_id") REFERENCES "provider_service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_provider_service_id_fkey" FOREIGN KEY ("provider_service_id") REFERENCES "provider_service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracted_service" ADD CONSTRAINT "contracted_service_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracted_service_date" ADD CONSTRAINT "contracted_service_date_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
