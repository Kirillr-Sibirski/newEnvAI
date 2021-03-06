import React, { useState, useEffect } from 'react';
import { animalText } from './Animals';

let errors;
//let hide;

let picture_neu; 
let picture_pos; 
let picture_neg; 

// Send 3 requests to DALL-E mini with descriptions
async function generate_images(neutral, positive, negative) {
  errors("AI: #1 Image generation in progress..")
  // Send request to replicate.com API to generate images
  fetch('/dall-e', {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ a: neutral })
  }).then(function (response) {
    return response.json()
  }).then(function (data) {
    picture_neu(data)
    //hide('none')
    errors("AI: #2 Image generation in progress..")
    // Send request to replicate.com API to generate images
    fetch('/dall-e', {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ a: positive })
    }).then(function (response) {
      return response.json()
    }).then(function (data) {
      picture_pos(data)
      //hide('none')
      errors("AI: #3 Image generation in progress..")
      // Send request to replicate.com API to generate images
      fetch('/dall-e', {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ a: negative })
      }).then(function (response) {
        return response.json()
      }).then(function (data) {
        errors("AI: Finally! Images were generated.")
        picture_neg(data)
        //hide('none')
      }).catch(function (error) {
        console.error(error);
      });
    }).catch(function (error) {
      console.error(error);
    });
  }).catch(function (error) {
    console.error(error);
  });
}

async function generate_description(desc, good, bad) {
    // Generate sentences with description and adjectives using openAI's Generation
    // Make input sentence more creative & interesting
    const res_desc = await fetch('/description', {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({a: 'Create sentence with'+desc})
    }).then(function (response) {
        return response.json()
    }).then(function (data) {
      return data;
    }).catch(function (error) {
      console.error(error);
    });
    // Generate sentences with description and adjectives using openAI's Generation (positive)
    const res_pos = await fetch('/description', {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({a: 'Add adjectives '+good+'to sentence '+desc})
    }).then(function (response) {
        return response.json()
    }).then(function (data) {
      return data;
    }).catch(function (error) {
      console.error(error);
    });
    // Generate sentences with description and adjectives using openAI's Generation (negative)
    const res_neg = await fetch('/description', {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({a: 'Add adjectives '+bad+'to sentence '+desc})
    }).then(function (response) {
        return response.json()
    }).then(function (data) {
      return data;
    }).catch(function (error) {
      console.error(error);
    });
    if (res_desc != null && res_desc.length > 0 && res_pos != null && res_pos.length > 0 && res_neg != null && res_neg.length > 0)
      generate_images(res_desc, res_pos, res_neg);
    else 
      errors("AI: Bi-boop. Seems like an error occured during generation of decs-ri-p-tio-n..")
} 

// Check adjectives + description with sentiment analysis for positive, neutral or negative using openAI's Classification
async function sentiment_analysis(desc, good, bad) {
    // Generate sentences with description and adjectives using openAI's Generation
    const body = {
      description: desc,
      positive: good,
      negative: bad
    }
    fetch('/sentiment_analysis', {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(function (response) {
        return response.json()
    }).then(function (data) {
        let rspList = data.split('\n');
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
    }).catch(function (error) {
      console.error(error);
    });

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
    const [image_neu, setImageNeu] = useState("");
    const [image_pos, setImagePos] = useState("");
    const [image_neg, setImageNeg] = useState("");

    //const [show_Hide, setShowHide] = useState('flex');

    const regenerate = () => {
      // Do a check if images were generated
      window.location.reload() // refresh page
    }
    const proceed = () => {
      // Do a check if images were generated
      // Export image to be used at minting page
      window.location.href = '/map'; // Redirect to map page 
      localStorage.setItem("image_neu", image_neu)
      localStorage.setItem("image_pos", image_pos)
      localStorage.setItem("image_neg", image_neg)
    }

    useEffect(() => {
      /* Assign update to outside variable */
      errors = setErrorMessage
      picture_neu = setImageNeu
      picture_pos = setImagePos
      picture_neg = setImageNeg
      //hide = setShowHide

      /* Unassign when component unmounts */
      return () => errors = null
    }, [])
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
            <div /*Hide this block when image is not generated*/> 
              <div><img
                alt="neutral"
                src={image_neu} 
                //style={{display: show_Hide}}
              /></div>
              <div><img
                alt="positive"
                src={image_pos}
                //style={{display: show_Hide}}
              /></div>
              <div><img
                alt="negative"
                src={image_neg}
                //style={{display: show_Hide}}
              /></div>
              <button /* Do checks if images were generated */ onClick={regenerate} className="btn btn-secondary btn-sm m-2">Regenerate</button>
              <button /* Do checks if images were generated */ onClick={proceed} className="btn btn-secondary btn-sm m-2">Proceed</button>
            </div>
        </div>
    );
}

export default Image;