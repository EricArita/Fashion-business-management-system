import React from 'react';
import './FooterLink.less';

interface Props {
  pageName: 'login'|'register';
  openForgotPassword: () => void;
}
export const FooterLink = (props: Props) => {
  return (
    <div className='links-wrapper'>
      <a onClick={props.openForgotPassword} className='forgot'>Forgot password</a>
      {/* {props.pageName === 'login' && (
        <Link route='/auth/register'>
          <a className='login-register'>Create an account</a>
        </Link>
      )} */}
      {/* {props.pageName === 'register' && (
        <Link route='/auth/login'>
          <a className='login-register'>Already have an account? Log in</a>
        </Link>
      )} */}
    </div>
  );
};
