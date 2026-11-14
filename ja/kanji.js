// Japanese - the kanji (2026-11-08, step 4 of the move onto the core): the
// kanji groups, their meanings, readings and example words, and the kanji
// screens and drill. Loaded after ja/kana.js, before ja/legacy.js.

// The kanji groups, added to the kana's DATA (see ja/kana.js).
Object.assign(DATA, {
  'kanji-numbers-time': [
    {char:'一',answer:'one',disp:'survival'},
    {char:'二',answer:'two',disp:'survival'},
    {char:'三',answer:'three',disp:'survival'},
    {char:'四',answer:'four',disp:'survival'},
    {char:'五',answer:'five',disp:'survival'},
    {char:'六',answer:'six',disp:'survival'},
    {char:'七',answer:'seven',disp:'survival'},
    {char:'八',answer:'eight',disp:'survival'},
    {char:'九',answer:'nine',disp:'survival'},
    {char:'十',answer:'ten',disp:'survival'},
    {char:'円',answer:'yen',disp:'survival'},
    // The days of the week as whole words (2026-11-09): each kanji on its
    // own is one card with Kanji Cards' meaning ("Fire (Tuesday)"), in Nature.
    {char:'月曜日',answer:'Monday',disp:'survival'},
    {char:'火曜日',answer:'Tuesday',disp:'survival'},
    {char:'水曜日',answer:'Wednesday',disp:'survival'},
    {char:'木曜日',answer:'Thursday',disp:'survival'},
    {char:'金曜日',answer:'Friday',disp:'survival'},
    {char:'土曜日',answer:'Saturday',disp:'survival'},
    {char:'日曜日',answer:'Sunday',disp:'survival'},
    {char:'一月',answer:'January',disp:'survival'},
    {char:'二月',answer:'February',disp:'survival'},
    {char:'三月',answer:'March',disp:'survival'},
    {char:'四月',answer:'April',disp:'survival'},
    {char:'五月',answer:'May',disp:'survival'},
    {char:'六月',answer:'June',disp:'survival'},
    {char:'七月',answer:'July',disp:'survival'},
    {char:'八月',answer:'August',disp:'survival'},
    {char:'九月',answer:'September',disp:'survival'},
    {char:'十月',answer:'October',disp:'survival'},
    {char:'十一月',answer:'November',disp:'survival'},
    {char:'十二月',answer:'December',disp:'survival'},
    {char:'年',answer:'year',disp:'survival'},
    {char:'今',answer:'now',disp:'survival'},
    {char:'時',answer:'hour / time',disp:'survival'},
    {char:'分',answer:'minute',disp:'survival'},
    {char:'前',answer:'before / front',disp:'survival'},
    {char:'後',answer:'after / back',disp:'survival'},
    {char:'計',answer:'measure / plan (時計)',disp:'survival'},
    {char:'百',answer:'hundred',disp:'kanji'},
    {char:'千',answer:'thousand',disp:'kanji'},
    {char:'万',answer:'ten thousand',disp:'kanji'},
    {char:'半',answer:'half',disp:'kanji'},
    {char:'間',answer:'interval / space (時間)',disp:'kanji'},
    {char:'午',answer:'noon (午前/午後)',disp:'kanji'},
    {char:'時計',answer:'watch / clock',disp:'survival'},
    {char:'午前',answer:'morning / AM',disp:'survival'},
    {char:'午後',answer:'afternoon / PM',disp:'survival'},
    {char:'今年',answer:'this year',disp:'survival'},
    {char:'今日',answer:'today',disp:'survival'},
  ],
  'kanji-nature-body': [
    {char:'日',answer:'sun / day',disp:'kanji'},
    {char:'月',answer:'moon',disp:'kanji'},
    {char:'山',answer:'mountain',disp:'kanji'},
    {char:'川',answer:'river',disp:'kanji'},
    {char:'水',answer:'water',disp:'kanji'},
    {char:'人',answer:'person',disp:'kanji'},
    {char:'大',answer:'big / great',disp:'kanji'},
    {char:'小',answer:'small',disp:'kanji'},
    {char:'火',answer:'fire',disp:'kanji'},
    {char:'木',answer:'tree / wood',disp:'kanji'},
    {char:'金',answer:'gold',disp:'kanji'},
    {char:'土',answer:'earth',disp:'kanji'},
    {char:'口',answer:'mouth',disp:'kanji'},
    {char:'目',answer:'eye',disp:'kanji'},
    {char:'耳',answer:'ear',disp:'kanji'},
    {char:'手',answer:'hand',disp:'kanji'},
    {char:'足',answer:'foot / leg',disp:'kanji'},
    {char:'富士山',answer:'Mt. Fuji',disp:'kanji'},
    {char:'日本人',answer:'Japanese person',disp:'kanji'},
    {char:'日本',answer:'Japan',disp:'kanji'},
    {char:'雨',answer:'rain',disp:'survival'},
    {char:'晴れ',answer:'sunny',disp:'survival'},
    {char:'曇り',answer:'cloudy',disp:'survival'},
    {char:'暑い',answer:'hot',disp:'survival'},
    {char:'寒い',answer:'cold',disp:'survival'},
    {char:'雪',answer:'snow',disp:'survival'},
    {char:'天気',answer:'weather',disp:'kanji'},
    {char:'気',answer:'spirit / feeling',disp:'kanji'},
    {char:'天',answer:'heavens / sky',disp:'kanji'},
    // SEASONS (2026-09-01) - moved here from kanji-general at Andrew's call:
    // this section already blends nature/weather/body (雨/晴れ/曇り/暑い/
    // 寒い/雪/天気 above are weather kanji sitting in "Nature" too), so
    // seasons read as the same family, not a general-vocab leftover. All
    // four checked individually on jlptsensei.com: 春/夏/秋/冬 are
    // consistently N4 kanji despite はる/なつ/あき/ふゆ being basic N5
    // vocabulary - same "word is easy, character is a notch harder" split
    // as the N4 colours in kanji-general, so altForm carries the kana as
    // the "also written" note, same convention. Added alongside matching
    // vocab-weather entries the same day (see SEASONS comment there) -
    // unlike the existing weather kanji just above, which test the bare
    // character with no altForm at all, these keep the kana note since
    // that's the convention this specific addition was built under; not
    // worth relitigating the older items to match.
    {char:'春',answer:'spring',disp:'kanji',altForm:'はる'},
    {char:'夏',answer:'summer',disp:'kanji',altForm:'なつ'},
    {char:'秋',answer:'autumn',disp:'kanji',altForm:'あき'},
    {char:'冬',answer:'winter',disp:'kanji',altForm:'ふゆ'},
  ],
  'kanji-places': [
    {char:'駅',answer:'station',disp:'survival'},
    {char:'空港',answer:'airport',disp:'survival'},
    {char:'店',answer:'shop / store',disp:'survival',altForm:'お店'},
    {char:'院',answer:'institution',disp:'survival'},
    {char:'校',answer:'school',disp:'survival',altForm:'学校'},
    {char:'公園',answer:'park',disp:'survival'},
    {char:'教室',answer:'classroom',disp:'survival'},
    {char:'食堂',answer:'canteen / cafeteria',disp:'survival'},
    {char:'地下',answer:'underground / basement',disp:'survival'},
    {char:'東京',answer:'Tokyo',disp:'survival'},
    {char:'東口',answer:'east exit',disp:'survival'},
    {char:'西口',answer:'west exit',disp:'survival'},
    {char:'南口',answer:'south exit',disp:'survival'},
    {char:'北口',answer:'north exit',disp:'survival'},
    {char:'東京駅',answer:'Tokyo Station',disp:'survival'},
    {char:'病院',answer:'hospital',disp:'survival'},
    {char:'小学校',answer:'elementary school',disp:'survival'},
    {char:'中学校',answer:'middle school',disp:'survival'},
    {char:'大学',answer:'university',disp:'survival'},
  ],
  'kanji-directions-travel': [
    {char:'上',answer:'up / above',disp:'survival'},
    {char:'下',answer:'down / below',disp:'survival'},
    {char:'左',answer:'left',disp:'survival'},
    {char:'右',answer:'right',disp:'survival'},
    {char:'中',answer:'middle / inside',disp:'survival'},
    {char:'東',answer:'east',disp:'survival'},
    {char:'西',answer:'west',disp:'survival'},
    {char:'南',answer:'south',disp:'survival'},
    {char:'北',answer:'north',disp:'survival'},
    {char:'電',answer:'electric',disp:'survival'},
    {char:'車',answer:'car / vehicle',disp:'survival'},
    {char:'線',answer:'line',disp:'survival'},
    {char:'道',answer:'road / way',disp:'survival'},
    {char:'病',answer:'sick / illness',disp:'survival'},
    {char:'行',answer:'go / bank (銀行)',disp:'survival',altForm:'銀行'},
    {char:'止',answer:'stop',disp:'survival'},
    {char:'危',answer:'dangerous',disp:'survival'},
    {char:'険',answer:'risk / steep',disp:'survival'},
    {char:'注',answer:'pour / focus (注意)',disp:'survival'},
    {char:'意',answer:'meaning / attention',disp:'survival'},
    {char:'禁',answer:'prohibit',disp:'survival'},
    {char:'開',answer:'open',disp:'survival'},
    {char:'閉',answer:'closed',disp:'survival'},
    {char:'押',answer:'push',disp:'survival'},
    {char:'引',answer:'pull',disp:'survival'},
    {char:'入',answer:'enter',disp:'survival'},
    {char:'出',answer:'exit / leave',disp:'survival'},
    {char:'階',answer:'floor / storey',disp:'survival'},
    {char:'切符',answer:'ticket',disp:'survival'},
    {char:'受付',answer:'reception',disp:'survival'},
    {char:'警告',answer:'warning',disp:'survival'},
    {char:'地震',answer:'earthquake',disp:'survival'},
    {char:'津波',answer:'tsunami',disp:'survival'},
    {char:'避難',answer:'evacuate',disp:'survival'},
    {char:'電車',answer:'train',disp:'survival'},
    {char:'地下鉄',answer:'subway',disp:'survival'},
    {char:'左折',answer:'turn left',disp:'survival'},
    {char:'右折',answer:'turn right',disp:'survival'},
    {char:'山手線',answer:'Yamanote Line',disp:'survival'},
    {char:'開く',answer:'to open',disp:'survival'},
    {char:'閉まる',answer:'to close',disp:'survival'},
    {char:'押す',answer:'to push',disp:'survival'},
    {char:'引く',answer:'to pull',disp:'survival'},
    {char:'止まれ',answer:'Stop! (sign)',disp:'survival'},
  ],
  'kanji-food': [
    {char:'食べる',answer:'to eat',disp:'survival'},
    {char:'飲む',answer:'to drink',disp:'survival'},
    {char:'魚',answer:'fish',disp:'survival'},
    {char:'野菜',answer:'vegetable',disp:'survival'},
    {char:'ご飯',answer:'rice / meal',disp:'survival'},
    {char:'朝食',answer:'breakfast',disp:'survival'},
    {char:'昼食',answer:'lunch',disp:'survival'},
    {char:'夕食',answer:'dinner',disp:'survival'},
    {char:'高い',answer:'expensive / high',disp:'survival'},
    {char:'安い',answer:'cheap',disp:'survival'},
  ],
  'kanji-people': [
    {char:'私',answer:'I / me',disp:'kanji'},
    {char:'何',answer:'what',disp:'kanji'},
    {char:'誰',answer:'who',disp:'kanji'},
    {char:'学生',answer:'student',disp:'kanji'},
    {char:'先生',answer:'teacher',disp:'kanji'},
    {char:'母',answer:'mother',disp:'kanji'},
    {char:'父',answer:'father',disp:'kanji'},
    {char:'友',answer:'friend',disp:'kanji'},
    {char:'子',answer:'child',disp:'kanji'},
    {char:'男',answer:'male',disp:'kanji'},
    {char:'女',answer:'female',disp:'kanji'},
  ],
  'kanji-general': [
    {char:'国',answer:'country',disp:'kanji'},
    {char:'名',answer:'name',disp:'kanji'},
    {char:'本',answer:'book',disp:'kanji'},
    {char:'語',answer:'language',disp:'kanji'},
    {char:'外',answer:'outside',disp:'kanji'},
    {char:'長い',answer:'long',disp:'kanji'},
    {char:'短い',answer:'short',disp:'kanji'},
    {char:'毎',answer:'every',disp:'kanji'},
    {char:'上手',answer:'skilled / good at',disp:'kanji'},
    // COLOURS (2026-09-01) - closes the long-flagged "N5 minus 白" gap:
    // the survival-kanji set had grown close to full N5 coverage but 白
    // never had anywhere to sit. Same logic as vocab-colours (Not covered
    // in lessons, kept anyway - see that category's own note) applied here
    // to the kanji side. Checked against jlptsensei.com per-kanji (not
    // per-word) levels, not assumed - kanji difficulty and word difficulty
    // aren't the same thing for colours, and it shows: 白/赤/青/黒/茶 land at
    // N5/N4 as expected, but 黄 and 緑 are N2 kanji despite "yellow" and
    // "green" being basic N5 vocabulary (きいろ/みどり are simple words that
    // just happen to almost always be written in kana), and 紫 is N1. So the
    // scope here is exactly N5 + N4, same boundary Andrew asked for:
    //   - 白 (N5) - the original gap, added plain, no alt needed.
    //   - 赤/青/黒 (N4) - each gets altForm as the kana form (あか/あお/くろ),
    //     shown as "also written" before answering per the standard altForm
    //     treatment - a step down from 白's certainty, worth the reminder.
    //   - 茶色 (N4, via 茶) - char is the two-kanji compound, not 茶 alone
    //     (茶 alone means "tea", not "brown"), same convention as 上手 above
    //     and 学生/先生 in kanji-people. altForm ちゃいろ, same treatment.
    // 黄色/緑/紫 stay kana-only (N2/N2/N1 - out of scope) and オレンジ/ピンク
    // stay untouched entirely - genuine katakana loanwords, no kanji form
    // exists to add, ever. Nothing else in vocab-colours changes; this only
    // adds parallel kanji-general entries, same words already taught there.
    {char:'白',answer:'white',disp:'kanji'},
    {char:'赤',answer:'red',disp:'kanji',altForm:'あか'},
    {char:'青',answer:'blue',disp:'kanji',altForm:'あお'},
    {char:'黒',answer:'black',disp:'kanji',altForm:'くろ'},
    {char:'茶色',answer:'brown',disp:'kanji',altForm:'ちゃいろ'},
  ],
  'kanji-verbs': [
    {char:'見る',answer:'to see',disp:'kanji'},
    {char:'聞く',answer:'to hear / ask',disp:'kanji'},
    {char:'話す',answer:'to talk',disp:'kanji'},
    {char:'読む',answer:'to read',disp:'kanji'},
    {char:'書く',answer:'to write',disp:'kanji'},
    {char:'来る',answer:'to come',disp:'kanji'},
    {char:'休む',answer:'to rest / day off',disp:'kanji'},
  ],
});

