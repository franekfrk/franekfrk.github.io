const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const theme = document.querySelector('#theme');
function setTheme(light) { document.body.classList.toggle('light', light); theme.setAttribute('aria-label', light ? 'Włącz ciemny motyw' : 'Włącz jasny motyw'); }
try { setTheme(localStorage.getItem('mf-theme') === 'light'); } catch {}
theme.addEventListener('click', () => { const light = !document.body.classList.contains('light'); setTheme(light); try { localStorage.setItem('mf-theme', light ? 'light' : 'dark'); } catch {} });
const visual = document.querySelector('#visual'), portrait = document.querySelector('#portrait');
visual.addEventListener('pointermove', e => { if (reduced.matches || e.pointerType === 'touch') return; const r = visual.getBoundingClientRect(); portrait.style.transform = `perspective(800px) rotateX(${-(e.clientY-r.top-r.height/2)/30}deg) rotateY(${(e.clientX-r.left-r.width/2)/22}deg) rotate(-5deg)`; });
visual.addEventListener('pointerleave', () => { portrait.style.transform = ''; });
const spark = document.querySelector('#spark');
spark.addEventListener('click', () => { spark.classList.remove('burst'); void spark.offsetWidth; spark.classList.add('burst'); setTimeout(() => spark.classList.remove('burst'), 650); if (reduced.matches || !visual.animate) return; visual.animate([{filter:'brightness(1)'},{filter:'brightness(1.6)'},{filter:'brightness(1)'}], {duration:650}); });
document.querySelector('#year').textContent = new Date().getFullYear();
function tick() { document.querySelector('#clock').textContent = new Intl.DateTimeFormat('pl-PL', {timeZone:'Europe/Warsaw',hour:'2-digit',minute:'2-digit'}).format(new Date()) + ' / CZAS NA POMYSŁ'; }
tick(); setInterval(tick, 60000);
const form = document.querySelector('#terminal-form'), input = document.querySelector('#command'), output = document.querySelector('#terminal-output');
const responses = {help:'Dostępne polecenia: whoami, projects, github, forge, date, clear.\nMały bonus: wpisz iskra.',whoami:'Marcin Franckiewicz\nTwórca FORGE i narzędzi Beacon.',projects:'FORGE → forge.franckiewicz.eu\nVendorBeacon / BidBeacon / CostBeacon\nLinki znajdziesz w sekcji projektów.',github:'github.com/franekfrk — link czeka u góry strony.',forge:'Kuźnia pomysłów i technologii.\nOdwiedź forge.franckiewicz.eu.',iskra:'✳ Pomysł jest początkiem. Teraz czas coś stworzyć.'};
form.addEventListener('submit', e => { e.preventDefault(); const command = input.value.trim().toLowerCase(); if (!command) return; input.value = ''; if (command === 'clear') { output.replaceChildren(); return; } const prompt = document.createElement('p'); prompt.textContent = '➜ ' + command; const answer = document.createElement('p'); answer.style.whiteSpace = 'pre-line'; answer.textContent = command === 'date' ? new Date().toLocaleString('pl-PL', {timeZone:'Europe/Warsaw'}) : responses[command] || 'Nie znam tego polecenia. Wpisz help.'; output.append(prompt, answer); while (output.children.length > 40) output.firstElementChild.remove(); output.scrollTop = output.scrollHeight; if (command === 'iskra') spark.click(); });
