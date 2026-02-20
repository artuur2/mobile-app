-- CreateTable
CREATE TABLE "revoked_refresh_tokens" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "revokedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revoked_refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "revoked_refresh_tokens_tokenHash_key" ON "revoked_refresh_tokens"("tokenHash");

-- AddForeignKey
ALTER TABLE "revoked_refresh_tokens"
ADD CONSTRAINT "revoked_refresh_tokens_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
