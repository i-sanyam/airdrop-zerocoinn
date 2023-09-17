'use strict';

const resetFieldsSetByApi = () => {
	setTextContent('responseMessageText', '');
	setTextContent('signatureUrl', '');
	setTextContent('signatureText', '');
};

const handleSubmit = async (event) => {
	event.preventDefault();
	const form = document.getElementById('myForm');
	const formData = new FormData(form);
	const destinationAddress = formData.get('destination_address');
	const amount = formData.get('amount');
	resetFieldsSetByApi();
	try {
		showLoader();
		const response = await axios.get('/.netlify/functions/api/airdrop/ZEROCOINN', {
			params: {
				amount,
				destination_address: destinationAddress,
			},
		});
		setUrl('signatureUrl', 'View transaction on Solana Explorer', response.data.txUrl);
		setTextContent('signatureText', `Transaction Successful. Copy Signature for reference: ${response.data.signature}`);
		hideLoader();
	} catch (error) {
		hideLoader();
		setTextContent('responseMessageText', error.response.data.message);
	}
};

const setUrl = (elementId, text, url) => {
	const elem = document.getElementById(elementId);
	elem.textContent = text;
	elem.href = url;
};

const setTextContent = (elementId, text) => {
	const elem = document.getElementById(elementId);
	elem.textContent = text;
};

const handleReset = () => {
	const form = document.getElementById('myForm');
	form.reset();
	resetFieldsSetByApi();
	hideLoader();
};

const showLoader = () => {
	const submitButton = document.getElementById('submitButton');
	const loader = document.getElementById('loader');
	submitButton.disabled = true;
	loader.style.display = 'flex';
};

const hideLoader = () => {
	const submitButton = document.getElementById('submitButton');
	const loader = document.getElementById('loader');
	submitButton.disabled = false;
	loader.style.display = 'none';
};