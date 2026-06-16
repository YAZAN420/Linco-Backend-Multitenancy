-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "DemoMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
