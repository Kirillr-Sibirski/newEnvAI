import React from 'react';
import './App.css';
import Home from "./pages/Home";
import Mint from "./pages/Mint";
import Image from "./pages/Image";
import Map from "./pages/Map";
import NoPage from "./pages/NoPage";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; 
import {ethers} from 'ethers'

function App() {
  let wallet = localStorage.getItem('wallet_address');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/image" element={!ethers.utils.isAddress(wallet) ? <Navigate to="/" /> : <Image />}/>
        <Route path="/mint" element={!ethers.utils.isAddress(wallet) ? <Navigate to="/" /> : <Mint />}/>
        <Route path="/map" element={!ethers.utils.isAddress(wallet) ? <Navigate to="/" /> : <Map />}/>
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
