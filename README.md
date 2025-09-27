(The file `c:\Users\moame\Downloads\PFP\README.md` exists, but is empty)
# Portfolio (moamenalmahe)

This repository contains a personal portfolio website for Moamen Khaled Ali. The site includes:

- A sidebar with contact info
- About, Resume, Portfolio (dynamically loads GitHub repos), CV and Contact pages
- An ATS-friendly CV in `assets/cv/moamen-cv.txt` and a print-friendly HTML resume at `assets/cv/moamen-cv.html`

Local development
1. Open the project folder in VS Code (or your editor).
2. Serve the folder using Live Server or any static file server. Example using Live Server in VS Code: right-click `index.html` -> "Open with Live Server".
3. Or use Python's simple server from PowerShell:

```powershell
# from the project root
python -m http.server 5500
# then open http://127.0.0.1:5500
```

Before publishing (important)
- There is a GitHub Personal Access Token currently present in `assets/js/script.js` for local API requests. Remove this token before publishing the repo publicly and instead use a backend/proxy to keep it secret. See the "Security" section below.

Publish to GitHub Pages (recommended)
1. Initialize git and commit the site (if you haven't already):

```powershell
git init
git add .
git commit -m "Initial portfolio site"
git remote add origin https://github.com/moamenalmahe/portfolio.git
git push -u origin main
```

2. In your GitHub repository settings -> Pages, set the source to the `main` branch (root) and save. The site will be published at:

```
https://moamenalmahe.github.io/portfolio/
```

Security
- Never commit or publish your GitHub personal access token. For production, create a simple backend that fetches GitHub data using an environment variable for the token, and have the frontend call that backend.

Files of interest
- `index.html` – main site
- `assets/js/script.js` – frontend scripts (remove token before publishing)
- `assets/css/style.css` – site styles
- `assets/cv/moamen-cv.html` and `assets/cv/moamen-cv.txt` – resumes
- `assets/data/profile.json` – profile configuration
- `assets/data/search_index.json` – search index (used by the site)

If you'd like, I can prepare a small Node.js proxy and GitHub Actions workflow to deploy the built site automatically; tell me if you want that and I will scaffold it.

---
Generated and updated by the local assistant.
