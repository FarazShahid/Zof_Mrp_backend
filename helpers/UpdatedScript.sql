CREATE TABLE users (
  Id int(11) NOT NULL,
  Email varchar(255) NOT NULL,
  Password varchar(255) NOT NULL,
  CreatedOn varchar(255) NOT NULL,
  isActive tinyint(4) NOT NULL DEFAULT 1
);

CREATE TABLE ColorOption (
  Id int(11) NOT NULL,
  Name varchar(255) NOT NULL,
  CreatedOn datetime DEFAULT current_timestamp(),
  CreatedBy varchar(100) DEFAULT NULL,
  UpdatedOn datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  UpdatedBy varchar(100) DEFAULT NULL
);

TRUNCATE TABLE availablecoloroptions;

ALTER TABLE availablecoloroptions 
CHANGE COLUMN ColorName colorId INT NOT NULL,
ADD CONSTRAINT fk_availablecoloroptions_coloroption 
FOREIGN KEY (colorId) 
REFERENCES coloroption(Id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;