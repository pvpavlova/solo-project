import React, { useEffect, useState, useRef } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import axiosInstance, { setAccessToken } from './services/axiosInstance';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import ProtectedRoute from './components/HOC/ProtectedRoute';
import SignupPage from './components/SignUpPage';
import LoginPage from './components/LoginPage';
import MainBudgetPage from './components/Budget/MainBudgetPage';
import Calendar from './components/Calendar/Calendar'
import Root from "./Root";

export default function App() {
  const [user, setUser] = useState(null);
  const toast = useRef(null);
 useEffect(() => {
    axiosInstance
      .get('/tokens/refresh')
      .then((res) => {
        setUser(res.data.user);
        setAccessToken(res.data.accessToken);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

 const signupHandler = async (e, formData) => {
    e.preventDefault();
    const response = await axiosInstance.post('/auth/signup', formData);
    setUser(response.data.user);
    setAccessToken(response.data.accessToken);
  };

  const loginHandler = async (e, formData) => {
    e.preventDefault();
    const response = await axiosInstance.post('/auth/login', formData);
    setUser(response.data.user);
    setAccessToken(response.data.accessToken);
  };
  
  const logoutHandler = async () => {
    await axiosInstance.get('/auth/logout');
    setUser(null);
    setAccessToken('');
  };
 const router = createBrowserRouter([
  {
    path: "/",
    element: <Root user={user} logoutHandler={logoutHandler} />,
    children: [
      {
        path: '/login',
        element: <LoginPage loginHandler={loginHandler} />,
      },
      {
        path: '/signup',
        element: <SignupPage signupHandler={signupHandler} />,
      },
      {
        path: '/budget',
        element: (
          <ProtectedRoute isAllowed={user !== null}>
            <MainBudgetPage user={user} />
          </ProtectedRoute>
        ),
      }, {
        path: '/calendar',
        element: (
          <ProtectedRoute isAllowed={user !== null}>
            <Calendar user={user} />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

  return <RouterProvider router={router} />;
}
