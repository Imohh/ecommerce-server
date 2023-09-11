const express = require('express');
const router = express.Router();
const Payment = require('../../models/payment');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
    try {

    const { cartTotal, productNames } = req.body;

    const combineProductNames = productNames.join(', ');

    // Create a new payment document
    const paymentDescription = 'Payment for: ' + combineProductNames;

    const newPayment = new Payment({
      paymentDescription,
      unit_amount: cartTotal,
    });

    await newPayment.save();

    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
                currency: "gbp",
                product_data: {
                    name: combineProductNames,
                },
                unit_amount: cartTotal * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'https://testing-eminence.vercel.app/success',
        cancel_url: 'https://testing-eminence.vercel.app/contact',
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