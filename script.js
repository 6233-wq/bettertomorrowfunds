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

        menu.setAttribute(
          "aria-expanded",
          "false"
        );

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

  window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
  );

  updateHeader();


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
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
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
   FUNDRAISING COUNTERS
===================================================== */

const counters = document.querySelectorAll(".counter");

if (counters.length) {

  const counterObserver = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) return;

        const counter = entry.target;

        const target =
          parseFloat(counter.dataset.target);

        if (Number.isNaN(target)) {
          console.error(
            "Invalid counter target:",
            counter.dataset.target
          );
          return;
        }

        const start = performance.now();
        const duration = 1800;

        function animateCounter(now) {

          const progress =
            Math.min((now - start) / duration, 1);

          /*
            Ease-out animation
          */
          const eased =
            1 - Math.pow(1 - progress, 3);

          const value =
            target * eased;

          /*
            Keep 6.5 as a decimal,
            while whole numbers use commas.
          */
          if (target % 1 !== 0) {

            counter.textContent =
              value.toFixed(1);

          } else {

            counter.textContent =
              Math.floor(value).toLocaleString();

          }

          if (progress < 1) {

            requestAnimationFrame(
              animateCounter
            );

          } else {

            /*
              Final exact value
            */
            counter.textContent =
              target % 1 !== 0
                ? target.toFixed(1)
                : target.toLocaleString();

          }

        }

        requestAnimationFrame(
          animateCounter
        );

        /*
          Only animate each counter once.
        */
        counterObserver.unobserve(counter);

      });

    },
    {
      threshold: 0.2
    }
  );


  counters.forEach((counter) => {

    counterObserver.observe(counter);

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

      const heroHeight =
        hero.offsetHeight;

      if (scrollY <= heroHeight) {

        const movement =
          scrollY * 0.10;

        const scale =
          1 - Math.min(
            scrollY / heroHeight,
            0.15
          );

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
     SMOOTH INTERNAL LINKS
  ===================================================== */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

      link.addEventListener(
        "click",
        (event) => {

          const targetId =
            link.getAttribute("href");

          /*
            Ignore empty "#" links.
          */

          if (
            !targetId ||
            targetId === "#"
          ) {
            return;
          }

          const target =
            document.querySelector(targetId);

          if (!target) return;

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }
      );

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

});
