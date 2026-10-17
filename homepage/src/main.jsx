import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const revealPage = (useFallback = false) => {
  if (useFallback) {
    document.documentElement.classList.add('fonts-fallback');
  }
  document.documentElement.classList.remove('fonts-loading');
};

if (document.fonts) {
  let revealed = false;
  const finish = (useFallback) => {
    if (revealed) return;
    revealed = true;
    window.clearTimeout(timeout);
    revealPage(useFallback);
  };
  const timeout = window.setTimeout(() => finish(true), 2000);

  Promise.all([
    document.fonts.load('400 16px "CMU Serif"'),
    document.fonts.load('700 16px "CMU Serif"'),
  ])
    .then((faces) => finish(faces.some((face) => face.length === 0)))
    .catch(() => finish(true));
} else {
  revealPage(true);
}
