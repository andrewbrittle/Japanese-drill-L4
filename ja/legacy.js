// Japanese's own code that hasn't moved onto the core or into a file of its
// own yet: start-up and the keyboard (core/start.js does this for the other
// apps), Japanese-only settings and switches, typed-Japanese checking,
// production scores, level pills and the Random page's level picks.
// Comments here say why the code below them does what it does. The history
// and the decisions behind it are in HANDOVER.md (tidied 14 Nov 2026: the
// old August plan and comments left behind when code moved to the core).
// VOCAB lives in vocab.js (split out 2026-10-08), loaded by the <script src>
// just before this script. Same object as before - everything below, the
// private Genki loader included, uses VOCAB exactly as it did when it was
// written inline here.
if (!window.JP_DRILL_VOCAB) {
  document.body.insertAdjacentHTML('afterbegin', '<div style="margin:1rem;padding:1rem;border:1.5px solid #e5484d;border-radius:12px;color:#e5484d;font:600 15px/1.4 sans-serif;text-align:center;">The word list (vocab.js) didn\'t load. Check your connection and reload the page.</div>');
  throw new Error('vocab.js did not load');
}

// PRIVATE VOCAB PACKS (2026-10-02) - extra categories kept OUT of the
// published app (e.g. textbook word lists, which shouldn't sit on a public
// site) and loaded per device from a JSON file via Settings > Private vocab.
// The file is stored in this browser's localStorage and merged into VOCAB
// here, before anything else reads VOCAB. A pack can only ADD categories -
// a key that already exists in the app's own data is skipped, never
// overwritten. Pack categories get privatePack:true and lead the Untaught
// list (see buildMatchCategoryList). File format:
//   {"format":"jp-drill-private-vocab","version":1,"name":"…",
//    "categories":{"vocab-…":{level,label,chars,tagQuery,items:[…]}}}
// with categories shaped exactly like VOCAB entries.
// LEVEL 4 APP (2026-11-04): every storage key starts jpL4 (was jpDrill), so
// this app and the Level 3 app - same web address, so same browser storage -
// never read or overwrite each other's scores and settings. Moving over:
// Settings > Backup in the L3 app, Restore here.
// About the loaded file, for the Settings status line: its own "updated"
// date, and how many of its words the app already has. Those are skipped
// (2026-10-02) - a word that's moved from the private file into the taught
// course would otherwise show twice - and a non-zero count means the file
// on this device is out of date, so Settings flags "check your file".
(function loadPrivateVocab() {
  try {
    const raw = localStorage.getItem(PRIVATE_VOCAB_KEY);
    if (!raw) return;
    const pack = JSON.parse(raw);
    if (validatePrivateVocabPack(pack)) return;
    PRIVATE_VOCAB_INFO.updated = typeof pack.updated === 'string' ? pack.updated : null;
    const appWords = new Set();
    Object.keys(VOCAB).forEach(k => VOCAB[k].items.forEach(i => appWords.add(i.jp + '|' + i.en)));
    Object.keys(pack.categories).forEach(key => {
      if (VOCAB[key]) return; // never override the app's own data
      const cat = pack.categories[key];
      const items = cat.items.filter(i => !appWords.has(i.jp + '|' + i.en));
      PRIVATE_VOCAB_INFO.skipped += cat.items.length - items.length;
      VOCAB[key] = Object.assign({}, cat, { items, privatePack: true });
      PRIVATE_VOCAB_KEYS.push(key);
    });
  } catch (e) { /* storage unavailable or corrupt - app runs without the pack */ }
})();

// Groups (THEMES) live in vocab.js as window.JP_DRILL_GROUPS (moved 2026-10-12)
// - see the GROUPS note there for the fields. Each Group brings together words
// from several VOCAB categories into one drillable screen without copying
// them; its word list is worked out fresh each time (see getThemePool).
const L12_LIST = window.JP_DRILL_L12_LIST || [];

let drillByMeaning = false;

// DICE PAGE SWITCHES (2026-10-11): the dice page keeps its OWN copy of the
// four switches (randomModes). They used to be the shared globals above,
// which every category drill overwrites with its own per-category settings -
// so after drilling a category with Reverse on, the dice page showed Reverse
// off but ran its next drill reversed. Copied into the globals only when the
// dice page's Start is pressed (applyRandomModes). Found by the Portuguese
// test app, confirmed in L3.

function toggleDrillByMeaning() {
  randomModes.meaning = !randomModes.meaning;
  if (randomModes.meaning) randomModes.type = false;
  syncVocabModeToggles();
}

// Canonicalizes a typed romaji answer (and the stored answer it's compared
// against) so learners aren't marked wrong for reasonable spelling
// differences that don't reflect an actual reading mistake: case, leading/
// trailing/doubled whitespace, trailing punctuation, macrons vs doubled
// vowels, the "oo"-for-loanwords vs "ou"-for-native-words split our own
// data isn't consistent about (boorupen vs arigatou), and the classic
// kunrei-shiki/Hepburn consonant pairs (si/shi, ti/chi, tu/tsu, zi/ji,
// hu/fu). Comparison-only - never used for display, so the app's own
// canonical spelling (e.g. "boorupen") is always what's shown back.
function canonicalizeRomaji(str) {
  return (str || '')
    .toLowerCase()
    .trim()
    .replace(/[.!?,]+$/g, '')
    .replace(/\s+/g, ' ')
    .replace(/ā/g, 'aa').replace(/ī/g, 'ii').replace(/ū/g, 'uu')
    .replace(/ē/g, 'ee').replace(/ō/g, 'ou')
    .replace(/oo/g, 'ou')
    .replace(/si/g, 'shi').replace(/ti/g, 'chi').replace(/tu/g, 'tsu')
    .replace(/zi/g, 'ji').replace(/hu/g, 'fu');
}

// Sokuon (small tsu - doubles the following consonant) and the small kana
// used to build combination sounds (きゃ etc) or katakana loanword combos
// (ファ, ティ etc) print visibly smaller than their neighbours in real
// Japanese typography. The font renders them a little smaller already, but
// not by enough to read clearly - wrapping them in their own span with a
// deliberately reduced size makes the distinction obvious (e.g. つ vs っ,
// や vs ゃ) rather than relying on subtle font metrics alone.
const SMALL_KANA_CHARS = new Set([
  'っ','ッ','ゃ','ゅ','ょ','ャ','ュ','ョ',
  'ぁ','ぃ','ぅ','ぇ','ぉ','ァ','ィ','ゥ','ェ','ォ','ゎ','ヮ',
]);

// Wraps any small kana found in a string in a <span class="small-kana">, for
// use anywhere real Japanese text is inserted via innerHTML. Safe to call on
// any string, including ones with none of these characters - a no-op then.
// Small kana sized right: the language's display rule now (LANG.displayHtml,
// lang/ja.js), which the core uses too. The name stays for its many callers.
function markSmallKana(text) { return displayWordHtml(text); }

// Tile-selection reference for flat vocab categories (Colours, Trip-prep) —
// no sections/pills needed since these are single unordered lists, unlike kanji.
const vocabTileDrillMode = {}; // categoryKey -> boolean, remembered independently per category
// categoryKey -> boolean. When true, a "Select random 20" pick is active: the
// real selection (used for drilling) is a genuine random 20, but every tile
// is shown as selected and made non-interactive, so there's no visual way to
// tell which 20 were actually picked. Only relevant for theme screens.

function toggleVocabTileDrillMode() {
  const categoryKey = vocabTileCategory;
  vocabTileDrillMode[categoryKey] = !vocabTileDrillMode[categoryKey];
  if (vocabTileDrillMode[categoryKey]) vocabTileTypeAnswerMode[categoryKey] = false;
  syncVocabTileModeToggles(categoryKey);
}

// Maps a category key to the reference screen(s) that belong with it -
// REFERENCE SCREENS FOLDED IN (2026-08-31). Used to be five separate
// ".vocab-ref-card" links hand-placed in buildMatchCategoryList, positioned
// just above their category's own tile in the list - correct, but fragile:
// the reference card's position had to be kept in sync by hand with wherever
// its category ended up in the list (a problem the same day's alphabetical-
// order change would have made worse, since a category's list position now
// depends on its label rather than being fixed). Andrew's proposal: instead
// of tying the reference to a position in the list, tie it to the category
// itself and show it on that category's own tile-selection screen - "tap a
// word to select it for drilling" screen, reference link included. Applies
// equally to L2 (four of these five) and Andrew (one) since both route
// through this same function. Each function here still sets its own
// vocabRefBackTarget internally (now 'vocab-tile-selection' instead of
// 'match-settings' - see each function's own definition) so Back returns to
// the selection screen it was opened from, not the top-level category list -
// same precedent already used for hiragana/katakana's own reference screens.
Object.assign(CATEGORY_REFERENCE_LINKS, { // the core's, from APP.categoryLinks
  'vocab-time-l2': [
    { label: 'Day / week / month / year — reference', fn: showTimeUnitsReference },
    { label: 'Minute endings (1–10) — reference', fn: showMinuteReference },
  ],
  'vocab-days-of-month-l2': [
    { label: 'Days of the month (1st–31st) — reference', fn: showDaysOfMonthReference },
  ],
  'vocab-days-l2': [
    { label: 'Days of the week (in order) — reference', fn: () => showVocabReference('vocab-days-l2') },
  ],
  'vocab-animals-l2': [
    { label: '12 zodiac animals & the clock — reference', fn: showZodiacClockReference },
  ],
  'vocab-materials-hotel-appliances': [
    { label: 'Appliances reference', fn: showApplianceDeviceReference },
  ],
});

