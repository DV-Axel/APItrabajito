-- AlterTable
ALTER TABLE "job_requests" ADD COLUMN     "agreementUser" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "agreementWorker" BOOLEAN NOT NULL DEFAULT false;
