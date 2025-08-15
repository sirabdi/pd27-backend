/*
  Warnings:

  - A unique constraint covering the columns `[reset_password_token]` on the table `user_verification` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."user_verification" ADD COLUMN     "reset_password_expires" TIMESTAMP(3),
ADD COLUMN     "reset_password_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_verification_reset_password_token_key" ON "public"."user_verification"("reset_password_token");
