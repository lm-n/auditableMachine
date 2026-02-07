//Select the gallery container
const gallery = document.getElementById('gallery');

//Function to render the images
function renderGallery(data) {
    gallery.innerHTML = '';

    // If the entire dataset is empty, show the "Instruction" message
    if (generated.length === 0) {
        gallery.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: #5f6368; padding: 60px 20px;">
                <p style="font-size: 1.2rem; margin-bottom: 10px;">✨</p>
                <p>Click <strong>Create Image</strong> to generate your first image.</p>
            </div>`;
        return;
    }

    // If the dataset has items, but the current FILTERING results in 0 items
    if (data.length === 0) {
        gallery.innerHTML = `
            <p style="grid-column: 1/-1; text-align: center; color: #777; padding: 40px;">
                No images in your dataset match these specific filters.
            </p>`;
        return;
    }

    // Otherwise, render the images
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

//Initial Load
renderGallery(generated);

//Filter Logic and Interaction
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


function updateGalleryFilters() {
    // Collect active values from each pill
    const activeFilters = {
        animal: document.querySelector('[data-type="animal"] .active')?.dataset.value || null,
        setting: document.querySelector('[data-type="setting"] .active')?.dataset.value || null,
        weather: document.querySelector('[data-type="weather"] .active')?.dataset.value || null
    };
    
    // Perform the filtering
    const filteredResults = generated.filter(item => {
        const matchAnimal = !activeFilters.animal || item.animal === activeFilters.animal;
        const matchSetting = !activeFilters.setting || item.setting === activeFilters.setting;
        const matchWeather = !activeFilters.weather || item.weather === activeFilters.weather;

        return matchAnimal && matchSetting && matchWeather;
    });

    // Re-render the gallery with the filtered list
    renderGallery(filteredResults);
}

// Modal (Popup) Trigger Logic
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
        closeAndResetModal();
    });
}

// Close modal if user clicks the dark background
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeAndResetModal();
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

const generateBtn = document.getElementById('generateBtn');

let currentMatch = null; // To store the match temporarily

generateBtn.addEventListener('click', () => {
    const selectedAnimal = document.getElementById('modal-animal').value;
    const selectedSetting = document.getElementById('modal-setting').value;
    const selectedWeather = document.getElementById('modal-weather').value;

    if (!selectedAnimal || !selectedSetting || !selectedWeather) {
        alert("Please select all options!");
        return;
    }

    const match = imageData.find(item => 
        item.animal === selectedAnimal && 
        item.setting === selectedSetting && 
        item.weather === selectedWeather
    );

    if (match) {
        currentMatch = match; // Store it
        
        // Hide the selection UI, Show the Preview UI
        document.querySelector('.modal-body').style.display = 'none';
        generateBtn.style.display = 'none';
        
        const previewArea = document.getElementById('resultPreview');
        const previewContainer = document.getElementById('previewContainer');
        
        previewArea.style.display = 'block';
        previewContainer.innerHTML = `<img src="${match.image_file}" style="width:100%; border-radius:15px;">`;
    } else {
        alert("Can't generate that image right now! Try a different combination.");
    }
});

// The "Add to Dataset" Logic
document.getElementById('addToDatasetBtn').addEventListener('click', () => {
    if (currentMatch) {
        // Push the current match into the 'generated' array
        generated.push(currentMatch);

        // Find the index of the match in imageData and remove it
        const index = imageData.indexOf(currentMatch);
        if (index > -1) {
            imageData.splice(index, 1); // Removes 1 item at that index
        }

        // Render only the images that have been 'generated'
        renderGallery(generated); 
        
        // Reset and close the modal
        closeAndResetModal();
        
        // Scroll to the bottom of the gallery to see the newly added item
        window.scrollTo({ 
            top: document.body.scrollHeight, 
            behavior: 'smooth' 
        });
    }
});

// Helper to reset the modal view
function closeAndResetModal() {
    modal.style.display = 'none';
    document.querySelector('.modal-body').style.display = 'flex';
    document.getElementById('generateBtn').style.display = 'block';
    document.getElementById('resultPreview').style.display = 'none';
    document.querySelectorAll('.modal-select').forEach(s => s.selectedIndex = 0);
    currentMatch = null;
}

// "Try Again" button logic
document.getElementById('tryAgainBtn').onclick = () => {
    document.querySelector('.modal-body').style.display = 'flex';
    document.getElementById('generateBtn').style.display = 'block';
    document.getElementById('resultPreview').style.display = 'none';
};
