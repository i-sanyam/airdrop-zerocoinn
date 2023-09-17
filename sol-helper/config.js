'use strict';

require('dotenv').config();

module.exports = {
	TOKEN_INFO: {
		ZEROCOINN: {
			numberDecimals: 9,
			isMintDisabled: true,
			RPC: 'https://api.devnet.solana.com',
			CLUSTER: 'devnet',
			SECRET_KEY: JSON.parse(process.env.SECRET_KEY_ZEROCOINN),
			MINT_ADDRESS: 'GijCusAW92EKtbekznkTeF4sQn9S9pwzWbBjpxjLmzFB',
			SYMBOL: 'ZEROCOINN',
		},
	},
};