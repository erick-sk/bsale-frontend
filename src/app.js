import { BACKEND_URL } from './constants.js';
import { store as productStore } from './stores/products.js';
import { store as cartStore } from './stores/cart.js';

productStore.on('LOAD_PRODUCTS', (event) => showProducts(event.detail));

productStore.on('LOAD_CATEGORIES', (event) => showCategories(event.detail));

// get all products
productStore.getProducts();

// get all categories
productStore.getCategories();

// show cart products in modal
cartStore.on('CART_UPDATED', ({ detail: cartProducts }) => {
  const cartContainer = document.querySelector('#list-cart tbody');

  // clear previous HTML
  cartContainer.innerHTML = '';

  // scrolls through the cart and generates the HTML
  cartProducts.map((product) => {
    const { url_image, name, price, amount, id } = product;

    const row = document.createElement('tr');
    row.innerHTML = `
     <td class="text-center">
       <img src="${url_image}" width="100px"></img>
     </td>
     <td class="text-center">
       ${name}
     </td>
     <td class="text-center">
       $${price}.00
     </td>
     <td class="text-center">
       ${amount}
     </td>
     <td class="text-center" >
       <a href="#" class="btn badge rounded-pill text-bg-danger delete-product" data-id="${id}"> X </a>
     </td>
   `;

    // add HTML in the tbody
    cartContainer.appendChild(row);
  });

  const removeProduct = (e) => {
    const selectedProductId = Number(e.target.dataset.id);
    cartStore.removeProduct(selectedProductId);
  };

  // when delete product from button "Empty Cart"
  const removeFromCartBtn = document.querySelectorAll('.delete-product');

  removeFromCartBtn.forEach((button) =>
    button.addEventListener('click', removeProduct)
  );
});

cartStore.initialize();

// show all products
const showProducts = (products) => {
  const productsContainer = document.querySelector('#products');

  // clear previous products
  productsContainer.innerHTML = '';

  if (products.length > 0) {
    products.map((product) => {
      const { name, url_image, price, id } = product;

      const grid = document.createElement('div');
      grid.classList.add('col-12', 'col-md-6', 'col-lg-4', 'col-xxl-3', 'g-4');
      grid.innerHTML = `
        <div class="card">          
          <img src="${
            url_image || 'default-image.jpg'
          }" class="card-img-top" alt="${name}" style=" height: 20rem;">
          <div class="card-body">
            <h6 class="card-title text-capitalize">${name}</h6>
            <div class="d-flex justify-content-between">
              <p class="card-text text-center price">$${price}.00</p>
              <button
                type="button"
                class="btn btn-outline-success ms-2 add-cart"
                data-id="${id}"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      `;

      productsContainer.append(grid);
    });

    // add product
    const addProduct = (e) => {
      const selectedProductId = Number(e.target.dataset.id);
      const product = productStore.getProduct(selectedProductId);

      cartStore.addProduct({ product, amount: 1 });
    };

    // when add a product
    const addCartBtns = document.querySelectorAll('.add-cart');

    addCartBtns.forEach((button) =>
      button.addEventListener('click', addProduct)
    );
  } else {
    const message = document.createElement('h1');
    message.innerHTML = '<h1>No products</h1>';
    productsContainer.append(message);
  }
};

// show all categories
const showCategories = (categories) => {
  const dropdownCategories = document.querySelector('#dropdown-categories');

  categories.map((category) => {
    const { name, id } = category;
    // capitalize categories
    const categoryName = name[0].toUpperCase() + category.name.slice(1);
    // create li for links
    const li = document.createElement('li');

    // add event to each link to call api
    li.addEventListener('click', () => {
      productStore.getProductsByFilter(
        `${BACKEND_URL}/products?category_id=${id}`
      );
    });

    li.innerHTML = `
      <a class="dropdown-item" href="#">${categoryName}</a>
    `;

    dropdownCategories.append(li);
  });
};

// search products by text
const formSearch = document.querySelector('#form-search');

formSearch.addEventListener('submit', (e) => {
  e.preventDefault();

  // input search
  const queryInput = document.querySelector('#query');

  let { query } = e.target.elements;
  query = query.value;

  productStore.getProductsByFilter(
    `${BACKEND_URL}/products?query_text=${query}`
  );

  // clear input search
  queryInput.value = '';
});

// CART
// load events por cart
const setupCartEventListeners = () => {
  // empty cart
  const emptyCartBtn = document.querySelector('#empty-cart');

  emptyCartBtn.addEventListener('click', () => {
    cartStore.emptyCart();
  });
};
setupCartEventListeners();
