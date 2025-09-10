import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import CardSlider from './CardSlider'; // you'll create this component below




const SmartReviewer = () => {
  const [ filePath, setFilePath] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/upload', formData);
      setFilePath(res.data.path);
      setExtractedText(res.data.extractedText);
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComprehend = async () => {
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/comprehend', {
        content: extractedText,
      });
      setReview(res.data);
    } catch (err) {
      console.error('Comprehension failed', err);
    } finally {
      setLoading(false);
    }
  };


    const parseMarkdown = (text) => {
      // Headings
      text = text.replace(/^###\s*(.+)$/gm, '<h3>$1</h3>');
      text = text.replace(/^##\s*(.+)$/gm, '<h2>$1</h2>');
      text = text.replace(/^#\s*(.+)$/gm, '<h1>$1</h1>');

      // Bold
      text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

      // Lists
      text = text.replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>');
      text = text.replace(/(<li>.*<\/li>)/gms, '<ul>$1</ul>');

      // Tables
      if (/\|.*\|/.test(text)) {
          text = text.replace(
          /^((?:\|.*\|\n)+)/gm,
          (match) => {
              const rows = match.trim().split('\n');
              const header = rows[0].split('|').map(cell => `<th>${cell.trim()}</th>`).filter(Boolean).join('');
              const bodyRows = rows.slice(2).map(row => {
              const cols = row.split('|').map(cell => `<td>${cell.trim()}</td>`).filter(Boolean).join('');
              return `<tr>${cols}</tr>`;
              }).join('');
              return `<table><thead><tr>${header}</tr></thead><tbody>${bodyRows}</tbody></table>`;
          }
          );
      }

      // Paragraphs (non-wrapped lines)
      text = text.replace(/^(?!<h\d>|<ul>|<li>|<p>|<strong>|<table>|<tr>|<th>|<td>)(.+)$/gm, '<p>$1</p>');

      return text;
    };




    const handleDownload = () => {
      const content = review?.choices?.[0]?.message?.content;
      if (!content) return;

      const lines = content.split("\n");

      const processedLines = lines.map((line) => 
      {
          line = line.trim();

          // Remove markdown heading markers (e.g., ###, ##, #)
          const headingMatch = line.match(/^(#+)\s*(.+)/);
          if (headingMatch) {
          return headingMatch[2]; // Keep only the heading text
          }

          // Convert **bold** markers to uppercase for emphasis in plain .txt
          return line.replace(/\*\*(.*?)\*\*/g, (_, boldText) => boldText.toUpperCase());
      });

        const blob = new Blob([processedLines.join("\n")], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "output.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    const handlePDFDownload = () => {
      const content = review?.choices?.[0]?.message?.content;
      if (!content) return;

      const doc = new jsPDF({ unit: "mm", format: "a4" });
      doc.setFontSize(12);

      const margin = 15;
      const pageHeight = doc.internal.pageSize.getHeight();
      const usableWidth = doc.internal.pageSize.getWidth() - margin * 2;
      const lineHeight = 7;
      let y = margin;

      const lines = content.split('\n');

      for (let line of lines) {
          line = line.trim();

          // Detect and format markdown headings like ### or ## or #
          const headingMatch = line.match(/^(#+)\s*(.+)/);
          if (headingMatch) {
          const headingText = headingMatch[2]; // Remove the ###
          doc.setFont("helvetica", "bold");
          const wrappedLines = doc.splitTextToSize(headingText, usableWidth);
          for (const wrappedLine of wrappedLines) {
              if (y + lineHeight > pageHeight - margin) {
              doc.addPage();
              y = margin;
              }
              doc.text(wrappedLine, margin, y);
              y += lineHeight;
          }
          y += 2;
          continue;
          }

          // Bold keypoint phrases marked with ** **
          if (/\*\*(.*?)\*\*/.test(line)) {
          // Replace and print in bold
          const boldText = line.replace(/\*\*(.*?)\*\*/g, '$1');
          doc.setFont("helvetica", "bold");
          const wrappedLines = doc.splitTextToSize(boldText, usableWidth);
          for (const wrappedLine of wrappedLines) {
              if (y + lineHeight > pageHeight - margin) {
              doc.addPage();
              y = margin;
              }
              doc.text(wrappedLine, margin, y);
              y += lineHeight;
          }
          y += 2;
          continue;
          }

          // Default text (non-bold)
          doc.setFont("helvetica", "normal");
          const wrappedLines = doc.splitTextToSize(line, usableWidth);
          for (const wrappedLine of wrappedLines) {
          if (y + lineHeight > pageHeight - margin) {
              doc.addPage();
              y = margin;
          }
          doc.text(wrappedLine, margin, y);
          y += lineHeight;
          }

          y += 2;
      }

      doc.save("output.pdf");
    };





  return (
    <div className="smart-reviewer-container fade-in">
      <div className="smart-reviewer-card">
        <h1><strong>Upload Your Files Here!</strong></h1>
        <input type="file" onChange={handleUpload} accept=".pdf,.docx,.pptx" className="file-input" />
        {extractedText.trim() !== '' && (
            <div className='buttons'>
                <button onClick={handleComprehend} className="review-btn">
                Help Me Understand This
                </button>

                <button
                onClick={handleDownload}
                className="review-btn"
                disabled={!review?.choices?.[0]?.message?.content}
                >
                Download as Text
                </button>

                <button
                onClick={handlePDFDownload}
                className="review-btn"
                disabled={!review?.choices?.[0]?.message?.content}
                >
                Download as PDF
                </button>
        </div>
    )}

        {loading && (
        <div className="loader-circle-11">
            <div className="arc"></div>
            <div className="arc"></div>
            <div className="arc"></div>
        </div>
        )}


        {review && (
          <CardSlider
            content={review.choices[0].message.content}
            parseMarkdown={parseMarkdown}
          />
          
        )}
        

      </div>
      
    </div>
  );
};

export default SmartReviewer;
