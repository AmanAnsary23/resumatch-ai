# ResuMatch AI — Resume & Job Description Analyzer

ResuMatch AI helps job seekers understand how well their resume matches a job description. Upload a PDF resume, paste a job description, and get an AI-generated match score, keyword comparison, and practical improvement suggestions.

> **Project status:** In development

## Screenshots

### 1. Home / Dashboard

<img width="1917" height="959" alt="Dashboard" src="https://github.com/user-attachments/assets/08b3f171-2be6-4351-8f3e-98f652502ddb" />

### 2. My Analyses

<img width="1917" height="959" alt="My Analyses" src="https://github.com/user-attachments/assets/7682dce9-2f8a-4b97-886e-cf216cd7f060" />

### 3. My Resumes

<img width="1917" height="959" alt="My Resumes" src="https://github.com/user-attachments/assets/955da9a1-dfe2-489a-b046-f9e87d9226be" />

### 4. Email OTP Verification

<img width="1917" height="912" alt="image" src="https://github.com/user-attachments/assets/2976c25d-518c-4cb1-97a5-205bd1754fa4" />

**OTP email preview:**  

<img width="1500" height="312" alt="image" src="https://github.com/user-attachments/assets/909f6c5c-f74f-45c2-a282-6be804d8a773" />

## Features

- **Email/password authentication** — Register, log in, and log out.
- **Email OTP verification** — Verify a new account using a six-digit code sent by email.
- **OTP resend cooldown** — Request a new verification code subject to a cooldown.
- **OTP expiry and attempt limits** — Verification codes expire, and repeated incorrect attempts are limited.
- **PDF resume upload** — Upload a resume PDF (maximum 5 MB).
- **AI-powered resume analysis** — Compare a resume with a job description using the Groq API.
- **Match score and summary** — Get an overview of how closely the resume aligns with the role.
- **Keyword analysis** — Review matched, missing, and partially matched keywords.
- **Actionable feedback** — See strengths, improvement suggestions, and requirement comparisons.
- **Analysis history** — Revisit previous analyses.
- **Saved resumes** — View uploaded resumes and delete them when needed.
- **Protected user data** — Resume and analysis records are scoped to the authenticated user.

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT-based authentication
- Nodemailer for OTP email delivery
- PDF text extraction
- Groq API for AI analysis

## Project Structure

```text
resumatch-ai/
├── Backend/
│   ├── prisma/
│   │   └── migrations/
│   ├── src/
│   │   ├── controllers/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   └── validators/
│   ├── uploads/
│   └── ...
└── Frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── services/
    └── ...
```

The exact files may vary as the project evolves.

## Prerequisites

- Node.js and npm
- PostgreSQL
- A Groq API key
- SMTP credentials for sending OTP verification emails

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd resumatch-ai
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your GitHub repository URL.

### 2. Configure the backend

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory. Configure the values required by your backend:

```env
PORT=8080
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME"
JWT_ACCESS_SECRET="replace-with-a-long-random-secret"
JWT_REFRESH_SECRET="replace-with-a-long-random-secret"
GROQ_API_KEY="your-groq-api-key"

# Email / OTP delivery
SMTP_USER="your-sending-email@example.com"
SMTP_PASS="your-email-app-password"
```

Use the exact environment variable names referenced by your backend code. If your project uses a different refresh-token secret name or additional variables, update this example accordingly. For Gmail, use an App Password where required, not your regular account password.

**Never commit your real `.env` file, email credentials, database credentials, or API keys.**

Apply database migrations using the command supported by your installed Prisma setup. For a standard Prisma project, this is commonly:

```bash
npx prisma migrate deploy
```

Then start the backend using the script defined in `Backend/package.json`, for example:

```bash
npm run dev
```

### 3. Configure the frontend

Open a second terminal from the project root:

```bash
cd Frontend
npm install
npm run dev
```

The frontend API configuration currently expects the backend at:

```text
http://localhost:8080/api
```

If your backend uses a different URL or port, update the frontend API configuration accordingly. For production, configure the frontend to use your deployed backend URL.

## Email OTP Flow

1. A user registers with their name, email, password, and password confirmation.
2. ResuMatch AI sends a six-digit OTP to the user's email address.
3. The user enters the OTP on the verification page.
4. If the OTP is valid and has not expired, the email is marked as verified.
5. If needed, the user can request another OTP after the resend cooldown.
6. The user can then log in.

The backend enforces OTP expiry, a resend cooldown, and a limit on incorrect verification attempts.

## Typical User Flow

1. Create an account.
2. Verify the email address using the OTP sent to the inbox.
3. Log in.
4. Upload a PDF resume.
5. Paste the target job description.
6. Run the AI analysis.
7. Review the match score, keyword gaps, strengths, and improvement suggestions.
8. Open **My Analyses** to revisit analysis history.
9. Open **My Resumes** to manage uploaded resumes.

## Security Notes

- Keep `.env` files, API keys, SMTP credentials, JWT secrets, database credentials, and private resumes out of version control.
- Never commit a real email OTP or email App Password.
- Do not upload real user resumes or other private files to the repository.
- Configure production secrets through your hosting provider's environment settings.
- Use HTTPS and review authentication, cookie, CORS, and upload settings before deploying publicly.

## Roadmap

- [ ] Add a screenshot of the email OTP verification page.
- [ ] Add a screenshot of the OTP email received in the inbox.
- [ ] Add automated tests for key authentication and analysis flows.
- [ ] Prepare and verify production deployment.

## Contributing

Suggestions and improvements are welcome. For larger changes, open an issue first to discuss the proposed update.
