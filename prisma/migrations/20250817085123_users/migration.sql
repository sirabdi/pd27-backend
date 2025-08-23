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
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_verification" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "verification_code" TEXT,
    "verification_code_expires" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_refresh_token" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_reset_password_token" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "reset_password_token" TEXT NOT NULL,
    "reset_password_expires" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_reset_password_token_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "user_verification_user_id_key" ON "public"."user_verification"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_verification_verification_code_key" ON "public"."user_verification"("verification_code");

-- CreateIndex
CREATE UNIQUE INDEX "user_refresh_token_user_id_key" ON "public"."user_refresh_token"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_refresh_token_token_key" ON "public"."user_refresh_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_reset_password_token_user_id_key" ON "public"."user_reset_password_token"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_reset_password_token_reset_password_token_key" ON "public"."user_reset_password_token"("reset_password_token");

-- AddForeignKey
ALTER TABLE "public"."user_verification" ADD CONSTRAINT "user_verification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_refresh_token" ADD CONSTRAINT "user_refresh_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_reset_password_token" ADD CONSTRAINT "user_reset_password_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
