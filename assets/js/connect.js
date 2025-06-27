// ============================================================================
// CONSTANTS AND CONFIGURATION
// ============================================================================

const API_BASE_URL = 'https://api.thebirdcart.com/api';
const DEFAULT_IMAGE = 'assets/img/pr2.png';

const SHIPPING_CONFIG = {
  minimumShipping: 50,
  maximumShipping: 500,
  freeShippingThreshold: 2000,
  enableWeightShipping: true,
  quantityMultiplier: 1.1,

  // Weight-based shipping tiers
  shippingTiers: [
    {
      maxWeight: 0.5, // 500gm
      cost: 50
    },
    {
      maxWeight: 1.0, // 1kg
      cost: 80
    },
    {
      maxWeight: 2.0, // 2kg
      cost: 110
    },
    {
      maxWeight: 5.0, // 5kg
      cost: 180
    }
  ]
};

// ============================================================================
// ENHANCED LOADER FUNCTIONS
// ============================================================================

function showLoader(message, options = {}) {
  let loader = document.getElementById("loader");
  let overlay = document.getElementById("loader-overlay");

  // Create overlay if it doesn't exist
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loader-overlay';
    overlay.style.cssText = `
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9998;
      backdrop-filter: blur(2px);
    `;
    document.body.appendChild(overlay);
  }

  // Create loader if it doesn't exist
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'loader';
    loader.style.cssText = `
      display: none;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      padding: 25px 35px;
      border-radius: 12px;
      border: none;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      text-align: center;
      max-width: 400px;
      height: 130px;
      animation: loaderFadeIn 0.3s ease-out;
    `;

    // Create spinner
    const spinner = document.createElement('div');
    spinner.id = 'loader-spinner';
    spinner.style.cssText = `
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 15px auto;
    `;

    // Create text element
    const loaderText = document.createElement('div');
    loaderText.id = 'loaderText';
    loaderText.style.cssText = `
      color: #333;
      font-size: 16px;
      font-weight: 500;
      line-height: 1.4;
      margin: 0;
    `;

    // Create progress bar (optional)
    const progressContainer = document.createElement('div');
    progressContainer.id = 'loader-progress-container';
    progressContainer.style.cssText = `
      width: 100%;
      height: 4px;
      background: #f0f0f0;
      border-radius: 2px;
      margin-top: 15px;
      overflow: hidden;
      display: none;
    `;

    const progressBar = document.createElement('div');
    progressBar.id = 'loader-progress-bar';
    progressBar.style.cssText = `
      height: 100%;
      background: linear-gradient(90deg, #007bff, #0056b3);
      border-radius: 2px;
      width: 0%;
      transition: width 0.3s ease;
    `;

    progressContainer.appendChild(progressBar);
    loader.appendChild(spinner);
    loader.appendChild(loaderText);
    loader.appendChild(progressContainer);
    document.body.appendChild(loader);

    // Add CSS animations
    addLoaderStyles();
  }

  // Update loader content
  const loaderText = document.getElementById("loaderText");
  const spinner = document.getElementById("loader-spinner");
  const progressContainer = document.getElementById("loader-progress-container");

  if (loaderText) {
    loaderText.textContent = message || 'Loading...';
  }

  // Handle different loader types
  if (options.type === 'progress') {
    spinner.style.display = 'none';
    progressContainer.style.display = 'block';
    updateProgress(options.progress || 0);
  } else if (options.type === 'success') {
    spinner.innerHTML = '✓';
    spinner.style.cssText += `
      border: 3px solid #28a745;
      color: #28a745;
      font-size: 24px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: none;
    `;
    progressContainer.style.display = 'none';
  } else if (options.type === 'error') {
    spinner.innerHTML = '✕';
    spinner.style.cssText += `
      border: 3px solid #dc3545;
      color: #dc3545;
      font-size: 24px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: none;
    `;
    progressContainer.style.display = 'none';
  } else {
    // Default spinning loader
    spinner.innerHTML = '';
    spinner.style.cssText = `
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 15px auto;
    `;
    progressContainer.style.display = 'none';
  }

  // Show loader with animation
  overlay.style.display = "block";
  loader.style.display = "block";

  // Prevent body scroll
  document.body.style.overflow = 'hidden';

  // Auto-hide for success/error messages
  if (options.autoHide && (options.type === 'success' || options.type === 'error')) {
    setTimeout(() => {
      hideLoader();
    }, options.autoHide);
  }
}

function hideLoader() {
  const loader = document.getElementById("loader");
  const overlay = document.getElementById("loader-overlay");

  if (loader) {
    loader.style.animation = 'loaderFadeOut 0.3s ease-in';
    setTimeout(() => {
      loader.style.display = "none";
      loader.style.animation = '';
    }, 300);
  }

  if (overlay) {
    overlay.style.display = "none";
  }

  // Restore body scroll
  document.body.style.overflow = '';
}

function updateProgress(percentage) {
  const progressBar = document.getElementById("loader-progress-bar");
  if (progressBar) {
    progressBar.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
  }
}

function showSuccessLoader(message, autoHide = 2000) {
  showLoader(message, { type: 'success', autoHide });
}

function showErrorLoader(message, autoHide = 3000) {
  showLoader(message, { type: 'error', autoHide });
}

function showProgressLoader(message, progress = 0) {
  showLoader(message, { type: 'progress', progress });
}

