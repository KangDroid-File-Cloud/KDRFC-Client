import { FolderOpenTwoTone } from '@ant-design/icons';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from 'antd';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthenticationProvider } from '../../apis';
import { accountApi } from '../../App';
import { JoinTokenHelper } from '../../helpers/joinTokenHelper';
import { LocalStorageHelper } from '../../helpers/localStorageHelper';

function LoginPage() {
  const navigate = useNavigate();

  // Common OAuth Login Handler
  async function handleOAuthAccount(provider: AuthenticationProvider, oAuthCode: string) {
    try {
      const response = await accountApi.loginAccount({
        authenticationProvider: provider,
        authCode: oAuthCode
      });

      LocalStorageHelper.setItem('accessToken', response.data.accessToken);
      LocalStorageHelper.setItem('refreshToken', response.data.refreshToken);
    } catch (error) {
      handleLoginError(error);
    }
  }

  // Login Error Handler(redirecting to join)
  const handleLoginError = (error: unknown) => {
    // Case 1. Error is not axios error.
    if (!axios.isAxiosError(error)) throw error;

    // Case 2. OAuth user does not exists.
    if (error.response?.status === 404) {
      // 1. Parse Join Token
      const { joinToken } = error.response.data;
      const joinTokenParsed = JoinTokenHelper.createJoinTokenFromJwt(joinToken);

      // 2. Navigate to join page.(TODO: Properly create join page)
      navigate('/', { state: joinTokenParsed });
    }
  };

  // Setup Google Login Hook
  const googleLoginHook = useGoogleLogin({
    onSuccess: (oAuthCodeResponse) =>
      handleOAuthAccount(AuthenticationProvider.Google, oAuthCodeResponse.code),
    flow: 'auth-code'
  });

  return (
    <RootLoginContainer>
      <FolderOpenTwoTone style={{ fontSize: '120px' }} />
      <Title level={2} style={{ textAlign: 'center' }}>
        File Cloud
      </Title>
      <LoginButtonContainer>
        <SignInButton onClick={() => googleLoginHook()}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            width="32px"
            height="32px"
            alt="Google OAuth Login"
          />
          Sign-In with Google Login
        </SignInButton>
        <SignInButton>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg"
            width="32px"
            height="32px"
            alt="Kakao OAuth Login"
          />
          Sign-In with Kakao Login
        </SignInButton>
      </LoginButtonContainer>
    </RootLoginContainer>
  );
}

// Top-Spanning Container
const RootLoginContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

// Login Button Container
const LoginButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 25px;
`;

// Button Custom Style
const SignInButton = styled(Button)`
  height: 50px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 60px;
  padding-right: 60px;
`;

export default LoginPage;
