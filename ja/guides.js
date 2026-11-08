// STUDY GUIDES (2026-11-08, Andrew): the class study guides, readable in the
// app with help on every Japanese word. Pure teaching - nothing here is
// scored or touches a word's score.
//
// The guides are private (they follow the class handouts), so like the
// Genki word list they never sit on the public site: one file holds every
// guide, kept in the Language drills folder's private/ and loaded on each
// device from Settings > Study guides (it lives in this browser's storage).
// No file, no Study guides on the Grammar page. A new guide means a new
// version of the same file, loaded over the old one.
//
// File: {format: 'jp-drill-study-guides', version: 1, updated: 'YYYY-MM-DD',
//        words: {key: word}, guides: [{id, title, level, blocks: [...]}]}
// made by tools/study-guides/ from the guides' PDFs. A block is
// {t: 'h2'|'h3'|'p'|'ul'|'ul2'|'ol', runs} or {t: 'table', rows: [[runs]]};
// a run is [text, flags] or [[key | {t: text}, ...], flags] - a Japanese
// chunk as word blocks ('b' bold, 'i' italic). A word: {jp, kind (word,
// verb, adj, name, particle, ending), r (romaji), e? (English), g? (what the
// particle or ending does), stem/end/base for a verb or adjective form}.
//
// Every Japanese word is a block you can hold: the bubble shows its romaji
// (can't read it). Slide towards the bubble and let go for the full version:
// romaji, English and what its particle or ending does (can read it, don't
// know it). Same gesture as a verb on the word lists (attachTilePeek). The
// Help switch at the top of a guide turns this off, to test yourself on a
// guide you've already been through. Answers stay folded until tapped.

const STUDY_GUIDES_KEY = APP.storagePrefix + 'StudyGuides';
const STUDY_GUIDE_HELP_KEY = APP.storagePrefix + 'StudyGuideHelp';
const STUDY_GUIDES_FORMAT = 'jp-drill-study-guides';
let STUDY_GUIDES = null;
let currentStudyGuide = null;

function validateStudyGuides(pack) {
  if (!pack || typeof pack !== 'object' || pack.format !== STUDY_GUIDES_FORMAT) return "That isn't a study guides file.";
  if (!Array.isArray(pack.guides) || !pack.guides.length || !pack.words || typeof pack.words !== 'object') return 'The file has no guides in it.';
  if (pack.guides.some(g => !g || typeof g.id !== 'string' || typeof g.title !== 'string' || !Array.isArray(g.blocks))) return 'A guide in the file is incomplete.';
  return null;
}

function loadStudyGuides() {
  STUDY_GUIDES = null;
  try {
    const raw = localStorage.getItem(STUDY_GUIDES_KEY);
    if (!raw) return;
    const pack = JSON.parse(raw);
    if (!validateStudyGuides(pack)) STUDY_GUIDES = pack;
  } catch (e) { /* storage unavailable or corrupt - no guides */ }
}

function studyGuideHelpOn() {
  try { return localStorage.getItem(STUDY_GUIDE_HELP_KEY) !== 'off'; } catch (e) { return true; }
}

// --- Settings > Study guides ---
function updateStudyGuidesStatus() {
  const status = document.getElementById('study-guides-status');
  const remove = document.getElementById('study-guides-remove-btn');
  if (!status) return;
  if (STUDY_GUIDES) {
    const n = STUDY_GUIDES.guides.length;
    let text = `${n} guide${n === 1 ? '' : 's'} on this device`;
    if (STUDY_GUIDES.updated) {
      const d = new Date(STUDY_GUIDES.updated + 'T12:00:00');
      if (!isNaN(d)) text += ` (file of ${d.getDate()} ${d.toLocaleString('en-GB', { month: 'short' })} ${d.getFullYear()})`;
    }
    status.textContent = text + '. They\'re on the Grammar page.';
  } else {
    status.textContent = 'Load the study guides file to read the class guides here, with help on every Japanese word. Kept on this device only.';
  }
  if (remove) remove.style.display = STUDY_GUIDES ? '' : 'none';
}

function showStudyGuidesMsg(text, isError) {
  const el = document.getElementById('study-guides-msg');
  if (!el) return;
  el.textContent = text;
  el.style.color = isError ? 'var(--wrong, #e5484d)' : '';
  clearTimeout(showStudyGuidesMsg._t);
  showStudyGuidesMsg._t = setTimeout(() => { el.textContent = ''; }, 6000);
}

function triggerStudyGuidesPicker() {
  const input = document.getElementById('study-guides-input');
  if (input) { input.value = ''; input.click(); }
}

