// Citation for the following code:
// Date: 12/5/22
// Based on code from our instructors for class CS 340 at Oregon State University, Dr. Michael Curry and Danielle Safonte.

/*
    SETUP
*/
// Express
var asyncHandler = require('express-async-handler');
var bodyParser   = require('body-parser');
var express      = require('express');   // We are using the express library for the web server
var app          = express();            // We need to instantiate an express object to interact with the server in our code
PORT             = 28514;                // Set a port number at the top so it's easy to change in the future


// Looks for index.html in the public folder, displays as home page.
app.use(express.static('public'));
app.use(bodyParser());

// Database
var db = require('./db-connector');


// UNIVERSITY ROUTES //

app.get('/getUniversity', function(req, res) {
    const getUniTable = "SELECT * FROM Universities;";
    db.pool.query(getUniTable, function(err, results, fields){
        res.send(JSON.stringify(results));
    });
});

app.post('/getUniversityById', function(req, res) {
    const getUniversity = "SELECT * FROM Universities WHERE university_id = " + req.body.data + ";";
    db.pool.query(getUniversity, function(err, results, fields){
        res.send(JSON.stringify(results));
    });
});

app.get('/insertUniversity', function(req, res) {
    const insertUniversity = "INSERT INTO Universities (university_name) VALUES ('" + req.query.university_name + "');";
    db.pool.query(insertUniversity, function(err, results, fields){
        res.redirect('./universities.html')
    });
});

app.get('/updateUniversity', function(req, res) {
    const updateUniversity = "UPDATE Universities SET university_name = '" + req.query.university_name + "' WHERE university_id = " + req.query.university_id + ";";
    db.pool.query(updateUniversity, function(err, results, fields){
        res.redirect('./universities.html');
    });
});

app.post('/deleteUniversity', function(req, res) {
    const deleteUniversity = "DELETE FROM Universities WHERE university_id = '" + req.body.data + "';";
    db.pool.query(deleteUniversity, function(err, results, fields){
        res.redirect("./universities.html");
    });
}); 


// RESERVATIONS ROUTES //

app.get('/getReservation', function(req, res) {
    const getResTable = "SELECT * FROM Reservations LEFT JOIN Universities ON Reservations.university_id = Universities.university_id LEFT JOIN Probes ON Probes.probe_id = Reservations.probe_id;";
    db.pool.query(getResTable, function(err, results, fields){
        res.send(JSON.stringify(results));
    });
});

app.post('/getReservationById', function(req, res) {
    const getResTable = "SELECT * FROM Reservations LEFT JOIN Universities ON Reservations.university_id = Universities.university_id LEFT JOIN Probes ON Probes.probe_id = Reservations.probe_id WHERE Reservations.reservation_id = " + req.body.data + ";";
    db.pool.query(getResTable, function(err, results, fields){
        res.send(JSON.stringify(results));
    });
});

app.get('/updateReservation', function(req, res) {
    const updateReservation = "UPDATE Reservations SET university_id = (SELECT university_id FROM Universities WHERE university_name = '" + req.query.university_name + "'), probe_id = (SELECT probe_id FROM Probes WHERE probe_name = '" + req.query.probe_name + "'), reserve_length = " + req.query.reserve_length[0] + ", reserve_start = '" + req.query.reserve_start + "' WHERE reservation_id = " + req.query.reservation_id + ";";
    db.pool.query(updateReservation, function(err, results, fields){
        res.redirect('./reservations.html');
    });
});

app.get('/insertReservation', function(req, res) {
    const insertReservation = "INSERT INTO Reservations ( university_id, probe_id, reserve_length, reserve_start ) VALUES ( (SELECT university_id FROM Universities WHERE Universities.university_name = '" + req.query.university_name + "'), (SELECT probe_id FROM Probes WHERE Probes.probe_name = '" + req.query.probe_name + "'), " + req.query.reserve_length[0] + ", '" + req.query.reserve_start + "' );";
    db.pool.query(insertReservation, function(err, results, fields){
        res.redirect('./reservations.html');
    });
});

