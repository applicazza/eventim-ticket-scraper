import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer';
import mailer from '@sendgrid/mail';
import { cleanEnv, str } from 'envalid';
import { Logger } from 'tslog';

const env = cleanEnv(process.env, {
  EVENTIM_URL: str(),
  SENDGRID_API_KEY: str(),
  SENDGRID_FROM: str(),
  SENDGRID_TO: str(),
});

const logger = new Logger();

mailer.setApiKey(env.SENDGRID_API_KEY);

(async () => {
  logger.info('Starting puppeteer');

  const browser = await puppeteer.use(StealthPlugin()).launch({
    headless: true,
    executablePath: executablePath(),
  });

  const page = await browser.newPage();

  logger.info(`Opening ${env.EVENTIM_URL}`);
  await page.goto(env.EVENTIM_URL);

  let fastBookingFirstElement = await page.$(
    'xpath=//div[contains(concat(" ", normalize-space(@class), " "), " pc-list-detail-fastbooking ")][1]'
  );

  if (fastBookingFirstElement) {
    logger.info('Sending an email');

    await mailer.send({
      to: env.SENDGRID_TO.split(','),
      from: env.SENDGRID_FROM,
      subject: 'Tickets for sale detected',
      text: `There are tickets to grab! Go to ${env.EVENTIM_URL}`,
      html: `There are tickets to grab! <a href="${env.EVENTIM_URL}">Eventim</a>`,
    });
  } else {
    logger.info('Will try our luck later....');
  }

  logger.info('Closing puppeteer');

  await browser.close();
})();
