-- Group: 118
-- Team Members: Justice Kane, Smith Breaux
-- Project: Star Gazers
-- Project Step 6

-- These are some Database Manipulation queries for a partially implemented Project Website 
-- using the stargazers database.
-- Your submission should contain ALL the queries required to implement ALL the
-- functionalities listed in the Project Specs.

-- UNIVERSTIES QUERIES
SELECT * FROM Universities;
SELECT * FROM Universities WHERE university_id = #university_id;
INSERT INTO Universities (university_name) VALUES ('#university_name');
UPDATE Universities SET university_name = '#university_name' WHERE university_id = #university_id;
DELETE FROM Universities WHERE university_id = '#university_id';

-- RESERVATIONS QUERIES
SELECT * FROM Reservations LEFT JOIN Universities ON Reservations.university_id = Universities.university_id LEFT JOIN Probes ON Probes.probe_id = Reservations.probe_id;
SELECT * FROM Reservations LEFT JOIN Universities ON Reservations.university_id = Universities.university_id LEFT JOIN Probes ON Probes.probe_id = Reservations.probe_id WHERE Reservations.reservation_id = #reservation_id;
INSERT INTO Reservations ( university_id, probe_id, reserve_length, reserve_start ) VALUES ( (SELECT university_id FROM Universities WHERE Universities.university_name = '#university_name'), (SELECT probe_id FROM Probes WHERE Probes.probe_name = '#probe_name'), #reserve_length, #reserve_start );
UPDATE Reservations SET university_id = (SELECT university_id FROM Universities WHERE university_name = '#university_name'), probe_id = (SELECT probe_id FROM Probes WHERE probe_name = '#probe_name'), reserve_length = #reserve_length, reserve_start = '#reserve_start' WHERE reservation_id = #reservation_id;
DELETE FROM Reservations WHERE reservation_id = '#reservation_id';

-- RELAYS QUERIES
SELECT * FROM Relays LEFT JOIN Universities ON Relays.sends_to = Universities.university_id;
SELECT * FROM (SELECT * FROM Relays LEFT JOIN Universities ON Relays.sends_to = Universities.university_id) RelaysUniversities WHERE relay_id = #relay_id;
SELECT relay_id FROM Relays WHERE relay_name = #relay_name;
INSERT INTO Relays ( relay_name, where_installed, sends_to ) VALUES ( 'relay_name', '#where_installed', null);
INSERT INTO Relays ( relay_name, where_installed, sends_to ) VALUES ( '#relay_name', '#where_installed', (SELECT university_id FROM Universities WHERE university_name = '#sends_to'));
UPDATE Relays SET relay_name = '#relay_name', where_installed = '#where_installed', sends_to = (SELECT university_id FROM Universities WHERE university_name = '#sends_to') WHERE relay_id = #relay_id;
DELETE FROM Relays WHERE relay_id = '#relay_id';

-- PROBES QUERIES
SELECT * FROM Probes LEFT JOIN Asteroids ON Probes.assigned_asteroid = Asteroids.asteroid_id;
SELECT * FROM (SELECT * FROM Probes LEFT JOIN Asteroids ON Probes.assigned_asteroid = Asteroids.asteroid_id) ProbesAsteroids WHERE probe_name = '#probe_name';
SELECT * FROM (SELECT * FROM Probes LEFT JOIN Asteroids ON Probes.assigned_asteroid = Asteroids.asteroid_id) ProbesAsteroids WHERE probe_id = #probe_id;
INSERT INTO Probes ( probe_name, is_functional ) VALUES ('+ #probe_name +', #is_functional);
UPDATE Probes SET assigned_asteroid = #assigned_asteroid, probe_name = '#probe_name', in_use = #in_use, is_functional = #is_functional WHERE probe_id = #probe_id;
UPDATE Probes SET assigned_asteroid = #assigned_asteroid, probe_name = '#probe_name', in_use = #in_use, is_functional = #is_functional WHERE probe_id = #probe_id;
DELETE FROM Probes WHERE probe_id = '#probe_id';

-- ASTEROIDS QUERIES
SELECT * FROM Asteroids;
SELECT asteroid_id FROM Asteroids WHERE asteroid_name = '#asteroid_name';
SELECT * FROM Asteroids WHERE asteroid_id = #asteroid_id;
INSERT INTO Asteroids ( asteroid_name, discovery_date, distance_from_earth, composition, currently_tracked ) VALUES ( '#asteroid_name', #discovery_date, #distance_from_earth, '#composition', #currently_tracked );
UPDATE Asteroids SET asteroid_name = '#asteroid_name', discovery_date = #discovery_date, distance_from_earth = #distance_from_earth, composition = '#composition', currently_tracked = #currently_tracked WHERE asteroid_id = #asteroid_id;
DELETE FROM Asteroids WHERE asteroid_id = '#data';

-- RELAYSPROBES QUERIES
SELECT * FROM RelaysProbes LEFT JOIN Relays ON RelaysProbes.relay_id = Relays.relay_id LEFT JOIN Probes ON RelaysProbes.probe_id = Probes.probe_id;
INSERT INTO RelaysProbes ( probe_id, relay_id ) VALUES ((SELECT probe_id FROM Probes WHERE probe_name = #probe_name), (SELECT relay_id FROM Relays WHERE relay_name = #relay_name));
INSERT INTO RelaysProbes ( probe_id, relay_id ) VALUES ((SELECT probe_id FROM Probes WHERE probe_name = #probe_name), relay_id);
INSERT INTO RelaysProbes ( probe_id, relay_id ) VALUES ((SELECT probe_id FROM Probes WHERE probe_name = #connected_probe), #relay_id);
INSERT INTO RelaysProbes ( probe_id, relay_id ) VALUES ((SELECT probe_id FROM Probes WHERE probe_name = #connected_probe), (SELECT relay_id FROM Relays WHERE relay_name = #relay_name));