// Level-colour borders, for theme screens only (items pooled from several
// source categories at once, so a tile's own level isn't otherwise visible).
// Deliberately distinct from --accent (gold), which .selected already owns -
// same border-slot handoff the Colours category already does: level colour
// while unselected, gold once selected.
//
// COLOUR BY TAG, NOT BUCKET (2026-08-31): keys were originally `trip`/
// `andrew`, read straight off the category-level `level` value. Andrew's
// call: keep the purple/green (they work well), but stop deriving them from
// which category a word happened to live in and derive them from a real
// per-item property instead - exactly the `encountered`/`curated` tags
// added the same day (see the FUTURE DIRECTION entry below for the full
// reasoning). Same two colours, same split (encountered was `andrew`,
// curated was `trip`), just tag-sourced now. `1`/`2` are untouched - taught
// levels aren't part of this change.
// GENKI COLOUR (2026-09-12): rose/pink (#d1568f) - green was ruled out (too
// close to both --green/confidence and 'encountered' above), teal had
// already been tried elsewhere and rejected, red reads as "wrong answer"
// everywhere else in the app, and yellow either crowds --accent (gold) or
// runs too bright. Pink was the first hue in the wheel not already claimed
// by another indicator in this app. Genki's own pill retired 2026-09-28
// (Lesson 1-1 folded into Untaught instead - see buildMatchCategoryList),
// but this key stays live: its word tiles are still bordered pink inside
// their own category screen.
// LEVEL 3 COLOUR (2026-09-28): brown (#a0684d) - the one hue in
// COLOUR_HUES not already claimed by another indicator (green/yellow both
// ruled out above for the same reasons Genki's pick avoided them).
// (2026-10-15) L3 changed brown -> teal: next to L2's orange on the Grammar page the
// two read as one colour, brighter and darker. Brown went to the Grammar pill.
// (2026-11-05) Taught levels a touch brighter and drawn 2px; L4 added (it had no
// edge at all). Tourist (curated) bronze and Untaught (encountered) slate are
// deliberately dimmer and drawn dashed - see applyLevelTileEdge.
Object.assign(LEVEL_BORDER_COLORS, { 1: '#5b9bff', 2: '#ff9a52', 3: '#2ec4b6', 4: '#a888f0', curated: '#a5865f', encountered: '#6b7a88', genki: '#d1568f' }); // the core's, from APP.levelColors

// Resolves which LEVEL_BORDER_COLORS key applies to a pooled item. Untaught
// items carry `encountered`/`curated` as a real tag now (not inferred from
// category/level), so this checks tags first; taught items have neither
// tag, so this falls through to the old level-based key (1 or 2) exactly as
// before. Pooled items always carry their own `tags` array intact (see
// buildCategoryItems - Object.assign spreads the raw VOCAB item over the
// synthesized level/groupKey fields, so `.tags` survives untouched).
// (2026-11-05) Taught words go first: 51 taught words also carry a
// curated/encountered provenance tag (あき, もみじがり…) and were showing the
// Tourist/Untaught colour. A taught word now shows the level it was first
// taught at (lowest L tag), falling back to its category's level.
// Japanese's colour rule, used by the core's itemColorKey (APP.itemColorKey).
function jaItemColorKey(item) {
  const tags = item.tags || [];
  if (tags.includes('taught')) {
    const lv = tags.map(t => /^L(\d)$/.exec(t)).filter(Boolean).map(m => +m[1]);
    return lv.length ? Math.min(...lv) : item.level;
  }
  if (tags.includes('curated')) return 'curated';
  if (tags.includes('encountered')) return 'encountered';
  return item.level;
}

//
// Categories whose word screen offers "Show romaji instead of kana"
// (2026-10-01) - Tourist essentials, so a classmate going to Japan with
// little kana can use the page as a phrasebook. Grid display only.
// The Tourist pill's section cards (2026-10-15) offer it too.
const ROMAJI_VIEW_CATEGORIES = ['theme-tourist-essentials', 'theme-te-phrases', 'theme-te-little', 'theme-te-food', 'theme-te-around',
  'theme-te-hotel', 'theme-te-shops', 'theme-te-health', 'theme-te-weather'];
function toggleTileShowRomaji() {
  appSettings.tileShowRomaji = !appSettings.tileShowRomaji;
  saveSettings();
  const card = document.getElementById('vocab-tile-romaji-card');
  if (card) card.classList.toggle('selected', appSettings.tileShowRomaji);
  updateTileSelectionSubText(vocabTileCategory);
  buildVocabTileGrid(vocabTileCategory);
  refreshKanaScoreShading('vocab-tile-grid');
}

// What holding a card shows (APP.tilePeekHint).
function jaTilePeekHint(categoryKey) {
  let peek = 'Hold a card to see its reading.';
  let hasVerb = false;
  try { hasVerb = resolveVocabCategory(categoryKey).items.some(isVerbItem); } catch (e) { /* no items yet */ }
  if (hasVerb) peek += ' On a verb, slide towards the bubble and let go to see all its forms.';
  return peek;
}

function tileKanaFontSize(jp) {
  const len = [...jp].length;
  return len <= 4 ? '28px' : len <= 8 ? '20px' : len <= 12 ? '16px' : '13px';
}
function tileRomajiFontSize(romaji) {
  const rlen = romaji.length;
  return rlen <= 10 ? '22px' : rlen <= 18 ? '17px' : rlen <= 26 ? '14px' : '12px';
}
// HOLD TO PEEK (2026-10-02) - hold any word card ~half a second and a
// bubble shows its kana, romaji and English (and, if sound is on, says it);
// let go and it disappears. A bubble rather than changing the card text,
// because the holding finger covers the card. A peek, not a toggle, so the
// list keeps testing you on the kana. A finger that starts moving is a
// scroll, which cancels the hold; the click that follows a peek is
// swallowed so it doesn't also select the card.
// Placement: above the card if it fits, else beside it on the roomier
// side (away from the finger), else below - always clamped on-screen.
// What a held word's bubble shows (APP.peekFill): the word, its reading and
// meaning, and on a verb, a hint to slide for all forms (the arrow is set
// once the bubble's side is known). Kana (2026-10-16, from the Kanji
// Strokes app) are drawn stroke by stroke instead, with romaji and stroke
// count; contracted kana (きゃ) are two characters side by side. Returns the
// drawing to start once the bubble is placed.
function jaPeekFill(b, item) {
  const verbHint = isVerbItem(item) ? '<div class="peek-hint"><span class="peek-arrow">↑</span> slide here for all forms</div>' : '';
  if (item.glyphs) {
    const total = item.glyphs.reduce((t, g) => t + g.length, 0);
    const lay = peekGlyphLayout(item.chars || [], item.glyphs.length);
    b.classList.add('peek-kana');
    b.innerHTML = `<svg class="peek-svg" viewBox="0 0 ${lay.width} 109" style="width:${Math.round(84 * lay.width / 109)}px" aria-hidden="true"></svg><div class="peek-kana-text"><div class="peek-romaji">${item.romaji}</div><div class="peek-en">${total} stroke${total === 1 ? '' : 's'}</div></div>`;
    return () => playPeekStrokes(b.querySelector('.peek-svg'), item.glyphs, lay);
  }
  b.innerHTML = `<div class="peek-jp">${markSmallKana(item.jp)}</div><div class="peek-romaji">${item.romaji}</div><div class="peek-en">${item.en}</div>${verbHint}`;
  const wordStrip = peekWordStrip(item);
  if (wordStrip) { b.insertBefore(wordStrip.svg, b.querySelector('.peek-hint')); return () => playPeekWord(wordStrip); }
  return null;
}

