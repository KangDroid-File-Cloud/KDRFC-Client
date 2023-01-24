import { Button, Form, Input, Typography } from 'antd';
import styled from 'styled-components';
import { RegisterAccountCommand } from '../../apis';

function JoinPage() {
  return (
    <JoinRootContainer>
      <JoinMainFrame>
        <TitleWrapper level={3}>Register Form</TitleWrapper>
        <Form<RegisterAccountCommand> layout="vertical">
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

const TitleWrapper = styled(Typography.Title)`
  text-align: center;
`;

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