function addLoaderStyles() {
  if (document.getElementById('loader-styles')) return;

  const style = document.createElement('style');
  style.id = 'loader-styles';
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes loaderFadeIn {
      from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }
    
    @keyframes loaderFadeOut {
      from {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      to {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
      }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;
  document.head.appendChild(style);
}

// ============================================================================
// PAGE INITIALIZATION
// ============================================================================

// Initialize page based on document title

createCategories();


const pageHandlers = {
  'The Bird Cart || Shop Page': renderProducts,
  'The Bird Cart || Cart Page': renderCart,
  'The Bird Cart || Checkout Page': initializeCheckout,
  'The Bird Cart || Home Page': renderTopAndTrending
};

if (pageHandlers[document.title]) {
  pageHandlers[document.title]();
} else if (document.title.includes('Details')) {
  getProduct();
} else if (document.title.includes('Checkout')) {
  initializeCheckout();
}

// Handle user authentication
if (sessionStorage.getItem('token')) {
  getCartItemsLength();
  updateLoginDisplay();
}

function logout(event) {
  event.preventDefault()
  sessionStorage.clear();
  window.location.reload('index.html')
}

function updateLoginDisplay() {
  const firstName = sessionStorage.getItem('firstName');
  const lastName = sessionStorage.getItem('lastName');
  // Select the element with class 'login-dropdown'
  const loginDropdown = document.querySelector('.login-dropdown');

  // Clear existing content
  while (loginDropdown.firstChild) {
    loginDropdown.removeChild(loginDropdown.firstChild);
  }

  // Create <i class="fal fa-user"></i>
  const userIcon = document.createElement('i');
  userIcon.className = 'fal fa-user';

  // Create <a href="#">John Doe</a>
  const userLink = document.createElement('a');
  userLink.href = '#';
  userLink.textContent = firstName + ' ' + lastName;

  // Create the <ul class="login-main-menu">
  const menuList = document.createElement('ul');
  menuList.className = 'login-main-menu';

  // Create <li id="changePasswordBtn">...</li>
  const changePasswordLi = document.createElement('li');
  const changePasswordLink = document.createElement('a');
  changePasswordLink.id = 'changePasswordBtn';
  changePasswordLink.href = '#';
  const lockIcon = document.createElement('i');
  lockIcon.className = 'fa-solid fa-lock';
  changePasswordLi.appendChild(lockIcon);
  changePasswordLink.appendChild(document.createTextNode(' Change Password'));
  changePasswordLi.appendChild(changePasswordLink);

  // Create <li>Logout</li>
  const logoutLi = document.createElement('li');
  const logoutLink = document.createElement('a');
  logoutLink.href = '#';
  const logoutIcon = document.createElement('i');
  logoutIcon.className = 'fa-solid fa-right-from-bracket';
  logoutLink.appendChild(logoutIcon);
  logoutLink.appendChild(document.createTextNode(' Logout'));
  logoutLi.appendChild(logoutLink);

  // Append everything to menu list
  menuList.appendChild(changePasswordLi);
  menuList.appendChild(logoutLi);

  // Append all to loginDropdown
  loginDropdown.appendChild(userIcon);
  loginDropdown.appendChild(userLink);
  loginDropdown.appendChild(menuList);
  document.addEventListener('DOMContentLoaded', setupLoginDropdownToggle);
  changePasswordLink.onclick = () => modal.style.display = "block";
  logoutLink.onclick = (event) => {
    event.preventDefault()
    logout(event)
  };
}

function setupLoginDropdownToggle() {
  const loginDropdown = document.querySelector('.login-dropdown');
  if (!loginDropdown) return;

  const userLink = loginDropdown.querySelector('a');
  const menuList = loginDropdown.querySelector('.login-main-menu');

  if (!userLink || !menuList) return;

  // Initially hide the menu
  menuList.style.display = 'none';

  // Toggle menu on name click
  userLink.addEventListener('click', function (event) {
    event.preventDefault(); // prevent default anchor behavior
    const isVisible = menuList.style.display === 'block';
    menuList.style.display = isVisible ? 'none' : 'block';
  });

  // Hide the menu if clicked outside
  document.addEventListener('click', function (event) {
    const isClickInside = loginDropdown.contains(event.target);
    if (!isClickInside) {
      menuList.style.display = 'none';
    }
  });
}

// Call the function after DOM is loaded
document.addEventListener('DOMContentLoaded', setupLoginDropdownToggle);

// ============================================================================
// API HELPER FUNCTIONS
// ============================================================================

async function makeApiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = { 'Content-Type': 'application/json' };

  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

function getAuthHeaders() {
  const token = sessionStorage.getItem('token');
  return token
    ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

function handleAuthError() {
  showErrorLoader('Your session has expired. Please login again.', 2000);
  sessionStorage.removeItem('token');
  setTimeout(() => {
    window.location.replace("signup.html");
  }, 2000);
}

// ============================================================================
// PRODUCT FUNCTIONS
// ============================================================================

async function getProducts() {
  try {
    const data = await makeApiRequest('/products/', { method: 'GET' });
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    showErrorLoader('Failed to load products. Please check your connection and try again.');
    return [];
  }
}

async function getProduct(product_id) {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product_id') || product_id;

    if (!productId) {
      showErrorLoader('Product ID not found in URL. Redirecting to shop...', 2000);
      setTimeout(() => {
        window.location.href = 'shop.html';
      }, 2000);
      return;
    }
    console.log('Loading product:', productId);
    const data = await makeApiRequest(`/products/${productId}`);

    console.log('Product data loaded successfully:', data);

    if (document.title === 'Product Details Page') {
      populateProductData(data);
    } else {
      return data;
    }
  } catch (error) {
    console.error('Error loading product:', error);

    if (error.message.includes('404')) {
      showErrorLoader('Product not found. Redirecting to shop...', 2000);
      setTimeout(() => {
        window.location.href = 'shop.html';
      }, 2000);
    } else {
      showErrorLoader('Failed to load product data. Please try again or return to shop.');
    }
  }
}

async function getProductsbyAttribute(key, value) {
  try {
    const data = await makeApiRequest(`/products/by-attribute/${key}/${value}`);
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    showErrorLoader('Failed to load products. Please check your connection and try again.');
    return [];
  }
}

async function getTopAttributes() {
  try {
    const data = await makeApiRequest('/products//top/attributes');
    return data.top_attributes || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    showErrorLoader('Failed to load products. Please check your connection and try again.');
    return [];
  }
}

async function topAndTrending() {
  try {
    const [topResponse, recentResponse] = await Promise.all([
      makeApiRequest('/orders/top/selling'),
      makeApiRequest('/orders/recent/items')
    ]);

    return {
      topSellingItems: topResponse.top_selling_items || [],
      recentItems: recentResponse.recent_items || []
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    showErrorLoader('Failed to load products. Please check your connection and try again.');
    return { topSellingItems: [], recentItems: [] };
  }
}

// ============================================================================
// PRODUCT RENDERING FUNCTIONS
// ============================================================================

async function renderProducts() {
  const container = document.getElementById('products-grid');

  if (!container) {
    console.error('Products grid container not found');
    showErrorLoader('Page layout error. Please refresh the page.');
    return;
  }

  // showLoader('Loading products...');
  container.innerHTML = '<div class="loading">Loading products...</div>';

  try {
    let products = null;
    const urlParams = new URLSearchParams(window.location.search);
    const attributeKey = urlParams.get('key');
    const attributeValues = urlParams.get('value');

    if (attributeKey && attributeValues) {
      products = await getProductsbyAttribute(attributeKey, attributeValues);
    } else {
      products = await getProducts();
    }

    container.innerHTML = '';

    if (products.length === 0) {
      container.innerHTML = '<div class="no-products">No products available at the moment.</div>';
      hideLoader();
      return;
    }

    console.log(`Rendering ${products.length} products`);

    products.forEach(product => {
      const productCard = createProductCard(product);
      container.appendChild(productCard);
    });

    //showSuccessLoader(`Loaded ${products.length} products successfully!`, 1500);
  } catch (error) {
    console.error('Error rendering products:', error);
    container.innerHTML = '<div class="error">Failed to load products. Please try again later.</div>';
    showErrorLoader('Failed to render products. Please try again later.');
  }
}

async function renderTopAndTrending() {
  // showLoader('Loading top and trending products...');

  try {
    const { topSellingItems, recentItems } = await topAndTrending();
    const topContainer = document.getElementById('top-selling');
    const recentContainer = document.getElementById('recent-item');

    let loadedCount = 0;
    const totalItems = topSellingItems.length + recentItems.length;

    if (recentContainer) {
      for (const element of recentItems) {
        const product = await getProduct(element.product_id);
        if (product) {
          const productCard = createProductCard(product, 'index');
          recentContainer.appendChild(productCard);
          loadedCount++;
          //showProgressLoader(`Loading products... (${loadedCount}/${totalItems})`, (loadedCount / totalItems) * 100);
        }
      }
    }

    if (topContainer) {
      for (const element of topSellingItems) {
        const product = await getProduct(element.product_id);
        if (product) {
          const productCard = createProductElement(product);
          topContainer.appendChild(productCard);
          loadedCount++;
          //showProgressLoader(`Loading products... (${loadedCount}/${totalItems})`, (loadedCount / totalItems) * 100);
        }
      }
    }

    //showSuccessLoader('Products loaded successfully!', 1500);
  } catch (error) {
    console.error('Error rendering top and trending:', error);
    showErrorLoader('Failed to load top and trending products.');
  }
}

function createProductCard(productData, page) {
  const colDiv = document.createElement('div');
  colDiv.className = page === 'index'
    ? 'col-xl-4 col-lg-4 col-md-6 filter-item cat3'
    : 'col-xxl-3 col-md-6';

  const productDiv = document.createElement('div');
  productDiv.className = 'ot-product product-grid bg-white';
  productDiv.setAttribute('data-cue', 'slideInUp');

  const productImgDiv = createProductImageDiv(productData, page);
  const productContentDiv = createProductContentDiv(productData);
  const hoverContentDiv = createHoverContentDiv(productData);

  productDiv.appendChild(productImgDiv);
  productDiv.appendChild(productContentDiv);
  productDiv.appendChild(hoverContentDiv);
  colDiv.appendChild(productDiv);

  return colDiv;
}

function createProductImageDiv(productData, page) {
  const productImgDiv = document.createElement('div');
  productImgDiv.className = 'product-img';

  const img = document.createElement('img');
  img.alt = productData.imageAlt || productData.name || 'Product Image';
  img.onerror = function () { this.src = DEFAULT_IMAGE; };

  try {
    if (productData.primary_image) {
      img.src = new TextDecoder('utf-8').decode(new Uint8Array(productData.primary_image.data));
    } else if (page === 'index' && productData.images?.[0]) {
      img.src = new TextDecoder('utf-8').decode(new Uint8Array(productData.images[0].image_url.data));
    } else {
      img.src = DEFAULT_IMAGE;
    }
  } catch (error) {
    console.warn('Error decoding product image:', error);
    img.src = DEFAULT_IMAGE;
  }

  productImgDiv.appendChild(img);
  return productImgDiv;
}

function createProductContentDiv(productData) {
  const contentDiv = document.createElement('div');
  contentDiv.className = 'product-content';

  const title = document.createElement('h3');
  title.className = 'box-title';

  const link = document.createElement('a');
  link.href = `shop-details.html?product_id=${productData.product_id}`;
  link.textContent = productData.name || 'Product Name';

  const price = document.createElement('span');
  price.className = 'price';
  price.textContent = productData.price
    ? `Rs${parseFloat(productData.price).toFixed(0)}`
    : 'Price not available';

  title.appendChild(link);
  contentDiv.appendChild(title);
  contentDiv.appendChild(price);

  return contentDiv;
}

function createHoverContentDiv(productData) {
  const hoverDiv = document.createElement('div');
  hoverDiv.className = 'product-hover-content';

  const title = document.createElement('h3');
  title.className = 'box-title';

  const link = document.createElement('a');
  link.href = `shop-details.html?product_id=${productData.product_id}`;
  link.textContent = productData.name || 'Product Name';

  const price = document.createElement('span');
  price.className = 'price';
  price.textContent = productData.price
    ? `Rs${parseFloat(productData.price).toFixed(0)}`
    : 'Price not available';

  const cartButton = createAddToCartButton(productData.product_id);

  title.appendChild(link);
  hoverDiv.appendChild(title);
  hoverDiv.appendChild(price);
  hoverDiv.appendChild(cartButton);

  return hoverDiv;
}

function createAddToCartButton(productId) {
  const button = document.createElement('a');
  button.className = 'ot-btn';
  button.href = '#';
  button.setAttribute('role', 'button');

  const icon = document.createElement('i');
  icon.className = 'fa-light fa-basket-shopping me-1';

  button.appendChild(icon);
  button.appendChild(document.createTextNode(' Add To Cart'));

  button.addEventListener('click', async function (event) {
    event.preventDefault();

    const originalContent = button.innerHTML;
    button.style.pointerEvents = 'none';
    button.innerHTML = '<i class="fa-light fa-spinner fa-spin me-1"></i> Adding...';

    try {
      await addToCart(productId, 1);
    } finally {
      button.style.pointerEvents = 'auto';
      button.innerHTML = originalContent;
    }
  });

  return button;
}

function createProductElement(productData) {
  const colDiv = document.createElement('div');
  colDiv.className = 'col-xxl-6 col-xl-12 col-lg-6';

  const productDiv = document.createElement('div');
  productDiv.className = 'ot-product list-view style-border';
  setProductAnimationAttributes(productDiv);

  const imgDiv = createListViewImageDiv(productData);
  const contentDiv = createProductContentDiv(productData);
  const actionDiv = createProductActionDiv(productData);

  productDiv.appendChild(imgDiv);
  productDiv.appendChild(contentDiv);
  productDiv.appendChild(actionDiv);
  colDiv.appendChild(productDiv);

  return colDiv;
}

function setProductAnimationAttributes(element) {
  element.dataset.cue = 'slideInUp';
  element.dataset.show = 'true';
  element.style.animationName = 'slideInUp';
  element.style.animationDuration = '900ms';
  element.style.animationTimingFunction = 'ease';
  element.style.animationDelay = '0ms';
  element.style.animationDirection = 'normal';
  element.style.animationFillMode = 'both';
}

function createListViewImageDiv(productData) {
  const imgDiv = document.createElement('div');
  imgDiv.className = 'product-img';

  const img = document.createElement('img');
  img.src = new TextDecoder('utf-8').decode(new Uint8Array(productData.images[0].image_url.data));
  img.alt = 'Product Image';

  imgDiv.appendChild(img);
  return imgDiv;
}

function createProductActionDiv(productData) {
  const actionDiv = document.createElement('div');
  actionDiv.className = 'product-action-wrap align-self-center';

  const cartButton = document.createElement('a');
  cartButton.className = 'ot-btn style7';
  cartButton.href = '#';
  cartButton.setAttribute('role', 'button');

  cartButton.addEventListener('click', async function (event) {
    event.preventDefault();

    const originalContent = cartButton.innerHTML;
    cartButton.style.pointerEvents = 'none';
    cartButton.innerHTML = '<i class="fa-light fa-spinner fa-spin me-1"></i> Adding...';

    try {
      await addToCart(productData.product_id, 1);
    } finally {
      cartButton.style.pointerEvents = 'auto';
      cartButton.innerHTML = originalContent;
    }
  });

  const cartIcon = document.createElement('i');
  cartIcon.className = 'fa-light fa-basket-shopping me-1';

  cartButton.appendChild(cartIcon);
  cartButton.appendChild(document.createTextNode(' Add To Cart'));
  actionDiv.appendChild(cartButton);

  return actionDiv;
}

// ============================================================================
// CATEGORY AND MENU FUNCTIONS
// ============================================================================
async function createCategories() {
  // showLoader('Loading categories...');

  try {
    const topAttributes = await getTopAttributes();

    const menu = createDynamicMenu(topAttributes);
    const catMenus = document.getElementById('catmenu');
    const mobMenu = createDynamicMenu(topAttributes);
    const mobcatMenu = document.getElementById('catmenuMob');
    catMenus.appendChild(menu);
    mobcatMenu.appendChild(mobMenu)
    //showSuccessLoader('Categories loaded successfully!', 1000);
  } catch (error) {
    console.error('Error creating categories:', error);
    showErrorLoader('Failed to load categories.');
  }
}

function createDynamicMenu(data) {
  const outerUl = document.createElement('ul');
  outerUl.className = 'sub-menu';

  data.forEach(group => {
    const parentLi = document.createElement('li');
    parentLi.className = 'menu-item-has-children';

    const parentA = document.createElement('a');
    parentA.href = '#';
    parentA.textContent = group.key_name;
    parentLi.appendChild(parentA);

    const innerUl = document.createElement('ul');
    innerUl.className = 'sub-menu';

    group.top_values.forEach(item => {
      const subLi = document.createElement('li');
      const subA = document.createElement('a');
      subA.href = `shop.html?key=${group.key_name}&value=${item.value}`;
      subA.textContent = item.value;

      subLi.appendChild(subA);
      innerUl.appendChild(subLi);
    });

    parentLi.appendChild(innerUl);
    outerUl.appendChild(parentLi);
  });

  return outerUl;
}


// ============================================================================
// PRODUCT DETAILS FUNCTIONS
// ============================================================================

function populateProductData(product) {
  const fieldMappings = {
    'product-id': product.product_id,
    'product-name': product.name,
    'product-stock': product.stock_quantity,
    'product-low-stock': product.min_stock_level,
    'product-weight': product.weight,
    'description': product.description,
    'product-price': product.price,
    'product-MRP': product.cost_price,
    'product-available': getStockStatus(product.stock_quantity, product.min_stock_level),
    'product-dimensions': formatDimensions(product.dimensions)
  };

  populateFormFields(fieldMappings);
  populateProductImages(product);
  populateProductAttributes(product);
}

function populateFormFields(fieldMappings) {
  Object.entries(fieldMappings).forEach(([elementId, value]) => {
    const element = document.getElementById(elementId);
    if (element) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.value = value || '';
      } else {
        element.textContent = value || '';
      }
    } else {
      console.warn(`Element with id '${elementId}' not found`);
    }
  });
}

function populateProductImages(product) {
  if (!product.images || product.images.length === 0) return;

  const productBigImgDiv = document.querySelector('.product-big-img');
  if (!productBigImgDiv) return;

  if (product.images.length === 1) {
    productBigImgDiv.innerHTML = createSingleImageHTML(product);
  } else {
    productBigImgDiv.innerHTML = createCarouselHTML(product);
  }
}

function createSingleImageHTML(product) {
  const imageUrl = new TextDecoder('utf-8').decode(new Uint8Array(product.images[0].image_url.data));
  return `
    <div class="img">
      <img src="${imageUrl}" alt="${product.name || 'Product Image'}">
    </div>
  `;
}

function createCarouselHTML(product) {
  const carouselItems = product.images.map((imageSrc, index) => {
    const imageUrl = new TextDecoder('utf-8').decode(new Uint8Array(imageSrc.image_url.data));
    return `
      <div class="carousel-item ${index === 0 ? 'active' : ''}">
        <div class="img">
          <img src="${imageUrl}" alt="${product.name || 'Product Image'}" 
               style="width: 100%; height: auto; object-fit: contain;">
        </div>
      </div>
    `;
  }).join('');

  return `
    <div id="productCarousel" class="carousel slide" data-bs-ride="carousel" style="position: relative;">
      <div class="carousel-inner">
        ${carouselItems}
      </div>
      ${createCarouselControls()}
    </div>
  `;
}

function createCarouselControls() {
  const buttonStyle = "width: 30px; height: 30px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); border-radius: 50%; border: none;";
  const iconStyle = "width: 15px; height: 15px;";

  return `
    <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev" 
            style="${buttonStyle} left: 10px;">
      <span class="carousel-control-prev-icon" aria-hidden="true" style="${iconStyle}"></span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next"
            style="${buttonStyle} right: 10px;">
      <span class="carousel-control-next-icon" aria-hidden="true" style="${iconStyle}"></span>
    </button>
  `;
}

function populateProductAttributes(product) {
  if (!product.attributes || Object.keys(product.attributes).length === 0) return;

  const tbody = document.getElementById('attributes-body');
  if (!tbody) return;

  Object.entries(product.attributes).forEach(([key, value]) => {
    const row = document.createElement('tr');
    const displayKey = formatAttributeKey(key);
    const displayValue = formatAttributeValue(value);

    row.innerHTML = `
      <th>${displayKey}</th>
      <td>${displayValue}</td>
    `;

    tbody.appendChild(row);
  });
}

function formatDimensions(dimensions) {
  if (!dimensions) return '0 × 0 × 0';
  return `${dimensions.length || 0} × ${dimensions.width || 0} × ${dimensions.height || 0}`;
}

function formatAttributeKey(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatAttributeValue(value) {
  if (Array.isArray(value)) {
    return value.join(', ');
  } else if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  } else if (typeof value === 'number') {
    return value.toString();
  }
  return value;
}

function getStockStatus(stockQuantity, minStockLevel) {
  if (stockQuantity === 0) {
    return 'Out of Stock';
  } else if (minStockLevel > stockQuantity) {
    return 'Few Left';
  } else {
    return 'In Stock';
  }
}

async function cart(event) {
  event.preventDefault();

  const productIdElement = document.getElementById('product-id');
  const quantityElement = document.getElementById('quantity');

  if (!productIdElement || !quantityElement) {
    showErrorLoader('Page error: Required elements not found.');
    return;
  }

  const productId = productIdElement.textContent;
  const quantity = parseInt(quantityElement.value);

  if (!productId) {
    showErrorLoader('Product ID not found.');
    return;
  }

  if (isNaN(quantity) || quantity <= 0) {
    showErrorLoader('Please enter a valid quantity.');
    return;
  }

  await addToCart(productId, quantity);
}

// ============================================================================
// CART FUNCTIONS
// ============================================================================

async function changePassword(event) {
  event.preventDefault();

  const oldPassword = document.getElementById('oldPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('reNewPassword').value;

  showLoader('Changing password...');

  try {
    await makeApiRequest('/customers/change-password', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ oldPassword, newPassword, confirmPassword })
    });

    showSuccessLoader('Password changed successfully!', 2000);
    document.getElementById('closeModal').click();
    getCartItemsLength();
  } catch (error) {
    console.error('Change Password Error', error);

    if (error.message.includes('401')) {
      handleAuthError();
    } else {
      showErrorLoader(`Change Password Error: ${error.message}`);
    }
  }
}

