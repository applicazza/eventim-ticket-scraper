import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer';

(async () => {
  const browser = await puppeteer.use(StealthPlugin()).launch({
    headless: true,
    executablePath: executablePath(),
  });

  const page = await browser.newPage();

  await page.goto(
    'https://www.eventim.de/noapp/en/event/rammstein-europe-stadium-tour-2023-olympiastadion-berlin-15787872/?affiliate=OSS'
  );

  let items = await page.$x(
    '//div[contains(concat(" ", normalize-space(@class), " "), " ticket-type-item ")]'
  );

  for (const item of items) {
    const titleContainer = await item.$('xpath=preceding-sibling::*');
    const priceContainer = await item.$('.ticket-type-price');
    const isUnavailableContainer = await item.$('.ticket-type-unavailable-sec');

    const title = await titleContainer?.evaluate((el) => el.textContent);
    const price = await priceContainer?.evaluate((el) => el.textContent);
    const isUnavailable = await isUnavailableContainer?.evaluate(
      (el) => el.textContent
    );

    console.log(
      `${title?.trim()} -> ${price?.trim()} -> ${isUnavailable?.trim()}`
    );
  }

  await browser.close();
})();
