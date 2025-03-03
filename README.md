# News Crawler

Welcome to the Olot News Crawler! This project scrapes news from the Olot town hall website (`https://www.olot.cat/ajuntament/comunicacio/actualitat.htm`) using TypeScript and [Crawlee](https://crawlee.dev/). It collects summaries from the news list pages and full details from individual articles, storing them in separate datasets for easy access.

This guide will help you set up and run the project step-by-step, even if you're new to coding!

---

## Prerequisites

Before you start, you’ll need to install a few tools on your computer:

### 1. Install Node.js

- **What it is:** Node.js is a runtime that lets us run JavaScript (and TypeScript) outside a browser. This project requires Node.js version 22 or higher.
- **How to install:**
  1. Go to the [Node.js website](https://nodejs.org/).
  2. Download the "LTS" version for your operating system (Windows, macOS, or Linux). As of March 2025, this should be v22.x.x or later.
  3. Run the installer and follow the prompts (accept defaults if unsure).
  4. Open a terminal (Command Prompt on Windows, Terminal on macOS/Linux) and check the version:

     ```
     node --version
     ```

     You should see something like `v22.x.x`. If not, reinstall Node.js.

### 2. Enable Yarn Berry (via Corepack)

- **What it is:** Yarn is a package manager that installs project dependencies. We’re using Yarn Berry (v4.6.0), which comes built into Node.js via Corepack.
- **How to enable:**
  1. In your terminal, run:

     ```
     corepack enable
     ```

     This activates Corepack, which manages Yarn versions.
  2. The project specifies Yarn 4.6.0 in `package.json`, so you don’t need to install it manually—Corepack will handle it when you set up the project.

### 3. Install Git

- **What it is:** Git is a version control system to clone this project from a repository.
- **How to install:**
  1. Go to the [Git website](https://git-scm.com/downloads).
  2. Download and install Git for your OS (accept defaults).
  3. Verify installation:

     ```
     git --version
     ```

     You should see `git version x.x.x`.

---

## Getting Started

Follow these steps to set up and run the project:

### 1. Clone the Repository

- Open your terminal and navigate to a folder where you want the project:

  ```
  cd path/to/your/folder
  ```

- Clone the repo (replace `<repo-url>` with the actual URL, e.g., from GitHub):

  ```
  git clone <repo-url> olot-news-crawler
  cd olot-news-crawler
  ```

### 2. Install Dependencies

- Run this command to install all project dependencies using Yarn 4.6.0:

  ```
  yarn install
  ```

- What happens:
  - Corepack detects `"packageManager": "yarn@4.6.0..."` in `package.json` and downloads Yarn 4.6.0.
  - Yarn installs libraries like `crawlee` and `typescript`.
- Verify Yarn version:

  ```
  yarn --version
  ```

  It should say `4.6.0`. If not, ensure `corepack enable` was run.

### 3. Run the Crawler

- Start the crawler in development mode (it auto-reloads if you edit the code):

  ```
  yarn dev
  ```

- What it does:
  - Crawls `https://www.olot.cat/ajuntament/comunicacio/actualitat.htm`.
  - Collects news summaries and article details.
  - Saves data to `storage/datasets/`.
- To stop it, press `Ctrl + C` in the terminal.

### 4. Build for Production (Optional)

- If you want a compiled version:

  ```
  yarn build
  ```

- This creates a `dist/` folder with JavaScript files you can run with `node dist/index.js`.

### 5. Lint and Format Code (Optional)

- To check and fix code style:

  ```
  yarn lint
  ```

- Uses Biome to keep the code consistent.

---

## Project Structure

Here’s what’s in the project:

- **`src/`**: Source code.
  - `index.ts`: Entry point that runs the crawler.
  - `crawler.ts`: Crawling logic using [Crawlee](https://crawlee.dev/).
  - `types.ts`: Defines the `NewsItem` data structure.
- **`storage/`**: Where data is saved.
  - `datasets/news_summaries/`: Summaries from list pages (title, date, summary).
  - `datasets/news_articles/`: Full article details (title, date, summary, full text, image URL).
  - `request_queues/default/`: Tracks URLs being crawled.
- **`package.json`**: Lists dependencies and scripts.
- **`.yarnrc.yml`**: Configures Yarn settings.
- **`tsconfig.json`**: TypeScript configuration.
- **`.gitignore`**: Ignores files like `node_modules/` from Git.

---

## Understanding the Output

When you run `yarn dev`, the crawler:

1. Visits the news list page and its paginated versions (e.g., `?pg=2`).
2. Extracts summaries from each news item on the list and saves them to `storage/datasets/news_summaries/`.
3. Enqueues and visits each article URL, extracting full details and saving them to `storage/datasets/news_articles/`.

### Sample Data

- **Summary (`news_summaries/000000001.json`):**

  ```json
  {
    "url": "https://www.olot.cat/pl217/ajuntament/comunicacio/actualitat/id8690/nova-edicio-del-casal-esportiu-de-setmana-santa.htm",
    "title": "Nova edició del casal esportiu de Setmana Santa",
    "date": "2/3/2025",
    "summary": "L’Àrea d’Esports de l’Ajuntament d’Olot ha organitzat un any més el casal esportiu de Setmana Santa."
  }
  ```

- **Article (`news_articles/000000001.json`):**

  ```json
  {
    "url": "https://www.olot.cat/pl217/ajuntament/comunicacio/actualitat/id8690/nova-edicio-del-casal-esportiu-de-setmana-santa.htm",
    "title": "Nova edició del casal esportiu de Setmana Santa",
    "date": "2 de març de 2025",
    "summary": "L’Àrea d’Esports de l’Ajuntament d’Olot ha organitzat un any més el casal esportiu de Setmana Santa.",
    "fullText": "L’Àrea d’Esports de l’Ajuntament d’Olot ha organitzat un any més el casal esportiu de Setmana Santa. Enguany, aquest casal multiesportiu dirigit a infants nascuts entre el 2013 i el 2020 porta per nom Casal Setmana Santa Esportiva 2025 i es realitzarà del 14 al 17 d’abril de 9 a 13 h.\n[...]",
    "imageUrl": "https://www.olot.cat/media/site1/cache/images/post-casal-setmana-santa-esportiva-2025.jpg"
  }
  ```

---

## Troubleshooting

- **Node.js Version Error:**
  - If you see `node: command not found` or a version < 22, reinstall Node.js.
- **Yarn Install Fails:**
  - Ensure `corepack enable` was run. Check `node --version` is 22+.
  - Run `yarn install` again.
- **Crawler Stops Early:**
  - The `maxRequestsPerCrawl` is set to 50 for testing. Edit `src/crawler.ts` to increase it (e.g., 100) or remove it for a full crawl.
- **No Data in `storage/`:**
  - Check terminal logs. If it says "No summaries found" or "No data extracted," the website structure might have changed. Tell me, and we’ll fix it!

---

## Customizing the Project

- **Change the Crawl Limit:** In `src/crawler.ts`, adjust `maxRequestsPerCrawl`:

  ```typescript
  maxRequestsPerCrawl: 100, // Crawl more pages
  ```

- **Add More Data:** Edit the article handler in `crawler.ts` to extract extra fields (e.g., related links `<ul class="llista-links">`).
- **Run Without Watching:** Use `tsx src/index.ts` instead of `yarn dev`.

---

## Next Steps

- Explore the data in `storage/datasets/` using a text editor or JSON viewer.
- Learn TypeScript basics to tweak the code: [TypeScript Docs](https://www.typescriptlang.org/docs/).
- Check out Crawlee for more features: [Crawlee Docs](https://crawlee.dev/docs/introduction).

---

### Notes for You

- **File Creation:** Save this as `README.md` in the project root and commit it:

  ```
  echo "# Olot News Crawler" > README.md
  # Paste the content above into README.md using your editor
  git add README.md
  git commit -m "Add README guide for setup and usage"
  git push
  ```

- **Assumptions:** Assumes your friend will get the repo URL from you (e.g., GitHub). Replace `<repo-url>` with the actual link when sharing.
- **Tone:** Kept it friendly and simple, avoiding jargon where possible.