const KANJI_KEYS = Object.keys(DATA).filter(k => k.startsWith('kanji-'));

let showHiraganaOnKanji = false;

function toggleHiraganaOnKanji() {
  showHiraganaOnKanji = !showHiraganaOnKanji;
  const card = document.getElementById('kanji-hiragana-answers-card');
  if (card) card.classList.toggle('selected', showHiraganaOnKanji);
}

const KANJI_SECTIONS = {
  'numbers-time': { label: 'Numbers', dataKey: 'kanji-numbers-time' },
  'nature-body': { label: 'Nature', dataKey: 'kanji-nature-body' },
  'directions-travel': { label: 'Travel', dataKey: 'kanji-directions-travel' },
  'food': { label: 'Food', dataKey: 'kanji-food' },
  'places': { label: 'Places', dataKey: 'kanji-places' },
  'people': { label: 'People', dataKey: 'kanji-people' },
  'general': { label: 'General', dataKey: 'kanji-general' },
  'verbs': { label: 'Verbs', dataKey: 'kanji-verbs' },
};

const KANJI_SECTION_KEYS = Object.keys(KANJI_SECTIONS);

// Verbs is a computed cross-section pool, not a fixed one - it surfaces every
// "to ___" verb wherever it actually lives (e.g. eat/drink stay defined in
// Food, open/push stay defined in Travel) alongside the general verbs that
// only live here, with nothing duplicated into a second DATA array. Single
// source of truth per item, so scoring, romaji, and Random Kanji's own
// distractor pool are all unaffected. Each item keeps its true home section
// as groupKey (via Object.assign below), same convention buildRandomKanjiPool
// already uses, so the drill badge shows where a verb actually belongs.
function getKanjiSectionPool(sectionKey) {
  if (KANJI_SECTIONS[sectionKey] && KANJI_SECTIONS[sectionKey].pool) return KANJI_SECTIONS[sectionKey].pool; // the 500's sets
  if (sectionKey !== 'verbs') return DATA[KANJI_SECTIONS[sectionKey].dataKey];
  const pool = [];
  KANJI_KEYS.forEach(k => {
    DATA[k].forEach(item => {
      if (item.answer.startsWith('to ')) pool.push(Object.assign({groupKey: k}, item));
    });
  });
  return pool;
}

