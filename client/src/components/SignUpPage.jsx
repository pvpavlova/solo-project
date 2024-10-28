import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Link, useNavigate  } from 'react-router-dom';
import './components.css'; 

const SignUpPage = ({ signupHandler }) => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    user_name: '',
    password: '',
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
    <div className="signup-container p-d-flex p-jc-center p-ai-center p-mt-6" style={{ minHeight: '30rem', alignItems:'center',marginLeft:'65rem' }}>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit} className="signup-form p-shadow-4 p-p-5 p-border-round" style={{ backgroundColor: 'white', borderRadius: '10px' }}>
        <h2 className="signup-title" style={{ textAlign: 'center', color: '#4a4a4a' }}>Регистрация</h2>

        <div className="p-field">
          <label htmlFor="user_name" className="p-d-block">Имя пользователя</label>
          <InputText
            id="user_name"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            required
            className="p-inputtext-lg"
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        </div>

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

        <div className="p-field">
          <label htmlFor="confirmPassword" className="p-d-block">Подтвердите пароль</label>
          <Password
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            toggleMask
            className="p-inputtext-lg"
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        </div>

        <Button type="submit" label="Зарегистрироваться" className="p-mt-3 p-button-lg" style={{ backgroundColor: '#007ad9', border: 'none', width: '100%' }} />

        <div className="p-mt-3" style={{ textAlign: 'center' }}>
          <span>Уже есть аккаунт? </span>
          <Link to="/login" className="p-link" style={{ color: '#007ad9', textDecoration: 'underline' }}>Войти</Link>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;