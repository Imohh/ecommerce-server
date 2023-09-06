const express = require('express');
const router = express.Router();

// const mailchimp = require('../../services/mailchimp');
// const mailgun = require('../../services/mailgun');

const Newsletter = require('../../models/newsletter');

router.post('/subscribe', async (req, res) => {
  try {
    const email = req.body.email;

    if (!email) {
      return res.status(400).json({ error: 'You must enter an email address.' });
    }

    const newsletter = new Newsletter({
      email
    });

    const newsletterDoc = await newsletter.save();
    res.status(200).json({
      success: true,
      message: `We receved your email, we will reach you on your email address ${email}!`,
      newsletter: newsletterDoc
    });

  } catch (error) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
  
});

module.exports = router;