app.post('/deleteReservation', function(req, res) {
    const deleteReservation = "DELETE FROM Reservations WHERE reservation_id = '" + req.body.data + "';";
    db.pool.query(deleteReservation, function(err, results, fields){
        res.redirect("./reservations.html");
    });
});


// RELAYS ROUTES //

app.get('/getRelay', function(req, res) {
    const getRelayTable = "SELECT * FROM Relays LEFT JOIN Universities ON Relays.sends_to = Universities.university_id;";
    db.pool.query(getRelayTable, function(err, results, fields){
        res.send(JSON.stringify(results));
    });
});

app.post('/getRelayById', function(req, res) {
    const getRelay = "SELECT * FROM (SELECT * FROM Relays LEFT JOIN Universities ON Relays.sends_to = Universities.university_id) RelaysUniversities WHERE relay_id = " + req.body.data + ";";
    db.pool.query(getRelay, function(err, results, fields){
        res.send(JSON.stringify(results));
    });
});

app.get('/insertRelay', function(req, res) {
    let sendsTo = req.query.sends_to
    if (sendsTo == 'Select'){
        sendsTo = null;
        const insertRelay = "INSERT INTO Relays ( relay_name, where_installed, sends_to ) VALUES ( '" + req.query.relay_name + "', '" + req.query.where_installed + "', null);";
        db.pool.query(insertRelay, function(err, results, fields){
            let insertRelaysProbes = 'INSERT INTO RelaysProbes ( probe_id, relay_id ) VALUES ((SELECT probe_id FROM Probes WHERE probe_name = "' + req.query.connected_probe + '"), (SELECT relay_id FROM Relays WHERE relay_name = "' + req.query.relay_name + '"));';
            db.pool.query(insertRelaysProbes, function(err, results, fields){
                res.redirect("./relays.html");
            });
        });
    } else {
        const insertRelay = "INSERT INTO Relays ( relay_name, where_installed, sends_to ) VALUES ( '" + req.query.relay_name + "', '" + req.query.where_installed + "', (SELECT university_id FROM Universities WHERE university_name = '" + req.query.sends_to + "'));";
        db.pool.query(insertRelay, function(err, results, fields){
            let insertRelaysProbes = 'INSERT INTO RelaysProbes ( probe_id, relay_id ) VALUES ((SELECT probe_id FROM Probes WHERE probe_name = "' + req.query.connected_probe + '"), (SELECT relay_id FROM Relays WHERE relay_name = "' + req.query.relay_name + '"));';
            db.pool.query(insertRelaysProbes, function(err, results, fields){
                res.redirect("./relays.html");
            });
        });
    }
});

app.post('/deleteRelay', function(req, res) {
    const deleteRelay = "DELETE FROM Relays WHERE relay_id = '" + req.body.data + "';";
    db.pool.query(deleteRelay, function(err, results, fields){
        res.redirect("./relays.html");
    });
});

app.get('/updateRelay', function(req, res) {
    const updateRelay = "UPDATE Relays SET relay_name = '" + req.query.relay_name + "', where_installed = '" + req.query.where_installed + "', sends_to = (SELECT university_id FROM Universities WHERE university_name = '" + req.query.sends_to + "') WHERE relay_id = " + req.query.relay_id + ";";
    db.pool.query(updateRelay, function(err, results, fields){
        let insertRelaysProbes = 'INSERT INTO RelaysProbes ( probe_id, relay_id ) VALUES ((SELECT probe_id FROM Probes WHERE probe_name = "' + req.query.connected_probe + '"), ' + req.query.relay_id + ');';
        db.pool.query(insertRelaysProbes, function(err, results, fields){
            res.redirect("./relays.html");
        });
    });
});


// PROBES ROUTES //

app.get('/getProbe', function(req, res) {
    const getProbeTable = "SELECT * FROM Probes LEFT JOIN Asteroids ON Probes.assigned_asteroid = Asteroids.asteroid_id;";
    db.pool.query(getProbeTable, function(err, results, fields){
        res.send(JSON.stringify(results));
    });
});