// NAVIGATION HISTORY (2026-10-16, Andrew: "make it feel like a proper app").
// Every screen change is recorded here, so Back - the "← Page" button at the
// top-left of inner pages, the phone's own back gesture, and the settings cog
// tapped a second time - always goes exactly one step up. Rules:
//  - The four tab pages (かな / 漢字 / Numbers / Vocab) are roots: arriving at
//    one starts history afresh, and Back there does nothing (so you can't
//    leave the app by accident). Switching Vocab pills doesn't add history.
//  - The drill and results screens are never stepped back INTO: Back from
//    either goes to wherever the drill was started. (Settings opened mid-drill
//    is the exception - Back returns to the drill.)
//  - Going to the screen that's already one step back counts as going back
//    (results -> "Change words" -> the word list), so history never doubles up.
// Going back calls each screen's own show function (NAV_RESTORE) so its lists
// and score colours are redrawn up to date.
const NAV_RESTORE = {
  'match-settings': () => { showScreen('match-settings'); setMatchLevel(currentMatchLevel); },
  'vocab-tile-selection': () => showVocabTileSelection(vocabTileCategory),
  'kana-selection': () => showKanaSelection(),
  'hiragana-selection': () => showHiraganaSelection(activeHiraganaSection),
  'katakana-selection': () => showKatakanaSelection(activeKatakanaSection),
  'kanji-index': () => showKanjiIndex(),
  'kanji-selection': () => showKanjiSelection(),
  'kanji-view': () => showKanjiView(),
  'numbers': () => showNumbersScreen(),
  'counter-quiz-selection': () => showCounterQuizSelection(),
  'settings': () => showSettingsScreen(),
  'grammar': () => showGrammarPage(),
  'build': () => showBuildPage(),
};

// ROTATION (2026-10-23, Andrew): the manifest used to lock the installed
// app to portrait, which also stopped the Sentence builder turning sideways
// on Android. Now the manifest allows any orientation and the app locks
// itself back to portrait everywhere except the builder and the desk sheets.
// Where the browser won't lock (iPhone/iPad, or not installed) the whole app
// simply follows the device, as it did on the iPad already.
// The study guides too (2026-11-09): more room for their tables sideways.
const ROTATE_OK_SCREENS = ['sentence-builder', 'desk-sheets', 'study-guide'];
function applyScreenOrientation(id) {
  const so = screen.orientation;
  if (!so || typeof so.lock !== 'function') return;
  try {
    if (ROTATE_OK_SCREENS.includes(id)) { if (typeof so.unlock === 'function') so.unlock(); }
    else so.lock('portrait').catch(() => {});
  } catch (e) { /* not allowed here - fine */ }
}
// Leaving a screen: stop the Sentence order card mid-step-through; turn
// the screen the right way for where it's going (APP.beforeShowScreen).
function jaBeforeShowScreen(id) {
  if (l3cPlay) l3cStopPlay();
  applyScreenOrientation(id);
}

// Which tab is lit (APP.pillFor): the section you're in - the main page at
// the bottom of the history (2026-10-16), so a grammar card lights Grammar
// and the kana dakuten chart lights かな, not Vocab. Failing that, the
// screen's own tab, or for shared screens (drill, results, counter quiz...)
// whichever tab launched them - not Numbers by default, which once lit
// Numbers while drilling Vocab. Looked up by tab id, not position, so the
// tab row's order can change. Settings has its own button, not a tab.
function jaPillFor(id) {
  if (id === 'settings') return null;
  const NAV_TAB = { 'kana-selection': 'nav-kana', 'kanji-index': 'nav-kanji', 'numbers': 'nav-numbers', 'match-settings': 'nav-match', 'build': 'nav-build', 'grammar': 'nav-grammar' };
  const navRoot = NAV_ROOTS.includes(id) ? id : (navStack[0] || NAV_HOME[id]);
  if (NAV_TAB[navRoot]) return NAV_TAB[navRoot];
  if (id === 'kana-selection' || id === 'hiragana-selection' || id === 'katakana-selection') return 'nav-kana';
  if (id === 'kanji-selection' || id === 'kanji-index' || id === 'kanji-view') return 'nav-kanji';
  if (id === 'match-settings' || id === 'vocab-reference' || id === 'vocab-tile-selection') return 'nav-match';
  const pillIdByOrigin = { 'kana-selection': 'nav-kana', 'hiragana-selection': 'nav-kana', 'katakana-selection': 'nav-kana',
    'kanji-selection': 'nav-kanji', 'kanji-index': 'nav-kanji', 'kanji-view': 'nav-kanji', 'numbers': 'nav-numbers', 'match-settings': 'nav-match', 'vocab-tile-selection': 'nav-match' };
  return pillIdByOrigin[lastSettingsScreen] || 'nav-numbers';
}

// The すうじ tab doubles as Resume for a drill left part way (any kind - the
// drill screen is shared). While actually in a numbers drill it stays すうじ
// and leaves for the Numbers page (it once said Resume there and just showed
// the drill again, with no way out). (APP.onShowScreen)
function jaOnShowScreen(id) {
  const navNumbers = document.getElementById('nav-numbers');
  if (navNumbers) {
    const inNumbersDrill = id === 'drill' && isPendingDrillNumbers();
    navNumbers.textContent = inNumbersDrill ? 'すうじ' : (isPendingDrillNumbers() ? 'Resume' : 'すうじ');
    navNumbers.onclick = inNumbersDrill ? showNumbersScreen : tryResumeOrNumbers;
    navNumbers.classList.remove('sub-screen');
  }
}

// Back from a drill to the kana tables or kanji: clear what was selected,
// so the new score shading shows (APP.clearSelection; the core clears the
// word tiles).
function jaClearSelection(lastSettingsScreen) {
  if (lastSettingsScreen === 'hiragana-selection' || lastSettingsScreen === 'katakana-selection') {
    const picker = kanaPickers[lastSettingsScreen.split('-')[0]];
    if (picker) picker.clear();
  } else if (lastSettingsScreen === 'kanji-selection') {
    // Random 20 included (14 Nov: it kept its "Deselect all" look after a
    // drill - the word lists' old bug, fixed there 16 Oct).
    kanjiSelectedTiles[activeKanjiSection].clear();
    kanjiRandomMode[activeKanjiSection] = false;
    syncKanjiTiles();
  }
}

function tryResume() {
  if (deck.length > 0 && current < deck.length) showScreen('drill');
  else goBackToSettings();
}

// Drill missed only: the kana and kanji missed, rebuilt from DATA (the core
// adds the other kinds, kept as they were asked - APP.rebuildMissed).
function jaRebuildMissed(missedSet) {
  // Rebuild regular DATA items. Kanji/survival items don't carry a static
  // `options` array (unlike kana, which does) - their options are only ever
  // generated at drill-start time from their own section's pool, then
  // discarded, so a raw pull from DATA would otherwise leave them with no
  // answer options at all. Regenerate them the same way drillKanjiSelection
  // does.
  const all = [];
  Object.keys(DATA).forEach(k => {
    const pool = DATA[k];
    pool.forEach(q => {
      if (!missedSet.has(q.char + '|' + q.answer)) return;
      const withGroup = Object.assign({groupKey: k}, q);
      if (q.disp === 'kanji' || q.disp === 'survival') {
        withGroup.options = buildKanjiOptionsFromPool(q, pool);
      }
      all.push(withGroup);
    });
  });
  // The 500 and Seen in materials (14 Nov 2026): their kanji aren't in DATA,
  // so a miss there never came back. Look them up there too, once each.
  const have = new Set(all.map(q => q.char + '|' + q.answer));
  const cards = KANJI_500.map(kanjiCardItem), seenPool = kanjiSeenItems();
  [[cards, cards], [seenPool, seenPool]].forEach(([items, pool]) => items.forEach(item => {
    const key = item.char + '|' + item.answer;
    if (!missedSet.has(key) || have.has(key)) return;
    have.add(key);
    all.push(Object.assign({}, item, { options: buildKanjiOptionsFromPool(item, pool) }));
  }));
  return all;
}

// GLOBAL SOUND SWITCH (2026-10-02) - the header's speaker button. Every
// sound the app makes goes through soundAllowed(): the drill's speak button,
// "Tap a card to hear it", hold-to-peek, and even the silent warm-up
// utterance on page load (some phones pause music for any speech at all).
// Muted also greys out the controls that would otherwise make a sound.
// iPad/iPhone (2026-10-02): Safari ignores speech that doesn't start inside a
// tap, and hold-to-peek speaks from a timer. Speaking one silent utterance
// during the first real tap/click "unlocks" speech for the rest of the
// visit, so timer-started speech works afterwards. Also: Safari can drop an
// utterance queued straight after cancel(), so only cancel when something
// is actually speaking or queued.
if (SPEECH_SUPPORTED) {
  ['touchend', 'click', 'keydown'].forEach(t =>
    document.addEventListener(t, unlockSpeech, { capture: true, passive: true }));
}
// Japanese's speech is the core's now (speakTarget: LANG.code, LANG.rate,
// LANG.pickVoice, and recovery when the browser leaves speech stuck). The
// name stays for the twenty places that call it.
function speakJapanese(text) { return speakTarget(text); }

/* ---------- App settings (on-device only, no sync) ----------------------- */

