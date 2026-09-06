import { useEffect, useState } from 'react';

import { AppProvider, useApp } from './AppContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import JoinTeam from './pages/JoinTeam';

import AppShell from './components/AppShell';
import Toast from './components/Toast';


/* =========================================================
   LINK PARSING
   The app has no router - it's a single-page state machine.
   These two links (from the verification/invitation emails)
   are the only real URLs it needs to understand, so we just
   read window.location once instead of adding a router.
========================================================= */

function readEmailLinkFromUrl() {
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);

  const verifyMatch = path.match(/^\/verify-email\/([^/]+)\/?$/);
  if (verifyMatch) {
    return { view: 'verify-email', token: verifyMatch[1] };
  }

  if (path === '/join' || path.match(/^\/join\/?$/)) {
    const code = params.get('code') || '';
    return { view: 'join', joinCode: code };
  }

  return null;
}


/* =========================================================
   ROOT COMPONENT
   Controls which main screen is currently displayed
========================================================= */

function Root() {

  const initialLink = readEmailLinkFromUrl();

  const [view, setView] = useState(initialLink ? initialLink.view : 'landing');
  const [emailLinkToken] = useState(initialLink ? initialLink.token : null);
  const [emailLinkJoinCode] = useState(initialLink ? initialLink.joinCode : null);
  const [emailLinkType] = useState(initialLink ? initialLink.view : null);

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
    if (emailLinkType === 'join' && emailLinkJoinCode) {
      setView('join');
      return;
    }

    if (emailLinkType === 'join') {
      setView('join');
      return;
    }

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

    // Don't stomp on the verify-email / accept-invite screens just because
    // the user already has a valid session - they still need to see those.
    if (view === 'verify-email' || view === 'join') {
      return;
    }

    if (!authLoading && currentUser) {
      setView('app');
    }

  }, [authLoading, currentUser, view]);


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


      {/* Email verification link */}

      {view === 'verify-email' && (
        <VerifyEmail token={emailLinkToken} goto={goto} />
      )}


      {/* Join Team via link or code */}

      {view === 'join' && (
        <JoinTeam
          initialCode={emailLinkJoinCode}
          goto={goto}
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