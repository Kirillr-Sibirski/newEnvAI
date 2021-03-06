import React, { useState } from 'react';
import { Navigate } from "react-router-dom";
import { Route, Redirect } from 'react-router'

function Home() {
    const [errorMessage, setErrorMessage] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
                window.location.href = '/image'; // Redirect to image generation page 
				localStorage.setItem("wallet_address", result[0])
                setErrorMessage("")
			})
			.catch(error => {
				setErrorMessage(error.message);
			});

		} else {
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
        localStorage.setItem("wallet_address", newAccount)
	}

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}


	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);
    return (
        <div>
            <p style={{ fontSize: 14 }} className="m-2">With NewEnvAI people can freely mint dynamic animal NFTs which represent real environmental data.
               The uniqueness of this project is determined by the usage of DALL-E neural network which allows users to create any images by just writing a description of it (e.g. bear in river)!
               There are 3 stages of NFTs: 'bad', 'neutral' and 'good' that will change accordingly to the data provided by an oracle from environmental API.</p>
            <button onClick={connectWalletHandler} className="btn btn-secondary btn-sm m-2">{connButtonText}</button>
            {errorMessage}
			<div><iframe width="800" height="800" frameborder="0" src="https://globalforestwatch.org/embed/widget/burnedAreaRanked/global?burnedAreaRanked=eyJoaWdobGlnaHRlZCI6ZmFsc2V9"></iframe></div>
        </div>

    );
}

export default Home;