import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
// import fs from 'fs';
// import path from 'path';
// import util from 'util';

// const writeFileAsync = util.promisify(fs.writeFile);
// const mkdirAsync = util.promisify(fs.mkdir);


const openai = new OpenAI({
  baseURL: process.env.BASE_URL!,
  apiKey: process.env.GROQ_API_KEY!,
  
});

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();
  const start = Date.now();
  console.log('messages');
  console.log(messages);
   // Log messages to Vercel KV
  //  await logMessages(messages);

  // Request the OpenAI API for the response based on the prompt
  try {
    const response = await openai.chat.completions.create({
      model: process.env.MODEL!,
      stream: true,
      messages: messages,
      
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream, {
      headers: {
        "X-LLM-Start": `${start}`,
        "X-LLM-Response": `${Date.now()}`,
      },
    });
  } catch (error) {
    console.error("test", error);
  }
}

// async function logMessages(messages: any[]) {
//   const timestamp = Date.now();
//   const logFileName = `chat_log_${timestamp}.json`;
//   const logPath = path.join(process.cwd(), 'logs', logFileName);

//   try {
//     // Ensure the logs directory exists
//     await mkdirAsync(path.join(process.cwd(), 'logs'), { recursive: true });

//     // Write messages to file
//     await writeFileAsync(logPath, JSON.stringify(messages, null, 2));
//     console.log(`Messages logged to file: ${logPath}`);
//   } catch (error) {
//     console.error("Error logging messages:", error);
//   }
// }