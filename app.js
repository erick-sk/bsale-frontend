// variables
const productsContainer = document.querySelector('#products');

// backend url
const baseURL = 'http://localhost:3000';

// get all products
const getProducts = async () => {
  try {
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
      const { name, url_image, price } = product;

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
              <p class="card-text text-center">$${price}.00</p>
              <button
                type="button"
                class="btn btn-outline-success ms-2"
              >
                <i class="icon bi bi-cart-plus"></i>
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
