-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(45) NOT NULL,
    "lastName" VARCHAR(70) NOT NULL,
    "dni" INTEGER NOT NULL,
    "email" VARCHAR(80) NOT NULL,
    "birthDate" DATE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phone" INTEGER NOT NULL,
    "registrationDate" DATE NOT NULL,
    "isVerified" BOOLEAN NOT NULL,
    "address" VARCHAR(60) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."workers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "workLocation" VARCHAR(100) NOT NULL,
    "availability" VARCHAR(100) NOT NULL,
    "rating" DECIMAL(3,2) NOT NULL,
    "jobsCompleted" INTEGER NOT NULL,
    "profilePicture" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,

    CONSTRAINT "workers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."worker_categories" (
    "workerId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "isPrimary" BOOLEAN NOT NULL,
    "experienceLevel" VARCHAR(45) NOT NULL,
    "hasCertificate" BOOLEAN NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,
    "baseRate" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "worker_categories_pkey" PRIMARY KEY ("workerId","categoryId")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sponsor_categories" (
    "sponsorId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "sponsor_categories_pkey" PRIMARY KEY ("sponsorId","categoryId")
);

-- CreateTable
CREATE TABLE "public"."sponsor_workers" (
    "sponsorId" INTEGER NOT NULL,
    "workerId" INTEGER NOT NULL,
    "linkDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "sponsor_workers_pkey" PRIMARY KEY ("sponsorId","workerId")
);

-- CreateTable
CREATE TABLE "public"."sponsors" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "address" VARCHAR(45) NOT NULL,
    "phone" INTEGER NOT NULL,
    "taxId" INTEGER NOT NULL,
    "businessName" VARCHAR(45) NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sponsors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sponsor_inventory" (
    "sponsorId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "sellingPrice" INTEGER NOT NULL,
    "minSale" INTEGER NOT NULL,
    "maxSale" INTEGER NOT NULL,
    "saleUnit" VARCHAR(30) NOT NULL,

    CONSTRAINT "sponsor_inventory_pkey" PRIMARY KEY ("sponsorId","productId")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(70) NOT NULL,
    "brand" VARCHAR(45) NOT NULL,
    "volume" INTEGER NOT NULL,
    "volumeUnit" VARCHAR(30) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."job_requests" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(70) NOT NULL,
    "createdAt" DATE NOT NULL,
    "description" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "includesMaterials" BOOLEAN NOT NULL,
    "requiresVisit" BOOLEAN NOT NULL,
    "qualification" VARCHAR(45) NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "statusId" INTEGER NOT NULL,
    "attachments" VARCHAR(255) NOT NULL,
    "selectedApplicationId" INTEGER NOT NULL,

    CONSTRAINT "job_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."applications" (
    "id" SERIAL NOT NULL,
    "jobRequestId" INTEGER NOT NULL,
    "workerId" INTEGER NOT NULL,
    "submittedAt" DATE NOT NULL,
    "budget" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "materials" VARCHAR(255) NOT NULL,
    "budgetFile" VARCHAR(255) NOT NULL,
    "visitDate" DATE NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."job_request_statuses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(45) NOT NULL,

    CONSTRAINT "job_request_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workers_userId_key" ON "public"."workers"("userId");

-- AddForeignKey
ALTER TABLE "public"."workers" ADD CONSTRAINT "workers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."worker_categories" ADD CONSTRAINT "worker_categories_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "public"."workers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."worker_categories" ADD CONSTRAINT "worker_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sponsor_categories" ADD CONSTRAINT "sponsor_categories_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "public"."sponsors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sponsor_categories" ADD CONSTRAINT "sponsor_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sponsor_workers" ADD CONSTRAINT "sponsor_workers_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "public"."sponsors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sponsor_workers" ADD CONSTRAINT "sponsor_workers_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "public"."workers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sponsor_inventory" ADD CONSTRAINT "sponsor_inventory_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "public"."sponsors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sponsor_inventory" ADD CONSTRAINT "sponsor_inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."job_requests" ADD CONSTRAINT "job_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."job_requests" ADD CONSTRAINT "job_requests_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "public"."job_request_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."applications" ADD CONSTRAINT "applications_jobRequestId_fkey" FOREIGN KEY ("jobRequestId") REFERENCES "public"."job_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."applications" ADD CONSTRAINT "applications_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "public"."workers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
