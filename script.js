let store = [];
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");

const sliderList = document.querySelector(".slider-list");
const sliderWrapper = document.querySelector(".slider");
const articles = document.querySelectorAll("article");
const img = document.createElement("img");
const silde = document.getElementById("slide");
const dots = document.getElementsByClassName("dots");
const slideWidth = 200; // must match image width
let currentIndex = 0;

// getting the api from Art Institute of Chicago API
//https://api.artic.edu/docs/
async function getImg(imgSize) {
  const url = "https://api.artic.edu/api/v1/artworks";
  try {
    const res = await fetch(url);
    const data = await res.json();

    // checking if there is a vaild image.id
    const ids = data.data
      .filter((art) => art.image_id)
      .map((art) => ({
        artTitle: art.title,
        imageUrl: `${data.config.iiif_url}/${art.image_id}/full/${imgSize},/0/default.jpg`,
      }));

    return ids;
  } catch (e) {
    console.log(e);
  }
}

// showing which one are previous, current, and next.
function updateActiveSlide() {
  // const slides = document.querySelectorAll(".slide");
  const slides = document.querySelectorAll("article");
  const titles = document.querySelectorAll("h2");
  slides.forEach((slide, index) => {
    slide.classList.remove("is-prev", "is-current", "is-next");
    if (index === currentIndex) {
      slide.classList.add("is-current");
    } else if (index === currentIndex - 1) {
      slide.classList.add("is-prev");
    } else if (index === currentIndex + 1) {
      slide.classList.add("is-next");
    }
  });
}

function initialLoad() {
  const loader = document.createElement("img");
  loader.src = "images/3-dots-fade.svg";
  loader.classList.add("loader");
  loader.alt = "Loading";
  sliderWrapper.appendChild(loader);

  setTimeout(async () => {
    store = await getImg(200);

    // remove loader
    loader.remove();
    sliderList.classList.add("is-loaded");

    store.forEach((art, index) => {
      const article = document.createElement("article");
      const img = document.createElement("img");
      const title = document.createElement("h3");

      img.src = art.imageUrl;
      img.alt = art.artTitle;
      img.classList.add("slide");
      img.loading = "lazy";
      img.draggable = false;
      img.dataset.index = index;

      title.textContent = art.artTitle;

      article.append(img, title);
      sliderList.appendChild(article);

      // ✅ stagger entrance animation
      setTimeout(() => {
        article.classList.add("is-visible");
      }, index * 500);
    });

    updateActiveSlide();
  }, 1000);
}



// buttons
nextButton.addEventListener("click", () => {
  if (currentIndex < store.length - 1) {
    currentIndex++;
    updateActiveSlide();
    sliderList.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }
  console.log(currentIndex);
});

prevButton.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateActiveSlide();
    sliderList.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }
});
