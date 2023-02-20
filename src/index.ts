import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer';
import mailer from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  process.exit(1);
}

mailer.setApiKey(process.env.SENDGRID_API_KEY);

(async () => {
  const browser = await puppeteer.use(StealthPlugin()).launch({
    headless: true,
    executablePath: executablePath(),
  });

  const page = await browser.newPage();

  if (!process.env.EVENTIM_URL) {
    process.exit(1);
  }

  await page.goto(process.env.EVENTIM_URL);

  let fastBookingFirstElement = await page.$(
    'xpath=//div[contains(concat(" ", normalize-space(@class), " "), " pc-list-detail-fastbooking ")][1]'
  );

  if (fastBookingFirstElement) {
    if (!process.env.SENDGRID_FROM || !process.env.SENDGRID_TO) {
      process.exit(1);
    }

    await mailer.send({
      to: process.env.SENDGRID_TO.split(','),
      from: process.env.SENDGRID_FROM,
      subject: 'Tickets for sale detected',
      text: `There are tickets to grab! Go to ${process.env.EVENTIM_URL}`,
      html: `There are tickets to grab! <a href="${process.env.EVENTIM_URL}">Eventim</a>`,
    });
  }

  await browser.close();
})();
