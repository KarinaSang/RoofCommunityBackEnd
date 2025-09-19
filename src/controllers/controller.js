const QRCode = require('qrcode');
const nodemailer = require('nodemailer');

exports.generateQR = async (req, res) => {
    const { firstName, lastName, id } = req.body;

    // Generate QR code
    const qrData = JSON.stringify({ firstName, lastName, id });
    console.log(qrData);
    QRCode.toDataURL(qrData, (err, url) => {
        if (err) {
            console.error('Error generating QR code:', err);
            res.status(500).send('Failed to generate QR code');
        } else {
            res.json({ qrCodeUrl: url });
        }
    });
};

exports.sendEmailWithGmail = async (req, res) => {
    const { to_name, to_email, qr_code_base64, html_content, attachments } = req.body;

    let htmlBody = html_content;
    let mailAttachments = [];

    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
        mailAttachments = attachments
            .filter(att => att && att.content && typeof att.content === 'string' && att.content.length > 0)
            .map((att) => ({
                filename: att.filename,
                content: Buffer.from(att.content, 'base64'),
                contentType: att.contentType || 'image/png',
                cid: att.cid,
                encoding: att.encoding || undefined
            }));
    } else if (qr_code_base64) {
        // fallback to single QR code
        if (typeof qr_code_base64 === 'string' && qr_code_base64.length > 0) {
            mailAttachments = [
                {
                    filename: 'qrcode.png',
                    content: Buffer.from(qr_code_base64, 'base64'),
                    contentType: 'image/png',
                    cid: 'qrcode'
                }
            ];
            if (!htmlBody) {
                htmlBody = `<p>Hello ${to_name},</p><p>Your ticket QR code is below:</p><img src='cid:qrcode' alt='QR Code' /><p>Hope you have fun!</p>`;
            }
        }
    }

    // Only send if there is at least one valid attachment
    if (!mailAttachments || mailAttachments.length === 0) {
        return res.status(400).json({ success: false, error: 'No valid QR code attachments to send.' });
    }

    // Configure nodemailer with Gmail SMTP and App Password
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });

    const mailOptions = {
        from: 'Roof Community <roofcommunityca@gmail.com>',
        to: to_email,
        subject: 'Your Roof Event Ticket',
        html: htmlBody,
        attachments: mailAttachments
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Email sent', info });
    } catch (error) {
        console.error('Failed to send email with Gmail SMTP:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};
