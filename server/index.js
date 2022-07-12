const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const path = require('path');
const app = express();
const axios = require('axios')

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('dotenv').config(); // Load environment variables from .env file

// Housekeeping for openAI
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const PORT = process.env.PORT || 3001;
app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Handle POST requests to /sentiment_analysis route
router.post('/sentiment_analysis', function requestHandler(req, res) {
  openai.createCompletion({
    model: "text-davinci-002",
    prompt: "Classify the sentiment in these words: \n 1. '"+req.body.description+"'\n 2. '"+req.body.positive+"'\n 3. '"+req.body.negative+"'",
    max_tokens: 40,
    temperature: 0,
  }).then(function (response){
    res.end(JSON.stringify(response.data.choices[0].text.toLocaleLowerCase()))
  })
});
// Handle POST requests to /description route
router.post('/description', function requestHandler(req, res) {
    // Make input sentence more creative & interesting
    openai.createCompletion({
      model: "text-davinci-002",
      prompt: req.body.a,
      max_tokens: 20,
      temperature: 0.6,
    }).then(function (response){
      res.end(JSON.stringify(response.data.choices[0].text.toLocaleLowerCase()))
    })
});
// Handle POST requests to /dall-e route
router.post('/dall-e', function requestHandler(req, res) { // image generation
  axios({
    url: 'https://api.replicate.com/v1/predictions',
    method: 'post',
    headers: { 
      Authorization: process.env.REACT_APP_REPLICATE_API_TOKEN,
      "Content-Type": "application/json"
    },
    data: {
      version: "2e3975b1692cd6aecac28616dba364cc9f1e30c610c6efd62dbe9b9c7d1d03ea",
      input: {prompt: req.body.a, n_predictions: 1}
    }
  }).then(function (response) {
    return response.json()
  }).then(function (data) { // response from replicate.com API
    console.log(data);
  }).catch(function (error) {
    console.error(error);
  });
  /*fetch('https://api.replicate.com/v1/predictions', {
    method: "post",
    headers: { 
      Authorization: process.env.REACT_APP_REPLICATE_API_TOKEN,
      "Content-Type": "application/json"
    },
    data: {
      version: "2e3975b1692cd6aecac28616dba364cc9f1e30c610c6efd62dbe9b9c7d1d03ea",
      input: {prompt: req.body.a, n_predictions: 1}
    }
  }).then(function (response) {
      return response.json()
  }).then(function (data) { // response from replicate.com API
    console.log(data);
  }).catch(function (error) {
    console.error(error);
  });*/
});

// add router in the Express app.
app.use("/", router);

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}
// ** MIDDLEWARE ** //
const whitelist = ['http://localhost:3000', 'http://localhost:8080', 'https://newenvai.herokuapp.com/']
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error('Not allowed by CORS'))
    }
  }
}

