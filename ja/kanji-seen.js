// Kanji seen in the Japanese class materials - the Japanese app's own list
// since 14 Nov 2026 (it was Kanji Cards' seen.js, copied in through
// tools/kanji/make-kanji-500.js; Cards is frozen now, keeping its copy as it
// was). Edit it here; nothing else to run.
//
// "Seen in teaching", not "taught": a lighter mark than a word's taught tag
// (agreed with Andrew, 11 Nov). One set overall for now, not per lesson (no
// worrying about first, last or every occurrence - revise later if needed).
// Seen kanji come first if the list of cards ever grows or swaps.
//   pointed: kanji the class pointed out as kanji (the colour sheet).
//   passing: single kanji seen in passing - printed with readings over them.
//   words:   the same for whole words, as written (the app marks its
//            whole-word cards with these: 富士山, 東京, 暑い...).
// Kept in the order first seen; a comment says where from.
window.JP_KANJI_SEEN = {
  pointed: [
    // L4 Lesson 1 (10 Nov): the colours reference sheet.
    '青', '赤', '白', '黒', '黄', '茶', '緑', '紫', '灰', '橙', '桃',
  ],
  passing: [
    // L4 Lesson 1 (10 Nov): the practice sheets and the homework.
    '行', '見', '本', '人', '会', '車', '買', '富', '士', '山', '親', '切', '元', '気',
    '暑', '寒', '暇', '社', '新', '日', '語', '難', '大', '小', '古', '易', '忙', '有',
    '名', '東', '京', '国', '町', '花',
  ],
  words: [
    // L4 Lesson 1 (10 Nov).
    '富士山', '東京', '暑い', '寒い', '新しい', '古い', '大きい', '小さい', '難しい',
    '易しい', '忙しい', '親切', '元気', '有名', '会社', '日本語',
  ],
};
