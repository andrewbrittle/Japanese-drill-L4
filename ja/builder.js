// Japanese - the sentence builder (2026-11-08, step 8 of the move onto the
// core): build the Japanese for an English sentence from columns of words,
// or the other way round, with each sentence part scored (SB_PARTS).
// On the core's builder (core/builder.js) since 10 Nov 2026: this file
// registers Japanese's modes and rules (see ON THE CORE, at the end).
// Loaded after core/builder.js, before ja/legacy.js.

// A random "X is Y" target for the challenges, in the same shape sbNewTarget returns.
function sbNewTargetBeing() {
  let w = null;
  for (let i = 0; i < 20 && !w; i++) w = beingPick({ random: true });
  if (!w) return null;
  const q = sgChance(0.25);
  const st = ['on', w.time ? 'on' : 'off', w.degree ? 'on' : 'off', 'off', w.adj ? 'on' : 'off', 'on', q ? 'q' : 'stmt'];
  if (q && w.subj.me) st[0] = 'off'; // "Are you…?", not "Am I…?"
  const ex = beingBuild(w, st);
  const slots = {};
  const ps0 = ex.parts.filter(x => x.slot === 0);
  if (ps0.length) {
    const wd = ps0.map(x => x.jp).join('').replace(/は$/, ''), ro = ps0.map(x => x.ro).join(' ').replace(/ wa$/, '');
    const it = w.topicWord ? l3TaughtItem(w.topicWord) : l3TaughtItem(wd);
    const twin = sbPoolCard(0, wd);
    const roFix = SENTENCE_NAME_POOL.some(n => wd.startsWith(n.jp)) ? ro : ro.charAt(0).toLowerCase() + ro.slice(1);
    slots[0] = { word: wd, ro: twin ? twin.ro : roFix, en: twin ? twin.en : (w.topicEn || w.subj.en), key: it ? it.jp + '|' + it.en : null };
  }
  if (w.time && st[1] === 'on') { const it = l3TaughtItem(w.time.jp); slots[1] = { word: w.time.jp, ro: w.time.ro, en: w.time.en, key: it ? it.jp + '|' + it.en : null }; }
  if (w.degree) { const it = l3TaughtItem(w.degree); slots[2] = { word: w.degree, ro: BEING_DEGREE[w.degree].ro, en: w.degree === 'とても' ? 'very' : 'not very (+ negative)', key: it ? it.jp + '|' + it.en : null }; }
  if (w.adj) { const it = l3TaughtItem(w.adj.jp); slots[4] = { word: w.adj.jp, ro: w.adj.ro, en: w.adj.en, key: it ? it.jp + '|' + it.en : null }; }
  { const it = l3TaughtItem(w.comp.jp); slots[5] = { word: w.comp.jp, ro: w.comp.ro, en: w.comp.jobEn || (w.kind === 'adj' ? w.comp.en : w.comp.en.replace(/^(a|an) /, '')), key: it ? it.jp + '|' + it.en : null }; }
  slots[6] = { word: 'です', ro: 'desu', en: 'is / am / are', key: null, end: ex.endIdx, q: ex.q };
  const say = ex.parts.map((pt, k) => pt.slot === 0 && !(ex.parts[k + 1] && ex.parts[k + 1].slot === 0) ? pt.jp.replace(/は$/, 'わ') : pt.jp).join('');
  return { slots, en: l3cEnPlain(ex.enM), jp: ex.jp, romaji: ex.romaji, meImplied: !ps0.length, say, being: w.kind };
}

// Answer it targets. Doing / Going / Giving: the statement about you, asked
// about one part. Being: "Xは どうですか" (how is it?) or "Xは どんな まちですか"
// (what kind of town?), answered without the topic - saying it as well is fine.
function sbNewTargetAnswer() {
  if (sbMode !== 'being') {
    for (let i = 0; i < 40; i++) { const t = sbNewTarget({ answer: true }); if (t) return t; }
    return null;
  }
  let w = null;
  for (let i = 0; i < 40 && !w; i++) {
    const c = beingPick({ random: true, adjNoun: sgChance(0.4) });
    if (c && (c.kind === 'adj' || c.kind === 'adjnoun') && c.subj.thing && !c.time) w = c;
  }
  if (!w) return null;
  const st = ['off', 'off', w.degree ? 'on' : 'off', 'off', w.adj ? 'on' : 'off', 'on', 'stmt'];
  const ex = beingBuild(w, st);
  ex.enM = beingBuild(w, ['on'].concat(st.slice(1))).enM; // English names the topic ("London isn't…", not "I'm not…")
  const top = w.subj.segs[0];
  const tj = l3cJp(top), tro = top.ro;
  const be = /^the \S.*s$/i.test(w.topicEn) && !/(ss|us)$/i.test(w.topicEn) ? 'are' : 'is';
  const question = w.adj
    ? { jp: `${tj} どんな ${w.comp.jp}ですか。`, romaji: sgCap(`${tro} donna ${w.comp.ro} desu ka?`), en: `What kind of ${w.comp.en} ${be} ${w.topicEn}?` }
    : { jp: `${tj} どうですか。`, romaji: sgCap(`${tro} dou desu ka?`), en: `How ${be} ${w.topicEn}?` };
  const slots = {};
  if (w.degree) { const it = l3TaughtItem(w.degree); slots[2] = { word: w.degree, ro: BEING_DEGREE[w.degree].ro, en: w.degree === 'とても' ? 'very' : 'not very (+ negative)', key: it ? it.jp + '|' + it.en : null }; }
  if (w.adj) { const it = l3TaughtItem(w.adj.jp); slots[4] = { word: w.adj.jp, ro: w.adj.ro, en: w.adj.en, key: it ? it.jp + '|' + it.en : null }; }
  { const it = l3TaughtItem(w.comp.jp); slots[5] = { word: w.comp.jp, ro: w.comp.ro, en: w.comp.en, key: it ? it.jp + '|' + it.en : null }; }
  slots[6] = { word: 'です', ro: 'desu', en: 'is / am / are', key: null, end: ex.endIdx, q: false };
  return { slots, en: l3cEnPlain(ex.enM), jp: ex.jp, romaji: ex.romaji, meImplied: false, optional0: tj.replace(/は$/, ''), say: ex.parts.map(p => p.jp).join(''), being: w.kind, question };
}

