// variables
const productsContainer = document.querySelector('#products');
const dropdownCategories = document.querySelector('#dropdown-categories');
const formSearch = document.querySelector('#form-search');

// variables cart
const cart = document.querySelector('#cart');
const cartContainer = document.querySelector('#list-cart tbody');
const emptyCartBtn = document.querySelector('#empty-cart');
const listProducts = document.querySelector('.list-products');
let cartProducts = [];

// backend url
const baseURL = 'http://localhost:3000';

// get all products
const getProducts = async () => {
  try {
    // clear previous products
    productsContainer.innerHTML = '';

    const response = await fetch(`${baseURL}/products`);
    const data = await response.json();

    showProducts(data);
  } catch (error) {
    console.log(error);
  }
};
getProducts();

// show all products
const showProducts = (products) => {
  if (products.length > 0) {
    products.map((product) => {
      const { name, url_image, price, id } = product;

      const grid = document.createElement('div');
      grid.classList.add('col-12', 'col-md-6', 'col-lg-4', 'g-4');
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
  } else {
    const message = document.createElement('h1');
    message.innerHTML = '<h1>No products</h1>';
    productsContainer.append(message);
  }
};

// get all categories
const getCategories = async () => {
  try {
    const response = await fetch(`${baseURL}/categories`);
    const data = await response.json();

    showCategories(data);
  } catch (error) {
    console.log(error);
  }
};
getCategories();

// show all categories and call to API
const showCategories = (categories) => {
  categories.map((category) => {
    const { name, id } = category;
    // capitalize categories
    const categoryName = name[0].toUpperCase() + category.name.slice(1);
    // create li for links
    const li = document.createElement('li');

    // add event to each link to call api
    li.addEventListener('click', () => {
      getProductsByFilter(`${baseURL}/products?category_id=${id}`);
    });

    li.innerHTML = `
      <a class="dropdown-item" href="#">${categoryName}</a>
    `;

    dropdownCategories.append(li);
  });
};

// get products by filter
const getProductsByFilter = async (url) => {
  try {
    // clear previous products
    productsContainer.innerHTML = '';

    const response = await fetch(url);
    const data = await response.json();

    showProducts(data);
  } catch (error) {
    console.log(error);
  }
};

// search products by text
formSearch.addEventListener('submit', (e) => {
  e.preventDefault();

  // input search
  const queryInput = document.querySelector('#query');

  let { query } = e.target.elements;
  query = query.value;

  getProductsByFilter(`${baseURL}/products?query_text=${query}`);

  // clear input search
  queryInput.value = '';
});

// CART
// load events por cart
const loadEventListeners = () => {
  // when add a product
  listProducts.addEventListener('click', addProduct);

  // when delete product from cart
  cart.addEventListener('click', deleteProduct);

  // empty cart
  emptyCartBtn.addEventListener('click', () => {
    cartProducts = []; // reset cart

    cartContainer.innerHTML = '';
  });
};

// add product
const addProduct = (e) => {
  e.preventDefault();

  if (e.target.classList.contains('add-cart')) {
    const selectedProduct = e.target.parentElement.parentElement.parentElement;
    readProductData(selectedProduct);
  }
};

// delete product
const deleteProduct = (e) => {
  e.preventDefault();

  if (e.target.classList.contains('delete-product')) {
    const productID = e.target.getAttribute('data-id');

    // delete product by data-id
    cartProducts = cartProducts.filter((product) => product.id !== productID);

    displayCartProducts();
  }
};
loadEventListeners();

// read data product
const readProductData = (product) => {
  // object product info
  const productData = {
    image: product.querySelector('img').src,
    title: product.querySelector('h6').textContent,
    price: product.querySelector('.price').textContent,
    id: product.querySelector('button').getAttribute('data-id'),
    amount: 1,
  };

  // check if a product already exists
  const exists = cartProducts.some((product) => product.id === productData.id);
  if (exists) {
    // update amount
    const products = cartProducts.map((product) => {
      if (product.id === productData.id) {
        product.amount++;
        return product; // return updated object
      } else {
        return product; // return no duplicates
      }
    });

    cartProducts = [...products];
  } else {
    // add products to cart
    cartProducts = [...cartProducts, productData];
  }

  displayCartProducts();
};

// show cart products in modal
const displayCartProducts = () => {
  // clear previous HTML
  cartContainer.innerHTML = '';

  // scrolls through the cart and generates the HTML
  cartProducts.map((product) => {
    const { image, title, price, amount, id } = product;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="text-center">
        <img src="${image}" width="100px"></img>
      </td>
      <td class="text-center">
        ${title}
      </td>
      <td class="text-center">
        ${price}
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
};
