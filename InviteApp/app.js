// Theme configuration
const themes = {
    default: {
        primary: '#4f46e5',
        primaryDark: '#4338ca',
        gradient: 'bg-gradient-to-r from-indigo-600 to-blue-600',
        textColor: 'text-white',
        secondaryTextColor: 'text-gray-100'
    },
    sunset: {
        primary: '#f97316',
        primaryDark: '#ea580c',
        gradient: 'bg-gradient-to-r from-orange-500 to-pink-500',
        textColor: 'text-white',
        secondaryTextColor: 'text-gray-100'
    },
    forest: {
        primary: '#059669',
        primaryDark: '#047857',
        gradient: 'bg-gradient-to-r from-green-600 to-teal-600',
        textColor: 'text-white',
        secondaryTextColor: 'text-gray-100'
    }
};

function selectTheme(theme) {
    document.getElementById('selectedTheme').value = theme;
    document.querySelectorAll('.theme-option').forEach(option => {
        option.style.transition = 'all 0.3s ease';
        option.classList.remove('selected');
        option.style.transform = 'scale(1)';
    });
    const selectedOption = document.querySelector(`[data-theme="${theme}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
        selectedOption.style.transform = 'scale(1.05)';
    }
}

function validateRequiredFields() {
    const requiredFields = ['host', 'title', 'date', 'time'];
    let isValid = true;
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.classList.add('border-red-500');
            isValid = false;
        } else {
            field.classList.remove('border-red-500');
        }
    });
    return isValid;
}

function generateEventLink() {
    if (!validateRequiredFields()) return;
    const host = document.getElementById('host').value.trim();
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const location = document.getElementById('location').value.trim();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const theme = document.getElementById('selectedTheme').value;

    // Validate required fields
    if (!host || !title || !date || !time) {
        const missingFields = [];
        if (!host) missingFields.push('Host Name');
        if (!title) missingFields.push('Event Title');
        if (!date) missingFields.push('Date');
        if (!time) missingFields.push('Time');

        alert(`Please fill in the following required fields:\n${missingFields.join('\n')}`);
        return;
    }

    const eventData = {
        host,
        title,
        description,
        location,
        date,
        time,
        theme,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(eventData), 'event-key').toString();
    const base64 = btoa(encrypted).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    const eventLink = `${window.location.protocol}//${window.location.host}/event.html#${base64}`;

    const linkInput = document.getElementById('linkInput');
    linkInput.value = eventLink;

    document.getElementById('eventLink').classList.remove('hidden');
    linkInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function copyLink() {
    const button = event.target.closest('button');
    button.classList.add('animate-pulse');
    setTimeout(() => {
        button.classList.remove('animate-pulse');
    }, 1000);
    const linkInput = document.getElementById('linkInput');
    linkInput.select();
    document.execCommand('copy');

    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check mr-2"></i>Copied!';
    setTimeout(() => {
        button.innerHTML = originalText;
    }, 2000);
}

// Initialize
window.addEventListener('load', () => {
    // Set default theme active state
    selectTheme('default');

    // Set minimum date to today
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    // Set default time to next hour
    const timeInput = document.getElementById('time');
    const now = new Date();
    now.setHours(now.getHours() + 1, 0, 0); // Next hour, 0 minutes
    timeInput.value = now.toTimeString().slice(0, 5);
});