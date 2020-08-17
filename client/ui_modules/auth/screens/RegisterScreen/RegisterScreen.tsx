import * as React from 'react';
import { Form, message, Input, Button, Divider } from 'antd';
import { AuthLayout } from '../../../../layouts/Auth/AuthLayout';
import { initFirebase } from '../../../../firebase';
import firebase from 'firebase';
import './RegisterScreen.less';
import { FormInstance } from 'antd/lib/form';

interface State {
  loading: {
    Register: boolean;
    getVerifyCode: boolean;
    requestResetPassword: boolean;
    changePassword: boolean;
  };
}
interface Props {
  loggedIn?: string;
}
export class RegisterScreen extends React.Component<Props, State> {
  state: State = {
    loading: {
      Register: false,
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

  // Register = async (values: any) => {
  //   this.setState({
  //     loading: {
  //       ...this.state.loading,
  //       Register: true,
  //     },
  //   });

  //   try {
  //     if (this.state.activeTab === 'email') {
  //       const ret = (await fetchAPI('POST', {
  //         path: 'members/Register',
  //         params: {
  //           email: values.email,
  //           pwd: values.password,
  //           appcode: config.appCode,
  //         },
  //       })) as any;
  //       submitRegisterForm(ret.data.token, ret.data.uid);
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
  //         Register: false,
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

  async Register() {   
    const info = await this.formRef.current.getFieldsValue();
    firebase.auth().signInWithEmailAndPassword(info.email, info.password).catch(function (error) {
      message.error(error.message);
    });
  }

  render() {
    return (
      <AuthLayout pageName='register'>
        <div className={'login-screen'}>
          <div className={'content-wrapper'}>
            <Form
              ref={this.formRef}
              onFinish={() => {
                this.Register();
              }}
              key={'register-form'}
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
                  <Button type='primary' loading={this.state.loading.Register} htmlType='submit'>
                    Đăng ký
                  </Button>
                </span>
              </Form.Item>
            </Form>
          </div>
        </div>
      </AuthLayout>
    );
  }
}
