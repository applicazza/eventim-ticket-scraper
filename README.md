# Eventim Ticket Scraper

## Clone

```shell
git clone git@github.com:applicazza/eventim-ticket-scraper.git
```

## Setup

Create `.env` file

```dotenv
EVENTIM_URL=https://www.eventim.de/noapp/en/event/rammstein-europe-stadium-tour-2023-olympiastadion-berlin-15787872/?affiliate=OSS
SENDGRID_FROM=john@doe.com
SENDGRID_TO=jane@doe.com,jack@doe.com
SENDGRID_API_KEY=*******
```

### Run Docker

```shell
docker compose up
```
