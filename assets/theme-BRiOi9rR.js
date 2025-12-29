import{_ as le}from"./main-Cqdy5BvD.js";async function $e({slug:W,restaurant:R,settings:U}){const ee=document.getElementById("app");if(!ee)return;const{supabase:C}=await le(async()=>{const{supabase:e}=await import("./main-Cqdy5BvD.js").then(t=>t.s);return{supabase:e}},[]),L=(e,t)=>{t&&typeof t=="string"&&t.trim()&&document.documentElement.style.setProperty(e,t.trim())};function ce(e){L("--brand-base",e?.color_primary),L("--brand-gold",e?.color_secondary),L("--bg-main",e?.color_bg_main),L("--bg-surface",e?.color_bg_surface),L("--text-main",e?.color_text),L("--text-heading",e?.color_heading),L("--border-color",e?.color_border),L("--shadow-color",e?.color_shadow),L("--brand-text",e?.color_bg_main)}function S(e,t){const a=e==null?"":String(e).trim();if(!a||a==="null"||a==="undefined")return t;if(/^https?:/i.test(a))return a;const r=a.split("/").filter(Boolean),c=r.shift(),n=r.join("/");if(!c||!n)return t;const o=C.storage.from(c).getPublicUrl(n)?.data?.publicUrl;return o||t}async function ue(){if(R&&R.id)return R;const{data:e}=await C.from("restaurants").select("id, name, menu_enabled").eq("slug",W).maybeSingle();return e||null}async function pe(e){const t=U&&typeof U=="object"?U:{},{data:a}=await C.from("settings").select("logo_url, hero_url, online_orders, whatsapp_number, phone_number, location, splash1_url, splash2_url, splash3_url, splash4_url, active_splash, color_primary, color_secondary, color_bg_main, color_bg_surface, color_text, color_heading, color_border, color_shadow, instagram_url, instagram_color, hero_pill_text, hero_left_text, hero_right_text, shipping_enabled, shipping_zones").eq("restaurant_id",e).maybeSingle();return{...t,...a||{}}}const w=await ue();if(!w||w.menu_enabled!==!0){document.body.innerHTML="<h2>القائمة غير متاحة حالياً</h2>";return}document.title="منيو | "+(w.name||"");try{localStorage.setItem("restaurant_name",w.name||"")}catch{}const g=await pe(w.id);ce(g||{});let J=Number(g?.active_splash??0);const be=[g?.splash1_url,g?.splash2_url,g?.splash3_url,g?.splash4_url],N=J>=1&&J<=4?be[J-1]:g?.hero_url;ee.innerHTML=`
    <nav class="fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-all duration-300" id="navbar">
      <div class="max-w-md mx-auto flex justify-between items-center">
        <button id="menu-btn" class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
          <i data-lucide="menu" class="w-5 h-5"></i>
        </button>
        <div class="flex items-center gap-4">
          <button id="search-btn" class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <i data-lucide="search" class="w-5 h-5"></i>
          </button>
          <a id="nav-cart" class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors relative">
            <i data-lucide="shopping-cart" class="w-5 h-5"></i>
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
          <span class="text-[var(--brand-gold,#C5A059)] text-xs font-bold tracking-[0.2em] uppercase">${g?.hero_pill_text||"Architecture of Taste"}</span>
        </div>
        <h1 class="text-5xl md:text-6xl font-black text-white tracking-tight leading-none drop-shadow-lg">
          <span class="text-[var(--brand-gold,#C5A059)]">${w.name||""}</span>
        </h1>
      </div>
    </header>
    <main class="max-w-lg mx-auto px-5 relative -mt-10 z-40 space-y-8 pb-24">
      <div class="glass-panel p-4 rounded-2xl flex justify-between items-center">
        <div class="text-center flex-1 border-l border-brand-gold/20">
          <span class="text-[var(--brand-gold,#C5A059)] text-xs font-bold uppercase">${g?.hero_right_text||"مفتوح الآن"}</span>
        </div>
        <div class="text-center flex-1 border-l border-brand-gold/20">
          <a href="${g?.instagram_url||"https://instagram.com/"}" target="_blank" rel="noopener" aria-label="Instagram" class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/20 hover:bg-white/20" style="color: ${g?.instagram_color||"#374151"}">
            <i data-lucide="instagram" class="w-4 h-4"></i>
          </a>
        </div>
        <div class="text-center flex-1">
          <span class="text-[var(--brand-gold,#C5A059)] text-xs font-bold uppercase">${g?.hero_left_text||"مرحباً بكم"}</span>
        </div>
      </div>
      <div class="flex items-center justify-between pt-4">
        <div>
          <h2 class="text-2xl font-bold text-[var(--brand-base,#2C1810)]">القائمة</h2>
          <div class="h-1 w-12 bg-[var(--brand-gold,#C5A059)] mt-1 rounded-full"></div>
        </div>
        <button id="browse-btn" class="text-xs font-bold text-[color-mix(in_oklab,var(--brand-base,#2C1810),white 40%)] flex items-center gap-1 hover:text-[var(--brand-base,#2C1810)] transition-colors">
          تصفح الكل
        </button>
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
        <button id="cart-close" class="absolute top-6 left-6 text-white hover:text-[var(--brand-gold,#C5A059)] transition-colors">
          ×
        </button>
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
            ${g?.online_orders===!0?'<button id="preview-add" class="bg-[var(--brand-base,#2C1810)] text-[var(--brand-gold,#C5A059)] px-4 py-2 rounded-lg">إضافة إلى السلة</button>':""}
          </div>
        </div>
      </div>
    </div>
  `;try{const{mountMenuAiAssistant:e}=await le(async()=>{const{mountMenuAiAssistant:t}=await import("./menuAiAssistant-DDk3kyFL.js");return{mountMenuAiAssistant:t}},[]);await e({supabase:C,slug:W,restaurantId:w.id,restaurantName:w.name||""})}catch{}const K=document.getElementById("hero-image");K&&(K.src=S(N,K.src));const Q=document.getElementById("cart-hero-image");Q&&(Q.src=S(N,Q.src));function te(e){const t=document.getElementById("nav-cart");t&&(t.style.display=e?"":"none");const a=document.getElementById("checkout-btn");a&&(a.style.display=e?"":"none");const r=document.getElementById("fab-cart");r&&(r.style.display=e?r.style.display:"none");const c=document.getElementById("preview-add");c&&(c.style.display=e?"":"none"),document.querySelectorAll(".product-add").forEach(n=>{n instanceof HTMLElement&&(n.style.display=e?"":"none")}),document.querySelectorAll(".variant-add").forEach(n=>{n instanceof HTMLElement&&(n.style.display=e?"":"none")}),document.querySelectorAll(".search-add").forEach(n=>{n instanceof HTMLElement&&(n.style.display=e?"":"none")})}te(g?.online_orders===!0);try{C.channel("settings_"+w.id).on("postgres_changes",{event:"*",schema:"public",table:"settings",filter:`restaurant_id=eq.${w.id}`},e=>{const t=e?.new?.online_orders;typeof t=="boolean"&&(g.online_orders=t,te(g.online_orders===!0),$())}).subscribe()}catch{}let G=!1;const ne="restaurant_menu_cart";function k(){const e=localStorage.getItem(ne);if(!e)return[];try{return JSON.parse(e)||[]}catch{return[]}}function H(e){try{localStorage.setItem(ne,JSON.stringify(Array.isArray(e)?e:[]))}catch{}$()}function I({id:e,price:t,name:a,img:r,options:c}){const n=k(),s=p=>{const v=String(p?.variant||"").trim(),b=Array.isArray(p?.addons)?p.addons.map(u=>String(u?.label||"").trim()).filter(Boolean).sort():[];return`${v}||${b.join(",")}`},o=s(c),l=n.findIndex(p=>String(p.productId||"")===String(e||"")&&s(p.options)===o);if(l>=0)n[l].quantity=Number(n[l].quantity||1)+1,Number(t||0)>0&&(n[l].price=Number(t||n[l].price||0));else{const p={productId:String(e||""),name:String(a||""),price:Number(t||0),quantity:1,img:String(r||""),options:c||null};n.push(p)}H(n),q()}function $(){const e=document.getElementById("cart-badge"),t=document.getElementById("fab-cart"),a=document.getElementById("fab-total");if(!(g?.online_orders===!0)){e&&(e.classList.remove("hidden"),e.classList.remove("flex"),e.style.display="none"),t&&(t.style.display="none"),a&&(a.textContent="0 د.ع");return}const c=k(),n=c.reduce((o,l)=>o+Number(l.quantity||1),0),s=c.reduce((o,l)=>o+Number(l.price||0)*Number(l.quantity||1),0);e&&(e.textContent=String(n),n>0?(e.classList.remove("hidden"),e.classList.add("flex"),e.style.display="flex"):(e.classList.remove("flex"),e.style.display="none")),t&&(t.style.display=n>0?"block":"none"),a&&(a.textContent=`${Number(s).toLocaleString()} د.ع`)}function F(e){const t=document.getElementById("cart-panel"),a=document.getElementById("cart-overlay");!t||!a||(e?(q(),a.classList.remove("hidden"),a.offsetWidth,a.classList.add("opacity-100"),t.classList.remove("translate-x-full")):(t.classList.add("translate-x-full"),a.classList.remove("opacity-100"),setTimeout(()=>a.classList.add("hidden"),300)))}function me(){let e=document.getElementById("checkout-overlay"),t=document.getElementById("checkout-panel");if(e||(e=document.createElement("div"),e.id="checkout-overlay",e.className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[85] hidden transition-opacity opacity-0",document.body.appendChild(e),e.addEventListener("click",P)),!t){t=document.createElement("div"),t.id="checkout-panel",t.className="fixed inset-0 z-[90] flex items-center justify-center hidden",t.innerHTML=`
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
        </div>`,document.body.appendChild(t),document.getElementById("checkout-close")?.addEventListener("click",P),document.getElementById("checkout-cancel")?.addEventListener("click",P),document.getElementById("checkout-wa")?.addEventListener("click",fe);const a=document.getElementById("cust-name"),r=document.getElementById("cust-phone"),c=document.getElementById("cust-address"),n=document.getElementById("cust-note"),s=()=>{const o={name:a?.value||"",phone:r?.value||"",address:c?.value||""};try{localStorage.setItem("restaurant_customer_info",JSON.stringify(o))}catch{}try{localStorage.setItem("restaurant_menu_cart_note",String(n?.value||""))}catch{}};a?.addEventListener("input",s),r?.addEventListener("input",s),c?.addEventListener("input",s),n?.addEventListener("input",s)}return{overlay:e,panel:t}}function ge(){const{overlay:e,panel:t}=me(),a=document.getElementById("cust-name"),r=document.getElementById("cust-phone"),c=document.getElementById("cust-address"),n=document.getElementById("cust-note");let s={};try{s=JSON.parse(localStorage.getItem("restaurant_customer_info")||"{}")||{}}catch{s={}}a&&(a.value=String(s.name||"")),r&&(r.value=String(s.phone||"")),c&&(c.value=String(s.address||""));const o=localStorage.getItem("restaurant_menu_cart_note")||"";n&&(n.value=String(o||""));const l=document.getElementById("cust-zone"),p=Array.isArray(g?.shipping_zones)?g.shipping_zones:[],v=g?.shipping_enabled===!0;if(l)if(v&&p.length){const b=p.map((i,m)=>{const h=String(i?.name||i?.zone||""),f=Number(i?.fee||0);return`<option value="${m}">${h} — ${f.toLocaleString()} د.ع</option>`}).join("");l.innerHTML=b;let u=Number(localStorage.getItem("restaurant_shipping_zone_idx")||"0");(!Number.isFinite(u)||u<0||u>=p.length)&&(u=0),l.value=String(u),l.classList.remove("hidden"),l.onchange=()=>{try{localStorage.setItem("restaurant_shipping_zone_idx",String(l.value||"0"))}catch{}}}else l.classList.add("hidden");e.classList.remove("hidden"),e.offsetWidth,e.classList.add("opacity-100"),t.classList.remove("hidden")}function P(){const e=document.getElementById("checkout-overlay"),t=document.getElementById("checkout-panel");!e||!t||(e.classList.remove("opacity-100"),setTimeout(()=>e.classList.add("hidden"),300),t.classList.add("hidden"))}function ve(e){const t=String(e||"").replace(/\D/g,"");return t?t.startsWith("964")?t.replace(/^9640/,"964"):t.startsWith("0")?"964"+t.slice(1):t:""}function he(){let e={};try{e=JSON.parse(localStorage.getItem("restaurant_customer_info")||"{}")||{}}catch{e={}}const t=localStorage.getItem("restaurant_menu_cart_note")||"",a=k(),r=a.reduce((b,u)=>b+Number(u.price||0)*Number(u.quantity||1),0),c=Array.isArray(g?.shipping_zones)?g.shipping_zones:[],n=g?.shipping_enabled===!0;let s=Number(localStorage.getItem("restaurant_shipping_zone_idx")||"0");(!Number.isFinite(s)||s<0||s>=c.length)&&(s=0);const o=n&&c.length?Number(c[s]?.fee||0):0,l=n&&c.length?String(c[s]?.name||c[s]?.zone||""):"";return["*فاتورة الطلب*","","*الأصناف:*",a.map(b=>{const u=b.options||{},i=Array.isArray(u.addons)?u.addons.map(h=>String(h.label||"")).filter(Boolean):[],m=[u.variant?`(${u.variant})`:"",i.length?`[${i.join(", ")}]`:""].filter(Boolean).join(" ");return`- ${b.name}${m?" "+m:""} x ${b.quantity} — ${(Number(b.price||0)*Number(b.quantity||1)).toLocaleString()} د.ع`}).join(`
`)||"—","",`*المجموع:* *${r.toLocaleString()} د.ع*`,n&&o>0?`*أجور الشحن${l?` (${l})`:""}:* *${o.toLocaleString()} د.ع*`:"",`*الإجمالي:* *${(r+o).toLocaleString()} د.ع*`,"",`*الاسم:* *${String(e.name||"")}*`,`*الرقم:* *${String(e.phone||"")}*`,e.address?`*العنوان:* *${String(e.address)}*`:"",t?`*ملاحظة:* ${String(t)}`:""].filter(Boolean).join(`
`)}async function fe(){const e=k();if(!Array.isArray(e)||e.length===0){alert("السلة فارغة.");return}let t={};try{t=JSON.parse(localStorage.getItem("restaurant_customer_info")||"{}")||{}}catch{t={}}const a=[];if(t.name||a.push("الاسم"),t.phone||a.push("الرقم"),t.address||a.push("العنوان"),a.length){alert(`الحقول الإجبارية ناقصة:
- `+a.join(`
- `));return}const r=he(),n=`https://wa.me/${ve(g?.whatsapp_number||localStorage.getItem("restaurant_whatsapp_number")||"")}?text=${encodeURIComponent(r)}`;try{const s=document.createElement("a");s.href=n,s.target="_blank",s.rel="noopener",document.body.appendChild(s),s.click(),document.body.removeChild(s)}catch{window.open(n,"_blank")}try{const s=e.reduce((i,m)=>i+Number(m.price||0)*Number(m.quantity||1),0),o=Array.isArray(g?.shipping_zones)?g.shipping_zones:[],l=g?.shipping_enabled===!0;let p=Number(localStorage.getItem("restaurant_shipping_zone_idx")||"0");(!Number.isFinite(p)||p<0||p>=o.length)&&(p=0);const v=l&&o.length?Number(o[p]?.fee||0):0,b=s+v,u=e.map(i=>({name:i.name,qty:i.quantity,price:i.price}));await C.functions.invoke("capture-wa-order",{body:{restaurant_id:w.id,slug:W,customer_name:t.name||null,customer_phone:String(t.phone||"").replace(/\D/g,"")||null,customer_address:t.address||null,total:b,currency:"IQD",items:u}})}catch{}P()}function q(){const e=document.getElementById("cart-items"),t=k();if(e.innerHTML="",!t.length){e.innerHTML=`
        <div class="h-full flex flex-col items-center justify-center text-[color-mix(in_oklab,var(--brand-base,#2C1810),#000 35%)]/40">
          <span class="lucide-cup-soda text-5xl mb-2"></span>
          <p>السلة فارغة</p>
        </div>`;const b=document.getElementById("cart-summary");b&&(b.classList.add("hidden"),b.innerHTML="");const u=document.getElementById("shipping-box");u&&u.classList.add("hidden");return}t.forEach((b,u)=>{const i=document.createElement("div");i.className="flex items-center gap-3 bg-white p-2 rounded-lg border-l-4 border-[var(--brand-gold,#C5A059)] shadow-sm";const m=b.options||{},h=Array.isArray(m.addons)?m.addons.map(y=>String(y.label||"")).filter(Boolean):[],f=[m.variant?`الحجم: ${m.variant}`:"",h.length?`إضافات: ${h.join(", ")}`:""].filter(Boolean).join(" • "),d=b.img&&String(b.img).trim().length>0?`<img src="${b.img}" class="w-12 h-12 rounded bg-gray-100 object-cover" onerror="this.style.display='none'">`:'<div class="w-12 h-12 rounded bg-gray-100"></div>';i.innerHTML=`
        ${d}
        <div class="flex-1">
          <h4 class="font-bold text-sm text-[var(--brand-base,#2C1810)]">${b.name}</h4>
          ${f?`<p class="text-[10px] text-gray-500">${f}</p>`:""}
          <p class="text-xs text-gray-500">${Number(b.price||0).toLocaleString()} د.ع</p>
        </div>
        <div class="flex items-center gap-2 bg-gray-50 rounded px-1">
          <button class="text-red-500 hover:bg-red-50 p-1 rounded" data-op="minus">-</button>
          <span class="text-xs font-bold w-4 text-center">${b.quantity||1}</span>
          <button class="text-green-600 hover:bg-green-50 p-1 rounded" data-op="plus">+</button>
          <button class="text-gray-600 hover:bg-gray-100 p-1 rounded" data-op="remove">×</button>
        </div>`,i.querySelector("[data-op='minus']").onclick=()=>{const y=k();y[u].quantity=Math.max(1,Number(y[u].quantity||1)-1),H(y),q()},i.querySelector("[data-op='plus']").onclick=()=>{const y=k();y[u].quantity=Number(y[u].quantity||1)+1,H(y),q()},i.querySelector("[data-op='remove']").onclick=()=>{const y=k();y.splice(u,1),H(y),q()},e.appendChild(i)}),$();const a=t.reduce((b,u)=>b+Number(u.price||0)*Number(u.quantity||1),0),r=Array.isArray(g?.shipping_zones)?g.shipping_zones:[],c=g?.shipping_enabled===!0,n=document.getElementById("shipping-zone"),s=document.getElementById("shipping-box");let o=Number(localStorage.getItem("restaurant_shipping_zone_idx")||"0");(!Number.isFinite(o)||o<0||o>=r.length)&&(o=0);let l=c&&r.length?Number(r[o]?.fee||0):0,p=c&&r.length?String(r[o]?.name||r[o]?.zone||""):"";n&&s&&(c&&r.length?(n.innerHTML=r.map((b,u)=>{const i=String(b?.name||b?.zone||""),m=Number(b?.fee||0);return`<option value="${u}">${i} — ${m.toLocaleString()} د.ع</option>`}).join(""),n.value=String(o),s.classList.remove("hidden"),n.onchange=()=>{try{localStorage.setItem("restaurant_shipping_zone_idx",String(n.value||"0"))}catch{}q()},o=Number(n.value||"0"),(!Number.isFinite(o)||o<0||o>=r.length)&&(o=0),l=Number(r[o]?.fee||0),p=String(r[o]?.name||r[o]?.zone||"")):s.classList.add("hidden"));const v=document.getElementById("cart-summary");v&&(a>0&&c&&l>0?(v.innerHTML=`
          <div class="flex items-center justify-between"><span>المجموع</span><span>${Number(a).toLocaleString()} د.ع</span></div>
          <div class="flex items-center justify-between"><span>أجور الشحن${p?` (${p})`:""}</span><span>${Number(l).toLocaleString()} د.ع</span></div>
          <div class="flex items-center justify-between font-bold"><span>الإجمالي</span><span>${Number(a+l).toLocaleString()} د.ع</span></div>
        `,v.classList.remove("hidden")):(v.classList.add("hidden"),v.innerHTML=""))}async function ae(){const{data:e}=await C.from("categories").select("id, name, image_url").eq("restaurant_id",w.id).order("sort_order",{ascending:!0}).order("created_at",{ascending:!0});return Array.isArray(e)?e:[]}async function ye(e){const t="id, name, description, ai_description, price, image_url, available, variants, addons",{data:a}=await C.from("products").select(t).eq("restaurant_id",w.id).eq("category_id",e).eq("available",!0).order("sort_order",{ascending:!0}).order("created_at",{ascending:!0});return Array.isArray(a)?a:[]}function D(e){const a=(Array.isArray(e)?e:[]).map(r=>Number(r?.price||0)).filter(r=>Number.isFinite(r)&&r>0);return a.length?Math.min(...a):null}function re(e){const t=D(e?.variants);return t!=null?`من ${Number(t).toLocaleString()} د.ع`:`${Number(e?.price||0).toLocaleString()} د.ع`}function se(e){const t=S(e.image_url||"",""),a=Number(e.price||0),r=String(e.name||""),c=String(e.description||e.ai_description||"").trim(),n=g?.online_orders===!0;r.replace(/'/g,"\\'");const s=Array.isArray(e.addons)&&e.addons.length>0,o=Array.isArray(e.variants)?e.variants.filter(d=>Number(d?.price||0)>0):[],l=Array.isArray(e.addons)?e.addons:[],p=l.length,v=o.length?`<div class="mt-2 flex flex-wrap gap-2">${o.map(d=>`
      <div class="inline-flex items-center gap-2 bg-[var(--brand-text,#FDFBF7)] border border-[var(--brand-base,#2C1810)]/10 rounded-full px-3 py-1">
        <span class="text-xs">${String(d.label||d.key||"")}</span>
        <span class="text-[10px] text-gray-500">${Number(d.price||0).toLocaleString()} د.ع</span>
        ${n?`<button class="variant-add w-6 h-6 rounded-full bg-[var(--brand-base,#2C1810)] text-[var(--brand-gold,#C5A059)]" data-key="${String(d.key||d.label||"")}">+</button>`:""}
      </div>`).join("")}</div>`:"",b=p?`
      <div class="mt-2 space-y-2" data-for="${String(e.id)}" hidden>
        <div class="inline-flex items-center px-3 py-1 rounded-full border border-[var(--brand-base,#2C1810)]/15 text-[var(--brand-base,#2C1810)] bg-[var(--brand-text,#FDFBF7)] text-xs w-fit">الإضافات</div>
        ${l.map(d=>`
          <label class="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--brand-base,#2C1810)]/15 bg-[var(--brand-text,#FDFBF7)]">
            <input type="checkbox" class="accent-[var(--brand-base,#2C1810)]" value="${String(d.label||d.name||d.title||"")}" data-price="${Number(d.price||0)}">
            <span class="text-sm">${String(d.label||d.name||d.title||"")} <span class="text-xs text-gray-500">(+ ${Number(d.price||0).toLocaleString()} د.ع)</span></span>
          </label>
        `).join("")}
        <div class="flex justify-end">
          <button class="apply-addons-btn bg-[var(--brand-base,#2C1810)] text-[var(--brand-gold,#C5A059)] px-3 py-1 rounded-lg text-xs" data-pid="${String(e.id)}">تطبيق</button>
        </div>
      </div>
    `:"",u=o.length===0,i=document.createElement("div");i.className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 hover:border-[var(--brand-gold,#C5A059)]/50 transition-colors",i.innerHTML=`
      <div class="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative">
        <img src="${t}" class="w-full h-full object-cover" onerror="this.style.display='none'">
        <div class="absolute inset-0 border border-black/5 rounded-lg pointer-events-none"></div>
      </div>
      <div class="flex-1">
        <h4 class="font-bold text-[var(--brand-base,#2C1810)] text-lg">${r}</h4>
        <p class="item-desc hidden text-xs text-gray-600 mt-1" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;"></p>
        <div class="flex items-center gap-2">
          ${u?`<span class="text-[color-mix(in_oklab,var(--brand-base,#2C1810),white 40%)] text-sm">${re(e)}</span>`:""}
          ${s?'<button class="addons-btn inline-flex items-center px-3 py-1 rounded-full border border-[var(--brand-base,#2C1810)]/15 bg-[var(--brand-text,#FDFBF7)] text-[var(--brand-base,#2C1810)] text-xs hover:border-[var(--brand-gold,#C5A059)]">الإضافات</button>':""}
        </div>
        ${v}
        ${b}
      </div>
      ${u&&n?'<button class="product-add w-10 h-10 rounded-lg bg-[var(--brand-base,#2C1810)] text-[var(--brand-gold,#C5A059)] flex items-center justify-center hover:bg-[var(--brand-gold,#C5A059)] hover:text-[var(--brand-base,#2C1810)] transition-colors shadow-lg">+</button>':""}`;const m=i.querySelector(".item-desc");m&&(c?(m.textContent=c,m.classList.remove("hidden")):m.remove());const h=i.querySelector(".product-add");h&&(h.onclick=d=>{if(d.stopPropagation(),s)M({id:e.id,price:a,name:r,img:t,desc:String(e.description||e.ai_description||""),variants:e.variants||[],addons:e.addons||[]});else{I({id:e.id,price:a,name:r,img:t});const y=h.textContent;h.textContent="✓",h.disabled=!0,setTimeout(()=>{h.textContent=y||"+",h.disabled=!1},1500)}});const f=i.querySelector(".addons-btn");f&&(f.onclick=d=>{d.preventDefault(),d.stopPropagation();const y=String(e.id),E=i.querySelector(`[data-for="${y}"]`);E&&E.toggleAttribute("hidden")}),i.querySelectorAll(".apply-addons-btn").forEach(d=>{d.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation();const E=String(d.getAttribute("data-pid")||""),_=i.querySelector(`[data-for="${E}"]`),O=_?_.querySelectorAll('input[type="checkbox"]:checked'):[],V=Array.from(O).map(z=>({label:String(z.value||""),price:Number(z.getAttribute("data-price")||0)})),de=D(e?.variants)??Number(e.price||0),j={variant:null,addons:V};n&&I({id:e.id,price:Number(de+V.reduce((z,Be)=>z+Number(Be.price||0),0)),name:r,img:t,options:j});const Ae=d.textContent;d.textContent="تم التطبيق",d.disabled=!0,setTimeout(()=>{d.textContent=Ae||"تطبيق",d.disabled=!1},1200);const T=i.querySelector(".product-add");if(T){const z=T.textContent;T.textContent="✓",T.disabled=!0,setTimeout(()=>{T.textContent=z||"+",T.disabled=!1},1200)}})}),i.querySelectorAll(".variant-add").forEach(d=>{d.addEventListener("click",y=>{y.stopPropagation();const E=String(d.getAttribute("data-key")||""),_=o.find(j=>String(j.key||j.label||"")===E),O=Number(_?.price||0),V=String(_?.label||_?.key||"");if(Array.isArray(e.addons)&&e.addons.length>0)M({id:e.id,price:O,name:r,img:t,desc:String(e.description||e.ai_description||""),variants:e.variants||[],addons:e.addons||[]});else{I({id:e.id,price:O,name:r,img:t,options:{variant:V,addons:[]}});const j=d.textContent;d.textContent="✓",d.disabled=!0,setTimeout(()=>{d.textContent=j||"+",d.disabled=!1},1500)}})});const x=i.querySelector("img");return x&&(x.onclick=d=>{d.stopPropagation(),M({id:e.id,price:a,name:r,img:t,desc:String(e.description||e.ai_description||""),variants:e.variants||[],addons:e.addons||[]})}),i.onclick=null,i}function xe(e){A=e||null;const{overlay:t,panel:a}=ie(),r=document.getElementById("preview-image"),c=document.getElementById("preview-name"),n=document.getElementById("preview-desc"),s=document.getElementById("preview-price"),o=document.getElementById("preview-options"),l=e?.img&&e.img.trim().length>0?e.img:S(N||"","");r&&(r.src=l||"",r.style.display=l?"":"none",r.onerror=()=>{const u=S(N||"","");u&&(r.style.display="",r.src=u)}),c&&(c.textContent=e.name||""),n&&(n.textContent=e.desc||"");let p=[];function v(){const u=D(e?.variants)??Number(e.price||0),i=p.reduce((m,h)=>m+Number(h.price||0),0);return Number(u+i)}if(o){o.innerHTML="";const u=Array.isArray(e?.addons)?e.addons:[];if(u.length){const i=document.createElement("div");i.className="space-y-2";const m=document.createElement("div");m.className="inline-flex items-center px-3 py-1 rounded-full border border-[var(--brand-base,#2C1810)]/15 text-[var(--brand-base,#2C1810)] bg-[var(--brand-text,#FDFBF7)] text-xs w-fit",m.textContent="الإضافات",i.appendChild(m),p=[],u.forEach(h=>{const f=document.createElement("label");f.className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--brand-base,#2C1810)]/15 bg-[var(--brand-text,#FDFBF7)]",f.innerHTML=`
            <input type="checkbox" class="accent-[var(--brand-base,#2C1810)]">
            <span class="text-sm">${String(h.label||h.name||h.title||"")} <span class="text-xs text-gray-500">(+ ${Number(h.price||0).toLocaleString()} د.ع)</span></span>
          `;const x=f.querySelector("input");x.addEventListener("change",()=>{x.checked?p.push(h):p=p.filter(d=>(d.label||"")!==(h.label||"")),s&&(s.textContent=`${v().toLocaleString()} د.ع`)}),i.appendChild(f)}),o.appendChild(i)}}s&&(s.textContent=`${v().toLocaleString()} د.ع`),t.classList.remove("hidden"),t.offsetWidth,t.classList.add("opacity-100"),a.classList.remove("hidden");const b=document.getElementById("preview-add");b.onclick=()=>{const u={variant:null,addons:p.map(i=>({label:i.label,price:i.price}))};I({id:e.id,price:v(),name:e.name,img:l,options:u}),B()}}async function we(){const e=document.getElementById("menu-container");e.innerHTML="";const t=await ae(),a=new Map,r=await C.from("products").select("id, name, description, ai_description, price, image_url, available, category_id, variants, addons").eq("restaurant_id",w.id).eq("available",!0);(Array.isArray(r.data)?r.data:[]).forEach(n=>{const s=String(n.category_id||"");a.has(s)||a.set(s,[]),a.get(s).push(n)}),t.forEach(n=>{const s=document.createElement("div");s.className="bg-white rounded-2xl overflow-hidden border border-gray-100";const o=document.createElement("div");o.className="p-4 bg-[var(--brand-text,#FDFBF7)] border-b border-[var(--brand-base,#2C1810)]/10",o.innerHTML=`<h3 class="text-xl font-bold text-[var(--brand-base,#2C1810)]">${n.name||""}</h3>`;const l=document.createElement("div");l.className="grid grid-cols-1 gap-4 p-4",(a.get(String(n.id))||[]).forEach(p=>l.appendChild(se(p))),s.appendChild(o),s.appendChild(l),e.appendChild(s)}),$()}async function oe(){const e=document.getElementById("menu-container");e.innerHTML="";const t=await ae();for(const a of t){const r=document.createElement("div");r.className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-[0_10px_40px_-10px_rgba(44,24,16,.15)] transition-shadow duration-300";const c=document.createElement("div");c.className="relative h-48 cursor-pointer overflow-hidden";const n=S(a.image_url||"",""),o=n&&n.trim().length>0?"bg-[var(--brand-base,#2C1810)]/60 group-hover:bg-[var(--brand-base,#2C1810)]/40":"bg-transparent";c.innerHTML=`
        <div class="absolute inset-0 bg-[var(--cat-default,#766D67)]"></div>
        <img src="${n}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0" onerror="this.style.display='none'">
        <div class="absolute inset-0 ${o} transition-colors duration-300"></div>
        <div class="absolute inset-4 border border-white/30 pointer-events-none"></div>
        <div class="absolute inset-0 flex flex-col justify-center items-center text-center p-6 text-white">
          <h3 class="text-3xl font-bold mb-1 tracking-wide">${a.name||""}</h3>
        </div>
        <div class="accordion-chevron absolute bottom-0 right-0 bg-white/10 backdrop-blur px-4 py-2 rounded-tl-xl border-t border-l border-white/20">
          <i data-lucide="chevron-down" class="w-4 h-4 text-white transition-transform duration-300"></i>
        </div>`;const l=document.createElement("div");l.className="accordion-content bg-[var(--brand-text,#FDFBF7)] border-t border-[var(--brand-base,#2C1810)]/10";const p=document.createElement("div");p.className="accordion-inner p-4";const v=document.createElement("div");v.className="grid grid-cols-1 gap-4",(await ye(a.id)).forEach(u=>v.appendChild(se(u))),p.appendChild(v),l.appendChild(p),c.onclick=()=>{const u=l.classList.contains("open");document.querySelectorAll(".accordion-content").forEach(f=>f.classList.remove("open")),u||l.classList.add("open");const i=l.classList.contains("open"),h=c.querySelector(".accordion-chevron")?.querySelector("svg, i[data-lucide='chevron-down'], span.lucide-chevron-down");h&&h.classList.toggle("rotate-180",i)},r.appendChild(c),r.appendChild(l),e.appendChild(r)}$()}async function Ee(){const{data:e}=await C.from("products").select("id, name, price, image_url, category_id, available, variants, addons, description, ai_description").eq("restaurant_id",w.id).eq("available",!0).order("sort_order",{ascending:!0}).order("created_at",{ascending:!0});return Array.isArray(e)?e:[]}async function _e(){const e=document.getElementById("search-overlay"),t=document.getElementById("search-panel");e.classList.remove("hidden"),e.offsetWidth,e.classList.add("opacity-100"),t.classList.remove("hidden");const a=document.getElementById("search-input");a&&a.focus()}function X(){const e=document.getElementById("search-overlay"),t=document.getElementById("search-panel");e.classList.remove("opacity-100"),setTimeout(()=>e.classList.add("hidden"),300),t.classList.add("hidden");const a=document.getElementById("search-input"),r=document.getElementById("search-results");a&&(a.value=""),r&&(r.innerHTML="")}function Ce(){let e=document.getElementById("menu-overlay"),t=document.getElementById("menu-panel");return e||(e=document.createElement("div"),e.id="menu-overlay",e.className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] hidden transition-opacity opacity-0",document.body.appendChild(e),e.addEventListener("click",Y)),t||(t=document.createElement("div"),t.id="menu-panel",t.className="fixed top-0 right-0 bottom-0 z-[75] w-[85%] max-w-sm bg-[var(--brand-base,#2C1810)]/60 backdrop-blur-xl border-l border-white/20 hidden",t.innerHTML=`
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
              <i data-lucide="map" class="w-5 h-5"></i>
              <span class="font-bold">الطريق إلينا</span>
            </div>
          </button>
          <button id="menu-call" class="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition">
            <div class="flex items-center gap-2">
              <i data-lucide="phone" class="w-5 h-5"></i>
              <span class="font-bold">اتصال</span>
            </div>
          </button>
        </div>`,document.body.appendChild(t),document.getElementById("menu-close")?.addEventListener("click",Y),document.getElementById("menu-route")?.addEventListener("click",Se),document.getElementById("menu-call")?.addEventListener("click",Ie)),{overlay:e,panel:t}}function Le(){const{overlay:e,panel:t}=Ce();e.classList.remove("hidden"),e.offsetWidth,e.classList.add("opacity-100"),t.classList.remove("hidden"),window.lucide&&typeof window.lucide.createIcons=="function"&&window.lucide.createIcons()}function Y(){const e=document.getElementById("menu-overlay"),t=document.getElementById("menu-panel");!e||!t||(e.classList.remove("opacity-100"),setTimeout(()=>e.classList.add("hidden"),300),t.classList.add("hidden"))}function Se(){const e=String(g?.location||"").trim();let t="";/^https?:/i.test(e)?t=e:e?t=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e)}`:t=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(w.name||"")}`;try{window.open(t,"_blank","noopener")}catch{location.href=t}}function Ie(){const e=a=>{const r=String(a||"").trim();if(!r)return"";const c=r.startsWith("+")?"+":"",n=r.replace(/\D/g,"");return c+n};let t=e(g?.phone_number);if(t||(t=e(g?.whatsapp_number)),!t){Y();return}setTimeout(()=>{window.location.href=`tel:${t}`},60)}let A=null;function ie(){let e=document.getElementById("preview-overlay"),t=document.getElementById("preview-panel");return e||(e=document.createElement("div"),e.id="preview-overlay",e.className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[75] hidden transition-opacity opacity-0",document.body.appendChild(e),e.addEventListener("click",B)),t||(t=document.createElement("div"),t.id="preview-panel",t.className="fixed inset-0 z-[80] flex items-center justify-center hidden",t.innerHTML=`
        <div class="relative bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-[92%] overflow-hidden">
          <button id="preview-close" class="absolute top-3 left-3 w-10 h-10 rounded-full bg-white text-[var(--brand-base,#2C1810)] shadow-lg flex items-center justify-center">×</button>
          <img id="preview-image" src="" class="w-full h-64 object-cover" onerror="this.style.display='none'">
          <div class="p-4">
            <h4 id="preview-name" class="font-bold text-lg text-[var(--brand-base,#2C1810)]"></h4>
            <p id="preview-desc" class="text-sm text-gray-600"></p>
            <div id="preview-options" class="mt-3 space-y-3"></div>
            <div class="mt-3 flex justify-between items-center">
              <span id="preview-price" class="font-bold"></span>
              ${g?.online_orders===!0?'<button id="preview-add" class="bg-[var(--brand-base,#2C1810)] text-[var(--brand-gold,#C5A059)] px-4 py-2 rounded-lg">إضافة إلى السلة</button>':""}
            </div>
          </div>
        </div>`,document.body.appendChild(t),document.getElementById("preview-close")?.addEventListener("click",B)),{overlay:e,panel:t}}function M(e){A=e||null;const{overlay:t,panel:a}=ie(),r=document.getElementById("preview-image"),c=document.getElementById("preview-name"),n=document.getElementById("preview-desc"),s=document.getElementById("preview-price"),o=document.getElementById("preview-options"),l=e?.img&&e.img.trim().length>0?e.img:S(N||"","");r&&(r.src=l||"",r.style.display=l?"":"none",r.onerror=()=>{const m=S(N||"","");m&&(r.style.display="",r.src=m)}),c&&(c.textContent=e.name||""),n&&(n.textContent=e.desc||"");let p=null,v=[];function b(){const m=p!=null?Number(p.price||0):D(e?.variants)??Number(e.price||0),h=v.reduce((f,x)=>f+Number(x.price||0),0);return Number(m+h)}function u(){if(!o)return;o.innerHTML="";const m=Array.isArray(e?.variants)?e.variants.filter(f=>Number(f?.price||0)>0):[];if(m.length){const f=document.createElement("div");f.className="rounded-lg border border-gray-200 p-3";const x=document.createElement("div");x.className="text-sm font-bold text-[var(--brand-base,#2C1810)] mb-2",x.textContent="الأحجام",f.appendChild(x),m.forEach((d,y)=>{const E=document.createElement("label");E.className="flex items-center justify-between gap-2 py-1",E.innerHTML=`
            <span class="text-sm">${String(d.label||d.key||"")}</span>
            <span class="text-xs text-gray-500">${Number(d.price||0).toLocaleString()} د.ع</span>
            <input type="radio" name="preview-size" class="accent-[var(--brand-base,#2C1810)]">
          `;const _=E.querySelector("input");_.checked=y===0&&!p,_.addEventListener("change",()=>{p=d,s&&(s.textContent=`${b().toLocaleString()} د.ع`)}),f.appendChild(E)}),!p&&m.length&&(p=m[0]),o.appendChild(f)}const h=Array.isArray(e?.addons)?e.addons:[];if(h.length){const f=document.createElement("div");f.className="space-y-2";const x=document.createElement("div");x.className="inline-flex items-center px-3 py-1 rounded-full border border-[var(--brand-base,#2C1810)]/15 text-[var(--brand-base,#2C1810)] bg-[var(--brand-text,#FDFBF7)] text-xs w-fit",x.textContent="الإضافات",f.appendChild(x),v=[],h.forEach(d=>{const y=document.createElement("label");y.className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--brand-base,#2C1810)]/15 bg-[var(--brand-text,#FDFBF7)]",y.innerHTML=`
            <input type="checkbox" class="accent-[var(--brand-base,#2C1810)]">
            <span class="text-sm">${String(d.label||d.name||d.title||"")} <span class="text-xs text-gray-500">+ ${Number(d.price||0).toLocaleString()} د.ع</span></span>
          `;const E=y.querySelector("input");E.addEventListener("change",()=>{E.checked?v.push(d):v=v.filter(_=>(_.label||"")!==(d.label||"")),s&&(s.textContent=`${b().toLocaleString()} د.ع`)}),f.appendChild(y)}),o.appendChild(f)}}u(),s&&(s.textContent=`${b().toLocaleString()} د.ع`),t.classList.remove("hidden"),t.offsetWidth,t.classList.add("opacity-100"),a.classList.remove("hidden");const i=document.getElementById("preview-add");i&&(i.textContent="إضافة إلى السلة",i.disabled=!1,i.onclick=()=>{const m=p?String(p.label||p.key||""):null,h=b(),f={variant:m,addons:v.map(d=>({label:d.label,price:d.price}))};I({id:e.id,price:h,name:e.name,img:l,options:f});const x=i.textContent;i.textContent="تم الاضافة",i.disabled=!0,setTimeout(()=>{i.textContent=x||"إضافة إلى السلة",i.disabled=!1,B()},650)})}function B(){const e=document.getElementById("preview-overlay"),t=document.getElementById("preview-panel");!e||!t||(e.classList.remove("opacity-100"),setTimeout(()=>e.classList.add("hidden"),300),t.classList.add("hidden"))}async function ke(e){const t=String(e?.target?.value||"").trim().toLowerCase(),a=document.getElementById("search-results");if(!a||(a.innerHTML="",!t))return;const c=(await Ee()).filter(n=>String(n.name||"").toLowerCase().includes(t));if(!c.length){a.innerHTML='<div class="p-4 text-center text-[var(--brand-base,#2C1810)]/60">لا توجد نتائج</div>';return}c.slice(0,50).forEach(n=>{const s=S(n.image_url||"",""),o=Number(n.price||0),l=String(n.name||""),p=Array.isArray(n.addons)&&n.addons.length>0,v=document.createElement("div");v.className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 hover:border-[var(--brand-gold,#C5A059)]/50 transition-colors",v.innerHTML=`
        <div class="w-16 h-16 rounded-lg overflow-hidden shrink-0 relative">
          <img src="${s}" class="w-full h-full object-cover" onerror="this.style.display='none'">
          <div class="absolute inset-0 border border-black/5 rounded-lg pointer-events-none"></div>
        </div>
        <div class="flex-1">
          <h4 class="font-bold text-[var(--brand-base,#2C1810)] text-sm">${l}</h4>
          <div class="flex items-center gap-2">
            <span class="text-[color-mix(in_oklab,var(--brand-base,#2C1810),white 40%)] text-xs">${re(n)}</span>
            ${p?'<button class="addons-btn inline-flex items-center px-3 py-1 rounded-full border border-[var(--brand-base,#2C1810)]/15 bg-[var(--brand-text,#FDFBF7)] text-[var(--brand-base,#2C1810)] text-[10px] hover:border-[var(--brand-gold,#C5A059)]">الإضافات</button>':""}
          </div>
        </div>
        ${g?.online_orders===!0?'<button class="search-add w-9 h-9 rounded-lg bg-[var(--brand-base,#2C1810)] text-[var(--brand-gold,#C5A059)] flex items-center justify-center hover:bg-[var(--brand-gold,#C5A059)] hover:text-[var(--brand-base,#2C1810)] transition-colors shadow-lg">+</button>':""}`;const b=v.querySelector(".w-9.h-9.rounded-lg");b&&(b.onclick=i=>{i.stopPropagation(),Array.isArray(n.variants)&&n.variants.length||Array.isArray(n.addons)&&n.addons.length?M({id:n.id,price:o,name:l,img:s,desc:String(n.description||n.ai_description||""),variants:n.variants||[],addons:n.addons||[]}):I({id:n.id,price:o,name:l,img:s})});const u=v.querySelector(".addons-btn");u&&(u.onclick=i=>{i.stopPropagation(),xe({id:n.id,price:o,name:l,img:s,desc:String(n.description||n.ai_description||""),variants:n.variants||[],addons:n.addons||[]})}),v.onclick=()=>{g?.online_orders===!0&&I({id:n.id,price:o,name:l,img:s})},a.appendChild(v)})}document.getElementById("nav-cart")?.addEventListener("click",()=>F(!0)),document.getElementById("cart-close")?.addEventListener("click",()=>F(!1)),document.getElementById("cart-overlay")?.addEventListener("click",()=>F(!1)),document.getElementById("fab-btn")?.addEventListener("click",()=>F(!0)),document.getElementById("search-btn")?.addEventListener("click",_e),document.getElementById("search-close")?.addEventListener("click",X),document.getElementById("search-overlay")?.addEventListener("click",X),document.getElementById("search-input")?.addEventListener("input",ke),document.getElementById("preview-overlay")?.addEventListener("click",B),document.getElementById("preview-close")?.addEventListener("click",B),document.getElementById("preview-add")?.addEventListener("click",()=>{A&&(I({id:A.id,price:A.price,name:A.name,img:A.img}),B())}),document.getElementById("menu-btn")?.addEventListener("click",Le),document.addEventListener("keydown",e=>{e.key==="Escape"&&X()});const Z=document.getElementById("browse-btn");Z?.addEventListener("click",async()=>{G=!G,G?(await we(),Z.innerHTML='<i data-lucide="arrow-left" class="w-4 h-4"></i><span>رجوع</span>'):(await oe(),Z.textContent="تصفح الكل"),window.lucide&&typeof window.lucide.createIcons=="function"&&window.lucide.createIcons()}),document.getElementById("checkout-btn")?.addEventListener("click",ge),await oe(),window.lucide&&typeof window.lucide.createIcons=="function"&&window.lucide.createIcons();try{window.__menuCart={canOrder:()=>g?.online_orders===!0,addToCart:({id:e,price:t,name:a,img:r,options:c})=>I({id:e,price:t,name:a,img:r,options:c}),openPreview:e=>M(e),openCart:()=>F(!0)}}catch{}$()}export{$e as render};
