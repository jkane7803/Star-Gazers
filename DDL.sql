-- Group: 118
-- Team Members: Justice Kane, Smith Breaux
-- Project: Star Gazers
-- Project Step 6

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

DROP TABLE IF EXISTS Asteroids;
DROP TABLE IF EXISTS Probes;
DROP TABLE IF EXISTS Universities;
DROP TABLE IF EXISTS Relays;
DROP TABLE IF EXISTS RelaysProbes;
DROP TABLE IF EXISTS Reservations;

-- Create Asteroids Table
CREATE TABLE Asteroids (
    asteroid_id int(11) NOT NULL AUTO_INCREMENT,
    asteroid_name varchar(255) NOT NULL,
    discovery_date date NOT NULL,
    distance_from_earth int(11), -- defined in Astronomical Units
    composition varchar(255),
    currently_tracked tinyint(1) NOT NULL,
    PRIMARY KEY (asteroid_id),
    UNIQUE KEY (asteroid_name)
);

-- Create Probes Table
CREATE TABLE Probes (
    probe_id int(11) NOT NULL AUTO_INCREMENT,
    assigned_asteroid int,
    probe_name varchar(255) NOT NULL,
    in_use tinyint(1),
    is_functional tinyint(1),
    PRIMARY KEY (probe_id),
    UNIQUE KEY (probe_name),
    FOREIGN KEY (assigned_asteroid) REFERENCES Asteroids (asteroid_id)
    -- ON DELETE CASCADE
);

-- Create Universities Table
CREATE TABLE Universities (
    university_id int(11) NOT NULL AUTO_INCREMENT,
    university_name varchar(255) NOT NULL,
    PRIMARY KEY (university_id),
    UNIQUE KEY (university_name)
);

-- Create Relays Table
CREATE TABLE Relays (
    relay_id int(11) NOT NULL AUTO_INCREMENT,
    relay_name varchar(255) NOT NULL,
    where_installed varchar(255) NOT NULL, -- A country
    sends_to int(11) NULL,
    PRIMARY KEY (relay_id),
    UNIQUE KEY (relay_name),
    FOREIGN KEY (sends_to) REFERENCES Universities (university_id)
    -- ON DELETE CASCADE
);

-- Create RelaysProbes Table
CREATE TABLE RelaysProbes (
    probe_id int(11) NOT NULL,
    relay_id int(11) NOT NULL,
    FOREIGN KEY (probe_id) REFERENCES Probes (probe_id),
    -- ON DELETE CASCADE,
    FOREIGN KEY (relay_id) REFERENCES Relays (relay_id)
    -- ON DELETE CASCADE
);

-- Create Reservations Table
CREATE TABLE Reservations (
    reservation_id int(11) NOT NULL AUTO_INCREMENT,
    university_id int(11) NOT NULL,
    probe_id int(11) NOT NULL,
    reserve_length int NOT NULL, -- signifies number of days
    reserve_start date NOT NULL,
    PRIMARY KEY (reservation_id),
    FOREIGN KEY (university_id) REFERENCES Universities (university_id),
    -- ON DELETE CASCADE,
    FOREIGN KEY (probe_id) REFERENCES Probes (probe_id)
    -- ON DELETE CASCADE
);


-- Inserting Values
INSERT INTO Asteroids ( asteroid_name, discovery_date, distance_from_earth, composition, currently_tracked ) 
VALUES ( '4 Vesta', '1807-03-29', 5, 'V-Type', 0 ),
('2 Pallas', '1802-03-28', 10, 'B-Type', 0),
('10 Hygiea', '1849-04-12', 16, 'C-Type', 0),
('951 Gaspra', '1916-07-30', 2, 'S-Type', 0),
('243 Ida', '1993-08-28', 1.5, 'S-Type', 0);

INSERT INTO Probes ( probe_name, is_functional )
VALUES ('Sputnik-SS5', 1),
('Explorer-25', 1),
('CUBERICK-CL4RKE', 1),
('Discovery 2', 1),
('Eye of Hawking', 0);

INSERT INTO Universities ( university_name )
VALUES ('Oregon State University'),
('Universidade de Coimbra'),
('Massachusetts Institute of Technology'),
('University of Oxford');

INSERT INTO Relays ( relay_name, where_installed )
VALUES ( 'America North 16' ,'USA'),
( 'America South 5' ,'Brazil'),
( 'Europe West 3' ,'Germany'),
( 'South East Asia 1' ,'Thailand');

INSERT INTO Reservations ( university_id, probe_id, reserve_length, reserve_start )
VALUES (1, 2, 2, '2018-01-22'),
(2, 3, 2, '2020-05-13'),
(3, 4, 3, '2020-08-04'),
(4, 1, 2, '2021-08-28');

INSERT INTO RelaysProbes ( relay_id, probe_id ) 
VALUES (1,1),
(1, 2),
(2, 1),
(2, 2);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;