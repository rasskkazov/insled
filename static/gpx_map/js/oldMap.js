//creating map and controls 

// L.CursorHandler = L.Handler.extend({

//     addHooks: function () {
//         this._popup = new L.Popup();
//         this._map.on('mouseover', this._open, this);
//         this._map.on('mousemove', this._update, this);
//         this._map.on('mouseout', this._close, this);
//     },

//     removeHooks: function () {
//         this._map.off('mouseover', this._open, this);
//         this._map.off('mousemove', this._update, this);
//         this._map.off('mouseout', this._close, this);
//     },

//     _open: function (e) {
//         this._update(e);
//         this._popup.openOn(this._map);
//     },

//     _close: function () {
//         this._map.closePopup(this._popup);
//     },

//     _update: function (e) {
//         this._popup.setLatLng(e.latlng)
//             .setContent(e.latlng.toString());
//     }

// });

// L.Map.addInitHook('addHandler', 'cursor', L.CursorHandler);

// var info = L.control();

// info.onAdd = function (map) {
//     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
//     this.update();
//     return this._div;
// };

// info.update = function (props) {
//     this._div.innerHTML = '<h4>Cursor position</h4>' +  (props ?
//         '<b>' + props.lat + props.lon + ' people / mi<sup>2</sup>'
//         : 'Cursor pos data');
// };


let trackLayer = L.layerGroup();

let mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

let streets = L.tileLayer(mbUrl, {
        id: 'mapbox/streets-v11',
        tileSize: 512,
        drawControl: true,
        zoomOffset: -1,
        attribution: mbAttr
    }),
    satellite = L.tileLayer(mbUrl, {
        id: 'mapbox/satellite-v9',
        tileSize: 512,
        zoomOffset: -1,
        attribution: mbAttr
    });


// let map = L.map('mapid', {
//     center: [50.716779660433531, 6.445616148412228],
//     zoom: 16,
//     zoomControl: false,
//     //cursor: true,
//     layers: [trackLayer, streets]
// });


var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    osm = L.tileLayer(osmUrl, {
        maxZoom: 18,
        attribution: osmAttrib
    }),
    map = new L.Map('mapid', {
        center: new L.LatLng(51.505, -0.04),
        zoom: 13
    }),
    drawnItems = L.featureGroup().addTo(map);

L.control.layers({
    'osm': osm.addTo(map),
    "google": L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
        attribution: 'google'
    })
}, {
    'drawlayer': drawnItems
}, {
    position: 'topright',
    collapsed: false
}).addTo(map);
map.addControl(new L.Control.Draw({
    edit: {
        featureGroup: drawnItems,
        poly: {
            allowIntersection: false
        }
    },
    draw: {
        polygon: false,
        rectangle: false,
        circle: false,
        circlemarker: false
    }
}));

map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer;

    drawnItems.addLayer(layer);
});



L.control.zoom({
    position: 'bottomleft'
}).addTo(map);

let baseLayers = {
    "Streets": streets,
    "Satellite": satellite
};

let overlays = {
    "Track": trackLayer
};

L.control.layers(baseLayers, overlays).addTo(map);

//info.addTo(map);

//Displaying track data from gpx file

const Draw = (data) => {
    L.geoJSON(data, {
        style: function (features) {
            return {color: feature.properties.color}
        }
    }).addTo(map)
}

function createTrack(track) {
    console.log("createTrack was called", track);
    let segments = track.segments;
    for (let i = 0; i < segments.length; i++) {
        createPolyline(segments[i]);
    }

    center = {
        "lat": segments[0].points[0].lat,
        "lon": segments[0].points[0].lon
    }

    prepareView(center)
}

function createPolyline(segment) {
    console.log("createPolyline was called", segment);
    let polylinePoints = createPolylinePoints(segment.points);

    new L.polyline(polylinePoints, {
        color: segment.color,
        weight: 5,

    }).addTo(trackLayer);

    // let polyline = new L.polyline(polylinePoints, {
    //     color: segment.color,
    //     weight: 5,

    //  });

    // polyline.addTo(trackLayer)

    // polyine.setStyle({
    //     weight: 5,
    //     opacity: 0.8,
    //     color: '#ff0000'
    // })
}

function createPolylinePoints(points) {
    console.log("createPolylinePoints was called", points);
    let polylinePoints = [];

    for (var i = 0; i < points.length; i++) {
        polylinePoints.push([points[i].lat, points[i].lon])
    }

    return polylinePoints;
}

function createWypoint(waypoint) {
    L.marker([waypoint.lat, waypoint.lon]).addTo(trackLayer).bindPopup(waypoint.name);
}

function addWaypoints(waypoints) {
    for (var i = 0; i < waypoints.length; i++) {
        createWypoint(waypoints[i]);
    }
}

function prepareView(center) {
    map.panTo(new L.LatLng(center.lat, center.lon));
    //set parametrs for map 
}