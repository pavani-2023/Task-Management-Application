import { useState } from "react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      alert("Signup successful! Token: " + response.data.token);
      navigate('/home');
    } catch (error) {
      alert("Signup failed: " + error.response.data.message);
    }
  };

  return (
    <div className="signup-page">
      
      <div className="signup-form-container">
        <h1>Sign Up</h1>
        <div className="signup-form">
            <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="signup-btn">Sign Up</button>
          </form>
        </div>
        
      </div>
    </div>
  );
}
