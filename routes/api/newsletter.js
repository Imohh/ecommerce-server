const express = require('express');
const router = express.Router();

const mailchimp = require('../../services/mailchimp');
const mailgun = require('../../services/mailgun');

const Newsletter = require('../../models/Newsletter');

router.post('/subscribe', async (req, res) => {
  const email = req.body.email;
  const formEntry = new Newsletter({
    email,
  })

  if (!email) {
    return res.status(400).json({ error: 'You must enter an email address.' });
  }

  const result = await mailchimp.subscribeToNewsletter(email);

  if (result.status === 400) {
    return res.status(400).json({ error: result.title });
  }

  await mailgun.sendEmail(email, 'newsletter-subscription');
  await formEntry.save();

  res.status(200).json({
    success: true,
    message: 'You have successfully subscribed to the newsletter'
  });
  
});

module.exports = router;

// try {
//     const email = req.body.email;
//     const formEntry = new Newsletter({
//       email,
//     });

//     if (!email) {
//       return res.status(400).json({ error: 'You must enter an email address.' });
//     }

//     await formEntry.save();
//     res.status(200).json({ message: 'Form data saved successfully' });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
