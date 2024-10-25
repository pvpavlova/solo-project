import React, { useState, useRef } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axiosInstance from '../services/axiosInstance';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const toast = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const loginHandler = async (e, formData) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('auth/login', {
        email: formData.email,
        password: formData.password,

      });

      if (response.data.user) {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Login successful', life: 3000 });
      } else {
        toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Login failed', life: 3000 });
      }

    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Login failed', life: 3000 });
    }
  };

  return (
    <div className="p-d-flex p-jc-center p-ai-center p-mt-6">
      <Toast ref={toast} />
      
      <form onSubmit={(e) => loginHandler(e, formData)} className="p-d-flex p-flex-column p-shadow-3 p-p-4 p-border-round">
        <h2>Login</h2>

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

        <Button type="submit" label="Login" className="p-mt-3" />
      </form>
    </div>
  );
};

export default LoginPage;