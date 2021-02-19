const fs = require("fs");
const { listFiles } = require("./lib/listFiles");
const { exportCSV } = require("./lib/exportCSV");

const csvFileName = "course.csv";
const filePaths = listFiles("Pythonを始めよう");

const lessons = [];

filePaths.forEach((filePath) => {
  let file = fs.readFileSync(filePath, "utf-8");

  // レッスンごとに分割
  const sliceChapter = [];
  file.split(/\n---/).forEach((lesson, i) => {
    if (i <= 0) {
      return;
    }
    sliceChapter.push(
      lesson
        .replace(/<!-- ?\r?\n?＠TODO\r?\n([\s\S]+?)\r?\n?-->/g, "") // @TODOを削除
        .replace(/^\s+|\s+$/g, "")
    );
  });

  sliceChapter.forEach((chapter) => {
    // タイトル
    const title = chapter.match(/^## .+/g)[0].replace("## ", "");
    // 概要
    const desc = chapter
      .match(/#{3} ?概要\r?\n([\s\S]+?)\r?\n#{3}/g)[0]
      .replace(/#{3} ?(.+)?/g, "")
      .replace(/^\s+|\s+$/g, "");
    // 経験値
    const exp = chapter
      .match(/#{3} ?経験値\r?\n([\s\S]+?)\r?\n#{3}/g)[0]
      .replace(/#{3} ?(.+)?/g, "")
      .replace(/^\s+|\s+$/g, "");
    const body = chapter
      .match(/#{3} ?本文\r?\n([\s\S]+?)\r?\n#{3} ?問題/g)[0]
      .replace(/#{3} ?(.+)?/g, "")
      .replace(/^\s+|\s+$/g, "");
    // 問題文
    const quizBody = chapter
      .match(/#{3} 問題\r?\n([\s\S]+?)\r?\n- \[( |x)?\]/)[1]
      .replace(/^\s+|\s+$/g, "");
    // 解説
    const commentary = chapter
      .replace(/(#{2} .+)/, "")
      .split(/(#{3} 解説)/)[2]
      .replace(/^\s+|\s+$/g, "");
    // 選択肢を配列で取得
    const quizChoices = [];
    chapter.match(/(- \[( |x)\] .+\n)/g).forEach((choice) => {
      const choiceSplit = choice.replace("\n", "").split(/(- \[ ?x?\])/);
      isCorrect = choiceSplit[1].includes("x");
      quizChoiceText = choiceSplit[2];
      quizChoices.push(quizChoiceText, isCorrect);
    });
    lessons.push([
      title,
      desc,
      exp,
      body,
      quizBody,
      commentary,
      ...quizChoices,
    ]);
  });
});

exportCSV(lessons, csvFileName);
