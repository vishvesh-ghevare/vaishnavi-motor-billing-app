# Vaishnavi Motor Billing App

A web-based billing management application developed for **Vaishnavi Motor – Rewinding and Engineering Works**.

The application is designed to simplify receipt creation, billing operations, and receipt management.

## Project Overview

The Vaishnavi Motor Billing App is a web application built using HTML, CSS, JavaScript, and Supabase. It aims to make daily billing activities easier by providing a digital interface for creating and managing customer receipts.

## Technologies Used

- **HTML5** – Web page structure
- **CSS3** – Styling and responsive layout
- **JavaScript** – Application logic and interactions
- **Supabase** – Backend services and database
- **GitHub** – Source code hosting and version control

## Key Features

- Create customer bills and receipts
- Enter service or work descriptions and amounts
- Calculate receipt totals
- Save and manage billing records using Supabase
- View receipt history
- Display business information on receipts
- Support receipt image generation and sharing, where configured

*Note: Features depend on the current application implementation and Supabase configuration.*

## Project Structure

```text
vaishnavi-motor-billing-app/
├── billing_app/
│   ├── index.html
│   ├── new_bill.html
│   ├── products.html
│   ├── receipts.html
│   ├── receipts.js
│   ├── style.css
│   ├── signature.png
│   └── service-worker.js
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/vishvesh-ghevare/vaishnavi-motor-billing-app.git
```

### 2. Open the Project Folder

```bash
cd vaishnavi-motor-billing-app/billing_app
```

### 3. Configure Supabase

- Create or use a Supabase project.
- Configure the required database tables and access policies.
- Set the Supabase project URL and publishable/anon key in the application configuration.
- Never expose a Supabase service-role key or other secret credentials in frontend code.

### 4. Run the Application

Open `index.html` using a local development server, such as the VS Code Live Server extension.

Make sure the Supabase configuration and required database tables are set up before testing database features.

## Future Enhancements

- Improved dashboard and billing reports
- Better mobile responsiveness
- Enhanced receipt search and filtering
- Additional validation and error handling
- Secure access management

## Developer

**Vishvesh Mahadev Ghevare**

BCA Final Year Student

## Repository

[View Source Code on GitHub](https://github.com/vishvesh-ghevare/vaishnavi-motor-billing-app)# vaishnavi-motor-billing-app
Billing application built using HTML, JavaScript and Supabase
