/**
 * Created by Alex on 7/06/15.
 */
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var lat;
var lon;
var routeArray;

$( document ).ready(function() {
    console.log( "ready!" );
    $( "#stepTwo" ).hide();
    var newUser =  {
        name: "The name of trip",
        tripDesc:"This is a description of the trip",
        address:"address",
        startLat: "startlat",
        startLon: "startLon",
        wayPointname:'wayPointName',
        wayPointDescription: "this is a desc",
        wayPointLat:"waypointLat",
        wayPointLon: "wayPointon"

    };

    $.ajax({
        type: 'POST',
        data: newUser,
        url: '/postStep1Route',
        dataType: 'JSON'

    }).done(function( response ) {

        // Check for a successful (blank) response
        if (response.msg === '') {
        }
        else {
            alert('Error: ' + response.msg);
        }

        // Update the table
        console.log("posted");
    });



});

window.onload = getLocation();



var x = document.getElementById("demo");
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition,showError);

    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";}
}

function stepTwo() {

    console.log("test");
    $("#control_panel").hide();
    $("#map-canvas").hide();
    $("#directions_panel").hide();
    $("#stepTwo").show();


    console.log(routeArray);

//    var text = '{ "records" : [' +
//        '{ "Band":"John" , "Song":"Doe" }]}';

    var text = '{ "Band":"John" , "Song":"Doe" }]}';


    $('#my-final-table').dynatable({
        dataset: {
            records: [
                {
                    "band": "I am record one",
                    "song": "Fetched by AJAX"
                },
                {
                    "band": "I am record two",
                    "song": "Cuz it's awesome"
                },
                {
                    "band": "I am record three",
                    "song": "Yup, still AJAX"
                }
            ],
            "queryRecordCount": 3,
            "totalRecordCount": 3

        }
    });

    $.getJSON('/getTrip', function(data) {
        console.log(data);
    });

    $.getJSON('/getTrip', function(data) {



    });


}

function showPosition(position) {


    lat = position.coords.latitude;
    lon = position.coords.longitude;
    initialize();

}


function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }

}


function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var currentLocation = new google.maps.LatLng(lat, lon);
    var mapOptions = {
        zoom: 4,
        center: currentLocation
    }
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    directionsDisplay.setMap(map);
}

function addWayPointForm() {

    var input = '</br> <input id="waypoints" type="text" name="wayPointField" class="form-control">';
    var input2 = '<button onclick="addWayPointForm()" type="button" class="btn.btn-default">Button</button>';
    $(".form-inline" ).append(input);
    $(".form-inline").append(input2);

    var input = document.getElementsByName('wayPointField');
    for (i = 0; i < input.length; i++) {
        autocomplete = new google.maps.places.Autocomplete(input[i]);

    }


//    var autoComplete = ' var fromText = document.getElementByID("test"); var fromAuto = new google.maps.places.Autocomplete(fromText);';
//    $("head").append(autoComplete);



}

function getWaypointValues() {
//    console.log("test");
//    $('.wayPointContainer', $('wayPoints')).each(function () {
//        console.log($(this)); //log every element found to console output
//    });
//
        var val = $('[name=wayPointField]')[0].value;

console.log(val);
    console.log($('[name=wayPointField]').length);

    $('[name=wayPointField]').each(function() {
            var grade =  $(this).val();
            console.log(grade);
        });


}
function calcRoute() {
    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;

    var waypts = [];
    var waypointsArray = document.getElementsByName("wayPointField");
//    $('[name=wayPointField]').each(function() {
//        var waypoints = $(this).val();
//        if (waypoints != "") {
//
//            waypts.push({
//                location: waypoints,
//                stopover: true});
//            console.log(waypts);
//        }

    for (var i = 0; i < waypointsArray.length; i++) {
        if (waypointsArray[i].value != "") {
            waypts.push({
                location:waypointsArray[i].value,
                stopover:true});
        }
    }

//    console.log(waypts);


    var request = {
        origin: start,
        destination: end,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            console.log("This is the google maps response");
            routeArray = response;
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
            var summaryPanel = document.getElementById('directions_panel');
            summaryPanel.innerHTML = '';
            // For each route, display summary information.
            for (var i = 0; i < route.legs.length; i++) {
                var routeSegment = i + 1;
                summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment + '</b><br>';
                summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
                summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
                summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
            }
        }
    });
}

//Autocomplete on textfield
google.maps.event.addDomListener(window, 'load', function () {
    var places = new google.maps.places.Autocomplete(document.getElementById('wayPoints'));
    var fromText = document.getElementById('start');
    var fromAuto = new google.maps.places.Autocomplete(fromText);

    var fromText1 = document.getElementById('end');
    var fromAuto1 = new google.maps.places.Autocomplete(fromText1);
    google.maps.event.addListener(places, 'place_changed', function () {
//        var place = places.getPlace();
//        var address = place.formatted_address;
//        var latitude = place.geometry.location.k;
//        var longitude = place.geometry.location.D;
//        var mesg = "Address: " + address;
//        mesg += "\nLatitude: " + latitude;
//        mesg += "\nLongitude: " + longitude;
//        alert(mesg);
    });
});

google.maps.event.addDomListener(window, 'load', initialize);window, 'load', initialize;