import { DownOutlined, FolderOpenTwoTone, LaptopOutlined } from '@ant-design/icons';
import { Dropdown, Layout, Menu, MenuProps, Typography } from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AccessTokenPayload, parseJwtPayload } from '../helpers/jwtHelper';
import { LocalStorageHelper } from '../helpers/localStorageHelper';

interface ReactChild {
  children: ReactNode;
}

function MainLayout({ children }: ReactChild) {
  const navigate = useNavigate();
  const menuItems: MenuProps['items'] = [
    {
      key: 1,
      icon: <LaptopOutlined />,
      label: 'File Explorer',
      onClick: () => {
        navigate('/explorer');
      }
    }
  ];

  const accountMenuItems: MenuProps = {
    items: [
      {
        key: 1,
        label: 'Log Out',
        onClick: () => {
          LocalStorageHelper.removeItemByKey('accessToken');
          LocalStorageHelper.removeItemByKey('refreshToken');
          navigate('/login');
        }
      }
    ]
  };

  // Make sure user exists: TODO - Move to somewhat global middleware(?)
  const [user, setUser] = useState<AccessTokenPayload>({
    email: '',
    nickname: '',
    rootid: '',
    sub: '',
    exp: 0
  });
  const accessToken = LocalStorageHelper.getItem('accessToken')!;
  useEffect(() => {
    setUser(parseJwtPayload<AccessTokenPayload>(accessToken));
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Header
        style={{
          backgroundColor: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <LogoArea onClick={() => navigate('/')}>
          <FolderOpenTwoTone style={{ fontSize: '32px' }} />
          <Typography.Title level={3} style={{ margin: 0 }}>
            File Cloud
          </Typography.Title>
        </LogoArea>
        <Dropdown menu={accountMenuItems} placement="bottomRight" arrow>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div>{user.nickname}</div>
            <DownOutlined />
          </div>
        </Dropdown>
      </Layout.Header>
      <Layout>
        <Layout.Sider width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Layout.Sider>
        <Layout.Content
          style={{
            height: 'calc(100vh - 64px)',
            overflowY: 'auto'
          }}
        >
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

export default MainLayout;
