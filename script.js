// 搜尋過濾
const searchInput = document.getElementById('search');
const cards = Array.from(document.querySelectorAll('.card'));

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  cards.forEach(card => {
    const key = card.dataset.command;
    const text = card.innerText.toLowerCase();
    const show = key.includes(q) || text.includes(q);
    card.classList.toggle('hidden', !show);
  });
});

// 複製指令
document.querySelectorAll('.card .btn.copy').forEach(btn => {
  btn.addEventListener('click', async () => {
    const pre = btn.previousElementSibling;
    const code = pre?.innerText ?? '';
    try {
      await navigator.clipboard.writeText(code);
      flash(btn.closest('.card'));
      btn.textContent = '已複製 ✅';
      setTimeout(() => (btn.textContent = '複製'), 1200);
    } catch {
      alert('複製失敗，請手動選取複製。');
    }
  });
});

function flash(card) {
  card.classList.add('highlight');
  setTimeout(() => card.classList.remove('highlight'), 800);
}

// 一鍵下載語法（打包 HTML/CSS/JS）
document.getElementById('downloadZip').addEventListener('click', async () => {
  const zip = new JSZip();

  // 取得目前文件的三個檔案字串
  const indexHtml = await fetchFileAsText('index.html');
  const stylesCss = await fetchFileAsText('styles.css');
  const scriptJs = await fetchFileAsText('script.js');

  // 若直接在本地打開 index.html，fetch 同源檔案可能失敗
  // 改為直接從 DOM/鏈結提供備份內容
  const fallbackIndex = document.documentElement.outerHTML;
  const fallbackStyles = getEmbeddedFile('styles.css');
  const fallbackScript = getEmbeddedFile('script.js');

  zip.file('index.html', indexHtml || fallbackIndex);
  zip.file('styles.css', stylesCss || fallbackStyles);
  zip.file('script.js', scriptJs || fallbackScript);

  const blob = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'git-cute-site.zip';
  a.click();
  URL.revokeObjectURL(a.href);
});

// 嘗試抓檔案文字
async function fetchFileAsText(path) {
  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) return '';
    return await res.text();
  } catch {
    return '';
  }
}

