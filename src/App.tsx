import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import { AccountApi, Configuration } from './apis';
import JoinPage from './pages/join';
import LoginPage from './pages/login';

// Axios/API Init Area
const axiosInstance = axios.create();
const apiConfiguration = new Configuration({
  basePath: 'http://localhost:5096'
});

export const accountApi = new AccountApi(apiConfiguration, undefined, axiosInstance);

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
      <Route path="/join" element={<JoinPage />} />
    </Routes>
  );
}

export default App;
