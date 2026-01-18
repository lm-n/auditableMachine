// 1. Select the gallery container
const gallery = document.getElementById('gallery');

// 2. Function to render the cards (Updated with a "No results" message)
function renderGallery(data) {
    gallery.innerHTML = '';

    if (data.length === 0) {
        gallery.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #777; padding: 40px;">No images match these filters.</p>`;
        return;
    }

    data.forEach(item => {
        const cardHTML = `
            <div class="card">
                <div class="image-container">
                    <img src="${item.image_file}" alt="${item.caption}">
                </div>
                <div class="card-footer">${item.emoji}</div>
            </div>
        `;
        gallery.innerHTML += cardHTML;
    });
}

// 3. Initial Load
renderGallery(imageData);

// 4. Filter Logic and Interaction
const allFilterBars = document.querySelectorAll('.filter-bar');

allFilterBars.forEach(bar => {
    const items = bar.querySelectorAll('.filter-item');
    
    items.forEach(item => {
        item.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            items.forEach(el => el.classList.remove('active'));
            
            if (!isActive) {
                this.classList.add('active');
            }
            
            updateGalleryFilters();
        });
    });
});

// 5. The function that connects the filters to the data
function updateGalleryFilters() {
    // Collect active values from each pill
    const activeFilters = {
        animal: document.querySelector('[data-type="animal"] .active')?.dataset.value || null,
        setting: document.querySelector('[data-type="setting"] .active')?.dataset.value || null,
        weather: document.querySelector('[data-type="weather"] .active')?.dataset.value || null
    };
    
    // Perform the filtering
    const filteredResults = imageData.filter(item => {
        const matchAnimal = !activeFilters.animal || item.animal === activeFilters.animal;
        const matchSetting = !activeFilters.setting || item.setting === activeFilters.setting;
        const matchWeather = !activeFilters.weather || item.weather === activeFilters.weather;

        return matchAnimal && matchSetting && matchWeather;
    });

    // Re-render the gallery with the filtered list
    renderGallery(filteredResults);
}

// 4. Modal (Popup) Trigger Logic
const modal = document.getElementById('createModal');
const createBtn = document.getElementById('create'); // Matches your id="create"
const closeBtn = document.getElementById('closeModal');

if (createBtn) {
    createBtn.addEventListener('click', () => {
        modal.style.display = 'flex'; // Shows the modal
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none'; // Hides the modal
    });
}

// Close modal if user clicks the dark background
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// 5. Popup Emoji Selection
const popupBars = document.querySelectorAll('.popup-bar');
popupBars.forEach(bar => {
    const items = bar.querySelectorAll('.filter-item');
    items.forEach(item => {
        item.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            items.forEach(el => el.classList.remove('active'));
            if (!isActive) this.classList.add('active');
        });
    });
});