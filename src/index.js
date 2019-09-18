import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './css/index.css';
import './css/sign_in.css';
import './css/disburse_benefits.css';
import './css/beneficiary_details.css';
import './css/homepage.css';
import './css/loader.css'
import './css/style.css'

ReactDOM.render(
  <Router><App /></Router>,
  document.getElementById('root')
)
