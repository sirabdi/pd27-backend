/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users_verification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."users_verification" DROP CONSTRAINT "users_verification_user_id_fkey";

-- DropTable
DROP TABLE "public"."users";

-- DropTable
DROP TABLE "public"."users_verification";

-- CreateTable
CREATE TABLE "public"."user" (
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

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_verification" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "verification_code" TEXT,
    "verification_code_expires" TIMESTAMP(3),
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_nik_key" ON "public"."user"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "public"."user"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "user_address_key" ON "public"."user"("address");

-- CreateIndex
CREATE UNIQUE INDEX "user_verification_user_id_key" ON "public"."user_verification"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_verification_verification_code_key" ON "public"."user_verification"("verification_code");

-- AddForeignKey
ALTER TABLE "public"."user_verification" ADD CONSTRAINT "user_verification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