const kanjiSelectedTiles = {};

KANJI_SECTION_KEYS.forEach(k => { kanjiSelectedTiles[k] = new Set(); });

let activeKanjiSection = 'numbers-time';

// Kanji index (2026-10-08): cards with confidence bars, like the Kana index.
function showKanjiIndex() {
  showScreen('kanji-index');
}

function refreshKanjiIndexSwatches() {
  KANJI_SECTION_KEYS.forEach(key => setupCatBar(document.getElementById('kanji-index-swatch-' + key), getCategoryBandCountsKanji(getKanjiSectionPool(key))));
  setupCatBar(document.getElementById('kanji-index-swatch-all'), getCategoryBandCountsKanji(getAllKanjiFlat()));
  setupCatBar(document.getElementById('kanji-index-swatch-500'), getCategoryBandCountsKanji(KANJI_500.map(kanjiCardItem)));
  setupCatBar(document.getElementById('kanji-index-swatch-seen'), getCategoryBandCountsKanji(kanjiSeenItems()));
  const cd = document.getElementById('kanji-cards-desc'), sd = document.getElementById('kanji-seen-desc');
  if (cd) cd.textContent = "Kanji Cards' list and scores (" + KANJI_500.length + ' kanji)';
  if (sd) sd.textContent = 'Kanji from the class handouts and homework (' + kanjiSeenItems().length + ' so far)';
}

// One set's selection screen - entered with a fixed section, like
// showHiraganaSelection(section). The per-section grids stay built and
// cached as before; only the chosen one is shown.
function showKanjiSectionSelection(sectionKey) {
  activeKanjiSection = sectionKey || activeKanjiSection;
  showScreen('kanji-selection');
  // A set of the 500 gets its grid made the first time it's opened.
  if (!document.getElementById('kanji-grid-' + activeKanjiSection)) {
    const div = document.createElement('div');
    div.id = 'kanji-grid-' + activeKanjiSection;
    document.getElementById('kanji-hiragana-answers-card').before(div);
  }
  Object.keys(KANJI_SECTIONS).forEach(key => {
    if (!document.getElementById('kanji-grid-' + key)) return;
    buildKanjiTileGrid(key);
    refreshKanaScoreShading('kanji-grid-' + key);
    const el = document.getElementById('kanji-grid-' + key);
    if (el) el.style.display = key === activeKanjiSection ? '' : 'none';
  });
  const titleEl = document.getElementById('kanji-selection-title');
  if (titleEl) titleEl.textContent = 'Kanji — ' + KANJI_SECTIONS[activeKanjiSection].label;
  document.getElementById('kanji-selection-drill-btn').disabled = kanjiSelectedTiles[activeKanjiSection].size === 0;
  syncKanjiTiles();
  syncKanjiCardModeCards();
}

function showKanjiSelection() { showKanjiSectionSelection(activeKanjiSection); }

// Individual-tile selection, unlike kana's row-selection — kanji categories
// are thematic groupings with no internal structure to select by row.
function buildKanjiTileGrid(sectionKey) {
  const container = document.getElementById('kanji-grid-' + sectionKey);
  if (!container || container.children.length > 0) return;
  const data = getKanjiSectionPool(sectionKey);

  const grid = document.createElement('div');
  grid.className = 'kanji-tile-grid';

  data.forEach((item, idx) => {
    const tile = document.createElement('div');
    const seenKind = kanjiSeenKind(item);
    tile.className = 'kana-ref-card' + (seenKind ? ' seen-' + seenKind : '');
    tile.innerHTML = `<span class="kana-ref-char">${markSmallKana(item.char)}</span><span class="kana-ref-rom">${item.answer}</span>`;
    const scoreKey = kanjiScoreKey(item);
    tile.dataset.scoreKey = scoreKey;
    const scoreClass = kanaScoreClass(scoreKey);
    if (scoreClass) tile.classList.add(scoreClass);
    tile.onclick = () => toggleKanjiTile(sectionKey, idx, tile);
    grid.appendChild(tile);
  });

  container.appendChild(grid);
}

function toggleKanjiTile(sectionKey, idx, tileEl) {
  if (kanjiRandomMode[sectionKey]) return; // the random pick is kept out of sight
  const set = kanjiSelectedTiles[sectionKey];
  if (set.has(idx)) {
    set.delete(idx);
    tileEl.classList.remove('selected');
  } else {
    set.add(idx);
    tileEl.classList.add('selected');
  }
  document.getElementById('kanji-selection-drill-btn').disabled = set.size === 0;
  updateSelectAllKanjiLabel();
}

// The section pills are gone (2026-10-08); kept as a name for anything
// that still switches section directly.
function switchKanjiSection(sectionKey) { showKanjiSectionSelection(sectionKey); }

function toggleSelectAllKanji() {
  const total = getKanjiSectionPool(activeKanjiSection).length;
  const set = kanjiSelectedTiles[activeKanjiSection];
  const allSelected = set.size === total && !kanjiRandomMode[activeKanjiSection];
  kanjiRandomMode[activeKanjiSection] = false;
  set.clear();
  if (!allSelected) for (let i = 0; i < total; i++) set.add(i);
  syncKanjiTiles();
}

// RANDOM 20 (12 Nov 2026, Andrew: "things like seen are potentially going to
// end up huge"): the word lists' rule and behaviour - over 30 kanji, Random
// 20; 21-30, Random 10; fewer, none. The pick is hidden as the word lists'
// is: every tile shows as picked and can't be tapped, so you can't see which.
const kanjiRandomMode = {};
const kanjiRandomSize = key => getRandomPickSize(getKanjiSectionPool(key).length);
function toggleRandomKanji() {
  const key = activeKanjiSection, set = kanjiSelectedTiles[key];
  set.clear();
  kanjiRandomMode[key] = !kanjiRandomMode[key];
  if (kanjiRandomMode[key]) shuffle([...Array(getKanjiSectionPool(key).length).keys()]).slice(0, kanjiRandomSize(key)).forEach(i => set.add(i));
  syncKanjiTiles();
}

// The tiles, the buttons and Drill, from the selection (and random mode).
function syncKanjiTiles() {
  const key = activeKanjiSection, set = kanjiSelectedTiles[key], random = !!kanjiRandomMode[key];
  const grid = document.getElementById('kanji-grid-' + key);
  if (grid) grid.querySelectorAll('.kana-ref-card').forEach((t, i) => t.classList.toggle('selected', random || set.has(i)));
  document.getElementById('kanji-selection-drill-btn').disabled = set.size === 0;
  updateSelectAllKanjiLabel();
  const n = kanjiRandomSize(key), card = document.getElementById('kanji-random-card');
  card.style.display = n ? '' : 'none';
  card.classList.toggle('selected', random);
  document.getElementById('kanji-random-label').textContent = random ? tx('tiles.deselectAll') : tx('tiles.randomN', { n });
}

function updateSelectAllKanjiLabel() {
  const total = getKanjiSectionPool(activeKanjiSection).length;
  const set = kanjiSelectedTiles[activeKanjiSection];
  const allSelected = set.size === total && !kanjiRandomMode[activeKanjiSection];
  document.getElementById('kanji-select-all-label').textContent = tx(allSelected ? 'tiles.deselectAll' : 'tiles.selectAll');
  // As the word lists: gold only while it's the active choice (14 Nov).
  document.getElementById('kanji-select-all-card').classList.toggle('selected', allSelected);
}

