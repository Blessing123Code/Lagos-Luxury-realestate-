// Live backend URL on Render
const BACKEND_URL = 'https://lagos-luxury-realestate-1.onrender.com';

// Global variable to store all properties fetched from Django
let allProperties = [];

// Helper function: Prefixes relative Django media paths with active backend domain
function getImageUrl(imagePath) {
  if (!imagePath) return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80';
  if (imagePath.startsWith('http')) return imagePath;
  return `${BACKEND_URL}${imagePath}`;
}

// 1. View Switching Function
function showScreen(screenClass) {
  const screens = document.querySelectorAll('.first, .HomePage, .DetailPage');
  screens.forEach(screen => screen.classList.remove('active'));

  const targetScreen = document.querySelector(`.${screenClass}`);
  if (targetScreen) {
    targetScreen.classList.add('active');
  }
}

// 2. Set initial screen state on page load
showScreen('first');

// 3. Navigation Event Listeners
const browseBtn = document.getElementById('browse');
if (browseBtn) {
  browseBtn.addEventListener('click', function() {
    showScreen('HomePage');
  });
}

// 4. Render Function for Property Cards
function renderProperties(properties) {
  const container = document.getElementById('propertyContainer');
  if (!container) return;

  container.innerHTML = '';

  if (properties.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #64748b;">
        <h3>No matching properties found</h3>
        <p>Try adjusting your search terms or filters.</p>
      </div>
    `;
    return;
  }

  properties.forEach(function(property) {
    // Resolve property fields matching Django property model
    const title = property.title || property.name || 'Luxury Real Estate';
    const propertyType = property.property_type || property.category || property.type || 'Featured';
    const description = property.description ? property.description.substring(0, 90) + '...' : 'No description available.';
    const price = property.price ? Number(property.price).toLocaleString() : 'N/A';

    container.innerHTML += `
      <div class="card">
        <div class="card-image-wrap">
          <img src="${getImageUrl(property.image)}" alt="${title}">
          <span class="badge">${propertyType.toUpperCase()}</span>
        </div>
        <div class="card-body">
          <h3>${title}</h3>
          <p class="price">₦${price}</p>
          <p class="description-preview" style="color: #64748b; font-size: 0.9rem; margin: 0.5rem 0;">${description}</p>
          <button class="view-btn" onclick="openDetailPage(${property.id})">Explore Property</button>
        </div>
      </div>
    `;
  });
}

// 5. Fetch All Properties (Home Page)
fetch(`${BACKEND_URL}/api/properties/`)
  .then(response => {
    if (!response.ok) throw new Error('Failed to fetch properties');
    return response.json();
  })
  .then(data => {
    allProperties = data;
    renderProperties(allProperties);
    setupFiltersAndSearch();
  })
  .catch(error => console.error('Error fetching properties:', error));

// 6. Search and Filter Logic
function setupFiltersAndSearch() {
  const searchInput = document.querySelector('.search input');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let activeCategory = 'All';

  function filterData() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filtered = allProperties.filter(property => {
      const title = (property.title || property.name || '').toLowerCase();
      const location = (property.location || '').toLowerCase();
      const pType = (property.property_type || property.category || property.type || '').toLowerCase();

      const matchesSearch = title.includes(query) || location.includes(query);
      const matchesCategory = activeCategory === 'All' || pType === activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    renderProperties(filtered);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeCategory = this.textContent.trim();
      filterData();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterData);
  }
}

// 7. Fetch Single Property Details (Detail Page)
function openDetailPage(id) {
  fetch(`${BACKEND_URL}/api/properties/${id}/`)
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch property details');
      return response.json();
    })
    .then(property => {
      const detailContainer = document.querySelector('.DetailPage');
      if (!detailContainer) return;

      const title = property.title || property.name || 'Property Detail';
      const price = property.price ? Number(property.price).toLocaleString() : 'N/A';
      const description = property.description || 'No detailed description provided for this listing.';
      const location = property.location ? `<p class="location" style="color: #475569; margin-top: 0.5rem;">📍 ${property.location}</p>` : '';

      detailContainer.innerHTML = `
        <div class="detail-nav" style="margin-bottom: 1.5rem;">
          <button class="btn-secondary" onclick="showScreen('HomePage')">← Back to Listings</button>
          <button class="btn-outline" onclick="showScreen('first')">🏠 Home Screen</button>
        </div>
        
        <div class="detail-card">
          <img src="${getImageUrl(property.image)}" class="detail-image" alt="${title}" style="max-width: 100%; border-radius: 8px;">
          <div class="detail-info">
            <h2>${title}</h2>
            ${location}
            <p class="detail-price" style="font-size: 1.5rem; font-weight: bold; color: #1e293b; margin-top: 0.5rem;">₦${price}</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 1.5rem 0;">
            <h3>Description</h3>
            <p class="detail-description" style="line-height: 1.6; color: #334155;">${description}</p>
          </div>
        </div>
      `;

      showScreen('DetailPage');
    })
    .catch(error => console.error('Error loading detail page:', error));
}
