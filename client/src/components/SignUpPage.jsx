import React, { useState } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

const SignUpPage = ({ signupHandler }) => {
  const [formData, setFormData] = useState({
    email: '',
    user_name: '',  
    password: 0,
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

   
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    signupHandler(e, formData); 
  };

  return (
    <div className="p-d-flex p-jc-center p-ai-center p-mt-6">
      <form onSubmit={handleSubmit} className="p-d-flex p-flex-column p-shadow-3 p-p-4 p-border-round">
        <h2>Registration</h2>

        <div className="p-field">
          <label htmlFor="name">Username</label>  {/* Исправлено на "name" */}
          <InputText
            id="user_name"
            name="user_name"  
            value={formData.user_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="p-field">
          <label htmlFor="email">Email</label>
          <InputText
            id="email"
            name="email"  
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="p-field">
          <label htmlFor="password">Password</label>
          <Password
            id="password"
            name="password"  
            value={formData.password}
            onChange={handleChange}
            required
            toggleMask
          />
        </div>

        <div className="p-field">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <Password
            id="confirmPassword"
            name="confirmPassword"  
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            toggleMask
          />
        </div>

        <Button type="submit" label="Register" className="p-mt-3" />
      </form>
    </div>
  );
};

export default SignUpPage;