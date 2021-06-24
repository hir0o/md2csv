#! /usr/bin/env node

const fs = require("fs");
const { listFiles } = require("./lib/listFiles");
const { exportCSV } = require("./lib/exportCSV");
const { shuffle } = require("./lib/shuffle");

const csvFileName = "course.csv";
const filePaths = listFiles(process.argv[2]);
const textType = process.argv[3];
let isError = false;

const csv = [];

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
        .replace(/<!-- ?\r?\n?＠TODO\r?\n([\s\S]+?)\r?\n?-->/g, "")
        .replace(/^\s+|\s+$/g, "")
    );
  });

  if (textType === "q" && filePath.includes("まとめテスト")) {
    sliceChapter.forEach((chapter) => {
      try {
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
          const isCorrect = choiceSplit[1].includes("x");
          const quizChoiceText = choiceSplit[2];
          quizChoices.push(quizChoiceText, isCorrect);
        });
        csv.push([quizBody, commentary, ...quizChoices]);
      } catch {
        isError = true;
        console.log("エラー箇所");
        console.log("--------------------------------------------");
        console.log(chapter);
      }
    });
  } else {
    if (!filePath.includes("まとめテスト")) {
      sliceChapter.forEach((chapter) => {
        try {
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
            const isCorrect = choiceSplit[1].includes("x");
            const quizChoiceText = choiceSplit[2];
            quizChoices.push(quizChoiceText, isCorrect);
          });
          if (textType === "s") {
            csv.push([quizBody, commentary, ...quizChoices]);
          } else {
            csv.push([
              title,
              desc,
              exp,
              body,
              quizBody,
              commentary,
              ...quizChoices,
            ]);
          }
        } catch {
          isError = true;
          console.log("エラー箇所");
          console.log("--------------------------------------------");
          console.log(chapter);
        }
      });
    }
  }
});

if (!isError) {
  if (textType === "s") {
    const arr = shuffle(csv);
    arr.unshift([
      "クイズ内容",
      "クイズ解説",
      "選択肢1",
      "正解かどうか",
      "選択肢2",
      "正解かどうか",
      "選択肢3",
      "正解かどうか",
      "選択肢4",
      "正解かどうか",
    ]);
    exportCSV(arr, csvFileName);
  } else {
    const arr = shuffle(csv);
    arr.unshift([
      "タイトル",
      "概要",
      "経験値",
      "本文",
      "クイズ内容",
      "クイズ解説",
      "選択肢1",
      "正解かどうか",
      "選択肢2",
      "正解かどうか",
      "選択肢3",
      "正解かどうか",
      "選択肢4",
      "正解かどうか",
    ]);
    exportCSV(arr, csvFileName);
  }
}
