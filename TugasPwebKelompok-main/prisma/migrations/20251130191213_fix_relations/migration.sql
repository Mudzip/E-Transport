/*
  Warnings:

  - Made the column `userId` on table `FavoriteRoute` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `SearchHistory` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "className" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookingId" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "paidAmount" INTEGER NOT NULL,
    "paidAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FavoriteRoute" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "originStationId" INTEGER NOT NULL,
    "destinationStationId" INTEGER NOT NULL,
    CONSTRAINT "FavoriteRoute_originStationId_fkey" FOREIGN KEY ("originStationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FavoriteRoute_destinationStationId_fkey" FOREIGN KEY ("destinationStationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FavoriteRoute" ("destinationStationId", "id", "originStationId", "userId") SELECT "destinationStationId", "id", "originStationId", "userId" FROM "FavoriteRoute";
DROP TABLE "FavoriteRoute";
ALTER TABLE "new_FavoriteRoute" RENAME TO "FavoriteRoute";
CREATE TABLE "new_SearchHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "searchDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "originStationId" INTEGER NOT NULL,
    "destinationStationId" INTEGER NOT NULL,
    CONSTRAINT "SearchHistory_originStationId_fkey" FOREIGN KEY ("originStationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SearchHistory_destinationStationId_fkey" FOREIGN KEY ("destinationStationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SearchHistory" ("destinationStationId", "id", "originStationId", "searchDate", "userId") SELECT "destinationStationId", "id", "originStationId", "searchDate", "userId" FROM "SearchHistory";
DROP TABLE "SearchHistory";
ALTER TABLE "new_SearchHistory" RENAME TO "SearchHistory";
CREATE TABLE "new_Station" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "stationType" TEXT NOT NULL
);
INSERT INTO "new_Station" ("city", "code", "id", "name", "stationType") SELECT "city", "code", "id", "name", "stationType" FROM "Station";
DROP TABLE "Station";
ALTER TABLE "new_Station" RENAME TO "Station";
CREATE UNIQUE INDEX "Station_code_key" ON "Station"("code");
CREATE TABLE "new_Train" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "trainType" TEXT NOT NULL
);
INSERT INTO "new_Train" ("id", "name", "trainType") SELECT "id", "name", "trainType" FROM "Train";
DROP TABLE "Train";
ALTER TABLE "new_Train" RENAME TO "Train";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "Payment"("bookingId");
