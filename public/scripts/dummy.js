//dummy file to make WebStorm happy
var google = {
    maps: {
        TravelMode:[],
        DistanceMatrixService:function(){
            return {
                getDistanceMatrix:function(){}
            }
        },
        DirectionsService:function(){
            return {
                route:function(){}
            }
        },
        Geocoder:function(){
            return {
                geocode:function(){}
            }
        },
        MarkerImage:function(){},
        DirectionsRenderer:function(){},
        Size:function(){},
        Point:function(){},
        LatLngBounds:function(){
            return {
                extend:function(){},
                union:function(){}
            }
        },
        PlacesService:function(){
            return {
                textSearch:function(){},
                getDetails:function(){}
            }
        },
        StreetViewService:function(){
            return {
                getPanoramaByLocation:function(){}
            }
        },
        geometry: {
            poly: {
                containsLocation: {}
            },
            spherical:{
                computeHeading:function(){}
            }
        },
        drawing:{
            DrawingManager:function(){
                return {
                    setDrawingMode:function () {}
                }
            },
            OverlayType:{
                POLYGON:0
            }
        },
        InfoWindow:function () {},
        ControlPosition:{
            TOP_LEFT:0
        },
        places:{
            Autocomplete:function () {
                return {
                    bindTo:function () {}
                }
            },
            SearchBox:function(){
                return {
                    setBounds:function(){}
                }
            }
        },
        Map:function(){},
        Marker:function(){},
        Animation:{
            DROP:0
        },
        StreetViewPanorama:function(){},
        StreetViewStatus:{
            OK:0
        },
        GeocoderStatus:{
            OK:0
        },
        PlacesServiceStatus:{
            OK:0
        },
        DistanceMatrixStatus:{
            OK:0
        },
        DirectionsStatus:{
            OK:0
        },
        UnitSystem:{
            IMPERIAL:0
        }
    }
};
var data = {
    location:{
        latLng:{}
    }
}
var marker={
    setAnimation:function(){},
    getAnimation:function(){}
};
var event={
    overlay:{}
};
var infowindow={
    setContent:function(){}
};
function setIcon(){};
function setMap(){};
var polygon = {
    setEditable:function(){},
    getPath:function(){},
    setMap:function(){}
};
var searchBox = {
    getPlaces:function(){}
};
var map = {
    getBounds:function () {},
    fitBounds:function(){},
    setCenter:function(){},
    setZoom:function(){},
};
var response = {
    destinationAddresses: [],
    originAddresses: []
};
var places = [
    {
        place_id:1,
        icon:{},
        geometry:{
            viewport:{}
        }
    }
]
var place = {
    formatted_address:"",
    formatted_phone_number:"",
    opening_hours:{
        weekday_text:[]
    },
    photos:[
        {
            getUrl:function(){}
        }
    ]
}