app.post('/searchProbe', function(req, res) {
    const findProbe = "SELECT * FROM (SELECT * FROM Probes LEFT JOIN Asteroids ON Probes.assigned_asteroid = Asteroids.asteroid_id) ProbesAsteroids WHERE probe_name = '" + req.body.probe_name + "';";
    db.pool.query(findProbe, function(err, results, fields){
        res.send(JSON.stringify(results));
    });
});

app.post('/getProbeByID', asyncHandler (async function(req, res) {
    const getProbe = "SELECT * FROM (SELECT * FROM Probes LEFT JOIN Asteroids ON Probes.assigned_asteroid = Asteroids.asteroid_id) ProbesAsteroids WHERE probe_id = " + req.body.probe_id + ";";
    db.pool.query(getProbe, function(err, results, fields){
        res.send(JSON.stringify(results));
    });
}));

app.get('/insertProbe', function(req, res) {
    let in_use = req.query.in_use;
    if (in_use == 1) {
        in_use = 1;
    } else {
        in_use = 0;
    }
    let is_functional = req.query.is_functional;
    if (is_functional == 1) {
        is_functional = 1;
    } else {
        is_functional = 0;
    }
    // SQL Query
    let getAsteroidID = 'SELECT asteroid_id FROM Asteroids WHERE asteroid_name = "' + req.query.assigned_asteroid + '";';
    db.pool.query(getAsteroidID, function(err, results, fields){
        let getRelayID = 'SELECT relay_id FROM Relays WHERE relay_name = "' + req.query.relay_name + '";';
        const asteroidVal = results[0].asteroid_id
        db.pool.query(getRelayID, function(err, results, fields){
            const relayVal = results[0].relay_id
            let insertProbe = 'INSERT INTO Probes ( assigned_asteroid, probe_name, in_use, is_functional ) VALUES (' + asteroidVal + ', "'+ req.query.probe_name +'", ' + in_use + ', ' + is_functional + ');';
            db.pool.query(insertProbe, function(err, results, fields){
                db.pool.query(insertProbe, function(err, results, fields){
                    let insertRelaysProbes = 'INSERT INTO RelaysProbes ( probe_id, relay_id ) VALUES ((SELECT probe_id FROM Probes WHERE probe_name = "' + req.query.probe_name + '"), ' + relayVal + ');';
                    db.pool.query(insertRelaysProbes, function(err, results, fields){
                        res.redirect("./probes.html");
                    });
                })
            })
        })
    })
});

app.get('/updateProbe', function(req, res) {
    let probe_id = parseInt(req.query.probe_id);
    let probe_name = req.query.probe_name;
    let assigned_asteroid = req.query.asteroid_name;
    let in_use = req.query.in_use;
    if (in_use == 1) {
        in_use = 1;
    } else {
        in_use = 0;
    }
    let is_functional = req.query.is_functional;
    if (is_functional == 1) {
        is_functional = 1;
    } else {
        is_functional = 0;
    }
    if (assigned_asteroid !== 'Unassigned') {
        in_use = 1;
        let getAstID = "SELECT asteroid_id FROM Asteroids WHERE asteroid_name = '" + assigned_asteroid + "';";
        db.pool.query(getAstID, function(err, results, fields){
            assigned_asteroid = results[0].asteroid_id;

            let updateProbe = "UPDATE Probes SET assigned_asteroid = " + assigned_asteroid + ", probe_name = '" + probe_name + "', in_use = " + in_use + ", is_functional = " + is_functional + " WHERE probe_id = " + probe_id + ";";
            let insertRelaysProbes = 'INSERT INTO RelaysProbes ( probe_id, relay_id ) VALUES ((SELECT probe_id FROM Probes WHERE probe_name = "' + req.query.probe_name + '"), (SELECT relay_id FROM Relays WHERE relay_name = "' + req.query.relay_name + '"));';
            db.pool.query(updateProbe, function(err, results, fields){
                db.pool.query(insertRelaysProbes, function(err, results, fields){
                    res.redirect("./probes.html");
                });
            });
        });
    } else {
        in_use = 0;
        assigned_asteroid = null;
        let updateProbe = "UPDATE Probes SET assigned_asteroid = " + assigned_asteroid + ", probe_name = '" + probe_name + "', in_use = " + in_use + ", is_functional = " + is_functional + " WHERE probe_id = " + probe_id + ";";
        let insertRelaysProbes = 'INSERT INTO RelaysProbes ( probe_id, relay_id ) VALUES ((SELECT probe_id FROM Probes WHERE probe_name = "' + req.query.probe_name + '"), (SELECT relay_id FROM Relays WHERE relay_name = "' + req.query.relay_name + '"));';
        db.pool.query(updateProbe, function(err, results, fields){
            db.pool.query(insertRelaysProbes, function(err, results, fields){
                res.redirect("./probes.html");
            });
        });
    }
});

