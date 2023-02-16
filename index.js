import express from 'express';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: 'amajeetdev72@gmail.com',
  from: 'amarjeet@baruzotech.com', // Use the email address or domain you verified above
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
app.post('/mail', async (req, res) => {
  sgMail
    .send(msg)
    .then((response) => {
      console.log('email sent');
    })
    .catch((error) => {
      console.log('error===>>', error);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app is runnning on PORT ${PORT}`);
});