// Builds options by drawing 3 other real kanji from the given pool, rather
// than using the item's own hand-authored options - every distractor is now
// something genuinely drillable in its own right, not an invented phrase
// with no backing anywhere else in the app.
function buildKanjiOptionsFromPool(item, pool) {
  // A small set (a part group of three) borrows its other choices from the 500.
  if (pool.length < 4 && KANJI_500.length) pool = pool.concat(shuffle(KANJI_500.map(kanjiCardItem)).slice(0, 12));
  // No two choices with the same meaning (14 Nov: 寒 "Cold (weather)" sat
  // beside 寒い "cold"): compared without case or a bracketed note.
  const sense = a => String(a || '').toLowerCase().replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
  const seen = new Set([sense(item.answer)]);
  const distractorItems = [];
  shuffle(pool.filter(w => !(w.char === item.char && w.answer === item.answer))).forEach(w => {
    if (distractorItems.length < 3 && !seen.has(sense(w.answer))) { seen.add(sense(w.answer)); distractorItems.push(w); }
  });
  const allItems = shuffle([item, ...distractorItems]);
  return allItems.map(w => ({
    en: w.answer,
    jp: w.char,
    rd: KANJI_ROMAJI[w.char + '|' + w.answer] || (w.cardN ? kanjiCardRomaji(KANJI_CARD_BY_N[w.cardN]) : ''),
  }));
}

// Flashcards or Study for a kanji set (14 Nov 2026, from Kanji Cards): one
// choice for every kanji screen, remembered while the app is open.
let kanjiCardMode = null;
function toggleKanjiCardMode(kind) {
  kanjiCardMode = kanjiCardMode === kind ? null : kind;
  syncKanjiCardModeCards();
}
function syncKanjiCardModeCards() {
  [['kanji-cards-card', 'cards'], ['kanji-study-card', 'study']].forEach(([id, kind]) => {
    const c = document.getElementById(id);
    if (c) c.classList.toggle('selected', kanjiCardMode === kind);
  });
}

function drillKanjiSelection() {
  kanjiRandomMode[activeKanjiSection] = false; // as the word lists: the hidden pick shows once you drill
  const section = KANJI_SECTIONS[activeKanjiSection];
  const selectedIdx = kanjiSelectedTiles[activeKanjiSection];
  if (selectedIdx.size === 0) return;
  const data = getKanjiSectionPool(activeKanjiSection);
  const customDeck = [...selectedIdx].sort((a, b) => a - b).map(idx => {
    const item = data[idx];
    const q = Object.assign({ groupKey: section.dataKey }, item, { options: buildKanjiOptionsFromPool(item, data) });
    if (kanjiCardMode) q.cardMode = kanjiCardMode;
    return q;
  });
  lastSettingsScreen = 'kanji-selection';
  startDrill(shuffle(customDeck));
}

// Pulled out of buildRandomKanjiPool so the "All kanji" card on the Themes
// screen can compute its confidence swatch from the exact same full,
// unsliced pool the actual drill draws its 20 from - rather than a second,
// separately-maintained copy of "every kanji everywhere" that could drift
// out of sync with it.
function getAllKanjiFlat() {
  const allKanji = [];
  KANJI_KEYS.forEach(k => DATA[k].forEach(q => allKanji.push(Object.assign({groupKey: k}, q))));
  return allKanji;
}

function buildRandomKanjiPool() {
  const allKanji = getAllKanjiFlat();
  // See the WEIGHTED RANDOM SELECTION and DECAY entries above kanaScoreClass -
  // same weighted draw as buildVocabReadingDeck, keyed the kanji way
  // (char+answer, matching getScoreKey/getItemsAverageScoreKanji), always
  // reading the decayed score regardless of the colours setting.
  const pool = weightedSampleWithoutReplacement(allKanji, 20, item => selectionWeight(decayedScore(kanaScores[kanjiScoreKey(item)])));
  return pool.map(item => Object.assign({}, item, { options: buildKanjiOptionsFromPool(item, allKanji) }));
}

function startRandomKanji() {
  lastSettingsScreen = 'kanji-index'; // back to the Kanji list after a Random 20 (2026-10-08)
  startDrill(buildRandomKanjiPool(), buildRandomKanjiPool);
}

function tryResumeKanji() {
  if (!appSettings.showKanji) return; // backstop - pill is also hidden via CSS
  showKanjiIndex();
}

// Same as getCategoryBandCounts, but for kanji items (char/answer key,
// matching getItemsAverageScoreKanji) - Collections' All kanji card is the
// only cat-bar user needing this shape rather than the jp/en vocab one.
function getCategoryBandCountsKanji(items) {
  const counts = { untested: 0, neg3: 0, neg2: 0, neg1: 0, neutral: 0, pos1: 0, pos2: 0, pos3: 0, pos4: 0 };
  (items || []).forEach(item => {
    const key = kanjiScoreKey(item);
    const entry = kanaScores[key];
    if (!entry) { counts.untested++; return; }
    counts[confidenceBand(displayScore(entry))]++;
  });
  return counts;
}

// Same averaging rule as getItemsAverageScore, but for raw kanji DATA items
// (char/answer) rather than VOCAB items (jp/en) - getScoreKey() uses
// char+'|'+answer for kanji, so this mirrors that exactly rather than
// reusing the vocab version, which would build the wrong key for these.
function getItemsAverageScoreKanji(items) {
  if (!items || !items.length) return null;
  let total = 0, count = 0;
  items.forEach(item => {
    const key = kanjiScoreKey(item);
    if (key in kanaScores) { total += displayScore(kanaScores[key]); count++; }
  });
  return count ? total / count : null;
}

