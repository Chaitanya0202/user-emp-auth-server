
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const employeeRoutes = require('./routes/employee');
const userRoutes = require('./routes/user');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(`${process.env.MONGO_URI}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

// Use routes
app.use('/api/employees', employeeRoutes);
app.use('/api/users', userRoutes);

const PORT =  process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} `);
});