try {
  const savedSettings = JSON.parse(localStorage.getItem(SETTINGS_KEY));
  if (savedSettings && typeof savedSettings === 'object') {
    // One-time migration: showKanji/showExtra replace the old single
    // showCustomContent switch (Kanji and Extra vocab used to be gated
    // together - now they're independent). If this is the first load since
    // upgrading, savedSettings will have the old key but not the new ones,
    // so carry its value across to both. Once that's happened, savedSettings
    // will have showKanji/showExtra of its own from then on (see
    // saveSettings() below), so this condition never fires again and the
    // two toggles are free to diverge.
    const migratingFromCustomContent = ('showCustomContent' in savedSettings) &&
      !('showKanji' in savedSettings) && !('showExtra' in savedSettings);
    if (migratingFromCustomContent) {
      savedSettings.showKanji = savedSettings.showCustomContent;
      savedSettings.showExtra = savedSettings.showCustomContent;
    }

    // One-time migration (2026-08-31): Trip and Andrew mode merged into a
    // single "Untaught" tier - every word that used to live behind either
    // toggle already carries the 'untaught' item tag (100% coverage,
    // verified directly against VOCAB before this shipped), so gating now
    // happens by tag, not by category level. showUntaught defaults to null
    // so this migration can tell "never set" apart from "explicitly off":
    // if savedSettings doesn't have it yet, resolve it once from whichever
    // of the two old toggles was on (either one being on meant this content
    // was visible), then never touch it again. showAndrewMode itself resets
    // to false for everyone as part of this - "Andrew mode" survives as its
    // own toggle/pill, but empty, staged and ready for L3 content later (see
    // that toggle's own settings-card description). showTripVocab is
    // dropped entirely; if a returning user's saved JSON still has it, it's
    // just an inert leftover key that's never read again, same as
    // showCustomContent above.
    const migratingToUntaught = !('showUntaught' in savedSettings);
    if (migratingToUntaught) {
      savedSettings.showUntaught = !!(savedSettings.showAndrewMode || savedSettings.showTripVocab);
      savedSettings.showAndrewMode = false;
    }

    // One-time migration (2026-09-28): Genki tier folded into Untaught -
    // same shape as the migration just above. Anyone who already had
    // Genki switched on keeps seeing Lesson 1-1's not-yet-taught words,
    // just via showUntaught now instead of its own showGenki toggle (see
    // itemTierVisible). showGenki itself is dropped after this - an inert
    // leftover key if it's still in an old saved JSON, same as
    // showTripVocab/showCustomContent above.
    const migratingGenkiToUntaught = 'showGenki' in savedSettings;
    if (migratingGenkiToUntaught && savedSettings.showGenki) {
      savedSettings.showUntaught = true;
    }
    // Bug fixed 2026-10-15: showGenki was never actually removed, so it was
    // copied into appSettings and saved back every time - and because it was
    // still there on the next load, this migration ran on EVERY load and
    // switched Untaught back on whenever someone had turned it off. Delete it
    // so the migration really is one-time (it then saves without the key).
    if (migratingGenkiToUntaught) delete savedSettings.showGenki;

    // One-time (2026-10-15): tourist words split out of Untaught under their
    // own toggle. Anyone who had Untaught on keeps seeing them - showTourist
    // starts as a copy of showUntaught. Runs once because the key then exists.
    const migratingTourist = !('showTourist' in savedSettings) || savedSettings.showTourist === null;
    if (migratingTourist) savedSettings.showTourist = !!savedSettings.showUntaught;

    Object.assign(appSettings, savedSettings);
    if (migratingFromCustomContent || migratingToUntaught || migratingGenkiToUntaught || migratingTourist) saveSettings();
  }
} catch (e) {
  // localStorage unavailable or corrupt — fall back to defaults silently
}

// Kanji used to share a "custom content" switch with Extra vocab; they're
// now independent, and hidden entirely (not just greyed out) when off.
function applyShowKanjiVisibility() {
  const on = appSettings.showKanji;
  const kanjiPill = document.getElementById('nav-kanji');
  if (kanjiPill) kanjiPill.style.display = on ? '' : 'none';
  // The old theme-all-kanji-card toggle lived here until the card itself
  // moved to screen-kanji-selection (2026-09-22) - no longer needed, since
  // that whole screen is already unreachable the moment nav-kanji above is
  // hidden.
  // If Kanji gets switched off while its selection screen happens to be
  // open, there's nothing sensible left showing - fall back to Vocab.
  const kanjiScreen = document.getElementById('screen-kanji-selection');
  const kanjiIndex = document.getElementById('screen-kanji-index');
  if (!on && ((kanjiScreen && kanjiScreen.classList.contains('visible')) || (kanjiIndex && kanjiIndex.classList.contains('visible')))) showMatchSettings();
  const card = document.getElementById('show-kanji-toggle-card');
  if (card) card.classList.toggle('selected', on);
}

function toggleShowKanji() {
  appSettings.showKanji = !appSettings.showKanji;
  saveSettings();
  applyShowKanjiVisibility();
}

// Untaught vocabulary - everything not covered in the taught Level 1/2
// course: words specific to travelling to Japan (food, money, directions,
// emergencies, tourist phrases), plus real words and phrases pulled from
// photos taken on the trip itself (signs, menus, receipts, announcements).
// Until 2026-08-31 this was two separate tiers - "Trip vocabulary" and
// "Andrew mode" - split by where the content came from (curated ahead of
// time vs encountered and photographed). That distinction is already
// captured per-word by the curated/encountered tags (see LEVEL_BORDER_COLORS
// and itemColorKey), so keeping two toggles doing the same visibility job
// stopped earning its keep - merged into this one tier instead. Every word
// that lives here carries the 'untaught' item tag, which is what
// scanVocabByTag('untaught') in startRandomMatch reads directly, and what
// itemTierVisible below gates for every other scan by checking the same
// tag on each item. Same hide-entirely, off-by-default pattern as the
// rest of the gated tiers.
function applyShowUntaughtVisibility() {
  const on = appSettings.showUntaught;
  const untaughtPill = document.getElementById('level-pill-untaught');
  if (untaughtPill) untaughtPill.style.display = on ? '' : 'none';
  if (!on && currentMatchLevel === 'untaught') setMatchLevel('theme');
  const card = document.getElementById('show-untaught-toggle-card');
  if (card) card.classList.toggle('selected', on);
  applyOptionalPillRow();
}

function toggleShowUntaught() {
  appSettings.showUntaught = !appSettings.showUntaught;
  saveSettings();
  applyShowUntaughtVisibility();
}

// Tourist words (2026-10-15) - their own toggle and pill, split from Untaught.
function applyShowTouristVisibility() {
  const on = !!appSettings.showTourist;
  const pill = document.getElementById('level-pill-tourist');
  if (pill) pill.style.display = on ? '' : 'none';
  if (!on && currentMatchLevel === 'tourist') setMatchLevel('theme');
  const card = document.getElementById('show-tourist-toggle-card');
  if (card) card.classList.toggle('selected', on);
  applyOptionalPillRow();
}
function toggleShowTourist() {
  appSettings.showTourist = !appSettings.showTourist;
  saveSettings();
  applyShowTouristVisibility();
}
// The second pill row only shows when it has a pill in it.
function applyOptionalPillRow() {
  const row = document.getElementById('vocab-optional-filter-row');
  if (row) row.style.display = (appSettings.showTourist || appSettings.showUntaught) ? '' : 'none';
}

// Registers/unregisters the service worker to match the setting - called on
// every toggle, and once at startup so a stray registration from a previous
// session (e.g. the setting was on, then somehow got turned off without this
// running) gets cleaned up rather than silently lingering. Turning it off
// actively unregisters and clears the cache, rather than just leaving an
// old worker running unmanaged.

function toggleWorkOffline() {
  appSettings.workOffline = !appSettings.workOffline;
  saveSettings();
  applyWorkOfflineUI();
  syncServiceWorkerRegistration();
}

// INSTALL CARD (2026-10-13). A browser reports whether the page is running
// as an installed home-screen app (display-mode standalone, or Safari's
// navigator.standalone). When it isn't, Settings shows how to install for
// this phone. Android Chrome offers its own install prompt
// (beforeinstallprompt), so there the card gets an Install button.
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstallPrompt = e; refreshInstallCard(); });
window.addEventListener('appinstalled', () => { deferredInstallPrompt = null; refreshInstallCard(); });

/* ---------- Kana confidence tracking (on-device only, no sync) ---------- */
// Tracks a -2..+2 score per single kana character, based on right/wrong
// answers during hiragana/katakana drilling (base/diacritic/youon groups
// only — not word/number/time/kanji). Shown as tile shading on the
// reference screens; doesn't affect drilling, scoring, or selection.
try {
  kanaScores = JSON.parse(localStorage.getItem(KANA_SCORE_KEY)) || {};
} catch (e) {
  kanaScores = {};
}
kanaScores = linkScoreStore(kanaScores); // the kanji shared with Kanji Cards (core.js, LINKED SCORES)

