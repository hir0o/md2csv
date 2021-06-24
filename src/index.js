#! /usr/bin/env node

const fs = require("fs");
const { listFiles } = require("./lib/listFiles");
const { exportCSV } = require("./lib/exportCSV");
const { shuffle } = require("./lib/shuffle");
const { extractCharacters } = require("./lib/extractCharacters");

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
        const { quizBody, commentary, quizChoices } = extractCharacters(strs);

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
          const { title, desc, exp, body, quizBody, commentary, quizChoices } =
            extractCharacters(chapter);

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
    csv.unshift([
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
    exportCSV(csv, csvFileName);
  }
}
