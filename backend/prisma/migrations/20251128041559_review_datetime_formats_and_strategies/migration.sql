/*
  Warnings:

  - You are about to drop the column `weekdays` on the `schedule` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider_service_id,weekday]` on the table `schedule` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `end` to the `contracted_service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `contracted_service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekday` to the `schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "schedule_provider_service_id_weekdays_key";

-- AlterTable
ALTER TABLE "contracted_service" ADD COLUMN     "end" TEXT NOT NULL,
ADD COLUMN     "start" TEXT NOT NULL,
ALTER COLUMN "date" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "schedule" DROP COLUMN "weekdays",
ADD COLUMN     "weekday" INTEGER NOT NULL,
ALTER COLUMN "start" SET DATA TYPE TEXT,
ALTER COLUMN "end" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "schedule_provider_service_id_weekday_key" ON "schedule"("provider_service_id", "weekday");
