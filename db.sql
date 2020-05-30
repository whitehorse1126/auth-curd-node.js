DROP TABLE [dbo].[AppUser];
DROP TABLE [dbo].[Movies];
DROP TABLE [dbo].[Publisher];
DROP TABLE [dbo].[Category];



SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AppUser]
(
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [nvarchar](255) NULL,
	[LastName] [nvarchar](255) NULL,
	[Email] [nvarchar](255) NOT NULL,
	[Password] [nvarchar](255) NOT NULL,
	[Role] [nvarchar](7) NOT NULL,
	PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Category]    Script Date: 19/09/2019 09:51:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Category]
(
	[CategoryId] [int] IDENTITY(1,1) NOT NULL,
	[Category] [nvarchar](255) NOT NULL,
	PRIMARY KEY CLUSTERED 
(
	[CategoryId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Category]    Script Date: 19/09/2019 09:51:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Publisher]
(
	[PublisherId] [int] IDENTITY(1,1) NOT NULL,
	[PublisherName] [nvarchar](255) NOT NULL,
	PRIMARY KEY CLUSTERED 
(
	[PublisherId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Product]    Script Date: 19/09/2019 09:51:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Movies]
(
	[MoviesId] [int] IDENTITY(1,1) NOT NULL,
	[CategoryId] [int] NULL,
	[PublisherId] [int] NULL,
	[MoviesName] [nvarchar](255) NOT NULL,
	[MoviesDescription] [nvarchar](255) NULL,
	[MoviesRating] [Decimal] NOT NULL,
	[Movieslength] [Decimal] NOT NULL,
	PRIMARY KEY CLUSTERED 
(
	[MoviesId] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[AppUser] ON 
GO
INSERT [dbo].[AppUser]
	([UserId], [FirstName], [LastName], [Email], [Password], [Role])
VALUES
	(1, N'Admin', N'Admin', N'admin@tud.com', N'password', N'admin')
GO
INSERT [dbo].[AppUser]
	([UserId], [FirstName], [LastName], [Email], [Password], [Role])
VALUES
	(2, N'Manager', N'Manager', N'manager@tud.com', N'password', N'manager')
GO
INSERT [dbo].[AppUser]
	([UserId], [FirstName], [LastName], [Email], [Password], [Role])
VALUES
	(3, N'Mothanna', N'Hereth', N'user@tud.com', N'password', N'user')
GO
SET IDENTITY_INSERT [dbo].[AppUser] OFF
GO
SET IDENTITY_INSERT [dbo].[Category] ON 
GO
INSERT [dbo].[Category]
	([CategoryId], [Category])
VALUES
	(1, N'Music')
GO
INSERT [dbo].[Category]
	([CategoryId], [Category])
VALUES
	(2, N'Historical')
GO
INSERT [dbo].[Category]
	([CategoryId], [Category])
VALUES
	(3, N'Thriller/Action')
GO
INSERT [dbo].[Category]
	([CategoryId], [Category])
VALUES
	(4, N'Adventure/Fantasy')
GO
INSERT [dbo].[Category]
	([CategoryId], [Category])
VALUES
	(5, N'Comedy')
GO
INSERT [dbo].[Category]
	([CategoryId], [Category])
VALUES
	(6, N'Adventure/Action')
GO
INSERT [dbo].[Category]
	([CategoryId], [Category])
VALUES
	(7, N'Horror/Thriller')
GO
SET IDENTITY_INSERT [dbo].[Category] OFF
GO
SET IDENTITY_INSERT [dbo].[Publisher] ON 
GO
INSERT [dbo].[Publisher]
	([PublisherId], [PublisherName])
VALUES
	(1, N'20th century fox')
GO
INSERT [dbo].[Publisher]
	([PublisherId], [PublisherName])
VALUES
	(2, N'Netflix')
GO
INSERT [dbo].[Publisher]
	([PublisherId], [PublisherName])
VALUES
	(3, N'Marvel')
GO
INSERT [dbo].[Publisher]
	([PublisherId], [PublisherName])
VALUES
	(4, N'Simon & Schuster.')
GO
INSERT [dbo].[Publisher]
	([PublisherId], [PublisherName])
VALUES
	(5, N'DC Comics')
GO
INSERT [dbo].[Publisher]
	([PublisherId], [PublisherName])
VALUES
	(6, N'HBO')
GO
INSERT [dbo].[Publisher]
	([PublisherId], [PublisherName])
VALUES
	(7, N'Disney')
GO
SET IDENTITY_INSERT [dbo].[Publisher] OFF
GO
SET IDENTITY_INSERT [dbo].[Movies] ON 
GO
INSERT [dbo].[Movies]
	([MoviesId], [PublisherId], [CategoryId], [MoviesName], [MoviesDescription], [MoviesRating], [Movieslength])
VALUES
	(1, 7, 6, N'Mulan', N'To save her ailing father from serving in the Imperial Army, a fearless young woman disguises herself as a man to battle northern invaders in China.', 3.9, 2)
INSERT [dbo].[Movies]
	([MoviesId], [PublisherId], [CategoryId], [MoviesName], [MoviesDescription], [MoviesRating], [Movieslength])
VALUES
	(2, 3, 6, N'Black Widow', N'At birth the Black Widow (aka Natasha Romanova) is given to the KGB, which grooms her to become its ultimate operative.', 7, 1.5)
INSERT [dbo].[Movies]
	([MoviesId], [PublisherId], [CategoryId], [MoviesName], [MoviesDescription], [MoviesRating], [Movieslength])
VALUES
	(3, 6, 3, N'No Time To Die', N'Recruited to rescue a kidnapped scientist, globe-trotting spy James Bond finds himself hot on the trail of a mysterious villain, ', 8.5, 2.43)
INSERT [dbo].[Movies]
	([MoviesId], [PublisherId], [CategoryId], [MoviesName], [MoviesDescription], [MoviesRating], [Movieslength])
VALUES
	(4, 4, 7, N'A Quiet Place Part ||', N'The Abbott family must now face the terrors of the outside world as they fight for survival in silence.', 7.3, 1.4)
INSERT [dbo].[Movies]
	([MoviesId], [PublisherId], [CategoryId], [MoviesName], [MoviesDescription], [MoviesRating], [Movieslength])
VALUES
	(5, 5, 4, N'Wonder Woman 1984', N'Wonder Woman squares off against the Cheetah, a villainess who possesses superhuman strength and agility.', 8.5, 2)
INSERT [dbo].[Movies]
	([MoviesId], [PublisherId], [CategoryId], [MoviesName], [MoviesDescription], [MoviesRating], [Movieslength])
VALUES
	(6, 4, 3, N'TENET', N'Tenet is an upcoming action thriller film written and directed by Christopher Nolan.', 6, 1.5)

GO

SET IDENTITY_INSERT [dbo].[Movies] OFF
GO
ALTER TABLE [dbo].[Movies] ADD  DEFAULT ((0)) FOR [MoviesRating]
GO
ALTER TABLE [dbo].[Movies] ADD  DEFAULT ((0.00)) FOR [Movieslength]
GO
ALTER TABLE [dbo].[Movies]  WITH CHECK ADD FOREIGN KEY([PublisherId])
REFERENCES [dbo].[Publisher] ([PublisherId])
GO
ALTER TABLE [dbo].[Movies]  WITH CHECK ADD FOREIGN KEY([CategoryId])
REFERENCES [dbo].[Category] ([CategoryId])
GO

GRANT SELECT,INSERT,UPDATE,ALTER,DELETE ON OBJECT::dbo.AppUser to webUser;
GRANT SELECT,INSERT,UPDATE,ALTER,DELETE ON OBJECT::dbo.Publisher to webUser;
GRANT SELECT,INSERT,UPDATE,ALTER,DELETE ON OBJECT::dbo.Category to webUser;
GRANT SELECT,INSERT,UPDATE,ALTER,DELETE ON OBJECT::dbo.Movies to webUser;
