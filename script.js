const hero = document.querySelector(".hero");
const heroNav = document.querySelector(".hero__nav");
const heroNavMenu = document.querySelector("[data-hero-nav-menu]");
const heroNavToggle = document.querySelector("[data-hero-nav-toggle]");
const floatingNav = document.querySelector("[data-floating-nav]");
const floatingNavWrap = document.querySelector("[data-floating-nav-wrap]");
const floatingNavPanel = document.querySelector("[data-floating-nav-panel]");
const floatingNavToggle = document.querySelector("[data-floating-nav-toggle]");
const scrollTriggers = Array.from(document.querySelectorAll("[data-scroll-target]"));

scrollTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const targetSelector = trigger.dataset.scrollTarget;

    if (!targetSelector) {
      return;
    }

    const target = document.querySelector(targetSelector);

    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

if (heroNav && heroNavMenu && heroNavToggle) {
  const closeHeroNavMenu = () => {
    heroNav.classList.remove("is-open");
    heroNavToggle.setAttribute("aria-expanded", "false");
  };

  heroNavToggle.addEventListener("click", () => {
    const shouldOpen = !heroNav.classList.contains("is-open");
    heroNav.classList.toggle("is-open", shouldOpen);
    heroNavToggle.setAttribute("aria-expanded", String(shouldOpen));
  });

  heroNavMenu.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement) || !target.closest("[data-scroll-target]")) {
      return;
    }

    if (window.innerWidth <= 1024) {
      closeHeroNavMenu();
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Node) || heroNav.contains(target)) {
      return;
    }

    closeHeroNavMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeHeroNavMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
      closeHeroNavMenu();
    }
  });
}

if (floatingNav) {
  const updateFloatingNavVisibility = () => {
    const shouldShow = window.scrollY > window.innerHeight * 0.5;
    floatingNav.classList.toggle("is-visible", shouldShow);
    floatingNavWrap?.classList.toggle("is-visible", shouldShow);

    if (!shouldShow) {
      floatingNavWrap?.classList.remove("is-open");
      floatingNavToggle?.setAttribute("aria-expanded", "false");
    }
  };

  updateFloatingNavVisibility();
  window.addEventListener("scroll", updateFloatingNavVisibility, { passive: true });
  window.addEventListener("resize", updateFloatingNavVisibility);
}

if (floatingNavWrap && floatingNavPanel && floatingNavToggle) {
  const closeFloatingNavPanel = () => {
    floatingNavWrap.classList.remove("is-open");
    floatingNavToggle.setAttribute("aria-expanded", "false");
  };

  floatingNavToggle.addEventListener("click", () => {
    const shouldOpen = !floatingNavWrap.classList.contains("is-open");
    floatingNavWrap.classList.toggle("is-open", shouldOpen);
    floatingNavToggle.setAttribute("aria-expanded", String(shouldOpen));
  });

  floatingNavPanel.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement) || !target.closest("[data-scroll-target]")) {
      return;
    }

    closeFloatingNavPanel();
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Node) || floatingNavWrap.contains(target)) {
      return;
    }

    closeFloatingNavPanel();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeFloatingNavPanel();
    }
  });
}

const liquidGlassSvg = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="0"
  height="0"
  style="position:absolute;overflow:hidden;pointer-events:none"
>
  <defs>
    <filter id="liquid-glass-filter" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.012 0.012"
        numOctaves="2"
        seed="92"
        result="noise"
      />
      <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
      <feDisplacementMap
        in="SourceGraphic"
        in2="blurred"
        scale="96"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </defs>
