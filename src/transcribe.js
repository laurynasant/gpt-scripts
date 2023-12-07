import fs from "fs";
import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

const filename = "audio.mp4";

async function main() {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(`data/new/${filename}`),
    model: "whisper-1",
  });
  const content = transcription.text;
  console.log(content);
  fs.writeFile(`output/new/${filename}.txt`, content, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}
main();
