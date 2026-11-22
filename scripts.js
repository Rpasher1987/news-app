const apiKey = process.env.NEWS_API_KEY;
const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;


let allArticles = []; // build new array as source of the truth, filled once by fetchNews

async function fetchNews() {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    // console.log(data);
    allArticles = data.articles.filter((a) => a.urlToImage);
    displayNews(allArticles);
  } catch (error) {
    console.error("There was an error:", error);
  }
}

function filterArticles(term) {
  const q = term.trim().toLowerCase();
  if (q === "") return allArticles;                      // empty search = show everything
  return allArticles.filter((a) =>
    a.title.toLowerCase().includes(q) ||
    (a.description ?? "").toLowerCase().includes(q) ||
    a.source.name.toLowerCase().includes(q)
  );
}

// try to wire the search box
const searchForm  = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");

searchInput.addEventListener("input", () => {            // controls whats visible as they type
  displayNews(filterArticles(searchInput.value));
});

searchForm.addEventListener("submit", (event) => {       // Enter key / button
  event.preventDefault();                                // don't reload the page
  displayNews(filterArticles(searchInput.value));
});

fetchNews();

function displayNews(articles) {
  const newsDiv = document.querySelector("#news");
  newsDiv.innerHTML = "";

  const row = document.createElement("div");
  row.classList.add("row", "g-4");
  newsDiv.appendChild(row);

  for (const article of articles) {
    if (articles.length === 0) {
      newsDiv.innerHTML = `<p class="text-center text-secondary my-5">No headlines match that search.</p>`;
      return;
    }

    // Add Columns
    const col = document.createElement("div");
    col.classList.add("col-12", "col-md-6", "col-lg-4");

    // Add bootstrap cards
    const card = document.createElement("div");
    card.classList.add("card", "h-100", "shadow-sm");

    // Add image
    const link = document.createElement('a');
    link.href = article.url;
    link.target = "_blank";
    link.rel = "noopener";

    const img = document.createElement('img');
    img.classList.add("card-img-top");
    img.src = article.urlToImage;
    img.alt = article.title;
    img.style.objectFit = "cover";
    img.style.height = "200px"; // makes sure its the same height for every card image
    link.appendChild(img);

    // body construction
    const body = document.createElement("div");
    body.classList.add("card-body", "d-flex", "flex-column");

    const title = document.createElement("h5");
    title.classList.add("card-title");
    title.textContent = article.title;

    const desc = document.createElement("p");
    desc.classList.add("card-text", "text-secondary", "small", "flex-grow-1");
    desc.textContent = article.description ?? "";

    const source = document.createElement("small");
    source.classList.add("text-muted");
    source.textContent = article.source.name;

    const readMore = document.createElement("a");
    readMore.classList.add("btn", "btn-outline-success", "btn-sm", "mt-2");
    readMore.href = article.url;
    readMore.target = "_blank";
    readMore.rel = "noopener";
    readMore.textContent = "Read more";

    // build and display the elements
    body.append(title, desc, source, readMore);
    card.append(link, body);
    col.appendChild(card);
    row.appendChild(col);
  }
}

fetchNews();
