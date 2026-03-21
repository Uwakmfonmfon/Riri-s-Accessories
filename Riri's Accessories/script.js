// ══════════════════════════════════════════════════════
//  RIRI'S ACCESSORIES — ADMIN + PRODUCT SYSTEM
// ══════════════════════════════════════════════════════

const WA_NUMBER  = "2347032973656";
const ADMIN_PASS = "Rachealmaddy3";
const BIN_KEY    = "riris-accessories-products-v1";

let products     = [];
let editingIndex = null;
let adminLoggedIn = false;
let activeTab    = "add";

// ── LOCAL STORAGE ──
function saveLocal(prods) { localStorage.setItem(BIN_KEY, JSON.stringify(prods)); }
function loadLocal() { try { return JSON.parse(localStorage.getItem(BIN_KEY)) || []; } catch { return []; } }

// ── PRODUCT CARD ──
function buildCard(p, idx) {
  const cat     = (p.category||"").toLowerCase();
  const imgHtml = p.image
    ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;display:block;">`
    : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;background:var(--blush,#f9e8e8);">💍</div>`;
  const badgeHtml = p.badge ? `<span class="product-badge">${p.badge}</span>` : "";
  return `
    <div class="product-card" data-cat="${cat}" data-idx="${idx}" style="display:block;">
      <div class="product-image" style="background:none;padding:0;overflow:hidden;height:220px;position:relative;">
        ${imgHtml}${badgeHtml}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${p.price}</div>
        <button class="order-btn" onclick="orderItem('${(p.name||"").replace(/'/g,"\'")}','${p.price}')">Order via WhatsApp 💬</button>
      </div>
    </div>`;
}

// ── RENDER SHOP ──
function renderShop() {
  const grid = document.getElementById("products-grid");
  if (!products.length) {
    grid.innerHTML = `<div class="empty-state">No products yet. Click the Admin button in the footer to add your first piece. 💖</div>`;
    return;
  }
  grid.innerHTML = products.map((p,i) => buildCard(p,i)).join("");
}

// ── FILTER ──
function filterProducts(cat, btn) {
  document.querySelectorAll(".product-card").forEach(card => {
    card.style.display = (cat==="all"||card.dataset.cat===cat) ? "block" : "none";
  });
  if (btn) {
    document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("shop").scrollIntoView({behavior:"smooth"});
  }
}

// ── ORDER ──
function orderItem(name, price) {
  const msg = encodeURIComponent(`Hi Riri! 💖 I'd like to order:\n\n*${name}* - ${price}\n\nPlease confirm availability and delivery details. Thank you!`);
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
}

function sendWhatsAppOrder() {
  const name    = document.getElementById("fname").value || "Not provided";
  const phone   = document.getElementById("fphone").value || "Not provided";
  const item    = document.getElementById("fitem").value || "Not specified";
  const address = document.getElementById("faddress").value || "Not provided";
  const notes   = document.getElementById("fnotes").value || "None";
  const msg = encodeURIComponent(
    `Hi Riri! 💖 I'd like to place an order:\n\n` +
    `👤 Name: ${name}\n📞 Phone: ${phone}\n🛍️ Item: ${item}\n📍 Address: ${address}\n📝 Notes: ${notes}\n\nPlease confirm and let me know the total. Thank you!`
  );
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
}

// ── ADMIN OPEN/CLOSE ──
function openAdmin() {
  document.getElementById("admin-overlay").classList.add("open");
  if (!adminLoggedIn) showLogin();
  else showPanel();
}
function closeAdmin() {
  document.getElementById("admin-overlay").classList.remove("open");
}
document.addEventListener("keydown", e => { if(e.key==="Escape") closeAdmin(); });

// ── LOGIN ──
function showLogin() {
  document.getElementById("admin-body").innerHTML = `
    <div class="admin-login">
      <h3>🔒 Admin Login</h3>
      <input type="password" id="admin-pw" placeholder="Enter password" onkeydown="if(event.key==='Enter')doLogin()">
      <div class="admin-login-err" id="admin-err">Incorrect password. Try again.</div>
      <button class="btn-admin-primary" onclick="doLogin()">Login</button>
    </div>`;
  setTimeout(()=>document.getElementById("admin-pw")?.focus(),100);
}

function doLogin() {
  if (document.getElementById("admin-pw").value === ADMIN_PASS) {
    adminLoggedIn = true;
    showPanel();
  } else {
    document.getElementById("admin-err").style.display = "block";
  }
}

// ── MAIN PANEL ──
function showPanel() {
  document.getElementById("admin-body").innerHTML = `
    <div class="admin-tabs">
      <button class="admin-tab ${activeTab==="list"?"active":""}" onclick="switchTab('list')">💍 Products (${products.length})</button>
      <button class="admin-tab ${activeTab==="add"?"active":""}" onclick="switchTab('add')">${editingIndex!==null?"✏️ Edit":"➕ Add Product"}</button>
    </div>
    <div id="admin-tab-content"></div>`;
  if (activeTab==="list") renderListTab();
  else renderFormTab();
}

function switchTab(tab) {
  activeTab = tab;
  if (tab==="add") editingIndex = null;
  showPanel();
}

// ── LIST TAB ──
function renderListTab() {
  const el = document.getElementById("admin-tab-content");
  if (!products.length) {
    el.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--warm-grey,#8a7968);">No products yet.<br><button class="btn-admin-secondary" style="margin-top:1rem;" onclick="switchTab('add')">Add your first piece 💖</button></div>`;
    return;
  }
  el.innerHTML = `<div class="admin-product-list">${products.map((p,i)=>`
    <div class="admin-product-row">
      <div class="apr-img">${p.image?`<img src="${p.image}" alt="${p.name}">`:"💍"}</div>
      <div class="apr-info">
        <div class="apr-name">${p.name}</div>
        <div class="apr-meta">${p.category} · ${p.price}${p.badge?" · "+p.badge:""}</div>
      </div>
      <div class="apr-actions">
        <button class="apr-edit" onclick="editProduct(${i})">Edit</button>
        <button class="apr-del" onclick="deleteProduct(${i})">Delete</button>
      </div>
    </div>`).join("")}
  </div>`;
}

// ── FORM TAB ──
function renderFormTab() {
  const p = editingIndex!==null ? products[editingIndex] : {};
  const isEdit = editingIndex !== null;
  document.getElementById("admin-tab-content").innerHTML = `
    <div class="admin-form">
      <div class="admin-form-row">
        <div class="admin-fg">
          <label>Product Name *</label>
          <input type="text" id="af-name" placeholder="e.g. Gold Heartbeat Necklace" value="${p.name||""}">
        </div>
        <div class="admin-fg">
          <label>Price *</label>
          <input type="text" id="af-price" placeholder="e.g. ₦8,000" value="${p.price||""}">
        </div>
      </div>
      <div class="admin-form-row">
        <div class="admin-fg">
          <label>Category *</label>
          <select id="af-cat">
            <option value="">Select category</option>
            <option value="necklace" ${p.category==="necklace"?"selected":""}>Necklace</option>
            <option value="bracelet" ${p.category==="bracelet"?"selected":""}>Bracelet</option>
            <option value="bangle" ${p.category==="bangle"?"selected":""}>Bangle</option>
            <option value="earring" ${p.category==="earring"?"selected":""}>Earring</option>
            <option value="ring" ${p.category==="ring"?"selected":""}>Ring</option>
            <option value="watch" ${p.category==="watch"?"selected":""}>Watch</option>
          </select>
        </div>
        <div class="admin-fg">
          <label>Badge (optional)</label>
          <select id="af-badge">
            <option value="" ${!p.badge?"selected":""}>No badge</option>
            <option value="Popular" ${p.badge==="Popular"?"selected":""}>Popular</option>
            <option value="New" ${p.badge==="New"?"selected":""}>New</option>
            <option value="Trending" ${p.badge==="Trending"?"selected":""}>Trending</option>
            <option value="Sale" ${p.badge==="Sale"?"selected":""}>Sale</option>
          </select>
        </div>
      </div>
      <div class="admin-fg">
        <label>Product Photo (optional)</label>
        <div class="img-upload-wrap">
          <div class="img-preview-box ${p.image?'has-image':''}" id="img-preview-box" onclick="triggerImgUpload()" style="--upload-border:var(--sand,#e8d5b7);--upload-bg:var(--blush,#f9e8e8);--upload-accent:var(--rosegold,#c9917a);">
            ${p.image ? `<img id="img-preview" src="${p.image}" alt="preview">` : `<img id="img-preview" src="" alt="preview" style="display:none;">`}
            <div class="upload-label">
              <span class="upload-icon">📷</span>
              <span class="upload-text">Tap to upload photo</span>
              <span class="upload-sub">JPG, PNG — from phone or computer</span>
            </div>
            <button class="remove-img" onclick="removeImg(event)">✕</button>
          </div>
          <input type="file" id="img-file-input" class="img-upload-input" accept="image/*" onchange="handleImgUpload(event)">
          <span class="img-url-toggle" onclick="toggleUrlInput()">Or paste an image URL instead</span>
          <div class="img-url-row" id="img-url-row">
            <input type="url" id="af-img" placeholder="https://i.imgur.com/..." value="${p.image&&p.image.startsWith('http')?p.image:''}">
            <span class="hint">Paste a direct image link</span>
          </div>
        </div>
      </div>
      <div id="admin-save-msg" class="admin-save-msg"></div>
      <button class="btn-admin-primary" id="admin-save-btn" onclick="saveProduct()">
        ${isEdit?"💾 Save Changes":"➕ Add Product"}
      </button>
      ${isEdit?`<button class="btn-admin-secondary" style="margin-top:0.5rem;width:100%;" onclick="switchTab('add')">Cancel</button>`:""}
    </div>`;
}

// ── EDIT / DELETE ──
function editProduct(i) { editingIndex=i; activeTab="add"; showPanel(); }

function deleteProduct(i) {
  if (!confirm(`Delete "${products[i].name}"? This cannot be undone.`)) return;
  products.splice(i,1);
  saveLocal(products);
  renderShop();
  renderListTab();
  document.querySelector(".admin-tab").textContent = `💍 Products (${products.length})`;
}

// ── SAVE ──
function saveProduct() {
  const name  = document.getElementById("af-name").value.trim();
  const price = document.getElementById("af-price").value.trim();
  const cat   = document.getElementById("af-cat").value;
  const badge = document.getElementById("af-badge").value;
  // Use uploaded image data if available, otherwise fall back to URL field
  const urlField = document.getElementById("af-img");
  const image = uploadedImageData || (urlField ? urlField.value.trim() : "");
  uploadedImageData = null; // reset after save

  if (!name)  { alert("Product name is required."); return; }
  if (!price) { alert("Price is required."); return; }
  if (!cat)   { alert("Please select a category."); return; }

  const product = { name, price, category:cat, badge, image };
  const btn = document.getElementById("admin-save-btn");
  btn.disabled = true; btn.textContent = "Saving...";

  if (editingIndex !== null) { products[editingIndex]=product; editingIndex=null; }
  else { products.push(product); }

  saveLocal(products);
  renderShop();
  const msg = document.getElementById("admin-save-msg");
  if (msg) { msg.textContent="✅ Saved!"; setTimeout(()=>{if(msg)msg.textContent="";},2000); }
  activeTab="list";
  setTimeout(()=>showPanel(), 800);
}

// ── SCROLL ANIMATIONS ──
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("visible"); }),
  { threshold: 0.1 }
);
document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

// ── INIT ──
window.addEventListener("DOMContentLoaded", () => {
  products = loadLocal();
  renderShop();
});