var osmUrl = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    osmAttrib =
    '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    osm = L.tileLayer(osmUrl, {
        maxZoom: 18,
        attribution: osmAttrib
    }),
    map = new L.Map('map', {
        center: new L.LatLng(59.9375, 30.308611),
        zoom: 13,
        zoomControl: false
    }),
    drawnItems = L.featureGroup().addTo(map);

L.control
    .layers({
        'По-умолчанию': osm.addTo(map),
        'Спутник': L.tileLayer(
            "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}", {
                attribution: "google",
            }
        ),
    }, {
        'Отображать маршрут': drawnItems
    }, {
        position: "topright",
        collapsed: false
    })
    .addTo(map);

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();

    if (!L.Browser.touch) {
        L.DomEvent
            .disableClickPropagation(this._div)
            .disableScrollPropagation(this._div);
    } else {
        L.DomEvent.on(this._div, 'dblclick', L.DomEvent.stopPropagation);
    }

    return this._div;
};

info.update = function (props) {
    console.log(props)
    this._div.innerHTML = props ? (`<h5>${props.name}</h5  >` + 'Протяженность: ' + props.length + ' км') : "Маршрут не загружен"
};

info.addTo(map);

L.control.zoom({
    position: 'bottomleft'
}).addTo(map);

map.addControl(
    new L.Control.Draw({
        edit: {
            featureGroup: drawnItems,
            poly: {
                allowIntersection: true,
            },
        },
        draw: {
            poly: {
                shapeOptions: {
                    color: '#00008b'
                }
            },

            polygon: false,
            circle: false,
            circlemarker: false,
            rectangle: false

        },
    })
);

map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer;

    if (event.layerType === 'marker') {

        layer.addEventListener('dblclick', function (e) {

            var name = ''
            var desc = ''

            $("#editpopup").modal()
            document.getElementById('edit-popup-modal-input-name').value =
                name
            document.getElementById('edit-popup-modal-input-desc').value =
                desc
            currentPopup = layer

        });
    }

    drawnItems.addLayer(layer);
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// document.getElementById('saveAndUpload').onclick = function (e) {
//     // Extract GeoJson from featureGroup
//     var data = drawnItems.toGeoJSON();

//     // Stringify the GeoJson
//     var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

//     // Convert to .gpx

//     // Create export
//     let csrf_token = getCookie('csrftoken')

//     $.ajax({
//         headers: {
//             "X-CSRFToken": csrf_token,
//             'CSRFToken': csrf_token
//         },
//         type: "POST",
//         contentType: 'application/json; charset=utf-8',
//         data: JSON.stringify(data),
//         dataType: 'text',
//         success: function (result) {
//             alert(result.Result);
//         }
//     });

//     document.getElementById('export').setAttribute('href', 'data:' + convertedData);
//     document.getElementById('export').setAttribute('download', 'data.geojson');
// }

document.getElementById('export').onclick = function (e) {
    console.log('Exporting')
    // Extract GeoJson from featureGroup
    var data = drawnItems.toGeoJSON();

    // Stringify the GeoJson
    var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

    // Convert to .gpx

    // Create export
    document.getElementById('export').setAttribute('href', 'data:' + convertedData);
    document.getElementById('export').setAttribute('download', 'data.geojson');
}