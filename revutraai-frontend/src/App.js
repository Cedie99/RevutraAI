

import './App.css';
import SmartReviewer from './components/SmartReviewer';
import IntroSection from './components/IntroSection';
import React, {useState} from 'react';
import Chatbot from './components/Chatbot'; // make sure path is correct
import Robot from './assets/ai-robot.png'; // make sure path is correct


function App() {
   

   const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="App">
      <div class="floating-circles">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <IntroSection/>
      <div className="robot-image">
        <img src={Robot} alt="Robot" />
      </div>
      <SmartReviewer />
       <button
        className="chat-toggle-button"
        onClick={() => setIsVisible(prev => !prev)}
      >
        {isVisible ? '−' : '💬'}
      </button>
      

      <div className={`chatbot-wrapper ${isVisible ? 'visible' : 'hidden'}`}>
        <Chatbot context="Your context here" />
      </div>
    </div>
  );
}

export default App;

