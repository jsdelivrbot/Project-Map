let map;

// Create a new blank array for all the listing markers.
const markers = [];
let yelpReviews = {};
let locations = [];
// This global polygon variable is to ensure only ONE polygon is rendered.
let polygon = null;
let styles = [];
let bounds = {};


// Create placemarkers array to use in multiple functions to have control
// over the number of places that show
const placeMarkers = [];

// noinspection JSUnusedGlobalSymbols
function initMap() {
    getLocations();
}

function initMapInner() {
    let marker;

    // Constructor creates a new map - only center and zoom are required
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 36.1116122,
            lng: -115.173107
        },
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });

    const largeInfoWindow = new google.maps.InfoWindow();


    // Initialize the drawing manager
    const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYGON
            ]
        }
    });


    // Style the markers a bit. This will be our listing marker icon
    const defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user mouses over the marker
    const highlightedIcon = makeMarkerIcon('FFFF24');

    locationWrapperInner = function (obj) {
        const index = obj.attributes.index;
        marker = markers[index];
        populateInfoWindow(marker, largeInfoWindow, obj.attributes.yelpId);
    }

    // The following group uses the location array to create an array of markers on initialize
    for (let location of locations) {
        // Get the position from the location array
        let position = location.location;

        // Create a marker per location, and put into markers array
        marker = new google.maps.Marker({
            position: position,
            title: location.title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: location.attributes.index,
            yelpId: location.attributes.yelpId
        });
        marker.enabled = true;
        marker.serviceType = location.serviceType;

        markers.push(marker);
        let yelpId = marker.yelpId;
        // Create an onclick event to open the large infowindow at each marker
        marker.addListener('click', function () {
            populateInfoWindow(this, largeInfoWindow, yelpId);
            map.panTo(marker.getPosition());
        });

        // Two event listeners for mouseover and for mouseout to change the colors back and forth
        marker.addListener('mouseover', function () {
            this.setIcon(highlightedIcon);
        });

        marker.addListener('mouseout', function () {
            this.setIcon(defaultIcon);
        });
    }
    showListings();


    // Add an event listener so that the polygon is captured,  call the
    // searchWithinPolygon function. This will show the markers in the polygon,
    // and hide any outside of it
    drawingManager.addListener('overlaycomplete', function (event) {
        // First, check if there is an existing polygon
        // If there is, get rid of it and remove the markers
        if (polygon) {
            polygon.setMap(null);
            hideMarkers(markers);
        }

        // Switching the drawing mode to the HAND (i.e., no longer drawing)
        drawingManager.setDrawingMode(null);

        // Creating a new editable polygon from the overlay
        polygon = event.overlay;
        polygon.setEditable(true);

        // Searching within the polygon
        searchWithinPolygon(polygon);

        // Make sure the search is re-done if the poly is changed
        polygon.getPath().addListener('set_at', searchWithinPolygon);
        polygon.getPath().addListener('insert_at', searchWithinPolygon);
    });
    filterListingsByType(true);
    google.maps.event.addDomListener(window, 'resize', function () {
        map.fitBounds(bounds);
    });
}


// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position
function populateInfoWindow(marker, infowindow, yelpId) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(4);
        //  setTimeout('marker.setAnimation(null)',4000);
    }

    // Check to make sure the infowindow is not already opened on this marker
    if (infowindow.marker !== marker) {
        // Clear the infowindow content to give the streetview time to load
        infowindow.setContent('');
        infowindow.marker = marker;

        // Make sure the marker property is cleared if the infowindow is closed
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
        });

        const streetViewService = new google.maps.StreetViewService();
        const radius = 50;

        // In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options
        function getStreetView(data, status) {
            if (status === google.maps.StreetViewStatus.OK) {
                const nearStreetViewLocation = data.location.latLng;
                const heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);

                let infoWindowContent = '<div>' + marker.title + '</div><div id="pano"></div><div id="yelpReviews"><ul>';
                if (yelpReviews && yelpReviews[yelpId]) {
                    for (let review of yelpReviews[yelpId]) {
                        infoWindowContent += `<li>${review.text}</li>`;
                    }
                }
                infoWindowContent += "</ul></div>";
                infowindow.setContent(infoWindowContent);

                const panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };

                //this is needed to display the street view in the popup
                const panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);

            }

            else {
                let infoWindowContent = '<div>' + marker.title + '</div>' + '<div>No Street View Found</div><div id="yelpReviews"><ul>';
                for (let review of yelpReviews[yelpId]) {
                    infoWindowContent += `<li>${review.text}</li>`;
                }
                infoWindowContent += "</ul></div>";
                infowindow.setContent(infoWindowContent);

            }
        }

        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);

        // Open the infowindow on the correct marker
        infowindow.open(map, marker);
    }
}


