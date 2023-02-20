import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer';

(async () => {
  const browser = await puppeteer.use(StealthPlugin()).launch({
    headless: true,
    executablePath: executablePath(),
  });

  const page = await browser.newPage();

  if (!process.env.EVENTIM_URL) {
    return;
  }

  await page.goto(process.env.EVENTIM_URL);

  let items = await page.$x(
    '//div[contains(concat(" ", normalize-space(@class), " "), " ticket-type-item ")]'
  );

  for (const item of items) {
    const titleContainer = await item.$('xpath=preceding-sibling::*');
    const priceContainer = await item.$('.ticket-type-price');
    const isUnavailableContainer = await item.$('.ticket-type-unavailable-sec');

    const title = await titleContainer?.evaluate((el) =>
      el.textContent?.trim()
    );
    const price = await priceContainer?.evaluate((el) =>
      el.textContent?.trim()
    );
    const isUnavailable = await isUnavailableContainer?.evaluate((el) =>
      el.textContent?.trim()
    );

    console.log(`${title} -> ${price} -> ${isUnavailable}`);
  }

  await browser.close();
})();
