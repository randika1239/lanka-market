# Lanka Market — සිංහලෙන් ස්ථාපන උපදෙස්

මෙම folder එකේ website එකේ front-end code, Supabase database schema සහ instructions තිබෙනවා.

## මේ version එකේ දැනට තියෙන දේ
- Sinhala / English language toggle
- Mobile සහ PC වලට ගැළපෙන responsive layout
- Search, category, price සහ location filters
- Supabase email/password registration සහ login
- Logged-in users ලාට listing පළ කිරීම
- Product photo upload (Supabase Storage, 5 MB උපරිම)
- Listings database එකේ save වීම
- Seller phone / WhatsApp contact links
- User ට තමන්ගේ listing එක delete කිරීම
- Database row-level security policies

**සැබෑ account/database වැඩ කරන්න නම් Supabase project එකක් සාදා පහත setup එක සම්පූර්ණ කරන්න ඕන.** Placeholder keys තියෙන නිසා setup නොකර website එක open කළොත් live features ක්‍රියා කරන්නේ නැහැ. Online payment ඇතුළත් කර නැහැ.

## 1. ZIP එක extract කරන්න
1. `lanka-market.zip` file එක download කරන්න.
2. File එක මත right-click කර **Extract All** තෝරන්න.
3. `lanka_market` folder එක ඇතුළේ `index.html`, `styles.css`, `app.js`, `supabase-schema.sql` සහ මේ README එක තියෙනවා.

## 2. Supabase database සහ login setup කරන්න
1. Browser එකෙන් https://supabase.com/ වෙත ගොස් account එකක් සාදා **New project** ඔබන්න.
2. Project name එක `lanka-market` දාන්න. Database password එක ආරක්ෂිතව සුරකින්න. Region එක ඔබට ආසන්න එකක් තෝරන්න.
3. Project එක ready වූ පසු **SQL Editor → New query** යන්න.
4. මේ folder එකේ `supabase-schema.sql` ගොනුව Notepad එකෙන් open කර සම්පූර්ණ code එක copy කරන්න.
5. SQL Editor එකට paste කර **Run** ඔබන්න. Success වුණාද බලන්න. මේක listings table, access policies සහ product photos bucket එක සාදනවා.
6. Supabase dashboard එකේ **Project Settings → API** (නව dashboard එකක Connect/API Keys) වෙත යන්න.
7. Project URL එක සහ **publishable key** හෝ legacy **anon public key** copy කරන්න. `service_role` / `secret` key කිසිවිටෙක browser code එකට දාන්න එපා.

## 3. Website එක Supabase එකට සම්බන්ධ කරන්න
1. `app.js` ගොනුව Notepad හෝ VS Code වලින් open කරන්න.
2. මුල් lines වල මේ placeholders දෙක හොයන්න:

   `PASTE_YOUR_SUPABASE_PROJECT_URL_HERE`

   `PASTE_YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY_HERE`

3. URL placeholder එක වෙනුවට Supabase project URL එක දාන්න; key placeholder එක වෙනුවට public publishable/anon key එක දාන්න. Quotes (`" "`) මකන්න එපා.
4. Save කරන්න.

උදාහරණයක් (මෙය සැබෑ key එකක් නොවේ):

```js
const SUPABASE_URL = "https://your-project-id.supabase.co";
const SUPABASE_ANON_KEY = "your-public-publishable-key";
```

**වැදගත්:** `service_role` key එක client-side code එකට දැමීමෙන් database එක අනාරක්ෂිත විය හැක. එය භාවිතා කරන්න එපා.

## 4. Local computer එකේ website එක run කරන්න
ES module import එක නිසා `index.html` එක double-click කරනවාට වඩා local web server එකක් භාවිතා කරන්න.

**Option A — Python තිබේ නම්**
1. `lanka_market` folder එක open කරන්න.
2. Folder address bar එක click කර `cmd` type කර Enter ඔබන්න.
3. Command Prompt එකේ:

   `py -m http.server 8000`

4. Browser එකේ `http://localhost:8000` open කරන්න.
5. Stop කිරීමට Command Prompt එකට ගොස් `Ctrl + C` ඔබන්න.

**Option B — VS Code**
- VS Code install කර folder එක open කරන්න.
- Live Server extension එක install කර `index.html` මත right-click → **Open with Live Server** තෝරන්න.

