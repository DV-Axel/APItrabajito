-- AlterTable
ALTER TABLE "job_requests" ADD COLUMN     "finalBudget" DECIMAL(65,30) DEFAULT 0,
ADD COLUMN     "workFinishedUser" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "workFinishedWorker" BOOLEAN NOT NULL DEFAULT false;
