const nodemailer = require('nodemailer');

let transporter;

function setupTransporter() {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    } else {
        transporter = null; 
    }
}

setupTransporter();

exports.sendResetEmail = async (email, resetToken) => {
    const resetLink = `http://localhost:3000/reset.html?token=${resetToken}`;

    if (transporter) {
        const mailOptions = {
            from: `"Arpita Dwivedi" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <p>You requested a password reset.</p>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Reset email sent to:', email);
        } catch (error) {
            console.error('Error sending email:', error.message);
            console.error('Error code:', error.code);
            console.error('Full error:', error);
            throw new Error('Failed to send reset email');
        }
    } else {
        console.log('Reset link for', email, ':', resetLink);
    }
};