function handleStudyGuidesSelected(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    let pack;
    try { pack = JSON.parse(reader.result); } catch (e) { showStudyGuidesMsg("That file couldn't be read.", true); return; }
    const problem = validateStudyGuides(pack);
    if (problem) { showStudyGuidesMsg(problem, true); return; }
    try {
      localStorage.setItem(STUDY_GUIDES_KEY, JSON.stringify(pack));
    } catch (e) { showStudyGuidesMsg("There isn't room to keep the file on this device.", true); return; }
    loadStudyGuides();
    updateStudyGuidesStatus();
    showStudyGuidesMsg('Study guides loaded.');
  };
  reader.readAsText(file);
}

function removeStudyGuides() {
  try { localStorage.removeItem(STUDY_GUIDES_KEY); } catch (e) { /* nothing stored */ }
  loadStudyGuides();
  updateStudyGuidesStatus();
  showStudyGuidesMsg('Study guides removed from this device.');
}

// --- Grammar page: one card per guide, newest lesson first ---
function renderStudyGuideCards(view, head, card) {
  if (!STUDY_GUIDES) return;
  head('Study guides');
  STUDY_GUIDES.guides.slice().reverse().forEach(g => card(g.title, g.level || null, () => showStudyGuide(g.id), g.sub || ''));
}

// --- The guide screen ---
function showStudyGuide(id) {
  if (!STUDY_GUIDES) return;
  const g = STUDY_GUIDES.guides.find(x => x.id === id);
  if (!g) return;
  currentStudyGuide = g;
  showScreen('study-guide');
  renderStudyGuide();
  const sc = document.getElementById('screen-study-guide');
  if (sc) sc.scrollTop = 0;
  window.scrollTo(0, 0);
}

function toggleStudyGuideHelp() {
  try { localStorage.setItem(STUDY_GUIDE_HELP_KEY, studyGuideHelpOn() ? 'off' : 'on'); } catch (e) { /* private mode */ }
  renderStudyGuide();
}

function sgEsc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Japanese always through the small-kana rule (markSmallKana).
function sgJp(s) {
  return markSmallKana(String(s));
}

function sgRunsHtml(runs) {
  const W = STUDY_GUIDES.words;
  return runs.map(([x, f]) => {
    let h;
    if (typeof x === 'string') h = sgEsc(x);
    else {
      h = x.map(it => {
        if (typeof it !== 'string') return sgJp(it.t);
        const w = W[it];
        if (!w) return '';
        const inner = w.end && w.stem ? `${sgJp(w.stem)}<span class="sg-end">${sgJp(w.end)}</span>` : sgJp(w.jp);
        return `<span class="sg-w sg-k-${sgEsc(w.kind)}" data-k="${sgEsc(it)}">${inner}</span>`;
      }).join('');
      h = `<span class="sg-jp">${h}</span>`;
    }
    if (f && f.includes('b')) h = `<strong>${h}</strong>`;
    if (f && f.includes('i')) h = `<em>${h}</em>`;
    return h;
  }).join('');
}

function sgRunsText(runs) {
  const W = STUDY_GUIDES.words;
  return runs.map(([x]) => typeof x === 'string' ? x : x.map(it => typeof it === 'string' ? (W[it] || {}).jp || '' : it.t).join('')).join('');
}

function renderStudyGuide() {
  const g = currentStudyGuide;
  const body = document.getElementById('study-guide-body');
  if (!g || !body || !STUDY_GUIDES) return;
  const help = studyGuideHelpOn();
  document.getElementById('study-guide-title').textContent = g.title;
  const card = document.getElementById('study-guide-help-card');
  if (card) card.classList.toggle('selected', help);
  // Blocks to HTML. Lists gather into <ul>/<ol>; everything under the
  // Answers heading folds away, one fold per sub-heading.
  let html = '';
  let list = null;   // 'ul' | 'ol' while a list is open
  let sub = false;   // a nested ul2 open inside the last item
  let inAnswers = false, foldOpen = false;
  const closeList = () => {
    if (sub) { html += '</ul></li>'; sub = false; }
    else if (list) html += '</li>';
    if (list) { html += `</${list}>`; list = null; }
  };
  const closeFold = () => { closeList(); if (foldOpen) { html += '</div></details>'; foldOpen = false; } };
  g.blocks.forEach(b => {
    if (b.t === 'h2') {
      closeFold();
      inAnswers = /^answers\b/i.test(sgRunsText(b.runs).trim());
      html += `<h3 class="sg-h2">${sgRunsHtml(b.runs)}</h3>`;
      return;
    }
    if (b.t === 'h3') {
      if (inAnswers) {
        closeFold();
        html += `<details class="sg-fold"><summary>${sgRunsHtml(b.runs)}</summary><div class="sg-fold-body">`;
        foldOpen = true;
      } else {
        closeList();
        html += `<h4 class="sg-h3">${sgRunsHtml(b.runs)}</h4>`;
      }
      return;
    }
    if (inAnswers && !foldOpen) {
      html += '<details class="sg-fold"><summary>Answers</summary><div class="sg-fold-body">';
      foldOpen = true;
    }
    if (b.t === 'ul2') {
      if (!list) { html += '<ul class="sg-list"><li class="sg-li-empty">'; list = 'ul'; }
      if (!sub) { html += '<ul class="sg-sub">'; sub = true; }
      html += `<li>${sgRunsHtml(b.runs)}</li>`;
      return;
    }
    if (b.t === 'ul' || b.t === 'ol') {
      // Numbered items keep their own numbers (they're in the text).
      const tag = b.t === 'ol' ? 'ol' : 'ul';
      if (list !== tag) { closeList(); html += `<${tag} class="sg-list${tag === 'ol' ? ' sg-ol' : ''}">`; list = tag; }
      else { if (sub) { html += '</ul>'; sub = false; } html += '</li>'; }
      html += `<li>${sgRunsHtml(b.runs)}`;
      return;
    }
    closeList();
    if (b.t === 'table') {
      html += '<div class="sg-table-wrap"><table class="sg-table">' + b.rows.map((row, i) =>
        '<tr>' + row.map(c => `<${i ? 'td' : 'th'}>${sgRunsHtml(c)}</${i ? 'td' : 'th'}>`).join('') + '</tr>').join('') + '</table></div>';
      return;
    }
    html += `<p class="sg-p">${sgRunsHtml(b.runs)}</p>`;
  });
  closeFold();
  body.innerHTML = html;
  body.classList.toggle('sg-help-off', !help);
  if (!help) return;
  body.querySelectorAll('.sg-w').forEach(el => {
    const w = STUDY_GUIDES.words[el.dataset.k];
    if (!w) return;
    attachTilePeek(el, { jp: w.jp, romaji: w.r || '', en: w.e || '', guideWord: w, speakAs: w.kind === 'particle' ? ({ 'は': 'わ', 'へ': 'え' })[w.jp] : undefined });
  });
}

