# Happily Hued — Richa's Art Portfolio

A production-ready static portfolio website built for GitHub Pages project-site hosting:

`https://<username>.github.io/happily-hued/`

## Features

- Mobile-first, lightweight HTML/CSS/JS architecture
- Gallery-first UX with filters (Medium, Series, Year)
- Artwork detail view with title, year, medium, dimensions, status, price, and description
- Collections page + dedicated series pages
- Accessible semantic structure, keyboard-friendly navigation, alt text, skip links
- Dark mode toggle with persisted user preference
- SEO basics included (Open Graph, Twitter Card, robots.txt, sitemap.xml)
- Lazy-loading gallery images for better performance

## Deploy on GitHub Pages (GitHub Actions)

1. Push this repository to GitHub.
2. In your GitHub repo, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Source: GitHub Actions**.
4. Ensure your default branch is `main`.
5. On each push to `main`, `.github/workflows/pages.yml` deploys the site.

## Content Management (non-dev friendly)

All portfolio content is controlled from one file:

- `data/artworks.json`

Each artwork object includes:

- `id`, `title`, `year`, `medium`, `dimensions`, `series`, `status`, `price`, `description`, `image`, `tags`

### Add a new artwork

1. Drop your image file into `assets/art/`.
2. Open `data/artworks.json`.
3. Add a new artwork object inside `artworks`.
4. Ensure `image` matches the image filename exactly.
5. Commit and push.

### Add/update a series

1. In `data/artworks.json`, update the `series` array.
2. Add (or edit) a dedicated series page at `series/<series-id>/index.html`.
3. Reassign artworks to the series using the `series` field.

## Image recommendations

- **Artwork thumbnails / grid images**: 1600px on the long edge (WebP/JPEG preferred)
- **Detail images**: 2200–2800px on the long edge
- Keep file size ideally **< 500 KB** for grid images and **< 1.5 MB** for detail images
- Compression tools:
  - [Squoosh](https://squoosh.app)
  - [TinyPNG](https://tinypng.com)
  - ImageMagick: `magick input.jpg -quality 82 output.jpg`

## Change colors and fonts

Edit CSS custom properties in `assets/css/styles.css`:

- Light theme tokens are in `:root`
- Dark theme tokens are in `:root[data-theme="dark"]`
- Font families are controlled via `--font-body` and `--font-display`

## Local preview

Run a static server from repo root:

```bash
python -m http.server 8080
```

Then open:

`http://localhost:8080/`

## Production URL reminder

After deploy, your project site will be:

`https://<username>.github.io/happily-hued/`
