let map;


// Create a new blank array for all the listing markers.
const markers = [];
yelpReviews = {};
let locations = [
    {
        title: 'Paris Las Vegas',
        location: {
            lat: 36.1125414,
            lng: -115.1728592
        },
        serviceType: "Casino",
        attributes: {
            id: 0,
            yelpId: "paris-las-vegas-hotel-and-casino-las-vegas"
        }
    },
    {
        title: 'Planet Hollywood Resort & Casino',
        location: {
            lat: 36.1099696,
            lng: -115.1722533
        },
        serviceType: "Casino",
        attributes: {
            id: 1,
            yelpId: "planet-hollywood-las-vegas-resort-and-casino-las-vegas"
        }
    },
    {
        title: 'ARIA Resort & Casino Las Vegas',
        location: {
            lat: 36.1072611,
            lng: -115.1758354
        },
        serviceType: "Casino",
        attributes: {
            id: 2,
            yelpId: "aria-resort-and-casino-las-vegas-5"
        }
    },
    {
        title: 'Ellis Island Casino & Brewery',
        location: {
            lat: 36.113063,
            lng: -115.1656757
        },
        serviceType: "Casino",
        attributes: {
            id: 3,
            yelpId: "ellis-island-hotel-casino-and-brewery-las-vegas"
        }
    },
    {
        title: 'The Mirage',
        location: {
            lat: 36.1211957,
            lng: -115.1762622
        },
        serviceType: "Casino",
        attributes: {
            id: 4,
            yelpId: "the-mirage-las-vegas-3"
        }
    },
    {
        title: 'The Cheesecake Factory',
        location: {
            lat: 36.1192575,
            lng: -115.1787052
        },
        serviceType: "Food",
        attributes: {
            id: 5,
            yelpId: "The+Cheesecake+Factory"
        }
    },
    {
        title: 'Bacchanal Buffet',
        location: {
            lat: 36.117746,
            lng: -115.1781976
        },
        serviceType: "Food",
        attributes: {
            id: 6,
            yelpId: "bacchanal-buffet-las-vegas-7"
        }
    }
];
// This global polygon variable is to ensure only ONE polygon is rendered.
let polygon = null;


// Create placemarkers array to use in multiple functions to have control
// over the number of places that show
const placeMarkers = [];