// 內嵌備份：把關鍵檔案內容作為字串提供（供無法 fetch 時使用）
function getEmbeddedFile(name) {
  const files = {
    'styles.css': `
:root{--bg:#f9fafb;--card:#ffffff;--text:#1f2937;--muted:#6b7280;--primary:#a78bfa;--primary-2:#fbcfe8;--accent:#86efac;--shadow:0 10px 25px rgba(0,0,0,0.08);--radius:18px}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:linear-gradient(135deg,#f8fafc,#fdf2f8 40%,#eef2ff);color:var(--text);font-family:ui-sans-serif,-apple-system,"Segoe UI","Noto Sans TC","PingFang TC","Microsoft JhengHei",Arial,sans-serif}
.site-header{display:flex;justify-content:space-between;align-items:center;padding:24px 24px;position:sticky;top:0;backdrop-filter:blur(8px);background:rgba(255,255,255,0.6);border-bottom:1px solid rgba(0,0,0,0.05)}
.brand{display:flex;align-items:center;gap:12px}
.brand .logo{font-size:28px}
.brand h1{margin:0;font-size:22px;letter-spacing:.5px}
.brand .tagline{color:var(--muted);font-size:14px}
.actions{display:flex;gap:12px}
#search{padding:10px 12px;border:1.5px solid #e5e7eb;border-radius:999px;width:240px;outline:none;background:#fff}
#search:focus{border-color:var(--primary);box-shadow:0 0 0 4px rgba(167,139,250,0.2)}
.btn{border:none;cursor:pointer;padding:10px 14px;border-radius:14px;transition:transform .08s ease,box-shadow .2s ease,background .2s ease;font-weight:600}
.btn.primary{background:var(--primary);color:#fff;box-shadow:var(--shadow)}
.btn:hover{transform:translateY(-1px)}
.btn:active{transform:translateY(1px)}
.container{max-width:1080px;margin:0 auto;padding:24px}
.hero{display:grid;grid-template-columns:90px 1fr;gap:16px;align-items:center;margin:12px 0 20px}
.mascot{font-size:54px;filter:drop-shadow(0 6px 10px rgba(0,0,0,0.08));animation:float 3.5s ease-in-out infinite}
@keyframes float{0%{transform:translateY(0)}50%{transform:translateY(-4px)}100%{transform:translateY(0)}}
.hero-text h2{margin:0 0 6px;font-size:24px}
.hero-text p{margin:0;color:var(--muted)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;margin-top:18px}
.card{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);padding:16px;position:relative;overflow:hidden;border:2px solid transparent}
.card::after{content:"";position:absolute;inset:0;border-radius:var(--radius);pointer-events:none;background:linear-gradient(180deg,rgba(167,139,250,0.12),transparent 40%)}
.card-head{display:flex;justify-content:space-between;align-items:center}
.card-head h3{margin:0;font-size:18px}
.card .emoji{font-size:22px}
.desc{margin:8px 0 6px;color:var(--muted)}
.tips{margin:8px 0 10px;padding-left:18px}
.tips li{margin:4px 0;color:#374151}
.tips li strong{color:#111827}
.code{background:#0b1020;color:#e5e7eb;padding:12px 14px;border-radius:12px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace;font-size:13px;overflow-x:auto;margin:8px 0 12px;border:1px solid #1f2937}
.card .btn.copy{background:#fff;color:#111827;border:1.5px solid #e5e7eb}
.card .btn.copy:hover{border-color:var(--primary)}
.note{margin:26px 0;background:#fff;border-radius:16px;padding:14px 16px;border:1.5px solid #e5e7eb}
.note h4{margin:0 0 8px}
.site-footer{padding:24px;text-align:center;color:var(--muted)}
.highlight{border-color:var(--accent);box-shadow:0 0 0 4px rgba(134,239,172,0.25);transition:box-shadow .2s ease}
.hidden{display:none !important}
`.trim(),
    'script.js': `
const searchInput=document.getElementById('search');const cards=Array.from(document.querySelectorAll('.card'));searchInput.addEventListener('input',()=>{const q=searchInput.value.trim().toLowerCase();cards.forEach(card=>{const key=card.dataset.command;const text=card.innerText.toLowerCase();const show=key.includes(q)||text.includes(q);card.classList.toggle('hidden',!show);});});document.querySelectorAll('.card .btn.copy').forEach(btn=>{btn.addEventListener('click',async()=>{const pre=btn.previousElementSibling;const code=pre?.innerText??'';try{await navigator.clipboard.writeText(code);flash(btn.closest('.card'));btn.textContent='已複製 ✅';setTimeout(()=>btn.textContent='複製',1200);}catch{alert('複製失敗，請手動選取複製。');}});});function flash(card){card.classList.add('highlight');setTimeout(()=>card.classList.remove('highlight'),800);}document.getElementById('downloadZip').addEventListener('click',async()=>{const zip=new JSZip();const indexHtml=await fetchFileAsText('index.html');const stylesCss=await fetchFileAsText('styles.css');const scriptJs=await fetchFileAsText('script.js');const fallbackIndex=document.documentElement.outerHTML;const fallbackStyles=getEmbeddedFile('styles.css');const fallbackScript=getEmbeddedFile('script.js');zip.file('index.html',indexHtml||fallbackIndex);zip.file('styles.css',stylesCss||fallbackStyles);zip.file('script.js',scriptJs||fallbackScript);const blob=await zip.generateAsync({type:'blob'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='git-cute-site.zip';a.click();URL.revokeObjectURL(a.href);});async function fetchFileAsText(path){try{const res=await fetch(path,{cache:'no-store'});if(!res.ok)return'';return await res.text();}catch{return'';}}function getEmbeddedFile(name){const files={'styles.css':\`${''}\`,'script.js':\`${''}\`};return files[name]||'';}
`.trim()
  };
  return files[name] || '';
}
