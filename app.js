const cfg=window.IDAI_CONFIG||{};
const $=(s,c=document)=>c.querySelector(s);const $$=(s,c=document)=>[...c.querySelectorAll(s)];
window.addEventListener('load',()=>setTimeout(()=>$('.page-loader')?.classList.add('hide'),450));
$('.hamb')?.addEventListener('click',()=>$('.topnav')?.classList.toggle('open'));
$$('[data-instagram]').forEach(a=>a.href=cfg.instagram||'#');
$$('[data-linkedin]').forEach(a=>a.href=cfg.linkedin||'#');
$$('[data-whatsapp]').forEach(a=>a.href=`https://wa.me/${cfg.whatsapp}`);
$$('a[href$=".html"]').forEach(a=>a.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey)return;const l=$('.page-loader');if(l){l.classList.remove('hide');}}));
const year=$('[data-year]');if(year)year.textContent=new Date().getFullYear();

const ACCOUNT_KEY='idaiCompanyAccounts';
const getCompanyAccounts=()=>JSON.parse(localStorage.getItem(ACCOUNT_KEY)||'[]');
const saveCompanyAccounts=accounts=>localStorage.setItem(ACCOUNT_KEY,JSON.stringify(accounts));
const escapeHtml=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
async function passwordHash(value){
  if(window.crypto?.subtle){const bytes=new TextEncoder().encode(value);const digest=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('')}
  return btoa([...new TextEncoder().encode(value)].map(b=>String.fromCharCode(b)).join(''));
}

async function login(){
  const email=$('#email')?.value.trim().toLowerCase(),pass=$('#password')?.value,error=$('#login-error');
  if(error)error.textContent='';
  const demo=cfg.demoAccounts?.[email];
  if(demo&&demo.password===pass){localStorage.setItem('idaiSession',JSON.stringify({...demo,email,companyName:demo.role==='reader'?'Studio Nzoji':'IDAI Creative'}));location.href='portal.html';return}
  const registered=getCompanyAccounts().find(account=>account.email===email);
  if(!registered){if(error)error.textContent='Conta não encontrada. Verifique os dados ou cadastre a sua empresa.';return}
  if(registered.status==='pending'){if(error)error.textContent='O cadastro ainda está aguardando aprovação da IDAI.';return}
  if(registered.status==='rejected'){if(error)error.textContent='Este cadastro precisa de revisão. Entre em contacto com a IDAI.';return}
  if(registered.passwordHash!==await passwordHash(pass)){if(error)error.textContent='E-mail ou palavra-passe incorretos.';return}
  localStorage.setItem('idaiSession',JSON.stringify({email,role:'reader',name:registered.responsibleName,companyName:registered.companyName,accountId:registered.id}));location.href='portal.html';
}
$('#login-form')?.addEventListener('submit',async e=>{e.preventDefault();await login()});

$('#register-form')?.addEventListener('submit',async e=>{
  e.preventDefault();
  const form=e.currentTarget,error=$('#register-error'),data=Object.fromEntries(new FormData(form).entries());
  if(error)error.textContent='';
  const email=String(data.email||'').trim().toLowerCase();
  if(data.password!==data.confirmPassword){error.textContent='As palavras-passe não correspondem.';return}
  const accounts=getCompanyAccounts();
  if(accounts.some(account=>account.email===email)){error.textContent='Já existe um cadastro com este e-mail. Entre no portal ou contacte a IDAI.';return}
  const now=new Date(),reference='IDAI-'+String(now.getTime()).slice(-6);
  const account={
    id:window.crypto?.randomUUID?window.crypto.randomUUID():reference,
    reference,
    companyName:String(data.companyName||'').trim(),
    responsibleName:String(data.responsibleName||'').trim(),
    email,
    phone:String(data.phone||'').trim(),
    nif:String(data.nif||'').trim(),
    sector:String(data.sector||''),
    socialLinks:String(data.socialLinks||'').trim(),
    digitalGoals:String(data.digitalGoals||'').trim(),
    desiredPlan:String(data.desiredPlan||''),
    companySize:String(data.companySize||''),
    passwordHash:await passwordHash(String(data.password||'')),
    status:'pending',
    createdAt:now.toISOString(),
    reviewedAt:null
  };
  accounts.push(account);saveCompanyAccounts(accounts);
  $('#registration-form-wrap').hidden=true;$('#registration-success').hidden=false;$('#registrationReference').textContent=reference;
  const message=`Olá IDAI Creative. Cadastrei a empresa ${account.companyName} no portal. Responsável: ${account.responsibleName}. Referência: ${reference}. Gostaria de solicitar a análise do cadastro.`;
  $('#registrationWhatsapp').href=`https://wa.me/${cfg.whatsapp||'244959266063'}?text=${encodeURIComponent(message)}`;
});

