BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[user] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userName] NVARCHAR(1000) NOT NULL,
    [FirstName] NVARCHAR(1000) NOT NULL,
    [LastName] NVARCHAR(1000) NOT NULL,
    [Password] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [user_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [isDisabled] BIT NOT NULL CONSTRAINT [user_isDisabled_df] DEFAULT 0,
    CONSTRAINT [user_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [user_userName_key] UNIQUE NONCLUSTERED ([userName])
);

-- CreateTable
CREATE TABLE [dbo].[tinyUrl] (
    [id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [longUrl] NVARCHAR(1000) NOT NULL,
    [shortUrl] NVARCHAR(1000) NOT NULL,
    [shortCode] NVARCHAR(1000) NOT NULL,
    [expires] DATETIME2 NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [tinyUrl_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [isDisabled] BIT NOT NULL CONSTRAINT [tinyUrl_isDisabled_df] DEFAULT 0,
    [totalClicked] INT NOT NULL CONSTRAINT [tinyUrl_totalClicked_df] DEFAULT 0,
    CONSTRAINT [tinyUrl_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[tinyUrl] ADD CONSTRAINT [tinyUrl_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[user]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
