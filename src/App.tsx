import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import { AccountApi, Configuration } from './apis';
import { GOOGLE_OAUTH_ID } from './configs/GlobalConfig';
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
          <GoogleOAuthProvider clientId={GOOGLE_OAUTH_ID}>
            <LoginPage />
          </GoogleOAuthProvider>
        }
      />
    </Routes>
  );
}

export default App;