// Explicit hiragana readings for every kanji/survival item, keyed by "char|answer"
// (unique across the whole kanji dataset). Needed because feeding a bare kanji
// character to the browser's TTS is unreliable — kanji can have multiple possible
// readings, and the engine often guesses wrong or truncates. Some entries here are
// compound-word readings (e.g. 日|sun / day → にほん, testing "Japan" in context)
// rather than the character's isolated reading — that matches what the app's own
// answer options already test, so the audio says exactly what's shown on screen.
// Romaji for every kanji item, mined from the existing hand-authored options
// (each item already lists itself as one of its own options, so this is safe
// - already-verified data, not a new hiragana-to-romaji converter to debug).
// Used to generate distractor options dynamically drawn from real kanji in
// the same section, rather than one-off invented flavour phrases.
const KANJI_ROMAJI = {
  '一|one': 'ichi',
  '二|two': 'ni',
  '三|three': 'san',
  '四|four': 'shi',
  '五|five': 'go',
  '六|six': 'roku',
  '七|seven': 'shichi',
  '八|eight': 'hachi',
  '九|nine': 'ku',
  '十|ten': 'juu',
  '円|yen': 'en',
  '月曜日|Monday': 'getsuyoubi',
  '火曜日|Tuesday': 'kayoubi',
  '水曜日|Wednesday': 'suiyoubi',
  '木曜日|Thursday': 'mokuyoubi',
  '金曜日|Friday': 'kinyoubi',
  '土曜日|Saturday': 'doyoubi',
  '日曜日|Sunday': 'nichiyoubi',
  '月|moon': 'tsuki',
  '金|gold': 'kane',
  '土|earth': 'tsuchi',
  '一月|January': 'ichigatsu',
  '二月|February': 'nigatsu',
  '三月|March': 'sangatsu',
  '四月|April': 'shigatsu',
  '五月|May': 'gogatsu',
  '六月|June': 'rokugatsu',
  '七月|July': 'shichigatsu',
  '八月|August': 'hachigatsu',
  '九月|September': 'kugatsu',
  '十月|October': 'juugatsu',
  '十一月|November': 'juuichigatsu',
  '十二月|December': 'juunigatsu',
  '年|year': 'toshi',
  '今|now': 'ima',
  '時|hour / time': 'toki',
  '分|minute': 'fun',
  '前|before / front': 'mae',
  '後|after / back': 'ato',
  '計|measure / plan (時計)': 'kei',
  '百|hundred': 'hyaku',
  '千|thousand': 'sen',
  '万|ten thousand': 'man',
  '半|half': 'han',
  '間|interval / space (時間)': 'kan',
  '午|noon (午前/午後)': 'go',
  '日|sun / day': 'hi',
  '山|mountain': 'yama',
  '川|river': 'kawa',
  '水|water': 'mizu',
  '人|person': 'hito',
  '大|big / great': 'dai',
  '小|small': 'shou',
  '火|fire': 'hi',
  '木|tree / wood': 'ki',
  '口|mouth': 'kuchi',
  '目|eye': 'me',
  '耳|ear': 'mimi',
  '手|hand': 'te',
  '足|foot / leg': 'ashi',
  '上|up / above': 'ue',
  '下|down / below': 'shita',
  '左|left': 'hidari',
  '右|right': 'migi',
  '中|middle / inside': 'naka',
  '東|east': 'higashi',
  '西|west': 'nishi',
  '南|south': 'minami',
  '北|north': 'kita',
  '駅|station': 'eki',
  '電|electric': 'den',
  '車|car / vehicle': 'kuruma',
  '線|line': 'sen',
  '道|road / way': 'michi',
  '空港|airport': 'kuukou',
  '店|shop / store': 'mise',
  '病|sick / illness': 'byou',
  '院|institution': 'in',
  '校|school': 'kou',
  '行|go / bank (銀行)': 'iku',
  '公園|park': 'kouen',
  '止|stop': 'shi',
  '危|dangerous': 'abunai',
  '険|risk / steep': 'ken',
  '注|pour / focus (注意)': 'chuu',
  '意|meaning / attention': 'i',
  '禁|prohibit': 'kin',
  '開|open': 'hiraku',
  '閉|closed': 'shimaru',
  '押|push': 'osu',
  '引|pull': 'hiku',
  '入|enter': 'hairu',
  '出|exit / leave': 'deru',
  '階|floor / storey': 'kai',
  '切符|ticket': 'kippu',
  '受付|reception': 'uketsuke',
  '教室|classroom': 'kyoushitsu',
  '食堂|canteen / cafeteria': 'shokudou',
  '男|male': 'otoko',
  '女|female': 'onna',
  '警告|warning': 'keikoku',
  '地震|earthquake': 'jishin',
  '津波|tsunami': 'tsunami',
  '避難|evacuate': 'hinan',
  '地下|underground / basement': 'chika',
  '食べる|to eat': 'taberu',
  '飲む|to drink': 'nomu',
  '魚|fish': 'sakana',
  '野菜|vegetable': 'yasai',
  'ご飯|rice / meal': 'gohan',
  '朝食|breakfast': 'choushoku',
  '昼食|lunch': 'chuushoku',
  '夕食|dinner': 'yuushoku',
  '高い|expensive / high': 'takai',
  '安い|cheap': 'yasui',
  '雨|rain': 'ame',
  '晴れ|sunny': 'hare',
  '曇り|cloudy': 'kumori',
  '暑い|hot': 'atsui',
  '寒い|cold': 'samui',
  '雪|snow': 'yuki',
  '天気|weather': 'tenki',
  '気|spirit / feeling': 'ki',
  '天|heavens / sky': 'ten',
  '私|I / me': 'watashi',
  '何|what': 'nan',
  '誰|who': 'dare',
  '学生|student': 'gakusei',
  '先生|teacher': 'sensei',
  '母|mother': 'haha',
  '父|father': 'chichi',
  '友|friend': 'tomo',
  '子|child': 'ko',
  '国|country': 'kuni',
  '名|name': 'na',
  '本|book': 'hon',
  '語|language': 'go',
  '外|outside': 'soto',
  '長い|long': 'nagai',
  '短い|short': 'mijikai',
  '毎|every': 'mai',
  '見る|to see': 'miru',
  '聞く|to hear / ask': 'kiku',
  '話す|to talk': 'hanasu',
  '読む|to read': 'yomu',
  '書く|to write': 'kaku',
  '来る|to come': 'kuru',
  '休む|to rest / day off': 'yasumu',

  // Promoted compound words - previously only shown as passive "(example:
  // ...)" text under their parent single kanji, now real drillable items in
  // their own right (parent kanji items are untouched and still drill their
  // own standalone reading/meaning separately).
  '富士山|Mt. Fuji': 'fujisan',
  '日本人|Japanese person': 'nihonjin',
  '日本|Japan': 'nihon',
  '大学|university': 'daigaku',
  '小学校|elementary school': 'shougakkou',
  '電車|train': 'densha',
  '中学校|middle school': 'chuugakkou',
  '上手|skilled / good at': 'jouzu',
  '地下鉄|subway': 'chikatetsu',
  '左折|turn left': 'sasetsu',
  '右折|turn right': 'usetsu',
  '東京|Tokyo': 'toukyou',
  '東口|east exit': 'higashiguchi',
  '西口|west exit': 'nishiguchi',
  '南口|south exit': 'minamiguchi',
  '北口|north exit': 'kitaguchi',
  '東京駅|Tokyo Station': 'toukyoueki',
  '山手線|Yamanote Line': 'yamanotesen',
  '病院|hospital': 'byouin',
  '時計|watch / clock': 'tokei',
  '午前|morning / AM': 'gozen',
  '午後|afternoon / PM': 'gogo',
  '今年|this year': 'kotoshi',
  '今日|today': 'kyou',
  '開く|to open': 'hiraku',
  '閉まる|to close': 'shimaru',
  '押す|to push': 'osu',
  '引く|to pull': 'hiku',
  '止まれ|Stop! (sign)': 'tomare',
};

// Compound-word form for items whose tested reading differs from the bare
// character (e.g. 月 tests via 月曜日) - feeds the "(example: ...)" feedback
// note. Only 47 entries, since most kanji are tested via their own bare
// character and need no separate compound form here. (7 former entries -
// 校/店/行/火/水/木/日 - moved to using the item's own `altForm` field instead,
// since their compound's English meaning is a word-for-word duplicate of the
// parent kanji's own tested answer; altForm shows it up front via the gold
// "also written:" box rather than only after answering, and there's no
// ambiguity to soften with an "(example: ...)" hedge in these cases.)
const KANJI_COMPOUND = {
  '円|yen': '千円',
  '年|year': '今年',
  '今|now': '今日',
  '時|hour / time': '時間',
  '分|minute': '三分',
  '前|before / front': '午前',
  '後|after / back': '午後',
  '計|measure / plan (時計)': '時計',
  '間|interval / space (時間)': '時間',
  '午|noon (午前/午後)': '午後',
  '日|sun / day': '日本',
  '山|mountain': '富士山',
  '人|person': '日本人',
  '大|big / great': '大学',
  '小|small': '小学校',
  '上|up / above': '上手',
  '下|down / below': '地下鉄',
  '左|left': '左折',
  '右|right': '右折',
  '中|middle / inside': '中学校',
  '東|east': '東京',
  '西|west': '西口',
  '南|south': '南口',
  '北|north': '北口',
  '駅|station': '東京駅',
  '電|electric': '電車',
  '車|car / vehicle': '電車',
  '線|line': '山手線',
  '病|sick / illness': '病院',
  '院|institution': '病院',
  '止|stop': '止まれ',
  '危|dangerous': '危険',
  '険|risk / steep': '危険',
  '注|pour / focus (注意)': '注意',
  '意|meaning / attention': '注意',
  '禁|prohibit': '禁止',
  '開|open': '開く',
  '閉|closed': '閉まる',
  '押|push': '押す',
  '引|pull': '引く',
  '入|enter': '入口',
  '出|exit / leave': '出口',
  '階|floor / storey': '二階',
  '毎|every': '毎日',
};