// This function will loop through the markers array and display them all
function showListings() {
    bounds = new google.maps.LatLngBounds();

    // Extend the boundaries of the map for each marker and display the marker
    for (let i = 0; i < markers.length; i++) {
        const marker = markers[i];
        if (marker.enabled) {
            marker.setMap(map);
        }
        bounds.extend(markers[i].position);
    }

    map.fitBounds(bounds);
}


// This function will loop through the listings and hide them all
function hideMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}


// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34)
function makeMarkerIcon(markerColor) {
    return new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
}


// This shows and hides (respectively) the drawing options
function toggleDrawing(drawingManager) {
    if (drawingManager.map) {
        drawingManager.setMap(null);

        // In case the user drew anything, get rid of the polygon
        if (polygon !== null) {
            polygon.setMap(null);
        }
    } else {
        drawingManager.setMap(map);
    }
}


// This function hides all markers outside the polygon,
// and shows only the ones within it. This is so that the
// user can specify an exact area of search
function searchWithinPolygon() {
    for (let i = 0; i < markers.length; i++) {
        //global google
        if (google.maps.geometry.poly.containsLocation(markers[i].position, polygon)) {
            markers[i].setMap(map);
        } else {
            markers[i].setMap(null);
        }
    }
}

function FilterMarkers(optionValue) {
    for (let marker of markers) {
        if (optionValue.indexOf(marker.serviceType) !== -1) {
            marker.enabled = true;
        } else {
            marker.enabled = false;
            marker.setMap(null);
        }
    }
    showListings();
}

