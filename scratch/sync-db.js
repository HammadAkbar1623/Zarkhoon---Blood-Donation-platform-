import "dotenv/config";
import pg from "pg";

const { Client } = pg;

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;

async function sync() {
  console.log("Connecting to Supabase PostgreSQL...", connectionString);
  const client = new Client({ connectionString });
  await client.connect();

  console.log("Creating enum types and tables...");

  const sql = `
    -- Create Enums if not exist
    DO $$ BEGIN
        CREATE TYPE "UrgencyLevel" AS ENUM ('EMERGENCY', 'NORMAL');
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
        CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ARRANGED', 'COMPLETED', 'CANCELLED');
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
        CREATE TYPE "AcceptanceStatus" AS ENUM ('ACCEPTED', 'FULFILLED', 'CANCELLED');
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;

    -- User Table
    CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "phone" TEXT,
        "bloodGroup" TEXT NOT NULL,
        "latitude" DOUBLE PRECISION,
        "longitude" DOUBLE PRECISION,
        "address" TEXT,
        "isAvailable" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

    -- BloodRequest Table
    CREATE TABLE IF NOT EXISTS "BloodRequest" (
        "id" TEXT NOT NULL,
        "requesterId" TEXT NOT NULL,
        "patientName" TEXT NOT NULL,
        "bloodGroup" TEXT NOT NULL,
        "unitsNeeded" INTEGER NOT NULL DEFAULT 1,
        "hospitalName" TEXT NOT NULL,
        "address" TEXT NOT NULL,
        "latitude" DOUBLE PRECISION NOT NULL,
        "longitude" DOUBLE PRECISION NOT NULL,
        "contactNumber" TEXT NOT NULL,
        "urgency" "UrgencyLevel" NOT NULL DEFAULT 'EMERGENCY',
        "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "BloodRequest_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "BloodRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );

    -- RequestAcceptance Table
    CREATE TABLE IF NOT EXISTS "RequestAcceptance" (
        "id" TEXT NOT NULL,
        "requestId" TEXT NOT NULL,
        "donorId" TEXT NOT NULL,
        "status" "AcceptanceStatus" NOT NULL DEFAULT 'ACCEPTED',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "RequestAcceptance_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "RequestAcceptance_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "BloodRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "RequestAcceptance_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "RequestAcceptance_requestId_donorId_key" ON "RequestAcceptance"("requestId", "donorId");

    -- Notification Table
    CREATE TABLE IF NOT EXISTS "Notification" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "requestId" TEXT,
        "title" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "isRead" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Notification_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "BloodRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE
    );
  `;

  await client.query(sql);
  console.log("✅ All tables created successfully in Supabase database!");
  await client.end();
}

sync().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
