import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import MyProductList from './ProductList.jsx';
import ProductView from './ProductView.jsx';
import ProductEdit from './new.jsx';

const NotFound = () => <h1>Page Not Found</h1>;

export default function Main() {
  return (
    <Switch>
      <Redirect exact from="/" to="/products" />
      <Route path="/products" component={MyProductList} />
      <Route path="/view/:id" component={ProductView} />
      <Route path="/edit/:id" component={ProductEdit} />
      <Route component={NotFound} />
    </Switch>
  );
}
