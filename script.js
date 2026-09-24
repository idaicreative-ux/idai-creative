const loader=document.querySelector('.loader');
if(loader){document.body.classList.add('loading');window.addEventListener('load',()=>{setTimeout(()=>{loader.classList.add('hidden');document.body.classList.remove('loading')},1650)})}
const header=document.querySelector('.site-header');
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>40),{passive:true});
const toggle=document.querySelector('.menu-toggle');
if(toggle)toggle.addEventListener('click',()=>{const open=header.classList.toggle('menu-open');toggle.setAttribute('aria-expanded',String(open))});
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>header.classList.remove('menu-open')));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelectorAll('.flow-step').forEach(step=>step.addEventListener('click',()=>{document.querySelectorAll('.flow-step').forEach(s=>s.classList.remove('active'));step.classList.add('active')}));
let lang='pt';
const langButton=document.querySelector('.lang-switch');
if(langButton)langButton.addEventListener('click',()=>{lang=lang==='pt'?'en':'pt';document.documentElement.lang=lang==='pt'?'pt-AO':'en';document.querySelectorAll('[data-pt][data-en]').forEach(el=>el.innerHTML=el.dataset[lang]);langButton.innerHTML=lang==='pt'?'<span>PT</span> / EN':'PT / <span>EN</span>'});
document.getElementById('year').textContent=new Date().getFullYear();
