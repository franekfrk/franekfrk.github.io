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
const history=[];let historyIndex=0,draft='',bootTimer,matrixTimer;
const aliases={whoami:'about',ls:'projects',narzedzia:'projects',tools:'projects',kontakt:'contact',cls:'clear','homelab-tools':'homelabtools',amazonSigmarizzextractor:'sigmarizz',sql:'nexosql'};
// Local synthesizer: no audio files, network requests or persistent microphone access.
let audioContext=null, lastClickSound=0, lastPrintSound=0;
function tone(frequency=650,duration=.035,volume=.018,delay=0,type='square') {
 if(!audioContext || audioContext.state!=='running')return;
 try {
  const at=audioContext.currentTime+delay, oscillator=audioContext.createOscillator(), gain=audioContext.createGain();
  oscillator.type=type; oscillator.frequency.setValueAtTime(frequency,at);
  gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(volume,at+.003);
  gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
  oscillator.connect(gain);gain.connect(audioContext.destination);
  oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
  oscillator.start(at);oscillator.stop(at+duration+.01);
 }catch{}
}
function bootSound(){tone(330,.1,.022,0,'sine');tone(495,.1,.018,.12,'sine');tone(660,.16,.018,.24,'sine');}
function unlockAudio(){
 if(audioContext){if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});return;}
 const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
 try{audioContext=new Audio();audioContext.resume().then(bootSound).catch(()=>{});}catch{}
}
function keySound(){const now=performance.now();if(now-lastClickSound<35)return;lastClickSound=now;tone(440+Math.random()*190,.023,.012);}
function printSound(now){if(now-lastPrintSound<90)return;lastPrintSound=now;tone(960,.018,.005);}
document.addEventListener('pointerdown',unlockAudio,{capture:true});
document.addEventListener('keydown',e=>{unlockAudio();if(e.target===input&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&(e.key.length===1||e.key==='Backspace'))keySound();},{capture:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&audioContext?.state==='running')audioContext.suspend().catch(()=>{});});
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
  printSound(now);
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
 bootSound(); finishTyping(); clearTimeout(bootTimer); stopMatrix(); output.replaceChildren();
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

