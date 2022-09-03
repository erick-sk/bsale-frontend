import { Store } from '../utils.js';

class CartStore extends Store {
  constructor() {
    super();
  }

  initialize() {
    this.cartProducts = this.getCartFromLocalStorage() ?? [];

    this.dispatch({ type: 'CART_UPDATED', data: this.cartProducts });
    this.on('CART_UPDATED', () => this.saveCartToLocalStorage());
  }

  emptyCart() {
    this.cartProducts = [];
    this.dispatch({ type: 'CART_UPDATED', data: this.cartProducts });
  }

  // delete product
  removeProduct(productID) {
    // delete product by data-id
    this.cartProducts = this.cartProducts.filter(
      (product) => product.id !== productID
    );
    this.dispatch({ type: 'CART_UPDATED', data: this.cartProducts });
  }

  addProduct({ product: addedProduct, amount }) {
    // check if a product already exists
    const exists = this.cartProducts.some(
      (product) => product.id === addedProduct.id
    );
    if (exists) {
      // update amount
      this.cartProducts = this.cartProducts.map((product) => {
        if (product.id === addedProduct.id) {
          product.amount += amount;
        }
        return product;
      });
    } else {
      // add products to cart
      this.cartProducts = [...this.cartProducts, { ...addedProduct, amount }];
    }

    this.dispatch({ type: 'CART_UPDATED', data: this.cartProducts });
  }

  saveCartToLocalStorage() {
    // sync cart products with LocalStorage
    localStorage.setItem('cart', JSON.stringify(this.cartProducts));
  }

  getCartFromLocalStorage() {
    let cartProducts;
    try {
      cartProducts = JSON.parse(localStorage.getItem('cart'));
    } catch {
      console.warn("Can't not read cart data from localStorage");
    }
    return cartProducts;
  }
}

export const store = new CartStore();
