const extractCharacters = (strs) => {
  // タイトル
  const title = strs.match(/^## .+/g)[0].replace("## ", "");
  // 概要
  const desc = strs
    .match(/#{3} ?概要\r?\n([\s\S]+?)\r?\n#{3}/g)[0]
    .replace(/#{3} ?(.+)?/g, "")
    .replace(/^\s+|\s+$/g, "");

  // 経験値
  const exp = strs
    .match(/#{3} ?経験値\r?\n([\s\S]+?)\r?\n#{3}/g)[0]
    .replace(/#{3} ?(.+)?/g, "")
    .replace(/^\s+|\s+$/g, "");
  const body = strs
    .match(/#{3} ?本文\r?\n([\s\S]+?)\r?\n#{3} ?問題/g)[0]
    .replace(/#{3} ?(.+)?/g, "")
    .replace(/^\s+|\s+$/g, "");
  // 問題文
  const quizBody = strs
    .match(/#{3} 問題\r?\n([\s\S]+?)\r?\n- \[( |x)?\]/)[1]
    .replace(/^\s+|\s+$/g, "");
  // 解説
  const commentary = strs
    .replace(/(#{2} .+)/, "")
    .split(/(#{3} 解説)/)[2]
    .replace(/^\s+|\s+$/g, "");
  // 問題の選択肢
  const quizChoices = [];
  chapter.match(/(- \[( |x)\] .+\n)/g).forEach((choice) => {
    const choiceSplit = choice.replace("\n", "").split(/(- \[ ?x?\])/);
    const isCorrect = choiceSplit[1].includes("x");
    const quizChoiceText = choiceSplit[2];
    quizChoices.push(quizChoiceText, isCorrect);
  });
  return { title, desc, exp, body, quizBody, commentary, quizChoices };
};

exports.extractCharacters = extractCharacters;
