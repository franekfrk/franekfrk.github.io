'use strict';
const FORGE = 'https://forge.franckiewicz.eu/';
const projects = [
 ['vendorbeacon','VendorBeacon','Zamówienia Amazon → Subiekt nexo PRO.','Obsługa PO Amazon, redukcje do pełnych kartonów, podział wysyłek, zapis ZK w Subiekcie nexo PRO oraz wydruki i etykiety dla magazynu.',FORGE+'vb/','beacon'],
 ['bidbeacon','BidBeacon','Rentowność kampanii Amazon Ads.','Zestawienie marży i kosztów reklamy oraz progu opłacalności ACOS. Analiza, która pomaga ocenić wyniki kampanii Amazon Ads.','https://bidbeacon.eu','beacon'],
 ['listingbeacon','ListingBeacon','Listingi Amazon z AI i wiedzą o produktach.','Łączy treści listingów Amazon, frazy Helium 10 i własną bazę wiedzy o produktach. Generatywna AI przygotowuje nowe wersje listingów w aplikacji desktopowej.',FORGE+'#projekty','beacon'],
 ['keywordbeacon','KeywordBeacon','Analiza i porządkowanie fraz Helium 10.','Import CSV i ZIP z eksportami Helium 10, w tym Cerebro. Filtrowanie fraz i produktów, wspólne słowa kluczowe, mapa brakujących danych oraz eksport CSV.',FORGE+'#projekty','beacon'],
 ['asinbeacon','ASINBeacon','Monitoring zmian na listingach Amazon.','Porównuje pomiary listingów: ceny, dostępność, Buy Box, sprzedawców, promocje, opinie i BSR. Historia zmian, alerty oraz eksport CSV lub JSON.',FORGE+'#projekty','beacon'],
 ['catalogbeacon','CatalogBeacon','Zbiorcze pobieranie listingów Amazon.','Aplikacja desktopowa do masowego pobierania treści listingów. Zbiera materiały wielu produktów do przeglądu, porównania i dalszej pracy z katalogiem.',FORGE+'#projekty','beacon'],
 ['imagebeacon','ImageBeacon','Zdjęcia produktów i zwiększanie rozdzielczości AI.','Zbiorcze pobieranie zdjęć produktów Amazon oraz automatyczny upscaling AI. Łączy zebranie materiałów i zwiększenie ich rozdzielczości.',FORGE+'#projekty','beacon'],
 ['salesbeacon','SalesBeacon','Analiza sprzedaży Amazon Vendor.','Łączy raporty XLSX w widok sprzedaży: Retail i Business, rynki, okresy, rankingi ASIN-ów oraz trendy produktów.',FORGE+'#projekty','beacon'],
 ['marginbeacon','MarginBeacon','Marża Amazon i trendy Net PPM.','Porównuje raporty Net PPM, rynki, okresy i ASIN-y. Pokazuje trendy marży i największe zmiany; z danymi SalesBeacon także średnie ważone.',FORGE+'#projekty','beacon'],
 ['costbeacon','CostBeacon','Ceny zakupu Vendor Central → Excel.','Odczytuje ASIN-y i widoczne ceny EUR z Catalogue w Vendor Central. Zbiera je etapami i eksportuje do XLSX albo CSV.',FORGE+'costbeacon/','beacon'],
 ['sigmarizz','SigmaRizz','Raporty Amazon Vendor Central przez SP-API.','AmazonSigmaRizzExtractor pobiera raporty sprzedaży, stanów magazynowych, prognoz i marży przez SP-API. Osobny ekstraktor obsługuje sprzedaż od początku roku.','https://github.com/franekfrk/AmazonSigmaRizzExtractor','other'],
 ['homelabtools','HomeLabTools','Monitoring domowego serwera Linux.','Skrypty Bash do kontroli baterii, temperatury, dysków SMART, Dockera, DNS i Minecrafta. Powiadomienia Discord, opcjonalne Healthchecks oraz obsługa sytuacji awaryjnych.','https://github.com/franekfrk/homelab-tools','other'],
 ['nik','NIK','Naczelny Inspektorat Kreeperowy.','Polskie komendy Bash do zarządzania serwerem Minecraft w Dockerze przez RCON. Przedmioty, efekty, zaklęcia, teleportacja, pogoda i zapis świata; słownik PL → EN i podpowiedzi Tab.','https://github.com/franekfrk/nik','other'],
 ['nexomigrator','NexoMigrator','Migracja między bazami różnych podmiotów nexo.','Narzędzie do migracji danych Subiekta nexo między bazami różnych podmiotów. Obsługuje również komplety ze składnikami ewidencyjnymi. Projekt dla Windows, .NET 8 i bibliotek InsERT nexo.',FORGE+'#kontakt','nexo'],
 ['nexosql','Skrypty SQL do nexo','Własne skrypty do pracy z bazami nexo.','Tworzę również różne skrypty SQL do nexo. Zakres i zastosowanie dobieram do konkretnej potrzeby — porozmawiajmy o pracy z Twoimi danymi.',FORGE+'#kontakt','nexo']
];
const output=document.querySelector('#output'), viewport=document.querySelector('#viewport'), input=document.querySelector('#command'), form=document.querySelector('#form');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const history=[];let historyIndex=0,draft='',bootTimer,matrixTimer;
const aliases={whoami:'about',ls:'projects',narzedzia:'projects',tools:'projects',kontakt:'contact',cls:'clear','homelab-tools':'homelabtools',amazonSigmarizzextractor:'sigmarizz',sql:'nexosql'};
function node(tag,text,cls){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;}
function line(parent,text,cls='line'){parent.append(node('div',text,cls));}
function link(parent,text,url){const a=node('a',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';parent.append(a);}
function button(parent,text,command){const b=node('button',text,'command-button');b.type='button';b.dataset.command=command;parent.append(b);}
function scroll(){viewport.scrollTop=viewport.scrollHeight;}
function entry(command){const el=node('div',undefined,'entry');if(command)line(el,'marcin@forge:~$ '+command,'echo');output.append(el);while(output.children.length>80)output.firstElementChild.remove();return el;}
function findProject(name){const key=(name||'').toLowerCase().replace(/[\s_-]/g,'');return projects.find(p=>p[0]===key||p[1].toLowerCase().replace(/[\s_-]/g,'')===key||key==='amazonsigmarizzextractor'&&p[0]==='sigmarizz');}
function catalog(parent,group){const labels={beacon:'01 / FORGE · BEACON',other:'02 / EKSTRAKTORY, HOMELAB I MINECRAFT',nexo:'03 / SUBIEKT NEXO · MIGRACJE I SQL'};for(const kind of ['beacon','other','nexo']){if(group&&group!==kind)continue;line(parent,labels[kind],'category');const list=node('div',undefined,'catalog');projects.forEach((p,i)=>{if(p[5]!==kind)return;const row=node('div',undefined,'project-row');row.append(node('span',String(i+1).padStart(2,'0'),'number'));button(row,p[1]+' ↵',p[0]);row.append(node('span',p[2],'desc'));list.append(row);});parent.append(list);}line(parent,'Kliknij nazwę lub wpisz ją jako polecenie. Otwieranie: open nazwa','line muted');}
function detail(parent,p){line(parent,p[1],'detail-title');line(parent,p[3],'detail-text');const links=node('div',undefined,'links');link(links,p[5]==='nexo'?'Zapytaj o narzędzie ↗':p[4].includes('#projekty')?'Opis i kontakt na FORGE ↗':'Otwórz projekt ↗',p[4]);button(links,'← katalog projektów','projects');parent.append(links);line(parent,'Polecenie: open '+p[0],'line muted');}
let activeTyping = null;
function finishTyping() {
 if (!activeTyping) return;
 const state = activeTyping; activeTyping = null;
 cancelAnimationFrame(state.frame);
 state.parts.forEach(part => { part.node.data = part.text; });
 state.element.removeAttribute('aria-busy');
 state.element.inert = false;
 document.body.classList.remove('printing');
 document.querySelector('#status').textContent = '15 PROJECTS MOUNTED';
}
function animateEntry(element, booting = false) {
 finishTyping();
 if (reduced.matches || document.body.classList.contains('fx-off')) return;
 const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
 const parts = []; let textNode, total = 0;
 while ((textNode = walker.nextNode())) {
  if (textNode.parentElement.closest('.echo')) continue;
  const text = textNode.data; total += text.length;
  parts.push({node:textNode, text, end:total}); textNode.data = '';
 }
 if (!total) return;
 const state = {element, parts, frame:0}; activeTyping = state;
 element.setAttribute('aria-busy','true'); element.inert = true;
 document.body.classList.add('printing');
 document.querySelector('#status').textContent = booting ? 'BOOTING SYSTEM...' : 'RECEIVING DATA...';
 const start = performance.now(), duration = Math.min(booting ? 3400 : 2300, total * (booting ? 6 : 3));
 function frame(now) {
  if (activeTyping !== state) return;
  const count = Math.min(total, Math.floor((now-start)/duration*total));
  let offset = 0;
  for (const part of parts) {
   const length = Math.max(0, Math.min(part.text.length, count-offset));
   part.node.data = part.text.slice(0,length); offset = part.end;
  }
  scroll();
  if (count === total) { finishTyping(); scroll(); }
  else state.frame = requestAnimationFrame(frame);
 }
 state.frame = requestAnimationFrame(frame);
}
function boot() {
 finishTyping(); clearTimeout(bootTimer); stopMatrix(); output.replaceChildren();
 const el=entry();
 line(el,'MF / PERSONAL SYSTEMS','boot-sub');
 line(el,'FRANCKIEWICZ / OS','boot-mark');
 line(el,'TERMINAL OS 1.0 · CRT SERIES 86 / BUILD 2026','boot-sub');
 line(el,'[ OK ] Phosphor display warmed up');
 line(el,'[ OK ] Creative engine initialized');
 line(el,'[ OK ] FORGE mounted · 10 Beacon tools');
 line(el,'[ OK ] SigmaRizz / HomeLabTools / NIK');
 line(el,'[ OK ] NexoMigrator / SQL scripts');
 line(el,'────────────────────────────────────────','line muted');
 line(el,'Cześć. Jestem Marcin Franckiewicz.','intro-title');
 line(el,'Tworzę narzędzia, których sam potrzebuję.\nPomysły, automatyzacja, Amazon, homelab i nexo.');
 const row=node('div',undefined,'links');
 for(const c of ['help','about','projects','contact'])button(row,'[ '+c+' ]',c);
 el.append(row); line(el,'Wpisz polecenie lub kliknij jedną z opcji.','line muted');
 const screen=document.querySelector('.screen'); screen.classList.remove('power-on');
 void screen.offsetWidth; screen.classList.add('power-on');
 animateEntry(el,true); scroll();
}
function theme(value){if(!['green','amber'].includes(value))return false;document.body.classList.toggle('amber',value==='amber');document.querySelector('#color').setAttribute('aria-label',value==='amber'?'Zmień kolor na zielony':'Zmień kolor na bursztynowy');try{localStorage.setItem('crt-theme',value);}catch{}return true;}
function setFX(off){document.body.classList.toggle('fx-off',off);if(off)finishTyping();const b=document.querySelector('#motion');b.textContent='CRT FX: '+(off?'OFF':'ON');b.setAttribute('aria-pressed',String(off));try{localStorage.setItem('crt-fx',off?'off':'on');}catch{}}
function stopMatrix(){clearInterval(matrixTimer);matrixTimer=null;document.querySelector('#matrix').hidden=true;document.querySelector('#exit-matrix').hidden=true;}
function matrix(parent){if(reduced.matches){line(parent,'Animacja pominięta: masz włączone ograniczenie ruchu.');return;}stopMatrix();const canvas=document.querySelector('#matrix'),ctx=canvas.getContext('2d');if(!ctx){line(parent,'Animacja nie jest dostępna w tej przeglądarce.');return;}const rect=canvas.parentElement.getBoundingClientRect();canvas.width=Math.round(rect.width);canvas.height=Math.round(rect.height);const drops=Array.from({length:Math.ceil(canvas.width/18)},()=>-Math.random()*30);const color=getComputedStyle(document.body).getPropertyValue('--phosphor').trim();canvas.hidden=false;document.querySelector('#exit-matrix').hidden=false;matrixTimer=setInterval(()=>{ctx.fillStyle='#06100824';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=color;ctx.font='15px monospace';drops.forEach((y,i)=>{ctx.fillText(String.fromCharCode(0x30A0+Math.floor(Math.random()*90)),i*18,y*18);if(y*18>canvas.height&&Math.random()>.97)drops[i]=0;else drops[i]++;});},65);line(parent,'Animacja MATRIX. Naciśnij Esc, aby wrócić.');}
function run(raw){const command=raw.trim();if(!command)return;finishTyping();clearTimeout(bootTimer);history.push(command);historyIndex=history.length;input.value='';draft='';const parts=command.toLowerCase().split(/\s+/);const cmd=aliases[parts[0]]||parts[0],arg=parts.slice(1).join(' ');if(cmd==='clear'){output.replaceChildren();return;}if(cmd==='reboot'){boot();return;}const el=entry(command);const project=findProject(cmd);
 if(project)detail(el,project);
 else if(cmd==='help'){line(el,'DOSTĘPNE POLECENIA','detail-title');for(const [c,d] of [['about','Kim jestem i co tworzę'],['projects','Wszystkie 15 projektów i narzędzi'],['beacons','10 narzędzi Beacon z FORGE'],['nexo','Migrator i skrypty SQL do nexo'],['open nazwa','Otwórz stronę projektu'],['forge','Moja kuźnia pomysłów i technologii'],['github','Profil GitHub'],['contact','Kontakt i rozmowa o projekcie'],['theme green','Zielony luminofor'],['theme amber','Bursztynowy luminofor'],['clear','Wyczyść ekran'],['reboot','Uruchom terminal ponownie'],['date','Aktualny czas w Polsce'],['matrix','Deszcz znaków · Esc kończy']]){const row=node('div',undefined,'help-row');button(row,c,c);row.append(node('span',d));el.append(row);}line(el,'Każde narzędzie ma własną komendę:','category');const row=node('div',undefined,'links');projects.forEach(p=>button(row,p[0],p[0]));el.append(row);line(el,'Tab — podpowiedzi; ↑ / ↓ — historia. Nie uruchamiam komend systemowych.','line muted');}
 else if(cmd==='about'){line(el,'Marcin Franckiewicz','detail-title');line(el,'Twórca FORGE — kuźni pomysłów i technologii.\nBuduję narzędzia, których sam potrzebuję: do obsługi Amazon, analizy danych, automatyzacji oraz pracy z Subiektem nexo.\nPo godzinach: homelab, skrypty i Minecraft.','detail-text');link(el,'Poznaj FORGE ↗',FORGE);}
 else if(cmd==='projects'||cmd==='beacons'||cmd==='nexo')catalog(el,cmd==='beacons'?'beacon':cmd==='nexo'?'nexo':null);
 else if(cmd==='open'){const p=findProject(arg);if(p){detail(el,p);window.open(p[4],'_blank','noopener,noreferrer');line(el,'Adres projektu otwieram w nowej karcie. Możesz też kliknąć link powyżej.','line muted');}else line(el,'Podaj nazwę projektu, np. open costbeacon. Listę zobaczysz przez projects.');}
 else if(cmd==='forge'){line(el,'FORGE / Kuźnia pomysłów i technologii','detail-title');link(el,'Otwórz FORGE ↗',FORGE);}
 else if(cmd==='github'){line(el,'Kod i publiczne repozytoria:');link(el,'github.com/franekfrk ↗','https://github.com/franekfrk');}
 else if(cmd==='contact'){line(el,'Porozmawiajmy o Twoim pomyśle.','detail-title');line(el,'Interesuje Cię Beacon, migracja nexo albo własne skrypty SQL?\nKontakt znajdziesz bezpośrednio na mojej stronie FORGE.','detail-text');link(el,'Przejdź do kontaktu ↗',FORGE+'#kontakt');}
 else if(cmd==='theme')line(el,theme(arg)?'Luminofor: '+arg.toUpperCase():'Użyj theme green lub theme amber.');
 else if(cmd==='date')line(el,new Date().toLocaleString('pl-PL',{timeZone:'Europe/Warsaw'})+' / Europe/Warsaw');
 else if(cmd==='matrix')matrix(el);
 else if(cmd==='sudo')line(el,'Dobry pomysł nie wymaga uprawnień roota. Spróbuj projects.');
 else {const names=['help','about','projects','contact','forge','github',...projects.map(p=>p[0])];const suggestion=names.find(n=>n.startsWith(cmd.slice(0,3)));line(el,'Nie znam polecenia „'+command+'”. '+(suggestion?'Czy chodziło o '+suggestion+'?':'Wpisz help.'));}animateEntry(el);scroll();}
form.addEventListener('submit',e=>{e.preventDefault();run(input.value);});
document.addEventListener('click',e=>{const b=e.target.closest('[data-command]');if(b)run(b.dataset.command);});
input.addEventListener('keydown',e=>{if(e.key==='ArrowUp'){e.preventDefault();if(historyIndex===history.length)draft=input.value;if(historyIndex>0)input.value=history[--historyIndex];}else if(e.key==='ArrowDown'){e.preventDefault();if(historyIndex<history.length)historyIndex++;input.value=historyIndex===history.length?draft:history[historyIndex];}else if(e.key==='Tab'){e.preventDefault();const text=input.value.toLowerCase();const opening=text.startsWith('open ');const prefix=opening?text.slice(5):text;const options=(opening?projects.map(p=>p[0]):['help','about','projects','beacons','contact','forge','github','clear','reboot','date','matrix','theme green','theme amber','open ',...projects.map(p=>p[0])]).filter(n=>n.startsWith(prefix));if(options.length===1)input.value=(opening?'open ':'')+options[0];else if(options.length){const el=entry();line(el,options.join('  '),'line muted');scroll();}}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){stopMatrix();finishTyping();}const keys={F1:'help',F2:'about',F3:'projects',F4:'contact'};if(keys[e.key]){e.preventDefault();run(keys[e.key]);}});
document.querySelector('#exit-matrix').addEventListener('click',stopMatrix);
document.querySelector('#color').addEventListener('click',()=>theme(document.body.classList.contains('amber')?'green':'amber'));
document.querySelector('#motion').addEventListener('click',()=>setFX(!document.body.classList.contains('fx-off')));
document.querySelector('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.querySelector('.machine').requestFullscreen();}catch{line(entry(),'Pełny ekran jest niedostępny w tej przeglądarce.');scroll();}});
try{theme(localStorage.getItem('crt-theme')||'green');setFX(localStorage.getItem('crt-fx')==='off'||reduced.matches);}catch{setFX(reduced.matches);}
reduced.addEventListener('change',e=>{if(e.matches){stopMatrix();finishTyping();setFX(true);}});
function clock(){document.querySelector('#clock').textContent=new Date().toLocaleTimeString('pl-PL',{timeZone:'Europe/Warsaw',hour:'2-digit',minute:'2-digit'})+' / ONLINE';}clock();setInterval(clock,60000);document.querySelector('#year').textContent=new Date().getFullYear();boot();
