import { GoogleGenAI } from '@google/genai';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const ai = new GoogleGenAI({});

const colors = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

async function main() {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash-lite',
    history: [],
  });

  const rl = createInterface({ input, output });

  process.on('SIGINT', () => {
    console.log(`\n${colors.yellow}Goodbye!${colors.reset}`);
    rl.close();
    process.exit(0);
  });

  console.log(`${colors.yellow}Chatbot ready. Type 'exit' or 'quit' to end.${colors.reset}\n`);

  while (true) {
    try {
      const userMessage = await rl.question(`${colors.cyan}👤 You: ${colors.reset}`);

      if (userMessage.toLowerCase() === 'exit' || userMessage.toLowerCase() === 'quit') {
        console.log(`${colors.yellow}Goodbye!${colors.reset}`);
        rl.close();
        break;
      }

      const response = await chat.sendMessage({ message: userMessage });
      console.log(`${colors.green}🤖 Assistant:${colors.reset}`, response.text, '\n');
    } catch (error) {
      if (error.code === 'ABORT_ERR') {
        break;
      }
      throw error;
    }
  }
}

await main();