const KANJI_READINGS = {
  '一|one': 'いち', '二|two': 'に', '三|three': 'さん', '四|four': 'し', '五|five': 'ご',
  '六|six': 'ろく', '七|seven': 'しち', '八|eight': 'はち', '九|nine': 'く', '十|ten': 'じゅう',
  '円|yen': 'えん', '月曜日|Monday': 'げつようび', '火曜日|Tuesday': 'かようび',
  '水曜日|Wednesday': 'すいようび', '木曜日|Thursday': 'もくようび', '金曜日|Friday': 'きんようび',
  '土曜日|Saturday': 'どようび', '日曜日|Sunday': 'にちようび', '月|moon': 'つき', '金|gold': 'かね', '土|earth': 'つち', '年|year': 'とし', '今|now': 'いま', '時|hour / time': 'とき',
  '一月|January': 'いちがつ', '二月|February': 'にがつ', '三月|March': 'さんがつ', '四月|April': 'しがつ',
  '五月|May': 'ごがつ', '六月|June': 'ろくがつ', '七月|July': 'しちがつ', '八月|August': 'はちがつ',
  '九月|September': 'くがつ', '十月|October': 'じゅうがつ', '十一月|November': 'じゅういちがつ', '十二月|December': 'じゅうにがつ',

  '今年|this year': 'ことし', '今日|today': 'きょう',
  '午前|morning / AM': 'ごぜん', '午後|afternoon / PM': 'ごご',
  '時計|watch / clock': 'とけい',
  '日本|Japan': 'にほん', '富士山|Mt. Fuji': 'ふじさん',
  '大学|university': 'だいがく', '日本人|Japanese person': 'にほんじん',
  '小学校|elementary school': 'しょうがっこう', '上手|skilled / good at': 'じょうず', '地下鉄|subway': 'ちかてつ',
  '左折|turn left': 'させつ', '右折|turn right': 'うせつ',
  '中学校|middle school': 'ちゅうがっこう',
  '東京|Tokyo': 'とうきょう',
  '東口|east exit': 'ひがしぐち',
  '西口|west exit': 'にしぐち', '南口|south exit': 'みなみぐち',
  '北口|north exit': 'きたぐち',
  '東京駅|Tokyo Station': 'とうきょうえき',
  '電車|train': 'でんしゃ',
  '山手線|Yamanote Line': 'やまのてせん',
  '病院|hospital': 'びょういん',
  '止まれ|Stop! (sign)': 'とまれ',
  '開く|to open': 'ひらく', '閉まる|to close': 'しまる',
  '押す|to push': 'おす', '引く|to pull': 'ひく',
  '分|minute': 'ふん', '前|before / front': 'まえ', '後|after / back': 'あと',
  '計|measure / plan (時計)': 'けい', '百|hundred': 'ひゃく', '千|thousand': 'せん', '万|ten thousand': 'まん',
  '半|half': 'はん', '間|interval / space (時間)': 'かん', '午|noon (午前/午後)': 'ご',

  '日|sun / day': 'ひ', '山|mountain': 'やま', '川|river': 'かわ', '水|water': 'みず',
  '人|person': 'ひと', '大|big / great': 'だい', '小|small': 'しょう', '火|fire': 'ひ',
  '木|tree / wood': 'き', '口|mouth': 'くち', '目|eye': 'め', '耳|ear': 'みみ', '手|hand': 'て', '足|foot / leg': 'あし',

  '上|up / above': 'うえ', '下|down / below': 'した', '左|left': 'ひだり', '右|right': 'みぎ',
  '中|middle / inside': 'なか', '東|east': 'ひがし', '西|west': 'にし', '南|south': 'みなみ',
  '北|north': 'きた', '駅|station': 'えき', '電|electric': 'でん', '車|car / vehicle': 'くるま',
  '線|line': 'せん', '道|road / way': 'みち', '空港|airport': 'くうこう', '店|shop / store': 'みせ',
  '病|sick / illness': 'びょう', '院|institution': 'いん', '校|school': 'こう',
  '行|go / bank (銀行)': 'いく', '公園|park': 'こうえん', '止|stop': 'し', '危|dangerous': 'あぶない',
  '険|risk / steep': 'けん', '注|pour / focus (注意)': 'ちゅう', '意|meaning / attention': 'い',
  '禁|prohibit': 'きん', '開|open': 'ひらく', '閉|closed': 'しまる', '押|push': 'おす', '引|pull': 'ひく',
  '入|enter': 'はいる', '出|exit / leave': 'でる', '階|floor / storey': 'かい',
  '切符|ticket': 'きっぷ', '受付|reception': 'うけつけ', '教室|classroom': 'きょうしつ',
  '食堂|canteen / cafeteria': 'しょくどう', '男|male': 'おとこ', '女|female': 'おんな',
  '警告|warning': 'けいこく', '地震|earthquake': 'じしん', '津波|tsunami': 'つなみ',
  '避難|evacuate': 'ひなん', '地下|underground / basement': 'ちか',

  '食べる|to eat': 'たべる', '飲む|to drink': 'のむ', '魚|fish': 'さかな', '野菜|vegetable': 'やさい',
  'ご飯|rice / meal': 'ごはん', '朝食|breakfast': 'ちょうしょく', '昼食|lunch': 'ちゅうしょく',
  '夕食|dinner': 'ゆうしょく', '高い|expensive / high': 'たかい', '安い|cheap': 'やすい',

  '雨|rain': 'あめ', '晴れ|sunny': 'はれ', '曇り|cloudy': 'くもり', '暑い|hot': 'あつい',
  '寒い|cold': 'さむい', '雪|snow': 'ゆき', '天気|weather': 'てんき', '気|spirit / feeling': 'き', '天|heavens / sky': 'てん',

  '私|I / me': 'わたし', '何|what': 'なん', '誰|who': 'だれ', '学生|student': 'がくせい',
  '先生|teacher': 'せんせい', '母|mother': 'はは', '父|father': 'ちち', '友|friend': 'とも', '子|child': 'こ',

  '国|country': 'くに', '名|name': 'な', '本|book': 'ほん', '語|language': 'ご', '外|outside': 'そと',
  '長い|long': 'ながい', '短い|short': 'みじかい', '毎|every': 'まい',

  '見る|to see': 'みる', '聞く|to hear / ask': 'きく', '話す|to talk': 'はなす', '読む|to read': 'よむ',
  '書く|to write': 'かく', '来る|to come': 'くる', '休む|to rest / day off': 'やすむ',
};

// A second trigger for the exact same hint as speakCurrent() - reveals the
// reading as text instead of audio. Deliberately shares hintUsedThisQuestion
// and hints with speakCurrent() rather than tracking its own count, so using
// either (or both) on the same question only ever costs one hint, same as
// pressing speak twice already costs only one. Never touches q.char or
// anything the score key reads (see getScoreKey) - this only ever changes
// what's rendered in q-romaji-reveal, nothing the deck/scoring sees.
// Matches the same CJK ideograph range used when this word's kanjiReading
// data was generated - kept in sync with that build process, not guessed.
const KANJI_CHAR_RE = /[一-鿿㐀-䶿]/;

// =============================================================================
// THE 500 KANJI (2026-11-09, the kanji joining-up - decisions in Andrew's doc
// "Moving Japanese onto the core", "Kanji Cards and Strokes: decisions").
// Kanji Cards' list (ja/kanji-500.js, generated from Cards) is the kanji
// data. Every single kanji in the topic sets above becomes its Cards card:
// Cards' meaning (its wording wins everywhere), Cards' example words, and
// Cards' recognition score - 'card:<n>', which core.js's LINKED SCORES
// reads from and writes to Cards' own store, so a drill in either app moves
// the same score. Words (時計, 地下鉄, 富士山...) stay whole-word cards with
// their own scores. Beside the topic sets, Cards' three ways through all
// 500: In order (blocks of 20), By part and By JLPT.
// =============================================================================
const KANJI_500 = (window.JP_KANJI_500 && window.JP_KANJI_500.cards) || [];
const KANJI_PARTS = (window.JP_KANJI_500 && window.JP_KANJI_500.parts) || [];
const KANJI_CARD_BY_CHAR = {}, KANJI_CARD_BY_N = {};
KANJI_500.forEach(c => { KANJI_CARD_BY_CHAR[c.k] = c; KANJI_CARD_BY_N[c.n] = c; });

// A kanji item's score key: its Cards card's, or (a word) its own.
function kanjiScoreKey(item) {
  return item.cardN ? 'card:' + item.cardN : item.char + '|' + item.answer;
}

