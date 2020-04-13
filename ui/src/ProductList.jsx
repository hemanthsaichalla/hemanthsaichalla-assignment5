import React from 'react';
import { Link } from 'react-router-dom';
import graphQLFetch from './graphQLFetch.js';


function InventorySubhead() {
  const subhead = 'Showing all available products';
  return (
    <div>{ subhead }</div>
  );
}

function ProductRow({ product, deleteProduct }) {
  const price = `$${product.Price}`;
  const productID = `${product.id}`;
  return (
    <tr>
      <td id="body_pro_id">{product.id}</td>
      <td>{product.Name}</td>
      <td>{price}</td>
      <td>{product.Category}</td>
      <td>
        <Link to={`/view/${product.id}`}>View</Link>
        { ' | ' }
        <Link to={`/edit/${product.id}`}>Edit</Link>
        { ' | ' }
        <button type="button" onClick={() => { deleteProduct(productID); }}>
          Delete
        </button>
      </td>
    </tr>
  );
}

function ProductTable({ products, deleteProduct }) {
  const productRows = products.map(product => (
    <ProductRow
      key={product.id}
      product={product}
      deleteProduct={deleteProduct}
    />
  ));
  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th id="head_pro_id">id</th>
          <th>Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        {productRows}
      </tbody>
    </table>
  );
}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    const pricedollar = form.priceper.value;
    const price = pricedollar.replace('$', '');
    const product = {
      Name: form.name.value,
      Category: form.category.value,
      Price: price,
      Image: form.image_url.value,
    };
    const { createProduct } = this.props;
    createProduct(product);
    form.reset();
  }

  render() {
    return (
      <form name="productAdd" onSubmit={this.handleSubmit}>
        <div className="grid_container">
          <div>
            <h2>Category</h2>
            <select type="text" name="category" selectedindex={1}>
              <option value="Shirts">Shirts</option>
              <option value="Jeans">Jeans</option>
              <option value="Jackets">Jackets</option>
              <option value="Sweaters">Sweaters</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div>
            <h3>Price Per Unit</h3>
            <input type="text" name="priceper" defaultValue="$" />
          </div>
          <div>
            <h3>Product Name</h3>
            <input type="text" name="name" />
          </div>
          <div>
            <h3>Image URL</h3>
            <input type="text" name="image_url" />
          </div>
        </div>
        <br />
        <button type="submit">Add Product</button>
      </form>
    );
  }
}

export default class MyProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [] };
    this.createProduct = this.createProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  componentDidMount() {
    this.retrieveData();
  }

  async retrieveData() {
    const query = `query {
      productList {
        id Name Price Category Image
      }
    }`;
    const data = await graphQLFetch(query);
    this.setState({ products: data.productList });
  }

  async createProduct(product) {
    const query = `mutation productAdd($product: ProductInputs!) {
      productAdd(product: $product) {
        id
      }
    }`;
    const data = await graphQLFetch(query, { product });
    if (data) {
      this.retrieveData();
    }
  }

  async deleteProduct(productId) {
    // console.log('Delete ID: ', productId);
    const query = `mutation productRemove($productId: Int!) {
      productRemove(id: $productId)
    }`;

    const data = await graphQLFetch(query, { productId });
    if (!data.productRemove) {
      alert('Delete product failed'); // eslint-disable-line no-alert
      return false;
    }
    alert('Delete product successfully'); // eslint-disable-line no-alert
    this.retrieveData();
    return true;
  }

  render() {
    const head = 'My Company Inventory';
    const addhead = 'Add a new product to inventory';
    const { products } = this.state;
    return (
      <React.Fragment>
        <h1>{ head }</h1>
        <InventorySubhead />
        <hr />
        <br />
        <ProductTable products={products} deleteProduct={this.deleteProduct} />
        <br />
        <h3>{ addhead }</h3>
        <hr />
        <ProductAdd createProduct={this.createProduct} />
      </React.Fragment>
    );
  }
}
