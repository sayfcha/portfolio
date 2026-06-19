# Sayf Chafik — Personal Portfolio

Static portfolio site. No build step. Edit the JSON files in `/data`, drop in your CV and photo, deploy.

---

## Quick start (local)

Because the site fetches JSON files with `fetch()`, you need a local HTTP server (a plain `file://` URL will be blocked by the browser's security policy).

**Option 1: Node.js**
```bash
npx serve .
# then open http://localhost:3000
```

**Option 2: Python**
```bash
python -m http.server 8080
# then open http://localhost:8080
```

**Option 3: VS Code**
Install the "Live Server" extension, right-click `index.html`, and choose "Open with Live Server".

---

## Directory structure

```
website/
├── index.html          Main page (layout + markup)
├── style.css           All styles (tokens, sections, responsive)
├── main.js             Data loading + rendering + theme / nav logic
├── assets/
│   ├── profile.jpg     Your profile photo (TODO: drop it in)
│   ├── cv.pdf          Your resume PDF (TODO: drop it in)
│   └── og-image.png    Social share preview 1200x630px (TODO: create one)
├── data/
│   ├── skills.json     Technical skill categories and tags
│   ├── projects.json   Project cards
│   ├── experience.json Work timeline
│   ├── academics.json  Coursework list
│   └── sport.json      Athletic achievements
└── README.md
```

---

## Editing content

All visible content is in the `/data` JSON files. The schema for each file is documented in a comment at the top of the file. You never need to touch `index.html`, `style.css`, or `main.js` to update content.

### `data/skills.json`

Array of skill groups. Each group has a `category` (displayed as a heading) and `tags` (displayed as monospace chips).

```json
[
  { "category": "Robotics", "tags": ["ROS", "SLAM", "Path Planning"] }
]
```

To add a new category: append a new object. To add a tag: append to the `tags` array.

---

### `data/projects.json`

Array of project cards. Ordered as displayed (top-left to bottom-right).

| Field      | Type          | Notes                                          |
|------------|---------------|------------------------------------------------|
| `id`       | string        | Unique HTML id, no spaces (e.g. `"slam-bot"`) |
| `title`    | string        | Project name                                   |
| `summary`  | string        | One-line description                           |
| `stack`    | string[]      | Technology tags shown as chips                 |
| `problem`  | string        | What problem you were solving                  |
| `solution` | string        | Your approach                                  |
| `result`   | string        | Measurable outcome or impact                   |
| `repo`     | string / null | GitHub URL (omit or null = no link shown)      |
| `demo`     | string / null | Live demo URL (omit or null = no link shown)   |

Links set to `null` or starting with `"TODO"` are automatically hidden.

---

### `data/experience.json`

Array of work entries, ordered newest-first (that is how they appear on the timeline).

| Field      | Type          | Notes                                              |
|------------|---------------|----------------------------------------------------|
| `role`     | string        | Your job title                                     |
| `org`      | string        | Company / organisation name                        |
| `url`      | string / null | Company website (makes the org name a link)        |
| `dates`    | string        | e.g. `"Jun 2024 - Dec 2024"`                       |
| `location` | string / null | e.g. `"Paris, France"` (null = hidden)             |
| `bullets`  | string[]      | 1-3 responsibility / achievement bullet points     |

---

### `data/academics.json`

Array of courses shown in a two-column grid.

| Field         | Type   | Notes                                           |
|---------------|--------|-------------------------------------------------|
| `code`        | string | Course code shown in accent monospace           |
| `title`       | string | Official course name                            |
| `description` | string | 1-2 sentences on scope / what you took from it |

---

### `data/sport.json`

Short array of athletic achievements.

| Field          | Type   | Notes                                |
|----------------|--------|--------------------------------------|
| `discipline`   | string | Sport or discipline name             |
| `achievement`  | string | Result or personal best              |
| `date`         | string | Year or date range (e.g. `"2022"`)   |

---

## Swapping the CV and profile photo

1. **Profile photo:** Drop your photo into `/assets/` and name it `profile.jpg`. The `<img>` in `index.html` already points to `assets/profile.jpg`. If the file is missing, the site shows your initials (SC) instead.

2. **CV PDF:** Drop your resume into `/assets/cv.pdf`. The "Resume" button in the hero already links to `assets/cv.pdf` with a `download` attribute.

3. **Social preview image (OG):** Create a 1200x630px image, save it as `assets/og-image.png`, and update the `og:image` and `twitter:image` meta tags in `index.html` to point to your real domain.

---

## Dark / light mode

The site reads `prefers-color-scheme` on first load and remembers the user's preference in `localStorage`. The toggle button in the top-right corner switches between modes. No configuration needed.

---

## Updating your domain / meta tags

Search for `sayfchafik.com` in `index.html` and replace every occurrence with your real domain. The fields to update are:

- `<link rel="canonical" href="...">`
- `<meta property="og:url" content="...">`
- `<meta property="og:image" content="...">`
- `<meta name="twitter:image" content="...">`

---

## Deployment

### Vercel (recommended: zero config)

```bash
# Install Vercel CLI once
npm i -g vercel

# From the project root
vercel
```

Vercel auto-detects a static site. No `vercel.json` needed.

### Netlify

Drag and drop the entire `website/` folder onto [app.netlify.com/drop](https://app.netlify.com/drop). Done.

Or via CLI:
```bash
npm i -g netlify-cli
netlify deploy --prod --dir .
```

### GitHub Pages

1. Push the folder to a GitHub repo (e.g. `yourusername.github.io` for a root site, or any repo for a project site).
2. In the repo settings, go to **Pages**, set the source to the `main` branch and root `/` folder.
3. Your site is live at `https://yourusername.github.io` (or `https://yourusername.github.io/repo-name` for a project site).

For a project site, you may need to update asset paths in `index.html` if the site lives at a sub-path.

---

## TODOs at a glance

Search the project for `TODO` to find every placeholder:

| File                    | What to fill in                                                |
|-------------------------|----------------------------------------------------------------|
| `assets/profile.jpg`    | Drop in your photo                                             |
| `assets/cv.pdf`         | Drop in your CV                                               |
| `assets/og-image.png`   | Create a 1200x630 social preview image                        |
| `index.html`            | Update `sayfchafik.com` to your real domain in meta tags      |
| `data/skills.json`      | Add Control tags; extend other categories as needed           |
| `data/projects.json`    | Replace all three placeholder projects with real ones         |
| `data/experience.json`  | Fill in dates, locations, and bullet points for all four roles |
| `data/academics.json`   | Replace placeholder courses with your actual coursework        |
| `data/sport.json`       | Replace placeholders with your real athletic achievements      |
