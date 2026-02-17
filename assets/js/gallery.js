function artworkCard(artwork, seriesName = '') {
  const detailHref = `${HH.withBasePath('/gallery/index.html')}?art=${encodeURIComponent(artwork.id)}`;
  return `
    <article class="card masonry-item fade-in">
      <a href="${detailHref}">
        <img loading="lazy" src="${HH.withBasePath(`/assets/art/${artwork.image}`)}" alt="${artwork.title} by Richa" />
      </a>
      <div class="card-content">
        <h3><a href="${detailHref}">${artwork.title}</a></h3>
        <p>${artwork.year} · ${artwork.medium}${seriesName ? ` · ${seriesName}` : ''}</p>
      </div>
    </article>
  `;
}

function detailTemplate(artwork, seriesName = '') {
  return `
    <section class="detail-layout fade-in" aria-live="polite">
      <div class="card">
        <img src="${HH.withBasePath(`/assets/art/${artwork.image}`)}" alt="${artwork.title} by Richa" />
      </div>
      <div>
        <h1>${artwork.title}</h1>
        <p class="muted">${seriesName}</p>
        <ul class="meta-list">
          <li><strong>Year:</strong> ${artwork.year}</li>
          <li><strong>Medium:</strong> ${artwork.medium}</li>
          <li><strong>Dimensions:</strong> ${artwork.dimensions}</li>
          <li><strong>Status:</strong> ${artwork.status}</li>
          <li><strong>Price:</strong> ${artwork.price}</li>
        </ul>
        <p>${artwork.description}</p>
        <div>${artwork.tags.map((tag) => `<span class="chip">${tag}</span>`).join('')}</div>
      </div>
    </section>
  `;
}

async function renderFeatured(limit = 4) {
  const mount = document.querySelector('[data-featured-grid]');
  if (!mount) return;
  const { artworks, series } = await HH.fetchArtData();
  const seriesMap = Object.fromEntries(series.map((entry) => [entry.id, entry.name]));
  mount.innerHTML = artworks.slice(0, limit).map((art) => artworkCard(art, seriesMap[art.series])).join('');
}

async function renderGalleryPage() {
  const listMount = document.querySelector('[data-gallery-grid]');
  const detailMount = document.querySelector('[data-art-detail]');
  if (!listMount && !detailMount) return;

  const { artworks, series } = await HH.fetchArtData();
  const seriesMap = Object.fromEntries(series.map((entry) => [entry.id, entry.name]));
  const selectedArt = HH.getUrlParam('art');

  if (detailMount && selectedArt) {
    const artwork = artworks.find((item) => item.id === selectedArt);
    if (!artwork) {
      detailMount.innerHTML = '<p>Artwork not found.</p>';
      return;
    }
    document.title = `${artwork.title} — Richa | Happily Hued`;
    detailMount.innerHTML = detailTemplate(artwork, seriesMap[artwork.series]);
  }

  if (!listMount) return;

  const mediumFilter = document.querySelector('#filter-medium');
  const seriesFilter = document.querySelector('#filter-series');
  const yearFilter = document.querySelector('#filter-year');

  const years = [...new Set(artworks.map((item) => item.year))].sort((a, b) => b - a);
  yearFilter.innerHTML += years.map((year) => `<option value="${year}">${year}</option>`).join('');
  seriesFilter.innerHTML += series.map((entry) => `<option value="${entry.id}">${entry.name}</option>`).join('');

  const render = () => {
    const filtered = artworks.filter((item) => {
      const mediumOkay = mediumFilter.value ? item.medium === mediumFilter.value : true;
      const seriesOkay = seriesFilter.value ? item.series === seriesFilter.value : true;
      const yearOkay = yearFilter.value ? String(item.year) === yearFilter.value : true;
      return mediumOkay && seriesOkay && yearOkay;
    });

    listMount.innerHTML = filtered.length
      ? filtered.map((art) => artworkCard(art, seriesMap[art.series])).join('')
      : '<p>No artworks match the selected filters.</p>';
  };

  [mediumFilter, seriesFilter, yearFilter].forEach((filter) => filter.addEventListener('change', render));
  render();
}

async function renderSeriesList() {
  const mount = document.querySelector('[data-series-grid]');
  if (!mount) return;

  const { series } = await HH.fetchArtData();
  mount.innerHTML = series.map((item) => `
    <article class="card fade-in">
      <a href="${HH.withBasePath(`/series/${item.id}/index.html`)}">
        <img loading="lazy" src="${HH.withBasePath(`/assets/art/${item.coverImage}`)}" alt="Cover artwork for ${item.name}" />
      </a>
      <div class="card-content">
        <h3><a href="${HH.withBasePath(`/series/${item.id}/index.html`)}">${item.name}</a></h3>
        <p>${item.description}</p>
      </div>
    </article>
  `).join('');
}

async function renderSeriesDetail() {
  const mount = document.querySelector('[data-series-detail]');
  if (!mount) return;

  const seriesId = mount.getAttribute('data-series-id');
  const { artworks, series } = await HH.fetchArtData();
  const foundSeries = series.find((item) => item.id === seriesId);

  if (!foundSeries) {
    mount.innerHTML = '<p>Series not found.</p>';
    return;
  }

  document.title = `${foundSeries.name} — Richa | Happily Hued`;
  const related = artworks.filter((item) => item.series === seriesId);

  mount.innerHTML = `
    <header class="section-title">
      <div>
        <h1>${foundSeries.name}</h1>
        <p class="muted">${foundSeries.description}</p>
      </div>
    </header>
    <div class="masonry">
      ${related.map((art) => artworkCard(art, foundSeries.name)).join('')}
    </div>
  `;
}

renderFeatured();
renderGalleryPage();
renderSeriesList();
renderSeriesDetail();