// One-off migration: gym/pool/supermarket were stored hiragana-primary
// (backwards from how they're actually written) and have swapped to
// katakana-primary. Scores are keyed on jp+'|'+en, so without this the
// swap would silently reset anyone's existing progress on these 3 words
// back to neutral. Carries the old score across to the new key once,
// then leaves the stale key in place (harmless, never read again).
const SCORE_KEY_RENAMES = [
  ['じむ|gym', 'ジム|gym'],
  ['ぷーる|pool', 'プール|pool'],
  ['すーぱー|supermarket', 'スーパー|supermarket'],
  ['しゃーうっどのもり|Sherwood Forest', 'シャーウッドの森|Sherwood Forest'],
  // L4 Lesson 2 (17 Nov 2026): あまり is "not very" with adjectives as well.
  ['あまり|not often / seldom (+ negative verb)', 'あまり|not very / not often (+ negative)'],
];
SCORE_KEY_RENAMES.forEach(([oldKey, newKey]) => {
  if (oldKey in kanaScores && !(newKey in kanaScores)) {
    kanaScores[newKey] = kanaScores[oldKey];
  }
});

// One-off migration (2026-09-01): every entry used to be a bare number.
// DECAY (see decayedScore() below) needs to know when a score was last
// actually earned, not just what it was, so entries are now
// {score, lastSeen} instead. lastSeen defaults to right now for anything
// migrated here, deliberately - there's no way to know when an existing
// score was really last touched, and defaulting to "now" means nobody's
// colours or drill weighting shift the moment this ships; decay only ever
// starts counting forward from here. Runs before recordKanaResult ever
// writes a new-shape entry, so by the time anything reads kanaScores[key]
// elsewhere in the app, every entry (old or new) is already in the new
// shape - no scattered "is this the old or new shape" checks needed
// anywhere else in the codebase.
Object.keys(kanaScores).forEach((key) => {
  if (typeof kanaScores[key] === 'number') {
    kanaScores[key] = { score: kanaScores[key], lastSeen: Date.now() };
  }
});

// The single kanji's scores move to their Kanji Cards cards, once (ja/kanji.js).
moveKanjiScoresToCards();

// PRODUCTION SCORES (2026-10-22, Andrew). Typing the answer yourself (romaji,
// Japanese, a verb form) is a different skill from picking it out of four, so
// it has its own score and can never cost a recognition green:
//   - a correct typed answer still ADDS to the recognition score as before;
//     a wrong or nearly-right one leaves recognition alone;
//   - the production score is graded upwards, like the Strokes app: exact = 1,
//     nearly (one slip) = 0.6, after a hint = at most 0.5, wrong = 0.
// prodScores[key] = { p: 0..1, n: attempts, lastSeen }. p climbs a third of
// the way towards each attempt's credit, and a lower credit only pulls it
// down a tenth of the way, so a bad day barely dents it. Same keys as
// kanaScores (getScoreKey).
const PROD_SCORE_KEY = 'jpL4ProdScores';
let prodScores = {};
try { prodScores = JSON.parse(localStorage.getItem(PROD_SCORE_KEY)) || {}; } catch (e) { prodScores = {}; }
function saveProdScores() {
  try { localStorage.setItem(PROD_SCORE_KEY, JSON.stringify(prodScores)); } catch (e) { /* fail silently */ }
}
// The production score is retired (2026-11-08, decided in the mapping doc:
// one score in every app). Kept as a name for the builder, which still calls it.
function recordProduction(key, credit) { /* retired */ }
// Edit distance (insert / delete / swap one letter), for "nearly".
function editDistance(a, b) {
  a = [...a]; b = [...b];
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}
// Nearly = one slip on a word of 4+ letters (romaji) or 3+ kana, two slips
// from 9+ letters. Anything shorter has to be exact - one letter is the
// whole word there.
function isNearly(typed, target, kana) {
  if (!typed || !target) return false;
  const len = [...target].length;
  const allow = kana ? (len >= 3 ? 1 : 0) : (len >= 9 ? 2 : len >= 4 ? 1 : 0);
  return allow > 0 && editDistance(typed, target) <= allow;
}
// One typed answer: production credit, and recognition only ever goes up.
// Returns the credit (1 / 0.6 / 0.5 / 0.3 / 0).
// One typed answer (2026-11-08, decided: the core's rule). Right adds, as
// any right answer; one slip ("nearly") gets half credit; a miss costs a
// little (0.25) - something you produce yourself, typed or said.
// Returns the old production credit, which nothing shows any more.
function recordTypedAnswer(q, result) { // result: 'exact' | 'nearly' | 'wrong'
  if (result === 'wrong') recordKanaResult(q, false, false, true);
  else recordKanaResult(q, true, result === 'nearly', true);
  return result === 'exact' ? 1 : result === 'nearly' ? 0.6 : 0;
}
// Average production over a list of vocab items (untried words count as 0),
// and whether any have been tried - for the thin bar under a category card.
function getItemsProduction(items) {
  let total = 0, tried = 0;
  (items || []).forEach(it => { const e = prodScores[it.jp + '|' + it.en]; if (e) { total += e.p; tried++; } });
  return { avg: items && items.length ? total / items.length : 0, tried };
}

// Private vocab file: load (replaces any pack already on this device),
// remove, and the status line in Settings. Both reload the page so every
// list, collection and search picks the change up cleanly.
updatePrivateVocabStatus();

/* ---------- In-progress drill persistence (survives a killed page) ------ */

function continuousScoreClass(score) {
  const band = confidenceBand(score);
  return band ? 'score-' + band : '';
}

// Whole-category average, for the category-select cards (Level 1/Level 2/
// Extra tabs). Never-drilled items are excluded from the average entirely
// (not counted as neutral/zero) - a category nobody has touched yet should
// show no shading at all, same convention as kanaScoreClass for single items.
// Returns null when zero items in the category have been drilled.
function getCategoryAverageScore(categoryKey) {
  // Routed through resolveVocabCategory (not raw VOCAB[categoryKey]) so a
  // category using includeItems gets a swatch that reflects the referenced
  // word's score too, not just its own stored items.
  const v = resolveVocabCategory(categoryKey);
  if (!v) return null;
  return getItemsAverageScore(v.items);
}

function categoryConfidenceClass(avg) {
  const band = confidenceBand(avg);
  return band ? 'cat-conf-' + band : '';
}

const CAT_CONF_CLASSES = CONFIDENCE_BANDS.map(b => 'cat-conf-' + b);

// For the Theme tab's (Collections') static cards - same per-category
// confidence SPREAD bar as buildCategoryTile's own tiles (2026-09-22),
// computed over each theme's freshly-computed pool (getThemePool) rather
// than a single VOCAB category's items, "so it's calculated in a very
// similar way to the others" per Andrew - just a different item source.
// Builds the Groups pill's cards from the data (2026-10-12) - replaces the
// cards that used to be written into the HTML by hand.
renderGroupCards();

// RANDOM PAGE (2026-10-07) - the die pill. One choice at a time, then Start.
// The three "everything" drills and the per-level randoms all live here now,
// so Groups and the level pages are purely things you pick words from.
// Untaught without the tourist words (they have their own pill since 2026-10-15).
const UNTAUGHT_ONLY_QUERY = { all: ['untaught'], none: ['tourist'] };
// Random's "still untested" count, split by kind when Untaught or Tourist is
// on: "(312 of 1,550 · 40 taught, 272 untaught)". Only the kinds with words
// left are named (Andrew, 2026-10-16); with none left it's "(0 of 1,558)".
// (APP.untestedCount)
function jaUntestedCount() {
  const uniq = list => { const m = new Map(); list.forEach(i => m.set(i.jp + '|' + i.en, i)); return [...m.values()]; };
  const all = uniq(getAllVocabPool()), un = uniq(getUntestedVocabItems());
  const fmt = n => n.toLocaleString('en-GB');
  let txt = ` (${fmt(un.length)} of ${fmt(all.length)}`;
  if (appSettings.showUntaught || appSettings.showTourist) {
    const has = (i, tag) => (i.tags || []).includes(tag);
    const t = un.filter(i => has(i, 'taught')).length;
    const tour = un.filter(i => has(i, 'untaught') && has(i, 'tourist')).length;
    const parts = [];
    if (t) parts.push(`${fmt(t)} taught`);
    if (appSettings.showTourist && tour) parts.push(`${fmt(tour)} tourist`);
    if (appSettings.showUntaught && un.length - t - tour) parts.push(`${fmt(un.length - t - tour)} untaught`);
    if (parts.length) txt += ' · ' + parts.join(', ');
  }
  return txt + ')';
}

// Chrome/Safari sometimes clip the very start of the first utterance while the
// speech engine "warms up". Priming it silently as soon as the page loads
// means it's already warm by the time the hint button is actually tapped.
updateSoundButton();
if (soundAllowed()) {
  const primer = new SpeechSynthesisUtterance(' ');
  primer.volume = 0;
  window.speechSynthesis.speak(primer);
  window.speechSynthesis.getVoices();
}

// Works out what Japanese text should actually be spoken for the current
// question, since the character on screen isn't always the pronounceable side
// (e.g. reversed mode shows romaji; number/time questions show digits).

