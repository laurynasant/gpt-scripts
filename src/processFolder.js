import fs from "fs";
import path from "path";
import pdf_extract from "pdf-extract";
import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

async function main() {
  const folder = process.env.PDF_FOLDER;
  await fileOrFolder(folder);
  console.log("DONE");
}

async function fileOrFolder(filename) {
  const extension = path.extname(filename);
  if (!extension && path.basename(filename) !== ".DS_Store") {
    const files = fs.readdirSync(filename);
    for (let index = 0; index < files.length; index++) {
      await fileOrFolder(filename + "/" + files[index]);
    }
  }
  if (extension == ".pdf") {
    console.log("pdf: ", filename);
    await scanAndSave(filename);
  }
}

async function scanAndSave(filename) {
  return new Promise((resolve) => {
    const dirName = path.dirname(filename);
    const file = path.basename(filename);
    const options = {
      type: "ocr",
      ocr_flags: ["--psm 1"],
    };
    const processor = pdf_extract(filename, options, () => console.log(`reading ${filename}`));
    processor.on("complete", (data) => {
      const stream = fs.createWriteStream(`${dirName}/${file}-original.txt`, { flags: "a" });
      data.text_pages.forEach((page, index) => {
        stream.write(`\nPage: ${index}\n\n` + page + "\n");
      });
      stream.end();
      console.log("extracted text ", filename);
      resolve("finished");
    });
    processor.on("page", (data) => {
      console.log(`reading page ${data.index + 1} of ${data.num_pages}`);
      summarize(filename, data.text, data.index + 1);
    });
  });
}

async function summarize(filename, data, page) {
  console.log("summarizing ", filename);
  const dirName = path.dirname(filename);
  const file = path.basename(filename);
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You will be provided with a mixed English and French language text, and your task is to summarize it into English.",
        },
        {
          role: "user",
          content: data,
        },
      ],
    });
    const content = response.choices[0].message.content || "";
    fs.writeFile(`${dirName}/${file}-${page}-summary.txt`, content, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    console.log("summarized ", filename);
  } catch (error) {
    console.log(error);
  }
}

main();
