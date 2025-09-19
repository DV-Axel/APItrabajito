-- AddForeignKey
ALTER TABLE "public"."job_requests" ADD CONSTRAINT "job_requests_serviceKey_fkey" FOREIGN KEY ("serviceKey") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
