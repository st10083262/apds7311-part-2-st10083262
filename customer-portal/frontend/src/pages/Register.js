import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaIdCard, FaCreditCard } from 'react-icons/fa';
import axiosInstance from '../utils/axiosInstance';


const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    username: '',
    accountNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Regex Patterns
    const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/; // Alphanumeric and underscore, 3-15 chars
    const idNumberRegex = /^\d{13}$/; // 13 digits for ID number
    const accountNumberRegex = /^\d{10,16}$/; // 10-16 digits for account number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Password complexity

    if (!formData.name || !formData.idNumber || !formData.username || !formData.accountNumber || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (!usernameRegex.test(formData.username)) {
      setError('Username must be 3-15 characters long and can only contain letters, numbers, and underscores.');
      return;
    }
    if (!idNumberRegex.test(formData.idNumber)) {
      setError('ID Number must be exactly 13 digits long.');
      return;
    }
    if (!accountNumberRegex.test(formData.accountNumber)) {
      setError('Account Number must be between 10 to 16 digits long.');
      return;
    }
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    setLoading(true);

    try {
      console.log('Sending registration data:', formData); // Debugging log

      const response = await axiosInstance.post('/user/register', formData);

      if (response.status === 201) {
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      console.error('Error during registration:', err); // Log the entire error
      if (err.response) {
        console.error('Server responded with error:', err.response.data); // Log server response
        setError(err.response.data.message || 'Error registering user. Please try again.');
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-red-100 to-red-300">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-red-600">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 mt-1 p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
              aria-label="Full Name"
            />
          </div>
          <div className="relative">
            <FaIdCard className="absolute left-3 top-3 text-gray-400" />
            <input
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              className="w-full pl-10 mt-1 p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-transparent"
              placeholder="Enter your ID number"
              required
              aria-label="ID Number"
            />
          </div>
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 mt-1 p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-transparent"
              placeholder="Enter your username"
              required
              aria-label="Username"
            />
          </div>
          <div className="relative">
            <FaCreditCard className="absolute left-3 top-3 text-gray-400" />
            <input
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              className="w-full pl-10 mt-1 p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-transparent"
              placeholder="Enter your account number"
              required
              aria-label="Account Number"
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 mt-1 p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-transparent"
              placeholder="Enter your password"
              required
              aria-label="Password"
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 mt-1 p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-transparent"
              placeholder="Confirm your password"
              required
              aria-label="Confirm Password"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition duration-300 text-lg font-semibold shadow-md"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already registered?{' '}
            <Link to="/login" className="font-medium text-red-600 hover:text-red-500 transition duration-300">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
