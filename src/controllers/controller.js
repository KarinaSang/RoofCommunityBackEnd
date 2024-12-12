const QRCode = require('qrcode');

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
