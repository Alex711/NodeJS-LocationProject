var passport = require('passport');

var Account = require('./models/account');

module.exports = function (app) {



    app.get('/', function (req, res) {

        if (req.user) {
            var searchID = req.user.id;
            console.log(searchID);

            //      Locations.find({ userid: req.user.id }, function(err, location) {

            Locations.find({userid: searchID}, function(err, location) {
                if (err) return console.error(err);
                res.render('dashboard', {ViewLocations:location});
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

    app.get('/postStep1Route', function (req, res) {
        console.log(req.user.id);
        var step1Route = new Trip({
            name: 'Thor'
            , start: {
                address: 'test',
                lat: 'test',
                lon: 'test'
            }
            , wayPoints: [{
                description:'test',
                lat:'test',
                lon:'test'
            }]
        });

        step1Route.save(function(err, step1Route) {
            if (err) return console.error(err);
            console.dir(step1Route);
        });



    });



    app.get('/register', function(req, res) {
        res.render('register', { });
    });

    app.get('/TripPlanner', function(req, res) {
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

}
