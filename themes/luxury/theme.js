export async function render({ slug, restaurant, settings }) {
  const app = document.getElementById("app");
  if (!app) return;
  const { supabase } = await import("/src/api/supabase.js");
  const setCssVar = (k, v) => {
    if (v && typeof v === "string" && v.trim()) document.documentElement.style.setProperty(k, v.trim());
  };
  function applyColors(s) {
    setCssVar("--brand-base", s?.color_primary);
    setCssVar("--brand-gold", s?.color_secondary);
    setCssVar("--bg-main", s?.color_bg_main);
    setCssVar("--bg-surface", s?.color_bg_surface);
    setCssVar("--text-main", s?.color_text);
    setCssVar("--text-heading", s?.color_heading);
    setCssVar("--border-color", s?.color_border);
    setCssVar("--shadow-color", s?.color_shadow);
    setCssVar("--brand-text", s?.color_bg_main);
  }
  function resolveImage(u, fallback) {
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
  }
  async function ensureRestaurant() {
    if (restaurant && restaurant.id) return restaurant;
    const { data } = await supabase
      .from("restaurants")
      .select("id, name, menu_enabled")
      .eq("slug", slug)
      .maybeSingle();
    return data || null;
  }
  async function ensureSettings(rid) {
    const base = (settings && typeof settings === "object") ? settings : {};
    const { data } = await supabase
      .from("settings")
      .select("logo_url, hero_url, online_orders, whatsapp_number, phone_number, location, splash1_url, splash2_url, splash3_url, splash4_url, active_splash, color_primary, color_secondary, color_bg_main, color_bg_surface, color_text, color_heading, color_border, color_shadow, instagram_url, instagram_color, hero_pill_text, hero_left_text, hero_right_text, shipping_enabled, shipping_zones")
      .eq("restaurant_id", rid)
      .maybeSingle();
    return { ...base, ...(data || {}) };
  }
  const r = await ensureRestaurant();
  if (!r || r.menu_enabled !== true) {
    document.body.innerHTML = "<h2>القائمة غير متاحة حالياً</h2>";
    return;
  }
  document.title = "منيو | " + (r.name || "");
  try { localStorage.setItem("restaurant_name", r.name || ""); } catch {}
  const s = await ensureSettings(r.id);
  applyColors(s || {});
  let idx = Number(s?.active_splash ?? 0);
  const list = [s?.splash1_url, s?.splash2_url, s?.splash3_url, s?.splash4_url];
  const heroChoice = (idx >= 1 && idx <= 4) ? list[idx - 1] : s?.hero_url;
  app.innerHTML = `
    <nav class="fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-all duration-300" id="navbar">
      <div class="max-w-md mx-auto flex justify-between items-center">
        <button id="menu-btn" class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
          <span class="lucide-menu"></span>
        </button>
        <div class="flex items-center gap-4">
          <button id="search-btn" class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <span class="lucide-search"></span>
          </button>
          <a id="nav-cart" class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors relative">
            <span class="lucide-shopping-cart"></span>
            <span id="cart-badge" class="absolute -top-1 -right-1 bg-brand-base text-white text-xs font-bold rounded-full h-5 min-w-[20px] px-1 hidden items-center justify-center">0</span>
          </a>
        </div>
      </div>
    </nav>
    <header class="relative h-[48vh] w-full overflow-hidden hero-clip bg-[var(--brand-base,#2C1810)]">
      <div class="absolute inset-0 geometric-pattern"></div>
      <div class="absolute top-0 right-0 w-[85%] h-[90%] overflow-hidden rounded-bl-[100px] border-l-2 border-b-2 border-brand-gold/20 z-10 shadow-2xl">
        <img id="hero-image" src="" class="w-full h-full object-cover opacity-80 scale-105" alt="" loading="lazy" onerror="this.style.display='none'">
        <div class="absolute inset-0 bg-gradient-to-t from-[var(--brand-base,#2C1810)] via-transparent to-transparent"></div>
      </div>
      <div class="absolute left-4 top-12 w-[3px] h-40 bg-[var(--brand-gold,#C5A059)]/80 rounded-full z-20 pointer-events-none"></div>
      <div class="absolute left-4 bottom-24 w-32 h-[3px] bg-[var(--brand-gold,#C5A059)]/80 rounded-full z-20 pointer-events-none"></div>
      <div class="absolute left-1/2 -translate-x-1/2 bottom-8 w-8 h-[3px] bg-[var(--brand-gold,#C5A059)]/80 rounded-full z-20 pointer-events-none"></div>
      <div class="absolute bottom-[18%] right-0 left-0 text-center z-30 px-6">
        <div class="inline-block border border-brand-gold/50 px-4 py-1 mb-4 rounded-full backdrop-blur-sm bg-[color-mix(in_oklab,var(--brand-base,#2C1810),transparent 70%)]">
          <span class="text-[var(--brand-gold,#C5A059)] text-xs font-bold tracking-[0.2em] uppercase">${s?.hero_pill_text || 'Architecture of Taste'}</span>
        </div>
        <h1 class="text-5xl md:text-6xl font-black text-white tracking-tight leading-none drop-shadow-lg">
          <span class="text-[var(--brand-gold,#C5A059)]">${r.name || ""}</span>
        </h1>
      </div>
    </header>
    <main class="max-w-lg mx-auto px-5 relative -mt-10 z-40 space-y-8 pb-24">
      <div class="glass-panel p-4 rounded-2xl flex justify-between items-center">
        <div class="text-center flex-1 border-l border-brand-gold/20">
          <span class="text-[var(--brand-gold,#C5A059)] text-xs font-bold uppercase">${s?.hero_right_text || 'مفتوح الآن'}</span>
        </div>
        <div class="text-center flex-1 border-l border-brand-gold/20">
          <a href="${s?.instagram_url || 'https://instagram.com/'}" target="\_blank" rel="noopener" aria-label="Instagram" class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/20 hover:bg-white/20" style="color: ${s?.instagram_color || '#374151'}">
            <span class="lucide-instagram"></span>
          </a>
        </div>
        <div class="text-center flex-1">
          <span class="text-[var(--brand-gold,#C5A059)] text-xs font-bold uppercase">${s?.hero_left_text || 'مرحباً بكم'}</span>
        </div>
      </div>
      <div class="flex items-center justify-between pt-4">
        <div>
          <h2 class="text-2xl font-bold text-[var(--brand-base,#2C1810)]">قائمة الطعام</h2>
          <div class="h-1 w-12 bg-[var(--brand-gold,#C5A059)] mt-1 rounded-full"></div>
        </div>
        <button id="browse-btn" class="text-xs font-bold text-[color-mix(in_oklab,var(--brand-base,#2C1810),white 40%)] flex items-center gap-1 hover:text-[var(--brand-base,#2C1810)] transition-colors">تصفح الكل</button>
      </div>
      <div id="menu-container" class="space-y-6"></div>
    </main>
    <div id="fab-cart" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50" style="display: none;">
      <button id="fab-btn" class="relative bg-[var(--brand-base,#2C1810)] text-white pr-8 pl-14 py-4 rounded-full shadow-2xl flex items-center gap-4 hover:scale-105 transition-transform border border-[var(--brand-gold,#C5A059)]/30">
        <span class="absolute -left-6 w-12 h-12 rounded-full bg-[var(--brand-base,#2C1810)] shadow-xl border border-[var(--brand-gold,#C5A059)]/30 flex items-center justify-center text-white">
          <i data-lucide="shopping-cart" class="w-6 h-6 text-white"></i>
        </span>
        <div class="w-[1px] h-8 bg-[var(--brand-gold,#C5A059)]/60"></div>
        <div class="flex flex-col items-end">
          <span class="text-[10px] text-[var(--brand-gold,#C5A059)] uppercase tracking-wider font-bold">المجموع</span>
          <span class="font-bold font-mono text-lg leading-none" id="fab-total">0 د.ع</span>
        </div>
      </button>
    </div>
    <footer class="fixed bottom-0 left-0 right-0 z-40">
      <div class="w-full px-4 py-2 text-center bg-white/85 backdrop-blur-md border-t border-[var(--brand-base,#2C1810)]/10">
        <span class="text-[var(--brand-base,#2C1810)] text-xs md:text-sm">تم صنعها بواسطة | </span>
        <span class="text-[var(--brand-gold,#C5A059)] font-bold text-xs md:text-sm">İQR MENU</span>
      </div>
    </footer>
    <div id="cart-overlay" class="fixed inset-0 bg-[var(--brand-base,#2C1810)]/80 backdrop-blur-sm z-[55] hidden transition-opacity opacity-0"></div>
    <aside id="cart-panel" class="fixed inset-y-0 right-0 w-full max-w-sm bg-[var(--brand-text,#FDFBF7)] z-[60] transform translate-x-full transition-transform duration-500 shadow-2xl flex flex-col">
      <div class="h-[30vh] relative p-6 flex flex-col justify-end overflow-hidden">
        <img id="cart-hero-image" src="" class="absolute inset-0 w-full h-full object-cover scale-105" alt="" onerror="this.style.display='none'">
        <div class="absolute inset-0 bg-black/60"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <button id="cart-close" class="absolute top-6 left-6 text-white hover:text-[var(--brand-gold,#C5A059)] transition-colors">×</button>
        <h2 class="text-3xl font-bold text-white mb-1">طلباتك</h2>
        <p class="text-[var(--brand-gold,#C5A059)] text-sm opacity-80">سيتم تجهيزها بعناية</p>
      </div>
      <div id="cart-items" class="flex-1 overflow-y-auto p-6 space-y-4">
        <div class="h-full flex flex-col items-center justify-center text-[color-mix(in_oklab,var(--brand-base,#2C1810),#000 35%)]/40">
          <span class="lucide-cup-soda text-5xl mb-2"></span>
          <p>السلة فارغة</p>
        </div>
      </div>
      <div class="p-6 bg-white border-t border-[var(--brand-base,#2C1810)]/10">
        <div id="shipping-box" class="mb-3 hidden"><select id="shipping-zone" class="w-full border border-gray-200 rounded-lg p-2 text-sm"></select></div>
        <div id="cart-summary" class="mb-3 text-sm text-[var(--brand-base,#2C1810)] hidden"></div>
        <button id="checkout-btn" class="w-full bg-[var(--brand-base,#2C1810)] text-[var(--brand-gold,#C5A059)] font-bold py-4 rounded-xl shadow-lg hover:bg-gray-900 transition-colors flex justify-between px-6 items-center">
          <span>تأكيد الطلب</span>
          <span class="lucide-arrow-right"></span>
        </button>
      </div>
    </aside>
    <div id="search-overlay" class="fixed inset-0 bg-[var(--brand-base,#2C1810)]/60 backdrop-blur-sm z-[65] hidden transition-opacity opacity-0"></div>
    <div id="search-panel" class="fixed top-16 left-1/2 -translate-x-1/2 z-[70] w-[92%] max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden hidden">
      <div class="p-4 border-b border-[var(--brand-base,#2C1810)]/10 flex items-center gap-2">
        <input id="search-input" class="flex-1 outline-none text-[var(--brand-base,#2C1810)]" type="text" placeholder="ابحث عن منتج..." />
        <button id="search-close" class="text-[color-mix(in_oklab,var(--brand-base,#2C1810),white 40%)] hover:text-[var(--brand-base,#2C1810)] transition-colors">×</button>
      </div>
      <div id="search-results" class="max-h-[50vh] overflow-y-auto p-4 space-y-2"></div>
    </div
    <div id="preview-overlay" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[75] hidden transition-opacity opacity-0"></div>
    <div id="preview-panel" class="fixed inset-0 z-[80] flex items-center justify-center hidden">
      <div class="relative bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-[92%] overflow-hidden">
        <button id="preview-close" class="absolute top-3 left-3 w-10 h-10 rounded-full bg-white text-[var(--brand-base,#2C1810)] shadow-lg flex items-center justify-center">×</button>
        <img id="preview-image" src="" class="w-full h-64 object-cover" onerror="this.style.display='none'">
        <div class="p-4">
          <h4 id="preview-name" class="font-bold text-lg text-[var(--brand-base,#2C1810)]"></h4>
          <p id="preview-desc" class="text-sm text-gray-600"></p>
          <div class="mt-3 flex justify-between items-center">
            <span id="preview-price" class="font-bold"></span>
            ${s?.online_orders === true ? `<button id="preview-add" class="bg-[var(--brand-base,#2C1810)] text-[var(--brand-gold,#C5A059)] px-4 py-2 rounded-lg">إضافة إلى السلة</button>` : ``}
          </div>
        </div>
      </div>
    </div>
  `;
  const heroImg = document.getElementById("hero-image");
  if (heroImg) heroImg.src = resolveImage(heroChoice, heroImg.src);
  const cartHeroImg = document.getElementById("cart-hero-image");
  if (cartHeroImg) cartHeroImg.src = resolveImage(heroChoice, cartHeroImg.src);
  function applyOnlineOrdersUI(on) {
    const navCartEl = document.getElementById("nav-cart");
    if (navCartEl) navCartEl.style.display = on ? "" : "none";
    const checkoutEl = document.getElementById("checkout-btn");
    if (checkoutEl) checkoutEl.style.display = on ? "" : "none";
    const fabEl = document.getElementById("fab-cart");
    if (fabEl) fabEl.style.display = on ? fabEl.style.display : "none";
    const prevAdd = document.getElementById("preview-add");
    if (prevAdd) prevAdd.style.display = on ? "" : "none";
    document.querySelectorAll(".product-add").forEach(b => { (b instanceof HTMLElement) && (b.style.display = on ? "" : "none"); });
    document.querySelectorAll(".variant-add").forEach(b => { (b instanceof HTMLElement) && (b.style.display = on ? "" : "none"); });
    document.querySelectorAll(".search-add").forEach(b => { (b instanceof HTMLElement) && (b.style.display = on ? "" : "none"); });
  }
  applyOnlineOrdersUI(s?.online_orders === true);
  try {
    supabase
      .channel("settings_" + r.id)
      .on("postgres_changes", { event: "*", schema: "public", table: "settings", filter: `restaurant_id=eq.${r.id}` }, (payload) => {
        const val = payload?.new?.online_orders;
        if (typeof val === "boolean") {
          s.online_orders = val;
          applyOnlineOrdersUI(s.online_orders === true);
          updateCartBadge();
        }
      })
      .subscribe();
  } catch {}
  let allView = false;
  const cartKey = "restaurant_menu_cart";
  function getCart() {
    const saved = localStorage.getItem(cartKey);
    if (!saved) return [];
    try { return JSON.parse(saved) || []; } catch { return []; }
  }
  function setCart(cart) {
    try { localStorage.setItem(cartKey, JSON.stringify(Array.isArray(cart) ? cart : [])); } catch {}
    updateCartBadge();
  }
  function addToCart({ id, price, name, img, options }) {
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
      const item = { productId: String(id || ""), name: String(name || ""), price: Number(price || 0), quantity: 1, img: String(img || ""), options: options || null };
      cart.push(item);
    }
    setCart(cart);
    renderCartPanel();
  }
  function updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    const fab = document.getElementById("fab-cart");
    const totalEl = document.getElementById("fab-total");
    const onlineOrders = s?.online_orders === true;
    if (!onlineOrders) {
      if (badge) { badge.classList.remove("hidden"); badge.classList.remove("flex"); badge.style.display = "none"; }
      if (fab) fab.style.display = "none";
      if (totalEl) totalEl.textContent = `0 د.ع`;
      return;
    }
    const cart = getCart();
    const count = cart.reduce((s, i) => s + Number(i.quantity || 1), 0);
    const total = cart.reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 1), 0);
    if (badge) {
      badge.textContent = String(count);
      if (count > 0) {
        badge.classList.remove("hidden");
        badge.classList.add("flex");
        badge.style.display = "flex";
      } else {
        badge.classList.remove("flex");
        badge.style.display = "none";
      }
    }
    if (fab) fab.style.display = count > 0 ? "block" : "none";
    if (totalEl) totalEl.textContent = `${Number(total).toLocaleString()} د.ع`;
  }
  function toggleCart(open) {
    const panel = document.getElementById("cart-panel");
    const overlay = document.getElementById("cart-overlay");
    if (!panel || !overlay) return;
    if (open) {
      renderCartPanel();
      overlay.classList.remove("hidden");
      void overlay.offsetWidth;
      overlay.classList.add("opacity-100");
      panel.classList.remove("translate-x-full");
    } else {
      panel.classList.add("translate-x-full");
      overlay.classList.remove("opacity-100");
      setTimeout(() => overlay.classList.add("hidden"), 300);
    }
  }
  function ensureCheckoutDom() {
    let overlay = document.getElementById("checkout-overlay");
    let panel = document.getElementById("checkout-panel");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "checkout-overlay";
      overlay.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[85] hidden transition-opacity opacity-0";
      document.body.appendChild(overlay);
      overlay.addEventListener("click", closeCheckout);
    }
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "checkout-panel";
      panel.className = "fixed inset-0 z-[90] flex items-center justify-center hidden";
      panel.innerHTML = `
        <div class="relative bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-[92%] overflow-hidden">
          <div class="relative bg-[var(--brand-base,#2C1810)] p-5 text-white">
            <button id="checkout-close" class="absolute top-3 left-3 text-white/90 hover:text-[var(--brand-gold,#C5A059)]">×</button>
            <h3 class="text-2xl font-bold">تأكيد الطلب</h3>
            <p class="text-[var(--brand-gold,#C5A059)] text-sm">أدخل بياناتك ثم راجع الفاتورة</p>
          </div>
          <div class="p-5 space-y-4">
            <div class="grid grid-cols-1 gap-3">
              <input id="cust-name" type="text" class="w-full border border-gray-200 rounded-lg p-3 text-sm" placeholder="الاسم" />
              <input id="cust-phone" type="tel" inputmode="tel" class="w-full border border-gray-200 rounded-lg p-3 text-sm" placeholder="الرقم" />
              <input id="cust-address" type="text" class="w-full border border-gray-200 rounded-lg p-3 text-sm" placeholder="العنوان" />
              <select id="cust-zone" class="w-full border border-gray-200 rounded-lg p-3 text-sm"></select>
              <textarea id="cust-note" rows="2" class="w-full border border-gray-200 rounded-lg p-3 text-sm" placeholder="ملاحظة"></textarea>
            </div>
            <div class="flex items-center gap-3 pt-2">
              <button id="checkout-cancel" class="flex-1 py-3 bg-gray-100 text-gray-800 font-bold rounded-xl border border-gray-200">إلغاء</button>
              <button id="checkout-wa" class="flex-[2] py-3 bg-[var(--brand-base,#2C1810)] text-[var(--brand-gold,#C5A059)] font-bold rounded-xl shadow-lg">إرسال عبر واتساب</button>
            </div>
          </div>
        </div>`;
      document.body.appendChild(panel);
      document.getElementById("checkout-close")?.addEventListener("click", closeCheckout);
      document.getElementById("checkout-cancel")?.addEventListener("click", closeCheckout);
      document.getElementById("checkout-wa")?.addEventListener("click", sendOrderViaWhatsApp);
      const nameEl = document.getElementById("cust-name");
      const phoneEl = document.getElementById("cust-phone");
      const addressEl = document.getElementById("cust-address");
      const noteEl = document.getElementById("cust-note");
      const persist = () => {
        const info = { name: nameEl?.value || "", phone: phoneEl?.value || "", address: addressEl?.value || "" };
        try { localStorage.setItem("restaurant_customer_info", JSON.stringify(info)); } catch {}
        try { localStorage.setItem("restaurant_menu_cart_note", String(noteEl?.value || "")); } catch {}
      };
      nameEl?.addEventListener("input", persist);
      phoneEl?.addEventListener("input", persist);
      addressEl?.addEventListener("input", persist);
      noteEl?.addEventListener("input", persist);
    }
    return { overlay, panel };
  }
  function openCheckout() {
    const { overlay, panel } = ensureCheckoutDom();
    const nameEl = document.getElementById("cust-name");
    const phoneEl = document.getElementById("cust-phone");
    const addressEl = document.getElementById("cust-address");
    const noteEl = document.getElementById("cust-note");
    let info = {};
    try { info = JSON.parse(localStorage.getItem("restaurant_customer_info") || "{}") || {}; } catch { info = {}; }
    if (nameEl) nameEl.value = String(info.name || "");
    if (phoneEl) phoneEl.value = String(info.phone || "");
    if (addressEl) addressEl.value = String(info.address || "");
    const savedNote = localStorage.getItem("restaurant_menu_cart_note") || "";
    if (noteEl) noteEl.value = String(savedNote || "");
    const zoneEl = document.getElementById("cust-zone");
    const zones = Array.isArray(s?.shipping_zones) ? s.shipping_zones : [];
    const enabled = (s?.shipping_enabled === true);
    if (zoneEl) {
      if (enabled && zones.length) {
        const opts = zones.map((z, i) => {
          const nm = String(z?.name || z?.zone || "");
          const fee = Number(z?.fee || 0);
          return `<option value="${i}">${nm} — ${fee.toLocaleString()} د.ع</option>`;
        }).join("");
        zoneEl.innerHTML = opts;
        let idx = Number(localStorage.getItem("restaurant_shipping_zone_idx") || "0");
        if (!Number.isFinite(idx) || idx < 0 || idx >= zones.length) idx = 0;
        zoneEl.value = String(idx);
        zoneEl.classList.remove("hidden");
        zoneEl.onchange = () => { try { localStorage.setItem("restaurant_shipping_zone_idx", String(zoneEl.value || "0")); } catch {} };
      } else {
        zoneEl.classList.add("hidden");
      }
    }
    // removed smart suggestions
    overlay.classList.remove("hidden");
    void overlay.offsetWidth;
    overlay.classList.add("opacity-100");
    panel.classList.remove("hidden");
  }
  function closeCheckout() {
    const overlay = document.getElementById("checkout-overlay");
    const panel = document.getElementById("checkout-panel");
    if (!overlay || !panel) return;
    overlay.classList.remove("opacity-100");
    setTimeout(() => overlay.classList.add("hidden"), 300);
    panel.classList.add("hidden");
  }
  function normalizeWhatsAppNumber(raw) {
    const digits = String(raw || "").replace(/\D/g, "");
    if (!digits) return "";
    if (digits.startsWith("964")) return digits.replace(/^9640/, "964");
    if (digits.startsWith("0")) return "964" + digits.slice(1);
    return digits;
  }
  function buildOrderMessage() {
    let info = {};
    try { info = JSON.parse(localStorage.getItem("restaurant_customer_info") || "{}") || {}; } catch { info = {}; }
    const note = localStorage.getItem("restaurant_menu_cart_note") || "";
    const cart = getCart();
    const subtotal = cart.reduce((sum, it) => sum + (Number(it.price || 0) * Number(it.quantity || 1)), 0);
    const zones = Array.isArray(s?.shipping_zones) ? s.shipping_zones : [];
    const enabled = (s?.shipping_enabled === true);
    let idx = Number(localStorage.getItem("restaurant_shipping_zone_idx") || "0");
    if (!Number.isFinite(idx) || idx < 0 || idx >= zones.length) idx = 0;
    const fee = (enabled && zones.length) ? Number(zones[idx]?.fee || 0) : 0;
    const zoneName = (enabled && zones.length) ? String(zones[idx]?.name || zones[idx]?.zone || "") : "";
    const itemsLines = cart.map(it => `- ${it.name} x ${it.quantity} — ${(Number(it.price||0)*Number(it.quantity||1)).toLocaleString()} د.ع`).join("\n");
    const parts = [
      "*فاتورة الطلب*",
      "",
      "*الأصناف:*",
      itemsLines || "—",
      "",
      `*المجموع:* *${subtotal.toLocaleString()} د.ع*`,
      (enabled && fee > 0) ? `*أجور الشحن${zoneName ? ` (${zoneName})` : ""}:* *${fee.toLocaleString()} د.ع*` : "",
      `*الإجمالي:* *${(subtotal + fee).toLocaleString()} د.ع*`,
      "",
      `*الاسم:* *${String(info.name||"")}*`,
      `*الرقم:* *${String(info.phone||"")}*`,
      info.address ? `*العنوان:* *${String(info.address)}*` : "",
      note ? `*ملاحظة:* ${String(note)}` : ""
    ].filter(Boolean);
    return parts.join("\n");
  }
  async function sendOrderViaWhatsApp() {
    const cart = getCart();
    if (!Array.isArray(cart) || cart.length === 0) { alert("السلة فارغة."); return; }
    let info = {};
    try { info = JSON.parse(localStorage.getItem("restaurant_customer_info") || "{}") || {}; } catch { info = {}; }
    const req = [];
    if (!info.name) req.push("الاسم");
    if (!info.phone) req.push("الرقم");
    if (!info.address) req.push("العنوان");
    if (req.length) { alert("الحقول الإجبارية ناقصة:\n- " + req.join("\n- ")); return; }
    const msg = buildOrderMessage();
    const waNum = normalizeWhatsAppNumber((s?.whatsapp_number) || (localStorage.getItem("restaurant_whatsapp_number") || ""));
    const url = `https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`;
    try {
      const a = document.createElement("a");
      a.href = url; a.target = "_blank"; a.rel = "noopener";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } catch { window.open(url, "_blank"); }
    try {
      const subtotal = cart.reduce((sum, it) => sum + (Number(it.price || 0) * Number(it.quantity || 1)), 0);
      const zones = Array.isArray(s?.shipping_zones) ? s.shipping_zones : [];
      const enabled = (s?.shipping_enabled === true);
      let idx = Number(localStorage.getItem("restaurant_shipping_zone_idx") || "0");
      if (!Number.isFinite(idx) || idx < 0 || idx >= zones.length) idx = 0;
      const fee = (enabled && zones.length) ? Number(zones[idx]?.fee || 0) : 0;
      const total = subtotal + fee;
      const itemsPayload = cart.map(it => ({ name: it.name, qty: it.quantity, price: it.price }));
      await supabase.functions.invoke("capture-wa-order", {
        body: {
          restaurant_id: r.id,
          slug,
          customer_name: info.name || null,
          customer_phone: String(info.phone || "").replace(/\D/g, "") || null,
          customer_address: info.address || null,
          total: total,
          currency: "IQD",
          items: itemsPayload
        }
      });
    } catch {}
    closeCheckout();
  }
  // smart suggestions removed
  function renderCartPanel() {
    const itemsContainer = document.getElementById("cart-items");
    const cart = getCart();
    itemsContainer.innerHTML = "";
    if (!cart.length) {
      itemsContainer.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center text-[color-mix(in_oklab,var(--brand-base,#2C1810),#000 35%)]/40">
          <span class="lucide-cup-soda text-5xl mb-2"></span>
          <p>السلة فارغة</p>
        </div>`;
      const sumEl = document.getElementById("cart-summary");
      if (sumEl) { sumEl.classList.add("hidden"); sumEl.innerHTML = ""; }
      return;
    }
    cart.forEach((it, idx) => {
      const el = document.createElement("div");
      el.className = "flex items-center gap-3 bg-white p-2 rounded-lg border-l-4 border-[var(--brand-gold,#C5A059)] shadow-sm";
      const opt = it.options || {};
      const adds = Array.isArray(opt.addons) ? opt.addons.map(a => String(a.label||"")).filter(Boolean) : [];
      const optLine = [
        opt.variant ? `الحجم: ${opt.variant}` : "",
        adds.length ? `إضافات: ${adds.join(", ")}` : ""
      ].filter(Boolean).join(" • ");
      const hasImg = it.img && String(it.img).trim().length > 0;
      const imgTag = hasImg
        ? `<img src="${it.img}" class="w-12 h-12 rounded bg-gray-100 object-cover" onerror="this.style.display='none'">`
        : `<div class="w-12 h-12 rounded bg-gray-100"></div>`;
      el.innerHTML = `
        ${imgTag}
        <div class="flex-1">
          <h4 class="font-bold text-sm text-[var(--brand-base,#2C1810)]">${it.name}</h4>
          ${optLine ? `<p class="text-[10px] text-gray-500">${optLine}</p>` : ""}
          <p class="text-xs text-gray-500">${Number(it.price || 0).toLocaleString()} د.ع</p>
        </div>
        <div class="flex items-center gap-2 bg-gray-50 rounded px-1">
          <button class="text-red-500 hover:bg-red-50 p-1 rounded" data-op="minus">-</button>
          <span class="text-xs font-bold w-4 text-center">${it.quantity || 1}</span>
          <button class="text-green-600 hover:bg-green-50 p-1 rounded" data-op="plus">+</button>
          <button class="text-gray-600 hover:bg-gray-100 p-1 rounded" data-op="remove">×</button>
        </div>`;
      el.querySelector("[data-op='minus']").onclick = () => {
        const cart = getCart();
        cart[idx].quantity = Math.max(1, Number(cart[idx].quantity || 1) - 1);
        setCart(cart); renderCartPanel();
      };
      el.querySelector("[data-op='plus']").onclick = () => {
        const cart = getCart();
        cart[idx].quantity = Number(cart[idx].quantity || 1) + 1;
        setCart(cart); renderCartPanel();
      };
      el.querySelector("[data-op='remove']").onclick = () => {
        const cart = getCart();
        cart.splice(idx, 1);
        setCart(cart); renderCartPanel();
      };
      itemsContainer.appendChild(el);
    });
    updateCartBadge();
    const subtotal = cart.reduce((s, it) => s + Number(it.price || 0) * Number(it.quantity || 1), 0);
    const zones = Array.isArray(s?.shipping_zones) ? s.shipping_zones : [];
    const enabled = (s?.shipping_enabled === true);
    const selEl = document.getElementById("shipping-zone");
    const boxEl = document.getElementById("shipping-box");
    let idx = Number(localStorage.getItem("restaurant_shipping_zone_idx") || "0");
    if (!Number.isFinite(idx) || idx < 0 || idx >= zones.length) idx = 0;
    let fee = (enabled && zones.length) ? Number(zones[idx]?.fee || 0) : 0;
    let zoneName = (enabled && zones.length) ? String(zones[idx]?.name || zones[idx]?.zone || "") : "";
    if (selEl && boxEl) {
      if (enabled && zones.length) {
        selEl.innerHTML = zones.map((z, i) => {
          const nm = String(z?.name || z?.zone || "");
          const f = Number(z?.fee || 0);
          return `<option value="${i}">${nm} — ${f.toLocaleString()} د.ع</option>`;
        }).join("");
        selEl.value = String(idx);
        boxEl.classList.remove("hidden");
        selEl.onchange = () => {
          try { localStorage.setItem("restaurant_shipping_zone_idx", String(selEl.value || "0")); } catch {}
          renderCartPanel();
        };
        idx = Number(selEl.value || "0");
        if (!Number.isFinite(idx) || idx < 0 || idx >= zones.length) idx = 0;
        fee = Number(zones[idx]?.fee || 0);
        zoneName = String(zones[idx]?.name || zones[idx]?.zone || "");
      } else {
        boxEl.classList.add("hidden");
      }
    }
    const sumEl = document.getElementById("cart-summary");
    if (sumEl) {
      if (subtotal > 0 && enabled && fee > 0) {
        sumEl.innerHTML = `
          <div class="flex items-center justify-between"><span>المجموع</span><span>${Number(subtotal).toLocaleString()} د.ع</span></div>
          <div class="flex items-center justify-between"><span>أجور الشحن${zoneName ? ` (${zoneName})` : ""}</span><span>${Number(fee).toLocaleString()} د.ع</span></div>
          <div class="flex items-center justify-between font-bold"><span>الإجمالي</span><span>${Number(subtotal + fee).toLocaleString()} د.ع</span></div>
        `;
        sumEl.classList.remove("hidden");
      } else {
        sumEl.classList.add("hidden");
        sumEl.innerHTML = "";
      }
    }
  }
  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("id, name, image_url")
      .eq("restaurant_id", r.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    return Array.isArray(data) ? data : [];
  }
  async function fetchProducts(cid) {
    const cols = "id, name, description, price, image_url, available, variants, addons";
    const { data } = await supabase
      .from("products")
      .select(cols)
      .eq("restaurant_id", r.id)
      .eq("category_id", cid)
      .eq("available", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    return Array.isArray(data) ? data : [];
  }
  function productCard(item) {
    const imgSrc = resolveImage(item.image_url || "", "");
    const priceVal = Number(item.price || 0);
    const nameVal = String(item.name || "");
    const descText = String(item.description || "").trim();
    const hasAdds = Array.isArray(item.addons) && item.addons.length > 0;
    const onlineOrders = s?.online_orders === true;
    const hasVariants = Array.isArray(item.variants) && item.variants.length > 0;
    const vars = Array.isArray(item.variants) ? item.variants.filter(v => Number(v?.price || 0) > 0) : [];
    const variantsRow = vars.length ? `<div class="mt-2 flex flex-wrap gap-2">${vars.map(v => `
      <div class="inline-flex items-center gap-2 bg-[var(--brand-text,#FDFBF7)] border border-[var(--brand-base,#2C1810)]/10 rounded-full px-3 py-1">
        <span class="text-xs">${String(v.label || v.key || "")}</span>
        <span class="text-[10px] text-gray-500">${Number(v.price||0).toLocaleString()} د.ع</span>
        ${onlineOrders ? `<button class="variant-add w-6 h-6 rounded-full bg-[var(--brand-base,#2C1810)] text-[var(--brand-gold,#C5A059)]" data-key="${String(v.key || v.label || "")}">+</button>` : ``}
      </div>`).join("")}</div>` : "";
    const showPriceText = vars.length === 0;
    const el = document.createElement("div");
    el.className = "flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 hover:border-[var(--brand-gold,#C5A059)]/50 transition-colors";
    el.innerHTML = `
      <div class="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative">
        <img src="${imgSrc}" class="w-full h-full object-cover" onerror="this.style.display='none'">
        <div class="absolute inset-0 border border-black/5 rounded-lg pointer-events-none"></div>
      </div>
      <div class="flex-1">
        <h4 class="font-bold text-[var(--brand-base,#2C1810)] text-lg">${nameVal}</h4>
        <p class="item-desc hidden text-xs text-gray-600 mt-1" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;"></p>
        <div class="flex items-center gap-2">
          ${showPriceText ? `<span class="text-[color-mix(in_oklab,var(--brand-base,#2C1810),white 40%)] text-sm">${priceVal.toLocaleString()} د.ع</span>` : ``}
          ${hasAdds ? `<button class="addons-btn inline-flex items-center px-3 py-1 rounded-full border border-[var(--brand-base,#2C1810)]/15 bg-[var(--brand-text,#FDFBF7)] text-[var(--brand-base,#2C1810)] text-xs hover:border-[var(--brand-gold,#C5A059)]">الإضافات</button>` : ``}
        </div>
        ${variantsRow}
      </div>
      ${(showPriceText && onlineOrders) ? `<button class="product-add w-10 h-10 rounded-lg bg-[var(--brand-base,#2C1810)] text-[var(--brand-gold,#C5A059)] flex items-center justify-center hover:bg-[var(--brand-gold,#C5A059)] hover:text-[var(--brand-base,#2C1810)] transition-colors shadow-lg">+</button>` : ``}`;
    const descEl = el.querySelector(".item-desc");
    if (descEl) {
      if (descText) {
        descEl.textContent = descText;
        descEl.classList.remove("hidden");
      } else {
        descEl.remove();
      }
    }
    const btn = el.querySelector(".product-add");
    if (btn) {
      btn.onclick = (e) => {
        e.stopPropagation();
        if (hasAdds) {
          openPreview({ id: item.id, price: priceVal, name: nameVal, img: imgSrc, desc: String(item.description || ""), variants: item.variants || [], addons: item.addons || [] });
        } else {
          addToCart({ id: item.id, price: priceVal, name: nameVal, img: imgSrc });
          const prev = btn.textContent;
          btn.textContent = "✓";
          btn.disabled = true;
          setTimeout(() => {
            btn.textContent = prev || "+";
            btn.disabled = false;
          }, 1500);
        }
      };
    }
    const addBtn = el.querySelector(".addons-btn");
    if (addBtn) addBtn.onclick = (ev) => {
      ev.stopPropagation();
      openAddonsOnly({ id: item.id, price: priceVal, name: nameVal, img: imgSrc, desc: String(item.description || ""), variants: item.variants || [], addons: item.addons || [] });
    };
    el.querySelectorAll(".variant-add").forEach(b => {
      b.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const key = String(b.getAttribute("data-key") || "");
        const v = vars.find(vv => String(vv.key || vv.label || "") === key);
        const vPrice = Number(v?.price || 0);
        const vLabel = String(v?.label || v?.key || "");
        const hasOptions = Array.isArray(item.addons) && item.addons.length > 0;
        if (hasOptions) {
          openPreview({ id: item.id, price: vPrice, name: nameVal, img: imgSrc, desc: String(item.description || ""), variants: item.variants || [], addons: item.addons || [] });
        } else {
          addToCart({ id: item.id, price: vPrice, name: nameVal, img: imgSrc, options: { variant: vLabel, addons: [] } });
          const prev = b.textContent;
          b.textContent = "✓";
          b.disabled = true;
          setTimeout(() => { b.textContent = prev || "+"; b.disabled = false; }, 1500);
        }
      });
    });
    const imgEl = el.querySelector("img");
    if (imgEl) imgEl.onclick = (ev) => { ev.stopPropagation(); openPreview({ id: item.id, price: priceVal, name: nameVal, img: imgSrc, desc: String(item.description || ""), variants: item.variants || [], addons: item.addons || [] }); };
    el.onclick = null;
    return el;
  }
  function minVariantPrice(vars) {
    const list = Array.isArray(vars) ? vars : [];
    const nums = list.map(v => Number(v?.price || 0)).filter(n => Number.isFinite(n) && n > 0);
    return nums.length ? Math.min(...nums) : null;
  }
  function openAddonsOnly(item) {
    previewData = item || null;
    const { overlay, panel } = ensurePreviewDom();
    const img = document.getElementById("preview-image");
    const name = document.getElementById("preview-name");
    const desc = document.getElementById("preview-desc");
    const priceEl = document.getElementById("preview-price");
    const optsEl = document.getElementById("preview-options");
    const src = (item?.img && item.img.trim().length > 0) ? item.img : resolveImage(heroChoice || "", "");
    if (img) {
      img.src = src || "";
      img.style.display = src ? "" : "none";
      img.onerror = () => {
        const fb = resolveImage(heroChoice || "", "");
        if (fb) { img.style.display = ""; img.src = fb; }
      };
    }
    if (name) name.textContent = item.name || "";
    if (desc) desc.textContent = item.desc || "";
    let selectedAddons = [];
    function computePrice() {
      const base = (minVariantPrice(item?.variants) ?? Number(item.price || 0));
      const addonsTotal = selectedAddons.reduce((s, a) => s + Number(a.price || 0), 0);
      return Number(base + addonsTotal);
    }
    if (optsEl) {
      optsEl.innerHTML = "";
      const adds = Array.isArray(item?.addons) ? item.addons : [];
      if (adds.length) {
        const box = document.createElement("div");
        box.className = "space-y-2";
        const chip = document.createElement("div");
        chip.className = "inline-flex items-center px-3 py-1 rounded-full border border-[var(--brand-base,#2C1810)]/15 text-[var(--brand-base,#2C1810)] bg-[var(--brand-text,#FDFBF7)] text-xs w-fit";
        chip.textContent = "الإضافات";
        box.appendChild(chip);
        selectedAddons = [];
        adds.forEach(a => {
          const row = document.createElement("label");
          row.className = "flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--brand-base,#2C1810)]/15 bg-[var(--brand-text,#FDFBF7)]";
          row.innerHTML = `
            <input type="checkbox" class="accent-[var(--brand-base,#2C1810)]">
            <span class="text-sm">${String(a.label || a.name || a.title || "")} <span class="text-xs text-gray-500">(+ ${Number(a.price||0).toLocaleString()} د.ع)</span></span>
          `;
          const inp = row.querySelector("input");
          inp.addEventListener("change", () => {
            if (inp.checked) selectedAddons.push(a); else selectedAddons = selectedAddons.filter(x => (x.label||"") !== (a.label||""));
            if (priceEl) priceEl.textContent = `${computePrice().toLocaleString()} د.ع`;
          });
          box.appendChild(row);
        });
        optsEl.appendChild(box);
      }
    }
    if (priceEl) priceEl.textContent = `${computePrice().toLocaleString()} د.ع`;
    overlay.classList.remove("hidden");
    void overlay.offsetWidth;
    overlay.classList.add("opacity-100");
    panel.classList.remove("hidden");
    const addBtn = document.getElementById("preview-add");
    if (addBtn) addBtn.onclick = () => {
      const options = { variant: null, addons: selectedAddons.map(a => ({ label: a.label, price: a.price })) };
      addToCart({ id: item.id, price: computePrice(), name: item.name, img: src, options });
      closePreview();
    };
  }
  async function renderAllItemsView() {
    const container = document.getElementById("menu-container");
    container.innerHTML = "";
    const cats = await loadCategories();
    const proMap = new Map();
    const items = await supabase
      .from("products")
      .select("id, name, description, price, image_url, available, category_id")
      .eq("restaurant_id", r.id)
      .eq("available", true);
    const list = Array.isArray(items.data) ? items.data : [];
    list.forEach(p => {
      const k = String(p.category_id || "");
      if (!proMap.has(k)) proMap.set(k, []);
      proMap.get(k).push(p);
    });
    cats.forEach(cat => {
      const section = document.createElement("div");
      section.className = "bg-white rounded-2xl overflow-hidden border border-gray-100";
      const sep = document.createElement("div");
      sep.className = "p-4 bg-[var(--brand-text,#FDFBF7)] border-b border-[var(--brand-base,#2C1810)]/10";
      sep.innerHTML = `<h3 class="text-xl font-bold text-[var(--brand-base,#2C1810)]">${cat.name || ""}</h3>`;
      const grid = document.createElement("div");
      grid.className = "grid grid-cols-1 gap-4 p-4";
      (proMap.get(String(cat.id)) || []).forEach(item => grid.appendChild(productCard(item)));
      section.appendChild(sep);
      section.appendChild(grid);
      container.appendChild(section);
    });
    updateCartBadge();
  }
  async function renderMenuFromSupabase() {
    const container = document.getElementById("menu-container");
    container.innerHTML = "";
    const cats = await loadCategories();
    for (const cat of cats) {
      const section = document.createElement("div");
      section.className = "group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-[0_10px_40px_-10px_rgba(44,24,16,.15)] transition-shadow duration-300";
      const header = document.createElement("div");
      header.className = "relative h-48 cursor-pointer overflow-hidden";
      const catImg = resolveImage(cat.image_url || "", "");
      const hasImg = (catImg && catImg.trim().length > 0);
      const overlayCls = hasImg ? "bg-[var(--brand-base,#2C1810)]/60 group-hover:bg-[var(--brand-base,#2C1810)]/40" : "bg-transparent";
      header.innerHTML = `
        <div class="absolute inset-0 bg-[var(--cat-default,#766D67)]"></div>
        <img src="${catImg}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0" onerror="this.style.display='none'">
        <div class="absolute inset-0 ${overlayCls} transition-colors duration-300"></div>
        <div class="absolute inset-4 border border-white/30 pointer-events-none"></div>
        <div class="absolute inset-0 flex flex-col justify-center items-center text-center p-6 text-white">
          <h3 class="text-3xl font-bold mb-1 tracking-wide">${cat.name || ""}</h3>
        </div>
        <div class="accordion-chevron absolute bottom-0 right-0 bg-white/10 backdrop-blur px-4 py-2 rounded-tl-xl border-t border-l border-white/20">
          <span class="lucide-chevron-down text-white transition-transform duration-300"></span>
        </div>`;
      const content = document.createElement("div");
      content.className = "accordion-content bg-[var(--brand-text,#FDFBF7)] border-t border-[var(--brand-base,#2C1810)]/10";
      const inner = document.createElement("div");
      inner.className = "accordion-inner p-4";
      const grid = document.createElement("div");
      grid.className = "grid grid-cols-1 gap-4";
      const prods = await fetchProducts(cat.id);
      prods.forEach(item => grid.appendChild(productCard(item)));
      inner.appendChild(grid);
      content.appendChild(inner);
      header.onclick = () => {
        const wasOpen = content.classList.contains("open");
        document.querySelectorAll(".accordion-content").forEach(el => el.classList.remove("open"));
        if (!wasOpen) content.classList.add("open");
        const nowOpen = content.classList.contains("open");
        const chevBox = header.querySelector(".accordion-chevron");
        const icon = chevBox?.querySelector("svg, span.lucide-chevron-down, i[data-lucide='chevron-down']");
        if (icon) icon.classList.toggle("rotate-180", nowOpen);
      };
      section.appendChild(header);
      section.appendChild(content);
      container.appendChild(section);
    }
    updateCartBadge();
  }
  async function ensureSearchItems() {
    const { data } = await supabase
      .from("products")
      .select("id, name, price, image_url, category_id, available, variants, addons, description")
      .eq("restaurant_id", r.id)
      .eq("available", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    return Array.isArray(data) ? data : [];
  }
  async function openSearch() {
    const overlay = document.getElementById("search-overlay");
    const panel = document.getElementById("search-panel");
    overlay.classList.remove("hidden");
    void overlay.offsetWidth;
    overlay.classList.add("opacity-100");
    panel.classList.remove("hidden");
    const input = document.getElementById("search-input");
    if (input) input.focus();
  }
  function closeSearch() {
    const overlay = document.getElementById("search-overlay");
    const panel = document.getElementById("search-panel");
    overlay.classList.remove("opacity-100");
    setTimeout(() => overlay.classList.add("hidden"), 300);
    panel.classList.add("hidden");
    const input = document.getElementById("search-input");
    const results = document.getElementById("search-results");
    if (input) input.value = "";
    if (results) results.innerHTML = "";
  }
  let previewData = null;
  function ensurePreviewDom() {
    let overlay = document.getElementById("preview-overlay");
    let panel = document.getElementById("preview-panel");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "preview-overlay";
      overlay.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[75] hidden transition-opacity opacity-0";
      document.body.appendChild(overlay);
      overlay.addEventListener("click", closePreview);
    }
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "preview-panel";
      panel.className = "fixed inset-0 z-[80] flex items-center justify-center hidden";
      panel.innerHTML = `
        <div class="relative bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-[92%] overflow-hidden">
          <button id="preview-close" class="absolute top-3 left-3 w-10 h-10 rounded-full bg-white text-[var(--brand-base,#2C1810)] shadow-lg flex items-center justify-center">×</button>
          <img id="preview-image" src="" class="w-full h-64 object-cover" onerror="this.style.display='none'">
          <div class="p-4">
            <h4 id="preview-name" class="font-bold text-lg text-[var(--brand-base,#2C1810)]"></h4>
            <p id="preview-desc" class="text-sm text-gray-600"></p>
            <div id="preview-options" class="mt-3 space-y-3"></div>
            <div class="mt-3 flex justify-between items-center">
              <span id="preview-price" class="font-bold"></span>
              ${s?.online_orders === true ? `<button id="preview-add" class="bg-[var(--brand-base,#2C1810)] text-[var(--brand-gold,#C5A059)] px-4 py-2 rounded-lg">إضافة إلى السلة</button>` : ``}
            </div>
          </div>
        </div>`;
      document.body.appendChild(panel);
      document.getElementById("preview-close")?.addEventListener("click", closePreview);
      document.getElementById("preview-add")?.addEventListener("click", () => {});
    }
    return { overlay, panel };
  }
  function openPreview(item) {
    previewData = item || null;
    const { overlay, panel } = ensurePreviewDom();
    const img = document.getElementById("preview-image");
    const name = document.getElementById("preview-name");
    const desc = document.getElementById("preview-desc");
    const priceEl = document.getElementById("preview-price");
    const optsEl = document.getElementById("preview-options");
    const src = (item?.img && item.img.trim().length > 0) ? item.img : resolveImage(heroChoice || "", "");
    if (img) {
      img.src = src || "";
      img.style.display = src ? "" : "none";
      img.onerror = () => {
        const fb = resolveImage(heroChoice || "", "");
        if (fb) { img.style.display = ""; img.src = fb; }
      };
    }
    if (name) name.textContent = item.name || "";
    if (desc) desc.textContent = item.desc || "";
    let selectedVariant = null;
    let selectedAddons = [];
    function computePrice() {
      const baseVariant = selectedVariant != null ? Number(selectedVariant.price || 0) : Number(item.price || 0);
      const addonsTotal = selectedAddons.reduce((s, a) => s + Number(a.price || 0), 0);
      return Number(baseVariant + addonsTotal);
    }
    function renderOptions() {
      if (!optsEl) return;
      optsEl.innerHTML = "";
      const vars = Array.isArray(item?.variants) ? item.variants.filter(v => Number(v?.price || 0) > 0) : [];
      if (vars.length) {
        const box = document.createElement("div");
        box.className = "rounded-lg border border-gray-200 p-3";
        const title = document.createElement("div");
        title.className = "text-sm font-bold text-[var(--brand-base,#2C1810)] mb-2";
        title.textContent = "الأحجام";
        box.appendChild(title);
        vars.forEach((v, idx) => {
          const row = document.createElement("label");
          row.className = "flex items-center justify-between gap-2 py-1";
          row.innerHTML = `
            <span class="text-sm">${String(v.label || v.key || "")}</span>
            <span class="text-xs text-gray-500">${Number(v.price||0).toLocaleString()} د.ع</span>
            <input type="radio" name="preview-size" class="accent-[var(--brand-base,#2C1810)]">
          `;
          const inp = row.querySelector("input");
          inp.checked = idx === 0 && !selectedVariant;
          inp.addEventListener("change", () => { selectedVariant = v; if (priceEl) priceEl.textContent = `${computePrice().toLocaleString()} د.ع`; });
          box.appendChild(row);
        });
        if (!selectedVariant && vars.length) selectedVariant = vars[0];
        optsEl.appendChild(box);
      }
      const adds = Array.isArray(item?.addons) ? item.addons : [];
      if (adds.length) {
        const box = document.createElement("div");
        box.className = "space-y-2";
        const chip = document.createElement("div");
        chip.className = "inline-flex items-center px-3 py-1 rounded-full border border-[var(--brand-base,#2C1810)]/15 text-[var(--brand-base,#2C1810)] bg-[var(--brand-text,#FDFBF7)] text-xs w-fit";
        chip.textContent = "الإضافات";
        box.appendChild(chip);
        selectedAddons = [];
        adds.forEach(a => {
          const row = document.createElement("label");
          row.className = "flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--brand-base,#2C1810)]/15 bg-[var(--brand-text,#FDFBF7)]";
          row.innerHTML = `
            <input type="checkbox" class="accent-[var(--brand-base,#2C1810)]">
            <span class="text-sm">${String(a.label || a.name || a.title || "")} <span class="text-xs text-gray-500">+ ${Number(a.price||0).toLocaleString()} د.ع</span></span>
          `;
          const inp = row.querySelector("input");
          inp.addEventListener("change", () => {
            if (inp.checked) selectedAddons.push(a); else selectedAddons = selectedAddons.filter(x => (x.label||"") !== (a.label||""));
            if (priceEl) priceEl.textContent = `${computePrice().toLocaleString()} د.ع`;
          });
          box.appendChild(row);
        });
        optsEl.appendChild(box);
      }
    }
    renderOptions();
    if (priceEl) priceEl.textContent = `${computePrice().toLocaleString()} د.ع`;
    overlay.classList.remove("hidden");
    void overlay.offsetWidth;
    overlay.classList.add("opacity-100");
    panel.classList.remove("hidden");
    const addBtn = document.getElementById("preview-add");
    if (addBtn) addBtn.onclick = () => {
      const variantLabel = selectedVariant ? String(selectedVariant.label || selectedVariant.key || "") : null;
      const cartPrice = computePrice();
      const options = {
        variant: variantLabel,
        addons: selectedAddons.map(a => ({ label: a.label, price: a.price }))
      };
      addToCart({ id: item.id, price: cartPrice, name: item.name, img: src, options });
      closePreview();
    };
  }
  function closePreview() {
    const overlay = document.getElementById("preview-overlay");
    const panel = document.getElementById("preview-panel");
    if (!overlay || !panel) return;
    overlay.classList.remove("opacity-100");
    setTimeout(() => overlay.classList.add("hidden"), 300);
    panel.classList.add("hidden");
  }
  async function onSearchInput(e) {
    const q = String(e?.target?.value || "").trim().toLowerCase();
    const results = document.getElementById("search-results");
    if (!results) return;
    results.innerHTML = "";
    if (!q) return;
    const items = await ensureSearchItems();
    const matched = items.filter(i => String(i.name || "").toLowerCase().includes(q));
    if (!matched.length) {
      results.innerHTML = '<div class="p-4 text-center text-[var(--brand-base,#2C1810)]/60">لا توجد نتائج</div>';
      return;
    }
    matched.slice(0, 50).forEach(item => {
      const imgSrc = resolveImage(item.image_url || "", "");
      const priceVal = Number(item.price || 0);
      const nameVal = String(item.name || "");
      const hasAdds = Array.isArray(item.addons) && item.addons.length > 0;
      const el = document.createElement("div");
      el.className = "flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 hover:border-[var(--brand-gold,#C5A059)]/50 transition-colors";
      el.innerHTML = `
        <div class="w-16 h-16 rounded-lg overflow-hidden shrink-0 relative">
          <img src="${imgSrc}" class="w-full h-full object-cover" onerror="this.style.display='none'">
          <div class="absolute inset-0 border border-black/5 rounded-lg pointer-events-none"></div>
        </div>
        <div class="flex-1">
          <h4 class="font-bold text-[var(--brand-base,#2C1810)] text-sm">${nameVal}</h4>
          <div class="flex items-center gap-2">
            <span class="text-[color-mix(in_oklab,var(--brand-base,#2C1810),white 40%)] text-xs">${priceVal.toLocaleString()} د.ع</span>
            ${hasAdds ? `<button class="addons-btn text-[var(--brand-base,#2C1810)] underline text-[10px] hover:text-[var(--brand-gold,#C5A059)]">اضافات</button>` : ``}
          </div>
        </div>
        ${s?.online_orders === true ? `<button class="search-add w-9 h-9 rounded-lg bg-[var(--brand-base,#2C1810)] text-[var(--brand-gold,#C5A059)] flex items-center justify-center hover:bg-[var(--brand-gold,#C5A059)] hover:text-[var(--brand-base,#2C1810)] transition-colors shadow-lg">+</button>` : ``}`;
      const plusBtn = el.querySelector(".w-9.h-9.rounded-lg");
      if (plusBtn) {
        plusBtn.onclick = (ev) => {
          ev.stopPropagation();
          const hasOptions = (Array.isArray(item.variants) && item.variants.length > 0) || hasAdds;
          if (hasOptions) {
            openPreview({ id: item.id, price: priceVal, name: nameVal, img: imgSrc, desc: String(item.description || ""), variants: item.variants || [], addons: item.addons || [] });
          } else {
            addToCart({ id: item.id, price: priceVal, name: nameVal, img: imgSrc });
          }
        };
      }
      const addBtn = el.querySelector(".addons-btn");
      if (addBtn) addBtn.onclick = (ev) => {
        ev.stopPropagation();
        openAddonsOnly({ id: item.id, price: priceVal, name: nameVal, img: imgSrc, desc: String(item.description || ""), variants: item.variants || [], addons: item.addons || [] });
      };
      el.onclick = () => { openPreview({ id: item.id, price: priceVal, name: nameVal, img: imgSrc, desc: String(item.description || ""), variants: item.variants || [], addons: item.addons || [] }); };
      results.appendChild(el);
    });
  }
  document.getElementById("nav-cart")?.addEventListener("click", () => toggleCart(true));
  document.getElementById("cart-close")?.addEventListener("click", () => toggleCart(false));
  document.getElementById("cart-overlay")?.addEventListener("click", () => toggleCart(false));
  document.getElementById("fab-btn")?.addEventListener("click", () => toggleCart(true));
  document.getElementById("search-btn")?.addEventListener("click", openSearch);
  document.getElementById("search-close")?.addEventListener("click", closeSearch);
  document.getElementById("search-input")?.addEventListener("input", onSearchInput);
  document.getElementById("preview-overlay")?.addEventListener("click", closePreview);
  document.getElementById("preview-close")?.addEventListener("click", closePreview);
  document.getElementById("preview-add")?.addEventListener("click", () => {});
  function ensureMenuDom() {
    let overlay = document.getElementById("menu-overlay");
    let panel = document.getElementById("menu-panel");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "menu-overlay";
      overlay.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] hidden transition-opacity opacity-0";
      document.body.appendChild(overlay);
      overlay.addEventListener("click", closeMenu);
    }
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "menu-panel";
      panel.className = "fixed top-0 right-0 bottom-0 z-[75] w-[85%] max-w-sm bg-[var(--brand-base,#2C1810)]/60 backdrop-blur-xl border-l border-white/20 hidden";
      panel.innerHTML = `
        <div class="h-16 flex items-center justify-between px-5 text-white">
          <button id="menu-close" class="text-white/90 hover:text-[var(--brand-gold,#C5A059)]">×</button>
          <div class="text-right">
            <div class="text-xl font-extrabold">القائمة</div>
            <div class="text-[var(--brand-gold,#C5A059)] text-xs">روابط سريعة</div>
          </div>
        </div>
        <div class="px-5 space-y-3">
          <button id="menu-route" class="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition">
            <div class="flex items-center gap-2">
              <span class="lucide-map"></span>
              <span class="font-bold">الطريق إلينا</span>
            </div>
          </button>
          <button id="menu-call" class="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition">
            <div class="flex items-center gap-2">
              <span class="lucide-phone"></span>
              <span class="font-bold">اتصال</span>
            </div>
          </button>
        </div>`;
      document.body.appendChild(panel);
      document.getElementById("menu-close")?.addEventListener("click", closeMenu);
      document.getElementById("menu-route")?.addEventListener("click", openRoute);
      document.getElementById("menu-call")?.addEventListener("click", callNumber);
    }
    return { overlay, panel };
  }
  function openMenu() {
    const { overlay, panel } = ensureMenuDom();
    overlay.classList.remove("hidden");
    void overlay.offsetWidth;
    overlay.classList.add("opacity-100");
    panel.classList.remove("hidden");
    if (window.lucide && typeof window.lucide.createIcons === "function") window.lucide.createIcons();
  }
  function closeMenu() {
    const overlay = document.getElementById("menu-overlay");
    const panel = document.getElementById("menu-panel");
    if (!overlay || !panel) return;
    overlay.classList.remove("opacity-100");
    setTimeout(() => overlay.classList.add("hidden"), 300);
    panel.classList.add("hidden");
  }
  function openRoute() {
    const loc = String(s?.location || "").trim();
    let url = "";
    if (/^https?:/i.test(loc)) url = loc;
    else if (loc) url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc)}`;
    else url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name || "")}`;
    try { window.open(url, "_blank", "noopener"); } catch { location.href = url; }
  }
  function callNumber() {
    const sanitize = (n) => {
      const raw = String(n || "").trim();
      if (!raw) return "";
      const lead = raw.startsWith("+") ? "+" : "";
      const digits = raw.replace(/\D/g, "");
      return lead + digits;
    };
    let num = sanitize(s?.phone_number);
    if (!num) num = sanitize(s?.whatsapp_number);
    if (!num) { closeMenu(); return; }
    setTimeout(() => { window.location.href = `tel:${num}`; }, 60);
  }
  document.getElementById("menu-btn")?.addEventListener("click", openMenu);
  const browseBtn = document.getElementById("browse-btn");
  browseBtn?.addEventListener("click", async () => {
    allView = !allView;
    if (allView) {
      await renderAllItemsView();
      browseBtn.innerHTML = `<span class="lucide-arrow-left"></span><span>رجوع</span>`;
    } else {
      await renderMenuFromSupabase();
      browseBtn.textContent = "تصفح الكل";
    }
    if (window.lucide && typeof window.lucide.createIcons === "function") window.lucide.createIcons();
  });
  document.getElementById("checkout-btn")?.addEventListener("click", openCheckout);
  await renderMenuFromSupabase();
  if (window.lucide && typeof window.lucide.createIcons === "function") window.lucide.createIcons();
  updateCartBadge();
}