function revealRomaji() {
  const q = deck[current];
  if (q && q.disp === 'particle') {
    const el = document.getElementById('q-romaji-reveal');
    if (!el) return;
    if (!answered && !hintUsedThisQuestion) {
      hintUsedThisQuestion = true;
      hints++;
      document.getElementById('stat-hints').textContent = hints;
    }
    el.textContent = q.roBlank;
    el.style.display = 'block';
    return;
  }
  if (!q || !q.answerRomaji) return;
  const el = document.getElementById('q-romaji-reveal');
  if (!el) return;
  const hasKanji = KANJI_CHAR_RE.test(q.char);
  // Kanji words without either a verified per-character breakdown or a
  // recorded reason why one isn't available don't get a reveal at all (the
  // button is disabled before this can even fire - see renderQuestion)
  // rather than falling back to the old whole-word romaji, which was found
  // to just hand over the literal answer in reading-practice mode. Kana-only
  // words have no such problem and keep the original whole-word reveal.
  if (hasKanji && !q.kanjiReading && !q.kanjiReadingBlocked) return;
  // Showing the block-reason text isn't a hint towards the answer - it just
  // explains why no reading help is available for this word - so it doesn't
  // cost anything, unlike an actual reading reveal.
  const isReasonOnly = hasKanji && !q.kanjiReading && q.kanjiReadingBlocked;
  if (!isReasonOnly && !answered && !hintUsedThisQuestion) {
    hintUsedThisQuestion = true;
    hints++;
    document.getElementById('stat-hints').textContent = hints;
  }
  if (hasKanji && q.kanjiReading) {
    // Segmented per-kanji reading, shown as character(reading) pairs rather
    // than bare hyphenated romaji. For a mixed kanji+kana word (e.g. お知らせ)
    // kanjiReading only ever covers the KANJI portion - the kana (お, らせ)
    // is already directly readable and deliberately left out, so the pairing
    // makes clear this is "here's how to read 知", not "here's the whole
    // word's pronunciation". Found necessary in practice (2026-08-30): a
    // bare "shi" for お知らせ looked like a wrong or incomplete answer with
    // nothing tying it back to which part of the word it explained. For a
    // pure-kanji word this still shows every character, so it reads as the
    // complete word broken down (e.g. 駅(eki) 事(ji) 務(mu) 室(shitsu)).
    el.textContent = q.kanjiReading.map(p => `${p.char}(${p.reading})`).join(' ');
  } else if (hasKanji && q.kanjiReadingBlocked) {
    el.textContent = q.kanjiReadingBlocked;
  } else {
    el.textContent = q.answerRomaji;
  }
  el.style.display = 'block';
}

// Kana answer size: as big as fits on one line in a half-width option.
function optKanaSize(text) {
  const n = [...String(text || '')].filter(ch => !SMALL_KANA_CHARS.has(ch)).length;
  return n <= 5 ? 20 : n <= 7 ? 17 : n <= 9 ? 15 : 13;
}

