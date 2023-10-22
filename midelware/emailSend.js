const { createTransport } = require("nodemailer");

const emailSend = async (title, body, reciver) => {
    // const otpCode4digit = Math.floor(1000 + Math.random() * 9000);

    const transporter = await createTransport({
        service: 'gmail',
        auth: {
            user: 'md802827@gmail.com',
            pass: 'rccs nznh soyh xyrn'
        }
    });

    const mailOptions = await {
        from: 'md802827@gmail.com',
        to: reciver,
        subject: title,
        html: body
    };

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('message not sent');
        }
        else {
            return console.log('Email sent: ' + info?.response);
        }
    });

};


module.exports = { emailSend };