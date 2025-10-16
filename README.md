📚 Library Account Management System (Library ERP)
A full-stack administrative dashboard built with Next.js and Supabase for managing essential library operations, including student registration, financial transactions, and comprehensive reporting.

Project Description (What to use on the GitHub page)
Suggested Short Description:

Full-stack ERP dashboard built with Next.js and Supabase for managing student accounts, fees, and expenses. Features secure, multi-user authentication with enforced data segregation (Row Level Security).

🛠️ Tech Stack and Features
Technology Overview
This application is built on a modern serverless stack. We use Next.js 14+ (App Router) for the entire application (frontend and backend APIs) and rely on Supabase as the primary data store and authentication provider. This setup ensures that the application is secure, scalable, and offers true data segregation, meaning every Admin can only access the records they personally created.

Core Features
Authentication: Secure registration and login using Email and Password.

Student Management: Complete CRUD operations (Add, View, Edit, Delete) for student records, with real-time balance tracking.

Financial Management: Dedicated sections for recording Payments and Expenses, with calculated summaries for Income, Expenses, and Net Balance.

Data Integrity: Payments and Expenses are linked via user-defined IDs and recorded to the database.

Reporting: A functional backend API route (/api/report) that fetches consolidated data from all tables and generates a comprehensive, downloadable CSV file for analytics.

🔒 Data Security and Segregation (Key Selling Point)
The system is designed for multiple Admin users, where data privacy is paramount.

User Isolation: Data visibility is strictly limited based on the user_id of the logged-in Admin.

Row Level Security (RLS): This security feature is fully enabled on the students, payments, and expenses tables. All database queries are automatically filtered by Supabase, ensuring that a new user logs into a dashboard with zero records, and existing users can only see their own previously entered data.

⚙️ Setup Instructions
To get the project running locally:

Clone the Repo: Download the source code to your machine.

Install Dependencies: Run npm install in the project root.

Supabase Setup: Create a new Supabase project and get your API URL and anon key.

Environment Variables: Create a .env.local file in the project root with your credentials:

Code snippet

NEXT_PUBLIC_SUPABASE_URL="YOUR_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_KEY"
Run SQL Policies: Ensure the RLS policies for SELECT, INSERT, and DELETE (using the auth.uid() = user_id condition) are active on your students, payments, and expenses tables.

Start Dev Server: Run npm run dev.

The application will now be live at http://localhost:3000.
