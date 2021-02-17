var fs = require("fs");
var formatCSV = "";

let text = fs.readFileSync("test.md", 'utf-8');

//*   ["タイトル", "本文", "クイズ内容", "クイズ解説", "選択肢1", "正解かどうか", "選択肢2", "正解かどうか", "選択肢3", "正解かどうか", "選択肢4", "正解かどうか"]

const sliceChapter = text.split("---").map((t, i) => {
  if (i > 0) {
    return [t.slice(1,-1)]
  }
  return [t.slice(0,-1)]
});

const sliceQuiz = sliceChapter.map(chapter =>  {
  // タイトルを取得
  const title = chapter[0].match(/#{2} .+/)[0].replace("## ", "")
  // bodyを取得
  const body = chapter[0].replace(/(#{2} .+)/, "").split(/(#{3} 問題)/)[0].replace(/^\s+|\s+$/g, '');
  // 問題文を取得
  const quizBody = chapter[0].replace(/(#{2} .+)/, "").split(/(#{3} 問題)/)[2].split('- [')[0].replace(/^\s+|\s+$/g, '');
  // 解説を取得
  const commentary = chapter[0].replace(/(#{2} .+)/, "").split(/(#{3} 解説)/)[2].replace(/^\s+|\s+$/g, '');
  // 選択肢を配列で取得
  const quizChoices = []
  chapter[0].match(/(- \[( |x)\] .+\n)/g).forEach(choice => {
    const choiceSplit = choice.replace('\n', '').split(/(- \[ ?x?\])/) // !! 配列の先頭に空文字が入っちゃう
    isCorrect = choiceSplit[1].includes('x')
    quizChoiceText = choiceSplit[2]
    quizChoices.push(quizChoiceText, isCorrect)
  })

  return [title, body, quizBody, commentary, ...quizChoices]
})

// console.log(sliceQuiz)

exportCSV(sliceQuiz);

// 配列をcsvで保存する関数
function exportCSV(content) {
  for (var i = 0; i < content.length; i++) {
    var value = content[i];

    for (var j = 0; j < value.length; j++) {
      var innerValue = value[j] === null ? "" : value[j].toString();
      var result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
      if (j > 0) formatCSV += ",";
      formatCSV += result;
    }
    formatCSV += "\n";
  }
  fs.writeFile("cource.csv", formatCSV, "utf8", function (err) {
    if (err) {
      console.log("保存できませんでした");
    } else {
      console.log("保存できました");
    }
  });
}
