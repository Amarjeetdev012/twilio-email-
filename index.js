import express from 'express';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
+app.set('view engine', 'ejs');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refershToken = process.env.REFRESH_TOKEN;

const OAuth2 = google.auth.OAuth2;
const OAuth2_client = new OAuth2(clientId, clientSecret);
OAuth2_client.setCredentials({ refresh_token: refershToken });

app.get('/', (req, res) => {
  res.render('home');
});
app.post('/sendMail', async (req, res) => {
  try {
    console.log('req===========', req.body.email);
    console.log('req===========', req.body.text);
    let recepeint = req.body.email;
    const accessToken = OAuth2_client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'amarjeet@baruzotech.com',
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refershToken,
        accessToken: accessToken,
      },
    });

    transporter.verify(function (error, success) {
      if (error) {
        console.log('error in verify smtp', error);
      } else {
        console.log('Server is ready to take our messages');
      }
    });

    const info = await transporter.sendMail({
      from: 'amarjeet@baruzotech.com',
      to: recepeint,
      subject: 'Hello ✔ test ',
      text: req.body.text,
      html: `<b> ${req.body.text}</b>`,
    });

    console.log('info==>>>>>', info);
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
