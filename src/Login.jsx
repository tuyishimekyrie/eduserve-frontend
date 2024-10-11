import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image from './images/serious.jpg';
import './Login.css'; // Import the CSS for styling
import logo from './images/logo.png'; // Use a local logo file
import { ToastContainer, toast } from 'react-toastify'; // Importing Toastify
import { ThreeDots } from 'react-loader-spinner'; // Importing Loader
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // State to store selected role
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: parseInt(userId), password, role }), // Send role to backend
      });

      const data = await response.json();
      setLoading(false); // Set loading to false after request is done

      if (data.success) {
        localStorage.setItem('token', data.token); // Store token in localStorage
        localStorage.setItem('role', role); // Store role in localStorage
        toast.success(data.message || 'Login successful!'); // Show success message

        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          navigate('/dashboard'); // Redirect to dashboard or another route
        }, 2000); // 2 seconds delay for a better user experience
      } else {
        toast.error(data.message || 'Login failed. Please try again.'); // Show error message
      }
    } catch (error) {
      setLoading(false); // Set loading to false on error
      console.error('Error logging in:', error);
      toast.error('An error occurred. Please try again later.'); // Show error message
    }
  };

  return (
    <div className='login-page'>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
      />
      <div className='login-container'>
        <div className='login-form-section'>
          <div className='login-content'>
            <img src={logo} alt='University Logo' className='logo' />
            <h2>Login</h2>
            <p>Welcome! Please enter your details.</p>
            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <label htmlFor='userId'>Enter your Email or ID</label>
                <input
                  type='text'
                  id='userId'
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor='password'>Password</label>
                <input
                  type='password'
                  id='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className='role-selection'>
                <label>Select your role:</label>
                <div className='radio-option'>
                  <input
                    type='radio'
                    id='finance'
                    name='role'
                    value='finance'
                    checked={role === 'finance'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <label htmlFor='finance'>Finance</label>
                </div>
                <div className='radio-option'>
                  <input
                    type='radio'
                    id='registrar'
                    name='role'
                    value='registrar'
                    checked={role === 'registrar'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <label htmlFor='registrar'>Registrar</label>
                </div>
                <div className='radio-option'>
                  <input
                    type='radio'
                    id='director'
                    name='role'
                    value='director'
                    checked={role === 'director'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <label htmlFor='director'>Director</label>
                </div>
              </div>

              <button type='submit' className='submit-btn'>
                {loading ? (
                  <ThreeDots color='#fff' height={20} width={20} />
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
            <p>
              Don't have an account? <a href='/signup'>Sign Up</a>
            </p>
          </div>
        </div>
        <div className='login-image-section'>
          <img src={image} alt='Eduserve' />
        </div>
      </div>
    </div>
  );
};

export default Login;
