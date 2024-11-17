const mongoose = require('mongoose');

const parkingTicketSchema = new mongoose.Schema({
    ticketId: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['available', 'reserved'],
      default: 'available'
    },
    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  });
  

module.exports = mongoose.model('ParkingTicket', parkingTicketSchema);