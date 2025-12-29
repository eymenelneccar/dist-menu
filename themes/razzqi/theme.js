export async function render({ slug, restaurant, settings }) {
  const app = document.getElementById("app");
  if (!app) return;
  const { supabase } = await import("/src/api/supabase.js");
  const setCssVar = (k, v) => { if (v && typeof v === "string" && v.trim()) document.documentElement.style.setProperty(k, v.trim()); };
  const applyColors = (s) => {
    setCssVar("--brand-1", s?.color_primary);
    setCssVar("--brand-2", s?.color_secondary);
    setCssVar("--brand-base", s?.color_primary);
    setCssVar("--brand-gold", s?.color_secondary);
    setCssVar("--bg-main", s?.color_bg_main);
    setCssVar("--bg-surface", s?.color_bg_surface);
    setCssVar("--text-main", s?.color_text);
    setCssVar("--text-heading", s?.color_heading);
    setCssVar("--border-color", s?.color_border);
    setCssVar("--shadow-color", s?.color_shadow);
    setCssVar("--brand-text", s?.color_bg_main);
  };
  const resolveImage = (u, fallback) => {
    const raw = (u == null) ? "" : String(u).trim();
    if (!raw || raw === "null" || raw === "undefined") return fallback;
    if (/^https?:/i.test(raw)) return raw;
    const parts = raw.split("/").filter(Boolean);
    const bucket = parts.shift();
    const path = parts.join("/");
    if (!bucket || !path) return fallback;
    const pub = supabase.storage.from(bucket).getPublicUrl(path);
    const out = pub?.data?.publicUrl;
    return out ? out : fallback;
  };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  async function withRetry(fn, tries = 3, delay = 500) {
    let err = null;
    for (let i = 0; i < tries; i++) {
      try {
        const res = await fn();
        if (res && typeof res === "object" && "error" in res && res.error) throw res.error;
        return res;
      } catch (e) {
        err = e;
        if (i < tries - 1) await sleep(delay);
      }
    }
    throw err;
  }
  async function ensureRestaurant() {
    if (restaurant && restaurant.id) return restaurant;
    const res = await withRetry(() => supabase.from("restaurants").select("id, name, menu_enabled").eq("slug", slug).maybeSingle());
    return (res && res.data) ? res.data : null;
  }
  async function ensureSettings(rid) {
    const base = (settings && typeof settings === "object") ? settings : {};
    const res = await withRetry(() => supabase.from("settings").select("menu_theme, logo_url, hero_url, online_orders, color_primary, color_secondary, color_bg_main, color_bg_surface, color_text, color_heading, color_border, color_shadow, instagram_url, instagram_color, whatsapp_number, phone_number, location, hero_pill_text, hero_left_text, hero_right_text, shipping_enabled, shipping_zones").eq("restaurant_id", rid).maybeSingle());
    const data = res ? res.data : null;
    return { ...base, ...(data || {}) };
  }
  const r = await ensureRestaurant();
  if (!r || r.menu_enabled !== true) { document.body.innerHTML = "<h2>القائمة غير متاحة حالياً</h2>"; return; }
  document.title = "منيو | " + (r.name || "");
  try { localStorage.setItem("restaurant_name", r.name || ""); } catch {}
  const s = await ensureSettings(r.id);
  applyColors(s || {});
  const heroImg = resolveImage(s?.hero_url || "", "");
  app.innerHTML = `
    <header class="fixed top-0 left-0 right-0 max-w-lg mx-auto w-full flex justify-between items-center px-2 py-4 bg-white z-30 border-b border-[#331A12]/10">
      <div class="flex items-center gap-3">
        <h1 id="site-title" class="text-2xl font-bold text-[#331A12]">${r.name || ""}</h1>
      </div>
      <div class="flex items-center gap-2">
        <button id="open-cart-btn" class="relative w-8 h-8 flex items-center justify-center">
          <i data-lucide="shopping-bag" class="w-7 h-7 text-[var(--brand-1,#2c98aa)]"></i>
          <span id="cart-count-bubble" class="absolute -top-2 -right-2 bg-[var(--brand-1,#2c98aa)] text-white text-xs font-bold rounded-full px-2 py-0.5 hidden">0</span>
        </button>
      </div>
    </header>
    <div class="pt-20">
    <section id="hero-section" class="px-2 py-4">
      <div class="relative rounded-xl overflow-hidden shadow-lg h-64 sm:h-72 lg:h-80 bg-[var(--brand-1,#2c98aa)]">
        ${heroImg ? `<img id="hero-image" src="${heroImg}" alt="" class="w-full h-full object-cover">` : ``}
        <div class="absolute inset-0 flex items-end p-6">
          <h2 id="hero-title" class="text-3xl font-bold text-white leading-tight" style="text-shadow: 0 2px 8px rgba(0,0,0,.35);">
            <span>${s?.hero_left_text || ""}</span><br><span>${s?.hero_right_text || ""}</span>
          </h2>
        </div>
      </div>
    </section>
    <nav class="px-3 py-4">
      <h3 class="text-[#331A12] font-bold mb-2">الأقسام</h3>
      <div id="categories-nav" class="flex items-center gap-3 overflow-x-auto px-2 py-1 snap-x snap-mandatory overflow-touch scrollbar-hide" style="scroll-padding: 1rem;"></div>
    </nav>
    <div id="current-category-title" class="px-2 text-[#331A12] font-bold text-lg mb-2"></div>
    <main id="items-container" class="px-2 py-4 pb-40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8"></main>
    </div>
    <footer class="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-10 border-t border-[#331A12]/10">
      <div id="bottom-nav" class="flex justify-around items-center p-2">
        <button id="nav-home" class="flex flex-col items-center text-xs text-[#331A12]/70"><i data-lucide="home" class="w-6 h-6 text-[var(--brand-1,#2c98aa)]"></i><span>الرئيسية</span></button>
        <button id="nav-cart" class="flex flex-col items-center text-xs text-[#331A12]/70"><i data-lucide="shopping-bag" class="w-6 h-6 text-[var(--brand-1,#2c98aa)]"></i><span>السلة</span></button>
        <button id="nav-map" class="flex flex-col items-center text-xs text-[#331A12]/70"><i data-lucide="map-pin" class="w-6 h-6 text-[var(--brand-1,#2c98aa)]"></i><span>الخريطة</span></button>
        <button id="nav-more" class="flex flex-col items-center text-xs text-[#331A12]/70"><i data-lucide="more-horizontal" class="w-6 h-6 text-[var(--brand-1,#2c98aa)]"></i><span>المزيد</span></button>
      </div>
      <div class="border-t border-[#331A12]/10 text-center text-[11px] text-[#331A12]/60 px-2 py-1">تم صنعها بواسطة | <a href="https://iqrarabic.com/" target="_blank" rel="noopener" class="font-semibold text-[var(--brand-1,#2c98aa)]/70 hover:text-[var(--brand-1,#2c98aa)]/80">İQR MENU</a></div>
      <div id="more-menu" class="hidden fixed bottom-16 left-0 right-0 max-w-lg mx-auto px-3 z-20">
        <div class="bg-white border border-[#331A12]/20 rounded-xl shadow-lg p-3 flex items-center justify-around gap-6">
          <a id="instagram-btn" href="#" target="_blank" rel="noopener" class="flex flex-col items-center text-xs text-[#331A12]/80"><i data-lucide="instagram" class="w-6 h-6 mb-1"></i><span>Instagram</span></a>
          <a id="facebook-btn" href="#" target="_blank" rel="noopener" class="flex flex-col items-center text-xs text-[#331A12]/80"><i data-lucide="facebook" class="w-6 h-6 mb-1"></i><span>Facebook</span></a>
        </div>
      </div>
    </footer>
    <div id="cart-modal" class="fixed inset-0 bg-black/50 z-40 hidden">
      <div id="cart-drawer" class="fixed top-0 right-0 w-full max-w-md h-full bg-white z-50 shadow-xl transform translate-x-full transition-transform duration-300 ease-in-out">
        <div id="cart-header" class="flex justify-between items-center p-4 border-b border-[#331A12]/20">
          <h2 class="text-xl font-bold text-[#331A12]">سلة طلباتك</h2>
          <button id="close-cart-btn"><i data-lucide="x" class="w-6 h-6 text-[#331A12]"></i></button>
        </div>
        <div id="cart-items" class="p-4 space-y-4 overflow-y-auto" style="height: calc(100% - 180px);"></div>
        <div id="cart-footer" class="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-[#331A12]/20 relative">
          <div class="flex justify-between items-center mb-4">
            <span class="text-lg font-semibold text-[#331A12]">الإجمالي:</span>
            <span id="cart-total" class="text-2xl font-bold text-[var(--brand-1,#2c98aa)]">0 د.ع</span>
          </div>
          <button id="submit-order-btn" class="w-full bg-[var(--brand-1,#2c98aa)] text-white py-3 rounded-lg font-bold text-lg">إرسال الطلب</button>
          <div class="text-center text-[#331A12]/60 text-sm my-2">or</div>
          <a id="call-order-btn" href="#" class="block w-full text-center border border-[var(--brand-1,#2c98aa)] text-[var(--brand-1,#2c98aa)] py-2 rounded-lg font-bold">اطلب عبر اتصال</a>
        </div>
      </div>
    </div>
    <div id="item-modal" class="fixed inset-0 bg-black/50 z-40 hidden">
      <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        <div class="relative w-full pt-[100%]">
          <img id="item-preview-image" src="" alt="" class="absolute inset-0 w-full h-full object-cover">
          <button id="close-item-btn" class="absolute top-2 left-2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        <div class="p-4 space-y-2">
          <h3 id="item-preview-name" class="text-xl font-bold text-[#331A12]"></h3>
          <p id="item-preview-description" class="text-sm text-[#331A12]/80"></p>
          <div id="item-preview-options" class="space-y-2 mt-1"></div>
          <div class="flex justify-between items-center mt-2">
            <span id="item-preview-price" class="text-lg font-bold text-[#331A12]"></span>
            <button id="item-preview-add" class="bg-[var(--brand-1,#2c98aa)] text-white px-4 py-2 rounded-lg">أضف للسلة</button>
          </div>
        </div>
      </div>
    </div>
  `;
  function applyOnlineOrdersUI(on) {
    const cartBtn = document.getElementById("open-cart-btn");
    if (cartBtn) cartBtn.style.display = on ? "" : "none";
    const navCart = document.getElementById("nav-cart");
    if (navCart) navCart.style.display = on ? "" : "none";
    const bubble = document.getElementById("cart-count-bubble");
    if (bubble && !on) bubble.classList.add("hidden");
    const cartModal = document.getElementById("cart-modal");
    if (cartModal && !on) cartModal.classList.add("hidden");
    const add = document.getElementById("item-preview-add");
    if (add) add.style.display = on ? "" : "none";
    const cartFooter = document.getElementById("cart-footer");
    if (cartFooter) cartFooter.style.display = on ? "" : "none";
  }
  applyOnlineOrdersUI(s?.online_orders === true);
  async function loadCategories() {
    const res = await withRetry(() => supabase.from("categories").select("id,name,image_url").eq("restaurant_id", r.id).order("sort_order", { ascending: true }).order("created_at", { ascending: true }));
    const data = res ? res.data : null;
    return Array.isArray(data) ? data : [];
  }
  async function fetchProducts(cid) {
    const cols = "id,name,description,price,image_url,available,variants,addons";
    const res = await withRetry(() => supabase.from("products").select(cols).eq("restaurant_id", r.id).eq("category_id", cid).eq("available", true).order("sort_order", { ascending: true }).order("created_at", { ascending: true }));
    const data = res ? res.data : null;
    return Array.isArray(data) ? data : [];
  }
  function getCart() {
    const saved = localStorage.getItem("restaurant_menu_cart");
    if (!saved) return [];
    try { return JSON.parse(saved) || []; } catch { return []; }
  }
  function setCart(cart) {
    try { localStorage.setItem("restaurant_menu_cart", JSON.stringify(Array.isArray(cart) ? cart : [])); } catch {}
    updateCartBadge();
  }
  function addToCart({ id, price, name, img, options }) {
    if (s?.online_orders !== true) return;
    const cart = getCart();
    const optKey = (opt) => {
      const v = String(opt?.variant || "").trim();
      const adds = Array.isArray(opt?.addons)
        ? opt.addons.map(a => String(a?.label || "").trim()).filter(Boolean).sort()
        : [];
      return `${v}||${adds.join(",")}`;
    };
    const key = optKey(options);
    const idx = cart.findIndex(it => String(it.productId || "") === String(id || "") && optKey(it.options) === key);
    if (idx >= 0) {
      cart[idx].quantity = Number(cart[idx].quantity || 1) + 1;
      if (Number(price || 0) > 0) cart[idx].price = Number(price || cart[idx].price || 0);
    } else {
      cart.push({ productId: String(id || ""), name: String(name || ""), price: Number(price || 0), quantity: 1, img: String(img || ""), options: options || null });
    }
    setCart(cart);
    renderCartPanel();
  }
  function updateCartBadge() {
    if (s?.online_orders !== true) {
      const bubble = document.getElementById("cart-count-bubble");
      if (bubble) bubble.classList.add("hidden");
      const totalEl = document.getElementById("cart-total");
      if (totalEl) totalEl.textContent = `0 د.ع`;
      return;
    }
    const bubble = document.getElementById("cart-count-bubble");
    const cart = getCart();
    const count = cart.reduce((s, i) => s + Number(i.quantity || 1), 0);
    if (bubble) {
      bubble.textContent = String(count);
      if (count > 0) { bubble.classList.remove("hidden"); } else { bubble.classList.add("hidden"); }
    }
    const totalEl = document.getElementById("cart-total");
    const subtotal = cart.reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 1), 0);
    const zones = Array.isArray(s?.shipping_zones) ? s.shipping_zones : [];
    const enabled = (s?.shipping_enabled === true);
    let idx = Number(localStorage.getItem("restaurant_shipping_zone_idx") || "0");
    if (!Number.isFinite(idx) || idx < 0 || idx >= zones.length) idx = 0;
    const fee = (enabled && zones.length) ? Number(zones[idx]?.fee || 0) : 0;
    const grand = subtotal + fee;
    if (totalEl) totalEl.textContent = `${Number(grand).toLocaleString()} د.ع`;
  }
  function productCard(item) {
    const el = document.createElement("div");
    el.className = "bg-white rounded-xl shadow-[0_8px_20px_rgba(0,0,0,.06)] border border-[#331A12]/10 overflow-hidden";
    const imgSrc = resolveImage(item.image_url || "", "");
    const descText = String(item.description || "").trim();
    const onlineOrders = s?.online_orders === true;
    const vars = Array.isArray(item.variants) ? item.variants.filter(v => Number(v?.price || 0) > 0) : [];
    const adds = Array.isArray(item.addons) ? item.addons : [];
    const hasAdds = adds.length > 0;
    const variantsRow = vars.length ? `<div class="mt-2 flex flex-wrap gap-2">${vars.map(v => `
      <div class="inline-flex items-center gap-2 bg-white border border-[#331A12]/15 rounded-full px-3 py-1">
        <span class="text-xs">${String(v.label || v.key || "")}</span>
        <span class="text-[10px] text-[#331A12]/60">${Number(v.price||0).toLocaleString()} د.ع</span>
        ${onlineOrders ? `<button class="variant-add w-6 h-6 rounded-full bg-[var(--brand-1,#2c98aa)] text-white" data-key="${String(v.key || v.label || "")}">+</button>` : ``}
      </div>`).join("")}</div>` : "";
    const addsList = (onlineOrders && hasAdds) ? `
      <div class="mt-2 space-y-2" data-for="${String(item.id)}" hidden>
        <div class="inline-flex items-center px-3 py-1 rounded-full border border-[#331A12]/15 text-[#331A12] bg-white text-xs w-fit">الإضافات</div>
        ${adds.map(a => `
          <label class="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#331A12]/15 bg-white">
            <input type="checkbox" class="accent-[var(--brand-1,#2c98aa)]" value="${String(a.label || a.name || a.title || "")}" data-price="${Number(a.price || 0)}">
            <span class="text-sm">${String(a.label || a.name || a.title || "")} <span class="text-xs text-[#331A12]/60">(+ ${Number(a.price||0).toLocaleString()} د.ع)</span></span>
          </label>
        `).join("")}
        <div class="flex justify-end">
          <button class="apply-addons-btn bg-[var(--brand-1,#2c98aa)] text-white px-3 py-1 rounded-lg text-xs" data-pid="${String(item.id)}">تطبيق</button>
        </div>
      </div>
    ` : "";
    el.innerHTML = `
      <div class="relative w-full pt-[56%]">
        ${imgSrc ? `
          <img src="${imgSrc}" alt="" class="absolute inset-0 w-full h-full object-cover" onerror="this.style.display='none'; this.parentNode.querySelector('.img-fallback')?.classList.remove('hidden')">
          <div class="img-fallback hidden absolute inset-0 w-full h-full bg-[#eee]"></div>
        ` : `
          <div class="img-fallback absolute inset-0 w-full h-full bg-[#eee]"></div>
        `}
      </div>
      <div class="p-4">
        <div class="flex items-center justify-between">
          ${onlineOrders ? `<button aria-label="أضف للسلة" data-id="${item.id}" class="h-9 px-3 rounded-full bg-[var(--brand-1,#2c98aa)] text-white text-sm font-bold flex items-center justify-center add-btn">أضف للسلة</button>` : ``}
          <div class="text-right">
            <div class="text-[#331A12] font-bold">${item.name || ""}</div>
            <div class="item-desc hidden text-xs text-[#331A12]/70 mt-1" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;"></div>
            <div class="text-[#331A12] font-bold">${Number(item.price || 0).toLocaleString()} د.ع</div>
            ${(onlineOrders && hasAdds) ? `<div class="mt-1"><button class="addons-btn inline-flex items-center px-3 py-1 rounded-full border border-[#331A12]/15 bg-white text-[#331A12] text-xs">الإضافات</button></div>` : ``}
          </div>
        </div>
        ${variantsRow}
        ${addsList}
      </div>
    `;
    try { if (window.lucide && typeof window.lucide.createIcons === "function") window.lucide.createIcons(); } catch {}
    const descEl = el.querySelector(".item-desc");
    if (descEl) {
      if (descText) {
        descEl.textContent = descText;
        descEl.classList.remove("hidden");
      } else {
        descEl.remove();
      }
    }
    const addBtn = el.querySelector(".add-btn");
    if (onlineOrders) addBtn?.addEventListener("click", () => {
      const hasOptions = (Array.isArray(item.variants) && item.variants.length) || (Array.isArray(item.addons) && item.addons.length);
      if (hasOptions) {
        openPreview(item, imgSrc);
        return;
      }
      addToCart({ id: item.id, price: item.price, name: item.name, img: imgSrc });
      try { if (window.lucide && typeof window.lucide.createIcons === "function") window.lucide.createIcons(); } catch {}
    });
    const addBtnToggle = el.querySelector(".addons-btn");
    if (onlineOrders && addBtnToggle) addBtnToggle.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const pid = String(item.id);
      const list = el.querySelector(`[data-for="${pid}"]`);
      if (list) list.toggleAttribute("hidden");
    });
    if (onlineOrders) el.querySelectorAll(".apply-addons-btn").forEach(b => {
      b.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const pid = String(b.getAttribute("data-pid") || "");
        const list = el.querySelector(`[data-for="${pid}"]`);
        const checks = list ? list.querySelectorAll('input[type="checkbox"]:checked') : [];
        const selected = Array.from(checks).map(c => ({ label: String(c.value || ""), price: Number(c.getAttribute("data-price") || 0) }));
        const nums = Array.isArray(item.variants) ? item.variants.map(v => Number(v?.price || 0)).filter(n => Number.isFinite(n) && n > 0) : [];
        const base = nums.length ? Math.min(...nums) : Number(item.price || 0);
        const priceVal = Number(base + selected.reduce((s, a) => s + Number(a.price || 0), 0));
        const options = { variant: null, addons: selected };
        addToCart({ id: item.id, price: priceVal, name: item.name, img: imgSrc, options });
        try { if (window.lucide && typeof window.lucide.createIcons === "function") window.lucide.createIcons(); } catch {}
      });
    });
    if (onlineOrders) el.querySelectorAll(".variant-add").forEach(b => {
      b.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const key = String(b.getAttribute("data-key") || "");
        const v = vars.find(vv => String(vv.key || vv.label || "") === key);
        const vPrice = Number(v?.price || 0);
        const vLabel = String(v?.label || v?.key || "");
        const hasOptions = Array.isArray(item.addons) && item.addons.length > 0;
        if (hasOptions) {
          openPreview(item, imgSrc);
          const prev = b.textContent;
          b.textContent = "✓";
          b.disabled = true;
          setTimeout(() => { b.textContent = prev || "+"; b.disabled = false; }, 1200);
        } else {
          addToCart({ id: item.id, price: vPrice, name: item.name, img: imgSrc, options: { variant: vLabel, addons: [] } });
          const prev = b.textContent;
          b.textContent = "✓";
          b.disabled = true;
          setTimeout(() => { b.textContent = prev || "+"; b.disabled = false; }, 1200);
        }
      });
    });
    el.querySelector("img")?.addEventListener("click", () => openPreview(item, imgSrc));
    return el;
  }
  let activeCatId = null;
  let activeCatName = "";
  function updateActiveCatStyles() {
    const nav = document.getElementById("categories-nav");
    if (!nav) return;
    nav.querySelectorAll("[data-cat-id]").forEach(el => {
      const isActive = String(el.getAttribute("data-cat-id") || "") === String(activeCatId || "");
      const base = "snap-start relative w-[110px] h-[110px] shrink-0 rounded-2xl overflow-hidden bg-[#eee] shadow-sm border transition-all duration-200";
      const on = "ring-2 ring-[var(--brand-1,#2c98aa)] shadow-lg border-transparent";
      const off = "border-[#331A12]/10";
      el.className = base + " " + (isActive ? on : off);
    });
  }
  async function renderCategory(cid, name) {
    const cont = document.getElementById("items-container");
    const title = document.getElementById("current-category-title");
    if (title) title.textContent = name || "";
    cont.innerHTML = "";
    const items = await fetchProducts(cid);
    items.forEach(it => cont.appendChild(productCard(it)));
    updateCartBadge();
    activeCatId = cid;
    activeCatName = name || "";
    updateActiveCatStyles();
  }
  async function renderCategoriesNav() {
    const nav = document.getElementById("categories-nav");
    const cats = await loadCategories();
    nav.innerHTML = "";
    cats.forEach((cat, idx) => {
      const card = document.createElement("button");
      const img = resolveImage(cat.image_url || "", "");
      card.setAttribute("data-cat-id", String(cat.id));
      card.className = "snap-start relative w-[110px] h-[110px] shrink-0 rounded-2xl overflow-hidden bg-[#eee] shadow-sm border border-[#331A12]/10 transition-all duration-200";
      card.innerHTML = `
        ${img ? `<img src="${img}" class="absolute inset-0 w-full h-full object-cover z-0" onerror="this.style.display='none';">` : ``}
        <div class="absolute bottom-2 inset-x-2 flex justify-center z-10 pointer-events-none">
          <div class="px-3 py-1 rounded-md bg-black/45 shadow-md">
            <div class="text-white text-[13px] font-bold text-center">${cat.name || ""}</div>
          </div>
        </div>
      `;
      card.addEventListener("click", () => renderCategory(cat.id, cat.name));
      nav.appendChild(card);
      if (idx === 0) { activeCatId = cat.id; renderCategory(cat.id, cat.name); }
    });
    updateActiveCatStyles();
  }
  function openCart() {
    if (s?.online_orders !== true) return;
    const modal = document.getElementById("cart-modal");
    const drawer = document.getElementById("cart-drawer");
    if (!modal || !drawer) return;
    modal.classList.remove("hidden");
    void modal.offsetWidth;
    drawer.classList.remove("translate-x-full");
    renderCartPanel();
  }
  function closeCart() {
    const modal = document.getElementById("cart-modal");
    const drawer = document.getElementById("cart-drawer");
    if (!modal || !drawer) return;
    drawer.classList.add("translate-x-full");
    setTimeout(() => { modal.classList.add("hidden"); }, 300);
  }
  function renderCartPanel() {
    if (s?.online_orders !== true) return;
    const box = document.getElementById("cart-items");
    const prevNote = document.getElementById("customer-note")?.value || "";
    const prevName = document.getElementById("customer-name")?.value || "";
    const prevPhone = document.getElementById("customer-phone")?.value || "";
    const prevAddress = document.getElementById("customer-address")?.value || "";
    const zones = Array.isArray(s?.shipping_zones) ? s.shipping_zones : [];
    const enabled = (s?.shipping_enabled === true);
    let idx = Number(localStorage.getItem("restaurant_shipping_zone_idx") || "0");
    if (!Number.isFinite(idx) || idx < 0 || idx >= zones.length) idx = 0;
    const cart = getCart();
    box.innerHTML = "";
    if (!cart.length) { box.innerHTML = `<p class="text-center text-[#331A12]/70">سلتك فارغة.</p>`; }
    else {
      cart.forEach((it, i) => {
        const el = document.createElement("div");
        el.className = "flex items-center gap-3 py-2";
        const img = `
          <div class="relative w-12 h-12 rounded-lg overflow-hidden">
            ${it.img ? `<img src="${it.img}" class="absolute inset-0 w-full h-full object-cover" onerror="this.style.display='none'; this.parentNode.querySelector('.cart-fallback')?.classList.remove('hidden')">` : ``}
            <div class="cart-fallback absolute inset-0 w-full h-full bg-[#eee] ${it.img ? 'hidden' : ''}"></div>
          </div>
        `;
        const vLabel = it?.options?.variant ? `(${String(it.options.variant)})` : "";
        const addonsChips = Array.isArray(it?.options?.addons) ? it.options.addons.map(a => `<span class="inline-block px-2 py-0.5 rounded-full bg-[#eee] text-[#331A12] text-[11px]">+ ${String(a.label || "")}</span>`).join("") : "";
        el.innerHTML = `
          ${img}
          <div class="flex-1">
            <div class="font-bold text-[#331A12]">${it.name} ${vLabel}</div>
            ${addonsChips ? `<div class="mt-1 flex flex-wrap gap-1">${addonsChips}</div>` : ``}
            <div class="flex items-center gap-2 mt-1">
              <button class="qty-minus w-6 h-6 rounded-full border border-[#331A12]/20 flex items-center justify-center"><i data-lucide="minus" class="w-4 h-4"></i></button>
              <span class="text-sm font-bold text-[#331A12]">${Number(it.quantity)}</span>
              <button class="qty-plus w-6 h-6 rounded-full border border-[#331A12]/20 flex items-center justify-center"><i data-lucide="plus" class="w-4 h-4"></i></button>
              <span class="ml-auto text-sm font-bold text-[#331A12]">${Number(it.price).toLocaleString()} د.ع</span>
            </div>
          </div>
        `;
        el.querySelector(".qty-plus")?.addEventListener("click", () => {
          const c = getCart();
          c[i].quantity = Number(c[i].quantity || 1) + 1;
          setCart(c);
          renderCartPanel();
        });
        el.querySelector(".qty-minus")?.addEventListener("click", () => {
          const c = getCart();
          c[i].quantity = Math.max(0, Number(c[i].quantity || 1) - 1);
          if (c[i].quantity <= 0) c.splice(i, 1);
          setCart(c);
          renderCartPanel();
        });
        box.appendChild(el);
      });
      const divider = document.createElement("div");
      divider.className = "border-t border-[#331A12]/10 my-3";
      box.appendChild(divider);
      const form = document.createElement("div");
      form.id = "cart-extra-fields";
      form.className = "space-y-3";
      form.innerHTML = `
        <label class="block text-[#331A12] font-bold">ملاحظة الزبون</label>
        <textarea id="customer-note" class="w-full border border-[#331A12]/20 rounded-lg p-2 h-24"></textarea>
        <label class="block text-[#331A12] font-bold">الاسم*</label>
        <input id="customer-name" type="text" class="w-full border border-[#331A12]/20 rounded-lg p-2" />
        <label class="block text-[#331A12] font-bold">الرقم*</label>
        <input id="customer-phone" type="tel" inputmode="tel" class="w-full border border-[#331A12]/20 rounded-lg p-2" />
        <label class="block text-[#331A12] font-bold">العنوان*</label>
        <input id="customer-address" type="text" class="w-full border border-[#331A12]/20 rounded-lg p-2" />
        ${enabled && zones.length ? `
        <label class="block text-[#331A12] font-bold">منطقة الشحن*</label>
        <select id="shipping-zone" class="w-full border border-[#331A12]/20 rounded-lg p-2">
          ${zones.map((z, i) => {
            const nm = String(z?.name || z?.zone || "");
            const f = Number(z?.fee || 0);
            return `<option value="${i}">${nm} — ${f.toLocaleString()} د.ع</option>`;
          }).join("")}
        </select>
        ` : ``}
      `;
      box.appendChild(form);
      const noteEl = document.getElementById("customer-note"); if (noteEl) noteEl.value = prevNote;
      const nameEl = document.getElementById("customer-name"); if (nameEl) nameEl.value = prevName;
      const phoneEl = document.getElementById("customer-phone"); if (phoneEl) phoneEl.value = prevPhone;
      const addrEl = document.getElementById("customer-address"); if (addrEl) addrEl.value = prevAddress;
      const subtotal = cart.reduce((s, it) => s + Number(it.price || 0) * Number(it.quantity || 1), 0);
      let fee = 0;
      let zoneName = "";
      if (enabled && zones.length) {
        fee = Number(zones[idx]?.fee || 0);
        zoneName = String(zones[idx]?.name || zones[idx]?.zone || "");
        const selEl = document.getElementById("shipping-zone");
        if (selEl) {
          selEl.value = String(idx);
          selEl.onchange = () => {
            try { localStorage.setItem("restaurant_shipping_zone_idx", String(selEl.value || "0")); } catch {}
            renderCartPanel();
          };
        }
      }
      const sumEl = document.createElement("div");
      sumEl.id = "cart-summary";
      sumEl.className = "border-t border-[#331A12]/10 mt-3 pt-3 text-sm text-[#331A12]";
      if (subtotal > 0) {
        sumEl.innerHTML = `
          <div class="flex items-center justify-between"><span>المجموع</span><span>${Number(subtotal).toLocaleString()} د.ع</span></div>
          <div class="flex items-center justify-between font-bold"><span>الإجمالي</span><span>${Number(subtotal).toLocaleString()} د.ع</span></div>
        `;
        box.appendChild(sumEl);
      }
    }
    updateCartBadge();
    try { if (window.lucide && typeof window.lucide.createIcons === "function") window.lucide.createIcons(); } catch {}
  }
  function sendOrderViaWhatsApp() {
    const cart = getCart();
    if (!cart.length) return;
    const subTotal = cart.reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 1), 0);
    const note = document.getElementById("customer-note")?.value || "";
    const nameEl = document.getElementById("customer-name");
    const phoneEl = document.getElementById("customer-phone");
    const addrEl = document.getElementById("customer-address");
    const zoneEl = document.getElementById("shipping-zone");
    const name = String(nameEl?.value || "").trim();
    const phone = String(phoneEl?.value || "").trim();
    const address = String(addrEl?.value || "").trim();
    const zones = Array.isArray(s?.shipping_zones) ? s.shipping_zones : [];
    const enabledShipping = (s?.shipping_enabled === true) && zones.length > 0;
    let zoneIdx = Number(localStorage.getItem("restaurant_shipping_zone_idx") || "0");
    if (!Number.isFinite(zoneIdx) || zoneIdx < 0 || zoneIdx >= zones.length) zoneIdx = 0;
    if (zoneEl && String(zoneEl.value || "") !== "") {
      const parsed = Number(zoneEl.value || "0");
      if (Number.isFinite(parsed) && parsed >= 0 && parsed < zones.length) zoneIdx = parsed;
    }
    const shippingFee = enabledShipping ? Number(zones[zoneIdx]?.fee || 0) : 0;
    const zoneName = enabledShipping ? String(zones[zoneIdx]?.name || zones[zoneIdx]?.zone || "") : "";
    const grandTotal = subTotal + (enabledShipping ? shippingFee : 0);
    document.querySelectorAll("#cart-items .field-error").forEach(n => n.remove());
    [nameEl, phoneEl, addrEl, zoneEl].forEach(el => { if (el) el.style.borderColor = ""; });
    const errors = [];
    const addError = (el, msg) => {
      if (!el) return;
      el.style.borderColor = "#ef4444";
      const m = document.createElement("div");
      m.className = "field-error";
      m.style.cssText = "color:#b91c1c;font-size:12px;margin-top:4px;";
      m.textContent = msg;
      el.insertAdjacentElement("afterend", m);
    };
    if (!name) { errors.push("name"); addError(nameEl, "الاسم مطلوب"); }
    const digits = phone.replace(/\D+/g, "");
    if (!digits || digits.length < 7) { errors.push("phone"); addError(phoneEl, "الرقم مطلوب"); }
    if (!address) { errors.push("address"); addError(addrEl, "العنوان مطلوب"); }
    if ((s?.shipping_enabled === true) && zones.length) {
      const val = String(zoneEl?.value ?? "");
      if (val === "") { errors.push("zone"); addError(zoneEl, "منطقة الشحن مطلوبة"); }
    }
    if (errors.length) {
      const first = nameEl || phoneEl || addrEl || zoneEl;
      first?.focus();
      return;
    }
    const itemsLines = cart.map(i => {
      const itemTotal = Number(i.price || 0) * Number(i.quantity || 1);
      return ` * ${i.name} x ${i.quantity} — ${itemTotal.toLocaleString()} د.ع`;
    }).join("%0A");
    const msg =
      `*فاتورة الطلب*%0A` +
      ` *الأصناف:*%0A` +
      `${itemsLines}%0A` +
      `*المجموع:* *${subTotal.toLocaleString()} د.ع*%0A` +
      (enabledShipping && shippingFee > 0 ? `*أجور الشحن${zoneName ? ` (${zoneName})` : ""}:* *${shippingFee.toLocaleString()} د.ع*%0A` : ``) +
      `*الإجمالي:* *${grandTotal.toLocaleString()} د.ع*%0A` +
      (name ? `*الاسم:* *${name}*%0A` : ``) +
      (phone ? `*الرقم:* *${phone}*%0A` : ``) +
      (address ? `*العنوان:* *${address}*%0A` : ``) +
      `*ملاحظة:* ${note || ""}`;
    const num = String(s?.whatsapp_number || "").replace(/\D+/g, "");
    const url = num ? `https://wa.me/${num}?text=${msg}` : `https://wa.me/?text=${msg}`;
    window.open(url, "_blank", "noopener");
  }
  function callOrder() {
    const num = String(s?.phone_number || "").replace(/\D+/g, "");
    if (num) window.location.href = `tel:${num}`;
  }
  function openPreview(item, img) {
    const modal = document.getElementById("item-modal");
    const im = document.getElementById("item-preview-image");
    const nm = document.getElementById("item-preview-name");
    const ds = document.getElementById("item-preview-description");
    const pr = document.getElementById("item-preview-price");
    const opts = document.getElementById("item-preview-options");
    const add = document.getElementById("item-preview-add");
    if (!modal) return;
    if (im) im.src = img || "";
    if (nm) nm.textContent = item.name || "";
    if (ds) ds.textContent = item.description || "";
    if (s?.online_orders !== true) {
      if (opts) opts.innerHTML = "";
      if (add) {
        add.onclick = null;
        add.style.display = "none";
      }
      if (pr) pr.textContent = `${Number(item.price || 0).toLocaleString()} د.ع`;
      modal.classList.remove("hidden");
      return;
    }
    if (add) add.style.display = "";
    let selectedVariant = null;
    let selectedAddons = [];
    const vars = Array.isArray(item.variants) ? item.variants.filter(v => Number(v?.price || 0) > 0) : [];
    const adds = Array.isArray(item.addons) ? item.addons : [];
    function minVar() {
      const nums = vars.map(v => Number(v?.price || 0)).filter(n => Number.isFinite(n) && n > 0);
      return nums.length ? Math.min(...nums) : Number(item.price || 0);
    }
    function computePrice() {
      const baseVariant = selectedVariant != null ? Number(selectedVariant.price || 0) : minVar();
      const addonsTotal = selectedAddons.reduce((s, a) => s + Number(a.price || 0), 0);
      return Number(baseVariant + addonsTotal);
    }
    if (opts) {
      opts.innerHTML = "";
      if (vars.length) {
        const box = document.createElement("div");
        box.className = "rounded-lg border border-[#331A12]/15 p-3";
        const title = document.createElement("div");
        title.className = "text-sm font-bold text-[#331A12] mb-2";
        title.textContent = "الأحجام";
        box.appendChild(title);
        vars.forEach((v, idx) => {
          const row = document.createElement("label");
          row.className = "flex items-center justify-between gap-2 py-1";
          row.innerHTML = `
            <span class="text-sm">${String(v.label || v.key || "")}</span>
            <span class="text-xs text-[#331A12]/60">${Number(v.price||0).toLocaleString()} د.ع</span>
            <input type="radio" name="preview-size" class="accent-[var(--brand-1,#2c98aa)]">
          `;
          const inp = row.querySelector("input");
          inp.checked = idx === 0 && !selectedVariant;
          inp.addEventListener("change", () => {
            selectedVariant = v;
            if (pr) pr.textContent = `${computePrice().toLocaleString()} د.ع`;
          });
          box.appendChild(row);
        });
        if (!selectedVariant && vars.length) selectedVariant = vars[0];
        opts.appendChild(box);
      }
      if (adds.length) {
        const box = document.createElement("div");
        box.className = "space-y-2 mt-2";
        const chip = document.createElement("div");
        chip.className = "inline-flex items-center px-3 py-1 rounded-full border border-[#331A12]/15 text-[#331A12] bg-white text-xs w-fit";
        chip.textContent = "الإضافات";
        box.appendChild(chip);
        selectedAddons = [];
        adds.forEach(a => {
          const row = document.createElement("label");
          row.className = "flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#331A12]/15 bg-white";
          row.innerHTML = `
            <input type="checkbox" class="accent-[var(--brand-1,#2c98aa)]">
            <span class="text-sm">${String(a.label || a.name || a.title || "")} <span class="text-xs text-[#331A12]/60">(+ ${Number(a.price||0).toLocaleString()} د.ع)</span></span>
          `;
          const inp = row.querySelector("input");
          inp.addEventListener("change", () => {
            if (inp.checked) selectedAddons.push(a); else selectedAddons = selectedAddons.filter(x => (x.label||"") !== (a.label||""));
            if (pr) pr.textContent = `${computePrice().toLocaleString()} د.ع`;
          });
          box.appendChild(row);
        });
        opts.appendChild(box);
      }
    }
    if (pr) pr.textContent = `${computePrice().toLocaleString()} د.ع`;
    if (add) add.onclick = () => {
      const variantLabel = selectedVariant ? String(selectedVariant.label || selectedVariant.key || "") : null;
      const cartPrice = computePrice();
      const options = { variant: variantLabel, addons: selectedAddons.map(a => ({ label: a.label, price: a.price })) };
      addToCart({ id: item.id, price: cartPrice, name: item.name, img, options });
      closePreview();
    };
    modal.classList.remove("hidden");
  }
  function closePreview() {
    const modal = document.getElementById("item-modal");
    if (modal) modal.classList.add("hidden");
  }
  document.getElementById("open-cart-btn")?.addEventListener("click", openCart);
  document.getElementById("nav-cart")?.addEventListener("click", openCart);
  document.getElementById("close-cart-btn")?.addEventListener("click", closeCart);
  document.getElementById("submit-order-btn")?.addEventListener("click", sendOrderViaWhatsApp);
  document.getElementById("call-order-btn")?.addEventListener("click", (e) => { e.preventDefault(); callOrder(); });
  document.getElementById("close-item-btn")?.addEventListener("click", closePreview);
  document.getElementById("nav-more")?.addEventListener("click", () => {
    const m = document.getElementById("more-menu");
    if (!m) return;
    const hidden = m.classList.contains("hidden");
    if (hidden) m.classList.remove("hidden"); else m.classList.add("hidden");
  });
  document.getElementById("instagram-btn")?.setAttribute("href", s?.instagram_url || "https://instagram.com/");
  document.getElementById("facebook-btn")?.setAttribute("href", "https://facebook.com/");
  document.getElementById("nav-map")?.addEventListener("click", () => {
    const loc = String(s?.location || "");
    if (loc) window.open(loc, "_blank", "noopener");
  });
  try {
    supabase
      .channel("settings_" + r.id)
      .on("postgres_changes", { event: "*", schema: "public", table: "settings", filter: `restaurant_id=eq.${r.id}` }, (payload) => {
        const en = payload?.new?.shipping_enabled;
        const zs = payload?.new?.shipping_zones;
        const on = payload?.new?.online_orders;
        if (typeof en === "boolean") s.shipping_enabled = en;
        if (Array.isArray(zs)) s.shipping_zones = zs;
        if (typeof on === "boolean") {
          s.online_orders = on;
          applyOnlineOrdersUI(s.online_orders === true);
          if (activeCatId) renderCategory(activeCatId, activeCatName);
        }
        updateCartBadge();
        renderCartPanel();
      })
      .subscribe();
  } catch {}
  document.getElementById("nav-home")?.addEventListener("click", () => {
    const hero = document.getElementById("hero-section");
    if (hero) hero.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  });
  await renderCategoriesNav();
  updateCartBadge();
  if (window.lucide && typeof window.lucide.createIcons === "function") window.lucide.createIcons();
}
