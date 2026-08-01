import{a as e,c as t,i as n,r,s as i,t as a}from"./supabase-CjecJN_7.js";function o(){let e=document.getElementById(`hamburger`),n=document.getElementById(`navLinks`);!e||!n||(e.addEventListener(`click`,()=>{n.classList.toggle(`open`)}),t(n,`click`,{filter:()=>{n.classList.remove(`open`)}}))}function s(){t(document,`click`,{filter:t=>{let n=t.dataset.cat;if(!n)return;let r=t.closest(`.cat-card`);r&&(document.querySelectorAll(`.cat-card`).forEach(e=>e.classList.remove(`active`)),r.classList.add(`active`)),document.querySelectorAll(`.filter-btn`).forEach(e=>e.classList.toggle(`active`,e.dataset.cat===n)),i(e,n)}})}var c=null;function l(){c=document.getElementById(`toast`)}function u(e){c&&(c.textContent=e,c.classList.add(`show`),window.setTimeout(()=>c?.classList.remove(`show`),3200))}var d=[];function f(){t(document,`click`,{"open-cart":()=>v(),"close-cart":()=>y(),"open-checkout":e=>{let t=e.dataset.method;(t===`whatsapp`||t===`bank`||t===`opay`)&&window.dispatchEvent(new CustomEvent(`riri:checkout`,{detail:t}))}});let e=document.getElementById(`cartItems`);e&&t(e,`click`,{inc:e=>m(Number(e.dataset.id),1),dec:e=>m(Number(e.dataset.id),-1),remove:e=>h(Number(e.dataset.id))}),_()}function p(e){let t=d.find(t=>t.id===e.id);t?t.qty+=1:d.push({id:e.id,name:e.name,price:e.price,image_url:e.image_url,qty:1}),_(),v()}function m(e,t){let n=d.find(t=>t.id===e);if(n){if(n.qty+=t,n.qty<=0){let e=d.indexOf(n);d.splice(e,1)}_()}}function h(e){let t=d.findIndex(t=>t.id===e);t>=0&&d.splice(t,1),_()}function g(){return d.reduce((e,t)=>e+t.price*t.qty,0)}function _(){let e=d.reduce((e,t)=>e+t.qty,0),t=g(),n=document.getElementById(`bagCount`);n&&(n.textContent=String(e),n.classList.toggle(`show`,e>0));let r=document.getElementById(`cartTotal`);r&&(r.textContent=`₦${t.toLocaleString()}`);let i=document.getElementById(`cartFooter`);i&&(i.style.display=d.length?`block`:`none`);let a=document.getElementById(`cartItems`);if(a){if(!d.length){a.innerHTML=`<div class="cart-empty"><div class="cart-empty-icon">✦</div><p>Your bag is empty</p></div>`;return}a.innerHTML=d.map(e=>`
      <div class="cart-item">
        <div class="cart-item-thumb">
          ${e.image_url?`<img src="${C(e.image_url)}" alt="${C(e.name)}" onerror="this.parentElement.innerHTML='✦'">`:`✦`}
        </div>
        <div class="cart-item-info">
          <p class="cart-item-name">${S(e.name)}</p>
          <p class="cart-item-price">₦${Number(e.price).toLocaleString()} each</p>
          <div class="cart-item-controls">
            <button class="qty-btn" data-action="dec" data-id="${e.id}">−</button>
            <span class="qty-num">${e.qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${e.id}">+</button>
            <button class="remove-btn" data-action="remove" data-id="${e.id}">✕ Remove</button>
          </div>
        </div>
      </div>
    `).join(``)}}function v(){document.getElementById(`cartOverlay`)?.classList.add(`open`),document.getElementById(`cartDrawer`)?.classList.add(`open`),document.body.style.overflow=`hidden`}function y(){document.getElementById(`cartOverlay`)?.classList.remove(`open`),document.getElementById(`cartDrawer`)?.classList.remove(`open`),document.body.style.overflow=``}function b(){return d}function x(){d.length=0,_()}function S(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}function C(e){return S(e)}var w=null;function T(){window.addEventListener(`riri:checkout`,e=>{E(e.detail)}),t(document,`click`,{"close-modal":()=>D()}),document.getElementById(`checkoutModal`)?.addEventListener(`click`,e=>{e.target===e.currentTarget&&D()})}function E(e){let t=b();if(!t.length){u(`Add items to your bag first!`);return}w=e;let r=t.reduce((e,t)=>e+t.price*t.qty,0),i={whatsapp:`💬 Order via WhatsApp`,bank:`🏦 Bank Transfer`,opay:`🟠 Pay with Opay`},a={whatsapp:`Confirm your details — we'll open WhatsApp for you.`,bank:`Transfer to the account below, then send your receipt.`,opay:`Send payment to our Opay number, then confirm here.`},o=document.getElementById(`modalTitle`),s=document.getElementById(`modalSub`);o&&(o.textContent=i[e]),s&&(s.textContent=a[e]);let c={whatsapp:`Open WhatsApp →`,bank:`Send Receipt on WhatsApp →`,opay:`Confirm Opay Order →`},l=``;e===`bank`?l=`
      <div class="info-box">
        <div class="info-row"><span>Bank</span><span>${n.bankName}</span></div>
        <div class="info-row"><span>Account Name</span><span>${n.accountName}</span></div>
        <div class="info-row"><span>Account No.</span><span>${n.accountNumber}</span></div>
        <div class="info-divider"></div>
        <div class="info-row"><span>Amount</span><span class="info-total">₦${r.toLocaleString()}</span></div>
      </div>`:e===`opay`&&(l=`
      <div class="info-box">
        <div class="info-row"><span>Opay Number</span><span>${n.opayNumber}</span></div>
        <div class="info-row"><span>Name</span><span>${n.accountName}</span></div>
        <div class="info-divider"></div>
        <div class="info-row"><span>Amount</span><span class="info-total">₦${r.toLocaleString()}</span></div>
      </div>`);let d=document.getElementById(`modalBody`);d&&(d.innerHTML=`
      ${l}
      <div class="form-group"><label>Your Name</label><input type="text" id="coName" placeholder="e.g. Amara Johnson"></div>
      <div class="form-group"><label>Phone Number</label><input type="tel" id="coPhone" placeholder="080XXXXXXXX"></div>
      <div class="form-group"><label>Delivery Address</label><textarea id="coAddress" placeholder="Full delivery address"></textarea></div>
      <p class="form-error" id="formError">Please fill in all fields.</p>
      <button class="modal-submit ${e}" data-action="submit-order">${c[e]}</button>
    `),document.getElementById(`checkoutModal`)?.classList.add(`open`),document.getElementById(`cartOverlay`)?.classList.remove(`open`),document.getElementById(`cartDrawer`)?.classList.remove(`open`)}function D(){document.getElementById(`checkoutModal`)?.classList.remove(`open`)}function O(){let e=document.getElementById(`coName`)?.value.trim()??``,t=document.getElementById(`coPhone`)?.value.trim()??``,r=document.getElementById(`coAddress`)?.value.trim()??``,i=document.getElementById(`formError`);if(!e||!t||!r){i&&(i.style.display=`block`);return}i&&(i.style.display=`none`);let a={bank:`Bank Transfer`,opay:`Opay`},o=b(),s=`Hello Riri's Accessories! 💎\n\nNew Order from ${e}\nPhone: ${t}\nAddress: ${r}\n\nItems:\n${o.map(e=>`• ${e.name} x${e.qty} — ₦${(e.price*e.qty).toLocaleString()}`).join(`
`)}\n\nTotal: ₦${o.reduce((e,t)=>e+t.price*t.qty,0).toLocaleString()}`,c=w?a[w]:void 0;c&&(s+=`\n\nPayment Method: ${c}`),s+=`

Please confirm my order. Thank you!`;let l=`https://wa.me/${n.whatsapp}?text=${encodeURIComponent(s)}`;window.open(l,`_blank`),x(),D(),u(`Order sent! We'll confirm shortly ✦`)}document.addEventListener(`click`,e=>{e.target?.dataset.action===`submit-order`&&O()});var k=[],A=`all`;async function j(){await M();let n=document.getElementById(`productsGrid`);n&&(t(n,`click`,{"add-to-cart":e=>{let t=Number(e.dataset.id);if(!Number.isFinite(t))return;let n=k.find(e=>e.id===t);n&&(p(n),u(`"${n.name}" added to bag ✦`))}}),t(document,`click`,{filter:t=>{let n=t.dataset.cat;n&&(document.querySelectorAll(`.filter-btn`).forEach(e=>e.classList.toggle(`active`,e.dataset.cat===n)),i(e,n))}}),window.addEventListener(e,e=>{let t=e.detail;N(t),document.getElementById(`shop`)?.scrollIntoView({behavior:`smooth`})}))}async function M(){let{data:e,error:t}=await a.from(`products`).select(`*`).order(`created_at`,{ascending:!1}),n=document.getElementById(`productsGrid`);if(n){if(t){n.innerHTML=`<p class="no-products">Could not load products. Please try again later.</p>`;return}k=e??[],N(A)}}function N(e){A=e;let t=document.getElementById(`productsGrid`);if(!t)return;let n=e===`all`?k:k.filter(t=>t.category===e);if(!n.length){t.innerHTML=`<p class="no-products">No products in this category yet.</p>`;return}t.innerHTML=n.map(e=>`
      <div class="product-card">
        <div class="product-img">
          ${e.image_url?`<img src="${F(e.image_url)}" alt="${F(e.name)}" loading="lazy" onerror="this.parentElement.innerHTML='✦'">`:`✦`}
        </div>
        ${e.in_stock?``:`<div class="out-of-stock-badge">Sold Out</div>`}
        <div class="product-info">
          <p class="product-cat">${r[e.category]??e.category}</p>
          <h3 class="product-name">${P(e.name)}</h3>
          ${e.description?`<p class="product-desc">${P(e.description)}</p>`:``}
          <div class="product-footer">
            <span class="product-price">₦${Number(e.price).toLocaleString()}</span>
            <button
              class="add-btn"
              data-action="add-to-cart"
              data-id="${e.id}"
              ${e.in_stock?``:`disabled`}
            >Add</button>
          </div>
        </div>
      </div>
    `).join(``)}function P(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}function F(e){return P(e)}l(),o(),s(),f(),T(),await j();