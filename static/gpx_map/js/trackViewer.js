// var osmUrl = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//   osmAttrib =
//     '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//   osm = L.tileLayer(osmUrl, {
//     maxZoom: 18,
//     attribution: osmAttrib,
//   }),
//   map = new L.Map("map", {
//     center: new L.LatLng(59.9375, 30.308611),
//     zoom: 13,
//     zoomControl: false,
//   }),
//   drawnItems = L.featureGroup().addTo(map);

// L.control
//   .layers(
//     {
//       osm: osm.addTo(map),
//       google: L.tileLayer(
//         "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}",
//         {
//           attribution: "google",
//         }
//       ),
//     },
//     {
//       drawlayer: drawnItems,
//     },
//     {
//       position: "topright",
//       collapsed: false,
//     }
//   )
//   .addTo(map);

// var info = L.control();

// info.onAdd = function (map) {
//   this._div = L.DomUtil.create("div", "info");
//   this.update();
//   return this._div;
// };

// info.update = function (props) {
//   console.log(props);
//   this._div.innerHTML = props
//     ? `<h5>${props.name}</h5  >` + "Протяженность: " + props.length + " км"
//     : "Нет информации";
// };

// info.addTo(map);

// L.control
//   .zoom({
//     position: "bottomleft",
//   })
//   .addTo(map);

// map.addControl(
//   new L.Control.Draw({
//     edit: {
//       featureGroup: drawnItems,
//       poly: {
//         allowIntersection: true,
//       },
//     },
//     draw: {
//       poly: {
//         shapeOptions: {
//           color: "#00008b",
//         },
//       },
//       circlemarker: false,
//       polygon: false,
//       circle: false,
//       rectangle: false,
//     },
//   })
// );

// var routingControl = L.Routing.control({
//   waypoints: [],
//   createMarker: function () {
//     return null;
//   },
//   routeWhileDragging: true,
//   addWaypoints: false,
//   show: false,
// }).addTo(map);
// const markers = new Map();
// let autoRouteIdCounter = 1;

// map.on(L.Draw.Event.CREATED, function (event) {
//   var layer = event.layer;

//   if (event.layerType === "marker") {
//     layer.addEventListener("dblclick", function (e) {
//       var name = "";
//       var desc = "";

//       $("#editpopup").modal();
//       document.getElementById("edit-popup-modal-input-name").value = name;
//       document.getElementById("edit-popup-modal-input-desc").value = desc;
//       currentPopup = layer;
//     });

//     layer.options.autoId = autoRouteIdCounter++;

//     markers.set(layer.options.autoId, layer.getLatLng());
//     routingControl.setWaypoints([...markers.values()]);
//   }

//   if (event.layerType !== "marker") {
//     layer.on("mouseover", function (e) {
//       var lat = e.latlng.lat;
//       var lng = e.latlng.lng;

//       var popup = L.popup().setLatLng(e.latlng).setContent(`0 км`).openOn(map);
//     });
//   }
//   drawnItems.addLayer(layer);
// });

// const debouncedUpdateOnMove = debounce((layer) => {
//   markers.set(layer.options.autoId, layer.getLatLng());
//   routingControl.setWaypoints([...markers.values()]);
// }, 250);

// map.on(L.Draw.Event.EDITMOVE, function (event) {
//   const layer = event.layer;
//   if (Object.hasOwn(layer.options, "autoId")) {
//     debouncedUpdateOnMove(layer);
//   }
// });

// map.on(L.Draw.Event.DELETED, function (event) {
//   event.layers.eachLayer((layer) => {
//     markers.delete(layer.options.autoId);
//   });
//   routingControl.setWaypoints([...markers.values()]);
// });

// document.getElementById("export").onclick = function (e) {
//   // Extract GeoJson from featureGroup
//   var data = drawnItems.toGeoJSON();
//   console.log("saving file");
//   console.log(data);

//   // Stringify the GeoJson
//   var convertedData =
//     "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));

//   // Convert to .gpx

//   // Create export
//   document
//     .getElementById("export")
//     .setAttribute("href", "data:" + convertedData);
//   document.getElementById("export").setAttribute("download", "data.geojson");
// };
