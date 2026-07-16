import {StrictMode, lazy, Suspense, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import App from './App.tsx';
import './index.css';

const RegistrationPage = lazy(() => import('./components/RegistrationPage.tsx').then(m => ({ default: m.RegistrationPage })));

const CTFRedirect = () => {
  useEffect(() => {
    window.location.href = 'https://ascendantctf.vercel.app/';
  }, []);
  return null;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/ctf" element={<CTFRedirect />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);
