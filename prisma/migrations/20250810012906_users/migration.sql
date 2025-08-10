/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."users";

-- CreateTable
CREATE TABLE "public"."Users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_picture" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UsersVerification" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "verification_code" TEXT NOT NULL,
    "verification_code_expires" TIMESTAMP(3) NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsersVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "public"."Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_nik_key" ON "public"."Users"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "public"."Users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Users_address_key" ON "public"."Users"("address");

-- CreateIndex
CREATE UNIQUE INDEX "UsersVerification_user_id_key" ON "public"."UsersVerification"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UsersVerification_verification_code_key" ON "public"."UsersVerification"("verification_code");

-- AddForeignKey
ALTER TABLE "public"."UsersVerification" ADD CONSTRAINT "UsersVerification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
