const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'calendar' }
});

module.exports = mongoose.model('Event', eventSchema);