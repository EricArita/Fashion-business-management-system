import React from 'react';
import { LoginScreen } from '../ui_modules/auth/screens/LoginScreen/LoginScreen';

interface Props {}
interface State {}
class LoginPage extends React.Component<Props, State> {
  static async getInitialProps() {
    return {
      namespacesRequired: ['common'],
    };
  }

  render() {
    return <LoginScreen />;
  }
}
export default LoginPage;
