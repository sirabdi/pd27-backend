-- DropIndex
DROP INDEX "public"."user_reset_password_token_reset_password_token_key";

-- AlterTable
ALTER TABLE "public"."user_reset_password_token" ALTER COLUMN "reset_password_token" DROP NOT NULL;
