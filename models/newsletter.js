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
