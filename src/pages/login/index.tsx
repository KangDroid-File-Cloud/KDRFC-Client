import { FolderOpenTwoTone, MailTwoTone } from '@ant-design/icons';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from 'antd';
import Title from 'antd/es/typography/Title';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function LoginPage() {
  const navigate = useNavigate();
  // Setup Google Login Hook
  const googleLoginHook = useGoogleLogin({
    flow: 'auth-code',
    redirect_uri: `${window.location.origin}/auth/redirect/google`,
    ux_mode: 'redirect'
  });

  // Setup Kakao Login
  const kakaoLoginHook = () => {
    window.Kakao.Auth.authorize({
      redirectUri: `${window.location.origin}/auth/redirect/kakao`
    });
  };

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
        <SignInButton onClick={() => kakaoLoginHook()}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg"
            width="32px"
            height="32px"
            alt="Kakao OAuth Login"
          />
          Sign-In with Kakao Login
        </SignInButton>
        <SignInButton onClick={() => navigate('/login/self')}>
          <MailTwoTone style={{ fontSize: '32px' }} />
          Sign-In with Email Login
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
