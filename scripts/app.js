const navSlide = () => {
    const burger = document.querySelector('.hamburger');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const closeBtn = document.querySelector('.close-menu');

    if (burger) {
        burger.addEventListener('click', () => {
            overlay.classList.add('active');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('active');
        });
    }
}

const app = () => {
    navSlide();
}

app();

app();

// Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('hidden');
        }
    }, 2000); // 2 seconds
});

// Dynamic Content Logic
window.addEventListener('DOMContentLoaded', () => {
    if (typeof agentsData !== 'undefined') {
        renderProducts();
        initLogoCarousel();
    }
});

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = agentsData.map(agent => `
        <div class="card">
            ${agent.badge ? `<span class="card-badge">${agent.badge}</span>` : ''}
            <div>
                <div class="card-header">
                    <div class="card-logo">
                        <img src="${agent.logo}" alt="${agent.name}" style="width: 100%; height: 100%; object-fit: contain;">
                    </div>
                    <h3 class="card-title">${agent.name}</h3>
                </div>
                <div class="card-body">
                    <ul>
                        ${agent.features.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-primary" onclick="${agent.agentLink ? `window.open('${agent.agentLink}', '_blank')` : `alert('Coming Soon!')`}">Take me to Agent</button>
                <button class="btn btn-secondary" onclick="${agent.customLink ? `window.open('${agent.customLink}', '_blank')` : `alert('Contacting...')`}">Get it customised for you</button>
            </div>
        </div>
    `).join('');
}

function initLogoCarousel() {
    const stack = document.getElementById('logoStack');
    if (!stack) return;

    // Create card elements
    const carouselAgents = agentsData.filter(agent => !agent.badge);
    stack.innerHTML = carouselAgents.map((agent, index) => `
        <div class="stack-card ${index === 0 ? 'active' : 'waiting'}" style="z-index: ${carouselAgents.length - index}">
            <img src="${agent.logo}" alt="${agent.name}">
        </div>
    `).join('');

    const cards = stack.querySelectorAll('.stack-card');
    let currentIndex = 0;

    setInterval(() => {
        const currentCard = cards[currentIndex];
        const nextIndex = (currentIndex + 1) % cards.length;
        const nextCard = cards[nextIndex];

        // Animate Current -> Leaving
        currentCard.classList.remove('active');
        currentCard.classList.add('leaving');

        // Animate Next -> Active (from back)
        nextCard.classList.remove('waiting');
        nextCard.classList.add('active');

        // Reset 'Leaving' card to 'Waiting' after animation clears
        setTimeout(() => {
            currentCard.classList.remove('leaving');
            currentCard.classList.add('waiting');
            // Move to back z-index
            // We handle z-index visually via CSS or simple loop, 
            // but for this effect, resetting to 'waiting' state puts it at the back visually if styled right.
        }, 1000); // Match CSS transition duration

        currentIndex = nextIndex;
    }, 3000); // rotate every 3 seconds
}

// Connect Page Logic
window.addEventListener('DOMContentLoaded', () => {
    initConnectPage();
});

function initConnectPage() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    const bugAgentSelect = document.getElementById('bugAgent');

    // 1. Tab Switching
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));

                // Add active to clicked
                tab.classList.add('active');
                const targetId = tab.getAttribute('data-tab');
                document.getElementById(targetId).classList.add('active');
            });
        });
    }

    // 2. Populate Bug Report Dropdown
    if (bugAgentSelect && typeof agentsData !== 'undefined') {
        agentsData.forEach(agent => {
            const option = document.createElement('option');
            option.value = agent.name; // Use name for readability in email
            option.textContent = agent.name;
            bugAgentSelect.appendChild(option);
        });
    }

    // 3. Handle Forms
    const connectForm = document.getElementById('connectForm');
    const bugForm = document.getElementById('bugForm');

    if (connectForm) {
        connectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('connectName').value;
            const email = document.getElementById('connectEmail').value;
            const reason = document.getElementById('connectReason').value;

            const subject = encodeURIComponent(`Connect: ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nReason:\n${reason}`);

            window.location.href = `mailto:b6aisolutions@gmail.com?subject=${subject}&body=${body}`;
        });
    }

    if (bugForm) {
        bugForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const agent = document.getElementById('bugAgent').value;
            const description = document.getElementById('bugDescription').value;
            // Screenshot cannot be attached via mailto

            const subject = encodeURIComponent(`Bug Report: ${agent}`);
            const body = encodeURIComponent(`Agent: ${agent}\n\nDescription:\n${description}\n\n[Please attach your screenshot manually if you have one]`);

            window.location.href = `mailto:b6aisolutions@gmail.com?subject=${subject}&body=${body}`;
        });
    }
}
