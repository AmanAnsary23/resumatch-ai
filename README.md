# ResuMatch --- AI-Powered Resume & Job Description Analyzer

ResuMatch helps job seekers understand how well their resume matches a
job description. Upload a PDF resume, paste a job description, and get
an AI-generated match score, keyword comparison, and practical
improvement suggestions.

> **Project status:** In development

## Screenshots

Add your screenshots to `docs/screenshots/` using the filenames below.
The three preview areas will display them automatically once the images
are added.

### 1. Home / Dashboard

<img width="1917" height="959" alt="DashBoard" src="https://github.com/user-attachments/assets/08b3f171-2be6-4351-8f3e-98f652502ddb" />

### 2. My Analyses

<img width="1917" height="959" alt="My Analisis" src="https://github.com/user-attachments/assets/7682dce9-2f8a-4b97-886e-cf216cd7f060" />

### 3. My Resumes

<img width="1917" height="959" alt="My Resume" src="https://github.com/user-attachments/assets/955da9a1-dfe2-489a-b046-f9e87d9226be" />

## Features

-   **User authentication** --- Register, log in, and log out securely.
-   **PDF resume upload** --- Upload a resume PDF (maximum 5 MB).
-   **AI-powered resume analysis** --- Compare a resume with a job
    description using the Groq API.
-   **Match score and summary** --- Get an overview of how closely the
    resume aligns with the role.
-   **Keyword analysis** --- Review matched, missing, and partially
    matched keywords.
-   **Actionable feedback** --- See strengths, improvement suggestions,
    and requirement comparisons.
-   **Analysis history** --- Revisit previous analyses.
-   **Saved resumes** --- View uploaded resumes and delete them when
    needed.
-   **Protected user data** --- Resume and analysis records are scoped
    to the authenticated user.

## Tech Stack

### Frontend

-   React
-   Vite
-   Tailwind CSS
-   React Router
-   Axios
-   Lucide React

### Backend

-   Node.js
-   Express
-   Prisma ORM
-   PostgreSQL
-   JWT-based authentication
-   PDF text extraction
-   Groq API for AI analysis

## Project Structure

``` text
Resume vs Jd analiser/
├── Backend/
│   ├── src/
│   ├── prisma/
│   ├── uploads/
│   └── ...
└── frontend/
    ├── src/
    ├── public/
    └── ...
```

The exact files may vary as the project evolves.

## Prerequisites

-   Node.js and npm
-   PostgreSQL
-   A Groq API key

## Getting Started

### 1. Clone the repository

``` bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd "Resume vs Jd analiser"
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your repository URL.

### 2. Configure the backend

``` bash
cd Backend
npm install
```

Create a `.env` file in the backend directory and configure the values
required by your backend:

``` env
PORT=8080
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME"
JWT_ACCESS_SECRET="replace-with-a-long-random-secret"
JWT_REFRESH_SECRET="replace-with-a-long-random-secret"
GROQ_API_KEY="your-groq-api-key"
```

Use the actual environment variable names referenced by your backend
code. If your project uses a different refresh-token secret name or
additional variables, update this example accordingly. **Never commit
your real `.env` file or API keys.**

Run Prisma migrations using the command supported by your installed
Prisma setup. For a standard Prisma project, this is commonly:

``` bash
npx prisma migrate deploy
```

Then start the backend using the script defined in
`Backend/package.json`, for example:

``` bash
npm run dev
```

### 3. Configure the frontend

Open a second terminal:

``` bash
cd "Resume vs Jd analiser/frontend"
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal. The frontend API
configuration currently expects the backend at:

``` text
http://localhost:8080/api
```

If your backend uses a different URL or port, update the frontend API
configuration accordingly.

## Typical User Flow

1.  Create an account or log in.
2.  Upload a PDF resume.
3.  Paste the target job description.
4.  Run the AI analysis.
5.  Review the match score, keyword gaps, strengths, and improvement
    suggestions.
6.  Open **My Analyses** to revisit analysis history.
7.  Open **My Resumes** to manage uploaded resumes.

## Security Notes

-   Keep `.env` files, API keys, JWT secrets, database credentials, and
    private resumes out of version control.
-   Do not upload real user resumes or other private files to the
    repository.
-   Configure production secrets through your hosting provider's
    environment settings.
-   Use HTTPS and review authentication, cookie, CORS, and upload
    settings before deploying publicly.

## Roadmap

-   [ ] Add the Home / Dashboard screenshot.
-   [ ] Add the My Analyses screenshot.
-   [ ] Add the My Resumes screenshot.
-   [ ] Add automated tests for key authentication and analysis flows.
-   [ ] Prepare production deployment configuration.

## Contributing

Suggestions and improvements are welcome. For larger changes, open an
issue first to discuss the proposed update.

## License

No license has been specified yet. Add a `LICENSE` file if you intend to
distribute or reuse this project under a particular license.
