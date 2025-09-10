import React from 'react';
import './IntroSection.css'; // Make sure this path is correct


const IntroSection = () => {
  return (
    <div className="intro-section fade-in">
      <h1>Summarize. Understand. Empower. — <strong className='strong'>Revutra</strong> for a more informed world</h1>
      <p>
        <strong>Revutra</strong> is a web-based application that empowers users with instant access to understanding by intelligently processing and summarizing the content of uploaded documents (.pdf or .docx). 
        Whether for exam preparation, document comprehension, or quick reviews, Revutra transforms complex materials into concise, easy-to-digest summaries.
      </p>
    </div>
  );
};

export default IntroSection;
