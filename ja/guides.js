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
// know it). Same gesture as a verb on the word lists (attachTilePeek). Help
// is always on (the Help switch was removed 9 Nov: a block costs nothing
// when it isn't held). Answers stay folded until tapped.

const STUDY_GUIDES_KEY = APP.storagePrefix + 'StudyGuides';
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

// The old Help switch's setting, gone with the switch.
try { localStorage.removeItem(APP.storagePrefix + 'StudyGuideHelp'); } catch (e) { /* private mode */ }

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

function sgEsc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Japanese always through the small-kana rule (markSmallKana).
function sgJp(s) {
  return markSmallKana(String(s));
}

const SG_TRAIL = /^[。、？！?!）)\].,:;]+/;

function sgRunsHtml(runs, u) {
  const W = STUDY_GUIDES.words;
  // Punctuation right after a Japanese run (a closing bracket, a full stop)
  // is moved onto that run's last block, so it can't start a line alone.
  runs = runs.map(r => r.slice());
  for (let i = 1; i < runs.length; i++) {
    const [x] = runs[i], prev = runs[i - 1][0];
    if (typeof x === 'string' && Array.isArray(prev) && SG_TRAIL.test(x) && typeof prev[prev.length - 1] === 'string') {
      const m = x.match(SG_TRAIL)[0];
      runs[i - 1][0] = prev.concat([{ t: m, ascii: true }]);
      runs[i][0] = x.slice(m.length);
    }
  }
  SG_READ.joinJa = null;
  const out = runs.map(([x, f]) => {
    let h;
    if (typeof x === 'string') h = sgEsc(x);
    else {
      const parts = x.map(it => {
        if (typeof it !== 'string') return { text: it.t, h: it.ascii ? `<span class="sg-punct">${sgEsc(it.t)}</span>` : sgJp(it.t) };
        const w = W[it];
        if (!w) return { h: '' };
        const inner = w.end && w.stem ? `${sgJp(w.stem)}<span class="sg-end">${sgJp(w.end)}</span>` : sgJp(w.jp);
        return { word: true, h: `<span class="sg-w sg-k-${sgEsc(w.kind)}" data-k="${sgEsc(it)}">${inner}</span>` };
      });
      // Keep a 〜 with the block after it, and 。、？！ with the block before
      // it, so neither ends up alone at the start or end of a line.
      for (let i = 0; i < parts.length; i++) {
        const t = parts[i].text;
        if (t && /〜$/.test(t) && parts[i + 1] && parts[i + 1].word) {
          parts[i + 1].h = `<span class="sg-nb">${parts[i].h}${parts[i + 1].h}</span>`;
          parts[i].h = '';
        } else if (t && SG_TRAIL.test(t) && i > 0 && parts[i - 1].word) {
          const m = t.match(SG_TRAIL)[0];
          const mh = x[i].ascii ? parts[i].h : sgJp(m);
          parts[i - 1].h = `<span class="sg-nb">${parts[i - 1].h}${mh}</span>`;
          parts[i].h = x[i].ascii ? '' : sgJp(t.slice(m.length));
        }
      }
      h = parts.map(q => q.h).join('');
      h = `<span class="gd-jp">${h}</span>`;
    }
    if (f && f.includes('b')) h = `<strong>${h}</strong>`;
    if (f && f.includes('i')) h = `<em>${h}</em>`;
    // Read aloud: each run of a line the reader can read is one piece it
    // says (English or Japanese), and lights while it's being said.
    if (u != null) { const n = sgReadSeg(u, x); if (n != null) h = `<span class="sg-r" data-s="${n}">${h}</span>`; }
    return h;
  }).join('');
  SG_READ.joinJa = null;
  return out;
}

function sgRunsText(runs) {
  const W = STUDY_GUIDES.words;
  return runs.map(([x]) => typeof x === 'string' ? x : x.map(it => typeof it === 'string' ? (W[it] || {}).jp || '' : it.t).join('')).join('');
}

