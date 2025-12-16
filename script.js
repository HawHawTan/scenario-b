let store = [];
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");
const silde = document.getElementById("slide");
 const title = document.getElementById("carousel-title");

const dots = document.getElementsByClassName("dots");

const figure = document.querySelectorAll("figure");
const sliderList = document.querySelector(".slider-list");
const sliderWrapper = document.querySelector(".slider");
const pagination = document.querySelector(".pagination");

const img = document.createElement("img");
const slideWidth = 220;
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
  }, 300); // match CSS transition duration
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
  updateCaption(index);
  updatePagination();
  updateActiveSlide();
  centerSlide(currentIndex,10);
  // const cal = 290 - getSlideWidth(index);
  // sliderList.style.transform = `translateX(${-cal}px)`;
}

function getSlideWidth(index) {
  const slides = sliderList.querySelectorAll("figure");
  // const width = Number(slides[index].dataset.width);
  return slides[index].offsetWidth;
}

function centerSlide(index, extraPadding = 0) {
  const viewport = document.querySelector(".slider-viewport");
  const viewportWidth = viewport.offsetWidth;

  let offsetBefore = 0;
  for (let i = 0; i < index; i++) {
    offsetBefore += getSlideWidth(i);
  }

  const currentWidth = getSlideWidth(index);
  // console.log('====================================');
  // console.log(currentWidth);
  // console.log('====================================');
  const slideCenter = offsetBefore + currentWidth / 2;

  const viewportCenter = viewportWidth / 2;
  const offset = slideCenter - viewportCenter;
  const cal = offset * -1 - (10*(index+1)+extraPadding);
  sliderList.style.transform = `translateX(${cal}px)`;
}

function initialLoad() {
  const loader = document.createElement("img");
  loader.src = "images/3-dots-fade.svg";
  loader.classList.add("loader");
  loader.alt = "Loading";
  sliderWrapper.appendChild(loader);

  setTimeout(async () => {
    console.log('====================================');
    console.log(currentScreenSize);
    console.log('====================================');
    if (currentScreenSize >= 425){
      store = await getImg(largeImage);
    }
    else{
      store = await getImg(smallImage);
    }

    // remove loader
    loader.remove();
    sliderList.classList.add("is-loaded");

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
      img.dataset.width = img.offsetWidth;

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
    updateCaption(currentIndex);
    centerSlide(currentIndex);
    updateActiveSlide();
  }, 1000);
}

// buttons
nextButton.addEventListener("click", () => {
  // if (currentIndex < store.length - 1) {
    currentIndex++;
    // updateActiveSlide();
    // goToSlide(currentIndex);
    goToSlide(currentIndex,);
    // console.log(num);
  // }
  // console.log(currentIndex);
});

prevButton.addEventListener("click", () => {
  // if (currentIndex > 0) {
    currentIndex--;
    // updateActiveSlide();
    // sliderList.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    goToSlide(currentIndex);
  // }
});
