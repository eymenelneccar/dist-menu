export async function render({ slug, restaurant, settings }) {
  const app = document.getElementById("app");
  if (!app) return;
  const { supabase } = await import("/src/api/supabase.js");
  function applyColors(s) {
    const root = document.documentElement;
    const set = (k, v) => { if (v && typeof v === "string" && v.trim().length > 0) root.style.setProperty(k, v.trim()); };
    set("--brand-1", s?.color_primary);
    set("--brand-2", s?.color_secondary);
    set("--brand-text", s?.color_text);
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
    if (settings && typeof settings === "object") return settings;
    const { data } = await supabase
      .from("settings")
      .select("logo_url, hero_url, online_orders, splash1_url, splash2_url, splash3_url, splash4_url, active_splash, color_primary, color_secondary, color_text")
      .eq("restaurant_id", rid)
      .maybeSingle();
    return data || {};
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
    <header class="relative">
      <div class="relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-b-2xl">
        <img id="hero-image" src="" alt="" class="absolute inset-0 w-full h-full object-cover" onerror="this.style.display='none'" fetchpriority="high" decoding="async">
        <div id="hero-overlay" class="absolute inset-0 bg-black/35"></div>
        <nav id="main-navbar" class="navbar navbar-floating z-50">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span id="restaurant-name" class="text-lg sm:text-xl font-extrabold">${r.name || ""}</span>
            </div>
            <div class="flex items-center gap-2">
              <a id="nav-home" class="p-2 rounded-lg hover:bg-white/15 cursor-pointer">الرئيسية</a>
              <a id="nav-products" class="p-2 rounded-lg hover:bg-white/15 cursor-pointer">المنتجات</a>
              <a id="nav-brunch" class="p-2 rounded-lg hover:bg-white/15 cursor-pointer">الفطور</a>
              <a id="nav-cart" class="p-2 rounded-lg hover:bg-white/15 relative cursor-pointer">
                <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                <span id="navbar-cart-count" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center">0</span>
              </a>
            </div>
          </div>
        </nav>
        <div class="absolute bottom-4 right-4 left-4 text-white">
          <div class="flex flex-col items-center gap-3">
            <h1 class="text-2xl sm:text-3xl font-bold drop-shadow-lg" id="hero-title">أهلاً بكم في ${r.name || ""}</h1>
          </div>
        </div>
      </div>
    </header>
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="mb-6">
        <div class="category-bar flex items-center gap-2 overflow-x-auto p-2 bg-[#a2c4a8] border border-[#e5e7eb] rounded-xl shadow-[0_8px_20px_rgba(6,52,59,.08)]">
          <ul id="section-nav-list" class="flex items-start gap-2 text-gray-700 text-sm font-bold"></ul>
        </div>
      </div>
      <section class="section-silver rounded-xl p-6">
        <p id="section-hint" class="text-lg font-bold text-main">اختر قسمًا للانتقال إلى قائمة المنتجات.</p>
        <div id="products-area" class="mt-4"></div>
      </section>
    </main>
    <footer class="fixed bottom-0 left-0 right-0 z-40 py-1 text-center text-xs text-gray-700 bg-white/95 backdrop-blur border-t border-gray-200">
      <span>تم صنعها بواسطة | </span>
      <a href="https://iqrarabic.com/" class="font-bold text-green-600 hover:text-green-700" target="_blank" rel="noopener">İQR MENU</a>
    </footer>
  `;
  const heroImg = document.getElementById("hero-image");
  if (heroImg) heroImg.src = resolveImage(heroChoice, heroImg.src);
  function updateCartCount() {
    const savedCart = localStorage.getItem("restaurant_menu_cart");
    let cart = [];
    if (savedCart) { try { cart = JSON.parse(savedCart) || []; } catch {} }
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const navbarCartCountEl = document.getElementById("navbar-cart-count");
    if (navbarCartCountEl) navbarCartCountEl.textContent = totalItems;
  }
  function setupStickyNavbar() {
    const navbar = document.getElementById("main-navbar");
    const headerEl = document.querySelector("header");
    const mainEl = document.querySelector("main");
    if (!navbar || !headerEl || !mainEl) return;
    const threshold = headerEl.offsetHeight - 8;
    const apply = () => {
      const stuck = window.scrollY >= threshold;
      navbar.classList.toggle("navbar-stuck", stuck);
      navbar.classList.toggle("navbar-floating", !stuck);
      mainEl.style.paddingTop = stuck ? (navbar.offsetHeight + "px") : "";
    };
    window.addEventListener("scroll", apply);
    apply();
  }
  async function renderCategories() {
    const { data: cats } = await supabase
      .from("categories")
      .select("id, name, image_url")
      .eq("restaurant_id", r.id)
      .order("sort_order", { ascending: true });
    const navList = document.getElementById("section-nav-list");
    navList.innerHTML = (cats || []).map(cat => {
      const thumb = resolveImage(cat.image_url, "");
      return `
        <li class="flex-shrink-0">
          <button data-id="${cat.id}" class="category-card w-28 sm:w-32 md:w-36" tabindex="0">
            <img src="${thumb || ""}" alt="${cat.name}" onerror="this.style.display='none'" style="${thumb ? "" : "display:none;"}" loading="lazy" decoding="async">
            <div class="cat-overlay"></div>
            <span class="cat-title">${cat.name}</span>
          </button>
        </li>`;
    }).join("");
    const cards = document.querySelectorAll("#section-nav-list .category-card");
    if (cards.length) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("reveal"); observer.unobserve(e.target); } });
      }, { threshold: 0.15 });
      cards.forEach(c => observer.observe(c));
    }
    document.querySelectorAll("#section-nav-list .category-card").forEach(btn => {
      btn.addEventListener("click", () => {
        const cid = Number(btn.getAttribute("data-id"));
        renderProducts(cid);
      });
    });
  }
  async function renderProducts(categoryId) {
    const hint = document.getElementById("section-hint");
    const area = document.getElementById("products-area");
    if (hint) hint.textContent = "قائمة المنتجات";
    const { data: products } = await supabase
      .from("products")
      .select("id, name, description, price, image_url, available, variants, addons")
      .eq("category_id", categoryId)
      .eq("available", true);
    const items = (products || []).map(p => {
      const img = resolveImage(p.image_url, "");
      return `
        <div class="flex gap-3 p-3 border border-gray-200 rounded-xl bg-white mb-3 items-center" data-name="${(p.name||'')}" data-desc="${(p.description||'')}">
          <img src="${img || ""}" alt="${p.name || ""}" class="w-20 h-20 object-cover rounded-lg border border-gray-200" onerror="this.style.display='none'">
          <div class="flex-1">
            <h4 class="text-base font-extrabold text-[#06343b] mb-1">${p.name || ""}</h4>
            <p class="text-xs text-gray-600 mb-2">${p.description || ""}</p>
            <div class="font-bold text-[#0b5963]">${Number(p.price || 0)} د.ع</div>
          </div>
        </div>`;
    }).join("");
    area.innerHTML = items || `<div class="text-center text-gray-700 py-12">لا توجد منتجات في هذا القسم حالياً.</div>`;
    if (window.lucide && typeof window.lucide.createIcons === "function") window.lucide.createIcons();
  }
  updateCartCount();
  setupStickyNavbar();
  await renderCategories();
  if (window.lucide && typeof window.lucide.createIcons === "function") window.lucide.createIcons();
}