function stopMatrix(){clearInterval(matrixTimer);matrixTimer=null;document.querySelector('#matrix').hidden=true;document.querySelector('#exit-matrix').hidden=true;}
function matrix(parent){stopMatrix();const canvas=document.querySelector('#matrix'),ctx=canvas.getContext('2d');if(!ctx){line(parent,'Animacja nie jest dostępna w tej przeglądarce.');return;}const rect=canvas.parentElement.getBoundingClientRect();canvas.width=Math.round(rect.width);canvas.height=Math.round(rect.height);const drops=Array.from({length:Math.ceil(canvas.width/18)},()=>-Math.random()*30);const color=getComputedStyle(document.body).getPropertyValue('--phosphor').trim();canvas.hidden=false;document.querySelector('#exit-matrix').hidden=false;matrixTimer=setInterval(()=>{ctx.fillStyle='#06100824';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=color;ctx.font='15px monospace';drops.forEach((y,i)=>{ctx.fillText(String.fromCharCode(0x30A0+Math.floor(Math.random()*90)),i*18,y*18);if(y*18>canvas.height&&Math.random()>.97)drops[i]=0;else drops[i]++;});},65);line(parent,'Animacja MATRIX. Naciśnij Esc, aby wrócić.');}
const sessionStarted=performance.now();
let idleTimer, saverFrame=0, saverLast=0, saverX=25, saverY=30, saverDX=65, saverDY=45, poweredOff=false, shutdownTimer, swallowWakeClick=false;
const saver=document.querySelector('#screensaver'), saverLogo=document.querySelector('#saver-logo');
function neofetch(parent){
 const panel=node('div',undefined,'neofetch');
 const portrait=node('pre',undefined,'ascii-portrait');portrait.setAttribute('aria-hidden','true');
 portrait.textContent=[
 '        ___________',
 '      /  F O R G E  ╲',
 '     /_______________╲',
 '    /   ▄▄▄     ▄▄▄   ╲',
 '    |  [▓▓▓]───[▓▓▓]  |',
 '    |        /        |',
 '     ╲      ───      /',
 '      ╲  ░░░░░░░  /',
 '       ╲_________/',
 '      /  M A R C I N ╲',
 '     /_______________╲'
 ].join('\n');panel.append(portrait);
 const info=node('div',undefined,'fetch-info');line(info,'marcin@forge','detail-title');
 for(const [label,value] of [['Imię','Marcin Franckiewicz'],['Warsztat','FORGE'],['Projekty',projects.length+' narzędzi i rozwiązań'],['Obszary','Amazon / nexo / homelab / Minecraft'],['Terminal','FRANCKIEWICZ / OS · CRT 86'],['Luminofor',document.body.classList.contains('amber')?'AMBER':'GREEN'],['Sesja',Math.floor((performance.now()-sessionStarted)/60000)+' min w tej karcie']])line(info,label.padEnd(11)+' '+value);
 const palette=node('div',undefined,'fetch-palette');palette.setAttribute('aria-hidden','true');for(let i=0;i<7;i++)palette.append(node('span','  '));info.append(palette);panel.append(info);parent.append(panel);
}
function projectTree(parent){
 line(parent,'/home/marcin/projects','detail-title');
 const groups=[['amazon',projects.filter(p=>p[5]==='beacon'||p[0]==='sigmarizz')],['nexo',projects.filter(p=>p[5]==='nexo')],['homelab',projects.filter(p=>p[0]==='homelabtools')],['minecraft',projects.filter(p=>p[0]==='nik')]];
 const tree=node('div',undefined,'project-tree');
 groups.forEach(([name,items],i)=>{const last=i===groups.length-1;line(tree,(last?'└── ':'├── ')+name+'/','tree-folder');items.forEach((p,j)=>{const row=node('div',undefined,'tree-leaf');row.append(node('span',(last?'    ':'│   ')+(j===items.length-1?'└── ':'├── ')));button(row,p[1],p[0]);tree.append(row);});});
 parent.append(tree);line(parent,'4 katalogi · '+projects.length+' projektów · kliknij nazwę, aby poznać szczegóły','line muted');
}
function stopSaver(){cancelAnimationFrame(saverFrame);saverFrame=0;saver.hidden=true;saverLast=0;}
function armIdle(){clearTimeout(idleTimer);if(!poweredOff&&!document.hidden)idleTimer=setTimeout(()=>{if(!input.value&&!activeTyping&&!matrixTimer)startSaver();else armIdle();},90000);}
function startSaver(){if(poweredOff)return;finishTyping();stopMatrix();clearTimeout(idleTimer);saver.hidden=false;saverLast=0;
 function bounce(now){if(saver.hidden||poweredOff)return;const dt=saverLast?Math.min((now-saverLast)/1000,.05):0;saverLast=now;
  const maxX=Math.max(0,saver.clientWidth-saverLogo.offsetWidth-20),maxY=Math.max(0,saver.clientHeight-saverLogo.offsetHeight-60);
  saverX+=saverDX*dt;saverY+=saverDY*dt;
  if(saverX<=15||saverX>=maxX){saverDX*=-1;saverX=Math.max(15,Math.min(maxX,saverX));}
  if(saverY<=15||saverY>=maxY){saverDY*=-1;saverY=Math.max(15,Math.min(maxY,saverY));}
  saverLogo.style.transform='translate('+saverX+'px,'+saverY+'px)';saverFrame=requestAnimationFrame(bounce);
 }saverFrame=requestAnimationFrame(bounce);
}
function shutdown(){finishTyping();stopSaver();stopMatrix();clearTimeout(idleTimer);poweredOff=true;
 tone(420,.15,.016,0,'sine');tone(180,.2,.012,.12,'sine');
 document.querySelector('.screen').classList.remove('power-on');document.body.classList.add('shutting-down');
 input.disabled=true;document.querySelector('.quick').inert=true;
 shutdownTimer=setTimeout(()=>{document.body.classList.remove('shutting-down');document.body.classList.add('powered-off');document.querySelector('#power-on').hidden=false;},650);
}
function wake(){clearTimeout(shutdownTimer);poweredOff=false;document.body.classList.remove('shutting-down','powered-off');document.querySelector('#power-on').hidden=true;input.disabled=false;document.querySelector('.quick').inert=false;boot();armIdle();}
function activity(event){
 if(document.hidden)return;
 if(poweredOff||!saver.hidden){if(event.type==='pointerdown')swallowWakeClick=true;event.preventDefault();event.stopImmediatePropagation();if(poweredOff)wake();else{stopSaver();armIdle();}return;}
 armIdle();
}
document.addEventListener('pointerdown',activity,{capture:true});
document.addEventListener('click',event=>{if(swallowWakeClick){swallowWakeClick=false;event.preventDefault();event.stopImmediatePropagation();}},{capture:true});
document.addEventListener('keydown',activity,{capture:true});
document.addEventListener('pointermove',()=>{if(saver.hidden&&!poweredOff)armIdle();},{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(idleTimer);stopSaver();}else armIdle();});
function run(raw){const command=raw.trim();if(!command||poweredOff)return;stopSaver();armIdle();tone(740,.055,.018);finishTyping();clearTimeout(bootTimer);history.push(command);historyIndex=history.length;input.value='';draft='';const parts=command.toLowerCase().split(/\s+/);const cmd=aliases[parts[0]]||parts[0],arg=parts.slice(1).join(' ');if(cmd==='clear'){output.replaceChildren();return;}if(cmd==='reboot'){boot();return;}if(cmd==='exit'){shutdown();return;}if(cmd==='screensaver'){startSaver();return;}const el=entry(command);const project=findProject(cmd);
 if(project)detail(el,project);
 else if(cmd==='neofetch')neofetch(el);
 else if(cmd==='tree')projectTree(el);
 else if(cmd==='help'){line(el,'DOSTĘPNE POLECENIA','detail-title');for(const [c,d] of [['about','Kim jestem i co tworzę'],['neofetch','Portret ASCII i profil terminala'],['tree','Drzewo katalogów z projektami'],['screensaver','Wygaszacz FORGE · sam startuje po 90 s'],['exit','Zgaś kineskop · kliknij, aby włączyć'],['projects','Wszystkie 15 projektów i narzędzi'],['beacons','10 narzędzi Beacon z FORGE'],['nexo','Migrator i skrypty SQL do nexo'],['open nazwa','Otwórz stronę projektu'],['forge','Moja kuźnia pomysłów i technologii'],['github','Profil GitHub'],['contact','Kontakt i rozmowa o projekcie'],['theme green','Zielony luminofor'],['theme amber','Bursztynowy luminofor'],['clear','Wyczyść ekran'],['reboot','Uruchom terminal ponownie'],['date','Aktualny czas w Polsce'],['matrix','Deszcz znaków · Esc kończy']]){const row=node('div',undefined,'help-row');button(row,c,c);row.append(node('span',d));el.append(row);}line(el,'Każde narzędzie ma własną komendę:','category');const row=node('div',undefined,'links');projects.forEach(p=>button(row,p[0],p[0]));el.append(row);line(el,'Tab — podpowiedzi; ↑ / ↓ — historia. Nie uruchamiam komend systemowych.','line muted');}
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
 else {const names=['help','about','projects','neofetch','tree','screensaver','exit','contact','forge','github',...projects.map(p=>p[0])];const suggestion=names.find(n=>n.startsWith(cmd.slice(0,3)));line(el,'Nie znam polecenia „'+command+'”. '+(suggestion?'Czy chodziło o '+suggestion+'?':'Wpisz help.'));}animateEntry(el);scroll();}
