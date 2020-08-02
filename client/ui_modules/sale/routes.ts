import Routes from 'next-routes';

export const setupRoutes = ({ routes }: { routes: Routes }) => {
  routes
    .add('packages', '/packages', 'packages')
    .add('addPackage', '/addPackage', 'addPackage')
    .add('contracts', '/contracts', 'contracts')
    .add('addContract', '/addContract', 'addContract')
    .add('editContract', '/editContract/:id', 'editContract')
    .add('orders', '/orders', 'orders')
    .add('addOrder', '/addOrder', 'addOrder')
    .add('editOrder', '/editOrder/:id', 'editOrder')
    .add('printOrder', '/printOrder', 'printOrder');
};
