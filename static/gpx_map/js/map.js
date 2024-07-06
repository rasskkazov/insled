// Интерактивная карта

function debounce(func, ms) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), ms);
  };
}

var osmUrl = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  osmAttrib =
    '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  osm = L.tileLayer(osmUrl, {
    maxZoom: 18,
    attribution: osmAttrib,
  }),
  map = new L.Map("map", {
    center: new L.LatLng(59.9375, 30.308611),
    zoom: 13,
    zoomControl: false,
  }),
  drawnItems = L.featureGroup().addTo(map);

L.control
  .layers(
    {
      "По-умолчанию": osm.addTo(map),
      Спутник: L.tileLayer(
        "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}",
        {
          attribution: "google",
        }
      ),
    },
    {
      "Отображать маршрут": drawnItems,
    },
    {
      position: "topright",
      collapsed: false,
    }
  )
  .addTo(map);

var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info");
  this.update();

  if (!L.Browser.touch) {
    L.DomEvent.disableClickPropagation(this._div).disableScrollPropagation(
      this._div
    );
  } else {
    L.DomEvent.on(this._div, "dblclick", L.DomEvent.stopPropagation);
  }

  return this._div;
};

info.update = function (props) {
  this._div.innerHTML = props
    ? `<h5>${props.name}</h5  >` + "Протяженность: " + props.length + " км"
    : "Маршрут не загружен";
};

info.addTo(map);

L.control
  .zoom({
    position: "bottomleft",
  })
  .addTo(map);

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
          color: "#00008b",
        },
      },
      circlemarker: false,
      polygon: false,
      circle: false,
      rectangle: false,
    },
  })
);

var routingControl = L.Routing.control({
  waypoints: [],
  createMarker: function () {
    return null;
  },
  routeWhileDragging: true,
  addWaypoints: false,
  show: false,
}).addTo(map);
const markers = new Map();
let autoRouteIdCounter = 1;

map.on(L.Draw.Event.CREATED, function (event) {
  var layer = event.layer;

  if (event.layerType === "marker") {
    layer.addEventListener("dblclick", function (e) {
      var name = "";
      var desc = "";

      $("#editpopup").modal();
      document.getElementById("edit-popup-modal-input-name").value = name;
      document.getElementById("edit-popup-modal-input-desc").value = desc;
      currentPopup = layer;
    });

    layer.options.autoId = autoRouteIdCounter++;

    markers.set(layer.options.autoId, layer.getLatLng());
    routingControl.setWaypoints([...markers.values()]);
  }

  drawnItems.addLayer(layer);
});

const debouncedUpdateOnMove = debounce((layer) => {
  markers.set(layer.options.autoId, layer.getLatLng());
  routingControl.setWaypoints([...markers.values()]);
}, 250);

map.on(L.Draw.Event.EDITMOVE, function (event) {
  const layer = event.layer;
  if (Object.hasOwn(layer.options, "autoId")) {
    debouncedUpdateOnMove(layer);
  }
});

map.on(L.Draw.Event.DELETED, function (event) {
  event.layers.eachLayer((layer) => {
    markers.delete(layer.options.autoId);
  });
  routingControl.setWaypoints([...markers.values()]);
});

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

document.getElementById("export").onclick = function (e) {
  var data = drawnItems.toGeoJSON();

  var gpxData = GeoJsonToGpx(data);

  var serializer = new XMLSerializer();
  var gpxString = serializer.serializeToString(gpxData);
  var blob = new Blob([gpxString], { type: "application/gpx+xml" });
  var url = URL.createObjectURL(blob);

  document.getElementById("export").setAttribute("href", url);
  document.getElementById("export").setAttribute("download", "data.gpx");
};