form.addEventListener('submit',e=>{e.preventDefault();run(input.value);});
document.addEventListener('click',e=>{const b=e.target.closest('[data-command]');if(b)run(b.dataset.command);});
input.addEventListener('keydown',e=>{if(e.key==='ArrowUp'){e.preventDefault();if(historyIndex===history.length)draft=input.value;if(historyIndex>0)input.value=history[--historyIndex];}else if(e.key==='ArrowDown'){e.preventDefault();if(historyIndex<history.length)historyIndex++;input.value=historyIndex===history.length?draft:history[historyIndex];}else if(e.key==='Tab'){e.preventDefault();const text=input.value.toLowerCase();const opening=text.startsWith('open ');const prefix=opening?text.slice(5):text;const options=(opening?projects.map(p=>p[0]):['help','about','projects','beacons','neofetch','tree','screensaver','exit','contact','forge','github','clear','reboot','date','matrix','theme green','theme amber','open ',...projects.map(p=>p[0])]).filter(n=>n.startsWith(prefix));if(options.length===1)input.value=(opening?'open ':'')+options[0];else if(options.length){const el=entry();line(el,options.join('  '),'line muted');scroll();}}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){stopMatrix();finishTyping();}const keys={F1:'help',F2:'about',F3:'projects',F4:'contact'};if(keys[e.key]){e.preventDefault();run(keys[e.key]);}});
document.querySelector('#exit-matrix').addEventListener('click',stopMatrix);
document.querySelector('#color').addEventListener('click',()=>theme(document.body.classList.contains('amber')?'green':'amber'));
document.querySelector('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.querySelector('.machine').requestFullscreen();}catch{line(entry(),'Pełny ekran jest niedostępny w tej przeglądarce.');scroll();}});
try{theme(localStorage.getItem('crt-theme')||'green');localStorage.removeItem('crt-fx');}catch{}
function clock(){document.querySelector('#clock').textContent=new Date().toLocaleTimeString('pl-PL',{timeZone:'Europe/Warsaw',hour:'2-digit',minute:'2-digit'})+' / ONLINE';}clock();setInterval(clock,60000);document.querySelector('#year').textContent=new Date().getFullYear();boot();armIdle();
