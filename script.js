document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     MOBILE MENU
  ===================================================== */

  const menu = document.querySelector(".menu");
  const nav = document.querySelector(".nav");

  if (menu && nav) {
    menu.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");

      menu.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menu.setAttribute("aria-expanded", "false");
      });
    });
  }


  /* =====================================================
     HEADER SCROLL EFFECT
  ===================================================== */

  const header = document.querySelector(".header");

  function updateHeader() {
    if (!header) return;

    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();


  /* =====================================================
     SCROLL PROGRESS INDICATOR
  ===================================================== */

  let progressBar = document.querySelector(".scroll-progress");

  if (!progressBar) {
    progressBar = document.createElement("div");

    progressBar.className = "scroll-progress";

    document.body.appendChild(progressBar);
  }

  function updateScrollProgress() {
    const scrollTop = window.scrollY;

    const documentHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    if (documentHeight <= 0) {
      progressBar.style.width = "0%";
      return;
    }

    const progress =
      (scrollTop / documentHeight) * 100;

    progressBar.style.width =
      `${Math.min(progress, 100)}%`;
  }

  window.addEventListener(
    "scroll",
    updateScrollProgress,
    { passive: true }
  );

  updateScrollProgress();


  /* =====================================================
     SCROLL REVEAL
  ===================================================== */

  const revealElements = document.querySelectorAll(
    ".section-heading, .mission-copy, .focus-intro, .focus-card, .fundraising-inner, .closing-box"
  );

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px"
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add("visible");
    });

  }


  /* =====================================================
     HERO LOGO SCROLL MOVEMENT
  ===================================================== */

  const hero = document.querySelector(".home-hero");
  const heroLogo = document.querySelector(".hero-art img");

  if (hero && heroLogo) {

    function moveHeroLogo() {

      const scrollY = window.scrollY;
      const heroHeight = hero.offsetHeight;

      if (scrollY <= heroHeight) {

        const movement = scrollY * 0.10;

        const scale =
          1 - Math.min(scrollY / heroHeight, 0.15);

        heroLogo.style.transform =
          `translateY(${movement}px) scale(${scale})`;

      }
    }

    window.addEventListener(
      "scroll",
      moveHeroLogo,
      { passive: true }
    );

    moveHeroLogo();
  }


  /* =====================================================
     STICKY FOCUS CONTENT
     
     Keeps the focus introduction visually anchored
     while the cards move through the section.
  ===================================================== */

  const focusSection = document.querySelector(".focus");
  const focusIntro = document.querySelector(".focus-intro");

  if (focusSection && focusIntro && window.innerWidth > 1050) {

    function updateStickyFocus() {

      const rect = focusSection.getBoundingClientRect();

      const introHeight =
        focusIntro.offsetHeight;

      const viewportHeight =
        window.innerHeight;

      const headerHeight =
        header ? header.offsetHeight : 0;

      const stickyTop =
        headerHeight + 45;

      const sectionBottom =
        rect.bottom - introHeight - 45;

      if (
        rect.top <= stickyTop &&
        rect.bottom > viewportHeight
      ) {

        focusIntro.style.position = "sticky";
        focusIntro.style.top = `${stickyTop}px`;

      } else {

        focusIntro.style.position = "";
        focusIntro.style.top = "";

      }

      if (rect.bottom <= viewportHeight) {
        focusIntro.style.position = "";
        focusIntro.style.top = "";
      }
    }

    window.addEventListener(
      "scroll",
      updateStickyFocus,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateStickyFocus
    );

    updateStickyFocus();
  }


  /* =====================================================
     CHANGING FOCUS CARD CONTENT
     
     The currently visible card becomes more prominent
     as the visitor scrolls through the focus section.
  ===================================================== */

  const focusCards =
    document.querySelectorAll(".focus-card");

  if (
    focusCards.length &&
    "IntersectionObserver" in window
  ) {

    const cardObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              focusCards.forEach((card) => {
                card.classList.remove("focus-active");
              });

              entry.target.classList.add(
                "focus-active"
              );

            }

          });

        },
        {
          threshold: 0.55
        }
      );

    focusCards.forEach((card) => {
      cardObserver.observe(card);
    });
  }


  /* =====================================================
     SECTION COLOR TRANSITIONS
     
     Adds a subtle data attribute to the body based on
     whichever major section is currently visible.
  ===================================================== */

  const colorSections = [
    {
      selector: ".mission",
      name: "mission"
    },
    {
      selector: ".focus",
      name: "focus"
    },
    {
      selector: ".fundraising",
      name: "fundraising"
    },
    {
      selector: ".closing",
      name: "closing"
    },
    {
      selector: ".footer",
      name: "footer"
    }
  ];

  const observedSections = [];

  colorSections.forEach((item) => {

    const section =
      document.querySelector(item.selector);

    if (!section) return;

    observedSections.push({
      element: section,
      name: item.name
    });

  });


  if (
    observedSections.length &&
    "IntersectionObserver" in window
  ) {

    const sectionObserver =
      new IntersectionObserver(
        (entries) => {

          let mostVisible = null;
          let highestVisibility = 0;

          entries.forEach((entry) => {

            const visibility =
              entry.intersectionRatio;

            if (
              entry.isIntersecting &&
              visibility > highestVisibility
            ) {

              highestVisibility = visibility;
              mostVisible = entry.target;
            }

          });

          if (mostVisible) {

            const sectionData =
              observedSections.find(
                (item) =>
                  item.element === mostVisible
              );

            if (sectionData) {

              document.body.dataset.section =
                sectionData.name;
            }
          }

        },
        {
          threshold: [
            0.15,
            0.3,
            0.5,
            0.7,
            0.9
          ]
        }
      );

    observedSections.forEach((item) => {
      sectionObserver.observe(item.element);
    });
  }


  /* =====================================================
     SMOOTH INTERNAL LINKS
  ===================================================== */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

      link.addEventListener("click", (event) => {

        const targetId =
          link.getAttribute("href");

        if (!targetId || targetId === "#") {
          return;
        }

        const target =
          document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        const headerHeight =
          header ? header.offsetHeight : 0;

        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });

      });

    });


  /* =====================================================
     CURRENT YEAR
  ===================================================== */

  const year =
    document.getElementById("year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }


  /* =====================================================
     REDUCED MOTION
  ===================================================== */

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (prefersReducedMotion) {

    document.documentElement.classList.add(
      "reduced-motion"
    );
  }

});
