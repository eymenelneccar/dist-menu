import{_ as H}from"./main-Cqdy5BvD.js";async function rt({slug:k,restaurant:w,settings:_}){const B=document.getElementById("app");if(!B)return;const{supabase:b}=await H(async()=>{const{supabase:e}=await import("./main-Cqdy5BvD.js").then(r=>r.s);return{supabase:e}},[]);function D(e){const r=document.documentElement,i=(a,c)=>{c&&typeof c=="string"&&c.trim().length>0&&r.style.setProperty(a,c.trim())};i("--brand-1",e?.color_primary),i("--brand-2",e?.color_secondary),i("--brand-text",e?.color_text)}function A(e,r){const i=e==null?"":String(e).trim();if(!i||i==="null"||i==="undefined")return r;if(/^https?:/i.test(i))return i;const a=i.split("/").filter(Boolean),c=a.shift(),n=a.join("/");if(!c||!n)return r;const t=b.storage.from(c).getPublicUrl(n)?.data?.publicUrl;return t||r}async function J(){if(w&&w.id)return w;const{data:e}=await b.from("restaurants").select("id, name, menu_enabled").eq("slug",k).maybeSingle();return e||null}async function U(e){if(_&&typeof _=="object")return _;const{data:r}=await b.from("settings").select("logo_url, hero_url, online_orders, splash1_url, splash2_url, splash3_url, splash4_url, active_splash, color_primary, color_secondary, color_text").eq("restaurant_id",e).maybeSingle();return r||{}}const y=await J();if(!y||y.menu_enabled!==!0){document.body.innerHTML="<h2>القائمة غير متاحة حالياً</h2>";return}document.title="منيو | "+(y.name||"");try{localStorage.setItem("restaurant_name",y.name||"")}catch{}const v=await U(y.id);D(v||{});let S=Number(v?.active_splash??0);const V=[v?.splash1_url,v?.splash2_url,v?.splash3_url,v?.splash4_url],Q=S>=1&&S<=4?V[S-1]:v?.hero_url;B.innerHTML=`
    <header class="relative">
      <div class="relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-b-2xl">
        <img id="hero-image" src="" alt="" class="absolute inset-0 w-full h-full object-cover" onerror="this.style.display='none'" fetchpriority="high" decoding="async">
        <div id="hero-overlay" class="absolute inset-0 bg-black/35"></div>
        <nav id="main-navbar" class="navbar navbar-floating z-50">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span id="restaurant-name" class="text-lg sm:text-xl font-extrabold">${y.name||""}</span>
            </div>
            <div class="flex items-center gap-2">
              <a id="nav-cart" class="p-2 rounded-lg hover:bg-white/15 relative cursor-pointer">
                <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                <span id="navbar-cart-count" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center">0</span>
              </a>
            </div>
          </div>
        </nav>
        <div class="absolute bottom-4 right-4 left-4 text-white"></div>
      </div>
    </header>
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="mb-6">
        <div class="category-bar flex items-center gap-2 overflow-x-auto p-2 bg-[#a2c4a8] border border-[#e5e7eb] rounded-xl shadow-[0_8px_20px_rgba(6,52,59,.08)]">
          <ul id="section-nav-list" class="flex items-start gap-2 text-gray-700 text-sm font-bold"></ul>
        </div>
      </div>
      <section class="section-silver rounded-xl p-6">
        <p id="section-hint" class="text-lg font-bold text-main">قائمة المنتجات</p>
        <div id="products-area" class="mt-4"></div>
      </section>
    </main>
    <footer class="fixed bottom-0 left-0 right-0 z-40 py-1 text-center text-xs text-gray-700 bg-white/95 backdrop-blur border-t border-gray-200">
      <span>تم صنعها بواسطة | </span>
      <a href="https://iqrarabic.com/" class="font-bold text-green-600 hover:text-green-700" target="_blank" rel="noopener">İQR MENU</a>
    </footer>
    <div id="cart-overlay" class="cart-overlay" hidden></div>
    <aside id="cart-panel" class="cart-panel" hidden>
      <div class="cart-header">
        <span class="cart-title">السلة</span>
        <button id="cart-close" class="cart-close" type="button">×</button>
      </div>
      <div id="cart-items" class="cart-items"></div>
      <div class="cart-total"><span>المجموع</span><span id="cart-total-val">0 د.ع</span></div>
    </aside>
  `;let P=null,T="";try{const{mountMenuAiAssistant:e}=await H(async()=>{const{mountMenuAiAssistant:r}=await import("./menuAiAssistant-DDk3kyFL.js");return{mountMenuAiAssistant:r}},[]);await e({supabase:b,slug:k,restaurantId:y.id,restaurantName:y.name||"",getContext:()=>({categoryId:P,categoryName:T})})}catch{}const $=document.getElementById("hero-image");$&&($.src=A(Q,$.src));function E(){const e=localStorage.getItem("restaurant_menu_cart");let r=[];if(e)try{r=JSON.parse(e)||[]}catch{}const i=r.reduce((c,n)=>c+(n.quantity||0),0),a=document.getElementById("navbar-cart-count");a&&(a.textContent=i)}function I({productId:e,name:r,basePrice:i,variant:a,addons:c}){const n="restaurant_menu_cart",p=localStorage.getItem(n);let t=[];if(p)try{t=JSON.parse(p)||[]}catch{}const s=Array.isArray(c)?c.reduce((u,d)=>u+Number(d?.price||0),0):0,l=a?Number(a.price||0):0,o=Number(i||0)||l,m={productId:String(e||""),name:String(r||""),price:Number(o+s),quantity:1,variant:a?{label:String(a.label||""),price:Number(a.price||0)}:null,addons:Array.isArray(c)?c.map(u=>({label:String(u.label||""),price:Number(u.price||0)})):[]};t.push(m);try{localStorage.setItem(n,JSON.stringify(t))}catch{}E()}function q(){const e=localStorage.getItem("restaurant_menu_cart");if(!e)return[];try{return JSON.parse(e)||[]}catch{return[]}}function j(e){try{localStorage.setItem("restaurant_menu_cart",JSON.stringify(Array.isArray(e)?e:[]))}catch{}E()}function C(e){return`${Number(e||0)} د.ع`}function N(){const e=document.getElementById("cart-panel"),r=document.getElementById("cart-items"),i=document.getElementById("cart-total-val"),a=q();if(!(!e||!r||!i))if(!a.length)r.innerHTML='<div class="cart-empty">السلة فارغة</div>',i.textContent=C(0);else{let c=0;r.innerHTML=a.map((n,p)=>{const t=(Array.isArray(n.addons)?n.addons:[]).map(o=>`<span class="chip">+ ${o.label} ${o.price}</span>`).join(""),s=Number(n.price||0)*Number(n.quantity||1);c+=s;const l=n.variant&&n.variant.label?` (${n.variant.label})`:"";return`
          <div class="cart-item" data-idx="${p}">
            <div class="cart-info">
              <div class="cart-name">${n.name}${l}</div>
              <div class="cart-addons">${t||""}</div>
            </div>
            <div class="cart-controls">
              <button class="qty-btn" data-op="minus">-</button>
              <span class="qty">${n.quantity||1}</span>
              <button class="qty-btn" data-op="plus">+</button>
              <span class="line">${C(s)}</span>
              <button class="remove-btn">حذف</button>
            </div>
          </div>
        `}).join(""),i.textContent=C(c),r.querySelectorAll(".qty-btn").forEach(n=>{n.addEventListener("click",()=>{const p=n.getAttribute("data-op"),t=n.closest(".cart-item"),s=Number(t?.getAttribute("data-idx")||-1),l=q();if(s>=0&&l[s]){const o=Number(l[s].quantity||1)+(p==="plus"?1:-1);l[s].quantity=o<1?1:o,j(l),N()}})}),r.querySelectorAll(".remove-btn").forEach(n=>{n.addEventListener("click",()=>{const p=n.closest(".cart-item"),t=Number(p?.getAttribute("data-idx")||-1),s=q();t>=0&&(s.splice(t,1),j(s),N())})})}}function M(){const e=document.getElementById("cart-overlay"),r=document.getElementById("cart-panel");if(!e||!r)return;N(),e.hidden=!1,r.hidden=!1,e.addEventListener("click",R,{once:!0});const i=document.getElementById("cart-close");i&&i.addEventListener("click",R,{once:!0})}function R(){const e=document.getElementById("cart-overlay"),r=document.getElementById("cart-panel");!e||!r||(e.hidden=!0,r.hidden=!0)}function Y(){const e=document.getElementById("main-navbar"),r=document.querySelector("header"),i=document.querySelector("main");if(!e||!r||!i)return;const a=r.offsetHeight-8,c=()=>{const n=window.scrollY>=a;e.classList.toggle("navbar-stuck",n),e.classList.toggle("navbar-floating",!n),i.style.paddingTop=n?e.offsetHeight+"px":""};window.addEventListener("scroll",c),c()}function F(){const e=document.getElementById("nav-cart");e&&e.addEventListener("click",()=>M())}async function G(){const{data:e}=await b.from("categories").select("id, name, image_url").eq("restaurant_id",y.id).order("sort_order",{ascending:!0}),r=document.getElementById("section-nav-list");r.innerHTML=(e||[]).map(a=>{const c=A(a.image_url,"");return`
        <li class="flex-shrink-0">
          <button data-id="${a.id}" data-name="${String(a.name||"").replace(/"/g,"&quot;")}" class="category-card w-28 sm:w-32 md:w-36" tabindex="0">
            <img src="${c||""}" alt="${a.name}" onerror="this.style.display='none'" style="${c?"":"display:none;"}" loading="lazy" decoding="async">
            <div class="cat-overlay"></div>
            <span class="cat-title">${a.name}</span>
          </button>
        </li>`}).join("");const i=document.querySelectorAll("#section-nav-list .category-card");if(i.length){const a=new IntersectionObserver(c=>{c.forEach(n=>{n.isIntersecting&&(n.target.classList.add("reveal"),a.unobserve(n.target))})},{threshold:.15});i.forEach(c=>a.observe(c))}return document.querySelectorAll("#section-nav-list .category-card").forEach(a=>{a.addEventListener("click",()=>{const c=a.getAttribute("data-id"),n=a.getAttribute("data-name")||a.querySelector(".cat-title")?.textContent||"";O(c,n)})}),e||[]}async function K(e){const r=e,i=r!=null&&r!==""&&!Number.isNaN(Number(r)),a=i?Number(r):null,c=String(r),n="id, name, description, ai_description, price, image_url, available, variants, addons",p=(l,o,m,u)=>{let d=b.from("products").select(n).eq(l,o);return m===!0&&(d=d.eq("available",!0)),u===!0&&(d=d.eq("restaurant_id",y.id)),d},t=async(l,o,m)=>{let{data:u,error:d}=await p(l,o,m,!0);return d&&console.warn("product query error (with restaurant_id):",d?.message),Array.isArray(u)&&u.length?u:({data:u,error:d}=await p(l,o,m,!1),d&&console.warn("product query error (no restaurant_id):",d?.message),Array.isArray(u)?u:[])};let s=[];return i&&(s=await t("category_id",a,!0),s.length||(s=await t("category_id",a,!1)),s.length||(s=await t("categoryId",a,!1)),s.length||(s=await t("category",a,!1))),s.length||(s=await t("category_id",c,!1)),s.length||(s=await t("category",c,!1)),s.length||(s=await t("category_slug",c,!1)),s}async function O(e,r){P=e??null,T=r||"";const i=document.getElementById("section-hint"),a=document.getElementById("products-area");i&&(i.textContent=r&&r.trim().length?r:"قائمة المنتجات");const n=(await K(e)||[]).filter(t=>t?.available!==!1);a.classList.add("products-list");const p=n.map(t=>{const s=A(t.image_url,""),l=t.description||t.ai_description||"",o=Array.isArray(t.variants)?t.variants:[],m=o.map(g=>Number(g?.price)||0).filter(g=>g>0),u=m.length?Math.min(...m):null;let d="";u!=null?d=String(u)+" د.ع":t.price!=null?d=String(t.price)+" د.ع":d="غير مسعّر";const f=Array.isArray(t.addons)?t.addons.length:0;!o.length&&f&&(d+=" + إضافات");const h=(Array.isArray(t.variants)?t.variants:[]).map(g=>`
          <li class="size-row">
            <span class="size-label">${String(g?.label??"")}</span>
            <span class="size-price">${g?.price??""} د.ع</span>
            <button class="add-btn" type="button" data-pid="${t.id}" data-vlabel="${String(g?.label??"")}" data-vprice="${Number(g?.price??0)}">+</button>
          </li>
        `).join(""),x=(Array.isArray(t.addons)?t.addons:[]).map(g=>`
          <label class="addon-check">
            <input type="checkbox" value="${String(g?.label??"")}" data-price="${Number(g?.price??0)}">
            <span>${String(g?.label??"")}</span>
            <span class="addon-price">+${g?.price??""} د.ع</span>
          </label>
        `).join(""),X=h?`<div class="product-row"><ul class="sizes-list">${h}</ul></div>`:"",Z=f?`<div class="addon-actions"><button class="addon-btn" type="button" data-pid="${t.id}">إضافات (${f})</button></div>`:"",tt=f?`<div class="addons-list" data-for="${t.id}" hidden>${x}<div class="addons-actions"><button class="apply-addons-btn" type="button" data-pid="${t.id}">تطبيق</button></div></div>`:"";return`
        <div class="product-card" data-name="${t.name||""}" data-desc="${l||""}">
          <div class="product-media">
            <img src="${s||""}" alt="${t.name||""}" class="product-img" onerror="this.style.display='none'">
          </div>
          <div class="product-body">
            <h4 class="product-title">${t.name||""}</h4>
            <p class="product-desc">${l||""}</p>
            <div class="product-rows">
              ${X}
            </div>
            ${Z}
            ${tt}
            ${o.length?"":`<div class="product-price">${d}</div>`}
          </div>
        </div>`}).join("");a.innerHTML=p||'<div class="text-center text-gray-700 py-12">لا توجد منتجات في هذا القسم حالياً.</div>',a.querySelectorAll(".add-btn").forEach(t=>{t.addEventListener("click",()=>{const s=t.getAttribute("data-pid"),l=t.getAttribute("data-vlabel"),o=Number(t.getAttribute("data-vprice")||0);I({productId:s,name:t.closest(".product-card")?.querySelector(".product-title")?.textContent||"",basePrice:o,variant:{label:l,price:o},addons:[]});const m=t.textContent;t.textContent="✓",t.disabled=!0,setTimeout(()=>{t.textContent=m||"+",t.disabled=!1},1200)})}),a.querySelectorAll(".apply-addons-btn").forEach(t=>{t.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation();const l=t.getAttribute("data-pid"),o=t.closest(".product-card"),m=o?.querySelector(".product-title")?.textContent||"",u=o?.querySelectorAll(`.addons-list[data-for="${l}"] .addon-check input[type="checkbox"]:checked`)||[],d=Array.from(u).map(x=>({label:x.value,price:Number(x.getAttribute("data-price")||0)})),f=Number(o?.querySelector(".product-price")?.textContent?.replace(/\D+/g,"")||0);I({productId:l,name:m,basePrice:f,variant:null,addons:d});const h=t.textContent;t.textContent="تم التطبيق",t.disabled=!0,setTimeout(()=>{t.textContent=h||"تطبيق",t.disabled=!1},1200)})}),a.querySelectorAll(".addon-btn").forEach(t=>{t.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation();const l=t.getAttribute("data-pid"),o=a.querySelector(`.addons-list[data-for="${l}"]`);o&&(o.hasAttribute("hidden")?o.removeAttribute("hidden"):o.setAttribute("hidden",""))})}),window.lucide&&typeof window.lucide.createIcons=="function"&&window.lucide.createIcons()}E(),Y(),F();const z=await G(),W=new URL(window.location.href).searchParams.get("c"),L=z.find(e=>String(e.id)===String(W))?.id||z[0]?.id;if(L){const e=document.querySelector(`#section-nav-list [data-id="${L}"]`),r=e?.getAttribute("data-name")||e?.querySelector(".cat-title")?.textContent||"";await O(L,r)}try{window.__menuCart={canOrder:()=>v?.online_orders===!0,addToCart:({id:e,price:r,name:i,options:a})=>I({productId:e,name:i,basePrice:r,variant:a?.variant?{label:a.variant,price:a?.variantPrice}:null,addons:Array.isArray(a?.addons)?a.addons:[]}),openCart:()=>M()}}catch{}window.lucide&&typeof window.lucide.createIcons=="function"&&window.lucide.createIcons()}export{rt as render};
