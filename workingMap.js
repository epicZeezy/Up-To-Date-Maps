var firebase = new Firebase("https://azizs-firebase-map.firebaseio.com/");

function changeBackground(){
	var message = document.getElementById("message").value;
	
	if(message){
		var background = document.getElementById("background");
		background.style.background = message;
	}
	else{
		alert("No Message!");
		console.log(message);
	}
	
}

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 39.11834115416519, lng: -76.82601928710938},
    zoom:13,
	
   styles: [{
      featureType: 'poi',
      tylers: [{ visibility: 'on' }]  // Turn off points of interest.
    }, {
      featureType: 'transit.station',
      stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
    }],
    disableDoubleClickZoom: true
  });
  
  
  //Add marker on user click
  map.addListener('click', function(e) {
    firebase.push({lat: e.latLng.lat(), lng: e.latLng.lng()});
  });
  
  // Create a heatmap.
	var heatmap = new google.maps.visualization.HeatmapLayer({
	data: [],
	map: map,
	radius: 8
});
  
  firebase.on("child_added", function(snapshot, prevChildKey) {
  // Get latitude and longitude from Firebase.
  var newPosition = snapshot.val();

  // Create a google.maps.LatLng object for the position of the marker.
  // A LatLng object literal (as above) could be used, but the heatmap
  // in the next step requires a google.maps.LatLng object.
  var latLng = new google.maps.LatLng(newPosition.lat, newPosition.lng);

  heatmap.getData().push(latLng);
});

	var infoWindow = new google.maps.InfoWindow({map: map});
   
   // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
  
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}