// TYPED JAPANESE (2026-10-07) - reversed + Type. Lenient the same way the
// romaji check is: spaces and punctuation ignored, hiragana and katakana
// treated as the same (びーる for ビール counts, with a note of the usual
// spelling), and the kanji form counts too, since phone and Mac keyboards
// convert to kanji on their own (食べます for たべます).
function normaliseTypedJapanese(str) {
  return (str || '').normalize('NFKC')
    .replace(/[\s。、．，.,!?！？・〜~「」()（）]/g, '')
    .replace(/[\u30A1-\u30F6]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}
function chooseTypedJapanese(rawInput, q) {
  if (answered) return;
  answered = true;
  const input = document.getElementById('type-answer-input');
  const submitBtn = document.getElementById('type-answer-submit');
  if (input) input.disabled = true;
  if (submitBtn) submitBtn.disabled = true;
  const typed = normaliseTypedJapanese(rawInput);
  const forms = [q.char, q.altForm, q.speakAs, ...(VERB_TYPING_KANJI[q.char] || []), ...String(q.char).split(/\s*[\/／]\s*/)].filter(Boolean);
  const isCorrect = !!typed && forms.some(f => normaliseTypedJapanese(f) === typed);
  const nearly = !isCorrect && forms.some(f => isNearly(typed, normaliseTypedJapanese(f), true));
  if (input) input.classList.add(isCorrect ? 'correct' : nearly ? 'nearly' : 'wrong');
  // Right, but not as it's usually written (other script, or kana for a word
  // normally in kanji) - say how it's normally written.
  const asTyped = (rawInput || '').normalize('NFKC').replace(/\s/g, '');
  const usual = (q.altIsStandard && q.altForm) ? q.altForm : q.char;
  let note = '';
  if (isCorrect && (asTyped === String(usual).replace(/\s/g, '') || (VERB_TYPING_KANJI[q.char] || []).includes(asTyped))) note = '';
  else if (isCorrect && asTyped !== String(q.char).replace(/\s/g, '')) note = `<div class="feedback-standard-note">Usually written: ${markSmallKana(usual)}</div>`;
  else if (q.altIsStandard && q.altForm) note = `<div class="feedback-standard-note">Normally shown as: ${markSmallKana(q.altForm)}</div>`;
  else if (q.altAfterAnswer && q.altForm) note = `<div class="feedback-standard-note">Also seen as: ${markSmallKana(q.altForm)}</div>`;
  note += jaAdjNoteHtml(q); // an adjective's kind and example (13 Nov 2026)
  recordTypedAnswer(q, isCorrect ? 'exact' : nearly ? 'nearly' : 'wrong');
  const fb = document.getElementById('q-feedback');
  if (isCorrect) {
    score++;
    fb.innerHTML = 'Correct!' + note;
    fb.className = 'feedback good';
  } else if (nearly) {
    score++;
    fb.innerHTML = `Nearly! — check it: "${markSmallKana(q.char)}" (${q.answerRomaji})` + note;
    fb.className = 'feedback nearly';
  } else {
    wrong++;
    fb.innerHTML = `Not quite — the answer is "${markSmallKana(q.char)}" (${q.answerRomaji})` + note;
    fb.className = 'feedback bad';
    const missedKey = q.char + '|' + q.answer;
    if (!missed.includes(missedKey)) { missed.push(missedKey); missedItems.push(q); }
  }
  document.getElementById('stat-correct').textContent = score;
  document.getElementById('stat-wrong').textContent = wrong;
  const nextBtn = document.getElementById('next-btn');
  nextBtn.style.visibility = 'visible';
  nextBtn.innerHTML = (current + 1 < deck.length ? 'Next →' : 'See results →') + '<span class="kbd-hint">space</span>';
}

// Alternative to choose() for typeAnswerMode (see toggleTypeAnswerMode) -
// same scoring/state-machine shape (answered guard, recordKanaResult,
// missed/missedItems, score/wrong, feedback text, Next button reveal) but
// comparing a typed string via canonicalizeRomaji() instead of a clicked
// button's dataset.value, and disabling the input/Check button instead of
// a set of .opt buttons. Word-drill only (isWord && !vocabReversed &&
// !drillByMeaning is enforced by the toggles' mutual exclusion, so `answer`
// here is always q.answerRomaji) - the reversed/kanji/number/time/counter
// question types never reach this function.
function chooseTyped(rawInput, answer, char) {
  if (answered) return;
  answered = true;
  const input = document.getElementById('type-answer-input');
  const submitBtn = document.getElementById('type-answer-submit');
  if (input) input.disabled = true;
  if (submitBtn) submitBtn.disabled = true;
  const typedCanon = canonicalizeRomaji(rawInput), answerCanon = canonicalizeRomaji(answer);
  const isCorrect = typedCanon === answerCanon;
  const nearly = !isCorrect && isNearly(typedCanon, answerCanon, false);
  if (input) input.classList.add(isCorrect ? 'correct' : nearly ? 'nearly' : 'wrong');
  // Reveal the materials context card that renderQuestion held back for
  // typeAnswerMode (see the comment there) - content's already populated
  // by renderQuestion, this just un-hides it now that answering is done
  // and the keyboard's about to close. Guarded on the body actually having
  // content, since renderQuestion leaves it empty (and the card hidden)
  // for every non-Materials question.
  const contextCard = document.getElementById('q-context-card');
  const contextCardBody = document.getElementById('q-context-card-body');
  if (contextCard && contextCardBody && contextCardBody.innerHTML.trim()) {
    contextCard.style.display = 'block';
  }
  const fb = document.getElementById('q-feedback');
  const currentQ = deck[current];
  const hint = (currentQ && currentQ.hint) ? ` (${currentQ.hint})` : '';
  const standardNote = (currentQ && currentQ.altIsStandard && currentQ.altForm)
    ? `<div class="feedback-standard-note">Normally shown as: ${markSmallKana(currentQ.altForm)}</div>`
    : (currentQ && currentQ.altAfterAnswer && currentQ.altForm)
    ? `<div class="feedback-standard-note">Also seen as: ${markSmallKana(currentQ.altForm)}</div>`
    : '';
  const adjNote = jaAdjNoteHtml(currentQ); // an adjective's kind and example (13 Nov 2026)
  recordTypedAnswer(currentQ, isCorrect ? 'exact' : nearly ? 'nearly' : 'wrong');
  revealListenWord(currentQ);
  // Show the accepted spelling either way, not just on a miss - per Andrew,
  // the point is to teach the canonical romanization, and what was typed
  // may have matched only after canonicalizeRomaji() folded away a real
  // spelling difference (case, long vowels, si/shi-style variants, etc).
  if (isCorrect) {
    score++;
    fb.innerHTML = `Correct! — accepted spelling: "${answer}"` + hint + standardNote + adjNote;
    fb.className = 'feedback good';
  } else if (nearly) {
    score++;
    fb.innerHTML = `Nearly! — check the spelling: "${answer}"` + hint + standardNote + adjNote;
    fb.className = 'feedback nearly';
  } else {
    wrong++;
    fb.innerHTML = `Not quite — the answer is "${answer}"` + hint + standardNote + adjNote;
    fb.className = 'feedback bad';
    const missedKey = char + '|' + answer;
    if (!missed.includes(missedKey)) {
      missed.push(missedKey);
      if (currentQ && (currentQ.disp === 'number' || currentQ.disp === 'word' || currentQ.disp === 'time' || currentQ.disp === 'counter' || currentQ.disp === 'verbform' || currentQ.disp === 'particle' || currentQ.disp === 'sokuon')) missedItems.push(currentQ);
    }
  }
  document.getElementById('stat-correct').textContent = score;
  document.getElementById('stat-wrong').textContent = wrong;
  const nextBtn = document.getElementById('next-btn');
  nextBtn.style.visibility = 'visible';
  nextBtn.innerHTML = (current + 1 < deck.length ? 'Next →' : 'See results →') + '<span class="kbd-hint">space</span>';
}

// The Vocab page's level pills (APP.matchLevel). Untaught, Tourist and
// Andrew show only when their setting is on (the pills are hidden too);
// Grammar is its own tab (2026-10-16); the old L1 and L2 pills are one
// (2026-11-05).
function jaPickMatchLevel(level) {
  if (level === 'andrew') return null; // Andrew mode, removed 2026-11-08
  if (level === 'untaught' && !appSettings.showUntaught) return null;
  if (level === 'grammar') { showGrammarPage(); return null; }
  if (level === 'tourist' && !appSettings.showTourist) return null;
  if (level === 1 || level === 2) return 'l12';
  return level;
}
function jaMatchLevelPills(level) {
  document.getElementById('level-pill-12').classList.toggle('active', level === 'l12');
  document.getElementById('level-pill-3').classList.toggle('active', level === 3);
  document.getElementById('level-pill-4').classList.toggle('active', level === 4);
  ['untaught', 'tourist'].forEach(k => {
    const p = document.getElementById('level-pill-' + k);
    if (p) p.classList.toggle('active', level === k);
  });
}

// A level's list of word lists (APP.matchLevel.list). Untaught, Andrew and
// Tourist reuse the same list view as the levels, so a new category only
// needs its level (or a Group its show:) in vocab.js to appear.
function jaLevelList(container, level) {
  // A line at the top saying this page can be switched off (2026-10-15) -
  // mainly so Untaught users know Tourist has its own switch.
  const offNote = text => { const d = document.createElement('div'); d.className = 'tier-off-note'; d.textContent = text; container.appendChild(d); };
  if (level === 'untaught') offNote('You can turn this page off in Settings (Untaught vocabulary).');
  if (level === 'tourist') offNote('You can turn this page off in Settings (Tourist words).');
  if (level === 'untaught') {
    // Private word lists (Genki) first, on a device where the file has been
    // loaded; then one alphabetical set of the Untaught Groups (show:
    // 'untaught') and categories (level:'untaught'). Cards whose words are
    // all tourist words are empty here (those are on Tourist), so left out.
    PRIVATE_VOCAB_KEYS.forEach(key => container.appendChild(buildCategoryTile(key)));
    container.appendChild(document.createElement('div')).className = 'section-divider';
    const untaughtThemeKeys = Object.keys(THEMES).filter(key => THEMES[key].show === 'untaught');
    const untaughtVocabKeys = Object.keys(VOCAB).filter(key =>
      (VOCAB[key].level || 1) === 'untaught' && VOCAB[key].standaloneCard !== false);
    untaughtThemeKeys.concat(untaughtVocabKeys)
      .filter(key => resolveVocabCategory(key).items.length > 0)
      .map(key => ({ key, label: (THEMES[key] || VOCAB[key]).label }))
      .sort((a, b) => a.label.localeCompare(b.label))
      .forEach(({ key }) => container.appendChild(buildCategoryTile(key)));
    container.appendChild(document.createElement('div')).className = 'section-divider';
  }
  // L1/L2: one list in JP_DRILL_L12_LIST's order - the old L1 and L2
  // categories, a few merged into Groups (show:'l12'). Each card has small
  // L1/L2 badges for where its words come from.
  if (level === 'l12') {
    L12_LIST.filter(key => VOCAB[key] || THEMES[key]).forEach(key => {
      const card = buildCategoryTile(key);
      const lvls = VOCAB[key] ? [VOCAB[key].level || 1]
        : [...new Set(resolveVocabCategory(key).items.map(itemColorKey))].filter(l => l === 1 || l === 2).sort();
      const count = card.querySelector('.group-count');
      if (count && lvls.length) count.insertAdjacentHTML('beforeend',
        '<span class="cat-lvl-badges">' + lvls.map(l => `<span class="gp-lvl gp-lvl-${l}">L${l}</span>`).join('') + '</span>');
      container.appendChild(card);
    });
    return;
  }
  // Tourist: "All tourist words" first, then one card per section in data
  // order (theme-te-* in vocab.js, show:'tourist').
  if (level === 'tourist') {
    Object.keys(THEMES).filter(key => THEMES[key].show === 'tourist-top')
      .forEach(key => container.appendChild(buildCategoryTile(key)));
    container.appendChild(document.createElement('div')).className = 'section-divider';
    Object.keys(THEMES).filter(key => THEMES[key].show === 'tourist')
      .forEach(key => container.appendChild(buildCategoryTile(key)));
    return;
  }
  // Every other level: its categories in vocab.js order (Untaught's are
  // above already). standaloneCard:false keeps a category as storage for
  // tag scans without a card of its own. (Reference cards - the zodiac
  // clock, days in order - are on their own category's screen.)
  Object.keys(VOCAB).forEach(key => {
    const v = VOCAB[key];
    if ((v.level || 1) !== level) return;
    if (level === 'untaught') return;
    if (v.standaloneCard === false) return;
    container.appendChild(buildCategoryTile(key));
  });
}

/* ---------- Random counter challenge ---------- */

/* ---------- end Random counter challenge ---------- */

// Level 3 plain grammar cards (を additions, と/や, それから, なん/なに, どんな,
// place + で, family, お/ご, noun + します) moved to grammar.js (2026-10-12).

function showVocabReference(categoryKey) {
  // vocab-tile-selection (2026-08-31, was match-settings) - this generic
  // function's only caller right now (Days of the week, via
  // CATEGORY_REFERENCE_LINKS) opens it from that category's own selection
  // screen, so Back should land there, not the list. Revisit if this
  // function ever gains a second caller from a different context.
  vocabRefBackTarget = 'vocab-tile-selection';
  const v = VOCAB[categoryKey];
  document.getElementById('vocab-ref-title').textContent = v.label;
  const list = document.getElementById('vocab-ref-list');
  list.className = '';
  list.innerHTML = '';
  v.items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'vocab-ref-row two-col';
    row.innerHTML = `
      <div class="vocab-ref-col-left">
        <div class="vocab-ref-jp">${markSmallKana(item.jp)}</div>
        ${item.altForm ? `<div class="vocab-ref-alt">${markSmallKana(item.altForm)}</div>` : ''}
      </div>
      <div class="vocab-ref-col-right">
        <div class="vocab-ref-en">${item.en}</div>
        <div class="vocab-ref-romaji">${item.romaji}</div>
      </div>
    `;
    list.appendChild(row);
  });
  showScreen('vocab-reference');
}

// Human-readable labels for the device tags used in Materials — Hotel:
// Appliances & machines' items (see the `devices` array on each item). Fixed
// display order below, not alphabetical - climate control first since every
// hotel room has it, more niche panels after.
const APPLIANCE_DEVICE_LABELS = {
  'ac': 'Air conditioning',
  'tv-remote': 'TV remote',
  'laundry': 'Laundry', // was "Washing machine" - widened to cover the
                         // machine's own panel plus things like detergent
                         // bottle labels once those started showing up too.
  'microwave': 'Microwave',
  'door-lock': 'Door lock / key card',
  'toilet': 'Toilet / bidet',
};
const APPLIANCE_DEVICE_ORDER = ['ac', 'tv-remote', 'laundry', 'microwave', 'door-lock', 'toilet'];

