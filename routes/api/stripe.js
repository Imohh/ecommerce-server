const express = require('express');
const router = express.Router();
const Payment = require('../../models/payment');
const Newsletter = require('../../models/Newsletter');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
    try {

        const { total, productNames, user } = req.body;
        const email = user.email

        const combineProductNames = productNames.join(', ');
        const timestampId = Date.now().toString();

        // Create a new payment document
        const paymentDescription = timestampId;

        const newPayment = new Payment({
          paymentDescription,
          unit_amount: total,
        });

        await newPayment.save();

        // Fetch the coupon code associated with the user's email
        // const newsletterEntry = await Newsletter.findOne({ email });
        // const couponCode = newsletterEntry ? newsletterEntry.couponId : '';


        const session = await stripe.checkout.sessions.create({
            line_items: [
              {
                price_data: {
                    currency: "gbp",
                    product_data: {
                        name: combineProductNames,
                    },
                    unit_amount: total * 100,
                },
                quantity: 1,
              },
            ],
            mode: 'payment',
            success_url: 'https://eminencebygtx.com/success',
            cancel_url: 'https://eminencebygtx.com/contact',
            payment_intent_data: {
                description: paymentDescription,
            }
          });

        res.json({url: session.url});
    
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occured' })
    }
});

module.exports = router;