import React from 'react';
import ReactDOM from 'react-dom/client';
import {Routes,Route, BrowserRouter} from 'react-router-dom';
import App from './App';
import Login from './Login';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/todo' element={<App />}></Route>
      </Routes>
    </BrowserRouter>  
);