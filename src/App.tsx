import { GoogleOAuthProvider } from '@react-oauth/google';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <GoogleOAuthProvider clientId="26236061078-9mn6hlht9d4ld2a7ffhti2if9j1lbce1.apps.googleusercontent.com">
            <LoginPage />
          </GoogleOAuthProvider>
        }
      />
    </Routes>
  );
}

export default App;
