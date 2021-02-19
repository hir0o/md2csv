const fs = require("fs");

exportCSV = (contents, csvFileName) => {
  let formatCSV = "";
  contents.forEach((value) => {
    value.forEach((val, i) => {
      let innerValue = val === null ? "" : val.toString();
      let result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
      if (i > 0) formatCSV += ",";
      formatCSV += result;
    });
    formatCSV += "\n";
  });
  fs.writeFile(csvFileName, formatCSV, "utf8", (err) => {
    err ? console.log("保存できませんでした") : console.log("保存できました");
  });
};

exports.exportCSV = exportCSV;
