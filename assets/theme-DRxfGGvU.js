import{_ as X}from"./main-CFCp9c0K.js";async function ue({slug:R,restaurant:M,settings:P}){const U=document.getElementById("app");if(!U)return;const{supabase:$}=await X(async()=>{const{supabase:e}=await import("./main-CFCp9c0K.js").then(t=>t.s);return{supabase:e}},[]),S=(e,t)=>{t&&typeof t=="string"&&t.trim()&&document.documentElement.style.setProperty(e,t.trim())},Y=e=>{S("--brand-1",e?.color_primary),S("--brand-2",e?.color_secondary),S("--brand-base",e?.color_primary),S("--brand-gold",e?.color_secondary),S("--bg-main",e?.color_bg_main),S("--bg-surface",e?.color_bg_surface),S("--text-main",e?.color_text),S("--text-heading",e?.color_heading),S("--border-color",e?.color_border),S("--shadow-color",e?.color_shadow),S("--brand-text",e?.color_bg_main)},H=(e,t)=>{const n=e==null?"":String(e).trim();if(!n||n==="null"||n==="undefined")return t;if(/^https?:/i.test(n))return n;const i=n.split("/").filter(Boolean),s=i.shift(),r=i.join("/");if(!s||!r)return t;const u=$.storage.from(s).getPublicUrl(r)?.data?.publicUrl;return u||t},Z=e=>new Promise(t=>setTimeout(t,e));async function T(e,t=3,n=500){let i=null;for(let s=0;s<t;s++)try{const r=await e();if(r&&typeof r=="object"&&"error"in r&&r.error)throw r.error;return r}catch(r){i=r,s<t-1&&await Z(n)}throw i}async function ee(){if(M&&M.id)return M;const e=await T(()=>$.from("restaurants").select("id, name, menu_enabled").eq("slug",R).maybeSingle());return e&&e.data?e.data:null}async function te(e){const t=P&&typeof P=="object"?P:{},n=await T(()=>$.from("settings").select("menu_theme, logo_url, hero_url, online_orders, color_primary, color_secondary, color_bg_main, color_bg_surface, color_text, color_heading, color_border, color_shadow, instagram_url, instagram_color, whatsapp_number, phone_number, location, hero_pill_text, hero_left_text, hero_right_text, shipping_enabled, shipping_zones").eq("restaurant_id",e).maybeSingle()),i=n?n.data:null;return{...t,...i||{}}}const E=await ee();if(!E||E.menu_enabled!==!0){document.body.innerHTML="<h2>القائمة غير متاحة حالياً</h2>";return}document.title="منيو | "+(E.name||"");try{localStorage.setItem("restaurant_name",E.name||"")}catch{}const c=await te(E.id);Y(c||{});const J=H(c?.hero_url||"","");U.innerHTML=`
    <header class="fixed top-0 left-0 right-0 max-w-lg mx-auto w-full flex justify-between items-center px-2 py-4 bg-white z-30 border-b border-[#331A12]/10">
      <div class="flex items-center gap-3">
        <h1 id="site-title" class="text-2xl font-bold text-[#331A12]">${E.name||""}</h1>
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
        ${J?`<img id="hero-image" src="${J}" alt="" class="w-full h-full object-cover">`:""}
        <div class="absolute inset-0 flex items-end p-6">
          <h2 id="hero-title" class="text-3xl font-bold text-white leading-tight" style="text-shadow: 0 2px 8px rgba(0,0,0,.35);">
            <span>${c?.hero_left_text||""}</span><br><span>${c?.hero_right_text||""}</span>
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
  `;function W(e){const t=document.getElementById("open-cart-btn");t&&(t.style.display=e?"":"none");const n=document.getElementById("nav-cart");n&&(n.style.display=e?"":"none");const i=document.getElementById("cart-count-bubble");i&&!e&&i.classList.add("hidden");const s=document.getElementById("cart-modal");s&&!e&&s.classList.add("hidden");const r=document.getElementById("item-preview-add");r&&(r.style.display=e?"":"none");const b=document.getElementById("cart-footer");b&&(b.style.display=e?"":"none")}function O(){const e=document.getElementById("instagram-btn");if(!e)return;const t=String(c?.instagram_url||"").trim();t?(e.style.display="",e.setAttribute("href",t)):e.style.display="none";const n=String(c?.instagram_color||"").trim();e.style.color=n||""}W(c?.online_orders===!0),O();async function ne(){const e=await T(()=>$.from("categories").select("id,name,image_url").eq("restaurant_id",E.id).order("sort_order",{ascending:!0}).order("created_at",{ascending:!0})),t=e?e.data:null;return Array.isArray(t)?t:[]}async function re(e){const t="id,name,description,ai_description,price,image_url,available,variants,addons",n=await T(()=>$.from("products").select(t).eq("restaurant_id",E.id).eq("category_id",e).eq("available",!0).order("sort_order",{ascending:!0}).order("created_at",{ascending:!0})),i=n?n.data:null;return Array.isArray(i)?i:[]}function L(){const e=localStorage.getItem("restaurant_menu_cart");if(!e)return[];try{return JSON.parse(e)||[]}catch{return[]}}function F(e){try{localStorage.setItem("restaurant_menu_cart",JSON.stringify(Array.isArray(e)?e:[]))}catch{}z()}function q({id:e,price:t,name:n,img:i,options:s}){if(c?.online_orders!==!0)return;const r=L(),b=x=>{const f=String(x?.variant||"").trim(),h=Array.isArray(x?.addons)?x.addons.map(y=>String(y?.label||"").trim()).filter(Boolean).sort():[];return`${f}||${h.join(",")}`},u=b(s),m=r.findIndex(x=>String(x.productId||"")===String(e||"")&&b(x.options)===u);m>=0?(r[m].quantity=Number(r[m].quantity||1)+1,Number(t||0)>0&&(r[m].price=Number(t||r[m].price||0))):r.push({productId:String(e||""),name:String(n||""),price:Number(t||0),quantity:1,img:String(i||""),options:s||null}),F(r),k()}function z(){if(c?.online_orders!==!0){const f=document.getElementById("cart-count-bubble");f&&f.classList.add("hidden");const h=document.getElementById("cart-total");h&&(h.textContent="0 د.ع");return}const e=document.getElementById("cart-count-bubble"),t=L(),n=t.reduce((f,h)=>f+Number(h.quantity||1),0);e&&(e.textContent=String(n),n>0?e.classList.remove("hidden"):e.classList.add("hidden"));const i=document.getElementById("cart-total"),s=t.reduce((f,h)=>f+Number(h.price||0)*Number(h.quantity||1),0),r=Array.isArray(c?.shipping_zones)?c.shipping_zones:[],b=c?.shipping_enabled===!0;let u=Number(localStorage.getItem("restaurant_shipping_zone_idx")||"0");(!Number.isFinite(u)||u<0||u>=r.length)&&(u=0);const m=b&&r.length?Number(r[u]?.fee||0):0,x=s+m;i&&(i.textContent=`${Number(x).toLocaleString()} د.ع`)}function ae(e){const t=document.createElement("div");t.className="bg-white rounded-xl shadow-[0_8px_20px_rgba(0,0,0,.06)] border border-[#331A12]/10 overflow-hidden";const n=H(e.image_url||"",""),i=String(e.description||e.ai_description||"").trim(),s=c?.online_orders===!0,r=Array.isArray(e.variants)?e.variants.filter(a=>Number(a?.price||0)>0):[],b=Array.isArray(e.addons)?e.addons:[],u=b.length>0,m=r.length?`<div class="mt-2 flex flex-wrap gap-2">${r.map(a=>`
      <div class="inline-flex items-center gap-2 bg-white border border-[#331A12]/15 rounded-full px-3 py-1">
        <span class="text-xs">${String(a.label||a.key||"")}</span>
        <span class="text-[10px] text-[#331A12]/60">${Number(a.price||0).toLocaleString()} د.ع</span>
        ${s?`<button class="variant-add w-6 h-6 rounded-full bg-[var(--brand-1,#2c98aa)] text-white" data-key="${String(a.key||a.label||"")}">+</button>`:""}
      </div>`).join("")}</div>`:"",x=s&&u?`
      <div class="mt-2 space-y-2" data-for="${String(e.id)}" hidden>
        <div class="inline-flex items-center px-3 py-1 rounded-full border border-[#331A12]/15 text-[#331A12] bg-white text-xs w-fit">الإضافات</div>
        ${b.map(a=>`
          <label class="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#331A12]/15 bg-white">
            <input type="checkbox" class="accent-[var(--brand-1,#2c98aa)]" value="${String(a.label||a.name||a.title||"")}" data-price="${Number(a.price||0)}">
            <span class="text-sm">${String(a.label||a.name||a.title||"")} <span class="text-xs text-[#331A12]/60">(+ ${Number(a.price||0).toLocaleString()} د.ع)</span></span>
          </label>
        `).join("")}
        <div class="flex justify-end">
          <button class="apply-addons-btn bg-[var(--brand-1,#2c98aa)] text-white px-3 py-1 rounded-lg text-xs" data-pid="${String(e.id)}">تطبيق</button>
        </div>
      </div>
    `:"",f=s&&r.length===0?`
        <button aria-label="أضف للسلة" data-id="${e.id}" class="h-9 px-3 rounded-full bg-[var(--brand-1,#2c98aa)] text-white text-sm font-bold flex items-center justify-center add-btn">أضف للسلة</button>
      `:"";t.innerHTML=`
      <div class="relative w-full pt-[56%]">
        ${n?`
          <img src="${n}" alt="" class="absolute inset-0 w-full h-full object-cover" onerror="this.style.display='none'; this.parentNode.querySelector('.img-fallback')?.classList.remove('hidden')">
          <div class="img-fallback hidden absolute inset-0 w-full h-full bg-[#eee]"></div>
        `:`
          <div class="img-fallback absolute inset-0 w-full h-full bg-[#eee]"></div>
        `}
      </div>
      <div class="p-4">
        <div class="flex items-center justify-between">
          ${f}
          <div class="text-right">
            <div class="text-[#331A12] font-bold">${e.name||""}</div>
            <div class="item-desc hidden text-xs text-[#331A12]/70 mt-1" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;"></div>
            <div class="text-[#331A12] font-bold">${Number(e.price||0).toLocaleString()} د.ع</div>
            ${s&&u?'<div class="mt-1"><button class="addons-btn inline-flex items-center px-3 py-1 rounded-full border border-[#331A12]/15 bg-white text-[#331A12] text-xs">الإضافات</button></div>':""}
          </div>
        </div>
        ${m}
        ${x}
      </div>
    `;try{window.lucide&&typeof window.lucide.createIcons=="function"&&window.lucide.createIcons()}catch{}const h=t.querySelector(".item-desc");h&&(i?(h.textContent=i,h.classList.remove("hidden")):h.remove());const y=t.querySelector(".add-btn");s&&y?.addEventListener("click",()=>{if(Array.isArray(e.variants)&&e.variants.length||Array.isArray(e.addons)&&e.addons.length){j(e,n);return}q({id:e.id,price:e.price,name:e.name,img:n});try{window.lucide&&typeof window.lucide.createIcons=="function"&&window.lucide.createIcons()}catch{}const p=y.textContent;y.textContent="تم الاضافة",y.disabled=!0,setTimeout(()=>{y.textContent=p||"أضف للسلة",y.disabled=!1},1200)});const I=t.querySelector(".addons-btn");return s&&I&&I.addEventListener("click",a=>{a.preventDefault(),a.stopPropagation();const p=String(e.id),d=t.querySelector(`[data-for="${p}"]`);d&&d.toggleAttribute("hidden")}),s&&t.querySelectorAll(".apply-addons-btn").forEach(a=>{a.addEventListener("click",p=>{p.preventDefault(),p.stopPropagation();const d=String(a.getAttribute("data-pid")||""),o=t.querySelector(`[data-for="${d}"]`),g=o?o.querySelectorAll('input[type="checkbox"]:checked'):[],v=Array.from(g).map(_=>({label:String(_.value||""),price:Number(_.getAttribute("data-price")||0)})),w=Array.isArray(e.variants)?e.variants.map(_=>Number(_?.price||0)).filter(_=>Number.isFinite(_)&&_>0):[],A=w.length?Math.min(...w):Number(e.price||0),B=Number(A+v.reduce((_,de)=>_+Number(de.price||0),0)),l={variant:null,addons:v};q({id:e.id,price:B,name:e.name,img:n,options:l});try{window.lucide&&typeof window.lucide.createIcons=="function"&&window.lucide.createIcons()}catch{}const N=a.textContent;a.textContent="تم التطبيق",a.disabled=!0,setTimeout(()=>{a.textContent=N||"تطبيق",a.disabled=!1},1200)})}),s&&t.querySelectorAll(".variant-add").forEach(a=>{a.addEventListener("click",p=>{p.stopPropagation();const d=String(a.getAttribute("data-key")||""),o=r.find(A=>String(A.key||A.label||"")===d),g=Number(o?.price||0),v=String(o?.label||o?.key||"");if(Array.isArray(e.addons)&&e.addons.length>0){j(e,n);const A=a.textContent;a.textContent="✓",a.disabled=!0,setTimeout(()=>{a.textContent=A||"+",a.disabled=!1},1200)}else{q({id:e.id,price:g,name:e.name,img:n,options:{variant:v,addons:[]}});const A=a.textContent;a.textContent="✓",a.disabled=!0,setTimeout(()=>{a.textContent=A||"+",a.disabled=!1},1200)}})}),t.querySelector("img")?.addEventListener("click",()=>j(e,n)),t}let C=null,V="";try{const{mountMenuAiAssistant:e}=await X(async()=>{const{mountMenuAiAssistant:t}=await import("./menuAiAssistant-DDk3kyFL.js");return{mountMenuAiAssistant:t}},[]);await e({supabase:$,slug:R,restaurantId:E.id,restaurantName:E.name||"",getContext:()=>({categoryId:C,categoryName:V})})}catch{}function K(){const e=document.getElementById("categories-nav");e&&e.querySelectorAll("[data-cat-id]").forEach(t=>{const n=String(t.getAttribute("data-cat-id")||"")===String(C||""),i="snap-start relative w-[110px] h-[110px] shrink-0 rounded-2xl overflow-hidden bg-[#eee] shadow-sm border transition-all duration-200",s="ring-2 ring-[var(--brand-1,#2c98aa)] shadow-lg border-transparent",r="border-[#331A12]/10";t.className=i+" "+(n?s:r)})}async function D(e,t){const n=document.getElementById("items-container"),i=document.getElementById("current-category-title");i&&(i.textContent=t||""),n.innerHTML="",(await re(e)).forEach(r=>n.appendChild(ae(r))),z(),C=e,V=t||"",K()}async function oe(){const e=document.getElementById("categories-nav"),t=await ne();e.innerHTML="",t.forEach((n,i)=>{const s=document.createElement("button"),r=H(n.image_url||"","");s.setAttribute("data-cat-id",String(n.id)),s.className="snap-start relative w-[110px] h-[110px] shrink-0 rounded-2xl overflow-hidden bg-[#eee] shadow-sm border border-[#331A12]/10 transition-all duration-200",s.innerHTML=`
        ${r?`<img src="${r}" class="absolute inset-0 w-full h-full object-cover z-0" onerror="this.style.display='none';">`:""}
        <div class="absolute bottom-2 inset-x-2 flex justify-center z-10 pointer-events-none">
          <div class="px-3 py-1 rounded-md bg-black/45 shadow-md">
            <div class="text-white text-[13px] font-bold text-center">${n.name||""}</div>
          </div>
        </div>
      `,s.addEventListener("click",()=>D(n.id,n.name)),e.appendChild(s),i===0&&(C=n.id,D(n.id,n.name))}),K()}function Q(){if(c?.online_orders!==!0)return;const e=document.getElementById("cart-modal"),t=document.getElementById("cart-drawer");!e||!t||(e.classList.remove("hidden"),e.offsetWidth,t.classList.remove("translate-x-full"),k())}function se(){const e=document.getElementById("cart-modal"),t=document.getElementById("cart-drawer");!e||!t||(t.classList.add("translate-x-full"),setTimeout(()=>{e.classList.add("hidden")},300))}function k(){if(c?.online_orders!==!0)return;const e=document.getElementById("cart-items"),t=document.getElementById("customer-note")?.value||"",n=document.getElementById("customer-name")?.value||"",i=document.getElementById("customer-phone")?.value||"",s=document.getElementById("customer-address")?.value||"",r=Array.isArray(c?.shipping_zones)?c.shipping_zones:[],b=c?.shipping_enabled===!0;let u=Number(localStorage.getItem("restaurant_shipping_zone_idx")||"0");(!Number.isFinite(u)||u<0||u>=r.length)&&(u=0);const m=L();if(e.innerHTML="",!m.length)e.innerHTML='<p class="text-center text-[#331A12]/70">سلتك فارغة.</p>';else{m.forEach((o,g)=>{const v=document.createElement("div");v.className="flex items-center gap-3 py-2";const w=`
          <div class="relative w-12 h-12 rounded-lg overflow-hidden">
            ${o.img?`<img src="${o.img}" class="absolute inset-0 w-full h-full object-cover" onerror="this.style.display='none'; this.parentNode.querySelector('.cart-fallback')?.classList.remove('hidden')">`:""}
            <div class="cart-fallback absolute inset-0 w-full h-full bg-[#eee] ${o.img?"hidden":""}"></div>
          </div>
        `,A=o?.options?.variant?`(${String(o.options.variant)})`:"",B=Array.isArray(o?.options?.addons)?o.options.addons.map(l=>`<span class="inline-block px-2 py-0.5 rounded-full bg-[#eee] text-[#331A12] text-[11px]">+ ${String(l.label||"")}</span>`).join(""):"";v.innerHTML=`
          ${w}
          <div class="flex-1">
            <div class="font-bold text-[#331A12]">${o.name} ${A}</div>
            ${B?`<div class="mt-1 flex flex-wrap gap-1">${B}</div>`:""}
            <div class="flex items-center gap-2 mt-1">
              <button class="qty-minus w-6 h-6 rounded-full border border-[#331A12]/20 flex items-center justify-center"><i data-lucide="minus" class="w-4 h-4"></i></button>
              <span class="text-sm font-bold text-[#331A12]">${Number(o.quantity)}</span>
              <button class="qty-plus w-6 h-6 rounded-full border border-[#331A12]/20 flex items-center justify-center"><i data-lucide="plus" class="w-4 h-4"></i></button>
              <span class="ml-auto text-sm font-bold text-[#331A12]">${Number(o.price).toLocaleString()} د.ع</span>
            </div>
          </div>
        `,v.querySelector(".qty-plus")?.addEventListener("click",()=>{const l=L();l[g].quantity=Number(l[g].quantity||1)+1,F(l),k()}),v.querySelector(".qty-minus")?.addEventListener("click",()=>{const l=L();l[g].quantity=Math.max(0,Number(l[g].quantity||1)-1),l[g].quantity<=0&&l.splice(g,1),F(l),k()}),e.appendChild(v)});const x=document.createElement("div");x.className="border-t border-[#331A12]/10 my-3",e.appendChild(x);const f=document.createElement("div");f.id="cart-extra-fields",f.className="space-y-3",f.innerHTML=`
        <label class="block text-[#331A12] font-bold">ملاحظة الزبون</label>
        <textarea id="customer-note" class="w-full border border-[#331A12]/20 rounded-lg p-2 h-24"></textarea>
        <label class="block text-[#331A12] font-bold">الاسم*</label>
        <input id="customer-name" type="text" class="w-full border border-[#331A12]/20 rounded-lg p-2" />
        <label class="block text-[#331A12] font-bold">الرقم*</label>
        <input id="customer-phone" type="tel" inputmode="tel" class="w-full border border-[#331A12]/20 rounded-lg p-2" />
        <label class="block text-[#331A12] font-bold">العنوان*</label>
        <input id="customer-address" type="text" class="w-full border border-[#331A12]/20 rounded-lg p-2" />
        ${b&&r.length?`
        <label class="block text-[#331A12] font-bold">منطقة الشحن*</label>
        <select id="shipping-zone" class="w-full border border-[#331A12]/20 rounded-lg p-2">
          ${r.map((o,g)=>{const v=String(o?.name||o?.zone||""),w=Number(o?.fee||0);return`<option value="${g}">${v} — ${w.toLocaleString()} د.ع</option>`}).join("")}
        </select>
        `:""}
      `,e.appendChild(f);const h=document.getElementById("customer-note");h&&(h.value=t);const y=document.getElementById("customer-name");y&&(y.value=n);const I=document.getElementById("customer-phone");I&&(I.value=i);const a=document.getElementById("customer-address");a&&(a.value=s);const p=m.reduce((o,g)=>o+Number(g.price||0)*Number(g.quantity||1),0);if(b&&r.length){Number(r[u]?.fee||0),String(r[u]?.name||r[u]?.zone||"");const o=document.getElementById("shipping-zone");o&&(o.value=String(u),o.onchange=()=>{try{localStorage.setItem("restaurant_shipping_zone_idx",String(o.value||"0"))}catch{}k()})}const d=document.createElement("div");d.id="cart-summary",d.className="border-t border-[#331A12]/10 mt-3 pt-3 text-sm text-[#331A12]",p>0&&(d.innerHTML=`
          <div class="flex items-center justify-between"><span>المجموع</span><span>${Number(p).toLocaleString()} د.ع</span></div>
          <div class="flex items-center justify-between font-bold"><span>الإجمالي</span><span>${Number(p).toLocaleString()} د.ع</span></div>
        `,e.appendChild(d))}z();try{window.lucide&&typeof window.lucide.createIcons=="function"&&window.lucide.createIcons()}catch{}}function ie(){const e=L();if(!e.length)return;const t=e.reduce((l,N)=>l+Number(N.price||0)*Number(N.quantity||1),0),n=document.getElementById("customer-note")?.value||"",i=document.getElementById("customer-name"),s=document.getElementById("customer-phone"),r=document.getElementById("customer-address"),b=document.getElementById("shipping-zone"),u=String(i?.value||"").trim(),m=String(s?.value||"").trim(),x=String(r?.value||"").trim(),f=Array.isArray(c?.shipping_zones)?c.shipping_zones:[],h=c?.shipping_enabled===!0&&f.length>0;let y=Number(localStorage.getItem("restaurant_shipping_zone_idx")||"0");if((!Number.isFinite(y)||y<0||y>=f.length)&&(y=0),b&&String(b.value||"")!==""){const l=Number(b.value||"0");Number.isFinite(l)&&l>=0&&l<f.length&&(y=l)}const I=h?Number(f[y]?.fee||0):0,a=h?String(f[y]?.name||f[y]?.zone||""):"",p=t+(h?I:0);document.querySelectorAll("#cart-items .field-error").forEach(l=>l.remove()),[i,s,r,b].forEach(l=>{l&&(l.style.borderColor="")});const d=[],o=(l,N)=>{if(!l)return;l.style.borderColor="#ef4444";const _=document.createElement("div");_.className="field-error",_.style.cssText="color:#b91c1c;font-size:12px;margin-top:4px;",_.textContent=N,l.insertAdjacentElement("afterend",_)};u||(d.push("name"),o(i,"الاسم مطلوب"));const g=m.replace(/\D+/g,"");if((!g||g.length<7)&&(d.push("phone"),o(s,"الرقم مطلوب")),x||(d.push("address"),o(r,"العنوان مطلوب")),c?.shipping_enabled===!0&&f.length&&String(b?.value??"")===""&&(d.push("zone"),o(b,"منطقة الشحن مطلوبة")),d.length){(i||s||r||b)?.focus();return}const w=`*فاتورة الطلب*%0A *الأصناف:*%0A${e.map(l=>{const N=Number(l.price||0)*Number(l.quantity||1);return` * ${l.name} x ${l.quantity} — ${N.toLocaleString()} د.ع`}).join("%0A")}%0A*المجموع:* *${t.toLocaleString()} د.ع*%0A`+(h&&I>0?`*أجور الشحن${a?` (${a})`:""}:* *${I.toLocaleString()} د.ع*%0A`:"")+`*الإجمالي:* *${p.toLocaleString()} د.ع*%0A`+(u?`*الاسم:* *${u}*%0A`:"")+(m?`*الرقم:* *${m}*%0A`:"")+(x?`*العنوان:* *${x}*%0A`:"")+`*ملاحظة:* ${n||""}`,A=String(c?.whatsapp_number||"").replace(/\D+/g,""),B=A?`https://wa.me/${A}?text=${w}`:`https://wa.me/?text=${w}`;window.open(B,"_blank","noopener")}function le(){const e=String(c?.phone_number||"").replace(/\D+/g,"");e&&(window.location.href=`tel:${e}`)}function j(e,t){const n=document.getElementById("item-modal"),i=document.getElementById("item-preview-image"),s=document.getElementById("item-preview-name"),r=document.getElementById("item-preview-description"),b=document.getElementById("item-preview-price"),u=document.getElementById("item-preview-options"),m=document.getElementById("item-preview-add");if(!n)return;if(i&&(i.src=t||""),s&&(s.textContent=e.name||""),r&&(r.textContent=e.description||e.ai_description||""),c?.online_orders!==!0){u&&(u.innerHTML=""),m&&(m.onclick=null,m.style.display="none"),b&&(b.textContent=`${Number(e.price||0).toLocaleString()} د.ع`),n.classList.remove("hidden");return}m&&(m.style.display="");let x=null,f=[];const h=Array.isArray(e.variants)?e.variants.filter(p=>Number(p?.price||0)>0):[],y=Array.isArray(e.addons)?e.addons:[];function I(){const p=h.map(d=>Number(d?.price||0)).filter(d=>Number.isFinite(d)&&d>0);return p.length?Math.min(...p):Number(e.price||0)}function a(){const p=x!=null?Number(x.price||0):I(),d=f.reduce((o,g)=>o+Number(g.price||0),0);return Number(p+d)}if(u){if(u.innerHTML="",h.length){const p=document.createElement("div");p.className="rounded-lg border border-[#331A12]/15 p-3";const d=document.createElement("div");d.className="text-sm font-bold text-[#331A12] mb-2",d.textContent="الأحجام",p.appendChild(d),h.forEach((o,g)=>{const v=document.createElement("label");v.className="flex items-center justify-between gap-2 py-1",v.innerHTML=`
            <span class="text-sm">${String(o.label||o.key||"")}</span>
            <span class="text-xs text-[#331A12]/60">${Number(o.price||0).toLocaleString()} د.ع</span>
            <input type="radio" name="preview-size" class="accent-[var(--brand-1,#2c98aa)]">
          `;const w=v.querySelector("input");w.checked=g===0&&!x,w.addEventListener("change",()=>{x=o,b&&(b.textContent=`${a().toLocaleString()} د.ع`)}),p.appendChild(v)}),!x&&h.length&&(x=h[0]),u.appendChild(p)}if(y.length){const p=document.createElement("div");p.className="space-y-2 mt-2";const d=document.createElement("div");d.className="inline-flex items-center px-3 py-1 rounded-full border border-[#331A12]/15 text-[#331A12] bg-white text-xs w-fit",d.textContent="الإضافات",p.appendChild(d),f=[],y.forEach(o=>{const g=document.createElement("label");g.className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#331A12]/15 bg-white",g.innerHTML=`
            <input type="checkbox" class="accent-[var(--brand-1,#2c98aa)]">
            <span class="text-sm">${String(o.label||o.name||o.title||"")} <span class="text-xs text-[#331A12]/60">(+ ${Number(o.price||0).toLocaleString()} د.ع)</span></span>
          `;const v=g.querySelector("input");v.addEventListener("change",()=>{v.checked?f.push(o):f=f.filter(w=>(w.label||"")!==(o.label||"")),b&&(b.textContent=`${a().toLocaleString()} د.ع`)}),p.appendChild(g)}),u.appendChild(p)}}b&&(b.textContent=`${a().toLocaleString()} د.ع`),m&&(m.textContent="أضف للسلة",m.disabled=!1),m&&(m.onclick=()=>{const p=x?String(x.label||x.key||""):null,d=a(),o={variant:p,addons:f.map(v=>({label:v.label,price:v.price}))};q({id:e.id,price:d,name:e.name,img:t,options:o});const g=m.textContent;m.textContent="تم الاضافة",m.disabled=!0,setTimeout(()=>{m.textContent=g||"أضف للسلة",m.disabled=!1,G()},650)}),n.classList.remove("hidden")}function G(){const e=document.getElementById("item-modal");e&&e.classList.add("hidden")}document.getElementById("open-cart-btn")?.addEventListener("click",Q),document.getElementById("nav-cart")?.addEventListener("click",Q),document.getElementById("close-cart-btn")?.addEventListener("click",se),document.getElementById("submit-order-btn")?.addEventListener("click",ie),document.getElementById("call-order-btn")?.addEventListener("click",e=>{e.preventDefault(),le()}),document.getElementById("close-item-btn")?.addEventListener("click",G),document.getElementById("nav-more")?.addEventListener("click",()=>{const e=document.getElementById("more-menu");if(!e)return;e.classList.contains("hidden")?e.classList.remove("hidden"):e.classList.add("hidden")}),O(),document.getElementById("facebook-btn")?.setAttribute("href","https://facebook.com/"),document.getElementById("nav-map")?.addEventListener("click",()=>{const e=String(c?.location||"");e&&window.open(e,"_blank","noopener")});try{$.channel("settings_"+E.id).on("postgres_changes",{event:"*",schema:"public",table:"settings",filter:`restaurant_id=eq.${E.id}`},e=>{const t=e?.new?.shipping_enabled,n=e?.new?.shipping_zones,i=e?.new?.online_orders,s=e?.new?.instagram_url,r=e?.new?.instagram_color;typeof t=="boolean"&&(c.shipping_enabled=t),Array.isArray(n)&&(c.shipping_zones=n),typeof i=="boolean"&&(c.online_orders=i,W(c.online_orders===!0),C&&D(C,V)),typeof s=="string"&&(c.instagram_url=s),typeof r=="string"&&(c.instagram_color=r),O(),z(),k()}).subscribe()}catch{}document.getElementById("nav-home")?.addEventListener("click",()=>{const e=document.getElementById("hero-section");e?e.scrollIntoView({behavior:"smooth",block:"start"}):window.scrollTo({top:0,behavior:"smooth"})}),await oe();try{window.__menuCart={canOrder:()=>c?.online_orders===!0,addToCart:({id:e,price:t,name:n,img:i,options:s})=>q({id:e,price:t,name:n,img:i,options:s}),openPreview:(e,t)=>j(e,t),openCart:()=>toggleCart(!0)}}catch{}z(),window.lucide&&typeof window.lucide.createIcons=="function"&&window.lucide.createIcons()}export{ue as render};
