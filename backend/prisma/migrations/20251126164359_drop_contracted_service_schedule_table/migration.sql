/*
  Warnings:

  - You are about to drop the `contracted_service_date` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `date` to the `contracted_service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "contracted_service_date" DROP CONSTRAINT "contracted_service_date_contracted_service_id_fkey";

-- DropForeignKey
ALTER TABLE "contracted_service_date" DROP CONSTRAINT "contracted_service_date_schedule_id_fkey";

-- AlterTable
ALTER TABLE "contracted_service" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "contracted_service_date";
