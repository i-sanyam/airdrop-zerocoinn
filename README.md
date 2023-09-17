Welcome to Zerocoinn Airdrop

ZEROCOINN is a limited supply SPL-Token created on the devnet.
Zerocoinn Airdrop let's you airdrop ZEROCOINNs to your devnet wallet.

The mint address is `GijCusAW92EKtbekznkTeF4sQn9S9pwzWbBjpxjLmzFB`.

Currently only one token is supported but airdropping multiple tokens are supported and their configurations just need to be added in `sol-helper/config.js`


## Setup on Local

This project uses [Tailwind CSS](https://tailwindcss.com/) 
Make sure to uncomment tailwind script tag and comment tailwind output stylesheet tag in `src/index.html` before starting.

```bash
$ npm install
$ netlify-dev
```

For production builds make sure to keep Tailwind Script tag commented in `src/index.html` and use the tailwind generated css file.

```bash
$ npm install
$ npm run compile-css
$ npm run deploy
```

I have just not kept the `src/output.css` in `.gitignore` for a very quick setup without any changes.

## Express Server
The express server is so written to support serverless deploys at Netlify. The express server does not listen at any port and is run by
```bash
$ netlify dev
```