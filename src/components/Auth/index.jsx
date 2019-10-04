import React from 'react';
import { Form, Icon, message, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import noop from 'react-props-noop';
import SignInButton from '@/components/Buttons/SignInButton';
import RegisterButton from '@/components/Buttons/RegisterButton';
import axios from 'axios';
import { verifyPassword, signupNewUser } from '@/constants';
import { StyledAuth, StyledInput, StyledInputPassword } from './styles';

class Auth extends React.Component {
  handleSignIn = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.loginHandler(values);
      }
    });
  };

  handleRegister = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.registerHandler(values);
      }
    });
  };

  // handleRememberMe = e => {};

  loginHandler = async values => {
    const { getUserData, isRememberUser } = this.props;
    const authData = {
      email: values.email,
      password: values.password,
      returnSecureToken: true
    };
    try {
      const response = await axios.post(verifyPassword, authData);
      console.log(response);
      getUserData(response.data);
      if (isRememberUser) {
        localStorage.email = response.data.email;
        localStorage.localUserId = response.data.localId;
      }
    } catch (e) {
      message.error(e.response.data.error.message);
    }
  };

  registerHandler = async values => {
    const { getUserData } = this.props;
    const authData = {
      email: values.email,
      password: values.password,
      returnSecureToken: false
    };
    try {
      const response = await axios.post(signupNewUser, authData);
      getUserData(response.data);
    } catch (e) {
      message.error(e.response.data.error.message);
    }
  };

  render() {
    const { form, rememberUser } = this.props;
    return (
      <StyledAuth>
        <Form className="login-form">
          <Form.Item>
            {form.getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!'
                },
                {
                  required: true,
                  message: 'Please input your E-mail!'
                }
              ]
            })(<StyledInput placeholder="Enter your email" prefix={<Icon type="mail" />} />)}
          </Form.Item>
          <Form.Item>
            {form.getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }]
            })(<StyledInputPassword placeholder="Input password" prefix={<Icon type="lock" />} />)}
          </Form.Item>
          <Checkbox onChange={rememberUser}>Remember Me</Checkbox>
          <div>
            <SignInButton htmlType="submit" onClick={this.handleSignIn}>
              Log in
            </SignInButton>
            <RegisterButton htmlType="submit" onClick={this.handleRegister}>
              Register now
            </RegisterButton>
          </div>
        </Form>
      </StyledAuth>
    );
  }
}

Auth.propTypes = {
  form: PropTypes.objectOf(PropTypes.any),
  getUserData: PropTypes.func,
  rememberUser: PropTypes.func
};
Auth.defaultProps = {
  form: null,
  getUserData: noop,
  rememberUser: noop
};

const AuthForm = Form.create({ name: 'normal_login' })(Auth);

export default AuthForm;
