import Routes from 'next-routes';

export const setupRoutes = ({ routes }: { routes: Routes }) => {
  routes
    .add('companies', '/companies', 'companies')
    .add('addCompany', '/addCompany', 'addCompany')
    .add('suppliers', '/suppliers', 'suppliers')
    .add('addSupplier', '/addSupplier', 'addSupplier')
    .add('wholesalers', '/wholesalers', 'wholesalers')
    .add('addWholesaler', '/addWholesaler', 'addWholesaler')
    .add('categories', '/categories', 'categories')
    .add('editCategory', '/editCategory/:id', 'editCategory')
    .add('products', '/products', 'products')
    .add('profile', '/profile', 'profile')
    .add('editProfile', '/editProfile/:id', 'editProfile')
    .add('changePwd', '/changePwd/:id', 'changePwd');
};