// The one-time score move needs each card's old keys; the romaji and
// readings tables move to the new meaning with it.
const KANJI_OLD_KEYS = {};
KANJI_KEYS.forEach(k => DATA[k].forEach(item => {
  const card = KANJI_CARD_BY_CHAR[item.char];
  if (!card) return;
  const oldKey = item.char + '|' + item.answer, newKey = item.char + '|' + card.m;
  (KANJI_OLD_KEYS[card.n] = KANJI_OLD_KEYS[card.n] || []).push(oldKey);
  if (KANJI_ROMAJI[oldKey] && !KANJI_ROMAJI[newKey]) KANJI_ROMAJI[newKey] = KANJI_ROMAJI[oldKey];
  if (KANJI_READINGS[oldKey] && !KANJI_READINGS[newKey]) KANJI_READINGS[newKey] = KANJI_READINGS[oldKey];
  item.answer = card.m;
  item.cardN = card.n;
  delete item.altForm;
}));
// The days of the week, once single kanji, are now words.
const KANJI_DAY_MOVES = {
  '月|Monday / month': ['月曜日|Monday', '月'], '火|Tuesday': ['火曜日|Tuesday'], '水|Wednesday': ['水曜日|Wednesday'],
  '木|Thursday': ['木曜日|Thursday'], '金|Friday / gold': ['金曜日|Friday', '金'], '土|Saturday / earth': ['土曜日|Saturday', '土'],
  '日|Sunday': ['日曜日|Sunday'],
};

// A card as a drill item. Its reading - the romaji under a choice AND what
// the voice says, always the same one (11 Nov 2026: the voice was given the
// bare kanji and guessed - 赤 said あか under "seki" - Andrew: "the vocal
// representation isn't one of the options"):
//   1. the app's own reading, where it had one;
//   2. else the kanji as a word of its own, from the card's examples: on its
//      own (林 はやし) or with just a kana ending (赤い あかい, 見る みる,
//      暑い あつい) - the word the class meets;
//   3. else its first on-reading (機 き - its first kun-reading, はた "loom",
//      is one nobody needs).
function kanjiCardItem(card) {
  return { char: card.k, answer: card.m, disp: 'kanji', cardN: card.n, groupKey: 'kanji-500' };
}
const kanjiKataToHira = t => t.replace(/[\u30a1-\u30f6]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
function kanjiCardReading(card) {
  const key = card.k + '|' + card.m, r = KANJI_ROMAJI[key];
  if (r) return { romaji: r, kana: KANJI_READINGS[key] || '' };
  const ws = card.w || [];
  const word = ws.find(x => x.kanji === card.k)
    || ws.find(x => x.kanji && x.kanji.startsWith(card.k) && /^[\u3041-\u3096]+$/.test(x.kanji.slice(card.k.length)));
  if (word) return { romaji: word.romaji, kana: word.jp };
  const first = (card.on && card.on[0]) || (card.kun && card.kun[0]);
  return first ? { romaji: first[1].replace(/[()]/g, ''), kana: kanjiKataToHira(first[0].replace(/[()]/g, '')) } : { romaji: '', kana: '' };
}
const kanjiCardRomaji = card => kanjiCardReading(card).romaji;

// A kanji's flashcard back (14 Nov 2026, from Kanji Cards): the meaning and
// its reading, then for one of the 500 its on and kun readings and example
// words, as Cards shows them; for a whole-word card, its reading.
function kanjiCardBackHtml(q) {
  const card = q.cardN ? KANJI_CARD_BY_N[q.cardN] : (KANJI_CARD_BY_CHAR[q.char] && KANJI_CARD_BY_CHAR[q.char].m === q.answer ? KANJI_CARD_BY_CHAR[q.char] : null);
  const key = q.char + '|' + q.answer;
  const kana = KANJI_READINGS[key], ro = KANJI_ROMAJI[key] || (card ? kanjiCardRomaji(card) : '');
  const esc = escapeHtmlText;
  let html = `<div class="say-answer">${esc(q.answer)}</div>`;
  if (kana || ro) html += `<div class="card-reading">${kana ? markSmallKana(kana) : ''}${kana && ro ? ' · ' : ''}${esc(ro || '')}</div>`;
  if (!card) return html;
  const rds = (list, label) => list && list.length
    ? `<div class="card-sec"><div class="card-sec-t">${label}</div><div class="card-rds">${list.map(r => `<span class="card-rd">${markSmallKana(r[0])}<small>${esc(r[1])}</small></span>`).join('')}</div></div>` : '';
  html += rds(card.on, "On'yomi") + rds(card.kun, "Kun'yomi");
  if (card.w && card.w.length) html += `<div class="card-sec"><div class="card-sec-t">Words</div>${card.w.map(w =>
    `<div class="card-word"><span class="card-wj">${w.kanji ? `<span class="card-wk">${markSmallKana(w.kanji)}</span>` : ''}${markSmallKana(w.jp)}<small>${esc(w.romaji)}</small></span><span class="card-we">${esc(w.en)}</span></div>`).join('')}</div>`;
  return html;
}
// The colours, set by hand (11 Nov 2026): the first kanji the course shows
// as kanji (the L4 Lesson 1 colour sheet), so they read as taught - each
// kanji on its own is the colour's noun (赤 あか, as in 赤い / 赤ちゃん; 黄 き,
// as in 黄色), not the rule's 赤い akai or 黄 kō.
[['赤', 'aka', 'あか'], ['青', 'ao', 'あお'], ['白', 'shiro', 'しろ'], ['黒', 'kuro', 'くろ'],
 ['黄', 'ki', 'き'], ['茶', 'cha', 'ちゃ'], ['緑', 'midori', 'みどり']].forEach(([k, ro, kana]) => {
  const card = KANJI_CARD_BY_CHAR[k];
  if (!card) return;
  KANJI_ROMAJI[k + '|' + card.m] = ro; KANJI_READINGS[k + '|' + card.m] = kana;
});
KANJI_ROMAJI['茶色|brown'] = 'chairo'; KANJI_READINGS['茶色|brown'] = 'ちゃいろ'; // the one colour word, which had neither
// What the voice says for every card is its reading's kana (speechText reads
// KANJI_READINGS), never the bare kanji.
KANJI_500.forEach(card => {
  const key = card.k + '|' + card.m, kana = kanjiCardReading(card).kana;
  if (!KANJI_READINGS[key] && kana) KANJI_READINGS[key] = kana;
});
// The example after an answer: the card's first example word that isn't
// the kanji on its own, with its reading.
function kanjiCardExample(card) {
  const w = (card.w || []).find(x => x.kanji && x.kanji !== card.k) || (card.w || [])[0];
  return w ? w.kanji + ' ' + w.jp : '';
}

// MOVING THE SCORES (once). Each single kanji's score in this app moves to
// its Cards card - where Cards has one too, the more recently practised
// wins. A day of the week's score goes to its new word (and, for 月 金 土,
// which also meant month / gold / earth, to the card as well). The old
// entries stay where they were, unused. Called from legacy.js once the
// scores are loaded.
function moveKanjiScoresToCards() {
  const FLAG = APP.storagePrefix + 'KanjiScoresMoved';
  try { if (localStorage.getItem(FLAG)) return; } catch (e) { return; }
  const newer = (a, b) => a && typeof a === 'object' && (!b || (a.lastSeen || 0) > (b.lastSeen || 0));
  const give = (toKey, entry) => { if (newer(entry, kanaScores[toKey])) kanaScores[toKey] = entry; };
  Object.keys(KANJI_OLD_KEYS).forEach(n => KANJI_OLD_KEYS[n].forEach(old => give('card:' + n, kanaScores[old])));
  Object.keys(KANJI_DAY_MOVES).forEach(old => KANJI_DAY_MOVES[old].forEach(to => {
    const card = KANJI_CARD_BY_CHAR[to];
    give(card ? 'card:' + card.n : to, kanaScores[old]);
  }));
  saveKanaScores();
  try { localStorage.setItem(FLAG, '1'); } catch (e) { /* private mode: tries again next time, harmlessly */ }
}

// ---- The 500's own sets: in order, by part, by JLPT ----
// Each set is a selection screen like a topic's (showKanjiSectionSelection),
// added to KANJI_SECTIONS with its own pool; the topic list above
// (KANJI_SECTION_KEYS) is unchanged. Laid out as Kanji Cards does (Andrew,
// 9 Nov: a card and score bar per set was "too detailed and overwhelming"):
// one headline score bar, then compact pills with counts - In order in
// hundreds (1–100 ... 401–500), By part one pill per group ("日 sun (25)"),
// By JLPT one pill per level ("N5 (79)").
const KANJI_VIEWS = { order: { label: 'In order', sets: [] }, part: { label: 'By part', sets: [] }, jlpt: { label: 'By JLPT', sets: [] }, seen: { label: 'Seen in materials', sets: [] } };

// SEEN IN MATERIALS (11 Nov 2026, from Andrew's mock-up): the kanji the
// class has shown - Kanji Cards' seen.js, carried in JP_KANJI_500.seen. A
// lighter mark than taught: pointed out as kanji (the colour sheet), or
// seen in passing (printed with readings); whole-word cards count too
// (富士山, 東京, 暑い...). One set overall, not per lesson. Marked on tiles
// everywhere, as in Kanji Cards: a dot if pointed out, a ring if in passing.
// The list itself: ja/kanji-seen.js (since 14 Nov 2026; before, Kanji Cards'
// seen.js copied into kanji-500.js - still read if the new file is missing).
const KANJI_SEEN = window.JP_KANJI_SEEN || (window.JP_KANJI_500 && window.JP_KANJI_500.seen) || { pointed: [], passing: [], words: [] };
function kanjiSeenKind(item) {
  if (item.cardN) return KANJI_SEEN.pointed.includes(item.char) ? 'pointed' : KANJI_SEEN.passing.includes(item.char) ? 'passing' : '';
  return KANJI_SEEN.words.includes(item.char) ? 'passing' : '';
}
// Seen kanji not in Kanji Cards (yet): first in line if the list grows or changes.
const KANJI_SEEN_NOT_CARDS = [...new Set(KANJI_SEEN.pointed.concat(KANJI_SEEN.passing))].filter(k => !KANJI_CARD_BY_CHAR[k]);
(function buildKanji500Sets() {
  const byD = KANJI_500.slice().sort((a, b) => a.d - b.d);
  const addSet = (view, key, label, cards) => {
    KANJI_SECTIONS[key] = { label, dataKey: 'kanji-500', pool: cards.map(kanjiCardItem), dyn: true };
    kanjiSelectedTiles[key] = new Set();
    KANJI_VIEWS[view].sets.push({ key, label, count: cards.length });
  };
  for (let i = 0; i < byD.length; i += 100) {
    const cards = byD.slice(i, i + 100);
    addSet('order', 'k500-o' + (i / 100 + 1), cards[0].d + '–' + cards[cards.length - 1].d, cards);
  }
  KANJI_PARTS.forEach((g, i) => {
    const cards = g.cards.map(n => KANJI_CARD_BY_N[n]).filter(Boolean);
    if (cards.length) addSet('part', 'k500-p' + i, g.part + ' ' + g.name, cards);
  });
  ['N5', 'N4', 'N3', 'N2', 'N1', ''].forEach(lv => {
    const cards = byD.filter(c => (c.j || '') === lv);
    if (cards.length) addSet('jlpt', 'k500-j' + (lv || 'none'), lv || 'No JLPT level', cards);
  });
  // Seen in materials: Cards' cards, then the whole-word cards from the topic sets.
  const pointed = KANJI_SEEN.pointed.map(k => KANJI_CARD_BY_CHAR[k]).filter(Boolean).map(kanjiCardItem);
  const passing = KANJI_SEEN.passing.filter(k => !KANJI_SEEN.pointed.includes(k)).map(k => KANJI_CARD_BY_CHAR[k]).filter(Boolean).map(kanjiCardItem);
  const words = [];
  KANJI_KEYS.forEach(k => DATA[k].forEach(q => { if (!q.cardN && KANJI_SEEN.words.includes(q.char) && !words.some(w => w.char === q.char)) words.push(Object.assign({ groupKey: k }, q)); }));
  const addSeen = (key, label, pool) => {
    if (!pool.length) return;
    KANJI_SECTIONS[key] = { label: 'Seen · ' + label, dataKey: 'kanji-500', pool, dyn: true };
    kanjiSelectedTiles[key] = new Set();
    KANJI_VIEWS.seen.sets.push({ key, label, count: pool.length });
  };
  addSeen('seen-all', 'All seen', pointed.concat(passing, words));
  addSeen('seen-pointed', 'Pointed out', pointed);
  addSeen('seen-passing', 'Seen in passing', passing.concat(words));
})();

// One way through the 500: the headline bar, then a pill per set.
let activeKanjiView = 'order';
function showKanjiView(view) {
  activeKanjiView = view || activeKanjiView;
  const v = KANJI_VIEWS[activeKanjiView];
  const seenView = activeKanjiView === 'seen';
  document.getElementById('kanji-view-title').textContent = 'Kanji — ' + v.label;
  document.getElementById('kanji-view-sub').textContent = seenView
    ? 'Kanji the class has shown you: pointed out as kanji (a dot on the tile), or seen in passing on the handouts and homework (a ring). Same scores as Kanji Cards.'
    : 'The same list and scores as Kanji Cards. Tap a set to choose kanji to drill.';
  refreshKanjiViewBar();
  const note = document.getElementById('kanji-view-note');
  note.innerHTML = seenView && KANJI_SEEN_NOT_CARDS.length ? 'Seen but not in Kanji Cards yet: <span class="seen-not">' + markSmallKana(KANJI_SEEN_NOT_CARDS.join('')) + '</span><br>First in line if the list grows or changes.' : '';
  const list = document.getElementById('kanji-view-list');
  list.innerHTML = '';
  v.sets.forEach(s => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'kanji-view-pill';
    setJpText(pill, s.label + ' (' + s.count + ')');
    pill.onclick = () => showKanjiSectionSelection(s.key);
    list.appendChild(pill);
  });
  showScreen('kanji-view');
}
// The view's bar: its own kanji (12 Nov 2026 - the screen's onShow redrew it
// with all 500, so Seen in materials showed the Kanji cards bar).
function refreshKanjiViewBar() {
  setupCatBar(document.getElementById('kanji-view-swatch'), getCategoryBandCountsKanji(activeKanjiView === 'seen' ? kanjiSeenItems() : KANJI_500.map(kanjiCardItem)));
}
function setJpText(el, text) { el.innerHTML = markSmallKana(text); }
const kanjiSeenItems = () => (KANJI_SECTIONS['seen-all'] || { pool: [] }).pool;

