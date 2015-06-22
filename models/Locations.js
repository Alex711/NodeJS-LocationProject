/**
 * Created by Alex on 16/06/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//Original Schema before moving to sub-doc.
//var locationsSchema = new Schema({
//    name: String,
//    start: {
//        address: String,
//        lat: String,
//        lon: String
//    },
//    date: {
//        type: Date,
//        default: Date.now
//    },
//    waypoints:[{
//        description: String,
//        lat:String,
//        lon: String,
//        date: {
//            type: Date,
//            default: Date.now
//        }
//    }]
//});

var tripWaypointsSchema = new Schema({
    wayPointName: String,
    wayPointDescription: String,
    lat: String,
    lon: String,
    notes:String
});

var tripSchema = new Schema({
    tripName:String,
    userid:String,
    tripDesc:String,
    tripStartAddress:String,
    date: {
            type: Date,
            default: Date.now
        },
    children: [tripWaypointsSchema]
});

var Locations = mongoose.model('Locations', tripSchema);

// make this available to our users in our Node applications
module.exports = Locations;