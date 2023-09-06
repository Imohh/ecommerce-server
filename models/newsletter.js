// const mongoose = require('mongoose');
// const {Schema, model} = mongoose;

// const NewsletterSchema = new Schema({
//   email: {type: String, required: true},
// });

// const NewsletterModel = model('Newsletter', NewsletterSchema);

// module.exports = NewsletterModel;


const Mongoose = require('mongoose');
const { Schema } = Mongoose;

// Contact Schema
const NewsletterSchema = new Schema({
  email: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('Newsletter', NewsletterSchema);