// Reference-only cross-cut of Materials — Hotel: Appliances & machines,
// grouped by which physical panel/remote/dispenser each word was actually
// seen on. Deliberately NOT its own VOCAB category and NOT drillable here -
// the words stay stored, scored, and randomly drillable purely as ordinary
// members of vocab-materials-hotel-appliances; this page just filters and
// groups that one category's items fresh every time it's opened, so it
// always reflects the category's current state with no duplication and no
// extra scoring plumbing. Deliberately simpler than the includeItems
// mechanism (Trip vs Materials) - that one exists because a word needed to
// be drilled from two different category screens, which meant two categories
// both needed to see it. Here nothing needs to be drilled by device - Andrew
// wants an at-a-glance "what does this button mean" lookup, not a separate
// drillable deck per appliance - so a plain filtered read of one category is
// enough, and device labels don't have to live in VOCAB at all.
// Words with no `devices` tag (general hotel-appliance vocab that isn't
// literally printed on a panel/button/dispenser - payment logistics,
// warnings in prose, etc.) simply don't appear here. That's intentional for
// now; revisit if a future category of "not on a panel but still worth a
// reference" word shows up.
function showApplianceDeviceReference() {
  // vocab-tile-selection (2026-08-31, was match-settings) - opens from
  // Hotel: Appliances & machines' own selection screen now (see
  // CATEGORY_REFERENCE_LINKS), so Back should land there, not the list.
  vocabRefBackTarget = 'vocab-tile-selection';
  document.getElementById('vocab-ref-title').textContent = 'Appliances reference';
  const list = document.getElementById('vocab-ref-list');
  list.className = 'tight-list';
  list.innerHTML = '';
  const items = VOCAB['vocab-materials-hotel-appliances'].items;
  APPLIANCE_DEVICE_ORDER.forEach(device => {
    const matches = items.filter(item => item.devices && item.devices.includes(device));
    if (!matches.length) return;
    const heading = document.createElement('div');
    heading.className = 'appliance-device-heading';
    heading.textContent = APPLIANCE_DEVICE_LABELS[device] || device;
    list.appendChild(heading);
    // Alphabetical within each device (by en) - this page is meant to give
    // an overall picture of a device's vocabulary, not to mirror any one
    // physical panel's button layout (which varies remote to remote anyway,
    // and the same word can come from more than one photographed panel).
    matches.slice().sort((a, b) => a.en.localeCompare(b.en)).forEach(item => {
      const row = document.createElement('div');
      row.className = 'vocab-ref-row two-col';
      row.innerHTML = `
        <div class="vocab-ref-col-left">
          <div class="vocab-ref-jp">${markSmallKana(item.jp)}</div>
          ${item.altForm ? `<div class="vocab-ref-alt">${markSmallKana(item.altForm)}</div>` : ''}
        </div>
        <div class="vocab-ref-col-right">
          <div class="vocab-ref-en">${item.en}</div>
          <div class="vocab-ref-romaji">${item.romaji}</div>
        </div>
      `;
      list.appendChild(row);
    });
  });
  showScreen('vocab-reference');
}

function startRandomMatch() { startRandomForLevel(currentMatchLevel); }
function startRandomForLevel(level) {
  // Level 1/2/Untaught: a genuine tag query via scanVocabByTag (see comment
  // there) - every item tagged 'L1'/'L2'/'untaught' anywhere, not "every
  // item stored in a category whose own level happens to match". This is
  // what makes a word tagged forward (e.g. ['L1','L3',...]) show up in
  // multiple levels' random pools with no extra work, the moment
  // forward-tagging is used. Untaught joined this pattern 2026-08-31 when
  // Andrew/Trip merged into a single tier - every word that used to need
  // the old per-category level walk below already carries the 'untaught'
  // item tag (100% coverage, verified before this shipped), so it no
  // longer needs its own special case.
  //
  // Andrew: still a per-category level match, deliberately not a tag
  // query - Andrew mode has never had a universal per-item tier tag of its
  // own (there's currently nothing at level:'andrew' to tag - it's an
  // empty staging tier), so this raw walk stays as the fallback for
  // whatever L3 content lands here next, until that content gets a proper
  // tag of its own the way Untaught just did.
  let allItems;
  if (level === 1 || level === 2 || level === 3 || level === 4) {
    allItems = scanVocabByTag('L' + level);
  } else if (level === 'untaught') {
    allItems = scanVocabByTag(UNTAUGHT_ONLY_QUERY);
  } else if (level === 'tourist') {
    allItems = scanVocabByTag('tourist');
  } else {
    // Level 3 moved to the tag scan above (2026-09-29) once it had content -
    // most L3 words are tagged forward from other categories, so walking
    // level:3 categories' own items would miss them.
    allItems = [];
    Object.keys(VOCAB).forEach(key => {
      if ((VOCAB[key].level || 1) !== level) return;
      VOCAB[key].items.forEach(item => allItems.push(item));
    });
  }
  startVocabReadingDeck(allItems, 'random-level-' + level);
}

// Both guard against an empty pool (everything drilled at least once, for
// Untested - or, in principle, nothing drilled yet at all, for Weakest) by
// simply not starting a drill with nothing in it, rather than launching a
// broken empty deck. Not expected to come up for a while on a real course,
// but cheap to guard against either way.
// UNTESTED 20 PRIORITY (2026-10-15, Andrew): fill the 20 in tier order -
// taught words first, then tourist words, then private-pack words (Genki),
// then the rest of Untaught - random within each tier. Only tiers that are
// switched on are in the pool at all. Before this, the ~900 untaught words
// swamped the few untested taught ones.
function untestedTier(item, privateKeys) {
  const tags = item.tags || [];
  if (tags.includes('taught')) return 0;
  if (tags.includes('tourist')) return 1;
  if (privateKeys.has(item.jp + '|' + item.en)) return 2;
  return 3;
}
function pickUntested20() {
  const privateKeys = new Set();
  PRIVATE_VOCAB_KEYS.forEach(k => (VOCAB[k].items || []).forEach(i => privateKeys.add(i.jp + '|' + i.en)));
  const seen = new Set(), tiers = [[], [], [], []];
  getUntestedVocabItems().forEach(item => {
    const key = item.jp + '|' + item.en;
    if (seen.has(key)) return;
    seen.add(key);
    tiers[untestedTier(item, privateKeys)].push(item);
  });
  const picked = [];
  tiers.forEach(t => { if (picked.length < 20) picked.push(...shuffle(t).slice(0, 20 - picked.length)); });
  return picked;
}

applyAllSettingsUI();
syncServiceWorkerRegistration();
// Runs the real setMatchLevel init (not just buildMatchCategoryList) so the
// default Collections view starts fully set up - active pill state, the
// showing-theme-colours pill-text tint, and the confidence swatches on every
// card - rather than only looking right after leaving and coming back.
setMatchLevel(currentMatchLevel);

updateDirectionVisibility();
updateNumberTimeSwatches();
populateTimeToolSelects();
resetTimeToolToNow();
setNumbersSection(currentNumbersSection);
populateCounterToolPills();
// The number input only shows "1" via placeholder (not a real value), but
// on some browsers a page refresh can restore an actual leftover value into
// a number input without firing its own 'input' event - either way, syncing
// the output once on load (rather than waiting for the user's first
// keystroke) means whatever's visibly in the box always matches what's
// shown below it.
updateCounterTool();
populateMoneyRate();
setMoneyDirection(moneyDirection);
tryRestoreDrillSession();
maybeShowDailyCard();

// Keyboard shortcuts for the drill screen, for anyone on a laptop/desktop:
// digits 1-4 pick the matching option (always exactly 4 per question), and
// Space/Enter advances once answered - purely additive, since taps on mobile
// never fire keydown events, so this has zero effect there.
function handleDrillKeydown(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const drillScreen = document.getElementById('screen-drill');
  if (!drillScreen || !drillScreen.classList.contains('visible')) return;
  if (!answered) {
    // Show answer (flashcards, 14 Nov 2026 - as the core's own handler).
    const reveal = document.getElementById('say-reveal-btn');
    if (reveal && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); reveal.click(); return; }
    const idx = ['1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(e.key);
    if (idx === -1) return;
    const opts = document.querySelectorAll('#q-options .opt');
    if (opts[idx]) {
      e.preventDefault();
      opts[idx].click();
    }
  } else if (e.key === ' ' || e.key === 'Enter') {
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn && nextBtn.style.visibility === 'visible') {
      e.preventDefault();
      nextBtn.click();
    }
  }
}
window.addEventListener('keydown', handleDrillKeydown);

// The browser's own back button has no way to know it's "inside" this app —
// screens here are just shown/hidden, not separate pages — so pressing back
// out of habit would otherwise leave the page entirely and wipe whatever
// drill was in progress. This traps it: every back/forward press just lands
// straight back on this same page instead of leaving it. In-app navigation
// (nav pills, the Back/Change groups/Quit buttons already in the app) is
// unaffected and remains the real way to move around.
// Since 2026-10-16 the back gesture goes one step back in the app (navBack);
// on a tab's main page it still does nothing, so the app can't be left by
// accident. History is kept one entry deep and re-armed after every press.
history.pushState({ trap: true }, '');
window.addEventListener('popstate', () => {
  history.pushState({ trap: true }, '');
  navBack();
});
