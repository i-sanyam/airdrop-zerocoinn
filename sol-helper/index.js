const {
	getOrCreateAssociatedTokenAccount,
	createTransferInstruction,
} = require('@solana/spl-token');

const {
	Connection,
	Keypair,
	PublicKey,
	sendAndConfirmTransaction,
	Transaction,
} = require('@solana/web3.js');

const { TOKEN_INFO, } = require('./config');

const getTokenInfo = async (tokenSymbol) => {
	if (!TOKEN_INFO[tokenSymbol]) {
		throw new Error('Token not supported');
	}
	const tokenConfig = TOKEN_INFO[tokenSymbol];
	return tokenConfig;
	// const info = await connection.getParsedAccountInfo(mintAddressPublicKey);
	// const numberDecimals = (info.value?.data).parsed.info.decimals;
	// const isMintDisabled = (info.value?.data).parsed.info.mintAddress === null;
	// return { numberDecimals, isMintDisabled, };
};

const validateSolAddress = (address) => {
	try {
		if (!address) {
			throw new Error('Destination Address cannot be empty');
		}
		const pubkey = new PublicKey(address);
		const isSolana = PublicKey.isOnCurve(pubkey.toBuffer());
		if (isSolana) {
			return pubkey;
		}
		throw new Error('Invalid Destination Address');
	} catch (error) {
		error.reason = 'Invalid Destination Address';
		throw error;
	}
};

const validateTransferAmount = (unsanitizedAmount, isMintDisabled) => {
	try {
		if (isNaN(unsanitizedAmount)) {
			throw new Error('Transfer Amount is not a number');
		}
		const amount = Number(unsanitizedAmount);
		if (isMintDisabled && amount > 0.01) {
			throw new Error('Mint is disabled, max transfer amount is 0.01');
		}
		if (amount <= 0) {
			throw new Error('Transfer Amount must be greater than 0');
		}
		return amount;
	} catch (e) {
		e.reason = 'Invalid Transfer Amount';
		throw e;
	}
};

const CONNECTION_CACHE = {};

const createConnection = async (rpcUrl) => {
	if (CONNECTION_CACHE[rpcUrl]) {
		return CONNECTION_CACHE[rpcUrl];
	}
	const connection = new Connection(rpcUrl);
	CONNECTION_CACHE[rpcUrl] = connection;
	return connection;
};

async function sendTokens(tokenSymbol, destinationWalletPublicKeyString, unsanitizedTransferAmount) {
	try {
		const desinationPublicKey = validateSolAddress(destinationWalletPublicKeyString);
		const {
			RPC: tokenRpcUrl, 
			SECRET_KEY: authoritySecretKey, 
			MINT_ADDRESS: tokenMintPublicAddress,
			CLUSTER: tokenCluster,
			isMintDisabled, numberDecimals,
		} = await getTokenInfo(tokenSymbol);
		const transferAmount = validateTransferAmount(unsanitizedTransferAmount, isMintDisabled);
		const mintAddressPublicKey = validateSolAddress(tokenMintPublicAddress);
		const solanaConnection = await createConnection(tokenRpcUrl);
		const tokenAuthorityKeyPair = Keypair.fromSecretKey(new Uint8Array(authoritySecretKey));

		// console.log(`Sending ${transferAmount} ${mintAddressPublicKey} from ${(tokenAuthorityKeyPair.publicKey.toString())} to ${(destinationWalletPublicKeyString)}.`)
		// Step 1
		// console.log(`1 - Getting Source Token Account`);
		const sourceAccount = await getOrCreateAssociatedTokenAccount(solanaConnection, tokenAuthorityKeyPair, mintAddressPublicKey, tokenAuthorityKeyPair.publicKey);
		// console.log(`Source Account: ${sourceAccount.address.toString()}`);

		// Step 2
		// console.log(`2 - Getting Destination Token Account`);
		const destinationAccount = await getOrCreateAssociatedTokenAccount(solanaConnection, tokenAuthorityKeyPair, mintAddressPublicKey, desinationPublicKey);
		// console.log(`Destination Account: ${destinationAccount.address.toString()}`);

		//Step 3
		// console.log(`3 - Creating and Sending Transaction`);
		const tx = new Transaction();
		tx.add(createTransferInstruction(
			sourceAccount.address,
			destinationAccount.address,
			tokenAuthorityKeyPair.publicKey,
			transferAmount * Math.pow(10, numberDecimals) // lamports
		));

		const latestBlockHash = await solanaConnection.getLatestBlockhash('confirmed');
		tx.recentBlockhash = latestBlockHash.blockhash;
		const signature = await sendAndConfirmTransaction(solanaConnection, tx, [tokenAuthorityKeyPair]);
		const txUrl = `https://explorer.solana.com/tx/${signature}?cluster=${tokenCluster}`
		return { signature, txUrl, };
	} catch (error) {
		// console.error('Transaction failed', error && error.message);
		throw error;
	}
};

module.exports = {
	sendTokens,
};