async function addToCart(product_id, quantity) {
  const customerToken = sessionStorage.getItem('token');

  if (!customerToken) {
    showErrorLoader('Please Sign Up or Login to add items to cart. Redirecting...', 2000);
    setTimeout(() => {
      window.location.replace("signup.html");
    }, 2000);
    return;
  }

  if (!product_id || quantity <= 0) {
    showErrorLoader('Invalid product or quantity.');
    return;
  }

  try {
    showLoader('Adding product to cart...');

    console.log(`Adding product ${product_id} with quantity ${quantity} to cart`);

    await makeApiRequest('/cart/add', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ product_id, quantity })
    });

    showSuccessLoader('Product successfully added to cart!', 2000);
    getCartItemsLength();
  } catch (error) {
    console.error('Error adding to cart:', error);

    if (error.message.includes('401')) {
      handleAuthError();
    } else {
      showErrorLoader(`Failed to add product to cart: ${error.message}`);
    }
  }
}

async function getCart() {
  const customerToken = sessionStorage.getItem('token');

  if (!customerToken) {
    showErrorLoader('Please Sign Up or Login to view cart. Redirecting...', 2000);
    setTimeout(() => {
      window.location.replace("signup.html");
    }, 2000);
    return null;
  }

  try {
    return await makeApiRequest('/cart', {
      method: 'GET',
      headers: getAuthHeaders()
    });
  } catch (error) {
    console.error('Error fetching cart:', error);

    if (error.message.includes('401')) {
      handleAuthError();
    } else {
      showErrorLoader('Failed to load cart data. Please try again.');
    }
    return null;
  }
}

