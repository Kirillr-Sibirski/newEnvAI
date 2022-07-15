import React, { useState, useEffect } from 'react';

function Mint() {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        if(name != null && desc != null) { // doesn't check for underfined
            // execute some code
            fetch('/upload_image', { // Upload images to ipfs
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    description: desc,
                    image: localStorage.getItem('image_neu')
                })
              }).then(function (response) {
                  return response.json()
              }).then(function (data) {
                console.log(data);
              }).catch(function (error) {
                console.error(error);
              });
            
        } else {
            setErrorMessage("Please write a name & description of your future NFT")
        }
    }
    return (
    <div>
        <h1>NFT minting</h1>
        <form onSubmit={handleSubmit}>
        <div><label>Name:&nbsp;
            <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
        </label></div>
        <div><label>Description:&nbsp;
            <input 
            type="text" 
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            />
        </label></div>
        <input type="submit" />
        </form>
        <h3>{errorMessage}</h3>
    </div>
    );
}

export default Mint;