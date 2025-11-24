-- CreateEnum
CREATE TYPE "SERVICE_STATUS" AS ENUM ('PAYMENT_PENDING', 'WAITING_CONFIRMATION', 'SCHEDULED', 'ONGOING', 'FINISHED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service" (
    "id" TEXT NOT NULL,

    CONSTRAINT "service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_service" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_variants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "provider_service_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracted_service" (
    "id" TEXT NOT NULL,
    "status" "SERVICE_STATUS" NOT NULL,
    "total_price" INTEGER NOT NULL,
    "contractor_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contracted_service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_schedule" (
    "id" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "provider_service_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracted_service_date" (
    "id" TEXT NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "service_schedule_id" TEXT NOT NULL,
    "contracted_service_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contracted_service_date_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "service_schedule_provider_service_id_weekday_key" ON "service_schedule"("provider_service_id", "weekday");

-- AddForeignKey
ALTER TABLE "provider_service" ADD CONSTRAINT "provider_service_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_service" ADD CONSTRAINT "provider_service_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_variants" ADD CONSTRAINT "service_variants_provider_service_id_fkey" FOREIGN KEY ("provider_service_id") REFERENCES "provider_service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracted_service" ADD CONSTRAINT "contracted_service_contractor_id_fkey" FOREIGN KEY ("contractor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_schedule" ADD CONSTRAINT "service_schedule_provider_service_id_fkey" FOREIGN KEY ("provider_service_id") REFERENCES "provider_service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracted_service_date" ADD CONSTRAINT "contracted_service_date_service_schedule_id_fkey" FOREIGN KEY ("service_schedule_id") REFERENCES "service_schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracted_service_date" ADD CONSTRAINT "contracted_service_date_contracted_service_id_fkey" FOREIGN KEY ("contracted_service_id") REFERENCES "contracted_service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
