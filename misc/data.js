exports.data = function () {
    return {
        locations: [
            {
                title: 'Paris Las Vegas',
                location: {
                    lat: 36.1125414,
                    lng: -115.1728592
                },
                serviceType: "Casino",
                attributes: {
                    index: 0,
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
                    index: 1,
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
                    index: 2,
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
                    index: 3,
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
                    index: 4,
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
                    index: 5,
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
                    index: 6,
                    yelpId: "bacchanal-buffet-las-vegas-7"
                }
            }
        ],
        styles: [
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
        ]
    }
}
