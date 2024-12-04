const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authenticationRoute');
const { authenticateToken } = require('./middleware/authenticationMiddleware');
dotenv.config();
const app = express();

const corsConfig = {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }
  
  app.use(cors(corsConfig))
  app.options("*", cors(corsConfig))
  app.use(express.json());

app.get('/',(req,res)=>{
    res.send('hello')
})

app.get('/auth/user', authenticateToken, (req, res) => {
    const { id, username, email } = req.user
    res.json({ id, username, email })
});

app.use('/user', authRoutes);

const connectDb=async()=>{

    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log('connected')
    } catch (error) {
        console.log(error)
        
    }

}
connectDb()

app.listen(5000,()=>{
    console.log('server running.')
})
