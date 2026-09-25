// Live backend URL on Render
const BACKEND_URL = 'https://lagos-luxury-realestate-1.onrender.com';

// Global array to store fetched properties
let allProperties = [];

// Helper function: Prefix relative Django media paths with active backend domain
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

// 2. Initial view setup
showScreen('first');

// 3. Navigation Event Listeners
const browseBtn = document.getElementById('browse');
if (browseBtn) {
  browseBtn.addEventListener('click', () => showScreen('HomePage'));
}

// 4. Render Property Cards
function renderProperties(properties) {
  const container = document.getElementById('propertyContainer');
  if (!container) return;

  container.innerHTML = '';

  if (!properties || properties.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #64748b;">
        <h3>No matching properties found</h3>
        <p>Try adjusting your search terms or filters.</p>
      </div>
    `;
    return;
  }

  properties.forEach(item => {
    const property = item.fields ? { id: item.pk, ...item.fields } : item;

    // Check capitalized backend keys (Title, Description, Property_type) first
    const title = property.Title || property.title || property.name || 'Untitled Property';
    const rawType = property.Property_type || property.property_type || property.category || property.type || 'Property';
    const rawDesc = property.Description || property.description || property.desc || property.details || '';
    
    const description = rawDesc 
      ? (rawDesc.length > 90 ? rawDesc.substring(0, 90) + '...' : rawDesc)
      : 'No description provided for this listing.';
      
    const price = property.price ? Number(property.price).toLocaleString() : 'N/A';
    const image = property.image || property.photo || '';

    container.innerHTML += `
      <div class="card">
        <div class="card-image-wrap">
          <img src="${getImageUrl(image)}" alt="${title}">
          <span class="badge">${String(rawType).toUpperCase()}</span>
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

// 5. Fetch Properties from Backend
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

// 6. Search and Category Filter Logic
function setupFiltersAndSearch() {
  const searchInput = document.getElementById('searchInput') || document.querySelector('.search input');
  const filterBtns = document.querySelectorAll('.filter-btn');

  function applyFilter(categoryName) {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const targetCategory = categoryName.toLowerCase().trim();

    const filtered = allProperties.filter(item => {
      const property = item.fields ? { id: item.pk, ...item.fields } : item;

      // Read capitalized key names for filtering
      const title = String(property.Title || property.title || property.name || '').toLowerCase();
      const location = String(property.location || property.address || '').toLowerCase();
      const pType = String(property.Property_type || property.property_type || property.category || '').toLowerCase().trim();

      const matchesSearch = query === '' || title.includes(query) || location.includes(query);
      const matchesCategory = targetCategory === 'all' || pType === targetCategory || pType.includes(targetCategory) || targetCategory.includes(pType);

      return matchesSearch && matchesCategory;
    });

    renderProperties(filtered);
  }

  filterBtns.forEach(btn => {
    btn.onclick = function(e) {
      e.preventDefault();
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const category = this.textContent.trim();
      applyFilter(category);
    };
  });

  if (searchInput) {
    searchInput.oninput = () => {
      const activeBtn = document.querySelector('.filter-btn.active');
      const category = activeBtn ? activeBtn.textContent.trim() : 'All';
      applyFilter(category);
    };
  }
}

// 7. Detail Page Logic
function openDetailPage(id) {
  fetch(`${BACKEND_URL}/api/properties/${id}/`)
    .then(response => response.json())
    .then(data => {
      const property = data.fields ? { id: data.pk, ...data.fields } : data;
      const detailContainer = document.getElementById('detailContent');
      if (!detailContainer) return;

      const title = property.Title || property.title || property.name || 'Property Detail';
      const price = property.price ? Number(property.price).toLocaleString() : 'N/A';
      const description = property.Description || property.description || property.desc || 'No detailed description provided for this listing.';
      const location = property.location || property.address ? `<p class="location" style="color: #475569; margin-top: 0.5rem;">📍 ${property.location || property.address}</p>` : '';
      const image = property.image || property.photo || '';

      detailContainer.innerHTML = `
        <div class="detail-nav" style="margin-bottom: 1.5rem;">
          <button class="btn-secondary" onclick="showScreen('HomePage')">← Back to Listings</button>
          <button class="btn-outline" onclick="showScreen('first')">🏠 Home Screen</button>
        </div>
        
        <div class="detail-card">
          <img src="${getImageUrl(image)}" class="detail-image" alt="${title}" style="max-width: 100%; border-radius: 8px;">
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