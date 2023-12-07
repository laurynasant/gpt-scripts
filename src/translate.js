import fs from "fs";
import { readFile } from "fs/promises";
import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

const filename = "translatable.txt";

async function main() {
  const input = await readFile(`output/${filename}`, { encoding: "utf8" });
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You will be provided with a mixed English and French language text, and your task is to translate it into English.",
      },
      {
        role: "user",
        content: input,
      },
    ],
  });
  const content = response.choices[0].message.content || "";
  console.log(content);
  fs.writeFile(`translations/${filename}`, content, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}
main();
