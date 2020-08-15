import Routes from 'next-routes';

export const setupRoutes = ({ routes }: { routes: Routes }) => {
  routes
    .add('register', '/register', 'register')
    .add('login', '/login', 'login');
};
