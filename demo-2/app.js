import { GoogleGenAI, Type } from '@google/genai';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const ai = new GoogleGenAI({});

const colors = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

const model = 'gemini-2.5-flash-lite';

// Function declaration
const functionDeclarations = [
  {
    name: 'getWeather',
    description: 'Get current weather information for a specified location',
    parameters: {
      type: Type.OBJECT,
      properties: {
        location: {
          type: Type.STRING,
          description: 'The city name (e.g., "Singapore", "New York")',
        },
      },
      required: ['location'],
    },
  },
];

// Function implementation
async function getWeather({ location }) {
  // Simulated weather data
  const weatherData = {
    Singapore: { temperature: 32, condition: 'Partly Cloudy', humidity: 75 },
    'New York': { temperature: 18, condition: 'Sunny', humidity: 45 },
    London: { temperature: 12, condition: 'Rainy', humidity: 80 },
    Tokyo: { temperature: 22, condition: 'Clear', humidity: 60 },
  };

  const weather = weatherData[location] || {
    temperature: 25,
    condition: 'Sunny',
    humidity: 50,
  };

  return {
    location,
    ...weather,
  };
}

const availableFunctions = {
  getWeather,
};

async function getUserConfirmation(rl, functionName, args) {
  console.log(`\n${colors.yellow}🔨Function call requested:${colors.reset}`);
  console.log(`Function: ${functionName}`);
  console.log(`Arguments:`, JSON.stringify(args, null, 2));

  const answer = await rl.question(
    `${colors.yellow}Execute this function? (yes/no): ${colors.reset}`,
  );

  return answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y';
}

async function main() {
  const rl = createInterface({ input, output });

  const contents = [];

  const config = {
    tools: [
      {
        functionDeclarations: functionDeclarations,
      },
    ],
    thinkingConfig: {
      thinkingBudget: 0,
    },
  };

  process.on('SIGINT', () => {
    console.log(`\n${colors.yellow}Goodbye!${colors.reset}`);
    rl.close();
    process.exit(0);
  });

  console.log(
    `${colors.yellow}Weather Chatbot ready. Type 'exit' or 'quit' to end.${colors.reset}\n`,
  );

  while (true) {
    try {
      const userMessage = await rl.question(`${colors.cyan}👤 You: ${colors.reset}`);

      if (userMessage.toLowerCase() === 'exit' || userMessage.toLowerCase() === 'quit') {
        console.log(`${colors.yellow}Goodbye!${colors.reset}`);
        rl.close();
        break;
      }

      contents.push({
        role: 'user',
        parts: [{ text: userMessage }],
      });

      const response = await ai.models.generateContent({
        model,
        contents: contents,
        config: config,
      });

      let currentResponse = response;

      while (currentResponse.functionCalls && currentResponse.functionCalls.length > 0) {
        const functionCall = currentResponse.functionCalls[0];

        const confirmed = await getUserConfirmation(rl, functionCall.name, functionCall.args);

        if (confirmed) {
          console.log(`\n${colors.green}✓ Executing ${functionCall.name}...${colors.reset}\n`);

          const functionToCall = availableFunctions[functionCall.name];
          const functionResult = await functionToCall(functionCall.args);

          contents.push(currentResponse.candidates[0].content);

          contents.push({
            role: 'user',
            parts: [
              {
                functionResponse: {
                  name: functionCall.name,
                  response: functionResult,
                },
              },
            ],
          });

          console.log(`${colors.cyan}=== Weather Information ===${colors.reset}\n`);
          console.log(`Location: ${colors.yellow}${functionResult.location}${colors.reset}`);
          console.log(`Temperature: ${functionResult.temperature}°C`);
          console.log(`Condition: ${functionResult.condition}`);
          console.log(`Humidity: ${functionResult.humidity}%\n`);

          const followUp = await ai.models.generateContent({
            model,
            contents: contents,
            config: config,
          });

          currentResponse = followUp;
        } else {
          console.log(`\n${colors.yellow}✗ Function execution cancelled.${colors.reset}\n`);

          contents.push(currentResponse.candidates[0].content);

          contents.push({
            role: 'user',
            parts: [{ text: 'The user declined to execute the function.' }],
          });

          const cancelResponse = await ai.models.generateContent({
            model,
            contents: contents,
            config: config,
          });

          currentResponse = cancelResponse;
          break;
        }
      }

      const finalText =
        currentResponse.text || currentResponse.candidates?.[0]?.content?.parts?.[0]?.text;

      if (finalText) {
        console.log(`${colors.green}🤖 Assistant:${colors.reset}`, finalText, '\n');
      }

      if (currentResponse.candidates?.[0]?.content) {
        contents.push(currentResponse.candidates[0].content);
      }
    } catch (error) {
      if (error.code === 'ABORT_ERR') {
        break;
      }
      throw error;
    }
  }
}

await main();