app.post('/deleteProbe', function(req, res) {
    const deleteProbe = "DELETE FROM Probes WHERE probe_id = '" + req.body.probe_id + "';";
    db.pool.query(deleteProbe, function(err, results, fields){
        res.redirect("./probes.html");
    });
});


// ASTEROIDS ROUTES //

app.get('/getAsteroid', function(req, res) {
    const getAsteroidTable = "SELECT * FROM Asteroids;";
    db.pool.query(getAsteroidTable, function(err, results, fields){
        res.send(JSON.stringify(results));
    });
});

app.post('/getAsteroidByID', function(req, res) {
    const getAsteroid = "SELECT * FROM Asteroids WHERE asteroid_id = " + req.body.data + ";";
    db.pool.query(getAsteroid, function(err, results, fields){
        res.send(JSON.stringify(results));
    });
});


app.get('/insertAsteroid', (req, res) => {
    let currently_tracked;
    if (req.query.currently_tracked == 'Yes'){
        currently_tracked = 1;
    } else {
        currently_tracked = 0;
    }
    const insertAsteroid = "INSERT INTO Asteroids ( asteroid_name, discovery_date, distance_from_earth, composition, currently_tracked ) VALUES ( '" + req.query.asteroid_name + "', '" + req.query.discovery_date + "', " + parseInt(req.query.distance_from_earth) + ", '" + req.query.composition + "', " + currently_tracked + " );";
    db.pool.query(insertAsteroid, function(err, results, fields){
        res.redirect("./asteroids.html");
    });
});

app.get('/updateAsteroid', function(req, res) {
    let currently_tracked;
    if (req.query.currently_tracked == 'Yes'){
        currently_tracked = 1;
    } else {
        currently_tracked = 0;
    }
    const updateAsteroid = "UPDATE Asteroids SET asteroid_name = '" + req.query.asteroid_name + "', discovery_date = '" + req.query.discovery_date + "', distance_from_earth = " + parseInt(req.query.distance_from_earth) + ", composition = '" + req.query.composition + "', currently_tracked = " + currently_tracked + " WHERE asteroid_id = " + parseInt(req.query.asteroid_id) + ";";
    db.pool.query(updateAsteroid, function(err, results, fields){
        res.redirect("./asteroids.html");
    });
});

app.post('/deleteAsteroid', function(req, res) {
    const deleteAsteroid = "DELETE FROM Asteroids WHERE asteroid_id = '" + req.body.data + "';";
    db.pool.query(deleteAsteroid, function(err, results, fields){
        res.redirect("./asteroids.html");
    });
});


// RELAYSPROBES ROUTES //

app.get('/getRelaysProbes', function(req, res) {
    const findProbeRelay = "SELECT * FROM RelaysProbes LEFT JOIN Relays ON RelaysProbes.relay_id = Relays.relay_id LEFT JOIN Probes ON RelaysProbes.probe_id = Probes.probe_id;";
    db.pool.query(findProbeRelay, function(err, results, fields){
        res.send(JSON.stringify(results));
    });
});


/*
    LISTENER
*/
app.listen(PORT, function(){        // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});