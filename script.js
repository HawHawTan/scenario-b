let store = [];
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");
const silde = document.getElementById("slide"); //img 
 const title = document.getElementById("carousel-title");

const dots = document.getElementsByClassName("dots");

const sliderList = document.querySelector(".slider-list");
const sliderWrapper = document.querySelector(".slider");
const pagination = document.querySelector(".pagination");

const img = document.createElement("img");
const currentScreenSize = window.innerWidth;
const smallImage = 200;
const largeImage = 400;
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
  const slides = document.querySelectorAll("figure");
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

function updateCaption (index){
  title.classList.add("is-changing");

  setTimeout(() => {
    title.textContent = store[index].artTitle;
    title.classList.remove("is-changing");
  }, 300);
}

function updatePagination() {
  const dots = pagination.querySelectorAll("button");

  dots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === currentIndex);
  });
}

// is to check if its the end of an array or not
function normalizeIndex(index) {
  if (index < 0) return store.length - 1;
  if (index >= store.length) return 0;
  return index;
}

function goToSlide(index) {
  currentIndex = normalizeIndex(index);
  updateCaption(currentIndex);
  updatePagination();
  updateActiveSlide();
  centerSlide(currentIndex);

}

function getSlideWidth(index) {
   const styles = window.getComputedStyle(index); // read styles
   // adding all of the margin left and right
   const margin =
      parseFloat(styles.marginLeft || "0") + 
      parseFloat(styles.marginRight || "0"); 
    return index.offsetWidth + margin;
}

function centerSlide(index) {
  const viewport = document.querySelector(".slider-viewport");
  const viewportWidth = viewport.offsetWidth;
  const slides = sliderList.querySelectorAll("figure");
  let offsetBefore = 0;

  // depending how far you are from each card
  for (let i = 0; i < index; i++) {
    offsetBefore += getSlideWidth(slides[i]);
  }

  const currentWidth = getSlideWidth(slides[index]);
  const slideCenter = offsetBefore + (currentWidth / 2);
  const viewportCenter = viewportWidth / 2;
  const offset = slideCenter - viewportCenter;

  sliderList.style.transform = `translateX(${-offset}px)`;
}

function initialLoad() {
  const loader = document.createElement("img");
  loader.src = "images/3-dots-fade.svg";
  loader.classList.add("loader");
  loader.alt = "Loading artworks";
  sliderWrapper.appendChild(loader);

  setTimeout(async () => {
    if (currentScreenSize >= 425){
      store = await getImg(largeImage);
    }
    else{
      store = await getImg(smallImage);
    }

    // remove loader
    loader.remove();
    sliderList.classList.add("is-loaded");

    let imagesLoaded = 0;
    const totalImages = store.length;

    store.forEach((art, index) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const dot = document.createElement("button");

      // creating an img
      img.src = art.imageUrl;
      img.alt = art.artTitle;
      img.classList.add("slide");
      img.loading = "lazy";
      img.draggable = false;
      img.dataset.index = index;
      img.addEventListener("load", () => {
        img.dataset.width = img.offsetWidth;

        imagesLoaded++;
        if (imagesLoaded === totalImages) {
          updateCaption(currentIndex);
          updateActiveSlide();
          centerSlide(currentIndex);
        }
      });

      figure.append(img);
      sliderList.appendChild(figure);

      dot.addEventListener("click", () => {
        goToSlide(index);
      });

      // to show when is first loaded
      updatePagination();
      pagination.appendChild(dot);

      setTimeout(() => {
        figure.classList.add("is-visible");
        dot.classList.add("moveUp");
      }, index * 200);
    });
  }, 1000);
}

// buttons
nextButton.addEventListener("click", () => {
    goToSlide(currentIndex + 1);
});

prevButton.addEventListener("click", () => {
    currentIndex--;
    goToSlide(currentIndex - 1);

});
