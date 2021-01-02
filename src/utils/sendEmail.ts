import nodemailer from 'nodemailer';

export async function sendEmail(email: string, url: string) {
	const testAccount = await nodemailer.createTestAccount();

	let transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		secure: false,
		auth: {
			user: testAccount.user,
			pass: testAccount.pass
		}
	});

	let info = await transporter.sendMail({
		from: '"Fred Foo 👻" <foo@example.com>',
		to: email,
		subject: 'Account Details ✔',
		html: `<a href="${url}">${url}</a>`
	});

	console.log(`Message sent: ${info.messageId}`);
	console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
}
