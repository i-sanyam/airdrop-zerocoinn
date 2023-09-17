const express = require('express');
const { Router, } = require('express');
const serverless = require('serverless-http');

const rateLimit = require('express-rate-limit');

const router = Router();

const limiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});

const { sendTokens } = require('../sol-helper');

const app = express();

app.use(limiter);

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

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

app.use(errorHandler);

app.use('/api/', router);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);