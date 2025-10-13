-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(45) NOT NULL,
    "lastName" VARCHAR(70) NOT NULL,
    "dni" VARCHAR(15) NOT NULL,
    "idType" TEXT NOT NULL,
    "email" VARCHAR(80) NOT NULL,
    "birthDate" DATE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phone" INTEGER NOT NULL,
    "registrationDate" DATE NOT NULL,
    "isVerified" BOOLEAN NOT NULL,
    "address" VARCHAR(60) NOT NULL,
    "number" VARCHAR(10) NOT NULL,
    "postalCode" VARCHAR(10) NOT NULL,
    "departmentNumber" VARCHAR(10),
    "profilePicture" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workers" (
    "id" SERIAL NOT NULL,
    "subtitle" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "workLocation" JSONB NOT NULL,
    "workingDays" JSONB NOT NULL,
    "workingHours" JSONB NOT NULL,
    "rating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "jobsCompleted" INTEGER NOT NULL DEFAULT 0,
    "profilePicture" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "extraData" JSONB,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "workers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_categories" (
    "workerId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "hasCertificate" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "worker_categories_pkey" PRIMARY KEY ("workerId","categoryId")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsor_categories" (
    "sponsorId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "sponsor_categories_pkey" PRIMARY KEY ("sponsorId","categoryId")
);

-- CreateTable
CREATE TABLE "sponsor_workers" (
    "sponsorId" INTEGER NOT NULL,
    "workerId" INTEGER NOT NULL,
    "linkDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sponsor_workers_pkey" PRIMARY KEY ("sponsorId","workerId")
);

-- CreateTable
CREATE TABLE "sponsors" (
    "id" SERIAL NOT NULL,
    "tradeName" VARCHAR(45) NOT NULL,
    "address" VARCHAR(45) NOT NULL,
    "phone" INTEGER NOT NULL,
    "cuilId" BIGINT NOT NULL,
    "businessName" VARCHAR(45) NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(80) NOT NULL,
    "alternativeEmail" VARCHAR(80) NOT NULL,
    "contactName" VARCHAR(70) NOT NULL,
    "aditionalInformation" TEXT,
    "logo" TEXT,
    "companyRegistration" TEXT NOT NULL,
    "social" JSONB,
    "workingHours" JSONB,
    "workingDays" JSONB,

    CONSTRAINT "sponsors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsor_inventory" (
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
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(70) NOT NULL,
    "brand" VARCHAR(45) NOT NULL,
    "volume" INTEGER NOT NULL,
    "volumeUnit" VARCHAR(30) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_requests" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(70) NOT NULL,
    "urgency" BOOLEAN NOT NULL,
    "jobCreationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "address" JSONB NOT NULL,
    "propertyType" TEXT NOT NULL,
    "floor" TEXT,
    "aparmentNumber" TEXT,
    "position" JSONB NOT NULL,
    "extraData" JSONB,
    "photos" JSONB,
    "userId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    "serviceKey" INTEGER NOT NULL,
    "applicationSelectedId" INTEGER,

    CONSTRAINT "job_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statuses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(45) NOT NULL,

    CONSTRAINT "statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" SERIAL NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "budget" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "requireVisit" BOOLEAN NOT NULL,
    "jobRequestId" INTEGER NOT NULL,
    "workerId" INTEGER NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "workers_userId_key" ON "workers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "sponsors_email_key" ON "sponsors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sponsors_alternativeEmail_key" ON "sponsors"("alternativeEmail");

-- CreateIndex
CREATE UNIQUE INDEX "job_requests_applicationSelectedId_key" ON "job_requests"("applicationSelectedId");

-- CreateIndex
CREATE UNIQUE INDEX "statuses_name_key" ON "statuses"("name");

-- AddForeignKey
ALTER TABLE "workers" ADD CONSTRAINT "workers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_categories" ADD CONSTRAINT "worker_categories_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_categories" ADD CONSTRAINT "worker_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsor_categories" ADD CONSTRAINT "sponsor_categories_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "sponsors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsor_categories" ADD CONSTRAINT "sponsor_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsor_workers" ADD CONSTRAINT "sponsor_workers_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "sponsors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsor_workers" ADD CONSTRAINT "sponsor_workers_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsor_inventory" ADD CONSTRAINT "sponsor_inventory_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "sponsors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsor_inventory" ADD CONSTRAINT "sponsor_inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_requests" ADD CONSTRAINT "job_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_requests" ADD CONSTRAINT "job_requests_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_requests" ADD CONSTRAINT "job_requests_serviceKey_fkey" FOREIGN KEY ("serviceKey") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_requests" ADD CONSTRAINT "job_requests_applicationSelectedId_fkey" FOREIGN KEY ("applicationSelectedId") REFERENCES "applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_jobRequestId_fkey" FOREIGN KEY ("jobRequestId") REFERENCES "job_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
