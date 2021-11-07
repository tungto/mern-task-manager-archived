const sgMail = require('@sendgrid/mail');
// require('dotenv').config();

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: 'sifebuh.totung@gmail.com',
		subject: 'Thank for joining in',
		text: `Welcome to the app, ${name}. Let me know how u get along with the app.`,
		// html: ''
	});
};

const sendCancelEmail = (email, name) => {
	sgMail.send({ to: email, from: 'sifebuh.totung@gmail.com', subject: 'Cancel email', text: 'Why are you trying to cancel' });
};

module.exports = {
	sendWelcomeEmail,
	sendCancelEmail,
};
