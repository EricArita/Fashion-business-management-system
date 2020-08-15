import * as React from 'react';
import { Form, message, Input, Button, Divider } from 'antd';
import { AuthLayout } from '../../../../layouts/Auth/AuthLayout';
import { fetchAPI } from '../../../../helper';
import { initFirebase } from '../../../../firebase';
import firebase from 'firebase';
import './LoginScreen.less';
import { FormInstance } from 'antd/lib/form';

interface State {
  loading: {
    login: boolean;
    getVerifyCode: boolean;
    requestResetPassword: boolean;
    changePassword: boolean;
  };
}
interface Props {
  loggedIn?: string;
}
export class LoginScreen extends React.Component<Props, State> {
  state: State = {
    loading: {
      login: false,
      getVerifyCode: false,
      requestResetPassword: false,
      changePassword: false,
    },
  };
  formRef = React.createRef<FormInstance>();

  // componentDidMount() {
  //   (window as any).recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha', {
  //     size: 'invisible',
  //   });
  // }

  // login = async (values: any) => {
  //   this.setState({
  //     loading: {
  //       ...this.state.loading,
  //       login: true,
  //     },
  //   });

  //   try {
  //     if (this.state.activeTab === 'email') {
  //       const ret = (await fetchAPI('POST', {
  //         path: 'members/login',
  //         params: {
  //           email: values.email,
  //           pwd: values.password,
  //           appcode: config.appCode,
  //         },
  //       })) as any;
  //       submitLoginForm(ret.data.token, ret.data.uid);
  //     } else {
  //       await (window as any).confirmationResult.confirm(values.verificationCode);
  //       const [serviceProxy, idToken] = await Promise.all([
  //         getServiceProxy(),
  //         firebase.auth().currentUser!.getIdToken(true),
  //       ]);
  //       await serviceProxy.registerUser({ idToken });

  //       message.success('Log in success!!');
  //       window.location.href = '/dashboard';
  //     }
  //     return true;
  //   } catch (error) {
  //     message.error(error.message);
  //     this.setState({
  //       loading: {
  //         ...this.state.loading,
  //         login: false,
  //       },
  //     });
  //     return false;
  //   }
  // };

  //formRef = React.createRef<FormInstance>();

  constructor(props) {
    super(props);
    initFirebase();
  }

  async login() {   
    const info = await this.formRef.current.getFieldsValue();
    firebase.auth().signInWithEmailAndPassword(info.email, info.password).catch(function (error) {
      message.error(error.message);
    });
  }

  render() {
    return (
      <AuthLayout pageName='login'>
        <div className={'login-screen'}>
          <div className={'content-wrapper'}>
            <Form
              ref={this.formRef}
              onFinish={() => {
                this.login();
              }}
              key={'login-form'}
            >
              <Form.Item name='email'>
                <Input placeholder='Email' type='email' />
              </Form.Item>
              <Form.Item name='password'>
                <Input.Password placeholder={'Mật khẩu'} type='password'
                />
              </Form.Item>
              <Form.Item>
                <span className={'space-between-item button-accept-props'}>
                  <Button type='primary' loading={this.state.loading.login} htmlType='submit'>
                    Đăng nhập
                          </Button>
                </span>
              </Form.Item>
            </Form>
            <span className={'space-between-item'}>
              <Divider>
                <span>Hoặc</span>
              </Divider>
            </span>
            <span className={'space-between-item button-back-props'}>
              <Button>
                Quên mật khẩu
              </Button>
            </span>
          </div>
        </div>
      </AuthLayout>
    );
  }
}
