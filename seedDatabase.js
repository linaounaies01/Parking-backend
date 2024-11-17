const mongoose = require('mongoose');
const ParkingTicket = require('./models/ParkingTicket'); 
require('dotenv').config(); 

const parkingTicketIds = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3'];

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB Connected');
    
    for (const id of parkingTicketIds) {
      const ticketExists = await ParkingTicket.findOne({ ticketId: id });
      if (ticketExists) {
        console.log(`Ticket ${id} already exists.`);
        continue; 
      }

      const newTicket = new ParkingTicket({ ticketId: id });
      await newTicket.save();
      console.log(`Ticket ${id} created.`);
    }

    console.log('Finished seeding database with parking tickets.');
    process.exit(); 
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit();
  });