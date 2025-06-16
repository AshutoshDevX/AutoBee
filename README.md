# 🚗 AutoBee — Car Marketplace Platform

AutoBee is a full-featured car marketplace platform where users can:

- Browse and view car details
- Upload car images and extract info using AI
- Book test drives
- Calculate EMIs
- Save cars to favorites
- Search using multiple filters (make, price, fuel type, body type, transmission)
- Use AI-based image search
- Authenticate securely using Clerk

It also includes an **Admin Panel** where the admin can:

- View dashboard analytics
- Manage car listings
- Manage test drive bookings
- Adjust application settings
- Upload car pictures and extract data using **Google Gemini**
- Authenticate via Clerk

---

## ✨ Features

### 🧭 User Functionality

- Search and filter cars by:
  - Price range
  - Make
  - Fuel type
  - Body type
  - Transmission
- Save favorite cars
- Use AI-based image search
- Book test drives
- EMI calculator
- View car image galleries and details
- Secure authentication using Clerk

### 🛠️ Admin Functionality

- Dashboard with summarized analytics
- Car listing management
- Test drive schedule and control
- App settings and admin panel features
- **AI-powered car image upload using Google Gemini**
- Admin login via Clerk

---

## 🧰 Technologies Used

- **Frontend**: React.js, Tailwind CSS, Shadcn UI, React Dropzone
- **Backend**: Express.js, Multer
- **Database**: PostgreSQL using Prisma ORM (hosted on Supabase)
- **Authentication**: Clerk
- **AI Integration**: Google Gemini for image-based car detail extraction

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/autobee.git
cd autobee
```

### 2. Install Dependencies

```bash
# Run in both frontend and backend directories
npm install
```

### 3. Configure Environment

Create a `.env` file in the root of your project and add the following:

```env
DATABASE_URL=
DIRECT_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

GEMINI_API_KEY=

ARCJET_KEY=
```

### 4. Run the App Locally

```bash
# Start backend
cd backend
npm start
```

```bash
# Start frontend
cd frontend
npm run dev
```

---

## 🧠 Credits

Built with ❤️ by **Ashutosh Bhagat**
