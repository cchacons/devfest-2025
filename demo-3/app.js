import { GoogleGenAI } from '@google/genai';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { functionDeclarations, availableFunctions, getUserConfirmation } from './tools/index.js';

const ai = new GoogleGenAI({});

const colors = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

const model = 'gemini-2.5-flash-lite';

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

  console.log(`${colors.yellow}Chatbot ready. Type 'exit' or 'quit' to end.${colors.reset}\n`);

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
      let bookingComplete = false;

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

          if (functionCall.name === 'searchFlights') {
            console.log(`${colors.cyan}=== Available Flights ===${colors.reset}\n`);

            functionResult.flights.forEach((flight, index) => {
              console.log(`${colors.green}${index + 1}. ${flight.airline}${colors.reset}`);
              console.log(`   Flight ID: ${colors.yellow}${flight.id}${colors.reset}`);
              console.log(`   Class: ${flight.selectedClass}`);
              console.log(
                `   Outbound: ${flight.outbound.departure} → ${flight.outbound.arrival} (${flight.outbound.duration}${flight.outbound.stops > 0 ? ', ' + flight.outbound.stops + ' stop(s)' : ', non-stop'})`,
              );
              console.log(
                `   Return: ${flight.return.departure} → ${flight.return.arrival} (${flight.return.duration}${flight.return.stops > 0 ? ', ' + flight.return.stops + ' stop(s)' : ', non-stop'})`,
              );
              console.log(
                `   Price: $${flight.pricePerPerson} per person | Total: $${flight.totalPrice}`,
              );
              console.log('');
            });

            const userChoice = await rl.question(
              `${colors.cyan}Which flight would you like to book? (enter flight ID or number, or 'none' to cancel): ${colors.reset}`,
            );

            if (userChoice.toLowerCase() === 'none') {
              contents.push({
                role: 'user',
                parts: [{ text: 'I do not want to book any of these flights.' }],
              });
            } else {
              let flightId = userChoice.trim();
              const choiceNum = parseInt(userChoice);

              if (
                !isNaN(choiceNum) &&
                choiceNum >= 1 &&
                choiceNum <= functionResult.flights.length
              ) {
                flightId = functionResult.flights[choiceNum - 1].id;
              }

              contents.push({
                role: 'user',
                parts: [{ text: `I want to book flight ${flightId}` }],
              });
            }

            const followUp = await ai.models.generateContent({
              model,
              contents: contents,
              config: config,
            });

            currentResponse = followUp;
          } else if (functionCall.name === 'bookFlight') {
            console.log(`${colors.green}✓ Booking Confirmed!${colors.reset}\n`);
            console.log(
              `Booking Reference: ${colors.yellow}${functionResult.bookingReference}${colors.reset}`,
            );
            console.log(
              `Passenger: ${functionResult.passenger.name} (${functionResult.passenger.email})`,
            );
            console.log(`Flight: ${functionResult.flight.airline} (${functionResult.flight.id})`);
            console.log(`Class: ${functionResult.flight.class}`);
            console.log(`Total: $${functionResult.totalAmount} ${functionResult.currency}`);
            console.log(`\n${functionResult.message}\n`);

            bookingComplete = true;
            break;
          } else {
            const followUp = await ai.models.generateContent({
              model,
              contents: contents,
              config: config,
            });

            currentResponse = followUp;
          }
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

      if (!bookingComplete) {
        const finalText =
          currentResponse.text || currentResponse.candidates?.[0]?.content?.parts?.[0]?.text;

        if (finalText) {
          console.log(`${colors.green}🤖 Assistant:${colors.reset}`, finalText, '\n');
        }

        if (currentResponse.candidates?.[0]?.content) {
          contents.push(currentResponse.candidates[0].content);
        }
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
