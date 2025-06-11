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
        card.appendChild(date);
        card.appendChild(location);
        card.appendChild(link);

        card.addEventListener('click', () => openModal(conference));

        container.appendChild(card);

        // Animate card appearance
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = 1;
            card.style.transform = 'translateY(0)';
        }, 50);
    });
}

function filterAndSortConferences(conferences) {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const sortOption = document.getElementById('sort').value;

    let filtered = conferences.filter(conf => conf.name.toLowerCase().includes(searchTerm));

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

// Fetch and render AR/VR news using NewsAPI.org
async function fetchNews() {
    const apiKey = process.env.NEWSAPI_KEY; // API key will be injected during build
    if (!apiKey) {
        console.error('News API key not found');
        return;
    }
    const url = `https://newsapi.org/v2/everything?q=augmented+reality+OR+virtual+reality+OR+ar+vr&language=en&sortBy=publishedAt&pageSize=6&apiKey=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'ok') {
            renderNews(data.articles);
        } else {
            document.getElementById('news-container').innerHTML = '<p>Failed to load news.</p>';
        }
    } catch (error) {
        document.getElementById('news-container').innerHTML = '<p>Error loading news.</p>';
    }
}

function renderNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';

    articles.forEach(article => {
        const card = document.createElement('div');
        card.className = 'news-article';

        const title = document.createElement('h3');
        title.textContent = article.title;

        const description = document.createElement('p');
        description.textContent = article.description || 'No description available.';

        const link = document.createElement('a');
        link.href = article.url;
        link.textContent = 'Read More';
        link.target = '_blank';

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(link);

        newsContainer.appendChild(card);
    });
}

// Extend DOMContentLoaded to fetch news
document.addEventListener('DOMContentLoaded', async () => {
    const conferences = await fetchConferences();
    currentConferences = conferences;
    renderPage();

    document.getElementById('search').addEventListener('input', () => filterAndSortConferences(currentConferences));
    document.getElementById('sort').addEventListener('change', () => filterAndSortConferences(currentConferences));

    await fetchNews();
});