// noinspection JSUnusedGlobalSymbols
function initMap() {
    let marker;

// Create a styles array to use with the map
    const styles = [
        {
            featureType: 'water',
            stylers: [
                {
                    color: '#19a0d8'
                }
            ]
        }, {
            featureType: 'administrative',
            elementType: 'labels.text.stroke',
            stylers: [
                {
                    color: '#ffffff'
                },
                {
                    weight: 6
                }
            ]
        }, {
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#e85113'
                }
            ]
        }, {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
                {
                    color: '#efe9e4'
                },

                {
                    lightness: -40
                }
            ]
        }, {
            featureType: 'transit.station',
            stylers: [
                {
                    weight: 9
                },
                {
                    hue: '#e85113'
                }
            ]

        }, {
            featureType: 'road.highway',
            elementType: 'labels.icon',
            stylers: [
                {
                    visibility: 'off'
                }
            ]
        }, {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [
                {
                    lightness: 100
                }
            ]
        }, {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    lightness: -100
                }
            ]
        }, {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
                {
                    visibility: 'on'
                },
                {
                    color: '#f0e4d3'
                }
            ]
        }, {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [{
                color: '#efe9e4'
            },
                {
                    lightness: -25
                }
            ]
        }
    ];

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


    // This autocomplete is for use in the search within time entry box
    // noinspection JSUnusedLocalSymbols
    const timeAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('search-within-time-text'));

    // This autocomplete is for use in the geocoder entry box
    const zoomAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('zoom-to-area-text'));

    // Bias the boundaries within the map for the zoom to area text
    zoomAutocomplete.bindTo('bounds', map);

    // Create a searchbox in order to execute a places search
    const searchBox = new google.maps.places.SearchBox(
        document.getElementById('places-search'));

    // Bias the searchbox to within the bounds of the map
    searchBox.setBounds(map.getBounds());

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
        const position = obj.id;
        marker = markers[position];
        populateInfoWindow(marker, largeInfoWindow, obj.getAttribute("yelpId"));
    };

    for (let i = 0; i < locations.length; i++) {
        // Get the position from the location array
        const title = locations[i].title;

        const locationButton = document.createElement("button");
        locationButton.id = i;
        locationButton.innerHTML = title;
        locationButton.setAttribute("yelpId", locations[i].yelpId);


        // 2. Append somewhere
        // var body = document.getElementById("listing");
        // body.appendChild(locationButton);
        // body.innerHTML += "<br>";


    }

    // for (var i = 0; i < locations.length; i++)
    //     document.getElementById(i).addEventListener('click', function () {
    //         locationClick(this);
    //     });


    //     document.getElementById("listing").innerHTML += title + "<br>"; }
    //      var listing = new listing({
    //       name: title,
    //       position: position
    //      });}


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
            id: location.attributes.id,
            yelpId: location.attributes.yelpId
        });
        marker.enabled = true;
        marker.serviceType = location.serviceType;

        markers.push(marker);
        let yelpId = marker.yelpId;
        // Create an onclick event to open the large infowindow at each marker
        marker.addListener('click', function () {
            populateInfoWindow(this, largeInfoWindow, yelpId);
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

    // Push the marker to our array of markers
    document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', function () {
        hideMarkers(markers);
    });


    document.getElementById('toggle-drawing').addEventListener('click', function () {

        toggleDrawing(drawingManager);
    });


    document.getElementById('zoom-to-area').addEventListener('click', function () {

        zoomToArea();
    });


    document.getElementById('search-within-time').addEventListener('click', function () {
        searchWithinTime();
    });


    // Listen for the event fired when the user selects a prediction from the
    // picklist and retrieve more details for that place
    searchBox.addListener('places_changed', function () {
        searchBoxPlaces(this);
    });


    // Listen for the event fired when the user selects a prediction and clicks
    // "go" more details for that place
    document.getElementById('go-places').addEventListener('click', textSearchPlaces);


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
                for (let review of yelpReviews[yelpId]) {
                    infoWindowContent += `<li>${review.text}</li>`;
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

            } else {
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
    const bounds = new google.maps.LatLngBounds();

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
function hideMarkers(markers) {
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


// This function takes the input value in the find nearby area text input
// locates it, and then zooms into that area. This is so that the user can
// show all listings, then decide to focus on one area of the map
function zoomToArea() {
    // Initialize the geocoder
    const geocoder = new google.maps.Geocoder();

    // Get the address or place that the user entered
    const address = document.getElementById('zoom-to-area-text').value;

    // Make sure the address isn't blank
    if (address === '') {
        window.alert('You must enter an area, or address.');
    } else {
        // Geocode the address/area entered to get the center. Then, center the map
        // on it and zoom in
        geocoder.geocode({
            address: address
        }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                map.setZoom(15);
            } else {
                window.alert('We could not find that location - try entering a more' +
                    ' specific place.');
            }
        });
    }
}


// This function allows the user to input a desired travel time, in
// minutes, and a travel mode, and a location - and only show the listings
// that are within that travel time (via that travel mode) of the location
function searchWithinTime() {
    // Initialize the distance matrix service
    const distanceMatrixService = new google.maps.DistanceMatrixService;
    const address = document.getElementById('search-within-time-text').value;

    // Check to make sure the place entered isn't blank
    if (address === '') {
        window.alert('You must enter an address.');
    } else {
        hideMarkers(markers);

        // Use the distance matrix service to calculate the duration of the
        // routes between all our markers, and the destination address entered
        // by the user. Then put all the origins into an origin matrix
        const origins = [];
        for (let i = 0; i < markers.length; i++) {
            origins[i] = markers[i].position;
        }

        const destination = address;
        const mode = document.getElementById('mode').value;

        // Now that both the origins and destination are defined, get all the
        // info for the distances between them
        distanceMatrixService.getDistanceMatrix({
            origins: origins,
            destinations: [destination],
            travelMode: google.maps.TravelMode[mode],
            unitSystem: google.maps.UnitSystem.IMPERIAL,
        }, function (response, status) {
            if (status !== google.maps.DistanceMatrixStatus.OK) {
                window.alert('Error was: ' + status);
            } else {
                displayMarkersWithinTime(response);
            }
        });
    }
}