// ==== SENTENCE BUILDER (2026-10-22, Andrew) ====
// The desk sheets as something to play with: the same coloured columns
// (dsColumns), tap one card from each (or skip a column) and the sentence
// builds along the top, particles added. Two ways to use it:
//   Build     - free play: make any sentence, hear it.
//   Challenge - an English sentence from the Sentence order engine; build the
//               Japanese. Each part right first time earns full production
//               credit for its word (recordProduction), half on a second go.
//               Recognition scores are never touched. Columns are re-picked
//               for every challenge, so they don't go stale.
// Slots are the Sentence order card's 0-6 (colours --slot-1..7); Giving has
// no slot 4.
// Japanese's own state, beside the core's (sbMode, sbSel, sbTarget...):
// the verb ending and か.
let sbEnd = 0, sbQ = false;

// Reading challenge (2026-10-23): the reverse - a Japanese sentence to read,
// answered by picking each part's English. Shares everything else with the
// challenge; the core's sbReverse switches the card faces and the scores it keeps.
let sbShowKana = false, sbShowRomaji = false;

// Answer it (L4, 2026-11-04): a question like the ones in class, in Japanese -
// build your answer. The target is the answer; sbTarget.question is the prompt.
let sbShowEn = false; // (sbAnswer is the core's since 11 Nov)

const SB_ENDS = [['ます', 'masu', 'hab', false], ['ません', 'masen', 'hab', true], ['ました', 'mashita', 'past', false], ['ませんでした', 'masendeshita', 'past', true]];

const sbNorm = s => String(s || '').replace(/\s/g, '');

// The particle each slot adds after the chosen word, for this mode.
function sbParticle(slot, it) {
  if (!it) return ['', ''];
  if (sbMode === 'being') return slot === 0 ? ['は', 'wa'] : slot === 4 ? beingLink(it.jp) : ['', ''];
  if (slot === 0) return ['は', 'wa'];
  if (slot === 3) return /で$/.test(it.jp) ? ['', ''] : sbMode === 'give' ? ['に', 'ni'] : ['と', 'to'];
  if (slot === 4) return it.jp === 'あるいて' ? ['', ''] : ['で', 'de'];
  if (slot === 5) return sbMode === 'go' ? ['に', 'ni'] : ['を', 'o'];
  return ['', ''];
}

