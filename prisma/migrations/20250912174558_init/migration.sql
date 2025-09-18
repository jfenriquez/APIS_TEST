-- CreateTable
CREATE TABLE "public"."Scientist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "deathDate" TIMESTAMP(3),
    "nationality" TEXT,
    "biography" TEXT NOT NULL,
    "fieldId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Scientist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ScienceField" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ScienceField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Discovery" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "year" INTEGER,
    "scientistId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Discovery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FunFact" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "source" TEXT,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FunFact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FunFactCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FunFactCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Command" (
    "id" SERIAL NOT NULL,
    "command" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "example" TEXT,
    "osId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Command_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OperatingSystem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "OperatingSystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Shortcut" (
    "id" SERIAL NOT NULL,
    "keys" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "osId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shortcut_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Scientist" ADD CONSTRAINT "Scientist_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "public"."ScienceField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Discovery" ADD CONSTRAINT "Discovery_scientistId_fkey" FOREIGN KEY ("scientistId") REFERENCES "public"."Scientist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FunFact" ADD CONSTRAINT "FunFact_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."FunFactCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Command" ADD CONSTRAINT "Command_osId_fkey" FOREIGN KEY ("osId") REFERENCES "public"."OperatingSystem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Shortcut" ADD CONSTRAINT "Shortcut_osId_fkey" FOREIGN KEY ("osId") REFERENCES "public"."OperatingSystem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
