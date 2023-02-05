import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from 'react';
import LoginPage from '.';
import { GOOGLE_OAUTH_ID, KAKAO_OAUTH_ID } from '../../configs/GlobalConfig';

function LoginWrapperPage() {
  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_OAUTH_ID);
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_OAUTH_ID}>
      <LoginPage />
    </GoogleOAuthProvider>
  );
}
export default LoginWrapperPage;
