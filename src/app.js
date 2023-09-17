'use strict';

const handleSubmit = async (event) => {
	event.preventDefault();
	const form = document.getElementById('myForm');
	const formData = new FormData(form);
	const destinationAddress = formData.get('destination_address');
	const amount = formData.get('amount');
	hideElementById('signatureUrl');
	hideElementById('signatureText');
	hideElementById('successMessage');
	hideElementById('errorMessage');
	try {
		showLoader();
		const response = await axios.get('/api/airdrop/ZEROCOINN', {
			params: {
				amount,
				destination_address: destinationAddress,
			},
		});
		setDisplayFlex('successMessage');
		setTextContent('successMessageText', 'Airdrop successful');
		hideElementById('errorMessage');
		setInnerHtml('signatureUrl', `<a href="${response.data.txUrl}" target="_blank">View transaction on Solana Explorer</a>`);
		setTextContent('signatureText', `Signature: ${response.data.signature}`);
		hideLoader();
	} catch (error) {
		hideLoader();
		setDisplayFlex('errorMessage');
		setTextContent('errorMessageText', error.response.data.message);
		hideElementById('signatureUrl');
		hideElementById('signatureText');
		hideElementById('successMessage');
	}
};

const setTextContent = (elementId, text) => {
	const elem = document.getElementById(elementId);
	signatureText.style.display = 'flex';
	elem.textContent = text;
};

const setDisplayFlex = (elementId) => {
	const elem = document.getElementById(elementId);
	elem.style.display = 'flex';
};

const setInnerHtml = (elementId, html) => {
	const elem = document.getElementById(elementId);
	elem.style.display = 'flex';
	elem.innerHTML = html;
};

const handleReset = () => {
	const form = document.getElementById('myForm');
	form.reset();
	hideElementById('signatureUrl');
	hideElementById('successMessage');
	hideElementById('errorMessage');
	hideElementById('signatureText');
	hideLoader();
};

const hideElementById = (elementId) => {
	const elem = document.getElementById(elementId);
	elem.style.display = 'none';
};

const handleCloseError = () => {
	hideElementById('errorMessage');
};

const handleCloseSuccess = () => {
	hideElementById('successMessage');
};

const loader = document.getElementById('loader');
const submitButton = document.getElementById('submitButton');

const showLoader = () => {
	submitButton.disabled = true;
	loader.style.display = 'flex';
};

const hideLoader = () => {
	submitButton.disabled = false;
	loader.style.display = 'none';
};