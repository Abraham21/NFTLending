import React, { useState } from 'react';
import {
  MetaMaskButton,
  useSDK,
} from "@metamask/sdk-react-ui";
import "./App.css";
import GetLoan from "./components/GetLoan";
import GiveLoan from './components/GiveLoan';
import ActiveLoans from './components/ActiveLoans';

function AppReady() {

  const [feature, setFeature] = useState('GetLoan');

  return (
      <div className="App">
          <header className="App-header">
              <MetaMaskButton theme={"light"} color="white"></MetaMaskButton>
              
              <div className="stats-container">
                <p>Total Volume: 0</p>
                <p>Active Loans: 0</p>
              </div>

              <div className="nav-container">
                <button onClick={() => {setFeature('GetLoan')}} className="nav-link">Get a loan</button>
                <button onClick={() => {setFeature('GiveLoan')}} className="nav-link">Give a loan</button>
                <button onClick={() => {setFeature('ActiveLoans')}} className="nav-link">Loans</button>
              </div>

              {feature === 'GetLoan' && <GetLoan />}
              {feature === 'GiveLoan' && <GiveLoan />}
              {feature === 'ActiveLoans' && <ActiveLoans />}

          </header>
      </div>
  );
}

function App() {
  const { ready } = useSDK();

  if (!ready) {
      return <div>Loading...</div>;
  }

  return <AppReady />;
}

export default App;