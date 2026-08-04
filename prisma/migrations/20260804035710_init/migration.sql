-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "fullname" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refreshtoken" TEXT,
    "dob" TIMESTAMP(3),
    "avatar" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "post" TEXT NOT NULL,
    "description" TEXT,
    "companyname" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expaireAT" TIMESTAMP(3) NOT NULL,
    "postedbyid" TEXT NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aplication" (
    "id" TEXT NOT NULL,
    "jobid" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "educationdetails" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "yearofcomplition" TEXT NOT NULL,
    "college" TEXT NOT NULL,
    "proof" TEXT NOT NULL,

    CONSTRAINT "educationdetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expirience" (
    "id" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT NOT NULL,
    "proof" TEXT NOT NULL,
    "company" TEXT NOT NULL,

    CONSTRAINT "expirience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requirement" (
    "id" TEXT NOT NULL,
    "skills" TEXT[],
    "expirience" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "requirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "skill" TEXT NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "aplication_jobid_userid_key" ON "aplication"("jobid", "userid");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_postedbyid_fkey" FOREIGN KEY ("postedbyid") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aplication" ADD CONSTRAINT "aplication_jobid_fkey" FOREIGN KEY ("jobid") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aplication" ADD CONSTRAINT "aplication_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "educationdetails" ADD CONSTRAINT "educationdetails_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
