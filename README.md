# Ticket Management System

This is a **Ticket Management System** built using **Remix, TypeScript, MySQL, Prisma, and Tailwind CSS**. Customers can create and track tickets, while admins can view and respond to them.

## Features
- **User Authentication**: Customers and admins can log in.
- **Ticket Management**: Customers can create tickets and view responses.
- **Admin Dashboard**: Admins can view and reply to customer tickets.
- **MySQL Database**: Managed with Prisma ORM.
- **Session Management**: Handled via cookies.
- **Role-Based Access**: Different views for customers and admins.

## Prerequisites
Ensure you have the following installed:
- **Node.js** (v18 or later)
- **MySQL** (running locally or via a cloud provider)

## Installation
1. **Clone the Repository:**
   ```sh
   git clone https://github.com/your-username/ticket-management.git
   cd ticket-management
   ```

2. **Install Dependencies:**
   ```sh
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/ticket_db"
   SESSION_SECRET="your-secret-key"
   ```

4. **Setup Database:**
   ```sh
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Run the Development Server:**
   ```sh
   npm run dev
   ```
   The app should now be running at `http://localhost:3000`.

## Usage
### Customer
- **Sign up & log in**
- **Create a ticket**
- **View tickets & admin replies**

### Admin
- **Log in as an admin**
- **View all tickets**
- **Reply to tickets**

## Deployment
To deploy, use **Vercel, Railway, or any Node.js hosting service**. Ensure your **MySQL database** is accessible remotely and update `DATABASE_URL` accordingly.

## License
This project is licensed under the MIT License.

---
Need help? Feel free to reach out! 🚀

