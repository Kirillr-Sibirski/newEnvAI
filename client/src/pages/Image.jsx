import React, { useState, useEffect } from 'react';
import { animalText } from './Animals';

// Housekeeping for openAI
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let errors;

// Send 3 requests to DALL-E mini with descriptions
async function generate_images(neutral, positive, negative) {
  errors("AI: Image generation in progress..")
  // Send request to replicate.com API to generate images
}

async function generate_description(desc, good, bad) {
  // Make input sentence more creative & interesting
  const description = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: "Create sentence with"+desc,
    max_tokens: 20,
    temperature: 0.6,
  });
  // Generate sentences with description and adjectives using openAI's Generation
  const adj_positive = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: "Add adjectives "+good+"to sentence "+desc,
    max_tokens: 20,
    temperature: 0.4,
  });
  // Generate sentences with description and adjectives using openAI's Generation
  const adj_negative = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: "Add adjectives "+bad+"to sentence "+desc,
    max_tokens: 20,
    temperature: 0.4,
  });
  console.log(description.data.choices[0].text, adj_positive.data.choices[0].text, adj_negative.data.choices[0].text)
  generate_images(description.data.choices[0].text, adj_positive.data.choices[0].text, adj_negative.data.choices[0].text);
}
// Check adjectives + description with sentiment analysis for positive, neutral or negative using openAI's Classification
async function sentiment_analysis(desc, good, bad) {
    // Generate sentences with description and adjectives using openAI's Generation
    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: "Classify the sentiment in these words: \n 1. '"+desc+"'\n 2. '"+good+"'\n 3. '"+bad+"'",
      max_tokens: 40,
      temperature: 0,
    });
    const originalText = response.data.choices[0].text.toLocaleLowerCase();
    let rspList = originalText.split('\n');
    let substrings = ["positive", "neutral", "negative"];
    // This checks if user response match with intended response
    if(rspList[2].includes(substrings[1]) && rspList[3].includes(substrings[0]) && rspList[4].includes(substrings[2])) {
      // if ok execute the rest
      errors("AI: Description generation in progress..")
      generate_description(desc, good, bad);
    }
    else { 
      errors("AI: Hm.. First input must be neutral, second input must be positive, third input must be negative. Am I goin' crazy?")
    }
}
// Check 'desc' sentence for containing animal vocabulary 
async function animalVocab(desc, good, bad){
    for(var y = 0; y < animalText.length; y++) { // loops through all the list
      if(desc.includes(animalText[y].toLocaleLowerCase())) { // if animal is found
        errors("AI: Sentiment analysis in progress..") // Checks if text is positive, neutral or negative
        sentiment_analysis(desc, good, bad)
        break;
      }
      else {
        errors("AI: I don't know such an animal, pls change your description.")
      }
    }
}

function Image() {
    const [desc, setDesc] = useState("");
    const [good, setGood] = useState("");
    const [bad, setBad] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
  
    useEffect(() => {
      /* Assign update to outside variable */
      errors = setErrorMessage
  
      /* Unassign when component unmounts */
      return () => errors = null
    })
    useEffect(() => {
      fetch("/api")
        .then((res) => res.json())
        .then((data) => console.log(data.message));
    }, []);
    const handleSubmit = (event) => {
      event.preventDefault();
      
      setErrorMessage("AI: Checking description for 'animals'..")
      animalVocab(desc.toLocaleLowerCase(), good.toLocaleLowerCase(), bad.toLocaleLowerCase());
      }
    return (
        <div>
            <h1>Image Generation</h1>
            <form onSubmit={handleSubmit}>
            <div><label>Description:&nbsp;
                <input 
                type="text" 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                />
            </label></div>
            <div><label>Write adjectives to describe 'good' state of NFT:&nbsp;
                <input 
                type="text" 
                value={good}
                onChange={(e) => setGood(e.target.value)}
                />
            </label></div>
            <div><label>Write adjectives to describe 'bad' state of NFT:&nbsp;
                <input 
                type="text" 
                value={bad}
                onChange={(e) => setBad(e.target.value)}
                />
            </label></div>
            <input type="submit" />
            </form>
            <h3>{errorMessage}</h3>
        </div>
    );
}

export default Image;