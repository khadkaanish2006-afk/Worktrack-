const demoAssets=[
{id:"WT-000001",name:"Room 204",type:"Room",location:"Building A",status:"Clean & Inspected",inspection:"Sep 30, 2026",cleaning:"Sep 30, 2026",inspections:[{date:"Sep 30, 2026",person:"Jordan Lee",status:"Passed",notes:"Room checked and ready.",photos:["https://images.unsplash.com/photo-1560185008-b033106af5c3"]}],cleanings:[{date:"Sep 30, 2026",person:"Jordan Lee",status:"Cleaned",notes:"Room cleaned and checked.",photos:["https://images.unsplash.com/photo-1560185008-cdeed07c8b4a"]}]},
{id:"WT-000002",name:"Room 205",type:"Room",location:"Building A",status:"Cleaned",inspection:"Sep 29, 2026",cleaning:"Sep 29, 2026",inspections:[{date:"Sep 29, 2026",person:"Maya Singh",status:"Passed",notes:"No issues found.",photos:[]}],cleanings:[{date:"Sep 29, 2026",person:"Maya Singh",status:"Cleaned",notes:"Standard cleaning completed.",photos:[]}]},
{id:"WT-000003",name:"Room 301",type:"Room",location:"Building B",status:"Needs Attention",inspection:"Sep 28, 2026",cleaning:"Sep 28, 2026",inspections:[{date:"Sep 28, 2026",person:"Alex Kim",status:"Needs Maintenance",notes:"Light fixture needs attention.",photos:[]}],cleanings:[{date:"Sep 28, 2026",person:"Alex Kim",status:"Cleaned",notes:"Cleaning completed; maintenance issue remains.",photos:[]}]}
];

function getAssets(){return JSON.parse(localStorage.getItem("worktrack_assets")||"null")||demoAssets}
function saveAssets(a){localStorage.setItem("worktrack_assets",JSON.stringify(a))}
function getId(){return new URLSearchParams(location.search).get("id")||"WT-000001"}
function renderAssets(){
 const list=document.getElementById("assetList"); if(!list)return;
 const q=(document.getElementById("search")?.value||"").toLowerCase();
 const assets=getAssets().filter(a=>(a.name+a.id+a.location).toLowerCase().includes(q));
 list.innerHTML=assets.map(a=>`<div class="asset-row"><div><div class="asset-name">${a.name}</div><small>${a.id} · ${a.location}</small></div><div>${a.type}</div><div class="${a.status.includes("Attention")?"status warn":"status good"}">${a.status}</div><a class="button secondary" href="asset.html?id=${a.id}">Open</a></div>`).join("")||"<p class='muted'>No assets found.</p>";
}
function addAsset(){
 const assets=getAssets(), n=assets.length+1, id="WT-"+String(n).padStart(6,"0");
 assets.push({id,name:"New Room",type:"Room",location:"New Location",status:"Pending",inspection:"—",cleaning:"—",inspections:[],cleanings:[]});saveAssets(assets);renderAssets();
}
function renderAssetDetail(){
 const a=getAssets().find(x=>x.id===getId()), el=document.getElementById("assetPage");
 if(!a){el.innerHTML="<h1>Asset not found</h1>";return}
 const base=location.origin+location.pathname.replace("asset.html","tag.html")+"?id="+a.id;
 el.innerHTML=`<div class="page-head"><div><span class="eyebrow">${a.id}</span><h1>${a.name}</h1><p class="muted">${a.location} · ${a.type}</p></div><a class="button primary" href="tag.html?id=${a.id}">Open Public Page</a></div>
 <div class="detail-grid">
 <div class="info-card"><h3>Asset Information</h3><div class="kv"><span>Status</span><b>${a.status}</b></div><div class="kv"><span>Last inspection</span><b>${a.inspection}</b></div><div class="kv"><span>Last cleaning</span><b>${a.cleaning}</b></div><h3 style="margin-top:22px">NFC / QR URL</h3><div class="url-box">${base}</div><button class="button secondary" style="margin-top:10px" onclick="navigator.clipboard?.writeText('${base}')">Copy NFC URL</button><div class="qr-placeholder">QR CODE<br>prototype</div></div>
 <div class="info-card"><h3>Inspector actions</h3><p class="muted">Prototype controls for demonstrating the workflow.</p><button class="button primary" onclick="quickInspection('${a.id}')">Log Inspection</button> <button class="button secondary" onclick="quickCleaning('${a.id}')">Log Cleaning</button></div>
 </div>
 <div class="detail-grid" style="margin-top:18px"><div class="info-card"><h3>Inspection History</h3>${historyHTML(a.inspections)}</div><div class="info-card"><h3>Cleaning History</h3>${historyHTML(a.cleanings)}</div></div>`;
}
function historyHTML(items=[]){return items.length?items.map(x=>`<div class="history-item"><b>${x.status}</b><div class="muted">${x.date} · ${x.person}</div><p>${x.notes}</p>${(x.photos||[]).map(p=>`<img src="${p}" alt="Evidence photo">`).join("")}</div>`).join(""):"<p class='muted'>No records yet.</p>"}
function quickInspection(id){const assets=getAssets(),a=assets.find(x=>x.id===id);a.inspections.unshift({date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),person:"Demo Inspector",status:"Passed",notes:"Prototype inspection completed.",photos:[]});a.inspection=a.inspections[0].date;a.status="Clean & Inspected";saveAssets(assets);renderAssetDetail()}
function quickCleaning(id){const assets=getAssets(),a=assets.find(x=>x.id===id);a.cleanings.unshift({date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),person:"Demo Inspector",status:"Cleaned",notes:"Prototype cleaning completed.",photos:[]});a.cleaning=a.cleanings[0].date;a.status="Clean & Inspected";saveAssets(assets);renderAssetDetail()}
function renderPublicTag(){
 const a=getAssets().find(x=>x.id===getId()),el=document.getElementById("tagPage");
 if(!a){el.innerHTML="<div class='public-hero'><h1>Asset not found</h1><p class='muted'>Check the WorkTrack tag ID.</p></div>";return}
 el.innerHTML=`<div class="public-hero"><span class="eyebrow">Verified asset</span><h1>${a.name}</h1><p class="muted">${a.id} · ${a.location}</p><span class="status ${a.status.includes("Attention")?"warn":"good"}">${a.status}</span><div class="kv"><span>Last inspection</span><b>${a.inspection}</b></div><div class="kv"><span>Last cleaning</span><b>${a.cleaning}</b></div></div>
 <div class="public-section"><h2>Inspection History</h2>${historyHTML(a.inspections)}</div>
 <div class="public-section"><h2>Cleaning History</h2>${historyHTML(a.cleanings)}</div>
 <p class="small">WorkTrack public verification · No account required to view.</p>`;
}
