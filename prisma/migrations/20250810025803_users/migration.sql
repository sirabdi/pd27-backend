/*
  Warnings:

  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsersVerification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."UsersVerification" DROP CONSTRAINT "UsersVerification_user_id_fkey";

-- DropTable
DROP TABLE "public"."Users";

-- DropTable
DROP TABLE "public"."UsersVerification";

-- CreateTable
CREATE TABLE "public"."users" (
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

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users_verification" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "verification_code" TEXT,
    "verification_code_expires" TIMESTAMP(3),
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_nik_key" ON "public"."users"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "public"."users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_address_key" ON "public"."users"("address");

-- CreateIndex
CREATE UNIQUE INDEX "users_verification_user_id_key" ON "public"."users_verification"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_verification_verification_code_key" ON "public"."users_verification"("verification_code");

-- AddForeignKey
ALTER TABLE "public"."users_verification" ADD CONSTRAINT "users_verification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
