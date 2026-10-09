const briefingForm=document.querySelector('#briefing-form');
const moneyPlans={low:['Presença','60.000 Kz/mês'],medium:['Crescimento','95.000 Kz/mês'],high:['Completo','130.000 Kz/mês'],enterprise:['Posicionamento Empresarial','150.000–250.000 Kz/mês']};
function esc(s=''){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function localPlan(data){
 const plan=moneyPlans[data.budget]||moneyPlans.medium;
 const priorities=[];const source=(data.need+' '+data.digitalGoals).toLowerCase();
 if(/marca|identidade|logo|visual/.test(source))priorities.push('Organizar identidade, posicionamento e linguagem visual');
 if(/venda|cliente|lead|convers/.test(source))priorities.push('Construir um funil de conteúdo, captação e acompanhamento comercial');
 if(/seguidor|alcance|visib/.test(source))priorities.push('Aumentar alcance qualificado com conteúdo e campanhas segmentadas');
 if(/vídeo|video|reel|foto/.test(source))priorities.push('Criar uma rotina audiovisual orientada à confiança e demonstração');
 if(!priorities.length)priorities.push('Definir posicionamento, público-alvo e calendário editorial mensurável');
 priorities.push('Medir mensalmente alcance, visitas, contactos e conversões');
 return {plan:plan[0],price:plan[1],priorities:priorities.slice(0,4),phases:['Diagnóstico e base da marca','Produção e consistência','Campanhas e aquisição','Otimização e escala'],kpis:['Alcance qualificado','Visitas ao perfil/site','Leads recebidos','Taxa de conversão estimada']};
}
async function smartPlan(data){
 if(!window.IDAI_CONFIG?.aiEndpoint)return localPlan(data);
 try{const res=await fetch(window.IDAI_CONFIG.aiEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});if(!res.ok)throw new Error();return await res.json()}catch{return localPlan(data)}
}
briefingForm?.addEventListener('submit',async e=>{e.preventDefault();const btn=document.querySelector('#generate');btn.disabled=true;btn.textContent='A analisar o briefing…';const data=Object.fromEntries(new FormData(briefingForm));const plan=await smartPlan(data);const result=document.querySelector('#result');const priorities=plan.priorities.map(x=>`<li>${esc(x)}</li>`).join('');const phases=plan.phases.map((x,i)=>`<div class="result-section"><b>Fase ${i+1}</b> — ${esc(x)}</div>`).join('');result.innerHTML=`<span class="badge">Plano inicial personalizado</span><h3>${esc(data.company)} · ${esc(plan.plan)}</h3><p>Com base na visão apresentada, recomendamos uma implementação progressiva para transformar a presença digital numa estrutura mensurável de crescimento.</p><div class="result-section"><b>Investimento de referência:</b> ${esc(plan.price)}</div><div class="result-section"><b>Prioridades:</b><ul>${priorities}</ul></div>${phases}<div class="result-section"><b>Indicadores:</b> ${plan.kpis.map(esc).join(' · ')}</div><button type="button" id="send-plan" class="btn">Enviar briefing pelo WhatsApp</button>`;result.classList.add('show');result.scrollIntoView({behavior:'smooth',block:'start'});
 document.querySelector('#send-plan').addEventListener('click',()=>{const msg=`NOVO BRIEFING — IDAI CREATIVE\n\nResponsável: ${data.clientName}\nEmpresa: ${data.company}\nContacto: ${data.phone}\nE-mail: ${data.email||'Não informado'}\nSetor: ${data.sector}\nFase: ${data.stage}\n\nNECESSIDADE:\n${data.need}\n\nVISÃO EM 4 ANOS:\n${data.vision}\n\nOBJETIVOS DIGITAIS:\n${data.digitalGoals}\n\nCanais: ${data.channels}\nOrçamento: ${data.budget}\n\nPLANO RECOMENDADO: ${plan.plan} — ${plan.price}\nPrioridades: ${plan.priorities.join('; ')}`;window.open(`https://wa.me/${window.IDAI_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`,'_blank')});btn.disabled=false;btn.textContent='Gerar novamente';});
