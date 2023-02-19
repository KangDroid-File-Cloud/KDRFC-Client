import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import { AccountApi, Configuration } from './apis';
import { FILE_API_BASE_URL } from './configs/GlobalConfig';
import GoogleOAuthCallback from './pages/auth/redirect/google';
import KakaoOAuthCallback from './pages/auth/redirect/kakao';
import JoinPage from './pages/join';
import SelfLoginPage from './pages/login/self';
import LoginWrapperPage from './pages/login/wrappter';

// Axios/API Init Area
const axiosInstance = axios.create();
const apiConfiguration = new Configuration({
  basePath: FILE_API_BASE_URL
});

export const accountApi = new AccountApi(apiConfiguration, undefined, axiosInstance);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginWrapperPage />} />
      <Route path="/login/self" element={<SelfLoginPage />} />
      <Route path="/join" element={<JoinPage />} />
      <Route path="/auth/redirect/google" element={<GoogleOAuthCallback />} />
      <Route path="/auth/redirect/kakao" element={<KakaoOAuthCallback />} />
    </Routes>
  );
}

export default App;
