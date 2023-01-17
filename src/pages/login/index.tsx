import { FolderOpenTwoTone } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import styled from 'styled-components';

const { Text, Link } = Typography;
function LoginPage() {
  return (
    <RootLoginContainer>
      <LogoTextContainer>
        <FolderOpenTwoTone style={{ fontSize: '120px' }} />
        <Title level={2} style={{ textAlign: 'center' }}>
          File Cloud
        </Title>
      </LogoTextContainer>
      <LoginButtonContainer>
        <SignInButton>
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

// Logo and Text Container
const LogoTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
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
