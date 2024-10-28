import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import './components.css'; 

const LoginPage = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const loginHandler = async (e) => {
 
    e.preventDefault();
    try {
      const response = await axiosInstance.post('auth/login', {
        email: formData.email,
        password: formData.password,
      }
    );
      if (response.data.user) {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Неправильный логин или пароль', life: 3000 });
        console.log(response.data.user)
        navigate('/budget');
      } else {
        toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Неправильный логин или пароль', life: 3000 });
      }
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Неправильный логин или пароль', life: 3000 });
      
    }
  };

  return (
    <div className="login-container p-d-flex p-jc-center p-ai-center p-mt-6" style={{ minHeight: '25rem', backgroundColor: '#f0f4f8',marginLeft:'65rem'  }}>
      <Toast ref={toast} />
      <form onSubmit={loginHandler} className="login-form p-shadow-4 p-p-5 p-border-round" style={{ backgroundColor: 'white', borderRadius: '10px' }}>
        <h2 className="login-title" style={{ textAlign: 'center', color: '#4a4a4a' }}>Вход</h2>

        <div className="p-field">
          <label htmlFor="email" className="p-d-block">Email</label>
          <InputText
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-inputtext-lg"
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        </div>

        <div className="p-field">
          <label htmlFor="password" className="p-d-block">Пароль</label>
          <Password
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            toggleMask
            className="p-inputtext-lg"
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        </div>

        <Button type="submit" label="Войти" className="p-mt-3 p-button-lg" style={{ backgroundColor: '#007ad9', border: 'none', width: '100%' }} />

        <div className="p-mt-3" style={{ textAlign: 'center' }}>
          <span>Нет аккаунта? </span>
          <Link to="/signup" className="p-link" style={{ color: '#007ad9', textDecoration: 'underline' }}>Зарегистрируйтесь</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;