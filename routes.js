var passport = require('passport');

var Account = require('./models/account');
var Locations = require('./models/Locations');


module.exports = function (app) {



    app.get('/', function (req, res) {

        if (req.user) {
            var searchID = req.user.id;
            console.log(searchID);

            //      Locations.find({ userid: req.user.id }, function(err, location) {

            Locations.find({userid: searchID}, function(err, location) {
                if (err) return console.error(err);
                res.render('TripPlanner', {ViewLocations:location});
                //        res.render('dashboard', {user : req.user, ViewLocations:location});


            });

        } else {

            res.render('index', { user : req.user });
        }
    });


    app.get('/getlocations', function (req, res) {

        var searchID = req.user.id;

        Locations.find({userid: searchID}, function(err, location) {
            if (err) return console.error(err);
            res.send(location);
            //        res.render('dashboard', {user : req.user, ViewLocations:location});


        });

    });

    app.get('/dashboard', function (req, res) {


        res.render('dashboard');
    });

    app.get('/getTrip', function (req, res) {

        Locations.find({}, function(err, Locations) {
            if (err) throw err;
            res.send(Locations);

            // object of all the users
            console.log(Locations);
            console.log("Get Trip");
        });

    });

    app.post('/postStep1Route', function (req, res) {

        //Create
//        var trip = new Locations();
//        trip.tripName = 'tripName';
//        trip.children.wayPointName = "First Waypoint";
//        trip.children.wayPointDescription  = 'desc';
//        trip.children.lat  = 'lat';
//        trip.children.lon  = 'lon';

        var trip = new Locations(
            {
                tripName: req.body.name,
                tripDescription:req.body.tripDesc,
                tripStartAddress:req.body.address,
                userId: req.user.id,
                children: [{ wayPointName:req.body.wayPointname, wayPointDescription: req.body.wayPointDescription,
                    lat: req.body.wayPointLat, lon: req.body.wayPointLon}]

            });

        trip.save(function(err, saved) {
            if(err) console.error(err);

        });


//        var step1Route = new Locations({
//            name: req.body.name
//            , start: {
//                address: req.body.address,
//                lat: req.body.lat0,
//                lon: req.body.lon0
//            }
//            , wayPoints: [{
//                description:req.body.desc,
//                lat:req.body.lat1,
//                lon:req.body.lon1
//            }]
//        });
//
//        step1Route.save(function(err, step1Route) {
//            if (err) return console.error(err);
//            console.dir(step1Route);
//        });



    });



    app.get('/register', function(req, res) {
        res.render('register', { });
    });

    app.get('/TripPlanner', function(req, res) {
        console.log(req.user.id);

        res.render('TripPlanner', { });


    });

    //inserts location
    app.post('/insertLocation', function(req, res) {

        Locations.create({userid: req.user.id, name : req.body.name, information: req.body.information, lat:req.body.latitude, lon:req.body.longitude  }, function(err, location) {
            if (err) return console.error(err);

            //res.render('dashboard', {user : req.user, locations:location});
        });
    });


    app.post('/register', function(req, res) {
        Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
            if (err) {
                return res.render("register", {info: "Sorry. That username already exists. Try again."});
            }

            passport.authenticate('local')(req, res, function () {
                res.redirect('/');
            });
        });
    });

    app.delete('/deleteEntry', function(req, res) {
        var itemToDelete = req.params.id;
        Locations.remove({_id: req.body.entry}, function (err) {

            if (err) return handleError(err);


        });
    });



    app.get('/login', function(req, res) {
        res.render('login', { user : req.user });
    });

    app.post('/login', passport.authenticate('local'), function(req, res) {
        res.redirect('/');
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/ping', function(req, res){
        res.send("pong!", 200);
    });

};


