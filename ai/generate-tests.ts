/**
 * CLI script: generates test cases for a feature using AI
 * Usage: ts-node ai/generate-tests.ts "Login with valid/invalid credentials"
 */
import * as dotenv from 'dotenv';
dotenv.config();

import { generateTestCases } from './ai-helper';

const feature = process.argv[2] || 'Login page with username and password fields';

(async () => {
  console.log(`\n🤖 Generating test cases for: "${feature}"\n`);
  const cases = await generateTestCases(feature);
  console.log(cases);
})();
