import { WarningTwoTone } from '@ant-design/icons';
import { Button, Form, Input, notification, Typography } from 'antd';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthenticationProvider, LoginRequest } from '../../../apis';
import { accountApi } from '../../../App';
import { LocalStorageHelper } from '../../../helpers/localStorageHelper';

function SelfLoginPage() {
  var navigate = useNavigate();

  const handleLoginForm = (loginRequest: LoginRequest) => {
    accountApi
      .loginAccount({
        ...loginRequest,
        authenticationProvider: AuthenticationProvider.Self
      })
      .then((response) => {
        LocalStorageHelper.setItem('accessToken', response.data.accessToken);
        LocalStorageHelper.setItem('refreshToken', response.data.refreshToken);
      })
      .catch((error) => {
        if (isAxiosError(error) && error.response?.status === 401) {
          notification.open({
            message: 'Error!',
            description: 'Please check login credential and try again.',
            icon: <WarningTwoTone />,
            placement: 'bottomRight'
          });
        } else {
          notification.open({
            message: 'Unknown Error!',
            description: 'Unknown error occurred. Please try again later.',
            icon: <WarningTwoTone />,
            placement: 'bottomRight'
          })
        }
      });
  };

  return (
    <SelfLoginRootContainer>
      <SelfLoginMainFrame>
        <Typography.Title level={3} style={{ textAlign: 'center' }}>
          Login
        </Typography.Title>
        <Form<LoginRequest> layout="vertical" onFinish={handleLoginForm}>
          <Form.Item label="Email Address" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Password" name="authCode" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>

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
                paddingRight: '30px',
                marginRight: '10px'
              }}
              onClick={() => navigate('/join')}
            >
              Not An User? Regiser Now.
            </Button>
            <Button
              style={{
                height: '45px',
                fontSize: '20sp',
                paddingLeft: '30px',
                paddingRight: '30px',
                marginLeft: '10px'
              }}
              htmlType="submit"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </SelfLoginMainFrame>
    </SelfLoginRootContainer>
  );
}

const SelfLoginRootContainer = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SelfLoginMainFrame = styled.div`
  width: 580px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 25px;
`;

export default SelfLoginPage;
