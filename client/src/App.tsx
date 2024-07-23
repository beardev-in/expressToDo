import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './features/dashboard/Dashboard';
import Register from './features/register/Register';
import PrivateRoutes from './components/PrivateRoutes';
import Landing from './components/Landing';
import './App.css'


const App : React.FC = function App() {
  return (
  <Router>
    <Routes>
      <Route path="/">
        <Route index element={<Landing />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<PrivateRoutes/>}>
        <Route path="/dashboard" element={<Dashboard/>} />
      </Route>
      {/* <Route path="*" element={<NotFound />}/> */}
    </Routes>
  </Router>
  )
}

export default App
