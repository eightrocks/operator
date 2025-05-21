import { Stagehand, Page, BrowserContext } from "@browserbasehq/stagehand";
import StagehandConfig from "./stagehand.config.js";
import chalk from "chalk";
import boxen from "boxen";
import { drawObserveOverlay, clearOverlays, actWithCache, replay } from "./utils.js";
import { z } from "zod";


/**
 * 🤘 Welcome to Stagehand! Thanks so much for trying us out!
 * 🛠️ CONFIGURATION: stagehand.config.ts will help you configure Stagehand
 *
 * 📝 Check out our docs for more fun use cases, like building agents
 * https://docs.stagehand.dev/
 *
 * 💬 If you have any feedback, reach out to us on Slack!
 * https://stagehand.dev/slack
 *
 * 📚 You might also benefit from the docs for Zod, Browserbase, and Playwright:
 * - https://zod.dev/
 * - https://docs.browserbase.com/
 * - https://playwright.dev/docs/intro
 */
async function main_one({
  page,
  context,
  stagehand,
}: {
  page: Page; // Playwright Page with act, extract, and observe methods
  context: BrowserContext; // Playwright BrowserContext
  stagehand: Stagehand; // Stagehand instance
}) {
  // Navigate to a URL
  await page.goto("https://docs.stagehand.dev/reference/introduction");

  // Use act() to take actions on the page
  await page.act("Click the search box");

  // Use observe() to plan an action before doing it
  const [action] = await page.observe(
    "Type 'Tell me in one sentence why I should use Stagehand' into the search box",
  );
  await drawObserveOverlay(page, [action]); // Highlight the search box
  await page.waitForTimeout(1_000);
  await clearOverlays(page); // Remove the highlight before typing
  await page.act(action); // Take the action

  // For more on caching, check out our docs: https://docs.stagehand.dev/examples/caching
  await page.waitForTimeout(1_000);
  await actWithCache(page, "Click the suggestion to use AI");
  await page.waitForTimeout(5_000);

  // Use extract() to extract structured data from the page
  const { text } = await page.extract({
    instruction:
      "extract the text of the AI suggestion from the search results",
    schema: z.object({
      text: z.string(),
    }),
  });
  stagehand.log({
    category: "create-browser-app",
    message: `Got AI Suggestion`,
    auxiliary: {
      text: {
        value: text,
        type: "string",
      },
    },
  });
  stagehand.log({
    category: "create-browser-app",
    message: `Metrics`,
    auxiliary: {
      metrics: {
        value: JSON.stringify(stagehand.metrics),
        type: "object",
      },
    },
  });
}

/**
 * This is the main function that runs when you do npm run start
 *
 * YOU PROBABLY DON'T NEED TO MODIFY ANYTHING BELOW THIS POINT!
 *
 */
async function run() {
  const stagehand = new Stagehand({
    ...StagehandConfig,
  });
  await stagehand.init();

  if (StagehandConfig.env === "BROWSERBASE" && stagehand.browserbaseSessionID) {
    console.log(
      boxen(
        `View this session live in your browser: \n${chalk.blue(
          `https://browserbase.com/sessions/${stagehand.browserbaseSessionID}`,
        )}`,
        {
          title: "Browserbase",
          padding: 1,
          margin: 3,
        },
      ),
    );
  }

  // const page = stagehand.page;
  // const context = stagehand.context;
  // await main({
  //   page,
  //   context,
  //   stagehand,
  // });
  // await stagehand.close();
  // console.log(
  //   `\n🤘 Thanks so much for using Stagehand! Reach out to us on Slack if you have any feedback: ${chalk.blue(
  //     "https://stagehand.dev/slack",
  //   )}\n`,
  // );
  const application_link="https://lowrates.com/"
  await stagehand.page.goto(application_link);

  // Open Operator will use the default LLM from Stagehand config
  const operator = stagehand.agent({
    provider: "anthropic",
    model: "claude-3-7-sonnet-20250219",
    instructions: `Your Personal Information
Full Legal Name: Alex Parker

Date of Birth: March 14, 1993

Phone Number: (646) 555-2948

Email Address: alex.parker@email.com

Social Security Number (SSN): XXX-XX-1234 (shared securely only)

Current Address: 101 Grove Street, Brooklyn, NY 11211

Time at Current Address: 3 years

Residency Status: U.S. Citizen

 Employment & Income Details
Employment Status: Full-time, salaried

Employer Name: Mosaic Software Inc.

Job Title: Senior Product Manager

Time at Current Employer: 4 years

Gross Annual Income: $120,000 USD

Other Monthly Income:

Freelance Consulting: $1,000/month

Investment Dividends: $200/month

Total Monthly Income (Before Taxes): $11,200 USD

 Monthly Expenses & Debts
Rent (if applicable): $0 (looking to buy)

Credit Card Payments: $150/month

Student Loan Payments: $300/month

Auto Loan Payments: $0

Other Recurring Debts: $100/month (subscriptions, insurance, etc.)

Total Monthly Debt Obligations: $550

 Assets & Savings
Checking Account Balance: $12,000

Savings Account Balance: $65,000

401(k) Balance: $40,000 (available for down payment if needed)

Brokerage Account: $15,000

Total Liquid Assets: ~$132,000

Down Payment Available: $80,000

Credit Score: 752 (Experian)

 Property & Loan Details
Target Property Price: $615,000

Property Type: Condo or Townhouse

Location: Brooklyn, NY

Intended Use: Primary Residence

First-Time Home Buyer: Yes

Down Payment: $80,000 (13%)

Loan Amount Requested: ~$535,000

Loan Term: 30 years

Loan Type: Conventional

Rate Preference: 30-Year Fixed

Private Mortgage Insurance (PMI): Yes (required under 20% down)

 Other Details
Co-applicant? No

Bankruptcy or foreclosure history? No

Preferred Contact Method: Phone or Email

Preferred Lender Type: Direct lender or credit union

Pre-approval Needed For: Offer on home within 60 days

Current Homeowner? No`
  });
  const { message, actions } = await operator.execute(
    `
    You are looking to buy a home.
    You are given a mortgage application via link and you need to fill it out.
    `);
  await replay({
    success: true,
    message,
    actions,
    completed: true,
  });
  console.log(message);
  await stagehand.close();
}

run();
