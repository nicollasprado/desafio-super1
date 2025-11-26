/*
  Warnings:

  - You are about to drop the column `weekday` on the `schedule` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider_service_id,weekdays]` on the table `schedule` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "schedule_provider_service_id_weekday_key";

-- AlterTable
ALTER TABLE "schedule" DROP COLUMN "weekday",
ADD COLUMN     "weekdays" INTEGER[];

-- CreateIndex
CREATE UNIQUE INDEX "schedule_provider_service_id_weekdays_key" ON "schedule"("provider_service_id", "weekdays");
