import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './components/HOC/ProtectedRoute';
import { useEffect, useState } from 'react';
import axiosInstance, { setAccessToken } from './services/axiosInstance';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import SignupPage from './components/SignUpPage';
import LoginPage from './components/LoginPage';
import BudgetPage from './components/Budget/BudgetPage'
import Root from "./Root";

function App() {
  const [user, setUser] = useState();

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
      element: <Root user={user} logoutHandler={logoutHandler}/>,
      children: [
        {
          element: <ProtectedRoute isAllowed={user !== null} />,
          children: [
             {
          path: '/budget',
          element: <BudgetPage  />,
        },
          ],
        },
        {
          path: '/signup',
          element: <SignupPage signupHandler={signupHandler} />,
        },
        {
          path: '/login', 
          element: <LoginPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;