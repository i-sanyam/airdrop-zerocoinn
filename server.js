const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // limit each IP to 25 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});

const { sendTokens } = require('./sol-helper');

const app = express();

app.use(limiter);

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

app.use(express.static(path.join(__dirname, 'src')));

app.get('/api/airdrop/ZEROCOINN', async (req, res) => {
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

app.listen(3000, () => {
  console.log('Server started on port 3000');
});