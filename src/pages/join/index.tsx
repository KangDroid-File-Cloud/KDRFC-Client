import { Button, Form, Input, Typography } from 'antd';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AuthenticationProvider, RegisterAccountCommand } from '../../apis';
import { accountApi } from '../../App';
import { JoinTokenHelper } from '../../helpers/joinTokenHelper';
import { LocalStorageHelper } from '../../helpers/localStorageHelper';

function JoinPage() {
  // Join Token
  const { state } = useLocation();
  const isSelfProvider = state === null;

  const joinToken = !isSelfProvider ? JoinTokenHelper.createJoinTokenFromJwt(state) : undefined;

  // OAuth Information
  const handleRegisterForm = (registerCommand: RegisterAccountCommand) => {
    accountApi
      .joinAccount({
        ...registerCommand,
        authenticationProvider:
          joinToken === undefined ? AuthenticationProvider.Self : joinToken.provider,
        authCode: joinToken === undefined ? registerCommand.authCode : state!
      })
      .then((response) => {
        LocalStorageHelper.setItem('accessToken', response.data.accessToken);
        LocalStorageHelper.setItem('refreshToken', response.data.refreshToken);
      });
  };

  return (
    <JoinRootContainer>
      <JoinMainFrame>
        <Typography.Title level={3} style={{ textAlign: 'center' }}>
          Register Form
        </Typography.Title>
        <Form<RegisterAccountCommand>
          layout="vertical"
          initialValues={{
            email: joinToken?.email
          }}
          onFinish={handleRegisterForm}
        >
          <Form.Item
            label="NickName"
            name="nickname"
            rules={[{ required: true, message: 'Please input your nickname!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Email Address" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>

          {isSelfProvider && (
            <Form.Item label="Password" name="authCode" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Button
              style={{
                height: '45px',
                fontSize: '20sp',
                paddingLeft: '30px',
                paddingRight: '30px'
              }}
              htmlType="submit"
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </JoinMainFrame>
    </JoinRootContainer>
  );
}

const JoinRootContainer = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const JoinMainFrame = styled.div`
  width: 580px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 25px;
`;

export default JoinPage;
