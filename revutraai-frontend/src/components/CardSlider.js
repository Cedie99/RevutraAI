import React, { useState, useEffect } from 'react';
import './CardSlider.css';

const CardSlider = ({ content, parseMarkdown }) => {
  const [sections, setSections] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);


  useEffect(() => {
    const rawSections = content.split(/^##+\s+/gm).filter(Boolean); 
    const structured = rawSections.map((sec) => {
      const lines = sec.trim().split('\n');
      let title = lines.shift() || '';

      // Clean up title: remove markdown symbols like ** and #
      title = title.replace(/[*#]+/g, '').trim();

      const body = lines.join('\n');
      return { title, body };
    });
    setSections(structured);
  }, [content]);



  const goPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : sections.length - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev < sections.length - 1 ? prev + 1 : 0));
  };

  

  if (sections.length === 0) return null;

  return (
    <div className="slider-container">
      <button onClick={goPrev} className="nav-btn left">&#10094;</button>
      <div className="slider-card">
        <h2 className="card-title">{sections[currentIndex].title}</h2>
        <div
          className="slider-content"
          dangerouslySetInnerHTML={{
            __html: parseMarkdown(
              sections[currentIndex].body,
              currentIndex === 0 // true only for first page
            ),
          }}
        />
        <div className="page-indicator">
            Page {currentIndex + 1} of {sections.length}
        </div>
      </div>
      <button onClick={goNext} className="nav-btn right">&#10095;</button>
    </div>
  );
};

export default CardSlider;
