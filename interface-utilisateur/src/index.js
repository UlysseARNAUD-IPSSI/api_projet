import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './screens/App';
import reportWebVitals from './reportWebVitals';

const Config = require('./helpers/configuration');
Config.folder = 'config';

const Trans = {...Config};
Trans.folder = `translations/${Config.get('app.language', 'fr')}`;


ReactDOM.render(
  <React.StrictMode>
    <App config={Config.get.bind(Config)} trans={Trans.get.bind(Trans)} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
