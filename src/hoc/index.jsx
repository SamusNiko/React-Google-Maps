import React from 'react';
import App from '@/components/App';
import Auth from '@/components/Auth';
import { Layout } from 'antd';
import { Logo, LogOut } from './styles';
import LogOutButton from '@/components/Buttons/LogOutButton';

class Wrapper extends React.Component {
  constructor() {
    super();
    this.state = {
      isAuth: false,
      userData: {
        email: localStorage.email,
        localId: localStorage.localUserId
      },
      isRememberUser: false
    };
  }

  componentDidMount() {
    const { userData } = this.state;
    if (userData.email && userData.localId) {
      this.setState({ isAuth: true });
    }
  }

  getUserData = data => {
    this.setState({ userData: data, isAuth: true });
  };

  logOut = () => {
    this.setState({ userData: [], isAuth: false });
    localStorage.clear();
  };

  rememberUser = e => {
    console.log(e.target.checked);
    this.setState({ isRememberUser: e.target.checked });
  };

  render() {
    const { isAuth, userData, isRememberUser } = this.state;
    return (
      <Layout>
        <Logo>
          React-Maps
          {isAuth ? (
            <LogOut>
              {userData.email ? userData.email : null}
              <LogOutButton type="primary" onClick={this.logOut} shape="circle" icon="logout" />
            </LogOut>
          ) : null}
        </Logo>
        {isAuth ? (
          <App userData={userData} />
        ) : (
          <Auth
            getUserData={this.getUserData}
            isRememberUser={isRememberUser}
            rememberUser={this.rememberUser}
          />
        )}
      </Layout>
    );
  }
}

export default Wrapper;
