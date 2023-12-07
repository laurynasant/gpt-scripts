import fs from "fs";
import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

const filename = "sample.jpg";

function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return Buffer.from(bitmap).toString("base64");
}

async function main() {
  const url = `data:image/jpeg;base64,${base64_encode(`data/${filename}`)}`;
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Read the French text in the image and provide summary in English" },
          {
            type: "image_url",
            image_url: {
              url,
              detail: "high",
            },
          },
        ],
      },
    ],
    max_tokens: 3000,
  });
  const content = response.choices[0].message.content || "";
  console.log(JSON.stringify(response.choices));
  fs.writeFile(`output/${filename}.txt`, content, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}
main();
