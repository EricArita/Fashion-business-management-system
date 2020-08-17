import React from 'react';
import { RegisterScreen } from '../ui_modules/auth/screens/RegisterScreen/RegisterScreen';

interface Props {}
interface State {}
class RegisterPage extends React.Component<Props, State> {
  static async getInitialProps() {
    return {
      namespacesRequired: ['common'],
    };
  }

  render() {
    return <RegisterScreen />;
  }
}
export default RegisterPage;
