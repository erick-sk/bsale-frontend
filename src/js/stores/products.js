import { BACKEND_URL } from '../constants.js';
import { Store } from '../utils.js';

class ProductStore extends Store {
  constructor() {
    super();
    this.products = [];
  }

  getProduct(id) {
    return this.products.find((product) => product.id === id);
  }

  async getProducts() {
    try {
      const response = await fetch(`${BACKEND_URL}/products`);
      const data = await response.json();

      this.products = data;
      this.dispatch({ type: 'LOAD_PRODUCTS', data });
    } catch (error) {
      console.log(error);
    }
  }

  // get products by filter
  async getProductsByFilter(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      this.products = data;
      this.dispatch({ type: 'LOAD_PRODUCTS', data });
    } catch (error) {
      console.log(error);
    }
  }

  // get categories
  async getCategories() {
    try {
      const response = await fetch(`${BACKEND_URL}/categories`);
      const data = await response.json();

      this.categories = data;
      this.dispatch({ type: 'LOAD_CATEGORIES', data });
    } catch (error) {
      console.log(error);
    }
  }
}

export const store = new ProductStore();