function renderStudyGuide() {
  const g = currentStudyGuide;
  const body = document.getElementById('study-guide-body');
  if (!g || !body || !STUDY_GUIDES) return;
  document.getElementById('study-guide-title').textContent = g.title;
  sgReaderClose();
  SG_READ.units = []; SG_READ.segs = [];
  const unit = heading => { SG_READ.units.push({ heading, segs: [] }); return SG_READ.units.length - 1; };
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
      const u = unit(2);
      html += `<h3 class="sg-h2" data-u="${u}">${sgRunsHtml(b.runs, u)}</h3>`;
      return;
    }
    if (b.t === 'h3') {
      if (inAnswers) {
        closeFold();
        html += `<details class="sg-fold"><summary>${sgRunsHtml(b.runs)}</summary><div class="sg-fold-body">`;
        foldOpen = true;
      } else {
        closeList();
        const u = unit(3);
        html += `<h4 class="sg-h3" data-u="${u}">${sgRunsHtml(b.runs, u)}</h4>`;
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
      const u = unit(0);
      html += `<li data-u="${u}">${sgRunsHtml(b.runs, u)}</li>`;
      return;
    }
    if (b.t === 'ul' || b.t === 'ol') {
      // Numbered items keep their own numbers (they're in the text).
      const tag = b.t === 'ol' ? 'ol' : 'ul';
      if (list !== tag) { closeList(); html += `<${tag} class="sg-list${tag === 'ol' ? ' sg-ol' : ''}">`; list = tag; }
      else { if (sub) { html += '</ul>'; sub = false; } html += '</li>'; }
      const u = unit(0);
      html += `<li data-u="${u}">${sgRunsHtml(b.runs, u)}`;
      return;
    }
    closeList();
    if (b.t === 'table') {
      html += '<div class="sg-table-wrap"><table class="sg-table">' + b.rows.map((row, i) => {
        const u = unit(0);
        return `<tr data-u="${u}">` + row.map(c => {
          // A short cell that's all Japanese (えいがを みませんか) stays on one
          // line, as in the PDF; a whole sentence still wraps between words.
          const tag = i ? 'td' : 'th', txt = sgRunsText(c).trim();
          const jpOnly = !/[A-Za-z]/.test(txt) && txt.length <= 12;
          return `<${tag}${jpOnly ? ' class="sg-td-jp"' : ''}>${sgRunsHtml(c, u)}</${tag}>`;
        }).join('') + '</tr>';
      }).join('') + '</table></div>';
      return;
    }
    const u = unit(0);
    html += `<p class="sg-p" data-u="${u}">${sgRunsHtml(b.runs, u)}</p>`;
  });
  closeFold();
  body.innerHTML = html;
  sgMarkWideTables(body);
  const blocks = [...body.querySelectorAll('.sg-w')];
  blocks.forEach((el, i) => {
    let w = STUDY_GUIDES.words[el.dataset.k];
    if (!w) return;
    // ありません straight after じゃ / では is "isn't", not "there isn't" (17 Nov 2026).
    const prev = blocks[i - 1] && STUDY_GUIDES.words[blocks[i - 1].dataset.k];
    if (w.base === 'あります' && /^ありません(でした)?$/.test(w.jp) && prev && /(じゃ|では)$/.test(prev.jp)) w = Object.assign({}, w, { copula: true });
    attachTilePeek(el, { jp: w.jp, romaji: w.r || '', en: w.e || '', guideWord: w, speakAs: w.kind === 'particle' ? ({ 'は': 'わ', 'へ': 'え' })[w.jp] : undefined });
  });
}

// What a held guide word's bubble shows (from jaPeekFill): the word and its
// romaji only - the first level of help - and the way to the full version.
function studyGuidePeekFill(b, item) {
  b.innerHTML = `<div class="peek-jp">${sgJp(item.jp)}</div><div class="peek-romaji">${sgEsc(item.romaji)}</div>`
    + '<div class="peek-hint"><span class="peek-arrow">↑</span> slide here for the meaning</div>';
}

// What a verb or adjective form means as it stands (17 Nov 2026, Andrew):
// おもしろくないです is "isn't interesting", not the dictionary form's
// "interesting / fun" - which stays, with the dictionary form, below.
function sgFormEn(w) {
  if (w.copula) return /でした$/.test(w.jp) ? "wasn't (with じゃ / では)" : "isn't (with じゃ / では)";
  if (!w.end || !w.base || !w.e) return '';
  const F = LANG.forms;
  if (w.kind === 'adj') {
    const a = F.adjEnWord(w.e);
    return { い: a, いです: a, くない: "isn't " + a, くないです: "isn't " + a, かった: 'was ' + a, かったです: 'was ' + a, くなかった: "wasn't " + a, くなかったです: "wasn't " + a }[w.end] || '';
  }
  if (w.kind === 'verb') {
    const v = F.verbEnglishForms(w.e);
    return { ます: v.nonPastAff, ません: v.nonPastNeg, ました: v.pastAff, ませんでした: v.pastNeg, ましょう: v.lets, ましょうか: 'shall we ' + v.nonPastAff + '?', ませんか: v.invite, たい: v.taiAff, たいです: v.taiAff, たくない: v.taiNeg, たくないです: v.taiNeg, たかった: v.taiPast, たかったです: v.taiPast }[w.end] || '';
  }
  return '';
}

