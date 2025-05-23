# Event Inviter Web App

A modern, responsive web application for creating and sharing event invitations. The app uses client-side encryption to generate secure, self-contained event links without requiring server-side storage.

## Features

- Create events with title, description, location, and timing
- Automatic local timezone detection and conversion
- Client-side encryption of event details
- URL-based event sharing (no database required)
- Responsive design that works on all devices
- Modern, intuitive user interface

## Technology Stack

- HTML5
- CSS3 with Tailwind CSS
- Vanilla JavaScript
- CryptoJS for encryption

## Setup

1. Clone the repository
2. Open `index.html` in a web browser

No server setup or database is required as all event data is stored in the URL using encryption.

## How It Works

1. Users fill in event details in the form
2. The app encrypts the event data using CryptoJS
3. Encrypted data is encoded and added to a URL
4. When recipients open the URL, the app decrypts and displays the event details

## Security

- All event data is encrypted client-side
- No data is stored on any server
- URLs are self-contained and secure

## Browser Support

Works on all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## License

MIT License