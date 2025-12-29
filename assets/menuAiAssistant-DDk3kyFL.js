async function Zt({supabase:E,slug:X,restaurantId:k,restaurantName:$t,getContext:at}){if(!E||!k||document.getElementById("menu-ai-assistant-root"))return;let B=null;try{const{data:t}=await E.from("menu_ai_settings").select("*").eq("restaurant_id",k).maybeSingle();B=t}catch(t){console.error("AI settings error:",t)}if(!(B?B.enabled!==!1:!0))return;const ot=B?.assistant_name||"سارة",lt=B?.greeting||"كيف أقدر أساعدك؟",dt=B?.fab_icon==null?"":String(B.fab_icon).trim(),ct=!!dt,At=ct?`<img src="/icon/${encodeURIComponent(dt)}" alt="" class="w-[74px] h-[74px] object-contain select-none pointer-events-none" draggable="false" />`:'<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',Lt=ct?"menu-ai-fab-float-btn relative w-[78px] h-[78px] bg-transparent text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300":"menu-ai-fab-float-btn relative w-14 h-14 rounded-full shadow-lg bg-[var(--brand-1,#0ea5a5)] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300",ut=`menu_ai_history:${X}`,mt=`menu_ai_state:${X}`,_=()=>{try{const t=localStorage.getItem(ut),e=t?JSON.parse(t):[];return Array.isArray(e)?e:[]}catch{return[]}},S=t=>{try{localStorage.setItem(ut,JSON.stringify(Array.isArray(t)?t:[]))}catch{}},Ct=()=>{try{const t=localStorage.getItem(mt),e=t?JSON.parse(t):null;return e&&typeof e=="object"?e:null}catch{return null}},ft=t=>{try{localStorage.setItem(mt,JSON.stringify(t&&typeof t=="object"?t:null))}catch{}};let s=_();s.length||(s=[{role:"assistant",content:lt,ts:Date.now()}],S(s),ft(null));const G=document.createElement("div");if(G.id="menu-ai-assistant-root",G.innerHTML=`
    <div id="menu-ai-overlay" class="fixed inset-0 z-[120] bg-black/40 hidden transition-opacity opacity-0"></div>

    <!-- Chat Panel -->
    <div id="menu-ai-panel" class="fixed z-[130] inset-y-0 right-0 w-full max-w-[400px] bg-[#fdfbf7] shadow-2xl transform translate-x-full transition-transform duration-300 flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-[var(--brand-1,#0ea5a5)] flex items-center justify-center text-white font-bold text-lg">
            ${ot.charAt(0)}
          </div>
          <div class="flex flex-col">
            <div class="font-bold text-gray-900">${ot}</div>
            <div class="text-xs text-green-600 font-medium flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              متاح الآن
            </div>
          </div>
        </div>
        <button id="menu-ai-close" class="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <!-- Messages -->
      <div id="menu-ai-messages" class="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fafafa]"></div>

      <!-- Input -->
      <form id="menu-ai-form" class="p-4 bg-white border-t border-gray-100">
        <button id="menu-ai-surprise" type="button" class="w-full mb-3 flex items-center justify-center gap-2 rounded-xl border border-[var(--brand-1,#0ea5a5)]/45 bg-[var(--brand-1,#0ea5a5)]/10 text-[var(--brand-1,#0ea5a5)] font-bold py-3 hover:bg-[var(--brand-1,#0ea5a5)]/15 active:bg-[var(--brand-1,#0ea5a5)]/20 transition">
          <span>اختارلي (على الحظ)</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <path d="M16 8h.01"></path>
            <path d="M12 12h.01"></path>
            <path d="M8 16h.01"></path>
          </svg>
        </button>
        <div class="relative flex items-center">
          <input id="menu-ai-input" class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[var(--brand-1,#0ea5a5)] focus:border-[var(--brand-1,#0ea5a5)] block p-3 pl-12 outline-none transition-all" placeholder="اسأل عن المنيو..." maxlength="400" autocomplete="off" />
          <button id="menu-ai-send" type="submit" class="absolute left-2 p-2 text-[var(--brand-1,#0ea5a5)] hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
        <div class="text-[10px] text-center text-gray-400 mt-2">
          المساعد قد يخطئ، يرجى مراجعة التفاصيل.
        </div>
      </form>
    </div>

    <div id="menu-ai-wheel-overlay" class="fixed inset-0 z-[140] hidden">
      <div id="menu-ai-wheel-backdrop" class="absolute inset-0 bg-black/40 opacity-0 transition-opacity"></div>
      <div id="menu-ai-wheel-sheet" class="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-[400px] h-[50vh] bg-white rounded-t-3xl shadow-2xl border border-gray-100 translate-y-full transition-transform duration-300 flex flex-col">
        <div class="px-4 pt-4 flex items-center justify-between">
          <div class="font-extrabold text-gray-900">عجلة الحظ</div>
          <button id="menu-ai-wheel-close" type="button" class="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="px-4 mt-1 text-xs text-gray-500">لفّ العجلة بإصبعك أو اضغط لف</div>
        <div class="flex-1 flex items-center justify-center px-4">
          <div class="relative w-full max-w-[320px] aspect-square select-none">
            <div class="absolute -top-2 left-1/2 -translate-x-1/2 z-20 drop-shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 2 L21 18 H3 Z" fill="rgb(15 23 42)"></path>
              </svg>
            </div>
            <div id="menu-ai-wheel" class="menu-ai-wheel absolute inset-0 rounded-full border-8 border-white shadow-xl bg-gray-100"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <button id="menu-ai-wheel-spin" type="button" class="w-20 h-20 rounded-full bg-[var(--brand-1,#0ea5a5)] text-white font-extrabold shadow-lg active:scale-95 transition disabled:opacity-50">لف</button>
            </div>
          </div>
        </div>
        <div id="menu-ai-wheel-hint" class="px-4 pb-4 text-xs text-gray-500 text-center"></div>
      </div>
    </div>

    <!-- FAB -->
    <div id="menu-ai-fab-wrap" class="fixed z-[9999]" style="right: 16px; bottom: calc(var(--menu-ai-bottom-offset, 96px) + env(safe-area-inset-bottom, 0px));">
      <div class="relative">
        <div id="menu-ai-teaser" class="absolute z-[115] max-w-[240px] bg-white text-black text-sm px-3 py-2 rounded-2xl shadow-xl border border-gray-100 hidden transform translate-y-4 transition-all duration-500" style="right: 56px; bottom: 44px;">
          <div class="relative pr-7 leading-snug">
            ${lt}
            <button id="menu-ai-teaser-close" class="absolute -top-2 -left-2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 shadow-sm">×</button>
          </div>
        </div>
        <button id="menu-ai-fab" class="${Lt}">
          ${At}
          <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white hidden" id="menu-ai-badge"></span>
        </button>
      </div>
    </div>
  `,document.body.appendChild(G),!document.getElementById("menu-ai-fab-style")){const t=document.createElement("style");t.id="menu-ai-fab-style",t.textContent=`
      @keyframes menuAiFabFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      .menu-ai-fab-float-btn { animation: menuAiFabFloat 3.8s ease-in-out infinite; will-change: transform; }
      .menu-ai-wheel { touch-action: none; will-change: transform; }
      #menu-ai-teaser::after{
        content:"";
        position:absolute;
        width:12px;
        height:12px;
        background:#fff;
        transform: rotate(45deg);
        right:18px;
        bottom:-6px;
        border-right:1px solid rgb(243 244 246);
        border-bottom:1px solid rgb(243 244 246);
      }
    `.trim(),document.head.appendChild(t)}const $=document.getElementById("menu-ai-overlay"),U=document.getElementById("menu-ai-panel"),K=document.getElementById("menu-ai-fab-wrap"),Et=document.getElementById("menu-ai-fab"),kt=document.getElementById("menu-ai-close"),z=document.getElementById("menu-ai-messages"),Bt=document.getElementById("menu-ai-form"),g=document.getElementById("menu-ai-input"),H=document.getElementById("menu-ai-send"),V=document.getElementById("menu-ai-surprise"),A=document.getElementById("menu-ai-teaser"),jt=document.getElementById("menu-ai-teaser-close"),j=document.getElementById("menu-ai-wheel-overlay"),M=document.getElementById("menu-ai-wheel-backdrop"),D=document.getElementById("menu-ai-wheel-sheet"),F=document.getElementById("menu-ai-wheel-close"),c=document.getElementById("menu-ai-wheel"),T=document.getElementById("menu-ai-wheel-spin"),q=document.getElementById("menu-ai-wheel-hint"),Z=()=>{if(!K)return;const t=96,e=12,i=16,n=[document.querySelector("footer.fixed.bottom-0"),document.querySelector("footer.fixed"),document.getElementById("bottom-nav")?.closest?.("footer")].filter(Boolean);let r=t;const a=window.innerHeight||0;for(const f of n){const u=f;if(!u||!(u instanceof HTMLElement))continue;const y=window.getComputedStyle(u);if(y.display==="none"||y.visibility==="hidden"||y.position!=="fixed")continue;const d=u.getBoundingClientRect();if(!(d.height>0))continue;const v=Math.max(0,a-d.top);r=Math.max(r,Math.ceil(v+e))}K.style.setProperty("--menu-ai-bottom-offset",`${r}px`);const l=window.innerWidth||0,o=[document.querySelector("footer.fixed.bottom-0"),document.querySelector("footer.fixed"),document.querySelector("header.fixed.top-0"),document.querySelector("header.fixed")].filter(Boolean);let p=i;for(const f of o){const u=f;if(!u||!(u instanceof HTMLElement))continue;const y=window.getComputedStyle(u);if(y.display==="none"||y.visibility==="hidden"||y.position!=="fixed")continue;const d=u.getBoundingClientRect();if(!(d.width>0))continue;const v=Math.max(0,Math.round(l-d.right));if(v>0){p=v+i;break}}K.style.right=`${p}px`},h=t=>String(t??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),Q=t=>{const e=Number(t);return!Number.isFinite(e)||e<=0?"":`${e.toLocaleString()} د.ع`},Y=(t,e="")=>{const i=t==null?"":String(t).trim();if(!i||i==="null"||i==="undefined")return e;if(/^https?:/i.test(i))return i;const n=i.split("/").filter(Boolean),r=n.shift(),a=n.join("/");if(!r||!a)return e;const o=E.storage.from(r).getPublicUrl(a)?.data?.publicUrl;return o||e},tt=new Map,et=new Set;let W=null,N=!1,I=!1,L=0,b=[],m=null;const Mt=t=>String(t??"").trim().toLowerCase().replaceAll("أ","ا").replaceAll("إ","ا").replaceAll("آ","ا").replaceAll("ة","ه").replaceAll("ى","ي").replace(/[^a-z0-9\u0600-\u06FF\s]+/gi," ").replaceAll(/\s+/g," ").trim(),Tt=t=>{const e=Mt(t);return e?!!(/(^|\s)(اختارلي|اخترلي|اختار لي|اختر لي)(\s|$)/.test(e)||/(^|\s)(على الحظ|عالحظ|حظ|مفاجاه|مفاجاه|مفاجئة|مفاجاه|surprise|random)(\s|$)/.test(e)||/(^|\s)(شي عالسريع|شي سريع|اقترحلي شي|اقترحلي)(\s|$)/.test(e)):!1},nt=(t,e,i)=>Math.max(e,Math.min(i,t)),Pt=t=>{const e=Math.max(2,Number(t)||0),i=360/e,n=[];for(let r=0;r<e;r+=1){const a=r*i,l=(r+1)*i,o=r%2===0?"rgba(14,165,165,0.22)":"rgba(14,165,165,0.10)";n.push(`${o} ${a}deg ${l}deg`)}return`conic-gradient(from -90deg, ${n.join(", ")})`},it=()=>{if(!c||!q)return;const t=Array.isArray(b)?b:[],e=t.length;if(!e){c.style.background="conic-gradient(from -90deg, rgba(148,163,184,0.25), rgba(148,163,184,0.15))",c.innerHTML="",q.textContent="جارٍ تحميل الخيارات...";return}c.style.background=Pt(e);const i=360/e;c.innerHTML=t.map((n,r)=>{const a=r*i+i/2;return`
          <div style="position:absolute;left:50%;top:50%;width:0;height:0;transform:rotate(${a}deg);transform-origin:0 0;pointer-events:none;">
            <div style="transform:translate(0, calc(-1 * clamp(70px, 22vw, 120px))) rotate(${-a}deg);">
              <div style="transform:translate(-50%,-50%);width:clamp(26px,8vw,38px);height:clamp(26px,8vw,38px);border-radius:9999px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.55);border:1px solid rgba(15,23,42,0.08);font-weight:900;font-size:clamp(18px,5vw,28px);line-height:1;color:rgba(15,23,42,0.55);text-shadow:0 2px 10px rgba(255,255,255,0.9);">
                <span style="transform:translateY(-1px);">؟</span>
              </div>
            </div>
          </div>
        `.trim()}).join(""),q.textContent="لفّها وخلّها توقف على اختيارك"},rt=t=>{g&&(g.disabled=!t),H&&(H.disabled=!t),V&&(V.disabled=!t)},gt=async({userText:t})=>{if(!(!j||!M||!D||!c)&&!N){N=!0,I=!1,L=0,String(t||"").trim(),b=[],it(),rt(!1),j.classList.remove("hidden"),j.offsetWidth,M.classList.remove("opacity-0"),D.classList.remove("translate-y-full"),c.style.transition="transform 0ms",c.style.transform="rotate(0deg)";try{const e=await Ut(),n=(Array.isArray(e)?e:[]).filter(r=>r&&r.id&&r.name).map(r=>({p:r,r:Math.random()})).sort((r,a)=>r.r-a.r).map(r=>r.p);b=n.slice(0,nt(n.length,6,12)),it(),T&&(T.disabled=b.length<2)}catch{b=[],it(),q&&(q.textContent="ما قدرت أجيب خيارات حالياً."),T&&(T.disabled=!0)}}},st=()=>{!j||!M||!D||N&&(I||(M.classList.add("opacity-0"),D.classList.add("translate-y-full"),setTimeout(()=>{j.classList.add("hidden")},300),N=!1,m=null,rt(!0),g?.focus()))},Ht=()=>{!j||!M||!D||(I=!1,N=!1,m=null,M.classList.add("opacity-0"),D.classList.add("translate-y-full"),j.classList.add("hidden"),rt(!0))},Dt=t=>{const i=(Array.isArray(b)?b:[]).length;if(!i)return-1;const n=360/i,r=(Number(t)%360+360)%360,a=Math.floor((360-r)%360/n);return nt(a,0,i-1)},Wt=async()=>{const t=Dt(L),e=t>=0&&b[t]?b[t]:null;if(st(),!e||!e.id){s=_(),s.push({role:"assistant",content:"ما قدرت أحدد اختيار واضح. جرّب مرة ثانية.",ts:Date.now()}),S(s),w();return}const i=`اختيارك اليوم: ${String(e.name||"").trim()} — بالعافية!`,n={id:e.id,name:String(e.name||"").trim(),price:e.price??null,image_url:e.img??null,img:e.img??null,desc:"",category:""};s=_(),s.push({role:"assistant",content:i,ts:Date.now(),suggestion:n}),S(s),w()},pt=({extraDeg:t=0}={})=>{if(!c||I||!Array.isArray(b)||b.length<2)return;I=!0,T&&(T.disabled=!0),F&&(F.disabled=!0);const e=360*(3+Math.floor(Math.random()*3)),i=Math.random()*360;L=L+e+i+nt(t,0,1440),c.style.transition="transform 2800ms cubic-bezier(0.10, 0.85, 0.10, 1)",c.style.transform=`rotate(${L}deg)`;const r=async()=>{I&&(I=!1,F&&(F.disabled=!1),await Wt())},a=l=>{l&&l.target!==c||(c.removeEventListener("transitionend",a),r())};c.addEventListener("transitionend",a),setTimeout(()=>{c.removeEventListener("transitionend",a),r()},3100)},Nt=t=>{const e=String(t??""),i=[],n=/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;let r=null;for(;(r=n.exec(e))!==null;)r[0]&&i.push(r[0]);return Array.from(new Set(i))},zt=async t=>{const i=(Array.isArray(t)?t.map(n=>String(n||"").trim()).filter(Boolean):[]).filter(n=>!tt.has(n)&&!et.has(n));if(i.length){i.forEach(n=>et.add(n));try{const{data:n}=await E.from("products").select("id,name,price,image_url").in("id",i).limit(50);(Array.isArray(n)?n:[]).forEach(r=>{const a=String(r?.id||"").trim();a&&tt.set(a,r)})}finally{i.forEach(n=>et.delete(n)),w()}}},w=()=>{z&&(z.innerHTML=s.map(t=>{const e=t.role==="user",i=e?"justify-end":"justify-start",n=e?"bg-[var(--brand-1,#0ea5a5)] text-white rounded-2xl rounded-tr-sm":"bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm shadow-sm",r=h(t.content).replaceAll(`
`,"<br/>"),a=!e&&t&&typeof t=="object"?t.ui??null:null,l=a&&typeof a=="object"?String(a.type||""):"",o=a&&typeof a=="object"?a.current??null:null,p=o&&typeof o=="object"?Y(o.img??o.image_url??"",""):"",f=o&&typeof o=="object"?String(o.name??""):"",u=o&&typeof o=="object"&&o.price!=null?Q(o.price):"",y=!e&&l==="surprise_loading"?`
              <div class="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div class="font-extrabold text-sm text-gray-900">جاري اختيار طلبك...</div>
                <div class="text-[11px] text-gray-500 mt-0.5">ثواني ونسويلك مفاجأة</div>
                ${p?`<img src="${h(p)}" alt="" class="mt-3 w-full h-40 rounded-xl object-cover border border-gray-200 bg-white" />`:'<div class="mt-3 w-full h-40 rounded-xl border border-gray-200 bg-gray-200/70 animate-pulse"></div>'}
                ${f||u?`
                  <div class="mt-2 flex items-center justify-between gap-3">
                    <div class="min-w-0 font-bold text-sm text-gray-900 truncate">${h(f||"…")}</div>
                    ${u?`<div class="shrink-0 font-bold text-[var(--brand-1,#0ea5a5)] text-sm whitespace-nowrap">${h(u)}</div>`:""}
                  </div>
                `:""}
              </div>
            `:"",d=!e&&t&&typeof t=="object"?t.suggestion:null,v=d&&d.id?String(d.id):"",P=d&&d.name?String(d.name):"",O=d&&d.desc?String(d.desc):"",x=d&&d.category?String(d.category):"",R=d&&d.price!=null?Q(d.price):"",xt=d&&typeof d=="object"?d.image_url??d.img??d.image??"":"",vt=xt?Y(xt,""):"",wt=!e&&!!v&&!!P&&!!window.__menuCart&&typeof window.__menuCart.addToCart=="function"&&(typeof window.__menuCart.canOrder=="function"?window.__menuCart.canOrder():!0),J=!e&&!v?Nt(t.content):[];J.length&&zt(J);const Jt=!e&&J.length?`
              <div class="mt-3 space-y-2">
                ${J.map(_t=>{const C=tt.get(_t),Gt=String(C?.name||"..."),St=C&&C.price!=null?Q(C.price):"",It=C?.image_url?Y(C.image_url,""):"",Kt=wt&&C&&String(C?.id||"").trim();return`
                      <div class="rounded-xl border border-gray-200 bg-gray-50 p-2.5">
                        <div class="flex items-center gap-3">
                          <div class="min-w-0 flex-1">
                            <div class="font-bold text-sm text-gray-900 truncate">${h(Gt)}</div>
                            ${St?`<div class="text-xs font-bold text-[var(--brand-1,#0ea5a5)] mt-0.5">${h(St)}</div>`:""}
                          </div>
                          <button
                            type="button"
                            class="shrink-0 bg-[var(--brand-1,#0ea5a5)] text-white text-xs font-bold px-3 py-2 rounded-lg hover:opacity-95 active:opacity-90 transition disabled:opacity-50"
                            data-action="add-suggestion"
                            data-product-id="${h(_t)}"
                            ${Kt?"":"disabled"}
                          >إضافة</button>
                        </div>
                        ${It?`<img src="${h(It)}" alt="" class="mt-2 w-full h-28 rounded-xl object-cover border border-gray-200 bg-white" />`:""}
                      </div>
                    `}).join("")}
              </div>
            `:"",Xt=!e&&v&&P?`
              <div class="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <div class="font-bold text-sm text-gray-900 truncate">${h(P)}</div>
                    ${x?`<div class="text-[11px] text-gray-500 mt-0.5">${h(x)}</div>`:""}
                  </div>
                  ${R?`<div class="shrink-0 font-bold text-[var(--brand-1,#0ea5a5)] text-sm whitespace-nowrap">${h(R)}</div>`:""}
                </div>
                ${O?`<div class="text-xs text-gray-700 mt-2 leading-relaxed">${h(O)}</div>`:""}
                ${vt?`<img src="${h(vt)}" alt="" class="mt-3 w-full h-40 rounded-xl object-cover border border-gray-200 bg-white" />`:""}
                ${wt?`
                  <button
                    type="button"
                    class="mt-3 w-full bg-[var(--brand-1,#0ea5a5)] text-white text-sm font-bold py-2.5 rounded-xl hover:opacity-95 active:opacity-90 transition"
                    data-action="add-suggestion"
                    data-product-id="${h(v)}"
                  >إضافة للسلة</button>`:""}
              </div>
            `:"";return`
          <div class="flex ${i}">
            <div class="max-w-[85%] px-4 py-3 text-sm leading-relaxed ${n}">
              ${r}
              ${y}
              ${Jt}
              ${Xt}
            </div>
          </div>
        `}).join(""),z.scrollTop=z.scrollHeight)},ht=()=>{$&&($.classList.remove("hidden"),$.offsetWidth,$.classList.remove("opacity-0")),U&&U.classList.remove("translate-x-full"),A&&A.classList.add("hidden"),localStorage.setItem(`menu_ai_teaser_seen:${k}`,Date.now()),s=_(),Z(),w(),setTimeout(()=>g?.focus(),300)},bt=()=>{W&&clearInterval(W),W=null,Ht(),$&&$.classList.add("opacity-0"),U&&U.classList.add("translate-x-full"),setTimeout(()=>{$&&$.classList.add("hidden")},300)};Et?.addEventListener("click",ht),$?.addEventListener("click",bt),kt?.addEventListener("click",bt);const Ft=Number(localStorage.getItem(`menu_ai_teaser_seen:${k}`)||0),yt=Date.now();yt-Ft>1440*60*1e3&&setTimeout(()=>{A&&(A.classList.remove("hidden"),A.offsetWidth,A.classList.remove("translate-y-4"))},3e3),Z(),window.addEventListener("resize",Z),jt?.addEventListener("click",t=>{t.stopPropagation(),A&&A.classList.add("hidden"),localStorage.setItem(`menu_ai_teaser_seen:${k}`,yt)}),A?.addEventListener("click",ht),M?.addEventListener("click",st),F?.addEventListener("click",st),T?.addEventListener("click",()=>{pt()}),c?.addEventListener("pointerdown",t=>{if(!c||I||!N||!Array.isArray(b)||b.length<2)return;const e=c.getBoundingClientRect(),i=e.left+e.width/2,n=e.top+e.height/2,r=t.clientX,a=t.clientY,l=(Math.atan2(a-n,r-i)*180/Math.PI+90+360)%360;m={pointerId:t.pointerId,startAngle:l,startRotation:L,lastAngle:l,totalAbsDelta:0,lastTs:Date.now()},c.style.transition="transform 0ms",c.setPointerCapture?.(t.pointerId)}),c?.addEventListener("pointermove",t=>{if(!m||I||m.pointerId!==t.pointerId)return;const e=c.getBoundingClientRect(),i=e.left+e.width/2,n=e.top+e.height/2,r=t.clientX,a=t.clientY,l=(Math.atan2(a-n,r-i)*180/Math.PI+90+360)%360;let o=l-m.startAngle;o>180&&(o-=360),o<-180&&(o+=360);const p=m.lastAngle;let f=l-p;f>180&&(f-=360),f<-180&&(f+=360),m.totalAbsDelta+=Math.abs(f),m.lastAngle=l,L=m.startRotation+o,c.style.transform=`rotate(${L}deg)`}),c?.addEventListener("pointerup",t=>{if(!m||I||m.pointerId!==t.pointerId)return;const e=m.totalAbsDelta;m=null,c.releasePointerCapture?.(t.pointerId),!(e<18)&&pt({extraDeg:e*6})}),c?.addEventListener("pointercancel",t=>{m&&m.pointerId===t.pointerId&&(m=null,c.releasePointerCapture?.(t.pointerId))}),z?.addEventListener("click",async t=>{const e=t?.target?.closest?.('button[data-action="add-suggestion"]');if(!e)return;const i=String(e.getAttribute("data-product-id")||"").trim();if(!i||!window.__menuCart||typeof window.__menuCart.addToCart!="function")return;const n=e.textContent;e.disabled=!0,e.textContent="جارٍ الإضافة...";try{const{data:r}=await E.from("products").select("id,name,description,ai_description,price,image_url,variants,addons").eq("id",i).maybeSingle(),a=String(r?.name||"").trim(),l=Y(r?.image_url,""),o=String(r?.description||"").trim()||String(r?.ai_description||"").trim()||"",p=Array.isArray(r?.variants)?r.variants:[],f=Array.isArray(r?.addons)?r.addons:[];if((p.some(y=>Number(y?.price||0)>0)||f.length>0)&&typeof window.__menuCart.openPreview=="function"){window.__menuCart.openPreview({id:r?.id,price:r?.price,name:a,img:l,desc:o,variants:p,addons:f},l),e.textContent=n||"إضافة للسلة",e.disabled=!1;return}window.__menuCart.addToCart({id:r?.id,price:r?.price,name:a,img:l,options:null}),e.textContent="تمت الإضافة",setTimeout(()=>{e.textContent=n||"إضافة للسلة",e.disabled=!1},650)}catch{e.textContent=n||"إضافة للسلة",e.disabled=!1}});const qt=t=>(Array.isArray(t)?t:[]).filter(i=>i&&(i.role==="user"||i.role==="assistant")).map(i=>({role:i.role,content:String(i.content||"").slice(0,800)})).slice(-10),Ot=async({messageId:t,fullText:e})=>{const i=String(e??"");let n=0;const r=3,a=16;for(;n<i.length;){n=Math.min(i.length,n+r),s=_();const l=s.findIndex(o=>o&&o._id===t);if(l<0)return;s[l]={...s[l],content:i.slice(0,n)},S(s),w(),await new Promise(o=>setTimeout(o,a))}},Rt=async t=>{const e=String(t||"").trim();if(!e)return;W&&clearInterval(W),W=null;const i=Date.now();if(s=_(),Tt(e)){s.push({role:"user",content:e,ts:i}),s.push({role:"assistant",content:"تمام! لفّ العجلة وخلي الحظ يختار لك.",ts:i+1}),S(s),w(),g&&(g.value=""),await gt({userText:e});return}s.push({role:"user",content:e,ts:i});const n="loading_"+i;s.push({role:"assistant",content:"...",ts:i+1,_id:n}),S(s),w(),g&&(g.value=""),H&&(H.disabled=!0),g&&(g.disabled=!0);let r=null;try{const a=["·","··","···"];let l=0;r=setInterval(()=>{s=_();const x=s.findIndex(R=>R&&R._id===n);x<0||(s[x]={...s[x],content:a[l%a.length]},l+=1,S(s),w())},350);const o=(typeof at=="function"?at():{})||{},p=qt(s.filter(x=>!(x&&x._id===n)&&!/^[.·]+$/.test(String(x?.content??"").trim())&&!/^حدث خطأ في الاتصال\./.test(String(x?.content??"").trim()))),f={slug:X,restaurant_id:k,restaurant_name:$t,category_id:o.categoryId??null,category_name:o.categoryName??"",conversation_state:Ct(),messages:p},{data:u,error:y}=await E.functions.invoke("menu-ai-assistant",{body:f});if(y)throw y;const d=String(u?.reply||"").trim()||"عذراً، لم أتمكن من الرد حالياً.",v=u&&typeof u=="object"?u.suggestion??null:null,P=u&&typeof u=="object"?u.conversation_state??null:null;P&&typeof P=="object"&&ft(P),s=_();const O=s.findIndex(x=>x&&x._id===n);O>=0?s[O]={role:"assistant",content:"",ts:Date.now(),_id:n,suggestion:v}:s.push({role:"assistant",content:"",ts:Date.now(),_id:n,suggestion:v}),S(s),w(),await Ot({messageId:n,fullText:d})}catch(a){console.error(a),s=_();const l=s.findIndex(p=>p&&p._id===n),o="حدث خطأ في الاتصال. يرجى المحاولة لاحقاً.";l>=0?s[l]={role:"assistant",content:o,ts:Date.now()}:s.push({role:"assistant",content:o,ts:Date.now()}),S(s),w()}finally{r&&clearInterval(r),H&&(H.disabled=!1),g&&(g.disabled=!1),g?.focus()}},Ut=async()=>{try{const{data:t}=await E.from("products").select("id,name,price,image_url").eq("restaurant_id",k).eq("available",!0).limit(40);return(Array.isArray(t)?t:[]).map(n=>({id:String(n?.id||"").trim(),name:String(n?.name||"").trim(),price:n?.price??null,img:n?.image_url??null})).filter(n=>n.id&&n.name)}catch{return[]}},Yt=async()=>{const t=Date.now();s=_(),s.push({role:"user",content:"اختارلي (على الحظ)",ts:t}),s.push({role:"assistant",content:"تمام! لفّ العجلة وخلي الحظ يختار لك.",ts:t+1}),S(s),w(),g&&(g.value=""),await gt({userText:"اختارلي (على الحظ)"})};V?.addEventListener("click",()=>{Yt()}),Bt?.addEventListener("submit",t=>{t.preventDefault(),Rt(g?.value||"")})}export{Zt as mountMenuAiAssistant};
