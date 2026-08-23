import { useState } from 'react';
import { AppProvider, useApp } from './AppContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AppShell from './components/AppShell';
import Toast from './components/Toast';

function Root() {
  const [view, setView] = useState('landing'); // landing | login | register | app
  const { toast } = useApp();

  function goto(v) {
    setView(v);
    window.scrollTo(0, 0);
  }

  function afterAuth() {
    setView('app');
  }

  function logout() {
    setView('landing');
    toast('Logged out');
  }

  return (
    <>
      {view === 'landing' && <Landing goto={goto} />}
      {view === 'login' && <Login goto={goto} afterAuth={afterAuth} />}
      {view === 'register' && <Register goto={goto} afterAuth={afterAuth} />}
      {view === 'app' && <AppShell logout={logout} />}
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  );
}