// This function will go through each of the results and
// if the distance is LESS than the value in the picker, show it on the map
function displayMarkersWithinTime(response) {
    const maxDuration = document.getElementById('max-duration').value;
    const origins = response.originAddresses;

    const destinations = response.destinationAddresses;

    // Parse through the results, and get the distance and duration of each
    // Because there might be  multiple origins and destinations we have a nested loop
    // Then, make sure at least 1 result was found
    let atLeastOne = false;

    for (let i = 0; i < origins.length; i++) {
        const results = response.rows[i].elements;
        for (let j = 0; j < results.length; j++) {
            const element = results[j];
            if (element.status === "OK") {
                // The distance is returned in feet, but the TEXT is in miles. If we wanted to switch
                // the function to show markers within a user-entered DISTANCE, we would need the
                // value for distance, but for now we only need the text
                const distanceText = element.distance.text;

                // Duration value is given in seconds so we make it MINUTES. We need both the value
                // and the text
                const duration = element.duration.value / 60;

                const durationText = element.duration.text;
                if (duration <= maxDuration) {
                    //the origin [i] should = the markers[i]
                    markers[i].setMap(map);

                    atLeastOne = true;

                    // Create a mini infowindow to open immediately and contain the
                    // distance and duration
                    const infowindow = new google.maps.InfoWindow({
                        content: `${durationText} away, ${distanceText}<div><input type="button" value="View Route" onclick ="displayDirections(&quot;${origins[i]}&quot;);"/></div>`
                    });

                    infowindow.open(map, markers[i]);

                    // Put this in so that this small window closes if the user clicks
                    // the marker, when the big infowindow opens
                    markers[i].infowindow = infowindow;

                    google.maps.event.addListener(markers[i], 'click', function () {
                        this.infowindow.close();
                    });
                }
            }
        }
    }

    if (!atLeastOne) {
        window.alert('We could not find any locations within that distance!');
    }
}


// This function is in response to the user selecting "show route" on one
// of the markers within the calculated distance. This will display the route on the map


// Make an array for the filter function
const FilterFoodMarkers = []; //placeMarkers
const FilterCasinoMarkers = [];

//FilterFoodMarkers.push(marker);

// for (var i = 0; i < markers.length; i++) {

//      FilterFoodMarkers[i] = markers[i].id('Food');
//      }

//    var destination = address;


//FilterCasinoMarkers.push(marker);

// for (var i = 0; i < markers.length; i++) {

//      FilterCasinoMarkers[i] = markers[i].id('Casino');
//    }


function FilterMarkers(optionValue) {
    if (optionValue === 'Food') {

        for (let marker of markers) {
            if (marker.serviceType !== "Food") {
                marker.enabled = false;
                marker.setMap(null);
            } else {
                marker.enabled = true;
            }
        }
    } else if (optionValue === 'Casino') {

        for (let marker of markers) {
            if (marker.serviceType !== "Casino") {
                marker.enabled = false;
                marker.setMap(null);
            } else {
                marker.enabled = true;
            }
        }
    } else if (optionValue === 'Casino|Food') {

        for (let marker of markers) {
            marker.enabled = true;
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


// This function fires when the user selects a searchbox picklist item
// It will do a nearby search using the selected query string or place
function searchBoxPlaces(searchBox) {
    hideMarkers(placeMarkers);
    const places = searchBox.getPlaces();

    if (places.length === 0) {
        window.alert('We did not find any places matching that search!');
    } else {
        // For each place, get the icon, name and location
        createMarkersForPlaces(places);
    }
}


// This function fires when the user selects "go" on the places search
// It will do a nearby search using the entered query string or place
function textSearchPlaces() {
    const bounds = map.getBounds();
    hideMarkers(placeMarkers);
    const placesService = new google.maps.places.PlacesService(map);
    placesService.textSearch({
        query: document.getElementById('places-search').value,
        bounds: bounds
    }, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            createMarkersForPlaces(results);
        }
    });
}

// This function creates markers for each place found in either places search
function createMarkersForPlaces(places) {
    const bounds = new google.maps.LatLngBounds();

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

for (let location of locations) {
    populateYelpReviews(location.attributes.yelpId);
}

document.addEventListener("DOMContentLoaded", function () {
    viewModel = {
        Locations: ko.observableArray()
    };
    ko.applyBindings(viewModel);
    filterByType(true);
});

function populateYelpReviews(yelpId) {
    const yelpBaseurl = `/yelpReviews/${yelpId}`;
    const xhttp = new XMLHttpRequest();
    xhttp.open("Get", yelpBaseurl, true);
    xhttp.send(null);
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            const searchResponse = JSON.parse(xhttp.responseText);
            let reviews = searchResponse.reviews;
            yelpReviews[yelpId] = reviews ? searchResponse.reviews : [{text: "No yelp review found for this location"}];
        }
    }
}

//dummy for viewModel to have global scope
let viewModel = {};

var locationWrapperInner = function () {
};

function locationClickWrapper(obj) {
    locationWrapperInner(obj);
}

function filterByType(init) {
    var selectElement = document.getElementById("filterBy");
    var optionValue = selectElement.options[selectElement.selectedIndex].value;
    for (let location of locations) {
        if (optionValue.indexOf(location.serviceType) !== -1 && viewModel.Locations.indexOf(location) === -1) {
            viewModel.Locations.push(location);
        } else if (optionValue.indexOf(location.serviceType) === -1 && viewModel.Locations.indexOf(location) !== -1) {
            viewModel.Locations.remove(location);
        }
    }

    if(!init){
        FilterMarkers(optionValue);
    }
}