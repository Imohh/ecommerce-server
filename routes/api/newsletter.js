// const express = require('express');
// const router = express.Router();

// // const mailchimp = require('../../services/mailchimp');
// // const mailgun = require('../../services/mailgun');

// const Newsletter = require('../../models/newsletter');

// router.post('/subscribe', async (req, res) => {
//   try {
//     const email = req.body.email;

//     if (!email) {
//       return res.status(400).json({ error: 'You must enter an email address.' });
//     }

//     const newsletter = new Newsletter({
//       email
//     });

//     const newsletterDoc = await newsletter.save();
//     res.status(200).json({
//       success: true,
//       message: `We receved your email, we will reach you on your email address ${email}!`,
//       newsletter: newsletterDoc
//     });

//   } catch (error) {
//     return res.status(400).json({
//       error: 'Your request could not be processed. Please try again.'
//     });
//   }
  
// });

// module.exports = router;



const express = require('express');
const router = express.Router();

const mailchimp = require('../../services/mailchimp');
const mailgun = require('../../services/mailgun');
// const { sendWelcomeEmail } = require('../../services/email')

const Newsletter = require('../../models/Newsletter');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');

// Configure your email transport (e.g., Gmail)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send a welcome email
async function sendWelcomeEmail(email) {
  try {
    const mailOptions = {
      from: 'jaypee88830@gmail.com',
      to: email,
      subject: 'Welcome to Our Newsletter',
      text: 'Thank you for subscribing to our newsletter! From EminenceByGtx',
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

router.post('/subscribe', async (req, res) => {
  try {
    const email = req.body.email;

    const formEntry = new Newsletter({
      email,
    });

    if (!email) {
      return res.status(400).json({ error: 'You must enter an email address.' });
    }

    const existingSubscriber = await Newsletter.findOne({ email });

    if (existingSubscriber) {
      return res.status(400).json({ error: 'This email is already subscribed.' });
    }

    // Create a Stripe customer
    const customer = await stripe.customers.create({
      email,
    });

    await formEntry.save();

    // Send a welcome email to the use after saving the subscription
    await sendWelcomeEmail(email)

    res.status(200).json({ message: 'Form data saved successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
  
});



module.exports = router;