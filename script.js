const conferences = [
    {
        name: "AR/VR World Summit",
        date: "2025-07-15",
        location: "San Francisco, CA",
        website: "https://arvrworldsummit.com"
    },
    {
        name: "Virtual Reality Developers Conference",
        date: "2025-08-20",
        location: "New York, NY",
        website: "https://vrdc.com"
    },
    {
        name: "Augmented Reality Expo",
        date: "2025-09-10",
        location: "Los Angeles, CA",
        website: "https://arexpo.com"
    }
];

function renderConferences() {
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

document.addEventListener('DOMContentLoaded', renderConferences);
