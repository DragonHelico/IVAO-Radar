const positions = [
"EDDF_APP","EDDF_TWR","EDDH_APP","EDDH_TWR","EDDV_APP","EDGG_N_CTR","EDGG_S_CTR",
"EDWW_E_CTR","EDWW_W_CTR","EGPH_TWR","ENBR_GND","LEPA_S_TWR","LEZL_TWR",
"LFBO_GND","LFBO_TWR"
];

const demoBars = {
  "EDDF_APP":[[18*60+10,20*60-10]],
  "EDDF_TWR":[[17*60+45,20*60]],
  "EDDH_APP":[[16*60+40,19*60+20]],
  "EDDH_TWR":[[17*60,18*60+25]],
  "EDDV_APP":[[17*60,18*60+25]],
  "EDGG_N_CTR":[[16*60+25,19*60+50]],
  "EDGG_S_CTR":[[17*60+45,20*60]],
  "EDWW_E_CTR":[[17*60,19*60+20]],
  "EDWW_W_CTR":[[17*60,19*60+20]],
  "EGPH_TWR":[[17*60+45,20*60]],
  "ENBR_GND":[[18*60+30,20*60+30]]
};

/* Coordonnées UNIQUEMENT de démonstration pour tester la vue carte.
   Elles seront remplacées par les vraies géométries/données IVAO. */
const demoCoords = {
  "EDDF_APP":[50.0379,8.5622], "EDDF_TWR":[50.0379,8.5622],
  "EDDH_APP":[53.6304,9.9882], "EDDH_TWR":[53.6304,9.9882],
  "EDDV_APP":[52.4611,9.6851], "EDGG_N_CTR":[50.5,7.5],
  "EDGG_S_CTR":[48.8,8.0], "EDWW_E_CTR":[52.5,10.5],
  "EDWW_W_CTR":[52.5,8.0], "EGPH_TWR":[55.9508,-3.3725],
  "ENBR_GND":[60.2934,5.2181], "LEPA_S_TWR":[39.5517,2.7388],
  "LEZL_TWR":[37.418, -5.8931], "LFBO_GND":[43.6293,1.363],
  "LFBO_TWR":[43.6293,1.363]
};

const dateTitle = document.getElementById("dateTitle");
const slider = document.getElementById("timeSlider");
const selected = document.getElementById("selectedTime");
const rows = document.getElementById("rows");
const filter = document.getElementById("filter");
const hours = document.getElementById("hours");
const tableView = document.getElementById("tableView");
const mapView = document.getElementById("mapView");
const tableBtn = document.getElementById("tableViewBtn");
const mapBtn = document.getElementById("mapViewBtn");

for(let h=0; h<24; h++){
  const d=document.createElement("div");
  d.className="hour";
  d.textContent=String(h).padStart(2,"0")+"h00";
  hours.appendChild(d);
}

function fmt(min){
  const h=Math.floor(min/60), m=min%60;
  return String(h).padStart(2,"0")+"h"+String(m).padStart(2,"0")+" UTC";
}

function isActive(pos, minute){
  return (demoBars[pos] || []).some(([start,end]) => minute >= start && minute <= end);
}

function renderRows(){
  const q=filter.value.trim().toUpperCase();
  rows.innerHTML="";
  positions.filter(p=>!q || p.includes(q)).forEach(pos=>{
    const row=document.createElement("div");
    row.className="timeline-row";
    const label=document.createElement("div");
    label.className="position";
    label.textContent=pos;
    const track=document.createElement("div");
    track.className="track";

    for(let h=0;h<24;h++){
      const grid=document.createElement("span");
      grid.style.left=(h/24*100)+"%";
      track.appendChild(grid);
    }

    (demoBars[pos]||[]).forEach(([start,end])=>{
      const bar=document.createElement("button");
      bar.className="demo-bar";
      bar.style.left=(start/1440*100)+"%";
      bar.style.width=((end-start)/1440*100)+"%";
      bar.title=`Démonstration : ${fmt(start)} → ${fmt(end)}`;
      track.appendChild(bar);
    });

    row.append(label,track);
    rows.appendChild(row);
  });
}

function updateTime(){
  const minute=Number(slider.value);
  selected.textContent=fmt(minute);

  document.querySelectorAll(".time-cursor").forEach(e=>e.remove());
  const cursor=document.createElement("div");
  cursor.className="time-cursor";
  cursor.style.left=(minute/1440*100)+"%";
  document.querySelectorAll(".track").forEach(t=>t.appendChild(cursor.cloneNode()));

  updatePlanningMap();
}

slider.addEventListener("input",updateTime);
filter.addEventListener("input",renderRows);

function setDate(d){
  dateTitle.textContent=d.toLocaleDateString("fr-FR",{
    weekday:"long",day:"numeric",month:"long",year:"numeric"
  });
}
let current=new Date("2026-09-21T00:00:00Z");
document.getElementById("prevDay").onclick=()=>{
  current.setUTCDate(current.getUTCDate()-1); setDate(current);
};
document.getElementById("nextDay").onclick=()=>{
  current.setUTCDate(current.getUTCDate()+1); setDate(current);
};
document.getElementById("today").onclick=()=>{
  current=new Date(); setDate(current);
};

/* Carte */
let planningMap = null;
let mapMarkers = [];

function initPlanningMap(){
  if(planningMap) return;
  planningMap = L.map("planningMap", { zoomControl:true }).setView([50,7], 5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom:18,
    attribution:'&copy; OpenStreetMap contributors'
  }).addTo(planningMap);
  updatePlanningMap();
}

function updatePlanningMap(){
  if(!planningMap) return;
  const minute=Number(slider.value);
  mapMarkers.forEach(m=>planningMap.removeLayer(m));
  mapMarkers=[];

  const q=filter.value.trim().toUpperCase();

  positions.forEach(pos=>{
    if(q && !pos.includes(q)) return;
    const coord=demoCoords[pos];
    if(!coord) return;

    const active=isActive(pos,minute);
    const icon=L.divIcon({
      className:"planning-atc-marker",
      html:`<div class="${active ? "active" : "inactive"}"><span></span></div>`,
      iconSize:[24,24],
      iconAnchor:[12,12]
    });

    const marker=L.marker(coord,{icon}).addTo(planningMap);
    marker.bindTooltip(
      `<b>${pos}</b><br>${active ? "ACTIF à "+fmt(minute) : "Pas de réservation à "+fmt(minute)}`,
      {direction:"top",offset:[0,-10]}
    );
    mapMarkers.push(marker);
  });
}

function setView(mode){
  const isMap=mode==="map";
  tableView.classList.toggle("hidden",isMap);
  mapView.classList.toggle("hidden",!isMap);
  tableBtn.classList.toggle("active",!isMap);
  mapBtn.classList.toggle("active",isMap);

  if(isMap){
    initPlanningMap();
    setTimeout(()=>planningMap.invalidateSize(),50);
    updatePlanningMap();
  }
}

tableBtn.addEventListener("click",()=>setView("table"));
mapBtn.addEventListener("click",()=>setView("map"));

function clock(){
  document.getElementById("utcClock").textContent=
    new Date().toISOString().slice(11,19)+" UTC";
}
clock();
setInterval(clock,1000);

renderRows();
updateTime();