</svg>`;

const ensureLiquidGlassFilter = () => {
  if (document.getElementById("liquid-glass-filter")) {
    return;
  }

  document.body.insertAdjacentHTML("beforeend", liquidGlassSvg);
};

if (hero) {
  const badges = Array.from(hero.querySelectorAll(".hero__badge"));
  const baseTransforms = new Map([
    ["hero__badge--drink", -15],
    ["hero__badge--breakfast", 15],
    ["hero__badge--roast", 15],
  ]);

  const updateBadges = (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    badges.forEach((badge, index) => {
      const className = Array.from(badge.classList).find((name) => name.startsWith("hero__badge--"));
      const baseRotate = baseTransforms.get(className) ?? 0;
      const depth = index + 1;
      const moveX = x * 18 * depth;
      const moveY = y * 14 * depth;
      const rotate = baseRotate + x * 6 + y * 4;

      badge.style.setProperty("--badge-translate-x", `${moveX}px`);
      badge.style.setProperty("--badge-translate-y", `${moveY}px`);
      badge.style.setProperty("--badge-rotate", `${rotate}deg`);
    });
  };

  const resetBadges = () => {
    badges.forEach((badge) => {
      const className = Array.from(badge.classList).find((name) => name.startsWith("hero__badge--"));
      const baseRotate = baseTransforms.get(className) ?? 0;

      badge.style.setProperty("--badge-translate-x", "0px");
      badge.style.setProperty("--badge-translate-y", "0px");
      badge.style.setProperty("--badge-rotate", `${baseRotate}deg`);
    });
  };

  resetBadges();
  hero.addEventListener("pointermove", updateBadges);
  hero.addEventListener("pointerleave", resetBadges);
}

const moodSliders = Array.from(document.querySelectorAll("[data-slider]"));

if (moodSliders.length > 0) {
  ensureLiquidGlassFilter();

  const userAgent = navigator.userAgent.toLowerCase();
  const isChromium =
    userAgent.includes("chrome") ||
    userAgent.includes("edg") ||
    userAgent.includes("opr") ||
    userAgent.includes("opera");

  document
    .querySelectorAll(".mood-slider__label")
    .forEach((element) => {
      if (isChromium) {
        element.classList.add("liquid-glass-auto");
      } else {
        element.classList.add("liquid-glass-fallback");
      }
    });

  document
    .querySelectorAll(".mood-slider__button")
    .forEach((element) => {
      if (isChromium) {
        element.classList.add("liquid-glass-button");
      } else {
        element.classList.add("liquid-glass-button-fallback");
      }
    });
}

moodSliders.forEach((slider) => {
  const slides = Array.from(slider.querySelectorAll(".mood-slide"));
  const dots = Array.from(slider.querySelectorAll(".mood-slider__dot"));
  const label = slider.querySelector(".mood-slider__label");
  const prevButton = slider.querySelector("[data-slider-prev]");
  const nextButton = slider.querySelector("[data-slider-next]");
  const transitionDuration = 450;
  let currentIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));

  if (currentIndex < 0) {
    currentIndex = 0;
  }

  let isAnimating = false;

  const updateLabel = (nextText) => {
    if (!label) {
      return;
    }

    label.classList.remove("is-showing");
    label.classList.add("is-hiding");

    window.setTimeout(() => {
      label.textContent = nextText;
      label.classList.remove("is-hiding");
      label.classList.add("is-preparing");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          label.classList.remove("is-preparing");
          label.classList.add("is-showing");
        });
      });
    }, 180);
  };

  const renderInitialState = (index) => {
    slides.forEach((slide, slideIndex) => {
      slide.style.transition = "none";
      slide.style.zIndex = slideIndex === index ? "2" : "1";
      slide.style.pointerEvents = slideIndex === index ? "auto" : "none";
      slide.style.transform = slideIndex === index ? "translateX(0)" : "translateX(100%)";

      if (slideIndex === index) {
        slide.classList.add("is-active");
      } else {
        slide.classList.remove("is-active");
      }
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });

    const image = slides[index]?.querySelector("img");

    if (label && image) {
      label.textContent = image.alt;
    }
  };

  const animateToSlide = (nextIndex, direction) => {
    if (isAnimating || nextIndex === currentIndex) {
      return;
    }

    isAnimating = true;

    const currentSlide = slides[currentIndex];
    const nextSlide = slides[nextIndex];
    const nextImage = nextSlide?.querySelector("img");
    const enterOffset = direction === "next" ? "100%" : "-100%";
    const leaveOffset = direction === "next" ? "-100%" : "100%";

    currentSlide.style.transition = "none";
    nextSlide.style.transition = "none";

    currentSlide.style.transform = "translateX(0)";
    currentSlide.style.zIndex = "1";
    currentSlide.style.pointerEvents = "none";

    nextSlide.classList.add("is-active");
    nextSlide.style.transform = `translateX(${enterOffset})`;
    nextSlide.style.zIndex = "2";
    nextSlide.style.pointerEvents = "auto";

    void slider.offsetWidth;

    currentSlide.style.transition = `transform ${transitionDuration}ms ease`;
    nextSlide.style.transition = `transform ${transitionDuration}ms ease`;

    currentSlide.style.transform = `translateX(${leaveOffset})`;
    nextSlide.style.transform = "translateX(0)";

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === nextIndex);
    });

    if (nextImage) {
      updateLabel(nextImage.alt);
    }

    window.setTimeout(() => {
      currentSlide.classList.remove("is-active");
      currentSlide.style.transition = "none";
      currentSlide.style.transform = "translateX(100%)";
      currentSlide.style.zIndex = "1";
      currentSlide.style.pointerEvents = "none";

      nextSlide.classList.add("is-active");
      nextSlide.style.transition = "none";
      nextSlide.style.transform = "translateX(0)";
      nextSlide.style.zIndex = "2";
      nextSlide.style.pointerEvents = "auto";

      currentIndex = nextIndex;
      isAnimating = false;
    }, transitionDuration);
  };

  nextButton?.addEventListener("click", () => {
    const nextIndex = (currentIndex + 1) % slides.length;
    animateToSlide(nextIndex, "next");
  });

  prevButton?.addEventListener("click", () => {
    const nextIndex = (currentIndex - 1 + slides.length) % slides.length;
    animateToSlide(nextIndex, "prev");
  });

  renderInitialState(currentIndex);
});

const menuDay = document.querySelector(".menu-day");

if (menuDay) {
  const stage = menuDay.querySelector("[data-menu-day-stage]");
  const weatherIcon = menuDay.querySelector(".menu-day__weather img");
  const weatherText = menuDay.querySelector(".menu-day__weather span");
  const currentBackground = menuDay.querySelector("[data-menu-day-bg-current]");
  const nextBackground = menuDay.querySelector("[data-menu-day-bg-next]");
  const titleMain = menuDay.querySelector("[data-menu-day-title-main]");
  const volume = menuDay.querySelector("[data-menu-day-volume]");
  const description = menuDay.querySelector("[data-menu-day-description]");
  const calories = menuDay.querySelector("[data-menu-day-calories]");
  const fats = menuDay.querySelector("[data-menu-day-fats]");
  const proteins = menuDay.querySelector("[data-menu-day-proteins]");
  const carbs = menuDay.querySelector("[data-menu-day-carbs]");
  const note = menuDay.querySelector("[data-menu-day-note]");
  const price = menuDay.querySelector("[data-menu-day-price]");
  const drinkImage = menuDay.querySelector("[data-menu-day-image]");
  const sizes = menuDay.querySelector("[data-menu-day-sizes]");
  const prevButton = menuDay.querySelector("[data-menu-day-prev]");
  const nextButton = menuDay.querySelector("[data-menu-day-next]");
  const contentAnimationDuration = 220;
  const backgroundAnimationDuration = 550;
  const saintPetersburgWeatherUrl =
    "https://api.open-meteo.com/v1/forecast?latitude=59.9386&longitude=30.3141&current=temperature_2m,weather_code&timezone=Europe%2FMoscow";
  let items = [];
  let activeIndex = 0;
  let activeSizeIndex = 0;
  let isAnimating = false;

  const weatherCodeMap = new Map([
    [[0], { label: "солнечно", icon: "./img/icons/sun.svg" }],
    [[1, 2, 3, 45, 48], { label: "облачно", icon: "./img/icons/cloudy.svg" }],
    [[51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95], { label: "дождливо", icon: "./img/icons/cloud-drizzle.svg" }],
    [[71, 73, 75, 77, 85, 86, 96, 99], { label: "снежно", icon: "./img/icons/cloud-snow.svg" }],
  ]);

  const getWeatherPresentation = (code) => {
    for (const [codes, presentation] of weatherCodeMap.entries()) {
      if (codes.includes(code)) {
        return presentation;
      }
    }

    return { label: "облачно", icon: "./img/icons/cloudy.svg" };
  };

  const renderCurrentWeather = async () => {
    if (!weatherText || !weatherIcon) {
      return;
    }

    try {
      const response = await fetch(saintPetersburgWeatherUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const weatherCode = data?.current?.weather_code;
      const temperature = data?.current?.temperature_2m;

      if (typeof weatherCode !== "number" || typeof temperature !== "number") {
        throw new Error("Invalid weather payload");
      }

      const presentation = getWeatherPresentation(weatherCode);
      const roundedTemperature = Math.round(temperature);
      const formattedTemperature = `${roundedTemperature > 0 ? "+" : ""}${roundedTemperature}°`;

      weatherIcon.src = presentation.icon;
      weatherText.textContent = `Сегодня в Санкт-Петербурге ${presentation.label}, ${formattedTemperature}`;
    } catch (error) {
      console.error("Failed to load current weather", error);
    }
  };

  const preloadAsset = (source) =>
    new Promise((resolve) => {
      if (!source) {
        resolve();
        return;
      }

      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve();
      image.onerror = () => resolve();
      image.src = source;
    });

  const preloadMenuDayAssets = async (menuDayItems) => {
    const sources = [
      ...menuDayItems.map((item) => item.backgroundImage),
      ...menuDayItems.map((item) => item.drinkImage),
    ];

    const uniqueSources = Array.from(new Set(sources.filter(Boolean)));
    await Promise.all(uniqueSources.map((source) => preloadAsset(source)));
  };

  const renderSizeButtons = (item, selectedSizeIndex) => {
    if (!sizes || !item) {
      return;
    }

    sizes.innerHTML = "";

    item.sizes.forEach((size, sizeIndex) => {
      const button = document.createElement("button");
      button.className = "menu-day__size-button";
      button.type = "button";
      button.textContent = size.label;
      button.classList.toggle("is-active", sizeIndex === selectedSizeIndex);

      button.addEventListener("click", () => {
        if (sizeIndex === activeSizeIndex || isAnimating) {
          return;
        }

        activeSizeIndex = sizeIndex;
        renderSizeButtons(item, activeSizeIndex);
        volume.textContent = item.sizes[activeSizeIndex]?.volume ?? "";
        price.textContent = item.sizes[activeSizeIndex]?.price ?? "";
      });

      sizes.appendChild(button);
    });
  };

  const renderMenuDayItem = (item, selectedSizeIndex = 0) => {
    if (!item) {
      return;
    }

    const safeSizeIndex = Math.min(selectedSizeIndex, Math.max(item.sizes.length - 1, 0));
    const selectedSize = item.sizes[safeSizeIndex] ?? item.sizes[0];

    titleMain.textContent = item.title;
    description.textContent = item.description;
    calories.textContent = item.calories;
    fats.textContent = item.fats;
    proteins.textContent = item.proteins;
    carbs.textContent = item.carbs;
    note.textContent = item.note;
    volume.textContent = selectedSize?.volume ?? "";
    price.textContent = selectedSize?.price ?? "";

    if (drinkImage) {
      drinkImage.src = item.drinkImage;
      drinkImage.alt = item.title;
    }

    renderSizeButtons(item, safeSizeIndex);
  };

  const animateToItem = (nextIndex) => {
    if (isAnimating || nextIndex === activeIndex || items.length === 0) {
      return;
    }

    isAnimating = true;
    const nextItem = items[nextIndex];

    if (stage) {
      stage.classList.remove("is-entering");
      stage.classList.add("is-exiting");
    }

    if (nextBackground && currentBackground) {
      nextBackground.style.backgroundImage = `url('${nextItem.backgroundImage}')`;
      nextBackground.classList.add("is-active");
    }

    window.setTimeout(() => {
      activeIndex = nextIndex;
      activeSizeIndex = 0;
      renderMenuDayItem(nextItem, activeSizeIndex);

      if (stage) {
        stage.classList.remove("is-exiting");
        stage.classList.add("is-entering");
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          stage?.classList.remove("is-entering");
        });
      });
    }, contentAnimationDuration);

    window.setTimeout(() => {
      if (currentBackground && nextBackground) {
        currentBackground.style.backgroundImage = `url('${nextItem.backgroundImage}')`;
        nextBackground.classList.remove("is-active");
      }

      isAnimating = false;
    }, backgroundAnimationDuration);
  };

  const loadMenuDay = async () => {
    if (window.location.protocol === "file:") {
      return;
    }

    try {
      const response = await fetch("./menu-day.json");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      items = await response.json();

      if (items.length === 0) {
        return;
      }

      await preloadMenuDayAssets(items);
      renderMenuDayItem(items[activeIndex], activeSizeIndex);
      currentBackground.style.backgroundImage = `url('${items[activeIndex].backgroundImage}')`;
    } catch (error) {
      console.error("Failed to load menu-day.json", error);
    }
  };

  prevButton?.addEventListener("click", () => {
    if (items.length === 0) {
      return;
    }

    const nextIndex = (activeIndex - 1 + items.length) % items.length;
    animateToItem(nextIndex);
  });

  nextButton?.addEventListener("click", () => {
    if (items.length === 0) {
      return;
    }

    const nextIndex = (activeIndex + 1) % items.length;
    animateToItem(nextIndex);
  });

  renderCurrentWeather();
  loadMenuDay();
}

const menuCatalog = document.querySelector(".menu-catalog");

if (menuCatalog) {
  const menuGrid = menuCatalog.querySelector("[data-menu-grid]");
  const menuTabs = Array.from(menuCatalog.querySelectorAll("[data-menu-category]"));
  const defaultCategory =
    menuTabs.find((tab) => tab.classList.contains("is-active"))?.dataset.menuCategory ?? "classic";
  let menuItems = [];
  let activeMenuCategory = defaultCategory;
  const menuCards = [];

  const setActiveMenuTab = (category) => {
    menuTabs.forEach((tab) => {
      const isActive = tab.dataset.menuCategory === category;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });
  };

  const renderMenuState = (message) => {
    if (!menuGrid) {
      return;
    }

    menuGrid.innerHTML = "";

    const state = document.createElement("div");
    state.className = "menu-catalog__state";
    state.textContent = message;
    menuGrid.appendChild(state);
  };

  const preloadMenuCatalogImages = async (items) => {
    const uniqueSources = Array.from(new Set(items.map((item) => `./img/menu/${item.image}`)));

    await Promise.all(
      uniqueSources.map(
        (source) =>
          new Promise((resolve) => {
            const image = new Image();
            image.decoding = "async";
            image.onload = () => resolve();
            image.onerror = () => resolve();
            image.src = source;
          })
      )
    );
  };

  const createMenuCard = (item) => {
    const article = document.createElement("article");
    article.className = "menu-catalog__card";
    article.dataset.menuCategory = item.category;
    article.setAttribute("aria-label", `${item.title}. ${item.description}`);
    article.title = item.description;

    const image = document.createElement("img");
    image.className = "menu-catalog__image";
    image.src = `./img/menu/${item.image}`;
    image.alt = item.title;
    image.loading = "eager";
    image.decoding = "async";
    image.width = 480;
    image.height = 640;

    const content = document.createElement("div");
    content.className = "menu-catalog__content";

    const title = document.createElement("h3");
    title.className = "menu-catalog__item-title";
    title.textContent = item.title;

    const price = document.createElement("p");
    price.className = "menu-catalog__price";
    price.textContent = item.price;

    content.append(title, price);
    article.append(image, content);

    return article;
  };

  const buildMenuCards = () => {
    menuCards.length = 0;
    menuGrid.innerHTML = "";

    const fragment = document.createDocumentFragment();

    menuItems.forEach((item) => {
      const card = createMenuCard(item);
      menuCards.push(card);
      fragment.appendChild(card);
    });

    menuGrid.appendChild(fragment);
  };

  const renderMenuItems = (category) => {
    if (!menuGrid) {
      return;
    }

    const hasCardsInCategory = menuCards.some((card) => card.dataset.menuCategory === category);

    if (!hasCardsInCategory) {
      renderMenuState("� ���� ��������� ���� ��� �������.");
      return;
    }

    menuCards.forEach((card) => {
      const isVisible = card.dataset.menuCategory === category;
      card.hidden = !isVisible;
    });
  };

  const loadMenuItems = async () => {
    if (window.location.protocol === "file:") {
      renderMenuState("��� �������� menu-items.json ������ ������ ����� ��������� ������.");
      return;
    }

    try {
      const response = await fetch("./menu-items.json");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      menuItems = await response.json();
      await preloadMenuCatalogImages(menuItems);
      buildMenuCards();
      setActiveMenuTab(activeMenuCategory);
      renderMenuItems(activeMenuCategory);
    } catch (error) {
      renderMenuState("�� ������� ��������� menu-items.json.");
    }
  };

  menuTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const nextCategory = tab.dataset.menuCategory;

      if (!nextCategory || nextCategory === activeMenuCategory) {
        return;
      }

      activeMenuCategory = nextCategory;
      setActiveMenuTab(activeMenuCategory);

      if (menuItems.length > 0) {
        renderMenuItems(activeMenuCategory);
      }
    });
  });

  loadMenuItems();
}

const interiorGrid = document.querySelector(".interior__grid");
const interiorClipPath = document.querySelector("#interior-grid-clip");
const interiorVideo = document.querySelector(".interior__video");

if (interiorGrid && interiorClipPath) {
  const updateInteriorClipPath = () => {
    const gridRect = interiorGrid.getBoundingClientRect();
    const cards = Array.from(interiorGrid.querySelectorAll(".interior__card"));

    interiorClipPath.innerHTML = "";

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const clipRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

      clipRect.setAttribute("x", String(rect.left - gridRect.left));
      clipRect.setAttribute("y", String(rect.top - gridRect.top));
      clipRect.setAttribute("width", String(rect.width));
      clipRect.setAttribute("height", String(rect.height));
      clipRect.setAttribute("rx", "16");
      clipRect.setAttribute("ry", "16");

      interiorClipPath.appendChild(clipRect);
    });
  };

  const updateInteriorVideoFit = () => {
    if (!interiorVideo || !interiorVideo.videoWidth || !interiorVideo.videoHeight) {
      return;
    }

    const gridWidth = interiorGrid.clientWidth;
    const gridHeight = interiorGrid.clientHeight;

    if (!gridWidth || !gridHeight) {
      return;
    }

    const videoAspectRatio = interiorVideo.videoWidth / interiorVideo.videoHeight;
    const gridAspectRatio = gridWidth / gridHeight;

    if (videoAspectRatio > gridAspectRatio) {
      interiorVideo.style.width = `${gridHeight * videoAspectRatio}px`;
      interiorVideo.style.height = `${gridHeight}px`;
    } else {
      interiorVideo.style.width = `${gridWidth}px`;
      interiorVideo.style.height = `${gridWidth / videoAspectRatio}px`;
    }
  };

  const requestInteriorClipUpdate = () => {
    window.requestAnimationFrame(() => {
      updateInteriorClipPath();
      updateInteriorVideoFit();
    });
  };

  requestInteriorClipUpdate();
  window.addEventListener("resize", requestInteriorClipUpdate);

  if (interiorVideo) {
    interiorVideo.addEventListener("loadedmetadata", requestInteriorClipUpdate);
  }
}

const reviewsSection = document.querySelector(".reviews");

if (reviewsSection) {
  const stage = reviewsSection.querySelector("[data-reviews-stage]");
  const prevCard = reviewsSection.querySelector("[data-review-prev]");
  const currentCard = reviewsSection.querySelector("[data-review-current]");
  const nextCard = reviewsSection.querySelector("[data-review-next]");
  const prevButton = reviewsSection.querySelector("[data-reviews-prev]");
  const nextButton = reviewsSection.querySelector("[data-reviews-next]");
  const reviewAnimationDuration = 620;
  const weatherIcons = {
    sunny: "./img/icons/sun_black.svg",
    cloudy: "./img/icons/cloudy_black.svg",
    rainy: "./img/icons/cloud-drizzle_black.svg",
    snowy: "./img/icons/cloud-snow_black.svg",
  };
  let reviews = [];
  let activeReviewIndex = 0;
  let isAnimating = false;

  const createReviewCardMarkup = (review) => {
    if (!review) {
      return "";
    }

    const weatherIcon = weatherIcons[review.weatherType] ?? weatherIcons.cloudy;

    return `
      <p class="review-card__text">${review.text}</p>
      <div class="review-card__footer">
        <img class="review-card__avatar" src="${review.avatar}" alt="${review.name}" loading="lazy" width="64" height="64" />
        <div class="review-card__meta">
          <p class="review-card__name">${review.name}</p>
          <div class="review-card__details">
            <span>${review.date}</span>
            <span class="review-card__weather">
              <img src="${weatherIcon}" alt="${review.weatherLabel}" width="18" height="18" />
              <span>${review.temperature}</span>
            </span>
          </div>
        </div>
      </div>
    `;
  };

  const renderReviewsError = (message) => {
    if (!currentCard || !prevCard || !nextCard) {
      return;
    }

    currentCard.innerHTML = `<p class="review-card__text">${message}</p>`;
    prevCard.innerHTML = "";
    nextCard.innerHTML = "";
  };

  const renderReviewCards = () => {
    if (!reviews.length || !prevCard || !currentCard || !nextCard) {
      return;
    }

    const prevIndex = (activeReviewIndex - 1 + reviews.length) % reviews.length;
    const nextIndex = (activeReviewIndex + 1) % reviews.length;

    prevCard.innerHTML = createReviewCardMarkup(reviews[prevIndex]);
    currentCard.innerHTML = createReviewCardMarkup(reviews[activeReviewIndex]);
    nextCard.innerHTML = createReviewCardMarkup(reviews[nextIndex]);
  };

  const animateSideCardEntrance = (direction) => {
    const sideCard = direction === "next" ? nextCard : prevCard;
    const className =
      direction === "next" ? "review-card--enter-next" : "review-card--enter-prev";

    if (!sideCard) {
      return;
    }

    sideCard.classList.remove("review-card--enter-next", "review-card--enter-prev");
    void sideCard.offsetWidth;
    sideCard.classList.add(className);

    window.setTimeout(() => {
      sideCard.classList.remove(className);
    }, 320);
  };

  const animateReviews = (direction) => {
    if (!stage || isAnimating || reviews.length < 2) {
      return;
    }

    isAnimating = true;
    stage.classList.remove("is-animating-next", "is-animating-prev");
    stage.classList.add(direction === "next" ? "is-animating-next" : "is-animating-prev");

    window.setTimeout(() => {
      activeReviewIndex =
        direction === "next"
          ? (activeReviewIndex + 1) % reviews.length
          : (activeReviewIndex - 1 + reviews.length) % reviews.length;

      renderReviewCards();
      animateSideCardEntrance(direction);
      stage.classList.remove("is-animating-next", "is-animating-prev");
      isAnimating = false;
    }, reviewAnimationDuration);
  };

  const loadReviews = async () => {
    if (window.location.protocol === "file:") {
      renderReviewsError("��� �������� reviews.json ������ ������ ����� ��������� ������.");
      return;
    }

    try {
      const response = await fetch("./reviews.json");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      reviews = await response.json();

      if (!Array.isArray(reviews) || reviews.length === 0) {
        renderReviewsError("������ ���� �� ���������.");
        return;
      }

      renderReviewCards();
    } catch (error) {
      renderReviewsError("�� ������� ��������� reviews.json.");
    }
  };

  prevButton?.addEventListener("click", () => {
    animateReviews("prev");
  });

  nextButton?.addEventListener("click", () => {
    animateReviews("next");
  });

  loadReviews();
}
