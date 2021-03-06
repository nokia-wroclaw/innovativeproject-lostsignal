var hmap, heatmap;
var pointArray;
var dataPoints = [];
var actualMarker;
var bestMarker;

function heatmap_initialize() {
    db_navigate.transaction(queryDB_navigation, errorCB_nav_heatmap, successCB);

    var mapOptions = {
        center: new google.maps.LatLng(51.110022, 17.036365),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };

    hmap = new google.maps.Map(document.getElementById('heatmap-canvas'),
        mapOptions);

    pointArray = new google.maps.MVCArray(dataPoints);

    heatmap = new google.maps.visualization.HeatmapLayer({
        dissipating: true,
        map: hmap,
        data: pointArray,
        radius:20,
        opacity: 0.5
    });
}

function heatmap_populate() {
    //add points from navigate_db to the heatmap
}

function setPointOnHeatmap(latitude, longitude, signal) {

    if(actualMarker != null)
        actualMarker.setMap(null);
    var myLatlng = new google.maps.LatLng(latitude,longitude);

    var infowindow = new google.maps.InfoWindow({
        content: '<p style="color:black">Actual position.</p>' +
        '<p style="color:black">Actual position:' + myLatlng +'</p>' +
        '<p style="color:black">Date: ' + new Date() + '</p>'
        +'<p style="color:black">Signal strength: ' + signal + '</p>'
    });

    actualMarker = new google.maps.Marker({
        position: myLatlng,
        map: hmap
    });
    google.maps.event.addListener(actualMarker, 'click', function() {
        infowindow.open(hmap,actualMarker);
    });

    dataPoints.push({location: myLatlng, weight: 140+signal});

    pointArray = new google.maps.MVCArray(dataPoints);
    heatmap.setData(pointArray);

}

$(document).on( "click", '#navButton', function() {
    setTimeout(function(){
        actual_lat = Position.coords.latitude;
        actual_long = Position.coords.longitude;
        db_navigate.transaction(populateDB_searchNearestPoint, errorCB_nav, successCB);

    },3000);


    if(bestMarker != null)
        bestMarker.setMap(null);

    setTimeout(function() {
        var infowindow = new google.maps.InfoWindow({
            content: '<p style="color:black">Best point.</p>' +
            '<p style="color:black">Actual position:' + bestPosition +'</p>' +
            '<p style="color:black">Date: ' + new Date() + '</p>'
            +'<p style="color:black">Signal strength: ' + signal + '</p>'
        });

        bestMarker = new google.maps.Marker({
            position: bestPosition,
            animation: google.maps.Animation.DROP,
            map: hmap,
            icon: 'img/bestPointImg.png'
        });
        google.maps.event.addListener(bestMarker, 'click', function() {
            infowindow.open(hmap,bestMarker);
        });
    }, 5000);
});


$(document).on( "click", '#navButt', function() {
    //alert("For navigate You need to click 'Get best point' button and then double click on the map. Thanks for patience.");
    screen.lockOrientation('landscape');
    setTimeout(function(){
        screen.unlockOrientation();
        window.clearTimeout();
    },1000);
});


$(document).on( "click", '#centerHeatmap', function() {
    hmap.setCenter(lastPostition);
});