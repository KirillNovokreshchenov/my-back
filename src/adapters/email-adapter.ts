import nodemailer from "nodemailer";


export const emailAdapter = {
    async sendEmail(emailUser: string, subject: string, htmlMessages: string){
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kirochkaqwerty123@gmail.com',
                pass: 'otzaxohazcnetzvc'
            }
        });

        const mailOptions = {
            from: 'Kirill <kirochkaqwerty123@gmail.com>',
            to: emailUser,
            subject: subject,
            html: htmlMessages

        };

        await transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}