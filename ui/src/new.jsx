import React from 'react';
import graphQLFetch from './graphQLFetch.js';
import NumInput from './NumInput.jsx';
import TextInput from './TextInput.jsx';


export default class ProductEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      product: {},
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.retrieveData();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.retrieveData();
    }
  }

  onChange(event, naturalValue) {
    const { name, value: textValue } = event.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState => ({
      product: { ...prevState.product, [name]: value },
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { product } = this.state;
    const query = `mutation productUpdate(
      $id: Int!
      $modify: ProductUpdateInputs!
    ) {
      productUpdate(
        id: $id
        modify: $modify
      ) {
        id Name Price Category Image
      }
    }`;

    const { id, ...modify } = product;
    const data = await graphQLFetch(query, { modify, id });
    if (data) {
      this.setState({ product: data.productUpdate });
      alert('Updated product successfully'); // eslint-disable-line no-alert
    }
  }

  async retrieveData() {
    const query = `query Product($id: Int!) {
      Product(id: $id) {
        id Name Price Category Image
      }
    }`;
    const { match: { params: { id } } } = this.props;
    const data = await graphQLFetch(query, { id });
    this.setState({ product: data.Product });
  }

  render() {
    const { product: { Name, Price, Image } } = this.state;
    const { product: { id } } = this.state;
    const { product: { Category } } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>{`Editing product ID: ${id}`}</h3>
        <table>
          <tbody>
            <tr>
              <td width="100">Category</td>
              <td>
                <select name="Category" value={Category} onChange={this.onChange}>
                  <option value="Shirts">Shirts</option>
                  <option value="Jeans">Jeans</option>
                  <option value="Jackets">Jackets</option>
                  <option value="Sweaters">Sweaters</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </td>
            </tr>
            <tr>
              <td width="100">Name</td>
              <td>
                <TextInput
                  name="Name"
                  value={Name}
                  onChange={this.onChange}
                  key={id}
                />
              </td>
            </tr>
            <tr>
              <td width="100">Price Per Unit:</td>
              <td>
                { ' $ ' }
                <NumInput
                  name="Price"
                  value={Price}
                  onChange={this.onChange}
                  key={id}
                />
              </td>
            </tr>
            <tr>
              <td width="100">Image:</td>
              <td>
                <TextInput
                  size={100}
                  name="Image"
                  value={Image}
                  onChange={this.onChange}
                  key={id}
                />
              </td>
            </tr>
            <tr>
              <td />
              <td><button type="submit">Submit</button></td>
            </tr>
          </tbody>
        </table>
      </form>
    );
  }
}
