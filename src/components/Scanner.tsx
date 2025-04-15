import React, { useState } from 'react';
// import Tesseract from 'tesseract.js'; // Removed, using Claude API instead

interface ParsedItem {
  key: string;
  value: string;
}

const Scanner: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [parsedData, setParsedData] = useState<ParsedItem[] | null>(null);
  const [error, setError] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      processImage(e.target.files[0]);
    }
  };

  const processImage = async (file: File) => {
    setLoading(true);
    setError('');
    setOcrText('');
    setParsedData(null);
    try {
      // Send image to Claude API endpoint
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/claude-parse', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to parse image with Claude API');
      }
      const json = await response.json();
      // If the response is an array of key-value pairs, set directly. Otherwise, adapt as needed.
      setParsedData(json);
      setOcrText(JSON.stringify(json, null, 2));
      console.log(json);
    } catch (err) {
      setError('Failed to process image with Claude API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Inventory Scanner</h2>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageChange}
      />
      {image && <img src={image} alt="Captured" style={{ width: '100%', marginTop: 16 }} />}
      {loading && <p>Processing image...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {ocrText && (
        <div>
          <h4>Extracted Text:</h4>
          <pre style={{ background: '#f4f4f4', padding: 8 }}>{ocrText}</pre>
        </div>
      )}
      {parsedData && (
        <div>
          <h4>Parsed Data:</h4>
          <ul>
            {parsedData.map((item, idx) => (
              <li key={idx}><b>{item.key}</b>: {item.value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Scanner;