// The full version (slide and let go): romaji, English, what the particle
// or ending does, and for a verb or adjective form, its dictionary form.
function showStudyGuideWord(w) {
  const overlay = document.getElementById('verb-forms-overlay');
  const body = document.getElementById('verb-forms-body');
  if (!overlay || !body) return;
  const kindLabel = { particle: 'Particle', ending: 'Ending', name: 'Name' }[w.kind] || '';
  let h = `<div class="vf-title" data-say="${sgEsc(w.kind === 'particle' && ({ 'は': 'わ', 'へ': 'え' })[w.jp] || w.jp)}">${sgJp(w.jp)}</div>`;
  const formEn = sgFormEn(w);
  h += `<div class="vf-title-sub">${sgEsc(w.r || '')}${formEn || w.e ? ' · ' + sgEsc(formEn || w.e) : ''}</div>`;
  if (w.copula) {
    h += `<div class="vf-note">After じゃ or では, ありません makes "isn't": しずかじゃ ありません — isn't quiet. (On its own, ありません is "there isn't".)</div>`;
  } else if (w.end && w.base) {
    h += `<div class="vf-section">${sgJp(w.stem)}<span class="sg-end">${sgJp(w.end)}</span></div>`;
    h += `<div class="vf-note"><strong>${sgJp(w.end)}</strong> — ${sgEsc(w.g || '')}</div>`;
    h += `<div class="vf-note">Dictionary form: ${sgJp(w.base)}${formEn && w.e ? ' — ' + sgEsc(w.e) : ''}</div>`;
  } else if (w.g) {
    if (kindLabel) h += `<div class="vf-section">${kindLabel}</div>`;
    h += `<div class="vf-note">${sgEsc(w.g)}</div>`;
  } else if (kindLabel) {
    h += `<div class="vf-section">${kindLabel}</div>`;
  }
  // A verb the app knows: its forms window is one tap away.
  const base = w.kind === 'verb' && !w.copula ? (w.base || w.jp) : null;
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

// A table wider than the screen scrolls sideways: its right edge fades
// while there's more to see (the skeleton tables keep their left-to-right
// order rather than being squeezed).
function sgMarkWideTables(root) {
  root.querySelectorAll('.sg-table-wrap').forEach(w => {
    const update = () => w.classList.toggle('sg-more', w.scrollLeft + w.clientWidth < w.scrollWidth - 2);
    update();
    if (!w.dataset.sgWatch) { w.dataset.sgWatch = '1'; w.addEventListener('scroll', update, { passive: true }); }
  });
}
window.addEventListener('resize', () => {
  const body = document.getElementById('study-guide-body');
  if (body && body.offsetParent) sgMarkWideTables(body);
});

// --- Read aloud (26 Nov 2026, Andrew) ---------------------------------------
// The guide read to you while you read along: hearing each word as you see
// it keeps the reading going past the kana you're still slow on. For
// reading at the screen, not for listening with it off: the bar's buttons
// and the lit line are the point, and the device's voice stops when the
// screen locks anyway (the screen is kept awake while it reads).
//
// The guide is read line by line - a paragraph, a list item, a heading, a
// table row - each line lit, and within it the piece being said (English
// in an English voice, Japanese in the Japanese voice: one voice can't read
// both). Lines in a folded answer are skipped until it's opened. Word by
// word lighting was ruled out: browsers only report where a voice is for
// some voices, and Japanese has no spaces to find the words by.
//
// One short utterance at a time, never pause()/resume(): Chrome's pause is
// unreliable on Android and it cuts long speech off. So Pause stops and
// remembers the line, and Play starts that line again. Holding a word (its
// romaji bubble speaks it) pauses the reading; tapping a line reads from
// there. Nothing is scored or stored except the speed.

// joinJa: the piece just added, while only spaces have followed it - the
// next piece in the same language joins it, so この パソコンは あたらしいです
// is said in one breath with its own intonation, not as three words, and an
// English sentence with a word in italics isn't cut in three.
const SG_READ = { units: [], segs: [], joinJa: null };   // filled by renderStudyGuide
const SG_READ_SPEED_KEY = APP.storagePrefix + 'GuideReadSpeed';
const SG_READ_SPEEDS = [1, 0.85, 0.7, 1.15];
let sgRead = null;   // { pos, playing, gen, el, segKey, utter, lock } while the bar is open

// One piece to say: which line, and its text and language. Returns its
// number, or null for nothing to say (a lone 〜, a dash).
function sgReadSeg(u, x) {
  const W = STUDY_GUIDES.words;
  let lang, text;
  if (typeof x === 'string') {
    if (!x.trim()) return null;   // a space: the piece before can carry on past it
    lang = 'en';
    text = x.replace(/_{2,}/g, ' blank ').replace(/[→·]/g, ', ').replace(/\s\/\s/g, ' or ').replace(/[…✖✗★○◎△〜]/g, ' ')
      .replace(/(^|\s)[-–—](?=\w)/g, '$1').replace(/\s+/g, ' ').trim();
  } else {
    lang = 'ja';
    // A particle on its own is said as a particle: は "wa", へ "e".
    const one = x.length === 1 && typeof x[0] === 'string' && W[x[0]];
    if (one && one.kind === 'particle' && ({ 'は': 'わ', 'へ': 'え' })[one.jp]) text = ({ 'は': 'わ', 'へ': 'え' })[one.jp];
    else text = x.map(it => typeof it === 'string' ? (W[it] || {}).jp || '' : it.t).join('');
    text = text.replace(/[〜~…]/g, ' ').trim();
  }
  if (!/[\p{L}\p{N}]/u.test(text)) { SG_READ.joinJa = null; return null; }
  const j = SG_READ.joinJa;
  if (j != null && SG_READ.segs[j].lang === lang) { SG_READ.segs[j].text += ' ' + text; return j; }
  SG_READ.segs.push({ u, lang, text });
  const n = SG_READ.segs.length - 1;
  SG_READ.units[u].segs.push(n);
  SG_READ.joinJa = n;
  return n;
}

function sgReadSpeed() {
  try { const v = parseFloat(localStorage.getItem(SG_READ_SPEED_KEY)); if (SG_READ_SPEEDS.includes(v)) return v; } catch (e) { /* private mode */ }
  return 1;
}

// English: a British voice on the device if there is one, the device's own
// English voice otherwise. Japanese: the app's usual voice (LANG.pickVoice).
function sgReadVoice(lang) {
  const voices = SPEECH_SUPPORTED ? window.speechSynthesis.getVoices() : [];
  if (lang === 'ja') return LANG.pickVoice(voices).voice;
  const want = chosenVoiceName('en');
  return (want && voices.find(v => v.name === want)) || sgEnVoices(voices)[0] || null;
}
// English voices, best first: British, then the rest (ranked as for
// Japanese - downloaded Premium / Enhanced first, novelty voices last).
function sgEnVoices(voices) {
  return [...LANG.rankVoices(voices, /^en[-_]gb/i, /Google|Daniel|Serena|Kate|Stephanie|Arthur|Martha/), ...LANG.rankVoices(voices, /^en(?![-_]gb)/i, /Google|Samantha/)];
}

// --- Settings > Voices (26 Nov 2026) ---
// Browsers don't use the voices chosen in the computer's own settings (on a
// Mac, Chrome picked a robotic Japanese voice and an old English one), so
// each device can choose here: the Japanese voice (word tiles and guides)
// and the English one (reading guides aloud). Kept on this device only;
// Automatic is the best-sounding on offer.
const VOICE_KEYS = { ja: APP.storagePrefix + 'VoiceJa', en: APP.storagePrefix + 'VoiceEn' };
function chosenVoiceName(lang) {
  try { return localStorage.getItem(VOICE_KEYS[lang]) || ''; } catch (e) { return ''; }
}
function voicesFill() {
  if (!SPEECH_SUPPORTED) { const c = document.getElementById('voices-card'); if (c) c.style.display = 'none'; return; }
  const voices = window.speechSynthesis.getVoices();
  [['ja', LANG.rankVoices(voices, /^ja/i, /Kyoko|Google/)], ['en', sgEnVoices(voices)]].forEach(([lang, list]) => {
    const sel = document.getElementById('voice-' + lang);
    if (!sel) return;
    const want = chosenVoiceName(lang);
    const auto = list[0];
    const seen = new Set();
    sel.innerHTML = `<option value="">Automatic${auto ? ' (' + sgEsc(auto.name) + ')' : ''}</option>` + list.filter(v => !seen.has(v.name) && seen.add(v.name))
      .map(v => `<option value="${sgEsc(v.name)}"${v.name === want ? ' selected' : ''}>${sgEsc(v.name)} · ${sgEsc(v.lang)}</option>`).join('');
    if (want && !list.some(v => v.name === want)) sel.value = '';
  });
}
function voiceSet(lang) {
  const sel = document.getElementById('voice-' + lang);
  try { if (sel.value) localStorage.setItem(VOICE_KEYS[lang], sel.value); else localStorage.removeItem(VOICE_KEYS[lang]); } catch (e) { /* private mode */ }
  voiceTry(lang);
}
function voiceTry(lang) {
  const msg = document.getElementById('voices-msg');
  if (!soundAllowed()) { if (msg) msg.textContent = 'Sound is off: tap the speaker at the top to turn it on.'; return; }
  if (msg) msg.textContent = '';
  cancelSpeechIfBusy();
  const u = new SpeechSynthesisUtterance(lang === 'ja' ? 'これは にほんごの こえです。' : 'This is the voice that reads the guides.');
  const v = sgReadVoice(lang);
  u.lang = lang === 'ja' ? LANG.code : (v && v.lang) || 'en-GB';
  if (v) u.voice = v;
  u.rate = lang === 'ja' ? (LANG.rate || 0.9) : 1;
  setTimeout(() => window.speechSynthesis.speak(u), 60);
}
if (SPEECH_SUPPORTED && window.speechSynthesis.addEventListener) window.speechSynthesis.addEventListener('voiceschanged', () => {
  const sc = document.getElementById('screen-settings');
  if (sc && sc.classList.contains('active')) voicesFill();
});

function sgReadUnitEl(u) {
  const body = document.getElementById('study-guide-body');
  return body ? body.querySelector(`[data-u="${u}"]`) : null;
}
// A line can be read if it has something to say and isn't inside a closed
// answer fold.
function sgReadable(u) {
  const un = SG_READ.units[u], el = sgReadUnitEl(u);
  return !!(un && un.segs.length && el && !el.closest('details:not([open])'));
}
function sgReadFind(from, step) {
  for (let u = from; u >= 0 && u < SG_READ.units.length; u += step) if (sgReadable(u)) return u;
  return -1;
}

function sgReaderOpen() {
  if (!SG_READ.units.length) return;
  if (!sgRead) {
    sgRead = { pos: sgReadFind(0, 1), playing: false, gen: 0, el: null, segKey: null, utter: null, lock: null };
    document.getElementById('screen-study-guide').classList.add('sg-reading-on');
    document.getElementById('sg-read-bar').classList.add('show');
  }
  sgReaderSync();
  sgReaderPlay();
}

function sgReaderClose() {
  if (!sgRead) return;
  sgReaderPause();
  sgReadLight(null, null);
  sgRead = null;
  const sc = document.getElementById('screen-study-guide');
  if (sc) sc.classList.remove('sg-reading-on');
  const bar = document.getElementById('sg-read-bar');
  if (bar) bar.classList.remove('show');
}

function sgReaderMsg(text) {
  const m = document.getElementById('sg-read-msg');
  if (m) { m.textContent = text || ''; m.style.display = text ? '' : 'none'; }
}

function sgReaderSync() {
  if (!sgRead) return;
  const btn = document.getElementById('sg-read-play');
  if (btn) {
    btn.innerHTML = sgRead.playing ? SG_ICON.pause : SG_ICON.play;
    btn.setAttribute('aria-label', sgRead.playing ? 'Pause' : 'Play');
  }
  const sp = document.getElementById('sg-read-speed');
  if (sp) sp.textContent = sgReadSpeed() + '×';
}

// Light the line being read, and the piece of it being said.
function sgReadLight(u, segN) {
  if (!sgRead) return;
  const el = u == null ? null : sgReadUnitEl(u);
  if (sgRead.el !== el) {
    if (sgRead.el) sgRead.el.classList.remove('sg-reading');
    if (el) { el.classList.add('sg-reading'); sgReadScrollTo(el); }
    sgRead.el = el;
  }
  // A joined Japanese piece is several spans with the same number.
  const key = el && segN != null ? u + ':' + segN : null;
  if (sgRead.segKey !== key) {
    document.querySelectorAll('#study-guide-body .sg-speaking').forEach(x => x.classList.remove('sg-speaking'));
    if (key) el.querySelectorAll(`.sg-r[data-s="${segN}"]`).forEach(x => x.classList.add('sg-speaking'));
    sgRead.segKey = key;
  }
}
// Keep the line in view, above the bar - only moving the page when the
// line is near an edge, so it doesn't jump about while you read.
function sgReadScrollTo(el) {
  const r = el.getBoundingClientRect();
  const bar = document.getElementById('sg-read-bar');
  const bottom = window.innerHeight - (bar ? bar.offsetHeight : 0) - 24;
  if (r.top < 70 || r.bottom > bottom) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

// Keep the screen on while reading or playing (r: sgRead or tp).
async function sgWake(r, on) {
  if (!r) return;
  try {
    if (on && !r.lock && navigator.wakeLock) {
      const lock = await navigator.wakeLock.request('screen');
      if (r.playing && !r.lock) r.lock = lock; else lock.release();
    } else if (!on && r.lock) { const l = r.lock; r.lock = null; l.release(); }
  } catch (e) { /* no wake lock here - the screen may dim on its own */ }
}
function sgReadWake(on) { return sgWake(sgRead, on); }

function sgReaderPlay() {
  if (!sgRead) return;
  if (!soundAllowed()) { sgReaderMsg('Sound is off: tap the speaker at the top to turn it on.'); return; }
  if (sgRead.pos < 0 || !sgReadable(sgRead.pos)) sgRead.pos = sgReadFind(Math.max(sgRead.pos, 0), 1);
  if (sgRead.pos < 0) { sgRead.pos = sgReadFind(0, 1); sgReaderMsg('End of the guide.'); sgReadLight(sgRead.pos, null); return; }
  sgReaderMsg('');
  sgRead.playing = true;
  sgReaderSync();
  sgReadWake(true);
  sgReadStartAt(sgRead.pos);
}

function sgReaderPause() {
  if (!sgRead) return;
  sgRead.gen++;
  const was = sgRead.playing;
  sgRead.playing = false;
  sgRead.utter = null;
  if (was) cancelSpeechIfBusy();
  sgReadWake(false);
  sgReadLight(sgRead.pos, null);
  sgReaderSync();
}

function sgReaderToggle() {
  if (!sgRead) return;
  if (sgRead.playing) sgReaderPause(); else sgReaderPlay();
}

// Go to a line: reading carries on from it if it was reading.
function sgReaderGo(u) {
  if (!sgRead || u < 0) return;
  sgRead.pos = u;
  sgReaderMsg('');
  if (sgRead.playing) sgReadStartAt(u);
  else sgReadLight(u, null);
}
function sgReaderStep(step) {
  if (!sgRead) return;
  sgReaderGo(sgReadFind(sgRead.pos + step, step));
}
// The next heading, or back to the start of this part (and on to the one
// before when already at its heading).
function sgReaderSection(step) {
  if (!sgRead) return;
  let u = sgRead.pos;
  if (step > 0) {
    for (u = u + 1; u < SG_READ.units.length; u++) if (SG_READ.units[u].heading && sgReadable(u)) break;
  } else {
    for (u = u - 1; u >= 0; u--) if (SG_READ.units[u].heading && sgReadable(u)) break;
  }
  if (u >= 0 && u < SG_READ.units.length) sgReaderGo(u);
}

function sgReaderSpeed() {
  const i = SG_READ_SPEEDS.indexOf(sgReadSpeed());
  try { localStorage.setItem(SG_READ_SPEED_KEY, String(SG_READ_SPEEDS[(i + 1) % SG_READ_SPEEDS.length])); } catch (e) { /* private mode */ }
  sgReaderSync();
}

// Say a line, piece by piece (English split at its sentences), then the
// next readable line. Every step checks it's still the current reading
// (gen), so a tap elsewhere never has two readings running at once.
function sgReadStartAt(u) {
  const gen = ++sgRead.gen;
  const ss = window.speechSynthesis;
  const busy = ss.speaking || ss.pending;
  cancelSpeechIfBusy();
  // Safari can drop speech queued straight after cancel().
  setTimeout(() => sgReadLine(u, gen), busy ? 120 : 0);
}

function sgReadLine(u, gen) {
  if (!sgRead || gen !== sgRead.gen) return;
  if (!sgReadable(u)) {
    const nx = sgReadFind(u + 1, 1);
    if (nx < 0) return sgReadDone();
    return sgReadLine(nx, gen);
  }
  sgRead.pos = u;
  const parts = [];
  SG_READ.units[u].segs.forEach(n => {
    const s = SG_READ.segs[n];
    if (s.lang === 'en') s.text.split(/(?<=[.!?:;])\s+/).forEach(t => { if (/[\p{L}\p{N}]/u.test(t)) parts.push({ n, lang: 'en', text: t }); });
    else parts.push({ n, lang: 'ja', text: s.text });
  });
  sgReadLight(u, null);
  sgReadPart(u, parts, 0, gen, false);
}

function sgReadPart(u, parts, k, gen, retried) {
  if (!sgRead || gen !== sgRead.gen) return;
  if (k >= parts.length) {
    const nx = sgReadFind(u + 1, 1);
    if (nx < 0) return sgReadDone();
    setTimeout(() => sgReadLine(nx, gen), 200);
    return;
  }
  if (!soundAllowed()) { sgReaderPause(); sgReaderMsg('Sound is off: tap the speaker at the top to turn it on.'); return; }
  const p = parts[k];
  sgReadLight(u, p.n);
  const utter = new SpeechSynthesisUtterance(p.text);
  const v = sgReadVoice(p.lang);
  utter.lang = p.lang === 'ja' ? LANG.code : (v && v.lang) || 'en-GB';
  if (v) utter.voice = v;
  utter.rate = (p.lang === 'ja' ? (LANG.rate || 0.9) : 1) * sgReadSpeed();
  sgRead.utter = utter;   // kept, or some browsers lose its end event
  let started = false, done = false, quietSince = 0;
  const next = () => {
    if (done) return; done = true; clearInterval(watch);
    if (!sgRead || gen !== sgRead.gen) return;
    // A held word's bubble is speaking it: stop here, carry on with Play.
    if (document.querySelector('#study-guide-body .sg-w.tile-peeking')) return sgReaderPause();
    sgReadPart(u, parts, k + 1, gen, false);
  };
  utter.onstart = () => { started = true; };
  utter.onend = next;
  utter.onerror = e => {
    if (done) return;
    // Cut off by other speech (a held word) or by sound being turned off.
    if (e && (e.error === 'interrupted' || e.error === 'canceled')) { done = true; clearInterval(watch); if (sgRead && gen === sgRead.gen) sgReaderPause(); return; }
    next();
  };
  // Android browsers sometimes lose the end event, or never start: watch
  // the speech itself. Not started in 2.5 s - clear it and try once more.
  const t0 = Date.now();
  const watch = setInterval(() => {
    if (done || !sgRead || gen !== sgRead.gen) { clearInterval(watch); return; }
    const ss = window.speechSynthesis;
    if (ss.speaking && !ss.paused) { started = true; quietSince = 0; return; }
    if (started) {
      if (!quietSince) quietSince = Date.now();
      else if (Date.now() - quietSince > 1200) next();
    } else if (Date.now() - t0 > 2500) {
      done = true; clearInterval(watch);
      try { ss.cancel(); ss.resume(); } catch (e2) { /* speech unavailable */ }
      if (retried) { sgReaderPause(); sgReaderMsg("The voice didn't start. Tap play to try again."); }
      else setTimeout(() => sgReadPart(u, parts, k, gen, true), 150);
    }
  }, 400);
  window.speechSynthesis.speak(utter);
}

function sgReadDone() {
  if (!sgRead) return;
  sgReaderPause();
  sgRead.pos = sgReadFind(0, 1);
  sgReadLight(null, null);
  sgReaderMsg('End of the guide. Play starts it again.');
}

const SG_ICON = {
  play: '<svg viewBox="0 0 24 24" width="22" height="22"><polygon points="7,4 20,12 7,20" fill="currentColor"/></svg>',
  pause: '<svg viewBox="0 0 24 24" width="22" height="22"><rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/></svg>',
};

// Tap a line while the bar is open: read from there. Not a fold's title,
// and not the tap that ends holding a word.
document.addEventListener('click', e => {
  if (!sgRead) return;
  const body = document.getElementById('study-guide-body');
  if (!body || !body.contains(e.target) || e.target.closest('summary')) return;
  if (typeof tilePeekSuppressClickUntil !== 'undefined' && Date.now() < tilePeekSuppressClickUntil) return;
  const el = e.target.closest('[data-u]');
  if (!el) return;
  const u = +el.dataset.u;
  if (!sgReadable(u)) return;
  sgRead.pos = u;
  sgReaderMsg('');
  if (sgRead.playing) sgReadStartAt(u); else sgReaderPlay();
});
// Away from the app: stop (the voice is cut off anyway), keep the place.
document.addEventListener('visibilitychange', () => { if (document.visibilityState !== 'visible') sgReaderPause(); });

// --- Play through a word list (26 Nov 2026, Andrew) ---------------------------
// On a word list's tiles: each word in turn lit, its bubble up (the kana
// drawn, the romaji, the English) and the word said - then the next. For
// watching at the screen, like Read it to me: reading the kana, then hearing
// it. Pace (Andrew's guess from the guide reader, 3-4 s a word): a short
// pause to try reading it, the word said, then the bubble held for a while
// once both the voice and the drawing have finished - longer words get
// longer by themselves, plus a little per kana. The speed button stretches
// or shrinks the pauses (not the voice). Stops at the end of the list.
// Paused, the step buttons (or a tap on a tile) show and say one word at a
// time. While the bar is open a tap on a tile means "from here", not
// "select for a drill". Nothing is scored or stored except the speed.

const TP_SPEED_KEY = APP.storagePrefix + 'TilePlaySpeed';
const TP_LEAD_MS = 750, TP_HOLD_MS = 1600, TP_PER_KANA_MS = 120;
let tp = null;   // { pos, playing, gen, tile, utter, lock } while the bar is open

function tpSpeed() {
  try { const v = parseFloat(localStorage.getItem(TP_SPEED_KEY)); if (SG_READ_SPEEDS.includes(v)) return v; } catch (e) { /* private mode */ }
  return 1;
}
function tpTiles() { return [...document.querySelectorAll('#vocab-tile-grid .kana-ref-card')]; }
function tpItems() { return vocabTileCategory ? resolveVocabCategory(vocabTileCategory).items : []; }

function tpOpen() {
  if (!tpTiles().length) return;
  if (!tp) {
    tp = { pos: 0, playing: false, gen: 0, tile: null, utter: null, lock: null };
    document.getElementById('screen-vocab-tile-selection').classList.add('tp-on');
    document.getElementById('tp-bar').classList.add('show');
  }
  tpSync();
  tpPlay();
}

function tpClose() {
  if (!tp) return;
  tpPause();
  tpUnlight();
  tp = null;
  const sc = document.getElementById('screen-vocab-tile-selection');
  if (sc) sc.classList.remove('tp-on');
  const bar = document.getElementById('tp-bar');
  if (bar) bar.classList.remove('show');
}

function tpMsg(text) {
  const m = document.getElementById('tp-msg');
  if (m) { m.textContent = text || ''; m.style.display = text ? '' : 'none'; }
}
function tpSync() {
  if (!tp) return;
  const btn = document.getElementById('tp-play');
  if (btn) { btn.innerHTML = tp.playing ? SG_ICON.pause : SG_ICON.play; btn.setAttribute('aria-label', tp.playing ? 'Pause' : 'Play'); }
  const sp = document.getElementById('tp-speed');
  if (sp) sp.textContent = tpSpeed() + '×';
}

function tpUnlight() {
  if (tp && tp.tile) tp.tile.classList.remove('tp-current');
  if (tp) tp.tile = null;
  if (document.getElementById('tile-peek-bubble') && !document.querySelector('#vocab-tile-grid .tile-peeking')) hideTilePeekBubble();
}

// Light word i, put its bubble up and say it. Returns a promise for the
// bubble's drawing having finished (or at once when there's nothing drawn).
function tpShow(i, speak, onSaid) {
  const tiles = tpTiles(), item = tpItems()[i], tile = tiles[i];
  if (!tile || !item) return Promise.resolve();
  tpUnlight();
  tp.pos = i; tp.tile = tile;
  tile.classList.add('tp-current');
  // Room above the tile for its bubble, and clear of the bar: the page
  // jumps (no smooth scroll) so the bubble lands next to the tile.
  const r = tile.getBoundingClientRect();
  const bar = document.getElementById('tp-bar');
  const bottom = window.innerHeight - (bar ? bar.offsetHeight : 0) - 24;
  if (r.top < 150 || r.bottom > bottom) tile.scrollIntoView({ block: 'center' });
  const b = showTilePeekBubble(tile, item);
  if (speak) tpSay(item, onSaid); else if (onSaid) onSaid();
  return Promise.resolve(b && b.drawn).catch(() => {});
}

function tpSay(item, done) {
  if (!SPEECH_SUPPORTED || !soundAllowed()) { if (done) setTimeout(done, 600); return; }
  const gen = tp.gen;
  cancelSpeechIfBusy();
  const u = new SpeechSynthesisUtterance(item.speakAs || item.jp);
  u.lang = LANG.code;
  const v = LANG.pickVoice(window.speechSynthesis.getVoices()).voice;
  if (v) u.voice = v;
  u.rate = LANG.rate || 0.9;
  tp.utter = u;
  let fin = false;
  const finish = () => { if (fin) return; fin = true; clearTimeout(cap); if (done && tp && gen === tp.gen) done(); };
  u.onend = finish;
  u.onerror = e => {
    // Cut off by holding a word (its own bubble speaks it): stop here.
    if (e && (e.error === 'interrupted' || e.error === 'canceled')) { fin = true; clearTimeout(cap); if (tp && gen === tp.gen) tpPause(); return; }
    finish();
  };
  // Never wait forever on a lost end event.
  const cap = setTimeout(finish, 5000);
  setTimeout(() => { if (tp && gen === tp.gen) window.speechSynthesis.speak(u); }, 60);
}

function tpPlay() {
  if (!tp) return;
  if (tp.pos >= tpTiles().length) tp.pos = 0;
  tpMsg(soundAllowed() ? '' : 'Sound is off: the words are shown but not said.');
  tp.playing = true;
  tpSync();
  sgWake(tp, true);
  tpRun(tp.pos, ++tp.gen);
}

function tpPause() {
  if (!tp) return;
  tp.gen++;
  const was = tp.playing;
  tp.playing = false;
  if (was) cancelSpeechIfBusy();
  sgWake(tp, false);
  tpSync();
}

function tpToggle() { if (tp) { if (tp.playing) tpPause(); else tpPlay(); } }

const tpWait = ms => new Promise(r => setTimeout(r, ms));
async function tpRun(i, gen) {
  const live = () => tp && gen === tp.gen && tp.playing;
  const n = tpTiles().length;
  while (live() && i < n) {
    // Holding a word yourself takes over: stop here.
    if (document.querySelector('#vocab-tile-grid .tile-peeking')) return tpPause();
    const s = tpSpeed();
    let said;
    const saidP = new Promise(r => { said = r; });
    const drawn = tpShow(i, false);
    await tpWait(TP_LEAD_MS / s);
    if (!live()) return;
    tpSay(tpItems()[i], said);
    await Promise.all([saidP, drawn]);
    if (!live()) return;
    const kana = [...(tpItems()[i].jp || '')].filter(c => /[぀-ヿ一-龯]/.test(c)).length;
    await tpWait((TP_HOLD_MS + TP_PER_KANA_MS * kana) / s);
    if (!live()) return;
    i++;
    if (i < n) {
      if (document.querySelector('#vocab-tile-grid .tile-peeking')) return tpPause();
      hideTilePeekBubble(); await tpWait(150);
    }
  }
  if (live()) { tpPause(); tp.pos = 0; tpMsg('End of the list. Play starts it again.'); }
}

// A word: from here if playing, or shown and said on its own if paused.
function tpGo(i) {
  if (!tp) return;
  const n = tpTiles().length;
  if (i < 0 || i >= n) return;
  tpMsg('');
  if (tp.playing) { tp.gen++; cancelSpeechIfBusy(); tp.pos = i; tpRun(i, tp.gen); }
  else { tp.gen++; tpShow(i, true); }
}
function tpStep(step) { if (tp) tpGo(tp.pos + step); }
function tpSpeedNext() {
  const i = SG_READ_SPEEDS.indexOf(tpSpeed());
  try { localStorage.setItem(TP_SPEED_KEY, String(SG_READ_SPEEDS[(i + 1) % SG_READ_SPEEDS.length])); } catch (e) { /* private mode */ }
  tpSync();
}

// While the bar is open a tap on a tile is "this word" (caught before the
// tile's own select-for-drill tap).
document.addEventListener('click', e => {
  if (!tp) return;
  const tile = e.target.closest && e.target.closest('#vocab-tile-grid .kana-ref-card');
  if (!tile) return;
  e.stopPropagation(); e.preventDefault();
  if (Date.now() < tilePeekSuppressClickUntil) return;
  tpGo(tpTiles().indexOf(tile));
}, true);
document.addEventListener('visibilitychange', () => { if (document.visibilityState !== 'visible') tpPause(); });
