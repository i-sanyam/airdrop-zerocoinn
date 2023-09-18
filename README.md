## Welcome to Zerocoinn Airdrop

ZEROCOINN is a limited supply SPL-Token created on the devnet.
Zerocoinn Airdrop let's you airdrop ZEROCOINNs to your devnet wallet.

The mint address is `GijCusAW92EKtbekznkTeF4sQn9S9pwzWbBjpxjLmzFB`.

Currently only one token is supported but airdropping multiple tokens are supported and their configurations just need to be added in `sol-helper/config.js`

## Deploy on Netlify

```bash
$ npm install
$ npm run compile-css
$ npm run deploy
```

It is recommended to keep tailwind script tag commented in `src/index.html`.

## Setup on Local

```bash
$ npm install
$ netlify-dev
```

This project uses [Tailwind CSS](https://tailwindcss.com/). 
Make sure to uncomment tailwind script tag and comment tailwind output stylesheet tag in `src/index.html` before starting.

I have just not kept the `src/output.css` in `.gitignore` for a very quick setup without any changes.

## Walkthrough

### Frontend
The repository is hosted at [Netlfiy](https://netlify.com). The `src` directory is published which contains the `index.html` which renders the Airdrop Form at opening the base URL. The same can be found in `netlify.toml`.

### Backend
The backend is built using [Express](https://expressjs.com/).

Netlify hosts NodeJS applications on [AWS Lambda](https://aws.amazon.com/lambda/). So this project creates and exports serverless functions, and are defined in `functions` directory.

It is very similar to normal express applications, the only difference being just that the express server is exported as a function, rather than listening on the express server on some port.

More about [Netlfiy Functions](https://docs.netlify.com/functions/overview/).