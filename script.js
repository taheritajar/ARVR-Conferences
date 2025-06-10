async function fetchConferences() {
    const response = await fetch('conferences.json');
    const data = await response.json();
    return data;
}

function renderConferences(conferences) {
    const container = document.getElementById('conferences');
    container.innerHTML = '';

    conferences.forEach(conference => {
        const card = document.createElement('div');
        card.className = 'conference-card';

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

        container.appendChild(card);
    });
}

function filterAndSortConferences(conferences) {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const sortOption = document.getElementById('sort').value;

    let filtered = conferences.filter(conference =>
        conference.name.toLowerCase().includes(searchInput)
    );

    if (sortOption === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'date') {
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    renderConferences(filtered);
}

document.addEventListener('DOMContentLoaded', async () => {
    const conferences = await fetchConferences();
    renderConferences(conferences);

    document.getElementById('search').addEventListener('input', () => filterAndSortConferences(conferences));
    document.getElementById('sort').addEventListener('change', () => filterAndSortConferences(conferences));
});