const session=JSON.parse(localStorage.getItem('idaiSession')||'null');
if(document.body.dataset.page==='portal'){
  if(!session){location.href='login.html'}else{
    $('[data-user]').textContent=session.name;$('[data-role]').textContent=session.role;
    if(session.companyName)$('[data-company]').textContent=session.companyName;
    if(session.role==='reader')$$('[data-manage]').forEach(el=>el.remove());
    if(session.role==='editor')$$('[data-admin-only]').forEach(el=>el.remove());
    if(session.role==='admin')renderCompanyRequests();
  }
}
$$('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>{$$('[data-tab]').forEach(b=>b.classList.remove('active'));$$('.tab-panel').forEach(p=>p.classList.remove('active'));btn.classList.add('active');$('#'+btn.dataset.tab)?.classList.add('active')}));
$('#logout')?.addEventListener('click',()=>{localStorage.removeItem('idaiSession');location.href='login.html'});

const targetDate=new Date();targetDate.setDate(targetDate.getDate()+43);
function updateCountdown(){const el=$('#countdown');if(!el)return;const d=Math.max(0,targetDate-Date.now());const days=Math.floor(d/86400000),hours=Math.floor(d%86400000/3600000);el.textContent=`${days}d ${hours}h`}
updateCountdown();setInterval(updateCountdown,60000);

$$('.goal[data-editable]').forEach(g=>g.addEventListener('click',()=>{if(session?.role==='reader')return;g.classList.toggle('done');saveGoals()}));
function saveGoals(){localStorage.setItem('idaiGoals',JSON.stringify($$('.goal[data-editable]').map(g=>g.classList.contains('done'))))}
const savedGoals=JSON.parse(localStorage.getItem('idaiGoals')||'null');if(savedGoals)$$('.goal[data-editable]').forEach((g,i)=>g.classList.toggle('done',!!savedGoals[i]));

function renderCompanyRequests(){
  const container=$('#companyRequests');if(!container)return;
  const accounts=getCompanyAccounts(),pending=accounts.filter(a=>a.status==='pending').length;
  $('#pendingCounter').textContent=`${pending} ${pending===1?'pendente':'pendentes'}`;
  if(!accounts.length){container.innerHTML='<div class="empty-state">Nenhum cadastro empresarial recebido neste navegador.</div>';return}
  container.innerHTML=accounts.slice().reverse().map(account=>`<article class="company-request" data-account-id="${escapeHtml(account.id)}">
    <div class="request-main"><span class="status-badge ${escapeHtml(account.status)}">${account.status==='approved'?'Aprovado':account.status==='rejected'?'Revisão necessária':'Aguardando aprovação'}</span><h3>${escapeHtml(account.companyName)}</h3><p>${escapeHtml(account.responsibleName)} · ${escapeHtml(account.email)} · ${escapeHtml(account.phone)}</p></div>
    <div class="request-details"><span><small>SETOR</small><b>${escapeHtml(account.sector)}</b></span><span><small>INTERESSE</small><b>${escapeHtml(account.desiredPlan)}</b></span><span><small>DIMENSÃO</small><b>${escapeHtml(account.companySize)}</b></span><span><small>REFERÊNCIA</small><b>${escapeHtml(account.reference)}</b></span></div>
    <details><summary>Ver briefing e dados completos</summary><div class="request-brief"><p><b>Objetivo:</b> ${escapeHtml(account.digitalGoals)}</p><p><b>Redes/website:</b> ${escapeHtml(account.socialLinks)||'—'}</p><p><b>NIF:</b> ${escapeHtml(account.nif)||'—'}</p></div></details>
    <div class="request-actions"><button class="btn approve-account" type="button" ${account.status==='approved'?'disabled':''}>Aprovar acesso</button><button class="btn secondary reject-account" type="button" ${account.status==='rejected'?'disabled':''}>Solicitar revisão</button></div>
  </article>`).join('');
  $$('.approve-account',container).forEach(button=>button.addEventListener('click',()=>updateAccountStatus(button.closest('.company-request').dataset.accountId,'approved')));
  $$('.reject-account',container).forEach(button=>button.addEventListener('click',()=>updateAccountStatus(button.closest('.company-request').dataset.accountId,'rejected')));
}
function updateAccountStatus(id,status){
  const accounts=getCompanyAccounts(),account=accounts.find(a=>a.id===id);if(!account)return;
  account.status=status;account.reviewedAt=new Date().toISOString();saveCompanyAccounts(accounts);renderCompanyRequests();
}
