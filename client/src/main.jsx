import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './appRouter';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

// TODO: create a branch a make the front end in it