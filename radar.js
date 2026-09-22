const map = L.map("map", { zoomControl: true }).setView([49.2, 8.5], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const aircraft = [
  {callsign:"DEMO001", lat:48.86, lon:2.35, alt:"FL240"},
  {callsign:"DEMO002", lat:50.11, lon:8.68, alt:"FL180"},
  {callsign:"DEMO003", lat:51.47, lon:-0.45, alt:"FL320"},
  {callsign:"DEMO004", lat:41.29, lon:2.08, alt:"FL140"}
];

const atcs = [
  {callsign:"LFBB_CTR", lat:44.8, lon:1.0, freq:"130.230"},
  {callsign:"EDDF_TWR", lat:50.03, lon:8.56, freq:"118.775"},
  {callsign:"EGPH_TWR", lat:55.95, lon:-3.37, freq:"121.200"}
];

const aircraftLayer = L.layerGroup().addTo(map);
const atcLayer = L.layerGroup().addTo(map);

function aircraftIcon() {
  return L.divIcon({className:"aircraft-marker", html:"✈", iconSize:[22,22], iconAnchor:[11,11]});
}
function atcIcon() {
  return L.divIcon({className:"atc-marker", html:"●", iconSize:[18,18], iconAnchor:[9,9]});
}

aircraft.forEach(a => {
  L.marker([a.lat,a.lon], {icon:aircraftIcon()})
    .bindTooltip(`<b>${a.callsign}</b><br>${a.alt}`)
    .addTo(aircraftLayer);
});
atcs.forEach(a => {
  L.marker([a.lat,a.lon], {icon:atcIcon()})
    .bindTooltip(`<b>${a.callsign}</b><br>${a.freq}`)
    .addTo(atcLayer);
});

document.getElementById("aircraftCount").textContent = aircraft.length;
document.getElementById("atcCount").textContent = atcs.length;

document.getElementById("showAircraft").addEventListener("change", e => {
  e.target.checked ? aircraftLayer.addTo(map) : map.removeLayer(aircraftLayer);
});
document.getElementById("showAtc").addEventListener("change", e => {
  e.target.checked ? atcLayer.addTo(map) : map.removeLayer(atcLayer);
});

document.getElementById("showSectors").addEventListener("change", e => {
  if (e.target.checked) {
    alert("Les vrais polygones seront ajoutés quand les données géographiques WebEye/API seront récupérées.");
  }
});

document.getElementById("radarSearch").addEventListener("input", e => {
  const q = e.target.value.trim().toUpperCase();
  aircraftLayer.eachLayer(m => {
    const name = m.getTooltip()?.getContent()?.toUpperCase() || "";
    if (!q || name.includes(q)) m.setOpacity(1); else m.setOpacity(.15);
  });
  atcLayer.eachLayer(m => {
    const name = m.getTooltip()?.getContent()?.toUpperCase() || "";
    if (!q || name.includes(q)) m.setOpacity(1); else m.setOpacity(.15);
  });
});

function updateClock(){
  document.getElementById("utcClock").textContent =
    new Date().toISOString().slice(11,19) + " UTC";
}
updateClock(); setInterval(updateClock,1000);
