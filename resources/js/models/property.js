const mongoose = require('mongoose');

// Define the Property schema
const propertySchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // For storing the image path
});

// Export the model
module.exports = mongoose.model('Property', propertySchema);