// WEAKEST, UNTESTED, SEARCH (14 Nov 2026, from Kanji Cards): a set made on
// the spot from the 500, opened with every kanji in it picked.
//   weak     - the 20 you've tried with the lowest scores (fading counted)
//   untested - 20 you've never tried, at random
//   search   - every card whose meaning has a word starting with what you
//              typed ("fire", "go"), or the kanji itself
function showKanjiPick(kind) {
  const msg = document.getElementById('kanji-search-msg');
  if (msg) msg.textContent = '';
  const items = KANJI_500.map(kanjiCardItem);
  let pool = [], label = '';
  if (kind === 'weak') {
    pool = items.filter(i => kanaScores[kanjiScoreKey(i)]).sort((a, b) => displayScore(kanaScores[kanjiScoreKey(a)]) - displayScore(kanaScores[kanjiScoreKey(b)])).slice(0, 20);
    label = 'Weakest 20';
    if (!pool.length && msg) msg.textContent = "You haven't tried any of the 500 yet.";
  } else if (kind === 'untested') {
    pool = shuffle(items.filter(i => !kanaScores[kanjiScoreKey(i)])).slice(0, 20);
    label = 'Untested 20';
    if (!pool.length && msg) msg.textContent = "You've tried every one of the 500.";
  } else {
    const input = document.getElementById('kanji-search-input');
    const raw = (input ? input.value : '').trim();
    if (!raw) return;
    const words = raw.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    pool = items.filter(i => i.char === raw || (words.length && words.every(w => i.answer.toLowerCase().split(/[^a-z0-9]+/).some(m => m.startsWith(w)))));
    label = 'Search: ' + raw;
    if (!pool.length && msg) msg.textContent = 'No kanji found for "' + raw + '".';
  }
  if (!pool.length) return;
  const key = 'k500-' + kind;
  KANJI_SECTIONS[key] = { label, dataKey: 'kanji-500', pool, dyn: true };
  kanjiSelectedTiles[key] = new Set(pool.map((_, i) => i));
  kanjiRandomMode[key] = false;
  showKanjiSectionSelection(key);
}
