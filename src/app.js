'use strict';

const handleSubmit = async (event) => {
	event.preventDefault();
	const form = document.getElementById('myForm');
	const formData = new FormData(form);
	const destinationAddress = formData.get('destination_address');
	const amount = formData.get('amount');
	try {
		const response = await axios.get('/api/airdrop/ZEROCOINN', {
			params: {
				amount,
				destination_address: destinationAddress,
			},
		});
		setDisplayFlex('successMessage');
		setTextContent('successMessageText', 'Transaction successful');
		hideElementById('errorMessage');
		setInnerHtml('signatureUrl', `<a href="${response.data.txUrl}" target="_blank">View transaction on Solana Explorer</a>`);
		setTextContent('signatureText', `Signature: ${response.data.signature}`)
	} catch (error) {
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