require('dotenv').config();
const express = require('express');
const database = require('./database/db.config'); 
const authRoutes = require('./routes/auth'); 
const parkingTicketRoutes = require('./routes/ticket'); 

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

database.mongoose
  .connect(database.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to the database'))
  .catch(err => {
    console.error('Connection error', err);
    process.exit();
  });

app.use('/api/auth', authRoutes);
app.use('/api/parking-tickets', parkingTicketRoutes);

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to the Parking System API!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});