function displayDirections(origin) {
    hideMarkers(markers);
    const directionsService = new google.maps.DirectionsService;

    // Get the destination address from the user entered value
    const destinationAddress =
        document.getElementById('search-within-time-text').value;

    // Get mode again from the user entered value
    const mode = document.getElementById('mode').value;

    directionsService.route({
        // The origin is the passed in marker's position
        origin: origin,
        // The destination is user entered address
        destination: destinationAddress,
        travelMode: google.maps.TravelMode[mode]
    }, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            const directionsDisplay = new google.maps.DirectionsRenderer({
                map: map,
                directions: response,
                draggable: true,
                polylineOptions: {
                    strokeColor: 'green'
                }
            });
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

// This function creates markers for each place found in either places search
function createMarkersForPlaces(places) {
    bounds = new google.maps.LatLngBounds();

    for (let i = 0; i < places.length; i++) {
        const place = places[i];
        const icon = {
            url: place.icon,
            size: new google.maps.Size(35, 35),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15, 34),
            scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place
        const marker = new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location,
            id: place.place_id
        });

        // Create a single infowindow to be used with the place details information
        // so that only one is open at once
        const placeInfoWindow = new google.maps.InfoWindow();

        // If a marker is clicked, do a place details search on it in the next function
        marker.addListener('click', function () {
            if (placeInfoWindow.marker === this) {
                console.log("This infowindow already is on this marker!");
            } else {
                getPlacesDetails(this, placeInfoWindow);

            }
        });

        placeMarkers.push(marker);
        if (place.geometry.viewport) {

            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
    }
    map.fitBounds(bounds);
}

// This is the PLACE DETAILS search - it's the most detailed so it's only
// executed when a marker is selected, indicating the user wants more
// details about that place.
function getPlacesDetails(marker, infowindow) {
    const service = new google.maps.places.PlacesService(map);
    service.getDetails({
        placeId: marker.id
    }, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Set the marker property on this infowindow so it isn't created again.
            infowindow.marker = marker;
            let innerHTML = '<div>';
            if (place.name) {
                innerHTML += '<strong>' + place.name + '</strong>';
            }
            if (place.formatted_address) {
                innerHTML += '<br>' + place.formatted_address;
            }
            if (place.formatted_phone_number) {
                innerHTML += '<br>' + place.formatted_phone_number;
            }
            if (place.opening_hours) {
                innerHTML += '<br><br><strong>Hours:</strong><br>' +
                    place.opening_hours.weekday_text[0] + '<br>' +
                    place.opening_hours.weekday_text[1] + '<br>' +
                    place.opening_hours.weekday_text[2] + '<br>' +
                    place.opening_hours.weekday_text[3] + '<br>' +
                    place.opening_hours.weekday_text[4] + '<br>' +
                    place.opening_hours.weekday_text[5] + '<br>' +
                    place.opening_hours.weekday_text[6];
            }
            if (place.photos) {
                innerHTML += '<br><br><img src="' + place.photos[0].getUrl({
                    maxHeight: 100,
                    maxWidth: 200
                }) + '">';
            }
            innerHTML += '</div>';
            infowindow.setContent(innerHTML);
            infowindow.open(map, marker);

            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function () {
                infowindow.marker = null;
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    viewModel = {
        Locations: ko.observableArray()
    };
    ko.applyBindings(viewModel);
});

function getLocations() {
    const yelpBaseurl = `/data/`;
    const xhttp = new XMLHttpRequest();
    xhttp.open("Get", yelpBaseurl, true);
    xhttp.send(null);
    xhttp.onreadystatechange = function () {
        if (xhttp.status === 200) {
            switch (xhttp.readyState) {
                case 1:
                case 2:
                case 3:
                    console.log("Locations request in progress, state:" + xhttp.readyState);
                    break;
                case 4:
                    try
                    {
                        var data = JSON.parse(xhttp.responseText);
                        locations = data.locations;
                        styles = data.styles;
                        for (let location of locations) {
                            populateYelpReviews(location.attributes.yelpId);
                        }
                        initMapInner();
                    }
                    catch(e)
                    {
                        alert("Server error:" + e);
                    }
                    break;
                default:
                    alert("Unknown request state");
            }
        }
        else {
            alert("Couldn't get locations from server");
        }
    }
    xhttp.onerror = function () {
        alert("Couldn't get locations from server");
    }
}

function populateYelpReviews(yelpId) {
    const yelpBaseurl = `/yelpReviews/${yelpId}`;
    const xhttp = new XMLHttpRequest();
    xhttp.open("Get", yelpBaseurl, true);
    xhttp.send(null);
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            const searchResponse = JSON.parse(xhttp.responseText);
            let reviews = searchResponse.reviews;
            yelpReviews[yelpId] = reviews ? reviews : [{text: "No yelp review found for this location"}];
        } else {
            yelpReviews[yelpId] = [{text: "Error getting Yelp review for this location"}];
        }
    }
    xhttp.onerror = function () {
        yelpReviews[yelpId] = [{text: "Error getting Yelp review for this location"}];
    }
}

//dummy for viewModel to have global scope
let viewModel = {};

var locationWrapperInner = function () {
};

function locationClickWrapper(obj) {
    //necessary, to allow locationWrapperInner access to the correct scope
    locationWrapperInner(obj);
}

function filterListingsByType(init) {
    var selectElement = document.getElementById("filterBy");
    var optionValue = selectElement.options[selectElement.selectedIndex].value;
    for (let location of locations) {
        if (optionValue.indexOf(location.serviceType) !== -1 && viewModel.Locations.indexOf(location) === -1) {
            viewModel.Locations.push(location);
        } else if (optionValue.indexOf(location.serviceType) === -1 && viewModel.Locations.indexOf(location) !== -1) {
            viewModel.Locations.remove(location);
        }
    }

    if (!init) {
        showListings();
        FilterMarkers(optionValue);
    }
}
 function mapLoadError(){
    alert("failed to load the map");
 }