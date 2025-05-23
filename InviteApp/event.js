// Theme configuration
const themes = {
    default: {
        primary: '#4f46e5',
        primaryDark: '#4338ca',
        gradient: 'bg-gradient-to-r from-indigo-600 to-blue-600'
    },
    sunset: {
        primary: '#f97316',
        primaryDark: '#ea580c',
        gradient: 'bg-gradient-to-r from-orange-500 to-pink-500'
    },
    forest: {
        primary: '#059669',
        primaryDark: '#047857',
        gradient: 'bg-gradient-to-r from-green-600 to-teal-600'
    }
};

// Utility Functions
function formatDateTime(date, time) {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short'
    });
}

function applyTheme(theme) {
    const themeConfig = themes[theme] || themes.default;
    const root = document.documentElement;
    root.style.setProperty('--primary-color', themeConfig.primary);
    root.style.setProperty('--primary-dark', themeConfig.primaryDark);
    
    const header = document.getElementById('eventHeader');
    header.className = `relative h-64 ${themeConfig.gradient} ${themeConfig.textColor}`;
    
    // Apply text colors to all text elements
    document.querySelectorAll('.event-text').forEach(el => {
        el.classList.add(themeConfig.textColor);
    });
    document.querySelectorAll('.event-secondary-text').forEach(el => {
        el.classList.add(themeConfig.secondaryTextColor);
    });
}

function displayEventDetails(eventData) {
    // Apply theme
    applyTheme(eventData.theme);

    // Set event details
    document.getElementById('eventTitle').textContent = eventData.title;
    document.getElementById('eventDateTime').textContent = formatDateTime(eventData.date, eventData.time);
    document.getElementById('eventHost').textContent = `Hosted by ${eventData.host}`;
    document.getElementById('eventDescription').textContent = eventData.description || 'No description provided';
    document.getElementById('eventLocation').textContent = eventData.location || 'No location specified';
    document.getElementById('eventTimezone').textContent = `Event times are shown in ${eventData.timezone}`;

    // Show the event details container with a fade-in animation
    const container = document.getElementById('eventContainer');
    container.classList.remove('opacity-0');
    container.classList.add('opacity-100');
}

function addToCalendar() {
    const eventData = decryptEventData();
    if (!eventData) return;

    const dateTime = new Date(`${eventData.date}T${eventData.time}`);
    const endDateTime = new Date(dateTime.getTime() + (60 * 60 * 1000)); // 1 hour duration

    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.title)}&details=${encodeURIComponent(eventData.description)}&location=${encodeURIComponent(eventData.location)}&dates=${dateTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDateTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;

    window.open(calendarUrl, '_blank');
}

function shareEvent() {
    if (navigator.share) {
        navigator.share({
            title: 'Event Invitation',
            text: 'Join me for this event!',
            url: window.location.href
        });
    } else {
        copyEventLink();
    }
}

function copyEventLink() {
    const dummy = document.createElement('input');
    document.body.appendChild(dummy);
    dummy.value = window.location.href;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);

    const shareBtn = document.getElementById('shareButton');
    const originalText = shareBtn.innerHTML;
    shareBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Copied!';
    setTimeout(() => {
        shareBtn.innerHTML = originalText;
    }, 2000);
}

function decryptEventData() {
    try {
        const hash = window.location.hash.substring(1);
        if (!hash) return null;

        const base64 = hash.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - hash.length % 4) % 4);
        const encrypted = atob(base64);
        const decrypted = CryptoJS.AES.decrypt(encrypted, 'event-key').toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted);
    } catch (error) {
        console.error('Error decrypting event data:', error);
        return null;
    }
}

// Initialize
window.addEventListener('load', () => {
    const eventData = decryptEventData();
    if (eventData) {
        displayEventDetails(eventData);
    } else {
        // Handle invalid or missing event data
        document.getElementById('eventContainer').innerHTML = `
            <div class="text-center py-12">
                <h2 class="text-2xl font-semibold text-gray-900 mb-4">Invalid Event Link</h2>
                <p class="text-gray-600">This event link appears to be invalid or has expired.</p>
                <a href="/" class="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Create New Event
                </a>
            </div>
        `;
    }
});


// Add this to event page initialization
const countdownElement = document.createElement('div');
countdownElement.id = 'countdown';
document.body.insertBefore(countdownElement, document.body.firstChild);

function updateCountdown(endTime) {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end - now;

  if (diff <= 0) {
    countdownElement.textContent = 'Event has already started or is over';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s remaining`;
}

// Call this when loading event details
if (eventData.endTime) {
  updateCountdown(eventData.endTime);
  setInterval(() => updateCountdown(eventData.endTime), 1000);
}