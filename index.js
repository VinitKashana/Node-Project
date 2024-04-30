// const mongoose=require('mongoose')
// const express=require("express")
// const axios = require('axios');

// const Ticker = require('./Models/trade.js')
// const app=express();

// app.use(express.json());
// app.set('view engine','ejs');
// app.use("/",router);

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send("Internal server error123");
// })



// // URL of the WazirX API endpoint
// const apiUrl = 'https://api.wazirx.com/api/v2/tickers';

// const fetchDataAndStoreInMongoDB = async () => {
//     try {
//       // Make HTTP GET request to the API
//       const response = await axios.get(apiUrl);
  
//       // Extract relevant data from the response and store it in MongoDB
//       const tickersData = response.data;
  
//       // Iterate over the first 10 tickers
//       const tickersToStore = Object.values(tickersData).slice(0, 10);
//       for (const ticker of tickersToStore) {
//         // Create a new ticker document using the Ticker model
//         const newTicker = new Ticker({
//           name: ticker.name,
//           last: parseFloat(ticker.last),
//           buy: parseFloat(ticker.buy),
//           sell: parseFloat(ticker.sell),
//           volume: parseFloat(ticker.volume),
//           base_unit: ticker.base_unit
//         });
  
//         // Save the ticker document to the MongoDB collection
//         await newTicker.save();
  
//         // console.log('Ticker data saved to MongoDB:', newTicker);
//       }
//     } catch (error) {
//       // Handle any errors
//       console.error('Error fetching and storing data:', error);
//     }
//   };

 


// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/intenship')

// .then(() => {
//   console.log("Connected to MongoDB");
//   // Call the function to fetch data and store it in MongoDB
//   fetchDataAndStoreInMongoDB();
// })
// .catch((err) => {
//   console.error("Error connecting to MongoDB:", err);
// });

 
//     app.listen(3000, () => {
//         console.log('Server running at port 3000');
//     });
    


const express = require('express');

const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();
const port = 4000;

// Set up MongoDB connection
mongoose.connect('mongodb://localhost:27017/hodlinfo')
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));



const tradeSchema = new mongoose.Schema({
    base_unit: String,
  quote_unit: String,
  low: Number,
  high: Number,
  last: Number,
  type: String,
  open: Number,
  volume: Number,
  sell: Number,
  buy: Number,
  at: Number,
  name: String,
});

const TradeModel = mongoose.model('Trade', tradeSchema);

// Fetch data from WazirX API and store in MongoDB
const fetchDataAndSave = async () => {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const tradeData = response.data;

    
    const firstTenTickers = Object.values(tradeData).slice(0, 10);

    // Save data to MongoDB
    await TradeModel.insertMany(firstTenTickers);
    console.log(' saved to MongoDB');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Fetch data and save on server startup
fetchDataAndSave();


app.get('/home', async (req, res) => {
    try {
        // Fetch data from MongoDB
        const data = await TradeModel.find({}).limit(10);
      
        // Log the fetched data
        console.log('Fetched data:', data);
      
        // Render the main.ejs template with the fetched data
        res.render('home', { data: data });
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});

  
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