// What a held guide word's bubble shows (from jaPeekFill): the word and its
// romaji only - the first level of help - and the way to the full version.
function studyGuidePeekFill(b, item) {
  b.innerHTML = `<div class="peek-jp">${sgJp(item.jp)}</div><div class="peek-romaji">${sgEsc(item.romaji)}</div>`
    + '<div class="peek-hint"><span class="peek-arrow">↑</span> slide here for the meaning</div>';
}

// The full version (slide and let go): romaji, English, what the particle
// or ending does, and for a verb or adjective form, its dictionary form.
function showStudyGuideWord(w) {
  const overlay = document.getElementById('verb-forms-overlay');
  const body = document.getElementById('verb-forms-body');
  if (!overlay || !body) return;
  const kindLabel = { particle: 'Particle', ending: 'Ending', name: 'Name' }[w.kind] || '';
  let h = `<div class="vf-title" data-say="${sgEsc(w.kind === 'particle' && ({ 'は': 'わ', 'へ': 'え' })[w.jp] || w.jp)}">${sgJp(w.jp)}</div>`;
  h += `<div class="vf-title-sub">${sgEsc(w.r || '')}${w.e ? ' · ' + sgEsc(w.e) : ''}</div>`;
  if (w.end && w.base) {
    h += `<div class="vf-section">${sgJp(w.stem)}<span class="sg-end">${sgJp(w.end)}</span></div>`;
    h += `<div class="vf-note"><strong>${sgJp(w.end)}</strong> — ${sgEsc(w.g || '')}</div>`;
    h += `<div class="vf-note">Dictionary form: ${sgJp(w.base)}</div>`;
  } else if (w.g) {
    if (kindLabel) h += `<div class="vf-section">${kindLabel}</div>`;
    h += `<div class="vf-note">${sgEsc(w.g)}</div>`;
  } else if (kindLabel) {
    h += `<div class="vf-section">${kindLabel}</div>`;
  }
  // A verb the app knows: its forms window is one tap away.
  const base = w.kind === 'verb' ? (w.base || w.jp) : null;
  const vItem = base ? sgFindVocabItem(base) : null;
  if (vItem && typeof isVerbItem === 'function' && isVerbItem(vItem)) {
    h += '<button type="button" class="ds-btn sg-forms-btn" id="sg-forms-btn">All its forms</button>';
  }
  body.innerHTML = h;
  body.querySelectorAll('[data-say]').forEach(el => { el.onclick = () => speakJapanese(el.dataset.say); });
  const fb = document.getElementById('sg-forms-btn');
  if (fb) fb.onclick = () => showVerbFormsPopup(vItem);
  overlay._openedAt = Date.now(); // the lifting finger mustn't count as a tap outside
  body.parentElement.scrollTop = 0;
  overlay.classList.add('show');
}

function sgFindVocabItem(jp) {
  for (const k of Object.keys(VOCAB)) for (const i of VOCAB[k].items || []) if (i.jp === jp) return i;
  return null;
}

loadStudyGuides();
document.addEventListener('DOMContentLoaded', updateStudyGuidesStatus);
