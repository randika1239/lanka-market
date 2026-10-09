import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 1) Create a Supabase project, then replace these two placeholder values.
// Never put a service_role key here. Only use the project's public anon/publishable key.


const SUPABASE_URL = "https://umsufnmxxyzplagciaqn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_IvqH9HTV1fFPsSpYlWZrjw_kc2uRzWO";

const CONFIGURED =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("PASTE_") &&
  !SUPABASE_ANON_KEY.includes("PASTE_");

const $ = (id) => document.getElementById(id);
const state = { supabase: null, user: null, listings: [], authMode: "login", language: "en" };
const translations = {
  en: {
    login:"Log in", register:"Create account", logout:"Log out", sellNow:"＋ Sell an item", eyebrow:"SRI LANKA'S COMMUNITY MARKETPLACE",
    headline:"Find it. Love it.<br><em>Make it yours.</em>", subheadline:"Discover great deals near you, or give your pre-loved items a new home.",
    easyContact:"Contact sellers directly", localDeals:"Local deals", searchPlaceholder:"What are you looking for?", search:"Search", category:"Category",
    allCategories:"All categories", maxPrice:"Maximum price (LKR)", district:"District / city", clear:"Clear filters", marketplace:"THE MARKETPLACE",
    latestListings:"Latest listings", noListings:"No listings found", tryFilters:"Try another search, or check back soon.",
    gotSomething:"GOT SOMETHING TO SELL?", turnClutter:"Turn clutter into cash.", sellDescription:"Post your item and connect with interested buyers directly.",
    startSelling:"Start selling →", footerText:"A community marketplace for Sri Lanka. Buy and sell responsibly.",
    welcomeBack:"Welcome back", authIntro:"Log in or create an account to publish your listing.", email:"Email address", password:"Password",
    authPrivacy:"Your password is handled securely by Supabase Authentication; it is not stored in this website's code.",
    newListing:"NEW LISTING", postItem:"Post an item", listingIntro:"Share clear details so buyers know what you're offering.",
    itemTitle:"Item title", itemCategory:"Category", priceLkr:"Price (LKR)", description:"Description", city:"District / city", phone:"Phone number",
    whatsapp:"WhatsApp number (optional)", productPhoto:"Product photo (optional, max 5 MB)", publishListing:"Publish listing",
    contact:"Call seller", whatsappBtn:"WhatsApp", postedBy:"Seller", confirmDelete:"Delete this listing?", myListing:"Your listing",
    loading:"Loading listings…", liveCount:"listing(s)", setup:"Setup needed: add your Supabase URL and public anon/publishable key to app.js, then follow README_SI.md.",
    setupAuth:"Supabase is not configured yet. Follow README_SI.md.", loginRequired:"Please log in first to publish a listing.",
    noImage:"No photo", price:"Price", posted:"Listing published successfully.", deleted:"Listing deleted.", loginSuccess:"Logged in successfully.",
    registerSuccess:"Account created. If email confirmation is enabled, check your email to confirm before logging in.",
    logoutSuccess:"You have logged out.", invalidPhone:"Enter a valid Sri Lankan or international phone number.",
    imageTooLarge:"The image must be 5 MB or smaller.", required:"Please fill in all required fields.",
    error:"Something went wrong: ", emptySearch:"No listings match these filters.", signInFirst:"Please log in to continue.",
    photoUploadError:"Image upload failed: ", listingSaveError:"Could not save listing: ", authError:"Authentication error: ",
    chooseCategory:"Choose category", anyPrice:"Any price", pricePrefix:"LKR", location:"Location",
    ownListing:"Your post", delete:"Delete", authTitleLogin:"Welcome back", authTitleRegister:"Create your account",
    emailConfirmation:"Check your inbox for a confirmation link if required by your project settings."
  },
  si: {
    login:"පිවිසෙන්න", register:"ගිණුමක් සාදන්න", logout:"ඉවත් වන්න", sellNow:"＋ භාණ්ඩයක් විකුණන්න", eyebrow:"ශ්‍රී ලංකාවේ ප්‍රජා වෙළඳපොළ",
    headline:"සොයන්න. කැමති වෙන්න.<br><em>ඔබේ කරගන්න.</em>", subheadline:"ඔබ අසල හොඳ මිල ගණන් සොයන්න, නැත්නම් ඔබේ භාවිත කළ භාණ්ඩ අලුත් හිමිකරුවෙකුට දෙන්න.",
    easyContact:"විකුණුම්කරුවන් අමතන්න", localDeals:"අසල ගනුදෙනු", searchPlaceholder:"ඔබ සොයන්නේ කුමක්ද?", search:"සොයන්න", category:"වර්ගය",
    allCategories:"සියලුම වර්ග", maxPrice:"උපරිම මිල (රු.)", district:"දිස්ත්‍රික්කය / නගරය", clear:"සෙවුම මකන්න", marketplace:"වෙළඳපොළ",
    latestListings:"අලුත්ම දැන්වීම්", noListings:"දැන්වීම් හමු වුණේ නැහැ", tryFilters:"වෙනත් සෙවුමක් උත්සාහ කරන්න.",
    gotSomething:"විකුණන්න භාණ්ඩයක් තියෙනවාද?", turnClutter:"භාණ්ඩයෙන් මුදල් උපයන්න.", sellDescription:"ඔබේ භාණ්ඩය පළ කර කැමති ගැනුම්කරුවන් සමඟ සම්බන්ධ වන්න.",
    startSelling:"විකිණීම අරඹන්න →", footerText:"ශ්‍රී ලංකාව සඳහා ප්‍රජා වෙළඳපොළක්. වගකීමෙන් මිලදී ගන්න සහ විකුණන්න.",
    welcomeBack:"නැවත සාදරයෙන් පිළිගනිමු", authIntro:"දැන්වීමක් පළ කිරීමට පිවිසෙන්න හෝ ගිණුමක් සාදන්න.", email:"විද්‍යුත් තැපෑල", password:"මුරපදය",
    authPrivacy:"ඔබේ මුරපදය Supabase Authentication මඟින් ආරක්ෂිතව හසුරුවයි; එය වෙබ් අඩවියේ කේතයේ ගබඩා නොවේ.",
    newListing:"අලුත් දැන්වීම", postItem:"භාණ්ඩයක් පළ කරන්න", listingIntro:"ගැනුම්කරුවන්ට පැහැදිලි විස්තර ලබා දෙන්න.",
    itemTitle:"භාණ්ඩයේ නම", itemCategory:"වර්ගය", priceLkr:"මිල (රු.)", description:"විස්තරය", city:"දිස්ත්‍රික්කය / නගරය", phone:"දුරකථන අංකය",
    whatsapp:"WhatsApp අංකය (අත්‍යවශ්‍ය නැහැ)", productPhoto:"භාණ්ඩයේ ඡායාරූපය (අත්‍යවශ්‍ය නැහැ, උපරිම 5 MB)", publishListing:"දැන්වීම පළ කරන්න",
    contact:"විකුණුම්කරු අමතන්න", whatsappBtn:"WhatsApp", postedBy:"විකුණුම්කරු", confirmDelete:"මෙම දැන්වීම මකන්නද?", myListing:"ඔබේ දැන්වීම",
    loading:"දැන්වීම් ලබාගනිමින්…", liveCount:"දැන්වීම්", setup:"මුලින් app.js ගොනුවට Supabase URL සහ public anon/publishable key දමා README_SI.md උපදෙස් අනුගමනය කරන්න.",
    setupAuth:"Supabase තවම සකසා නැහැ. README_SI.md බලන්න.", loginRequired:"දැන්වීමක් පළ කිරීමට පළමුව පිවිසෙන්න.",
    noImage:"ඡායාරූපයක් නැහැ", price:"මිල", posted:"දැන්වීම සාර්ථකව පළ කළා.", deleted:"දැන්වීම මැකුවා.", loginSuccess:"සාර්ථකව පිවිසුණා.",
    registerSuccess:"ගිණුම සෑදුවා. Email තහවුරු කිරීම අවශ්‍ය නම් inbox එක බලන්න.", logoutSuccess:"ඔබ ඉවත් වුණා.",
    invalidPhone:"වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න.", imageTooLarge:"ඡායාරූපය 5 MB හෝ ඊට අඩු විය යුතුයි.", required:"අවශ්‍ය සියලු තොරතුරු පුරවන්න.",
    error:"දෝෂයක් ඇති වුණා: ", emptySearch:"මෙම පෙරහන්වලට ගැළපෙන දැන්වීම් නැහැ.", signInFirst:"කරුණාකර පළමුව පිවිසෙන්න.",
    photoUploadError:"ඡායාරූපය upload කිරීමට නොහැකි වුණා: ", listingSaveError:"දැන්වීම save කිරීමට නොහැකි වුණා: ", authError:"ගිණුම් දෝෂය: ",
    chooseCategory:"වර්ගය තෝරන්න", anyPrice:"ඕනෑම මිලක්", pricePrefix:"රු.", location:"ස්ථානය",
    ownListing:"ඔබේ දැන්වීම", delete:"මකන්න", authTitleLogin:"නැවත සාදරයෙන් පිළිගනිමු", authTitleRegister:"ගිණුමක් සාදන්න",
    emailConfirmation:"අවශ්‍ය නම් තහවුරු කිරීමේ link එක සඳහා ඔබේ email inbox එක බලන්න."
  }
};
const t = (key) => translations[state.language][key] || translations.en[key] || key;
function feedback(id, message, success=false) { const el=$(id); el.textContent=message||""; el.classList.toggle("success",!!success); }
function setStatus(message="") { $("statusMessage").textContent=message; }
function phoneForLink(value) { return String(value||"").replace(/[^\d+]/g,"").replace(/^00/,"+"); }
function validPhone(value) { return /^\+?\d{8,15}$/.test(phoneForLink(value).replace(/^\+/,"")) || /^\d{8,15}$/.test(phoneForLink(value)); }
function money(value) { return `${t("pricePrefix")} ${Number(value||0).toLocaleString("en-LK")}`; }
function safeText(value) { return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function showModal(id) { $(id).classList.remove("hidden"); document.body.style.overflow="hidden"; }
function closeModal(id) { $(id).classList.add("hidden"); if($("authModal").classList.contains("hidden")&&$("sellModal").classList.contains("hidden")) document.body.style.overflow=""; }
function openAuth(mode="login") { if(!CONFIGURED){alert(t("setupAuth"));return;} setAuthMode(mode); showModal("authModal"); }
function setAuthMode(mode) { state.authMode=mode; $("loginTab").classList.toggle("active",mode==="login"); $("registerTab").classList.toggle("active",mode==="register"); $("authTitle").textContent=t(mode==="login"?"authTitleLogin":"authTitleRegister"); $("authSubmit").textContent=t(mode); $("authPassword").autocomplete=mode==="login"?"current-password":"new-password"; feedback("authFeedback",""); }
function updateAccountUI() { $("loginOpen").classList.toggle("hidden",!!state.user); $("logoutBtn").classList.toggle("hidden",!state.user); $("sellOpen").textContent=state.user?(state.language==="si"?"＋ දැන්වීමක් පළ කරන්න":"＋ Post an item"):t("sellNow"); }
function renderLanguage() {
  document.documentElement.lang=state.language==="si"?"si":"en";
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key=el.dataset.i18n, value=translations[state.language][key];
    if(!value) return;
    // Labels contain real input controls: translate only their leading text node,
    // otherwise replacing innerHTML would remove the form fields.
    if(el.matches("label") && el.querySelector("input,select,textarea")) {
      const firstText = Array.from(el.childNodes).find(node=>node.nodeType===Node.TEXT_NODE);
      if(firstText) firstText.nodeValue = value + " ";
    } else {
      el.innerHTML = value;
    }
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{el.placeholder=t(el.dataset.i18nPlaceholder);});
  $("langToggle").textContent=state.language==="en"?"සිංහල":"English";
  $("authTitle").textContent=t(state.authMode==="login"?"authTitleLogin":"authTitleRegister");
  $("authSubmit").textContent=t(state.authMode);
  $("year").textContent=new Date().getFullYear(); updateAccountUI(); renderListings();
}
function filteredListings() {
  const q=$("searchInput").value.trim().toLocaleLowerCase();
  const cat=$("categoryFilter").value;
  const max=$("maxPrice").value?Number($("maxPrice").value):Infinity;
  const loc=$("locationFilter").value.trim().toLocaleLowerCase();
  return state.listings.filter(item=>{
    const hay=[item.title,item.description,item.category,item.location].join(" ").toLocaleLowerCase();
    return (!q||hay.includes(q))&&(!cat||item.category===cat)&&Number(item.price)<=max&&(!loc||String(item.location||"").toLocaleLowerCase().includes(loc));
  });
}
const categoryEmoji = {"Electronics":"🎧","Vehicles":"🚗","Property":"🏠","Fashion":"👟","Home & Garden":"🪴","Sports":"⚽","Other":"📦"};
function renderListings() {
  const items=filteredListings(); $("listingCount").textContent=`${items.length} ${t("liveCount")}`;
  $("emptyState").classList.toggle("hidden",items.length!==0);
  $("listingsGrid").innerHTML=items.map(item=>{
    const owner=state.user&&state.user.id===item.user_id;
    const image=item.image_url?`<img src="${safeText(item.image_url)}" alt="${safeText(item.title)}" loading="lazy">`:`<span class="placeholder">${categoryEmoji[item.category]||"📦"}</span>`;
    const phone=phoneForLink(item.phone); const wa=phoneForLink(item.whatsapp||item.phone).replace(/^\+/,"").replace(/^0/,"94");
    const desc=safeText(item.description).replace(/\n/g," ");
    return `<article class="listing-card"><div class="product-image">${image}<span class="category-chip">${safeText(item.category)}</span></div><div class="listing-info"><h3>${safeText(item.title)}</h3><div class="price">${money(item.price)}</div><div class="listing-location">⌖ ${safeText(item.location)}</div><p class="listing-desc">${desc}</p><div class="card-actions"><a class="btn btn-primary" href="tel:${safeText(phone)}">${t("contact")}</a><a class="btn btn-outline" href="https://wa.me/${safeText(wa)}" target="_blank" rel="noopener noreferrer">${t("whatsappBtn")}</a></div>${owner?`<button class="delete-listing" data-delete="${safeText(item.id)}">${t("delete")}</button>`:""}</div></article>`;
  }).join("");
}
async function loadListings() {
  if(!CONFIGURED){setStatus(t("setup"));$("listingCount").textContent="—";$("emptyState").classList.remove("hidden");return;}
  setStatus(t("loading"));
  const {data,error}=await state.supabase.from("listings").select("*").eq("status","active").order("created_at",{ascending:false}).limit(100);
  if(error){setStatus(t("error")+error.message);return;}
  state.listings=data||[]; setStatus(""); renderListings();
}
async function refreshUser() {
  if(!CONFIGURED)return;
  const {data}=await state.supabase.auth.getSession(); state.user=data.session?.user||null; updateAccountUI();
  state.supabase.auth.onAuthStateChange((_event,session)=>{state.user=session?.user||null;updateAccountUI();renderListings();});
}
async function handleAuth(e) {
  e.preventDefault(); if(!CONFIGURED)return;
  const email=$("authEmail").value.trim(), password=$("authPassword").value;
  $("authSubmit").disabled=true; feedback("authFeedback","");
  try {
    if(state.authMode==="register"){
      const {data,error}=await state.supabase.auth.signUp({email,password});
      if(error)throw error;
      if(data.session){state.user=data.user;closeModal("authModal");updateAccountUI();feedback("authFeedback",t("registerSuccess"),true);}
      else feedback("authFeedback",t("registerSuccess"),true);
    } else {
      const {data,error}=await state.supabase.auth.signInWithPassword({email,password}); if(error)throw error;
      state.user=data.user;closeModal("authModal");updateAccountUI();await loadListings();
    }
  } catch(err){feedback("authFeedback",t("authError")+err.message);}
  finally{$("authSubmit").disabled=false;}
}
async function handlePublish(e) {
  e.preventDefault(); if(!state.user){closeModal("sellModal");openAuth("login");return;}
  const title=$("itemTitle").value.trim(),category=$("itemCategory").value,price=Number($("itemPrice").value),description=$("itemDescription").value.trim(),location=$("itemLocation").value.trim(),phone=$("itemPhone").value.trim(),whatsapp=$("itemWhatsapp").value.trim();
  if(!title||!category||!Number.isFinite(price)||price<0||!description||!location||!phone){feedback("listingFeedback",t("required"));return;}
  if(!validPhone(phone)||(whatsapp&&!validPhone(whatsapp))){feedback("listingFeedback",t("invalidPhone"));return;}
  const file=$("itemImage").files[0];if(file&&file.size>5*1024*1024){feedback("listingFeedback",t("imageTooLarge"));return;}
  $("publishBtn").disabled=true;feedback("listingFeedback","");
  try{
    let image_url=null;
    if(file){
      if(!["image/jpeg","image/png","image/webp"].includes(file.type))throw new Error("Use JPG, PNG, or WebP image.");
      const ext=file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg";
      const path=`${state.user.id}/${crypto.randomUUID()}.${ext}`;
      const {error:uploadError}=await state.supabase.storage.from("listing-images").upload(path,file,{cacheControl:"3600",upsert:false,contentType:file.type});
      if(uploadError)throw new Error(t("photoUploadError")+uploadError.message);
      const {data:urlData}=state.supabase.storage.from("listing-images").getPublicUrl(path);image_url=urlData.publicUrl;
    }
    const {error}=await state.supabase.from("listings").insert({user_id:state.user.id,title,category,price,description,location,phone,whatsapp:whatsapp||null,image_url,status:"active"});
    if(error)throw new Error(t("listingSaveError")+error.message);
    $("listingForm").reset();closeModal("sellModal");await loadListings();setStatus(t("posted"));window.scrollTo({top:$("listingsGrid").getBoundingClientRect().top+window.scrollY-100,behavior:"smooth"});
  }catch(err){feedback("listingFeedback",t("error")+err.message);}
  finally{$("publishBtn").disabled=false;}
}
async function deleteListing(id) {
  if(!confirm(t("confirmDelete")))return;
  const {error}=await state.supabase.from("listings").delete().eq("id",id);
  if(error){setStatus(t("error")+error.message);return;}
  state.listings=state.listings.filter(x=>String(x.id)!==String(id));renderListings();setStatus(t("deleted"));
}
function wireEvents(){
  $("langToggle").addEventListener("click",()=>{state.language=state.language==="en"?"si":"en";renderLanguage();});
  $("loginOpen").addEventListener("click",()=>openAuth("login"));
  $("sellOpen").addEventListener("click",()=>state.user?showModal("sellModal"):openAuth("login"));
  $("sellBannerBtn").addEventListener("click",()=>state.user?showModal("sellModal"):openAuth("login"));
  $("loginTab").addEventListener("click",()=>setAuthMode("login"));$("registerTab").addEventListener("click",()=>setAuthMode("register"));
  document.querySelectorAll("[data-close]").forEach(el=>el.addEventListener("click",()=>closeModal(el.dataset.close==="auth"?"authModal":"sellModal")));
  $("authForm").addEventListener("submit",handleAuth);$("listingForm").addEventListener("submit",handlePublish);
  $("logoutBtn").addEventListener("click",async()=>{if(!CONFIGURED)return;const {error}=await state.supabase.auth.signOut();if(error){setStatus(t("error")+error.message);return;}state.user=null;updateAccountUI();setStatus(t("logoutSuccess"));});
  ["searchInput","categoryFilter","maxPrice","locationFilter"].forEach(id=>$(id).addEventListener(id==="searchInput"?"input":"change",renderListings));
  $("searchBtn").addEventListener("click",renderListings);$("clearFilters").addEventListener("click",()=>{$("searchInput").value="";$("categoryFilter").value="";$("maxPrice").value="";$("locationFilter").value="";renderListings();});
  $("listingsGrid").addEventListener("click",e=>{const btn=e.target.closest("[data-delete]");if(btn)deleteListing(btn.dataset.delete);});
}
wireEvents();renderLanguage();
if(CONFIGURED){state.supabase=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);await refreshUser();await loadListings();}
else {state.listings=[];renderListings();setStatus(t("setup"));}
