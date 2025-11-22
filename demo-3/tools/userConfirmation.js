export async function getUserConfirmation(rl, functionName, args) {
  const colors = {
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
  };

  console.log(`\n${colors.yellow}⚠️  Function call requested:${colors.reset}`);
  console.log(`${colors.cyan}Function:${colors.reset} ${functionName}`);
  console.log(`${colors.cyan}Arguments:${colors.reset} ${JSON.stringify(args, null, 2)}`);

  const answer = await rl.question(`\n${colors.yellow}Do you want to execute this function? (yes/no): ${colors.reset}`);

  return answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y';
}