async function updateProductInCart(product_id, quantity) {
  const customerToken = sessionStorage.getItem('token');

  if (!customerToken) {
    showErrorLoader('Please Sign Up or Login. Redirecting...', 2000);
    setTimeout(() => {
      window.location.replace("signup.html");
    }, 2000);
    return;
  }

  if (!product_id || quantity <= 0) {
    showErrorLoader('Invalid product or quantity.');
    return;
  }

  try {
    showLoader('Updating cart...');
    console.log(`Updating product ${product_id} quantity to ${quantity}`);

    await makeApiRequest('/cart/update', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ product_id, quantity })
    });

    getCartItemsLength();
    await renderCart();
    showSuccessLoader('Cart updated successfully!', 1500);
  } catch (error) {
    console.error('Error updating cart:', error);

    if (error.message.includes('401')) {
      handleAuthError();
    } else {
      showErrorLoader(`Failed to update cart: ${error.message}`);
    }
  }
}

async function deleteProductFromCart(product_id) {
  const customerToken = sessionStorage.getItem('token');

  if (!customerToken) {
    showErrorLoader('Please Sign Up or Login. Redirecting...', 2000);
    setTimeout(() => {
      window.location.replace("signup.html");
    }, 2000);
    return;
  }

  if (!product_id) {
    showErrorLoader('Invalid product ID.');
    return;
  }

  try {
    // showLoader('Removing product from cart...');
    console.log(`Removing product ${product_id} from cart`);

    await makeApiRequest(`/cart/remove/${product_id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    //showSuccessLoader('Product removed from cart successfully!', 2000);

    // Update cart length first
    await getCartItemsLength();

    // Only render cart if we're on the cart page
    const cartBody = document.getElementById("cart-body");
    if (cartBody) {
      await renderCart();
    }

  } catch (error) {
    console.error('Error removing from cart:', error);

    if (error.message.includes('401')) {
      handleAuthError();
    } else {
      showErrorLoader(`Failed to remove product from cart: ${error.message}`);
    }
  }
}

async function getCartItemsLength() {
  try {
    const cartData = await getCart();
    if (cartData) {
      const cartLengthElement = document.getElementById('miniCartItemsLength');
      if (cartLengthElement) {
        cartLengthElement.textContent = cartData.item_count || 0;
      }
    }
  } catch (error) {
    console.error('Error getting cart items length:', error);
    // Don't show error to user for this background operation
  }
}

// ============================================================================
// CART RENDERING FUNCTIONS
// ============================================================================

async function renderCart() {
  const cartBody = document.getElementById("cart-body");

  if (!cartBody) {
    console.error('Cart body element not found');
    showErrorLoader('Page layout error. Please refresh the page.');
    return;
  }

  // showLoader('Loading cart...');
  cartBody.innerHTML = '<tr><td colspan="6" class="text-center">Loading cart...</td></tr>';

  try {
    const cartData = await getCart();

    if (!cartData || !cartData.items) {
      cartBody.innerHTML = '<tr><td colspan="6" class="text-center">Your cart is empty</td></tr>';
      updateSubTotal(0);
      hideLoader();
      return;
    }

    cartBody.innerHTML = '';
    let total = 0;

    cartData.items.forEach(item => {
      const tr = createCartItemRow(item);
      cartBody.appendChild(tr);
      total += parseFloat(item.total_price || 0);
    });

    updateSubTotal(total);
    console.log(`Cart rendered with ${cartData.items.length} items, total: Rs${total.toFixed(2)}`);
    //showSuccessLoader(`Cart loaded with ${cartData.items.length} items!`, 1500);
  } catch (error) {
    console.error('Error rendering cart:', error);
    cartBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Failed to load cart. Please try again.</td></tr>';
    showErrorLoader('Failed to load cart. Please try again.');
  }
}

function updateSubTotal(total) {
  const subTotalElement = document.getElementById("subTotal");
  if (subTotalElement) {
    subTotalElement.textContent = total.toFixed(0);
  }
}

function createCartItemRow(item) {
  const tr = document.createElement("tr");
  tr.className = "cart_item";

  const cells = [
    createRemoveCell(item),
    createImageCell(item),
    createNameCell(item),
    createPriceCell(item),
    createQuantityCell(item),
    createTotalCell(item)
  ];

  cells.forEach(cell => tr.appendChild(cell));
  return tr;
}

function createRemoveCell(item) {
  const td = document.createElement("td");
  td.setAttribute("data-title", "Remove");

  const removeLink = document.createElement("a");
  removeLink.href = "#";
  removeLink.className = "remove";
  removeLink.innerHTML = '<i class="far fa-close"></i>';

  removeLink.onclick = async (event) => {
    event.preventDefault();
    if (confirm('Are you sure you want to remove this item from cart?')) {
      removeLink.innerHTML = '<i class="far fa-spinner fa-spin"></i>';
      await deleteProductFromCart(item.product_id);
    }
  };

  td.appendChild(removeLink);
  return td;
}

function createImageCell(item) {
  const td = document.createElement("td");
  td.setAttribute("data-title", "Product");

  const productLink = document.createElement("a");
  productLink.className = "cart-productimage";
  productLink.href = `shop-details.html?product_id=${item.product_id}`;

  const img = document.createElement("img");
  img.width = 91;
  img.height = 91;
  img.alt = item.name || "Product Image";
  img.onerror = function () { this.src = DEFAULT_IMAGE; };

  try {
    img.src = item.image_url && item.image_url.data
      ? new TextDecoder('utf-8').decode(new Uint8Array(item.image_url.data))
      : "assets/images/product/p-1.png";
  } catch (error) {
    console.warn('Error decoding cart item image:', error);
    img.src = "assets/images/product/p-1.png";
  }

  productLink.appendChild(img);
  td.appendChild(productLink);
  return td;
}

function createNameCell(item) {
  const td = document.createElement("td");
  td.setAttribute("data-title", "Name");

  const nameLink = document.createElement("a");
  nameLink.className = "cart-productname";
  nameLink.href = `shop-details.html?product_id=${item.product_id}`;
  nameLink.textContent = item.name || 'Unknown Product';

  td.appendChild(nameLink);
  return td;
}

function createPriceCell(item) {
  const td = document.createElement("td");
  td.setAttribute("data-title", "Price");

  const priceSpan = document.createElement("span");
  priceSpan.className = "amount";
  const price = parseFloat(item.price || 0);
  priceSpan.innerHTML = `<bdi><span>Rs</span>${price.toFixed(0)}</bdi>`;

  td.appendChild(priceSpan);
  return td;
}

function createQuantityCell(item) {
  const td = document.createElement("td");
  td.setAttribute("data-title", "Quantity");

  const qtyDiv = document.createElement("div");
  qtyDiv.className = "quantity";

  const minusBtn = document.createElement("button");
  minusBtn.className = "quantity-minus qty-btn";
  minusBtn.innerHTML = '<i class="far fa-minus"></i>';
  minusBtn.type = "button";

  const input = document.createElement("input");
  input.type = "number";
  input.className = "qty-input";
  input.value = item.quantity || 1;
  input.min = 1;
  input.max = item.stock_quantity || 999;

  const plusBtn = document.createElement("button");
  plusBtn.className = "quantity-plus qty-btn";
  plusBtn.innerHTML = '<i class="far fa-plus"></i>';
  plusBtn.type = "button";

  // Minus button click handler
  minusBtn.addEventListener('click', async function (event) {
    event.preventDefault();
    const currentValue = parseInt(input.value);
    if (currentValue > 1) {
      const newValue = currentValue - 1;
      input.value = newValue;

      // Disable button and show loading
      minusBtn.disabled = true;
      plusBtn.disabled = true;
      input.disabled = true;

      minusBtn.innerHTML = '<i class="far fa-spinner fa-spin"></i>';

      try {
        await updateProductInCart(item.product_id, newValue);
      } finally {
        // Re-enable buttons
        minusBtn.disabled = false;
        plusBtn.disabled = false;
        input.disabled = false;
        minusBtn.innerHTML = '<i class="far fa-minus"></i>';
      }
    }
  });

  // Plus button click handler
  plusBtn.addEventListener('click', async function (event) {
    event.preventDefault();
    const currentValue = parseInt(input.value);
    const maxValue = item.stock_quantity || 999;

    if (currentValue < maxValue) {
      const newValue = currentValue + 1;
      input.value = newValue;

      // Disable button and show loading
      minusBtn.disabled = true;
      plusBtn.disabled = true;
      input.disabled = true;

      plusBtn.innerHTML = '<i class="far fa-spinner fa-spin"></i>';

      try {
        await updateProductInCart(item.product_id, newValue);
      } finally {
        // Re-enable buttons
        minusBtn.disabled = false;
        plusBtn.disabled = false;
        input.disabled = false;
        plusBtn.innerHTML = '<i class="far fa-plus"></i>';
      }
    } else {
      showErrorLoader(`Maximum quantity available is ${maxValue}`, 2000);
    }
  });

  // Input change handler (for direct typing)
  let updateTimeout;
  input.addEventListener('change', async function (event) {
    event.preventDefault();

    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }

    updateTimeout = setTimeout(async () => {
      const newQuantity = parseInt(input.value);
      const maxValue = item.stock_quantity || 999;

      if (newQuantity > 0 && newQuantity <= maxValue) {
        // Disable controls during update
        minusBtn.disabled = true;
        plusBtn.disabled = true;
        input.disabled = true;

        try {
          await updateProductInCart(item.product_id, newQuantity);
        } finally {
          // Re-enable controls
          minusBtn.disabled = false;
          plusBtn.disabled = false;
          input.disabled = false;
        }
      } else {
        showErrorLoader(`Please enter a quantity between 1 and ${maxValue}`, 2000);
        input.value = item.quantity; // Reset to original value
      }
    }, 500);
  });

  // Prevent manual input of invalid values
  input.addEventListener('input', function (event) {
    const value = parseInt(event.target.value);
    const maxValue = item.stock_quantity || 999;

    if (value < 1) {
      event.target.value = 1;
    } else if (value > maxValue) {
      event.target.value = maxValue;
    }
  });

  qtyDiv.appendChild(minusBtn);
  qtyDiv.appendChild(input);
  qtyDiv.appendChild(plusBtn);
  td.appendChild(qtyDiv);

  return td;
}

function createTotalCell(item) {
  const td = document.createElement("td");
  td.setAttribute("data-title", "Total");

  const totalSpan = document.createElement("span");
  totalSpan.className = "amount";
  const totalPrice = parseFloat(item.total_price || 0);
  totalSpan.innerHTML = `<bdi><span>Rs</span>${totalPrice.toFixed(0)}</bdi>`;

  td.appendChild(totalSpan);
  return td;
}

// ============================================================================
// MINI CART FUNCTIONS
// ============================================================================

async function renderMiniCart(event = null) {
  // Only prevent default if event exists
  if (event) {
    event.preventDefault();
  }

  //showLoader('Loading mini cart...')

  const miniCartContainer = document.querySelector('.woocommerce-mini-cart');
  if (!miniCartContainer) {
    hideLoader();
    return;
  }

  try {
    const cartData = await getCart();
    if (!cartData) {
      hideLoader();
      return;
    }

    let subtotal = 0;
    miniCartContainer.innerHTML = '';

    if (cartData.items && cartData.items.length > 0) {
      cartData.items.forEach(item => {
        const miniCartItem = createMiniCartItem(item);
        miniCartContainer.appendChild(miniCartItem);
        subtotal += item.total_price;
      });
    } else {
      // Show empty cart message
      const emptyMessage = document.createElement('li');
      emptyMessage.className = 'woocommerce-mini-cart-item';
      emptyMessage.innerHTML = '<p style="text-align: center; padding: 20px;">Your cart is empty</p>';
      miniCartContainer.appendChild(emptyMessage);
    }

    updateMiniCartSubtotal(subtotal);
    //showSuccessLoader('Mini cart loaded!', 1000);
  } catch (error) {
    console.error('Error rendering mini cart:', error);
    showErrorLoader('Failed to load mini cart.');
  }
}

function createMiniCartItem(item) {
  const li = document.createElement('li');
  li.className = 'woocommerce-mini-cart-item mini_cart_item';

  const removeLink = createMiniCartRemoveLink(item);
  const productLink = createMiniCartProductLink(item);
  const quantitySpan = createMiniCartQuantitySpan(item);

  li.appendChild(removeLink);
  li.appendChild(productLink);
  li.appendChild(quantitySpan);

  return li;
}

function createMiniCartRemoveLink(item) {
  const removeLink = document.createElement('a');
  removeLink.href = '#';
  removeLink.className = 'remove remove_from_cart_button';
  removeLink.innerHTML = '<i class="far fa-times"></i>';

  removeLink.onclick = async (event) => {
    event.preventDefault();
    if (confirm('Remove this item from cart?')) {
      removeLink.innerHTML = '<i class="far fa-spinner fa-spin"></i>';
      await deleteProductFromCart(item.product_id);

      // Check if we're on cart page before calling renderCart
      if (document.getElementById("cart-body")) {
        await renderCart();
      }

      // Update mini cart and cart length
      await getCartItemsLength();
    }
  };

  return removeLink;
}

function createMiniCartProductLink(item) {
  const productLink = document.createElement('a');
  productLink.href = `shop-details.html?product_id=${item.product_id}`;

  const img = document.createElement('img');
  img.alt = "Cart Image";
  img.onerror = function () { this.src = DEFAULT_IMAGE; };

  try {
    img.src = item.image_url && item.image_url.data
      ? new TextDecoder('utf-8').decode(new Uint8Array(item.image_url.data))
      : DEFAULT_IMAGE;
  } catch (error) {
    console.warn('Error decoding mini cart item image:', error);
    img.src = DEFAULT_IMAGE;
  }

  productLink.appendChild(img);
  productLink.appendChild(document.createTextNode(item.name || 'Unknown Product'));

  return productLink;
}

function createMiniCartQuantitySpan(item) {
  const quantitySpan = document.createElement('span');
  quantitySpan.className = 'quantity';

  const priceSpan = document.createElement('span');
  priceSpan.className = 'woocommerce-Price-amount amount';

  const currencySpan = document.createElement('span');
  currencySpan.className = 'woocommerce-Price-currencySymbol';
  currencySpan.textContent = 'Rs';

  const price = parseFloat(item.price || 0);
  priceSpan.appendChild(currencySpan);
  priceSpan.appendChild(document.createTextNode(price.toFixed(2)));

  quantitySpan.appendChild(document.createTextNode(`${item.quantity || 1} × `));
  quantitySpan.appendChild(priceSpan);

  return quantitySpan;
}

function updateMiniCartSubtotal(subtotal) {
  const subtotalElement = document.getElementById('mini-cart-subtotal');
  if (subtotalElement) {
    subtotalElement.textContent = `Rs${subtotal.toFixed(2)}`;
  }
}

// ============================================================================
// CHECKOUT FUNCTIONS
// ============================================================================

async function initializeCheckout() {
  const customerToken = sessionStorage.getItem('token');

  if (!customerToken) {
    showErrorLoader('Please Sign Up or Login to proceed with checkout. Redirecting...', 2000);
    setTimeout(() => {
      window.location.replace("signup.html");
    }, 2000);
    return;
  }

  //showLoader('Initializing checkout...');

  try {
    await loadCustomerAddresses();
    await renderCheckoutCartWithShipping();
    setupAddressHandlers();
    //showSuccessLoader('Checkout initialized successfully!', 1500);
  } catch (error) {
    console.error('Error initializing checkout:', error);
    showErrorLoader('Failed to initialize checkout. Please try again.');
  }
}

async function loadCustomerAddresses() {
  const customerToken = sessionStorage.getItem('token');

  try {
    const data = await makeApiRequest('/customers/addresses', {
      method: 'GET',
      headers: getAuthHeaders()
    });

    console.log('Customer addresses loaded:', data);

    if (data.addresses && data.addresses.length > 0) {
      populateAddressFields(data.addresses);
    }
  } catch (error) {
    if (error.message.includes('404')) {
      console.log('No addresses found for customer');
    } else {
      console.error('Error loading addresses:', error);
    }
  }
}

function populateAddressFields(addresses) {
  const shippingAddress = addresses.find(addr => addr.address_type === 'shipping') || addresses[0];
  const billingAddress = addresses.find(addr => addr.address_type === 'billing') || shippingAddress;

  if (shippingAddress) {
    populateShippingFields(shippingAddress);
  }

  if (billingAddress) {
    populateBillingFields(billingAddress);
  }
}

function populateShippingFields(address) {
  const shippingFields = {
    'shippingAddressLine1': address.street_address,
    'shippingAddressLine2': address.city,
    'shippingCountry': address.country,
    'shippingPostcode': address.postal_code
  };

  populateFieldsFromObject(shippingFields);
}

function populateBillingFields(address) {
  const billingFields = {
    'billingAddressLine1': address.street_address,
    'billingAddressLine2': address.city,
    'billingCountry': address.country,
    'billingPostcode': address.postal_code
  };

  populateFieldsFromObject(billingFields);
}

function populateFieldsFromObject(fields) {
  Object.entries(fields).forEach(([fieldId, value]) => {
    const element = document.getElementById(fieldId);
    if (element && value) {
      element.value = value;
    }
  });
}

function setupAddressHandlers() {
  const sameAsShippingCheckbox = document.getElementById('sameAsShipping');
  if (!sameAsShippingCheckbox) return;

  sameAsShippingCheckbox.addEventListener('change', function () {
    const isChecked = this.checked;
    const fieldMappings = {
      'shippingAddressLine1': 'billingAddressLine1',
      'shippingAddressLine2': 'billingAddressLine2',
      'shippingCountry': 'billingCountry',
      'shippingPostcode': 'billingPostcode'
    };

    Object.entries(fieldMappings).forEach(([shippingId, billingId]) => {
      const shippingElement = document.getElementById(shippingId);
      const billingElement = document.getElementById(billingId);

      if (shippingElement && billingElement) {
        if (isChecked) {
          billingElement.value = shippingElement.value;
          billingElement.disabled = true;
        } else {
          billingElement.disabled = false;
        }
      }
    });
  });
}

async function saveCustomerAddress(addressType, addressData) {
  try {
    const result = await makeApiRequest('/customers/addresses', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        address_type: addressType,
        street_address: addressData.line1,
        city: addressData.line2,
        postal_code: addressData.postcode,
        country: addressData.country
      })
    });

    console.log(`${addressType} address saved:`, result);
    return result;
  } catch (error) {
    console.error(`Error saving ${addressType} address:`, error);
  }
}

async function renderCheckoutCartWithShipping() {
  const cartBody = document.getElementById("checkout-cart-body");

  if (!cartBody) {
    console.error('Checkout cart body element not found');
    showErrorLoader('Page layout error. Please refresh the page.');
    return;
  }

  cartBody.innerHTML = '<tr><td colspan="5" class="text-center">Loading cart...</td></tr>';

  try {
    const cartData = await getCart();

    if (!cartData || !cartData.items || cartData.items.length === 0) {
      cartBody.innerHTML = '<tr><td colspan="5" class="text-center">Your cart is empty</td></tr>';
      updateCheckoutTotalsWithShipping(0, []);
      return;
    }

    cartBody.innerHTML = '';
    let subtotal = 0;

    cartData.items.forEach(item => {
      const tr = createCheckoutCartRow(item);
      cartBody.appendChild(tr);
      subtotal += parseFloat(item.total_price || 0);
    });

    updateCheckoutTotalsWithShipping(subtotal, cartData.items);
    console.log(`Checkout cart rendered with ${cartData.items.length} items`);
  } catch (error) {
    console.error('Error rendering checkout cart:', error);
    cartBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Failed to load cart. Please try again.</td></tr>';
  }
}

function createCheckoutCartRow(item) {
  const tr = document.createElement("tr");
  tr.className = "cart_item";

  const cells = [
    createCheckoutProductCell(item),
    createCheckoutNameCell(item),
    createCheckoutPriceCell(item),
    createCheckoutQuantityCell(item),
    createCheckoutTotalCell(item)
  ];

  cells.forEach(cell => tr.appendChild(cell));
  return tr;
}

function createCheckoutProductCell(item) {
  const td = document.createElement("td");
  td.setAttribute("data-title", "Product");

  const productLink = document.createElement("a");
  productLink.className = "cart-productimage";
  productLink.href = `shop-details.html?product_id=${item.product_id}`;

  const img = document.createElement("img");
  img.width = 91;
  img.height = 91;
  img.alt = item.name || "Product Image";
  img.onerror = function () { this.src = DEFAULT_IMAGE; };

  try {
    img.src = item.image_url && item.image_url.data
      ? new TextDecoder('utf-8').decode(new Uint8Array(item.image_url.data))
      : DEFAULT_IMAGE;
  } catch (error) {
    console.warn('Error decoding checkout cart item image:', error);
    img.src = DEFAULT_IMAGE;
  }

  productLink.appendChild(img);
  td.appendChild(productLink);
  return td;
}

function createCheckoutNameCell(item) {
  const td = document.createElement("td");
  td.setAttribute("data-title", "Name");

  const nameLink = document.createElement("a");
  nameLink.className = "cart-productname";
  nameLink.href = `shop-details.html?product_id=${item.product_id}`;
  nameLink.textContent = item.name || 'Unknown Product';

  td.appendChild(nameLink);
  return td;
}

function createCheckoutPriceCell(item) {
  const td = document.createElement("td");
  td.setAttribute("data-title", "Price");

  const priceSpan = document.createElement("span");
  priceSpan.className = "amount";
  const price = parseFloat(item.price || 0);
  priceSpan.innerHTML = `<bdi><span>Rs</span>${price.toFixed(0)}</bdi>`;

  td.appendChild(priceSpan);
  return td;
}

function createCheckoutQuantityCell(item) {
  const td = document.createElement("td");
  td.setAttribute("data-title", "Quantity");

  const quantityStrong = document.createElement("strong");
  quantityStrong.className = "product-quantity";
  quantityStrong.textContent = String(item.quantity || 1).padStart(2, '0');

  td.appendChild(quantityStrong);
  return td;
}

function createCheckoutTotalCell(item) {
  const td = document.createElement("td");
  td.setAttribute("data-title", "Total");

  const totalSpan = document.createElement("span");
  totalSpan.className = "amount";
  const totalPrice = parseFloat(item.total_price || 0);
  totalSpan.innerHTML = `<bdi><span>Rs</span>${totalPrice.toFixed(0)}</bdi>`;

  td.appendChild(totalSpan);
  return td;
}

// ============================================================================
// SHIPPING CALCULATION FUNCTIONS
// ============================================================================

function calculateShipping(cartItems, cartSubtotal = 0) {
  try {
    if (cartSubtotal >= SHIPPING_CONFIG.freeShippingThreshold) {
      return createFreeShippingResult();
    }

    if (!cartItems || cartItems.length === 0) {
      return createEmptyCartShippingResult();
    }

    let totalShippingCost = 0;
    let totalWeight = 0;
    const breakdown = [];

    cartItems.forEach(item => {
      const itemShipping = calculateItemShipping(item);
      totalShippingCost += itemShipping.cost;
      totalWeight += itemShipping.totalWeight;
      breakdown.push(itemShipping);
    });

    totalShippingCost = Math.max(totalShippingCost, SHIPPING_CONFIG.minimumShipping);
    totalShippingCost = Math.min(totalShippingCost, SHIPPING_CONFIG.maximumShipping);

    return {
      cost: Math.round(totalShippingCost * 100) / 100,
      details: 'Shipping calculated based on weight tiers',
      breakdown: breakdown,
      totalWeight: totalWeight,
      config: {
        tiers: SHIPPING_CONFIG.shippingTiers,
        minimumShipping: SHIPPING_CONFIG.minimumShipping,
        maximumShipping: SHIPPING_CONFIG.maximumShipping
      }
    };
  } catch (error) {
    console.error('Error calculating shipping:', error);
    return createErrorShippingResult();
  }
}

function calculateItemShipping(item) {
  try {
    const quantity = parseInt(item.quantity || 1);
    const weight = parseFloat(item.weight || 0);
    const totalWeight = (weight * quantity) / 1000;

    // Find the appropriate shipping tier based on weight
    const tier = findShippingTier(totalWeight);
    const shippingCost = tier.cost;

    return {
      itemId: item.product_id,
      itemName: item.name || 'Unknown Product',
      quantity: quantity,
      weight: weight,
      totalWeight: totalWeight,
      cost: shippingCost,
      tier: tier,
      calculation: `Weight: ${totalWeight.toFixed(2)}kg - Tier: up to ${tier.maxWeight}kg = Rs${tier.cost}`
    };
  } catch (error) {
    console.error('Error calculating item shipping:', error);
    return createDefaultItemShipping(item);
  }
}

function findShippingTier(weight) {
  for (const tier of SHIPPING_CONFIG.shippingTiers) {
    if (weight <= tier.maxWeight) {
      return tier;
    }
  }

  // If weight exceeds all tiers, return the largest tier
  return SHIPPING_CONFIG.shippingTiers[SHIPPING_CONFIG.shippingTiers.length - 1];
}

function createFreeShippingResult() {
  return {
    cost: 0,
    details: `Free shipping (order above Rs${SHIPPING_CONFIG.freeShippingThreshold})`,
    breakdown: [],
    totalWeight: 0
  };
}

function createEmptyCartShippingResult() {
  return {
    cost: 0,
    details: 'No items in cart',
    breakdown: [],
    totalWeight: 0
  };
}

function createErrorShippingResult() {
  return {
    cost: SHIPPING_CONFIG.minimumShipping,
    details: 'Error calculating shipping - using minimum rate',
    breakdown: [],
    totalWeight: 0
  };
}

function createDefaultItemShipping(item) {
  const defaultTier = SHIPPING_CONFIG.shippingTiers[0]; // Use first tier as default
  return {
    itemId: item.product_id || 'unknown',
    itemName: item.name || 'Unknown Product',
    quantity: 1,
    weight: 0,
    totalWeight: 0,
    cost: defaultTier.cost,
    tier: defaultTier,
    calculation: 'Error - using default tier'
  };
}

function updateCheckoutTotalsWithShipping(subtotal, cartItems) {
  const shippingResult = calculateShipping(cartItems, subtotal);
  const shipping = shippingResult.cost;
  const taxRate = 0.0;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  updateCheckoutDisplayElements(subtotal, shipping, tax, total, shippingResult);

  console.log('Shipping calculation:', shippingResult);
  console.log(`Checkout totals - Subtotal: Rs${subtotal.toFixed(0)}, Shipping: Rs${shipping.toFixed(0)}, Total: Rs${total.toFixed(0)}`);

  return {
    subtotal: subtotal,
    shipping: shipping,
    tax: tax,
    total: total,
    shippingDetails: shippingResult
  };
}

function updateCheckoutDisplayElements(subtotal, shipping, tax, total, shippingResult) {
  const elements = {
    'checkout-subtotal': `Rs${subtotal.toFixed(0)}`,
    'checkout-tax': tax === 0 ? "Rs0" : `Rs${tax.toFixed(0)}`,
    'checkout-total': `${total.toFixed(0)}`
  };

  Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  });

  updateShippingDisplay(shipping, shippingResult);
}

function updateShippingDisplay(shipping, shippingResult) {
  const shippingElement = document.getElementById("checkout-shipping");
  if (shippingElement) {
    if (shipping === 0) {
      shippingElement.textContent = "Free";
      shippingElement.style.color = "green";
    } else {
      shippingElement.textContent = `${shipping.toFixed(0)}`;
      shippingElement.style.color = "";
    }
  }

  const shippingDetailsElement = document.getElementById("shipping-details");
  if (shippingDetailsElement) {
    shippingDetailsElement.textContent = shippingResult.details;

    // Create detailed tooltip with weight and tier information
    let tooltipText = `Total Weight: ${shippingResult.totalWeight.toFixed(2)} kg\n`;
    if (shippingResult.breakdown.length > 0) {
      tooltipText += `Weight Tiers Used:\n`;
      shippingResult.breakdown.forEach(item => {
        if (item.tier) {
          tooltipText += `${item.itemName}: ${item.totalWeight.toFixed(2)}kg (up to ${item.tier.maxWeight}kg) - Rs${item.tier.cost}\n`;
        }
      });
    }

    shippingDetailsElement.title = tooltipText;
  }
}

// ============================================================================
// ORDER PLACEMENT FUNCTIONS
// ============================================================================

async function placeOrder(event) {
  event.preventDefault();

  const customerToken = sessionStorage.getItem('token');
  if (!customerToken) {
    showErrorLoader('Please Sign Up or Login to place order. Redirecting...', 2000);
    setTimeout(() => {
      window.location.replace("signup.html");
    }, 2000);
    return;
  }

  const submitButton = event.target.querySelector('button[type="submit"]');
  const originalButtonText = submitButton ? submitButton.textContent : '';

  try {
    if (!validateCheckoutForm()) {
      return;
    }

    updateSubmitButton(submitButton, true);
    showLoader('Processing your order...');

    console.log('Fetching cart items...');
    const cartData = await getCart();

    if (!cartData || !cartData.items || cartData.items.length === 0) {
      showErrorLoader('Your cart is empty. Please add items before placing an order.');
      return;
    }

    const addressData = collectAddressData();

    // Show progress for saving addresses
    showProgressLoader('Saving addresses...', 25);
    await saveAddresses(addressData);

    // Show progress for placing order
    showProgressLoader('Placing order...', 75);
    console.log('Placing order...');
    const orderResult = await submitOrder(cartData, addressData);
    console.log(orderResult)
    showProgressLoader('Finalizing order...', 100);

    if (orderResult.order || orderResult.success) {
      console.log('Order placed successfully:', orderResult);
      showSuccessLoader(`Order placed successfully! Order ID: ${orderResult.order?.order_number || 'N/A'}`, 3000);
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 3000);
    } else {
      // Handle different failure types
      if (orderResult.cancelled) {
        showErrorLoader('Payment was cancelled. You can try again.', 5000);
      } else {
        showErrorLoader(`Payment Failed: ${orderResult.message}`, 5000);
      }

      // Don't redirect on cancellation, let user try again
      if (!orderResult.cancelled) {
        setTimeout(() => {
          // window.location.href = 'orders.html';
        }, 3000);
      }
    }
  } catch (error) {
    console.error('Error placing order:', error);
    showErrorLoader(`Failed to place order: ${error.message}`);
  } finally {
    updateSubmitButton(submitButton, false, originalButtonText);
  }
}

function updateSubmitButton(button, isLoading, originalText = 'Place Order') {
  if (!button) return;

  if (isLoading) {
    button.disabled = true;
    button.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Placing Order...';
  } else {
    button.disabled = false;
    button.textContent = originalText;
  }
}

async function saveAddresses(addressData) {
  try {
    await Promise.allSettled([
      saveCustomerAddress('shipping', {
        line1: addressData.shipping.line1,
        line2: addressData.shipping.line2,
        country: addressData.shipping.country,
        postcode: addressData.shipping.postcode
      }),
      saveCustomerAddress('billing', {
        line1: addressData.billing.line1,
        line2: addressData.billing.line2,
        country: addressData.billing.country,
        postcode: addressData.billing.postcode
      })
    ]);
  } catch (error) {
    console.error('Error saving addresses:', error);
  }
}


function formatAddress(address) {
  return `${address.line1} ${address.line2} ${address.country} ${address.postcode}`.trim();
}

function validateCheckoutForm() {
  const requiredFields = [
    { id: 'shippingAddressLine1', name: 'Shipping Address Line 1' },
    { id: 'shippingCountry', name: 'Shipping Country' },
    { id: 'shippingPostcode', name: 'Shipping Postcode' },
    { id: 'billingAddressLine1', name: 'Billing Address Line 1' },
    { id: 'billingCountry', name: 'Billing Country' },
    { id: 'billingPostcode', name: 'Billing Postcode' }
  ];

  for (const field of requiredFields) {
    const element = document.getElementById(field.id);
    if (!element || !element.value.trim()) {
      showErrorLoader(`Please fill in ${field.name}`, 2000);
      element?.focus();
      return false;
    }
  }

  const paymentMethod = getSelectedPaymentMethod();
  if (!paymentMethod) {
    showErrorLoader('Please select a payment method', 2000);
    return false;
  }

  return true;
}

function collectAddressData() {
  return {
    shipping: {
      line1: document.getElementById('shippingAddressLine1')?.value || '',
      line2: document.getElementById('shippingAddressLine2')?.value || '',
      country: document.getElementById('shippingCountry')?.value || '',
      postcode: document.getElementById('shippingPostcode')?.value || ''
    },
    billing: {
      line1: document.getElementById('billingAddressLine1')?.value || '',
      line2: document.getElementById('billingAddressLine2')?.value || '',
      country: document.getElementById('billingCountry')?.value || '',
      postcode: document.getElementById('billingPostcode')?.value || ''
    }
  };
}

function getSelectedPaymentMethod() {
  const paymentRadios = document.querySelectorAll('input[name="payment_method"]');

  for (const radio of paymentRadios) {
    if (radio.checked) {
      return radio.value;
    }
  }

  const paymentSelect = document.getElementById('payment-method');
  if (paymentSelect) {
    return paymentSelect.value;
  }

  return 'CashFree';
}
