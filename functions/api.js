const express = require('express');
const { Router, } = require('express');
const serverless = require('serverless-http');

const router = Router();

const { sendTokens } = require('../sol-helper');

const app = express();

router.get('/airdrop/ZEROCOINN', async (req, res) => {
  try {
    const { destination_address, amount } = req.query;
    const { signature, txUrl, } = await sendTokens('ZEROCOINN', destination_address, amount);
    return res.status(200).json({
      signature, txUrl,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
      reason: e.reason,
    });
  }
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);