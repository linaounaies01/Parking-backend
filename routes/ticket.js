const express = require('express');
const ParkingTicket = require('../models/ParkingTicket'); 
const auth = require('../middlewares/authMiddleware');
const User = require('../models/User'); 

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    await ParkingTicket.create({ ticketId: `Spot ${req.body.ticketId}`, status: 'available' });
    res.status(201).json({ success: true })
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
})

router.get('/', auth, async (req, res) => {
  try {
    let tickets = await ParkingTicket.find();
    
   
    tickets = await Promise.all(tickets.map(async (ticket) => {
      if (ticket.status === 'reserved') {
        ticket.reservedBy = await User.findById(ticket.reservedBy);
      }
      return ticket;
    }));
    res.json(tickets);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});


router.get('/available', auth, async (req, res) => {
  try {
    const tickets = await ParkingTicket.find({ status: 'available' });
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.put('/reserve/:ticketId', auth, async (req, res) => {
    try {
      const { ticketId } = req.params;
      
      let ticket = await ParkingTicket.findById(ticketId);
  
      if (!ticket) {
        return res.status(404).json({ msg: 'Parking spot not found' });
      }
      if (ticket.status !== 'available') {
        return res.status(400).json({ msg: 'Parking spot is not available' });
      }
  
      ticket.status = 'reserved';
      ticket.reservedBy = req.user.id;
      await ticket.save();
  
      res.json({ msg: 'Parking spot reserved successfully', ticketId: ticket.ticketId, status: ticket.status });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });

  router.put('/complete/:ticketId', auth, async (req, res) => {
    try {
      const { ticketId } = req.params; 
      let ticket = await ParkingTicket.findById(ticketId);
  
      if (!ticket) {
        return res.status(404).json({ msg: 'Parking spot not found' });
      }
  
      if (ticket.status === 'reserved' && ticket.reservedBy.equals(req.user.id)) {
        ticket.status = 'available';
        ticket.reservedBy = null; 
        await ticket.save();
  
        res.json({ msg: 'Parking spot is now available', ticket });
      } else {
        return res.status(400).json({ msg: 'Parking spot is not reserved or you are not the reserver' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });

  router.delete('/:id', auth, async (req, res) => {
    try {
      const { id } = req.params; 
      await ParkingTicket.findOneAndDelete({ _id: id});

      res.status(200).json({ success: true })
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });


module.exports = router;