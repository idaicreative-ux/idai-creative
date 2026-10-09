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

const investmentConfig=window.IDAI_CONFIG&&window.IDAI_CONFIG.investment;
const investmentTracker=document.querySelector('[data-investment-tracker]');
if(investmentConfig&&investmentTracker){
  const target=Math.max(1,Number(investmentConfig.target)||25000000);
  const raised=Math.min(target,Math.max(0,Number(investmentConfig.raised)||0));
  const supporters=Math.max(0,Number(investmentConfig.supporters)||0);
  const percent=Math.min(100,(raised/target)*100);
  const formatKz=value=>new Intl.NumberFormat('pt-AO',{maximumFractionDigits:0}).format(value)+' Kz';
  const raisedEl=document.getElementById('investmentRaised');
  const targetEl=document.getElementById('investmentTarget');
  const remainingEl=document.getElementById('investmentRemaining');
  const percentEl=document.getElementById('investmentPercent');
  const supportersEl=document.getElementById('investmentSupporters');
  const updatedEl=document.getElementById('investmentUpdated');
  const bar=document.getElementById('investmentBar');
  const progress=investmentTracker.querySelector('[role="progressbar"]');
  targetEl.textContent=formatKz(target);
  remainingEl.textContent=formatKz(target-raised);
  percentEl.textContent=percent.toLocaleString('pt-AO',{maximumFractionDigits:1})+'%';
  supportersEl.textContent=supporters.toLocaleString('pt-AO');
  progress.setAttribute('aria-valuemax',String(target));
  progress.setAttribute('aria-valuenow',String(raised));
  const date=new Date(investmentConfig.updatedAt+'T12:00:00');
  if(!Number.isNaN(date.getTime()))updatedEl.textContent=new Intl.DateTimeFormat('pt-AO',{day:'2-digit',month:'short',year:'numeric'}).format(date).toUpperCase();
  let current=0;
  const duration=1200,start=performance.now();
  const animate=now=>{const t=Math.min(1,(now-start)/duration),ease=1-Math.pow(1-t,3);current=Math.round(raised*ease);raisedEl.textContent=formatKz(current);bar.style.width=(percent*ease)+'%';if(t<1)requestAnimationFrame(animate)};
  requestAnimationFrame(animate);
}
