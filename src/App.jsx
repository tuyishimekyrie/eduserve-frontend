import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';

// A utility function to check if the user is authenticated (i.e., if a token is stored)
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token; // Returns true if there's a token, otherwise false
};

// A wrapper component to protect routes that require authentication
const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to='/login' />;
};
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public route: Login */}
        <Route path='/login' element={<Login />} />

        {/* Private route: Dashboard, accessible only if logged in */}
        <Route
          path='/dashboard'
          element={<PrivateRoute element={<Dashboard />} />}
        />

        {/* Default route: Redirect to login if no route is matched */}
        <Route path='*' element={<Navigate to='/login' />} />
      </Routes>
    </Router>
  );
};

export default App;
