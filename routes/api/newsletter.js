const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const util = require('util')

const mailchimp = require('../../services/mailchimp');
const mailgun = require('../../services/mailgun');
// const { sendWelcomeEmail } = require('../../services/email')

const Newsletter = require('../../models/newsletter');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


function generateCouponCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let couponCode = '';
  const codeLength = 6; // You can adjust the length of the coupon code here

  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    couponCode += characters[randomIndex];
  }

  return couponCode;
}

const transporter = nodemailer.createTransport({
  host: 'smtppro.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: 'info@eminencebygtx.com',
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMailAsync = util.promisify(transporter.sendMail).bind(transporter);

async function sendEmail(email, couponCode) {
  const mailOptions = {
    from: '"EminenceByGtx Newsletter" info@eminencebygtx.com',
    to: email,
    subject: 'Welcome to Our Newsletter!',
    text: 'Thank you for subscribing to our newsletter. Here is your special coupon code: ' + couponCode,
  };

  try {
    const info = await sendMailAsync(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

router.post('/subscribe', async (req, res) => {
  try {
    const email = req.body.email;

    if (!email) {
      return res.status(400).json({ error: 'You must enter an email address.' });
    }

    const existingSubscriber = await Newsletter.findOne({ email });

    if (existingSubscriber) {
      return res.status(400).json({ error: 'This email is already subscribed.' });
    }

    const couponCode = generateCouponCode()
    console.log('Generated coupon code:', couponCode)

    const couponExpirationTimestamp = new Date(Date.now() + 10 * 60 * 1000)
    
    const formEntry = new Newsletter({
      email,
      couponId: couponCode,
      used: false
    });

    const coupon = await stripe.coupons.create({
      percent_off: 10,
      duration: 'once',
      id: couponCode,
    })

    // Create a Stripe customer
    const customer = await stripe.customers.create({
      email: email,
      description: 'Newsletter Subscriber',
      coupon: coupon.id,
    });

    const promotionCode = await stripe.promotionCodes.create({
      coupon: couponCode,
      code: couponCode,
      // customer: customer.id,
    });

    await formEntry.save();
    await sendEmail(email, couponCode);

    res.status(200).json({ message: 'Form data saved successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

module.exports = router;