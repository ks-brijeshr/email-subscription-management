# Email Subscription Management API

This is a Laravel 12-based **Email Subscription Management** project with features like Subscription Lists, API Access Management, Security, and more.

##  Features
- User Authentication (Signup/Login, Email Verification, Password Reset)
- Subscription List Management (Business Email Restriction, DNS Verification)
- Subscriber Management (Tagging, Filtering, Export)
- API & Access Management (Generate & Manage API Tokens)
- API Documentation (Auto-generated via Scribe)
- Email Unsubscribe System (Track Unsubscribes)
- System Logs & Analytics (Email Verification Stats, API Insights)
- Security & Compliance (reCAPTCHA, Rate Limiting, IP Blocking)

## Installation

1️) Clone the repository:

git clone https://github.com/yourusername/your-repository.git
cd your-repository


2️)  Install dependencies:

composer install
npm install


3️) Set up environment variables:

cp .env.example .env
php artisan key:generate


4) Start the development server:

php artisan serve



## API Documentation:-

php artisan scribe:generate



## Tech Stack:-

Laravel 12
Sanctum (API Authentication)
MySQL (Database)
Scribe (API Documentation)

