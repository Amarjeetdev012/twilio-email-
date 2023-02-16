import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.post('/email', async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'trever7@ethereal.email',
          pass: 'Mf7dk9asZhw7wpZPdY'
      }
  });

    transporter.verify(function (error, success) {
      if (error) {
        console.log('error in verify smtp', error);
      } else {
        console.log('Server is ready to take our messages');
      }
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: 'sarbhadi@gmail.com, ravi@baruzotech.com',
      subject: 'Hello ✔ test ',
      text: 'Hello world?',
      html: '<b>Hello world?</b>',
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return res
      .status(201)
      .send({ status: true, message: 'email sent', data: info.messageId });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app is runnning on PORT ${PORT}`);
});
