const products = [
 {id:1,name:"Alpukat Mentega",category:"Buah & Sayur",price:28000,stock:18,emoji:"🥑",tag:"Fresh pick",unit:"kg"},
 {id:2,name:"Jeruk Mandarin",category:"Buah & Sayur",price:32000,stock:24,emoji:"🍊",tag:"Best seller",unit:"kg"},
 {id:3,name:"Pisang Cavendish",category:"Buah & Sayur",price:18000,stock:30,emoji:"🍌",tag:"",unit:"sisir"},
 {id:4,name:"Brokoli Segar",category:"Buah & Sayur",price:16000,stock:12,emoji:"🥦",tag:"",unit:"ikat"},
 {id:5,name:"Susu Fresh Milk 1L",category:"Dairy",price:22000,stock:15,emoji:"🥛",tag:"",unit:"botol"},
 {id:6,name:"Keju Cheddar 170g",category:"Dairy",price:26500,stock:9,emoji:"🧀",tag:"",unit:"pack"},
 {id:7,name:"Yogurt Strawberry",category:"Dairy",price:14500,stock:0,emoji:"🍓",tag:"",unit:"cup"},
 {id:8,name:"Air Mineral 600ml",category:"Minuman",price:4000,stock:60,emoji:"💧",tag:"Value",unit:"botol"},
 {id:9,name:"Jus Jeruk 1L",category:"Minuman",price:19000,stock:11,emoji:"🧃",tag:"",unit:"kotak"},
 {id:10,name:"Kopi Arabika 200g",category:"Minuman",price:48000,stock:7,emoji:"☕",tag:"Premium",unit:"pack"},
 {id:11,name:"Roti Gandum",category:"Roti & Bakery",price:21000,stock:13,emoji:"🍞",tag:"",unit:"pack"},
 {id:12,name:"Croissant Butter",category:"Roti & Bakery",price:12500,stock:5,emoji:"🥐",tag:"",unit:"pcs"},
 {id:13,name:"Beras Premium 5kg",category:"Sembako",price:76000,stock:20,emoji:"🍚",tag:"",unit:"karung"},
 {id:14,name:"Minyak Goreng 1L",category:"Sembako",price:18500,stock:26,emoji:"🫗",tag:"",unit:"pouch"},
 {id:15,name:"Telur Ayam 1kg",category:"Sembako",price:29000,stock:16,emoji:"🥚",tag:"",unit:"kg"},
 {id:16,name:"Cokelat Dark 80g",category:"Snack",price:17500,stock:8,emoji:"🍫",tag:"",unit:"bar"}
];
const rupiah=n=>"Rp"+n.toLocaleString("id-ID");
let activeCategory="Semua", cart={}, searchTerm="";
const grid=document.getElementById("productGrid"), categoryList=document.getElementById("categoryList");
function renderCategories(){
 const cats=["Semua",...new Set(products.map(p=>p.category))];
 categoryList.innerHTML=cats.map(c=>`<button class="category-chip ${activeCategory===c?"active":""}" data-category="${c}">${c}</button>`).join("");
 categoryList.querySelectorAll("button").forEach(b=>b.onclick=()=>{activeCategory=b.dataset.category;renderCategories();renderProducts()});
}
function filteredProducts(){
 let list=products.filter(p=>(activeCategory==="Semua"||p.category===activeCategory)&&`${p.name} ${p.category}`.toLowerCase().includes(searchTerm));
 const sort=document.getElementById("sortSelect").value;
 if(sort==="low")list.sort((a,b)=>a.price-b.price);if(sort==="high")list.sort((a,b)=>b.price-a.price);if(sort==="name")list.sort((a,b)=>a.name.localeCompare(b.name));
 return list;
}
function renderProducts(){
 const list=filteredProducts();document.getElementById("resultCount").textContent=`${list.length} produk`;
 grid.innerHTML=list.map(p=>`<article class="product-card"><div class="product-visual"><span class="emoji">${p.emoji}</span>${p.tag?`<span class="product-tag">${p.tag}</span>`:""}</div><div class="product-info"><div class="product-category">${p.category}</div><h3>${p.name}</h3><div class="product-meta"><span class="price">${rupiah(p.price)}</span><span class="stock">${p.stock?`Stok ${p.stock} ${p.unit}`:"Stok habis"}</span></div><button class="add-btn" data-add="${p.id}" ${!p.stock?"disabled":""}>${p.stock?"+ Tambah ke keranjang":"Stok habis"}</button></div></article>`).join("");
 document.getElementById("emptyState").classList.toggle("hidden",list.length!==0);
 grid.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>addToCart(+b.dataset.add));
}
function addToCart(id){const p=products.find(x=>x.id===id);if((cart[id]||0)>=p.stock){toast("Jumlah melebihi stok yang tersedia.");return}cart[id]=(cart[id]||0)+1;renderCart();toast(`${p.name} ditambahkan ke keranjang.`)}
function renderCart(){
 const entries=Object.entries(cart).filter(([,q])=>q>0);let total=0;
 document.getElementById("cartItems").innerHTML=entries.length?entries.map(([id,q])=>{const p=products.find(x=>x.id==id);total+=p.price*q;return `<div class="cart-line"><div class="line-emoji">${p.emoji}</div><div class="cart-line-info"><b>${p.name}</b><small>${rupiah(p.price)} / ${p.unit}</small></div><div class="qty-controls"><button data-change="${id}" data-delta="-1">−</button><span>${q}</span><button data-change="${id}" data-delta="1">+</button></div></div>`}).join(""):`<div class="cart-empty">Keranjangmu masih kosong 🛒</div>`;
 document.getElementById("cartCount").textContent=entries.reduce((s,[,q])=>s+q,0);document.getElementById("cartSubtotal").textContent=rupiah(total);document.getElementById("checkoutBtn").disabled=!entries.length;
 document.querySelectorAll("[data-change]").forEach(b=>b.onclick=()=>{const id=+b.dataset.change,delta=+b.dataset.delta,p=products.find(x=>x.id===id);cart[id]=Math.max(0,Math.min(p.stock,(cart[id]||0)+delta));renderCart()});
}
function toast(msg){const el=document.getElementById("toast");el.textContent=msg;el.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove("show"),2300)}
document.getElementById("searchInput").addEventListener("input",e=>{searchTerm=e.target.value.toLowerCase().trim();renderProducts()});
document.getElementById("sortSelect").onchange=renderProducts;
document.getElementById("shopNow").onclick=()=>document.getElementById("catalog").scrollIntoView({behavior:"smooth"});
document.getElementById("accountBtn").onclick=()=>toast("Fitur akun dapat dihubungkan ke sistem login.");
document.getElementById("newsletterForm").onsubmit=e=>{e.preventDefault();toast("Terima kasih sudah berlangganan!");e.target.reset()};
const drawer=document.getElementById("cartDrawer"),backdrop=document.getElementById("drawerBackdrop");
function openCart(){drawer.classList.add("open");backdrop.classList.add("open")}function closeCart(){drawer.classList.remove("open");backdrop.classList.remove("open")}
document.getElementById("cartToggle").onclick=openCart;document.getElementById("cartClose").onclick=closeCart;backdrop.onclick=closeCart;
document.getElementById("checkoutBtn").onclick=()=>{const items=Object.entries(cart).filter(([,q])=>q>0);if(!items.length)return;const summary=items.map(([id,q])=>`${products.find(p=>p.id==id).name} x${q}`).join(", ");toast("Demo checkout: "+summary);cart={};renderCart();closeCart()};
const chatPanel=document.getElementById("chatPanel"),chatBody=document.getElementById("chatBody");
function toggleChat(open){chatPanel.classList.toggle("open",open)}
document.getElementById("chatLauncher").onclick=()=>toggleChat(!chatPanel.classList.contains("open"));document.getElementById("chatClose").onclick=()=>toggleChat(false);
function addMessage(text,type="bot"){const div=document.createElement("div");div.className=type==="user"?"user-message":"bot-message";div.textContent=text;chatBody.appendChild(div);chatBody.scrollTop=chatBody.scrollHeight}
function productCards(list){const wrap=document.createElement("div");list.forEach(p=>{const el=document.createElement("div");el.className="chat-product";el.innerHTML=`<div class="mini-emoji">${p.emoji}</div><div><b>${p.name}</b><small>${p.category} · ${p.stock?`Stok ${p.stock} ${p.unit}`:"Stok habis"}</small><strong>${rupiah(p.price)}</strong></div>`;wrap.appendChild(el)});chatBody.appendChild(wrap);chatBody.scrollTop=chatBody.scrollHeight}
function chatbotReply(raw){
 const q=raw.toLowerCase().trim();
 if(/halo|hai|hello|selamat/.test(q))return {text:"Halo juga! 😊 Aku bisa menampilkan katalog, mencari produk, mengecek harga, kategori, dan stok. Coba ketik “daftar produk” atau nama produk yang kamu cari."};
 if(/bantuan|bisa apa|fitur/.test(q))return {text:"Aku bisa membantu:\n• Menampilkan semua produk\n• Mencari produk berdasarkan nama\n• Melihat harga dan stok\n• Menampilkan produk per kategori\n• Mencari produk termurah/termahal\n\nContoh: “Ada susu?”, “Produk kategori sembako”, atau “Berapa harga beras?”"};
 if(/semua produk|daftar produk|produk tersedia|produk apa saja|katalog|tampilkan produk/.test(q)){const available=products.filter(p=>p.stock>0);return {text:`Saat ini ada ${products.length} produk di katalog, ${available.length} di antaranya memiliki stok. Berikut daftar produk yang tersedia:`,list:available}}
 const category=products.find(p=>q.includes(p.category.toLowerCase()));
 if(category||/kategori/.test(q)){const c=category?category.category:(products.find(p=>q.includes(p.category.toLowerCase()))||{}).category;if(c){const list=products.filter(p=>p.category===c);return {text:`Berikut produk dalam kategori ${c}:`,list}}}
 if(/termurah|paling murah|harga rendah/.test(q)){const list=[...products].filter(p=>p.stock>0).sort((a,b)=>a.price-b.price).slice(0,5);return {text:"Ini 5 produk dengan harga paling terjangkau yang tersedia:",list}}
 if(/termahal|paling mahal/.test(q)){const list=[...products].filter(p=>p.stock>0).sort((a,b)=>b.price-a.price).slice(0,5);return {text:"Ini produk dengan harga tertinggi yang tersedia:",list}}
 const matches=products.filter(p=>q.includes(p.name.toLowerCase())||p.name.toLowerCase().split(" ").some(w=>w.length>3&&q.includes(w)));
 if(matches.length){const p=matches[0];return {text:matches.length===1?`${p.name} termasuk kategori ${p.category}. Harga ${rupiah(p.price)} per ${p.unit}. ${p.stock?`Stok tersedia ${p.stock} ${p.unit}.`:"Maaf, stok sedang habis."}`:`Aku menemukan ${matches.length} produk yang cocok:`,list:matches.length>1?matches:[]}}
 if(/stok|habis|tersedia/.test(q)){const low=products.filter(p=>p.stock>0&&p.stock<=10);return {text:"Berikut produk dengan stok terbatas (10 unit atau kurang):",list:low}}
 if(/harga|berapa/.test(q)){return {text:"Boleh sebutkan nama produknya? Contoh: “Berapa harga susu fresh milk?”"}}
 return {text:"Maaf, aku belum menemukan jawaban yang cocok. Coba tanyakan nama produk, kategori (misalnya minuman atau sembako), harga, stok, atau ketik “daftar produk”."};
}
function sendChat(text){if(!text.trim())return;addMessage(text,"user");const result=chatbotReply(text);setTimeout(()=>{addMessage(result.text);if(result.list?.length)productCards(result.list)},250)}
document.getElementById("chatForm").onsubmit=e=>{e.preventDefault();const input=document.getElementById("chatInput");sendChat(input.value);input.value=""};
document.querySelectorAll("[data-prompt]").forEach(b=>b.onclick=()=>sendChat(b.dataset.prompt));
renderCategories();renderProducts();renderCart();