// Columns for the current mode, from the desk sheets. In a challenge the
// "what" groups are flattened (the group would give the verb away) and the
// target word is slipped into every column it needs.
function sbBuildColumns() {
  const cols = dsColumns(sbMode).map((c, i) => Object.assign({}, c, { slotIdx: (c.slot || i + 1) - 1 }));
  // Doing lists its object verbs (たべます, のみます…) as group heads, not in
  // the verb column - add them there so any verb can be picked and conjugated.
  const groupVerbs = [];
  if (sbMode === 'do') cols.forEach(c => (c.groups || []).forEach(g => { if (!/\//.test(g.verb.jp) && sgW(g.verb.jp)) groupVerbs.push(g.verb); }));
  cols.forEach(c => {
    if (c.ends) { c.items = c.lead.concat(groupVerbs.filter(v => !c.lead.some(x => x.jp === v.jp))); delete c.ends; c.verbCol = true; }
    // Flattened, but still a double column, so the challenge is the same
    // width as the builder (Andrew noticed the difference on a laptop).
    // Once only: a word can sit under two verb groups (カード: give and send).
    if (c.groups && sbChallenge) { c.items = shuffle(c.groups.flatMap(g => g.items).filter((x, k, a) => a.findIndex(y => sbNorm(y.jp) === sbNorm(x.jp)) === k)).slice(0, 14); delete c.groups; }
  });
  if (sbChallenge && sbTarget) {
    cols.forEach(c => {
      const t = sbTarget.slots[c.slotIdx] || (c.slotIdx === 0 && sbTarget.optional0 ? { word: sbTarget.optional0, ro: sgW(sbTarget.optional0) ? sgW(sbTarget.optional0).ro : '', en: '' } : null);
      if (!t) return;
      const list = c.items || [];
      if (!list.some(x => sbNorm(x.jp) === sbNorm(t.word))) {
        list.splice(Math.floor(Math.random() * (Math.min(list.length, 8) + 1)), 0, { jp: t.word, ro: t.ro, en: t.en || '' });
        if (list.length > 13) list.length = 13; // the target went in within the first nine
      }
      c.items = list;
    });
  }
  sbCols = cols;
}

// A challenge target from the Sentence order engine. Uses the card's own
// globals for a moment and puts them back, so an open card isn't disturbed.
function sbNewTarget(opts = {}) {
  const saved = [l3cMode, l3SentStates.slice(), l3FreqIdx, l3SentWords];
  try {
    l3cMode = sbMode;
    const on = () => 'on';
    // Lesson 6: one in six is a もう sentence; Giving sometimes has its means で.
    const vr = Math.random();
    l3SentStates = [on(), Math.random() < 0.85 ? 'on' : 'off', Math.random() < 0.25 ? 'on' : 'off',
      sbMode === 'give' || Math.random() < 0.55 ? 'on' : 'off', sbMode === 'give' ? (Math.random() < 0.3 ? 'on' : 'off') : (Math.random() < 0.7 ? 'on' : 'off'), 'on',
      opts.answer ? 'stmt' : vr < 0.08 ? 'mou' : vr < 0.17 ? 'mouq' : vr < 0.4 ? 'q' : 'stmt'];
    if (opts.answer) l3SentStates[2] = 'off'; // "How often…?" isn't a question word here
    l3FreqIdx = Math.floor(Math.random() * L3_FREQ_WORDS.filter(f => !(l3SentStates[6] === 'q' && f.neg)).length);
    pickFreshL3SentenceWords();
    l3FixTimeForFreq();
    const w = l3SentWords;
    if (!w) return null;
    if (opts.answer && !w.subj.me) return null; // the question is to you
    const ex = buildL3SentenceExample();
    // Answer it: ask one of the parts the answer has (when / with whom / where
    // or with what / what or where to), as a question to "you" - no topic.
    let question = null;
    if (opts.answer) {
      const askable = [1, 3, 4, 5].filter(i => l3SentStates[i] === 'on' && ex.parts.some(p => p.slot === i));
      if (!askable.length) return null;
      // Your own family (おとうとと, ははに) or ひとりで can't be in a question to
      // someone else - so when they're in the answer, they're what's asked.
      const own = l3SentStates[3] === 'on' && w.comp && /(^|with |to |from )my |on my own/.test(w.comp.en || '') && askable.includes(3);
      const qi = own ? 3 : sgPick(askable);
      const stmt = l3SentStates.slice();
      l3SentStates = stmt.slice(); l3SentStates[0] = 'off'; l3SentStates[qi] = 'q';
      const qx = buildL3SentenceExample();
      l3SentStates = stmt;
      question = { jp: qx.jp, romaji: qx.romaji, en: qx.en, slot: qi };
    }
    const slots = {};
    const S = L3C_SLOTS[sbMode];
    [0, 1, 2, 3, 4, 5].forEach(i => {
      const ps = ex.parts.filter(p => p.slot === i);
      if (!ps.length) return;
      let jp = ps.map(p => p.jp).join(''), ro = ps.map(p => p.ro).join(' ');
      const part = sbParticle(i, { jp });
      if (part[0] && jp.endsWith(part[0])) { jp = jp.slice(0, -part[0].length); ro = ro.replace(new RegExp(' ' + part[1] + '$'), ''); }
      const placeSlot = (i === 4 && sbMode === 'do') || (i === 5 && sbMode === 'go');
      const it = placeSlot ? l3PlaceItem(jp) : (l3TaughtItem(jp) || l3TaughtItem(jp.replace(/に$/, '')));
      // English for the card, so the answer doesn't stand out as the one with
      // none (Andrew, 2026-10-22): the engine's own words for who / when /
      // with whom / where; the word list's for the rest.
      const f0 = L3_FREQ_WORDS[l3FreqIdx];
      const en = i === 0 ? w.subj.en : i === 1 ? w.time.en : i === 2 ? (l3cMou() ? 'already / yet' : f0 && f0.en) : i === 3 ? String(w.comp.en || '').replace(/^(with|to|from) /, '')
        : i === 4 ? (w.slot4 && w.slot4.en) : (it ? it.en : (w.slot5 && w.slot5.en));
      // Who / when / with whom read better in the engine's words ("Yamamoto-san's
      // grandmother", "on Sundays"); everything else uses the word list's, like
      // its neighbours ("pool", not "at the pool").
      const engineEn = i === 0 || i === 1 || i === 3;
      const bare = String(en || '').replace(/^(at|in|on|by|to) (the |a |an )?/, '');
      // If the word has a card of its own anywhere in that column's full list,
      // the answer card copies it exactly ("on Saturday", not the sentence's
      // "on Saturdays"), so nothing about it stands out (Andrew, 2026-10-23).
      const twin = sbPoolCard(i, jp);
      // Romaji: no capital unless it starts with a name (Watanabe-san).
      const roFix = SENTENCE_NAME_POOL.some(n => jp.startsWith(n.jp)) ? ro : ro.charAt(0).toLowerCase() + ro.slice(1);
      slots[i] = { word: jp, ro: twin ? twin.ro : roFix, en: twin ? twin.en : (engineEn ? (en || (it ? it.en : '')) : (it ? it.en : bare)), key: it ? it.jp + '|' + it.en : null };
    });
    const f = l3SentStates[2] === 'on' ? L3_FREQ_WORDS[l3FreqIdx] : null;
    const neg = !!(f && f.neg);
    const tense = l3cMou() ? 'past' : f ? 'hab' : w.tense;
    const vIt = l3TaughtItem(w.verb);
    slots[6] = { word: w.verb, ro: sgW(w.verb).ro, en: vIt ? vIt.en : '', key: vIt ? vIt.jp + '|' + vIt.en : null,
      end: (tense === 'past' ? 2 : 0) + (neg ? 1 : 0), q: l3cIsQ() };
    // "I" with no topic: わたし or nothing are both right.
    let meImplied = !slots[0] && w.subj.me;
    let say = ex.parts.map((pt, k) => pt.slot === 0 && !(ex.parts[k + 1] && ex.parts[k + 1].slot === 0) ? pt.jp.replace(/は$/, 'わ') : pt.jp).join('');
    if (!question) return { slots, en: ex.en, jp: ex.jp, romaji: ex.romaji, meImplied, say, question };
    // Answer it: a question to you is answered without わたしは, as people
    // do - so the answer leaves it out and saying it is fine too (Andrew,
    // 10 Nov: it counted against him for leaving it out). The parts are kept
    // so the answer can follow the card picked for the asked part.
    let parts = ex.parts.map(p => ({ slot: p.slot, jp: p.jp, ro: p.ro }));
    if (slots[0] && sbNorm(slots[0].word) === 'わたし') { delete slots[0]; meImplied = true; parts = parts.filter(p => p.slot !== 0); }
    return Object.assign({ slots, en: ex.en, meImplied, question, parts }, sbPartsText(parts));
  } finally {
    [l3cMode, l3SentStates, l3FreqIdx, l3SentWords] = saved;
  }
}

// ENGLISH FOR A BUILT SENTENCE (2026-10-23, Andrew): the builder now shows
// the English of whatever's been picked, as it goes, from the same word lists
// and verb phrases as the rest of the app. Odd combinations come out as odd
// English - that's what was built. A time word that doesn't match the verb's
// tense, or あまり / ぜんぜん with a positive verb, gets a gentle note.
const SB_MY = { friend: 'my friend', colleague: 'my colleague' };

const SB_A = { friend: 'a friend', colleague: 'a colleague' };

function sbEnglishOf(sel, endIdx, q) {
  const M = sbMode, notes = [];
  if (!Object.keys(sel).length) return { enM: '', notes };
  if (M === 'being') return sbEnglishBeing(sel, endIdx, q);
  const e = SB_ENDS[endIdx], past = e[2] === 'past', neg = e[3];
  // When
  let timeEn = '', timeKind = null;
  const tc = sel[1];
  if (tc) {
    const bare = tc.jp.replace(/に$/, '');
    const day = SG_DAYS.find(d => d[0] === bare), T = SG_TIMES[bare], occ = L3C_OCCASIONS.find(o => o.jp === bare);
    if (T) {
      const only = T.tenses.length === 1 ? T.tenses[0] : null;
      timeKind = only === 'hab' ? null : only;
      const tense = past ? 'past' : only === 'fut' ? 'fut' : 'hab';
      timeEn = typeof T.en === 'string' ? T.en : (T.en[tense] || T.en.hab || T.en.fut);
    } else if (day) timeEn = 'on ' + day[1] + (!past ? 's' : '');
    else if (occ) timeEn = occ.en;
    else if (bare === 'たんじょうび') timeEn = M === 'give' && !sel[0] ? 'on my birthday' : 'for a birthday';
    else timeEn = tc.en || '';
    if (timeKind === 'past' && !past) notes.push(`${tc.jp} is in the past — the verb wants 〜ました or 〜ませんでした`);
    if (timeKind === 'fut' && past && bare !== 'きょう') notes.push(`${tc.jp} is still to come — the verb wants 〜ます or 〜ません`); // きょう … ました is fine (Lesson 6: きょう もう …ましたか)
  }
  const fut = !past && timeKind === 'fut';
  // How often
  const f = sel[2] ? L3_FREQ_WORDS.find(x => x.jp === sel[2].jp) : null;
  if (f && f.neg && !neg) notes.push(`${f.jp} goes with a negative verb (〜ません)`);
  // Who
  const w0 = sel[0], me = !w0 || w0.jp === 'わたし';
  const you = !w0 && q;
  const S = !w0 ? (q ? 'you' : 'I') : w0.jp === 'わたし' ? 'I' : (SB_MY[w0.en] || w0.en);
  const third = !me && !you;
  // Verb + what
  const v = sel[6], o = sel[5];
  const vWord = v ? String(v.en || '').replace(/^to /, '').replace(/\s*\(.*\)$/, '').split(' / ')[0] : '';
  let vEn = '…', objEn = '';
  if (M === 'do') {
    const V = v && o ? SG_OBJECT_VERBS.find(V => V.v === v.jp && V.objs.some(x => x[0] === o.jp)) : null;
    if (V) {
      const ph = sgActPhrase(V, V.objs.find(x => x[0] === o.jp), past ? 'past' : fut ? 'fut' : 'hab');
      const sp = ph.indexOf(' ');
      vEn = sp < 0 ? ph : ph.slice(0, sp); objEn = sp < 0 ? '' : ph.slice(sp + 1);
    } else {
      const V2 = v && SG_OBJECT_VERBS.find(V => V.v === v.jp && !V.phrase);
      if (v) vEn = (V2 && V2.en) || vWord;
      objEn = o ? o.en : '';
    }
  } else if (M === 'go') {
    if (v) vEn = v.jp === 'きます' ? 'come' : v.jp === 'かえります' ? (o ? 'go back' : 'go home') : 'go';
    objEn = o ? ((SG_DEST[o.jp] || L3C_COME_DEST[o.jp] || [])[0] || 'to ' + o.en) : '';
  } else {
    const G = v && L3C_GIVE.find(G => G.v === v.jp);
    if (v) vEn = G ? G.en : vWord;
    if (o && !(G && G.phone)) {
      // The object's "one" form (a hat, an umbrella) from whichever give-list it's in.
      const og = (G && G.objs.find(x => x[0] === o.jp)) || L3C_GIFTS.concat(L3C_LENDS, L3C_SKILLS).find(x => x[0] === o.jp);
      objEn = og ? og[2] : o.en;
    }
  }
  // The verb itself, in its tense
  const fw = f ? (f.jp === 'あまり' ? 'often' : f.jp === 'ぜんぜん' ? 'never' : f.en) : '';
  const F = t => t ? mk(2, t) + ' ' : '';
  const V6 = t => mk(6, t);
  const conj = (w, form) => w === '…' ? w : sgVerbEn(w, form); // no verb picked yet
  let vp;
  if (q) {
    let aux, mid;
    if (past) { aux = neg ? "Didn't" : 'Did'; mid = F(f && f.jp !== 'ぜんぜん' ? fw : (f ? 'ever' : '')) + V6(vEn); }
    else if (fut) { aux = (third ? 'Is' : (me && !you ? 'Am' : 'Are')) + (neg ? "n't" : ''); mid = 'going to ' + V6(vEn); }
    else { aux = (third ? 'Does' : 'Do') + (neg ? "n't" : ''); mid = F(f && f.jp !== 'ぜんぜん' ? fw : (f ? 'ever' : '')) + V6(vEn); }
    vp = { aux, mid };
  } else {
    const pres = third ? conj(vEn, 'third') : vEn;
    if (past) vp = neg ? (f && f.jp === 'ぜんぜん' ? F('never') + V6(conj(vEn, 'past')) : "didn't " + F(fw) + V6(vEn)) : F(fw) + V6(conj(vEn, 'past'));
    else if (fut) vp = (me ? "'m" : 'is') + (neg ? ' not' : '') + ' going to ' + V6(vEn);
    else vp = neg ? (f && f.jp === 'ぜんぜん' ? F('never') + V6(pres) : (third ? "doesn't" : "don't") + ' ' + F(fw) + V6(vEn)) : F(fw) + V6(pres);
  }
  // The rest, in English order
  const tail = [];
  if (objEn) tail.push(mk(5, objEn));
  if (sel[3]) {
    if (M === 'give') { const G = v && L3C_GIVE.find(G => G.v === v.jp); const prep = G ? (G.v === 'おしえます' && !o ? '' : G.prep) : 'to'; tail.push(mk(3, (prep ? prep + ' ' : '') + sel[3].en)); }
    else tail.push(mk(3, sel[3].jp === 'ひとりで' ? (me ? 'on my own' : 'on their own') : 'with ' + (SB_A[sel[3].en] || sel[3].en)));
  }
  if (sel[4]) tail.push(mk(4, M === 'go' ? ((SG_TRANSPORT.find(t => t[0] === sel[4].jp) || [])[1] || sel[4].en) : SG_TOOLS[sel[4].jp] || ((SG_PLACE_EN[sel[4].jp] || [])[0] || 'at ' + sel[4].en)));
  if (timeEn) tail.push(mk(1, timeEn));
  const T = tail.length ? ' ' + tail.join(' ') : '';
  const subj = w0 ? mk(0, S) : S;
  // もう (Lesson 6): "Have you eaten yet?" / "has already eaten".
  if (sel[2] && sel[2].jp === 'もう') {
    if (!past) notes.push('もう goes with 〜ました here (もう 〜ましたか = have you … yet?)');
    else if (neg) notes.push('"Not yet" is いいえ、まだです — もう doesn\'t take 〜ませんでした');
    else if (vEn !== '…') {
      const TN = timeEn ? tail.slice(0, -1) : tail, TNT = TN.length ? ' ' + TN.join(' ') : '', TM = timeEn ? ' ' + mk(1, timeEn) : '';
      const pp = V6(sgPP(vEn));
      const enMou = q ? `${third ? 'Has' : 'Have'} ${subj} ${pp}${TNT} ${mk(2, 'yet')}${TM}?`
        : l3cCap(`${subj}${me ? "'ve" : third ? ' has' : ' have'} ${mk(2, 'already')} ${pp}${TNT}${TM}.`);
      return { enM: enMou, notes };
    }
  }
  let enM = q ? `${vp.aux} ${subj} ${vp.mid}${T}?` : l3cCap(`${subj}${String(vp).startsWith("'") ? '' : ' '}${vp}${T}.`);
  enM = enM.replace(/…(\uE001)?\.$/, '…$1'); // still building: no full stop after the gap
  return { enM, notes };
}

function sbEnglishBeing(sel, endIdx, q) {
  const notes = [];
  const e = BEING_ENDS[endIdx], neg = e[3];
  let tense = e[2] === 'past' ? 'past' : 'hab', timeEn = '';
  const tc = sel[1];
  if (tc) {
    timeEn = tc.jp === 'いま' ? 'now' : tc.jp === 'きょねん' ? 'last year' : tc.jp === 'らいねん' ? 'next year' : tc.en;
    if (tc.jp === 'きょねん' && tense !== 'past') notes.push('きょねん is in the past — でした or じゃありませんでした');
    if ((tc.jp === 'らいねん' || tc.jp === 'いま') && tense === 'past') notes.push(`${tc.jp} isn't the past — です or じゃありません`);
    if (tc.jp === 'らいねん' && tense !== 'past') tense = 'fut';
  }
  const w0 = sel[0], me = !w0 || w0.jp === 'わたし', you = !w0 && q;
  const S = !w0 ? (q ? 'you' : 'I') : w0.jp === 'わたし' ? 'I' : (SB_MY[w0.en] || w0.en);
  const third = !me && !you;
  const c = sel[5], d = sel[2], a = sel[4];
  const person = !w0 || !BEING_THINGS.some(g => g.objs.includes(w0.jp)) || (c && (c.jp === 'ひと' || beingJobs().some(j => j.jp === c.jp)));
  let compEn = mk(5, '…'), kind = null;
  const deg = d ? mk(2, 'very') + ' ' : '';
  if (c) {
    const isNoun = /じん$/.test(c.jp) || beingJobs().some(j => j.jp === c.jp) || ['ひと', 'まち'].includes(c.jp);
    if (a) {
      // Adjective + noun: "a (very) kind person", "a famous doctor".
      kind = 'job';
      const aEn = beingAdjEn(a.jp, person), nEn = c.jp === 'ひと' ? 'person' : c.jp === 'まち' ? 'town' : String(c.en || '').split(' / ')[0];
      compEn = (/^[aeiou]/i.test(d ? 'very' : aEn) ? 'an ' : 'a ') + deg + mk(4, aEn) + ' ' + mk(5, nEn);
      if (!isNoun) notes.push(`${a.jp} describes a noun here — the last word wants to be a noun like ひと or まち`);
    } else if (/じん$/.test(c.jp)) { kind = 'nation'; compEn = deg + mk(5, c.en); }
    else if (isNoun) { kind = 'job'; compEn = deg + mk(5, beingArticle(c.jp === 'ひと' ? 'person' : c.jp === 'まち' ? 'town' : c.en)); }
    else { kind = 'adj'; compEn = deg + mk(5, beingAdjEn(c.jp, person)); }
    // Which endings go with which words.
    const isI = !a && beingIsI(c.jp);
    if (isI && endIdx >= 1 && endIdx <= 3) notes.push(`${c.jp} is an い-word: it changes its own ending — ${beingIForm(c.jp, c.ro, beingEndIdx(true, e[2] === 'past', neg))[0]}です`);
    if (!isI && endIdx >= 4) notes.push(`〜くない / 〜かった are for い-words — ${c.jp} takes じゃありません / でした`);
  }
  if (d && d.jp === 'あまり' && !neg) notes.push('あまり goes with a negative: あまり おもしろくないです (not very interesting)');
  if (d && d.jp === 'とても' && neg) notes.push('とても goes with a positive — for "not very", use あまり + a negative');
  let enM = beingEnglish(w0 ? mk(0, S) : S, me && !you, you, kind, compEn, tense, neg, q, timeEn, third, true);
  enM = enM.replace(/…()?\.$/, '…$1');
  return { enM, notes };
}

// SENTENCE PARTS (2026-10-23, Andrew): how each PART of a sentence is going,
// rather than each word - "Verb endings 70%, Time 80%, With whom 30%". Every
// challenge records, for each part, whether it was right at the first Check.
// Kept per part as the last 20 results, so the figure follows improvement.
// Verb and Verb ending are separate: the right verb with the wrong ending
// counts as a right verb and a wrong ending. Picking a part the sentence
// doesn't need (a frequency word that isn't there) counts against that part.
// The scores themselves are kept by the core, under the same keys as before
// (jpL4SentenceParts, jpL4SentencePartsR).

const SB_PART_DEFS = [
  ['who', 'Who は', 1], ['when', 'When (に)', 2], ['often', 'How often', 3], ['mou', 'もう (already / yet)', 3], ['degree', 'とても / あまり', 3], ['with', 'With whom と', 4], ['to', 'To / from whom に', 4],
  ['place', 'Where it happens で', 5], ['tool', 'With what で (tool, language)', 5], ['describe', 'Describing word (+ な)', 5], ['how', 'How (by) で', 5], ['what', 'What を', 6], ['whereTo', 'Where to に', 6], ['is', 'What it is (…です)', 6],
  ['verb', 'Verb', 7], ['ending', 'Verb ending (+か)', 7],
];

// Slot (0-6) + mode -> part id.
function sbPartId(slot, mode) {
  return [
    'who', 'when', mode === 'being' ? 'degree' : 'often', mode === 'give' ? 'to' : 'with', mode === 'go' ? 'how' : mode === 'being' ? 'describe' : 'place', mode === 'go' ? 'whereTo' : mode === 'being' ? 'is' : 'what', 'verb',
  ][slot];
}

// Every card a column could ever show, for copying an answer card's wording.
function sbPoolCard(slotIdx, jp) {
  const pools = {
    0: () => dsWhoPool(true),
    1: () => dsTimePool().concat(L3C_OCCASIONS.concat([{ jp: 'たんじょうび', en: 'on / for a birthday' }]).map(o => { const it = dsItem(o.jp, o.en); if (it) { it.jp += 'に'; it.ro += ' ni'; } return it; })),
    3: () => dsWhoPool(false).concat([dsItem('せんせい', 'the teacher'), dsItem('じょうし', 'my boss'), { jp: 'ひとりで', ro: 'hitori de', en: 'on my own' }]),
  };
  const f = pools[slotIdx];
  if (!f) return null;
  return f().filter(Boolean).find(x => sbNorm(x.jp) === sbNorm(jp)) || null;
}

function sbSetEnd(i) { if (sbDone || (sbResult && sbResult[6] === 'right')) return; sbEnd = i; if (sbResult) delete sbResult[6]; sbRender(); sbSaySlot(6); }

function sbToggleQ() { if (sbDone || (sbResult && sbResult[6] === 'right')) return; sbQ = !sbQ; if (sbResult) delete sbResult[6]; sbRender(); sbSaySlot(6); }

// The sentence built so far, as coloured chunks.
function sbBuilt() {
  const chunks = [];
  [0, 1, 2, 3, 4, 5, 6].forEach(i => {
    const it = sbSel[i];
    if (!it) return;
    if (i === 6) {
      if (sbMode === 'being') {
        const b = BEING_ENDS[sbEnd], c5 = sbSel[5];
        // An い-word with its own ending: おもしろ|くない + です (the word chunk changes).
        if (b[4] === 'i' && c5 && beingIsI(c5.jp)) {
          const last = chunks.find(c => c.slot === 5);
          if (last) { const [fj, fr] = beingIForm(c5.jp, c5.ro, sbEnd); last.jp = fj; last.ro = fr; }
          chunks.push({ slot: 6, jp: 'です' + (sbQ ? 'か' : ''), ro: 'desu' + (sbQ ? ' ka' : '') });
        } else chunks.push({ slot: 6, jp: b[0] + (sbQ ? 'か' : ''), ro: b[1] + (sbQ ? ' ka' : '') });
        return;
      }
      const e = SB_ENDS[sbEnd], v = sgW(it.jp) ? sgVerb(it.jp, e[2], e[3]) : { jp: it.jp, ro: it.ro };
      chunks.push({ slot: 6, jp: v.jp + (sbQ ? 'か' : ''), ro: v.ro + (sbQ ? ' ka' : '') });
      return;
    }
    const p = sbParticle(i, it);
    chunks.push({ slot: i, jp: it.jp + p[0], ro: it.ro + (p[1] ? ' ' + p[1] : '') });
  });
  return chunks;
}

// Picking a word says it with its particle (ともだちと, コンビニで…), or the
// verb with its ending, so the two get learnt together.
// The topic's は is said "wa" (sayParticles).
const sbSayOf = c => c.slot === 0 ? c.jp.replace(/は$/, 'わ') : c.jp;

function sbSaySlot(i) {
  const c = sbBuilt().find(x => x.slot === i);
  if (c) speakJapanese(sbSayOf(c));
}

function sbToggleKana() { sbShowKana = !sbShowKana; sbRender(); }

function sbToggleRomaji() { sbShowRomaji = !sbShowRomaji; sbRender(); }

function sbToggleEn() { sbShowEn = !sbShowEn; sbRender(); }

function sbSayQuestion() { if (sbTarget && sbTarget.question) speakJapanese(sbTarget.question.jp.replace(/[\s。]/g, '')); }

// Answer it: does a card from the asked column answer the question? Any
// card of the right kind: a time word that suits the question's tense; a
// place for a place, a tool for a tool; a thing the verb takes; anywhere to
// go, except that you only go home (かえります) to where the answer says.
function sbAnswerFits(i, s) {
  const T = sbTarget.slots, w = sbNorm(s.jp), verb = T[6] && T[6].word;
  const col = dsColumns(sbMode).find((c, k) => (c.slot || k + 1) - 1 === i);
  if (!col) return false;
  if (col.groups) return col.groups.some(g => g.verb.jp.split(/\s*\/\s*/).includes(verb) && g.items.some(x => sbNorm(x.jp) === w));
  const shown = sbCols.find(c => c.slotIdx === i);
  if (!shown || !(shown.items || []).some(x => sbNorm(x.jp) === w)) return false;
  if (i === 1) {
    const st = typeof SG_TIMES !== 'undefined' && SG_TIMES[w];
    if (!st) return true; // a day, or an occasion
    return T[6].end >= 2 ? st.tenses.includes('past') : st.tenses.includes('hab') || st.tenses.includes('fut');
  }
  if (i === 4 && sbMode === 'do') return !!sgIsTool(w) === !!(T[4] && sgIsTool(sbNorm(T[4].word)));
  if (i === 5 && sbMode === 'go') return verb !== 'かえります';
  return true;
}

// An Answer it sentence from its parts: the Japanese, romaji and what's said.
function sbPartsText(parts) {
  return { jp: parts.map(p => p.jp).join(' ') + '。', romaji: sgCap(parts.map(p => p.ro).join(' ')) + '.', say: parts.map(p => p.jp).join('') };
}

// The answer shown follows the card picked for the asked part.
function sbAdoptAnswer(i, s) {
  const it = l3TaughtItem(sbNorm(s.jp)), [pj, pr] = sbParticle(i, s);
  const k = sbTarget.parts.findIndex(p => p.slot === i);
  if (k < 0) return;
  sbTarget.parts = sbTarget.parts.filter((p, n) => n === k || p.slot !== i);
  sbTarget.parts[k] = { slot: i, jp: s.jp + pj, ro: [s.ro, pr].filter(Boolean).join(' ') };
  Object.assign(sbTarget, sbPartsText(sbTarget.parts));
  sbTarget.slots[i] = { word: s.jp, ro: s.ro, en: s.en || '', key: it ? it.jp + '|' + it.en : null };
  // And its English, from the parts as the builder reads them.
  const sel = {};
  Object.keys(sbTarget.slots).forEach(k => { const x = sbTarget.slots[k]; sel[k] = { jp: x.word, ro: x.ro, en: x.en }; });
  const e = sbEnglishOf(sel, sbTarget.slots[6].end, false).enM;
  if (e) sbTarget.en = l3cEnPlain(e);
}

// ==== ON THE CORE (10 Nov 2026) ====
// The mechanics - picking, Check, one more go, the part scores, the verdict
// and the session line - are the core's (core/builder.js), shared with
// Portuguese. What's Japanese is registered here: the four modes, with the
// Sentence order card's slots 0-6, and the hooks for readings, endings and
// か, the topic that can be left out, Answer it, and the columns.
const SB_SLOT_IDS = [0, 1, 2, 3, 4, 5, 6];
['do', 'go', 'give', 'being'].forEach(id => registerBuilderMode({
  id,
  label: { do: 'Doing', go: 'Going', give: 'Giving', being: 'Being' }[id],
  // The roles name what's missing ("missing: When, Verb").
  get slots() { return SB_SLOT_IDS.map(i => [i, ((L3C_SLOTS[id] || [])[i] || { role: String(i) }).role.replace(/ \(.*\)$/, '')]); },
  // Doing: an object listed under a verb brings that verb with it.
  onPick: id === 'do' ? (i, card, same, groupVerb) => { if (!same && groupVerb && !(sbResult && sbResult[6] === 'right')) sbSel[6] = groupVerb; } : null,
}));

setBuilderLanguage({
  screen: 'sentence-builder',
  partDefs: SB_PART_DEFS,
  title: () => sbAnswer ? tx('sb.titleAnswer') : '',
  // Japanese's own state: the ending and か, Answer it, the reading toggles.
  onReset(why, challenge) {
    sbEnd = 0; sbQ = false;
    if (why === 'enter') { sbAnswer = challenge === 'answer'; sbShowKana = false; sbShowRomaji = false; sbShowEn = false; }
    if (why === 'challenge') { sbShowRomaji = false; sbShowEn = false; }
  },
  newTarget() {
    let t = null;
    for (let i = 0; i < 10 && !(t = sbAnswer ? sbNewTargetAnswer() : sbMode === 'being' ? sbNewTargetBeing() : sbNewTarget()); i++);
    return t;
  },
  buildColumns: sbBuildColumns,
  targetSel: t => t.slots,
  same: (a, b) => sbNorm(a.jp) === sbNorm(b.jp),
  chunks: () => sbBuilt(),
  // Picking a word says it with its particle, or the verb with its ending.
  sayPick: i => sbSaySlot(i),
  sayText: () => sbBuilt().map(sbSayOf).join(''),
  targetSay: () => sbTarget.say || sbTarget.jp.replace(/[\s。]/g, ''),
  labelHtml: l => markSmallKana(l),
  // "I" with no topic: わたし or nothing are both right; Being's Answer it
  // topic likewise.
  mark(i, s, t) {
    if (i === 0 && !t && sbTarget.meImplied) return !s || s.jp === 'わたし' ? (s ? 'right' : null) : 'wrong';
    if (i === 0 && !t && sbTarget.optional0) return !s ? null : sbNorm(s.jp) === sbNorm(sbTarget.optional0) ? 'right' : 'wrong';
    return undefined;
  },
  compare(i, s, t) {
    let ok = sbNorm(s.jp) === sbNorm(t.word);
    // Answer it: the part asked about is yours to choose ("Where do you do
    // your homework?" - at home, at the library…), so any card that fits is
    // right, and the answer shown becomes yours (Andrew, 10 Nov).
    if (!ok && sbAnswer && sbTarget.question && sbTarget.question.slot === i && sbAnswerFits(i, s)) { sbAdoptAnswer(i, s); ok = true; }
    // Right verb, wrong ending (or か): say so, and keep the verb picked.
    if (i === 6 && ok && (sbEnd !== t.end || sbQ !== t.q)) return 'ending';
    return ok ? 'right' : 'wrong';
  },
  // Production credit for each target word, the first time it's settled.
  afterMark(res, prev) {
    const T = sbTarget.slots, credit = sbTry === 1 ? 1 : 0.5;
    Object.keys(T).forEach(i => {
      const t = T[i];
      if (prev[i] === 'right' || !t.key) return;
      if (sbReverse) return; // reading is recognition - parts only
      if (res[i] === 'right') recordProduction(t.key, credit);
      else if (sbTry >= 2) recordProduction(t.key, 0);
    });
  },
  // Counted: the answer's parts.
  counts(res) {
    const ids = Object.keys(sbTarget.slots);
    return { r: ids.filter(i => res[i] === 'right').length, n: ids.length };
  },
  recordParts(res) {
    const T = sbTarget.slots;
    SB_SLOT_IDS.forEach(i => {
      const r = res[i];
      if (!r) return; // not in the sentence and not picked (or "I" left out)
      if (i === 6 && sbMode === 'being') { sbRecordPart('ending', r === 'right'); return; } // です is the only "verb"
      if (i === 6) {
        if (r === 'missing') { sbRecordPart('verb', false); return; }
        sbRecordPart('verb', r === 'right' || r === 'ending');
        if (r === 'right' || r === 'ending') sbRecordPart('ending', r === 'right');
        return;
      }
      // Tool で has its own part (Lesson 5): by the target's word, or what was picked.
      const tw = i === 4 && (sbMode === 'do' || sbMode === 'give') ? (T[4] ? T[4].word : (sbSel[4] && sbSel[4].jp)) : null;
      const mw = i === 2 ? (T[2] ? T[2].word : (sbSel[2] && sbSel[2].jp)) : null;
      sbRecordPart(mw === 'もう' ? 'mou' : tw && sgIsTool(sbNorm(tw)) ? 'tool' : sbPartId(i, sbMode), r === 'right');
    });
  },
  endingMsg: () => sbResult[6] === 'ending' ? (sbTarget.slots[6].q !== sbQ && sbTarget.slots[6].end === sbEnd ? tx('sb.checkTheKa') : tx('sb.checkTheEnding')) : '',
  stripHtml: sbStripHtml,
  answerHtml: () => sbReverse ? `<div class="sb-answer"><div class="sb-en sb-en-answer">"${sbTarget.en}"</div></div>`
    : `<div class="sb-answer" onclick="sbSayTarget()"><div class="sb-jp">${markSmallKana(sbTarget.jp)}</div><div class="sb-ro">${sbTarget.romaji}</div>${sbAnswer ? `<div class="sb-en">"${sbTarget.en}"</div>` : ''}</div>`,
  buttons(btn, built) {
    let html = '';
    if (sbReverse) {
      html += btn(tx('sb.hearIt'), 'sbSayTarget()');
      if (!sbDone) html += btn(sbShowRomaji ? tx('sb.hideRomaji') : tx('sb.showRomaji'), 'sbToggleRomaji()');
      html += btn(sbShowKana ? tx('sb.hideKana') : tx('sb.showKana'), 'sbToggleKana()');
    } else if (sbAnswer) {
      html += btn(tx('sb.hearQuestion'), 'sbSayQuestion()');
      if (!sbDone) html += btn(sbShowRomaji ? tx('sb.hideRomaji') : tx('sb.showRomaji'), 'sbToggleRomaji()') + btn(sbShowEn ? tx('sb.hideEnglish') : tx('sb.showEnglish'), 'sbToggleEn()');
      if (built.length) html += btn(tx('sb.hearMyAnswer'), 'sbSay()');
    } else if (built.length) html += btn(tx('sb.hearIt'), 'sbSay()');
    return html;
  },
  drawColumns: sbDrawColumns,
});

// The top of the screen: the question (reading, Answer it, or the English to
// build), the sentence so far in Japanese and romaji, and the notes.
function sbStripHtml(built) {
  const chunkHtml = (c, field) => `<span class="l3c-chunk sb-chunk${sbResult && sbResult[c.slot] ? ' sb-' + sbResult[c.slot] : ''}" style="--slot:var(--slot-${c.slot + 1})">${field === 'jp' ? markSmallKana(c.jp) : c.ro}</span>`;
  let html = '';
  const eng = sbEnglishOf(sbSel, sbEnd, sbQ);
  const enLine = eng.enM ? `<div class="sb-en">"${l3cEnHtml(eng.enM)}"</div>` : '';
  const notesHtml = eng.notes.length && !sbDone ? `<div class="sb-notes">${eng.notes.map(n => markSmallKana(n)).join(' · ')}</div>` : '';
  if (sbReverse && sbTarget) {
    // Reading: the Japanese is the question; the English builds underneath.
    html += `<div class="sb-prompt-jp" onclick="sbSayTarget()">${markSmallKana(sbTarget.jp)}</div>`
      + (sbShowRomaji || sbDone ? `<div class="sb-ro sb-prompt-ro">${sbTarget.romaji}</div>` : '');
    html += eng.enM ? `<div class="sb-en sb-en-built">"${l3cEnHtml(eng.enM)}"</div>` : `<div class="sb-empty">${tx('sb.readingHelp')}</div>`;
  } else {
    if (sbAnswer && sbTarget && sbTarget.question) {
      const Q = sbTarget.question;
      html += `<div class="sb-prompt-jp" onclick="sbSayQuestion()">${markSmallKana(Q.jp)}</div>`
        + (sbShowRomaji || sbDone ? `<div class="sb-ro sb-prompt-ro">${Q.romaji}</div>` : '')
        + (sbShowEn || sbDone ? `<div class="sb-en">"${Q.en}"</div>` : '');
    } else if (sbChallenge && sbTarget) html += `<div class="sb-prompt">"${sbTarget.en}"</div>`;
    html += built.length ? `<div class="sb-jp">${built.map(c => chunkHtml(c, 'jp')).join(' ')}。</div><div class="sb-ro">${built.map(c => chunkHtml(c, 'ro')).join(' ')}</div>` + (sbChallenge ? '' : enLine)
      : `<div class="sb-empty">${sbAnswer ? tx('sb.answerHelp') : sbChallenge ? tx('sb.challengeHelp') : tx('sb.builderHelp')}</div>`;
  }
  if (!sbChallenge || sbReverse) html += notesHtml;
  return html;
}

// The columns: the desk sheets' cards (grouped under their verbs in the free
// builder), and under the verb the endings and か.
function sbDrawColumns(colsEl) {
  colsEl.classList.toggle('sb-showkana', sbReverse && sbShowKana);
  sbCols.forEach((c, n) => {
    const i = c.slotIdx;
    const col = document.createElement('div');
    col.className = 'ds-col sb-col' + (c.wide ? ' wide' : '');
    col.style.setProperty('--slot', `var(--slot-${i + 1})`);
    const partic = i === 6 ? (sbQ ? 'か' : '。') : c.particle;
    col.innerHTML = `<div class="ds-head"><div class="ds-head-top"><span class="ds-num">${n + 1}</span><span class="ds-role">${c.role}</span><span class="ds-particle">${markSmallKana(partic)}</span></div></div>`;
    const target = sbDone && sbTarget && sbTarget.slots[i];
    const card = (it, groupVerb) => {
      const el = document.createElement('div');
      const picked = sbSel[i] && sbNorm(sbSel[i].jp) === sbNorm(it.jp);
      const isAns = target && sbNorm(it.jp) === sbNorm(target.word);
      el.className = 'ds-card sb-card' + (i === 6 ? ' ds-verb' : '') + (picked ? ' sb-picked' : '') + (picked && sbResult && sbResult[i] === 'right' ? ' sb-ok' : '') + (isAns && !picked ? ' sb-should' : '');
      const len = [...it.jp].length;
      el.innerHTML = `<div class="ds-jp${len >= 8 ? ' xlong' : len >= 6 ? ' long' : ''}">${markSmallKana(it.jp)}</div><div class="ds-ro">${it.ro}</div><div class="ds-en">${it.en || ''}</div>`;
      el.onclick = () => sbPick(i, it, groupVerb);
      col.appendChild(el);
    };
    if (c.groups) c.groups.forEach(g => {
      const h = document.createElement('div');
      h.className = 'ds-group-head';
      h.innerHTML = `<span class="ds-jp">${markSmallKana(g.verb.jp)}</span> <span class="ds-ro">${g.verb.ro}</span>`;
      col.appendChild(h);
      const single = !/\//.test(g.verb.jp) && sgW(g.verb.jp);
      g.items.forEach(x => card(x, single ? g.verb : null));
    });
    else (c.items || []).forEach(x => card(x));
    if (i === 6) {
      const ends = document.createElement('div');
      ends.className = 'sb-ends';
      // Reading: the endings by meaning first, the Japanese small.
      const being = sbMode === 'being';
      const REV_EN = being ? ['is / will be', "isn't / won't be", 'was', "wasn't", "isn't (い-word)", 'was (い-word)', "wasn't (い-word)"] : ['does / will', "doesn't / won't", 'did', "didn't"];
      const ENDS = being ? BEING_ENDS : SB_ENDS;
      // い-word endings show as 〜くないです (they replace the word's own い).
      const tl = e => !being ? '〜' : e[4] === 'i' ? '〜' : '';
      ends.innerHTML = ENDS.map((e, k) => `<button type="button" class="sb-end${being && e[4] === 'i' ? ' sb-end-i' : ''}${sbEnd === k ? ' active' : ''}" onclick="sbSetEnd(${k})">${sbReverse ? `${REV_EN[k]} <span class="sb-end-jp">${tl(e)}${e[0]}</span>` : tl(e) + e[0]}</button>`).join('')
        + `<button type="button" class="sb-end sb-end-q${sbQ ? ' active' : ''}" onclick="sbToggleQ()">${sbReverse ? 'a question <span class="sb-end-jp">か</span>' : '＋か (question)'}</button>`;
      col.appendChild(ends);
    }
    colsEl.appendChild(col);
  });
}
