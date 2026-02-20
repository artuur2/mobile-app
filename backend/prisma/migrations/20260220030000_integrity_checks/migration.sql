-- CreateTable
CREATE TABLE "integrity_checks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "decision" TEXT NOT NULL,
    "basicIntegrity" BOOLEAN NOT NULL,
    "deviceIntegrity" BOOLEAN NOT NULL,
    "strongIntegrity" BOOLEAN,
    "tokenSnippet" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "integrity_checks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "integrity_checks_userId_checkedAt_idx"
ON "integrity_checks"("userId", "checkedAt");

-- AddForeignKey
ALTER TABLE "integrity_checks"
ADD CONSTRAINT "integrity_checks_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
