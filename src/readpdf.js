import pdf_extract from "pdf-extract";
import fs from "fs";

const filename = "scan.pdf";

const options = {
  type: "ocr", // perform ocr to get the text within the scanned image
  ocr_flags: ["--psm 1"], // automatically detect page orientation
};
const processor = pdf_extract(`data/${filename}`, options, () => console.log("Starting…"));
processor.on("complete", (data) => saveText(data));
processor.on("page", (data) => callback(null, data));
processor.on("error", callback);
function callback(error, data) {
  error ? console.error(error) : console.log(data);
}
function saveText(data) {
  const stream = fs.createWriteStream(`output/${filename}.txt`, { flags: "a" });
  data.text_pages.forEach((page, index) => {
    stream.write(`\nPage: ${index}\n\n` + page + "\n");
  });
  stream.end();
}
