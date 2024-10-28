import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './components/ui/NavBar'
export default function Root({user, logoutHandler}) {
  return (
    <>
      <NavBar user={user} logoutHandler={logoutHandler}/>
      <Outlet />
    </>
  );
}