'use strict';
(() => {
 const D=window.MEZHDU_CONTENT;
 const root=document.getElementById('content');
 if(!D){root.innerHTML='<p class="page-shell">Съдържанието не може да се зареди.</p>';return;}
 const safe=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const t=(s='')=>String(s).toLocaleLowerCase('bg-BG');
 const sectors=Object.fromEntries(D.sections.map(x=>[x.id,x]));
 const src=Object.fromEntries(D.external_sources.map(x=>[x.id,x]));
 const imgSrc=n=>(window.MEZHDU_ASSET_MAP&&window.MEZHDU_ASSET_MAP[n])||('assets/images/'+n+'.webp');
 let route='';
 const topicCard=a=>`<a class="article-card" href="#article/${safe(a.id)}"><span class="category">${safe(sectors[a.section]?.name||'Тема')}</span><h3>${safe(a.title)}</h3><p>${safe(a.lead||'')}</p><span aria-hidden="true" class="card-arrow">↗</span></a>`;
 const tileCopy={
  love:['ЛЮБОВ И ВРЪЗКИ','Когато любовта започне да тежи'],
  boundaries:['ЛИЧНИ ГРАНИЦИ','Моето „да“ и моето „не“'],
  wellbeing:['ПСИХИЧНО БЛАГОПОЛУЧИЕ','Как да се грижа за себе си'],
  friends:['ПРИЯТЕЛСТВА','Ами ако се случва на приятелка?'],
  warning:['ТРЕВОЖНИ ЗНАЦИ','Кога една връзка не е здравословна?'],
  sharing:['СПОДЕЛЯНЕ','За нещата, за които трудно се говори'],
  support:['ПОДКРЕПА','Къде мога да потърся помощ']
 };
 const photo=(file,alt,to,cls='')=>{const [category,title]=tileCopy[file]||['ТЕМА',alt];return `<a class="photo-tile ${cls} tile-${file}" href="${to}" aria-label="${safe(alt)}"><img class="tile-photo" src="${imgSrc(file+'-photo')}" alt="" loading="${file==='love'?'eager':'lazy'}" decoding="async"><span class="tile-shade" aria-hidden="true"></span><span class="tile-contents"><span class="tile-category">${safe(category)}</span><span class="tile-heading">${safe(title)}</span></span></a>`};
 const wrap=(eyebrow,title,description,content)=>`<section class="page-shell"><p class="page-eyebrow">${eyebrow}</p><h1 class="page-title">${title}</h1><p class="page-description">${description}</p>${content}</section>`;
 const home=()=>`<section class="home-hero" aria-labelledby="hero-heading"><img class="hero-flower" src="${imgSrc('hero-peony')}" alt="" width="704" height="414"><div class="hero-inner"><h1 id="hero-heading" class="hero-headline"><span>Ще си остане</span><strong>между <em>нас</em></strong></h1><p class="hero-intro">Пространство за момичета — за връзките, границите, приятелствата и всички онези въпроси, които те вълнуват.</p></div></section>
<section class="home-cards" aria-label="Разгледай темите"><div class="magazine-grid">
${photo('love','Любов и връзки: Когато любовта започне да тежи','#article/A04','tile-love')}
${photo('boundaries','Лични граници: Моето „да“ и моето „не“','#article/A05','tile-boundaries')}
${photo('wellbeing','Психично благополучие: Как да се грижа за себе си','#article/A24','tile-wellbeing')}
${photo('friends','Приятелства: Ами ако се случва на приятелка?','#article/A19','tile-friends')}
${photo('warning','Тревожни знаци: Кога една връзка не е здравословна?','#article/A07','tile-warning')}
</div><div class="magazine-bottom">${photo('sharing','Споделяне: За нещата, за които трудно се говори','#article/A23')}${photo('support','Подкрепа: Къде мога да потърся помощ','#help')}</div></section>
<section class="editorial-tail"><div class="editorial-tail-inner"><p>Няма неудобни въпроси. Можеш да четеш спокойно и без регистрация. Този сайт не събира лични истории или съобщения.</p><a class="text-link" href="#topics">Всички теми ↗</a></div></section>`;
 const sectionPills=(chosen='all')=>`<div class="section-pills" role="navigation" aria-label="Категории"><a class="pill ${chosen==='all'?'active':''}" href="#topics">Всички</a>${D.sections.map(s=>`<a class="pill ${chosen===s.id?'active':''}" href="#topics/${safe(s.id)}">${safe(s.name)}</a>`).join('')}</div>`;
 const topics=(section='all')=>{const articles=D.articles.filter(a=>section==='all'||a.section===section);return wrap('Твоето пространство','Теми','За отношенията, доверието, приятелствата и онези моменти, в които имаш нужда от повече яснота.',`${sectionPills(section)}<div class="topic-controls"><input class="text-search" id="topic-search" type="search" placeholder="Потърси тема или дума…" aria-label="Потърси в статиите"></div><p class="results-count" id="topics-count">${articles.length} статии</p><div class="article-grid" id="article-list">${articles.map(topicCard).join('')}</div>`)};
 const article=(id)=>{
  const a=D.articles.find(x=>x.id===id);
  if(!a)return wrap('Няма такава страница','Не открихме тази статия','Може да разгледаш всички теми.','<a href="#topics" class="text-link">Към темите ↗</a>');
  const cites=[...new Set(a.sources||[])].map(k=>src[k]).filter(Boolean);
  const related=D.articles.filter(x=>x.section===a.section&&x.id!==id).slice(0,5);
  return `<section class="page-shell"><a class="back-link" href="#topics/${safe(a.section)}">← Към ${safe(sectors[a.section]?.name||'темите')}</a><div class="reading-layout"><article class="article-main"><p class="page-eyebrow">${safe(sectors[a.section]?.name||'Тема')}</p><h1 class="page-title">${safe(a.title)}</h1><p class="article-meta">Кратка статия · ${Math.max(2,Math.round(([a.lead,...(a.paragraphs||[])].join(' ').split(/\s+/).length)/180))} мин. четене</p><p class="lead">${safe(a.lead||'')}</p>${(a.paragraphs||[]).map(x=>`<p>${safe(x)}</p>`).join('')}${a.takeaway?`<div class="support-ribbon"><h2>Имай предвид</h2><p>${safe(a.takeaway)}</p></div>`:''}<details class="source-disclosure"><summary>Източници и допълнително четене</summary><ul>${cites.map(s=>`<li><a href="${safe(s.url)}" target="_blank" rel="noopener noreferrer">${safe(s.organization||'')}: ${safe(s.title||'Източник')}</a></li>`).join('')||'<li>Няма посочени източници към този текст.</li>'}</ul></details><p class="privacy-note">Този текст е обща информация, а не индивидуална консултация. Ако си в опасност или имаш нужда от човек, с когото да поговориш, разгледай <a href="#help">възможностите за помощ</a>.</p></article><aside class="related-side" aria-label="Още по темата"><h2>Още по темата</h2>${related.map(x=>`<a href="#article/${safe(x.id)}">${safe(x.title)} ↗</a>`).join('')}<p><a href="#help">Къде можеш да потърсиш подкрепа ↗</a></p></aside></div></section>`;
 };
 const listScenarios=()=>D.scenarios.map((x,i)=>`<details class="case-card"><summary class="case-cover"><span class="case-topic">${safe(x.topic||'Ситуация')} · ${String(i+1).padStart(2,'0')}</span><span class="case-head">${safe(x.title)}</span><span class="case-opener">Прочети ситуацията</span></summary><div class="case-expanded"><p class="case-story">${safe(x.story)}</p><h4>${safe(x.question)}</h4><details class="case-answer"><summary>Възможен подход</summary><p>${safe(x.explanation)}</p>${x.related_article?`<p class="case-related"><a href="#article/${safe(x.related_article)}">Прочети повече по темата ↗</a></p>`:''}</details></div></details>`).join('');
 const listFAQ=()=>{
  const categories=[...new Set(D.faq.map(x=>x.category||'Други въпроси'))];
  const categoryIds=['qa-relations','qa-boundaries','qa-online','qa-support'];
  const index=`<nav class="qa-index" aria-label="Темите в Q&A">${categories.map((cat,i)=>`<button type="button" data-qa-target="${categoryIds[i]}">${safe(cat)}</button>`).join('')}</nav>`;
  const groups=categories.map((cat,i)=>`<section class="qa-group" id="${categoryIds[i]}"><h2>${safe(cat)}</h2><div class="resource-list faq-list">${D.faq.filter(x=>x.category===cat).map(x=>`<details class="resource-item"><summary>${safe(x.question)}</summary><p>${safe(x.answer)}</p></details>`).join('')}</div></section>`).join('');
  return index+groups;
 };
 const listQuick=()=>D.quick_cards.map(x=>`<div class="resource-item"><h3>${safe(x.phrase)}</h3><p>${safe(x.message)}</p></div>`).join('');
 const listChecklists=()=>D.checklists.map(x=>`<div class="resource-item"><h3>${safe(x.title)}</h3><ul class="checklist">${x.items.map(y=>`<li>${safe(y)}</li>`).join('')}</ul><p class="fineprint">${safe(x.important||'')}</p></div>`).join('');
 const scenarios=()=>`<section class="page-shell"><h1 class="page-title">Ситуации</h1><div class="resource-list scenario-list">${listScenarios()}</div><details class="extras-disclosure"><summary>За размисъл</summary><div class="resource-list thought-list">${listChecklists()}</div></details><p class="scenario-origin">Тези ситуации са създадени за сайта като примерни истории. Те не са действителни случаи на конкретни момичета.</p><p class="scenario-next"><a href="#qa">Имаш конкретен въпрос? Разгледай Q&amp;A ↗</a></p></section>`;
 const qa=()=>`<section class="page-shell"><h1 class="page-title">Q&amp;A</h1>${listFAQ()}</section>`;
 const help=()=>wrap('Когато имаш нужда от подкрепа','Не е нужно да се справяш сама','Този сайт не приема лични съобщения. Но има хора и организации, към които можеш да се обърнеш.',`<div class="help-lead"><h2>Ако си в непосредствена опасност</h2><p>Позвъни на <a href="tel:112"><strong>112</strong></a>. Ако можеш безопасно, отиди при доверен възрастен или на място, където има хора.</p></div><div class="help-grid">${D.help_contacts.map(x=>`<section class="help-card"><h2>${safe(x.name)}</h2><a class="number" href="tel:${safe(x.phone.replace(/[^0-9+]/g,''))}">${safe(x.phone)}</a><p>${safe(x.purpose)}</p><p class="hours">${safe(x.availability)}</p><a class="site-link" href="${safe(x.url)}" target="_blank" rel="noopener noreferrer">Официален сайт ↗</a></section>`).join('')}</div><p class="privacy-note">Важно: конфиденциалността на специализираните услуги има граници, когато съществува сериозна опасност за дете. Бързото напускане на страницата не изтрива историята на браузъра. Проверявай контактите и актуалното им работно време в официалните сайтове.</p><p><a class="text-link" href="https://www.google.com/" rel="noreferrer">Бързо излизане от страницата ↗</a></p>`);
 const about=()=>wrap('Кои сме','За инициативата','За въпросите, които невинаги успяваме да зададем на глас.',`<div class="about-box"><p><strong>„Ще си остане между нас“</strong> е информационно пространство, създадено като инициатива на Зонта клуб Разград.</p><p>Тук говорим за първите връзки, доверието, личните граници, онлайн безопасността, приятелствата и моментите, когато нещо те тревожи.</p><p>Не искаме да ти казваме какво трябва да чувстваш. Искаме да имаш достъп до ясна информация, която да ти помогне да разбираш по-добре отношенията и собствените си възможности.</p><p>Можеш да четеш без регистрация. Не събираме съобщения, истории или отговори. Сайтът няма индивидуално консултиране и не обещава абсолютна конфиденциалност на посещенията.</p></div><div class="method-intro"><h2>Откъде е информацията?</h2><p>Материалите са написани на достъпен език за момичета в юношеска възраст. Подбрани са теми и житейски примери, близки до тяхното ежедневие, като са използвани публични специализирани ресурси за здравословни отношения, права и безопасност. <a class="text-link" href="#sources">Виж източниците и редакционния подход ↗</a></p></div><div class="support-ribbon"><h2>Има теми, по които е важно да не оставаш сама</h2><p>Ако преживяваш натиск, заплаха или насилие, потърси човек или услуга, които могат да ти помогнат безопасно.</p><a href="#help">Виж възможностите за подкрепа ↗</a></div>`);
 const curatedSources=[
  {id:'S02',how:'Първи връзки, натиск, рискови ситуации и търсене на помощ сред юноши'},
  {id:'S01',how:'Разпознаване на насилие и подкрепа от доверен възрастен'},
  {id:'S19',how:'Безопасност, подкрепяща среда и устойчивост на момичетата'},
  {id:'S06',how:'Здравословни взаимоотношения, уважение и лични граници'},
  {id:'S25',how:'Информация за насилието във връзките сред тийнейджърите'},
  {id:'S13',how:'Достъпно образование по права на човека за млади хора'},
  {id:'S27',how:'Възможности при разпространяване на интимни изображения, създадени преди 18 г.'},
  {id:'S15',how:'Български контакти за помощ и онлайн безопасност'},
  {id:'S16',how:'Българска национална линия за деца'},
 ];
 const sources=()=>wrap('За прозрачността','Източници','Материалите стъпват на публични специализирани източници.',`<div class="method-intro"><h2>Как е подготвено съдържанието?</h2><p>Текстовете са написани за момичета в юношеска възраст на достъпен български. Информацията е подбрана и адаптирана по публикации за отношенията, правата, границите и безопасността. Ситуациите са измислени за този сайт — не са реални разкази на момичета.</p><p>Посочването на източник не означава, че съответната организация е партньор на проекта или го е одобрила. Сайтът предлага обща информация, не индивидуална психологическа консултация. Към момента материалите не са представени като одобрени от училищен психолог.</p></div><h2 class="source-list-title">Използвани източници</h2><div class="source-grid">${curatedSources.map(x=>{const p=src[x.id];return p?`<div class="source-card"><p class="source-org">${safe(p.organization)}</p><h3>${safe(p.title)}</h3><p>${safe(x.how)}</p><a href="${safe(p.url)}" target="_blank" rel="noopener noreferrer">Към източника ↗</a></div>`:''}).join('')}</div><p class="privacy-note">Без регистрация и без изпращане на лични съобщения. За съдействие при опасност виж <a href="#help">Помощ</a>.</p>`);
 const searchDialog=document.getElementById('search-dialog');
 const searchInput=document.getElementById('site-search');
 const searchResults=document.getElementById('search-results');
 function updateSearch(){const q=t(searchInput.value.trim());const hits=D.articles.filter(a=>t([a.title,a.lead,...a.paragraphs].join(' ')).includes(q)).slice(0,14);searchResults.innerHTML=(q?hits:D.articles.slice(0,7)).map(a=>`<a href="#article/${safe(a.id)}">${safe(a.title)}<small>${safe(sectors[a.section]?.name||'')}</small></a>`).join('')||'<p>Няма намерени статии. Опитай с друга дума.</p>'}
 document.getElementById('open-search').addEventListener('click',()=>{updateSearch();searchDialog.showModal();searchInput.focus()});
 document.getElementById('close-search').addEventListener('click',()=>searchDialog.close());
 searchDialog.addEventListener('click',e=>{if(e.target===searchDialog)searchDialog.close()});
 searchResults.addEventListener('click',e=>{if(e.target.closest('a'))searchDialog.close()});
 searchInput.addEventListener('input',updateSearch);
 function bindTopicSearch(section){const el=document.getElementById('topic-search');if(!el)return;el.addEventListener('input',()=>{const q=t(el.value.trim());const selected=D.articles.filter(a=>(section==='all'||a.section===section)&&t([a.title,a.lead,...a.paragraphs].join(' ')).includes(q));document.getElementById('article-list').innerHTML=selected.map(topicCard).join('')||'<p class="empty-state">Няма резултати. Опитай с друга дума.</p>';document.getElementById('topics-count').textContent=selected.length+' статии'});}
 function render(){const hash=(window.location.hash||'#home').slice(1);const [page,arg]=hash.split('/');let html;switch(page){case 'home':html=home();break;case 'topics':html=topics(arg||'all');break;case 'article':html=article(arg);break;case 'scenarios':html=scenarios();break;case 'qa':html=qa();break;case 'resources':case 'questions':html=(arg==='faq'||page==='questions')?qa():scenarios();break;case 'help':html=help();break;case 'about':html=about();break;case 'sources':html=sources();break;default:html=home();}
 root.innerHTML=html;document.querySelectorAll('[data-route]').forEach(x=>{const active=x.dataset.route===(page==='article'?'topics':page);x.classList.toggle('active',active);if(active)x.setAttribute('aria-current','page');else x.removeAttribute('aria-current')});if(page==='topics')bindTopicSearch(arg||'all');if(page==='qa'){root.querySelectorAll('[data-qa-target]').forEach(btn=>btn.addEventListener('click',()=>document.getElementById(btn.dataset.qaTarget)?.scrollIntoView({behavior:'smooth',block:'start'})));}document.title=`${page==='home'?'Ще си остане между нас':(root.querySelector('h1')?.textContent||'Между нас')} · Зонта клуб Разград`;if(hash!==route){route=hash;window.scrollTo({top:0,behavior:'instant'})}}
 window.addEventListener('hashchange',render);render();
})();
