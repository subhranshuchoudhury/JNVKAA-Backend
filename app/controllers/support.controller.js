const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: `${process.env.BREVO_SMTP_HOST}`,
        pass: `${process.env.BREVO_SMTP_KEY}`,
    },
});


exports.sendSupportMail = async (req, res) => {
    try {

        const { name, email: receiver, subject, message } = req.body;

        if (!name || !receiver || !subject || !message) {
            return res.status(400).send({ message: "Invalid request" });
        }

        const info = await transporter.sendMail({
            from: "'JNVKALUMNI SUPPORT <jnvkaaproject@gmail.com>'", // sender address
            to: "jnvkpara@gmail.com", // change this to receive email
            subject: subject, // Subject line
            text: `${name} ${subject}`, // plain text body
            html: `Name: <b>${name}</b><br>Email: <b>${receiver}</b><br><br><br>Concern: <b>${message}</b>`, // html body
        });

        console.log("Message sent: %s", info.messageId);

        return res.status(200).send({ message: "Mail sent successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server failure" });
    }
}