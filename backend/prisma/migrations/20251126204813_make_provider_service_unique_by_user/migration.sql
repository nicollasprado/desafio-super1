/*
  Warnings:

  - A unique constraint covering the columns `[provider_id,service_id]` on the table `provider_service` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[provider_service_id,name]` on the table `variant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "provider_service_provider_id_service_id_key" ON "provider_service"("provider_id", "service_id");

-- CreateIndex
CREATE UNIQUE INDEX "variant_provider_service_id_name_key" ON "variant"("provider_service_id", "name");
