/*
  Warnings:

  - A unique constraint covering the columns `[shortCode]` on the table `tinyUrl` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[tinyUrl] ADD CONSTRAINT [tinyUrl_shortCode_key] UNIQUE NONCLUSTERED ([shortCode]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
