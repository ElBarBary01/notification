import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import sgMail from '@sendgrid/mail';
import { Template } from 'ejs';
import template from './template.js'
dotenv.config();
const PORT = process.env.PORT || 5005;
const app = express();
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))

app.get('/test', (req, res) => res.send('product route testing!'));

app.post("/api/notification", (req, res) => {

  try{
  const { name,email,orderID,price,address,product} = req.body;

  const from = "hey.baraa@gmail.com";
  const to = email;

  const subject = "Order accepted";

  const output =template(name,orderID,price,address,product);

  sendEmail(to, from, subject, output);
  res.status(200).json(output);
    }catch (e) {
    res.status(400).json({message: e.message});
}
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (to, from, subject, text) => {
  const msg = {
    to,
    from,
    subject,
    html: text,
  };

  sgMail.send(msg, function (err, result) {
    if (err) {
      console.log("Email Not Sent Error Occured");
    } else {
      console.log("Email was Sent");
    }
  });
};
