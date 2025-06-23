import { useState } from 'react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom';

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import AppRoutes from './AppRoute/AppRoute';

function App() {
  

  return (
    <>
     <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
    </>
  )
}

export default App
