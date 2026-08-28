import { useEffect, useState } from 'react';

import { AppProvider, useApp } from './AppContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

import AppShell from './components/AppShell';
import Toast from './components/Toast';


/* =========================================================
   ROOT COMPONENT
   Controls which main screen is currently displayed
========================================================= */

function Root() {

  const [view, setView] = useState('landing');

  const {
    toast,
    logout: logoutUser,
    currentUser,
    authLoading,
  } = useApp();


  /* =========================================================
     NAVIGATION
  ========================================================= */

  function goto(v) {
    setView(v);
    window.scrollTo(0, 0);
  }


  /* =========================================================
     AFTER LOGIN / REGISTER
     Open the main SyncBoard application
  ========================================================= */

  function afterAuth() {
    setView('app');
  }


  /* =========================================================
     LOGOUT
  ========================================================= */

  async function logout() {
    try {

      await logoutUser();

      setView('landing');

      toast('Logged out');

    } catch (error) {

      toast(error.message);

    }
  }


  /* =========================================================
     AUTH SESSION CHECK
     If the user already has a valid session,
     automatically open the application
  ========================================================= */

  useEffect(() => {

    if (!authLoading && currentUser) {
      setView('app');
    }

  }, [authLoading, currentUser]);


  /* =========================================================
     AUTH LOADING SCREEN
  ========================================================= */

  if (authLoading) {
    return <div>Loading...</div>;
  }


  /* =========================================================
     MAIN APPLICATION VIEW
  ========================================================= */

  return (
    <>

      {/* Landing Page */}

      {view === 'landing' && (
        <Landing goto={goto} />
      )}


      {/* Login Page */}

      {view === 'login' && (
        <Login
          goto={goto}
          afterAuth={afterAuth}
        />
      )}


      {/* Register Page */}

      {view === 'register' && (
        <Register
          goto={goto}
          afterAuth={afterAuth}
        />
      )}


      {/* Main SyncBoard Application */}

      {view === 'app' && (
        <AppShell logout={logout} />
      )}


      {/* Global Toast Notifications */}

      <Toast />

    </>
  );
}


/* =========================================================
   APP
   Wrap the entire application with AppProvider
========================================================= */

export default function App() {

  return (
    <AppProvider>
      <Root />
    </AppProvider>
  );
}