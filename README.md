## ChatGPT & Tesseract Automation

This repository contains a few scripts that I've been using to automate data processing:

- `processFolder`: This script takes a folder of PDFs, splits them and runs them through Tesseract OCR. It then takes the output and runs it through ChatGPT to generate a summary in English and saves it to a text file.
- `processFile`: Same as above, but for a single PDF file.
- `summarize`: This script takes a text file and runs it through ChatGPT to generate a summary in English and saves it to a text file.
- `transcribe`: This script takes an audio file and runs it through GhatGPT Whisper API to generate a transcript in English and saves it to a text file.
- `translate`: This script takes a text file and runs it through ChatGPT API to generate a translation in English and saves it to a text file.

## Usage

In order to run the scripts you need to have a ChatGPT API key. This key should be saved in .env file. The .env.sample example file can be used as a template.

Example command:

`node src/processFolder`
