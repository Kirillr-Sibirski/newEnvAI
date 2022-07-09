import React from 'react';
import './App.css';
import Home, { wallet_address } from "./pages/Home";
import Mint from "./pages/Mint";
import Image from "./pages/Image";
import NoPage from "./pages/NoPage";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; 
import {ethers} from 'ethers'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/image" element={ethers.utils.isAddress(wallet_address) ? <Navigate to="/" /> : <Image />}/>
        <Route path="/mint" element={ethers.utils.isAddress(wallet_address) ? <Navigate to="/" /> : <Mint />}/>
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
