import { Page, BrowserContext, Stagehand } from "@browserbasehq/stagehand";

export async function main(stagehand: Stagehand) {
  const page = stagehand.page;
  await page.goto("https://www.google.com");
  await page.act({
    description: "Google search combobox where text can be entered",
    method: "fill",
    arguments: ["knicks vs celtics game 7 2024 final score"],
    selector:
      "xpath=/html/body[1]/div[1]/div[3]/form[1]/div[1]/div[1]/div[1]/div[1]/div[2]/textarea[1]",
  });
  await page.act({
    description:
      "Search combobox with text 'knicks vs celtics game 7 2024 final score'",
    method: "press",
    arguments: ["Enter"],
    selector:
      "xpath=/html/body[1]/div[1]/div[3]/form[1]/div[1]/div[1]/div[1]/div[1]/div[2]/textarea[1]",
  });
  await page.extract(
    "final score of knicks vs celtics game 7 of the NBA playoffs",
  );
  await page.extract("the final score of the Knicks vs Celtics Game 7");
  await stagehand.close();
}

export async function main1(stagehand: Stagehand) {
  const page = stagehand.page;
  await stagehand.oops();
  await stagehand.oops();
  await stagehand.oops();
  await stagehand.oops();
  await stagehand.oops();
  await stagehand.oops();
  await stagehand.oops();
  await stagehand.oops();
  await stagehand.oops();
  await stagehand.oops();
}

export async function main2(stagehand: Stagehand) {
  const page = stagehand.page;
  await stagehand.oops();
  await stagehand.oops();
  await stagehand.oops();
  await stagehand.oops();
  await stagehand.oops();
  await stagehand.oops();
  await stagehand.oops();
  await stagehand.oops();
  await stagehand.oops();
  await stagehand.oops();
}