## 5. Email confirmation setup
- Supabase Dashboard → Authentication → URL Configuration හි local testing සඳහා `http://localhost:8000` site URL / redirect URL ලෙස configure කරන්න.
- Authentication → Providers → Email settings හි email confirmation setting එක බලන්න.
- Confirmation on නම් registration කළ පසු email inbox එකෙන් confirm කළ යුතුයි. Production deploy කළ විට deployed domain එකත් redirect URL allow-list එකට add කරන්න.

## 6. Website එක නොමිලේ online publish කිරීම
Static frontend එකක් නිසා Netlify හෝ Cloudflare Pages වැනි static hosting එකකට publish කරන්න පුළුවන්.

### Netlify Drop (සරල ක්‍රමයක්)
1. `app.js` එකේ Supabase URL සහ public key දාලා save කර ඇති බව තහවුරු කරන්න.
2. https://app.netlify.com/drop වෙත යන්න (account/login අවශ්‍ය විය හැක).
3. `index.html`, `styles.css`, `app.js` සහ වෙනත් project files තියෙන **folder එකේ contents** upload/drop කරන්න.
4. Netlify දෙන `https://...netlify.app` link එක open කර test කරන්න.
5. Supabase → Authentication → URL Configuration වෙත ගොස් ඔබේ Netlify URL එක Site URL සහ Redirect URLs වලට add කරන්න.

Public browser key එක website source එකෙන් දැකිය හැකි බව සාමාන්‍යයි; ආරක්ෂාව enforce කරන්නේ database RLS policies වලින්. ඒ නිසා SQL schema එක run කර තිබීම අත්‍යවශ්‍යයි.

## 7. Test checklist
1. Website එක open කරන්න.
2. **Create account** හරහා test email/password එකකින් account එකක් හදන්න.
3. Email confirmation enabled නම් email confirm කරන්න.
4. Log in කරන්න.
5. **Sell an item** තෝරා test product එකක් photo එකක් සමඟ publish කරන්න.
6. Page refresh කරත් listing එක පෙනෙනවාද බලන්න.
7. වෙනත් browser/incognito window එකක listing එක පෙනෙනවාද බලන්න.
8. Phone/WhatsApp buttons පරීක්ෂා කරන්න. සැබෑ seller phone number එක නිවැරදි බව තහවුරු කරන්න.
9. තමන්ගේ account එකෙන් logout කර login කළ හැකිද බලන්න.

## සීමාවන් සහ ආරක්ෂාව
- Online payments / checkout නැහැ. Buyer සහ seller සෘජුව සම්බන්ධ වෙනවා.
- Admin dashboard සහ automated scam moderation තවම ඇතුළත් නැහැ.
- Email/password auth සහ listings DB Supabase project එක සකසා පමණක් ක්‍රියා කරයි.
- Public listings සහ photo bucket එක public; පළ කරන photos සහ contact numbers මහජනයාට පෙනේ. වෙනත් අයගේ පුද්ගලික තොරතුරු පළ නොකරන්න.
- Production launch එකට පෙර spam prevention, report listing, admin moderation, privacy policy, terms, rate limits සහ backup සැලසුම් එක් කරන්න.
- මේ demo එක seller contact phone/WhatsApp සත්‍යදැයි තහවුරු නොකරයි. ගනුදෙනු කිරීමට පෙර භාණ්ඩය හා seller පරීක්ෂා කරන්න.

## Troubleshooting
- `Setup needed` පණිවිඩය: `app.js` URL/key placeholders නිවැරදිව replace කර save කරන්න.
- `Invalid API key`: Project URL සහ public key එකම Supabase project එකෙන්ද බලන්න.
- `relation listings does not exist`: SQL Editor එකේ `supabase-schema.sql` නැවත run කර error එක බලන්න.
- `row-level security` error: SQL policies සම්පූර්ණයෙන් run වූවාද බලන්න; client code එකෙන් RLS off කරන්න එපා.
- Image upload error: SQL storage policies run වී තිබේද, login වී තිබේද, image එක 5 MB ට අඩුද බලන්න.
- Login works but can't publish: user session එක active ද, email confirmation අවශ්‍යද බලන්න.
