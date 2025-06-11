// Enhance UI with animated loading and smooth transitions

const container = document.getElementById('conferences');
const pagination = document.getElementById('pagination');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const modalTitle = document.getElementById('modal-title');
const modalDate = document.getElementById('modal-date');
const modalLocation = document.getElementById('modal-location');
const modalDescription = document.getElementById('modal-description');
const modalLink = document.getElementById('modal-link');

let currentPage = 1;
const itemsPerPage = 5;
let currentConferences = [];
let masterConferences = [];

function showLoading() {
    container.innerHTML = '<p class="loading">Loading conferences...</p>';
}

function clearLoading() {
    container.innerHTML = '';
}

async function fetchConferences() {
    showLoading();
    const response = await fetch('conferences.json');
    const data = await response.json();
    clearLoading();
    return data;
}

function renderConferences(conferences) {
    container.innerHTML = '';

    conferences.forEach(conference => {
        const card = document.createElement('div');
        card.className = 'conference-card';
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';

        const name = document.createElement('h3');
        name.textContent = conference.name;

        const date = document.createElement('p');
        const deadline = new Date(conference.date);
        const now = new Date();
        const timeLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        date.textContent = `Deadline: ${conference.date} (${timeLeft} days left)`;

        const location = document.createElement('p');
        location.textContent = `Location: ${conference.location}`;

        const link = document.createElement('a');
        link.href = conference.website;
        link.textContent = 'Visit Website';
        link.target = '_blank';

        card.appendChild(name);
        
        // Add countdown timer
        const countdownContainer = document.createElement('div');
        countdownContainer.className = 'countdown-container';
        
        const countdownCircle = document.createElement('div');
        countdownCircle.className = 'countdown-circle';
        
        const countdownContent = document.createElement('div');
        countdownContent.className = 'countdown-content';
        
        const countdownValue = document.createElement('div');
        countdownValue.className = 'countdown-value';
        
        const countdownLabel = document.createElement('div');
        countdownLabel.className = 'countdown-label';
        
        countdownContent.appendChild(countdownValue);
        countdownContent.appendChild(countdownLabel);
        countdownCircle.appendChild(countdownContent);
        countdownContainer.appendChild(countdownCircle);
        
        card.appendChild(countdownContainer);
        card.appendChild(location);
        card.appendChild(link);

        card.addEventListener('click', () => openModal(conference));

        container.appendChild(card);

        // Start countdown timer
        updateCountdown(card, deadline);

        // Animate card appearance
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = 1;
            card.style.transform = 'translateY(0)';
        }, 50);
    });
}

function filterAndSortConferences() {
    const conferences = masterConferences;
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const sortOption = document.getElementById('sort').value;

    // Filter by search term
    let filtered = searchTerm ?
        conferences.filter(conf =>
            conf.name.toLowerCase().includes(searchTerm) ||
            conf.location.toLowerCase().includes(searchTerm)
        ) :
        [...conferences];

    // Sort results
    if (sortOption === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'date') {
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    currentConferences = filtered;
    currentPage = 1;
    renderPage();
}

function renderPage() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = currentConferences.slice(start, end);

    renderConferences(pageItems);
    renderPagination();
}

function renderPagination() {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(currentConferences.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentPage) {
            btn.disabled = true;
            btn.style.opacity = 0.6;
        }
        btn.addEventListener('click', () => {
            currentPage = i;
            renderPage();
        });
        pagination.appendChild(btn);
    }
}

function openModal(conference) {
    modalTitle.textContent = conference.name;
    modalDate.textContent = `Deadline: ${conference.date}`;
    modalLocation.textContent = `Location: ${conference.location}`;
    modalDescription.textContent = conference.description || 'No description available.';
    modalLink.href = conference.website;

    modal.style.display = 'block';
}

modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

function createCountdownItem(label, deadline, unit) {
    const item = document.createElement('div');
    item.className = 'countdown-item';
    
    const value = document.createElement('div');
    value.className = 'countdown-value';
    value.textContent = '00';
    
    const labelElement = document.createElement('div');
    labelElement.className = 'countdown-label';
    labelElement.textContent = label;
    
    item.appendChild(value);
    item.appendChild(labelElement);
    
    return item;
}

function updateCountdown(card, deadline) {
    const countdownContainer = card.querySelector('.countdown-container');
    if (!countdownContainer) return;

    const countdownCircle = countdownContainer.querySelector('.countdown-circle');
    const countdownValue = countdownContainer.querySelector('.countdown-value');
    const countdownLabel = countdownContainer.querySelector('.countdown-label');

    function update() {
        const now = new Date();
        const diff = deadline - now;

        if (diff <= 0) {
            countdownValue.textContent = 'EXPIRED';
            countdownLabel.textContent = '';
            countdownCircle.classList.add('expired');
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Format time string
        const timeStr = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        countdownValue.textContent = timeStr;
        countdownLabel.textContent = 'UNTIL DEADLINE';

        // Remove expired class if it exists
        countdownCircle.classList.remove('expired');
    }

    // Update immediately and then every second
    update();
    setInterval(update, 1000);
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const conferences = await fetchConferences();
    masterConferences = conferences;
    currentConferences = conferences;
    renderPage();

    const searchInput = document.getElementById('search');
    const sortSelect = document.getElementById('sort');

    // Real-time search
    searchInput.addEventListener('input', () => {
        filterAndSortConferences();
    });

    // Sort change
    sortSelect.addEventListener('change', () => {
        filterAndSortConferences();
    });
});
