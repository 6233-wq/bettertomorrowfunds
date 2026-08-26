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
    {
      passive: true
    }
  );

  updateHeader();


  /* =====================================================
     SCROLL REVEAL
  ===================================================== */

  const revealElements = document.querySelectorAll(
    ".section-heading, .mission-copy, .focus-intro, .focus-card, .fundraising-inner, .fundraising-stats, .closing-box"
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

        rootMargin:
          "0px 0px -60px 0px"
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
     FUNDRAISING COUNTER ANIMATION
  ===================================================== */

  const statNumbers =
    document.querySelectorAll(".stat-number");


  function animateCounter(element) {

    const target =
      parseFloat(
        element.dataset.target
      );

    if (isNaN(target)) return;


    const prefix =
      element.dataset.prefix || "";


    const suffix =
      element.dataset.suffix || "";


    const decimals =
      target % 1 !== 0
        ? 1
        : 0;


    const duration = 1800;

    const startTime =
      performance.now();


    function updateCounter(currentTime) {

      const elapsed =
        currentTime - startTime;


      const progress =
        Math.min(
          elapsed / duration,
          1
        );


      /*
        Ease-out animation.

        Starts quickly and slows down
        as it approaches the final number.
      */

      const easedProgress =
        1 -
        Math.pow(
          1 - progress,
          3
        );


      const currentValue =
        target * easedProgress;


      element.textContent =
        prefix +
        currentValue.toFixed(decimals) +
        suffix;


      if (progress < 1) {

        requestAnimationFrame(
          updateCounter
        );

      } else {

        element.textContent =
          prefix +
          target.toFixed(decimals) +
          suffix;

      }

    }


    requestAnimationFrame(
      updateCounter
    );

  }


  if (
    statNumbers.length &&
    "IntersectionObserver" in window
  ) {

    const counterObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (
              entry.isIntersecting
            ) {

              animateCounter(
                entry.target
              );

              counterObserver.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold: 0.5
        }
      );


    statNumbers.forEach((stat) => {

      counterObserver.observe(stat);

    });

  } else {

    /*
      Fallback for browsers without
      IntersectionObserver.
    */

    statNumbers.forEach((stat) => {

      const target =
        parseFloat(
          stat.dataset.target
        );

      const prefix =
        stat.dataset.prefix || "";

      const decimals =
        target % 1 !== 0
          ? 1
          : 0;

      stat.textContent =
        prefix +
        target.toFixed(decimals);

    });

  }


  /* =====================================================
     HERO LOGO SCROLL MOVEMENT
  ===================================================== */

  const hero =
    document.querySelector(".home-hero");

  const heroLogo =
    document.querySelector(".hero-art img");


  if (hero && heroLogo) {

    function moveHeroLogo() {

      const scrollY =
        window.scrollY;


      const heroHeight =
        hero.offsetHeight;


      if (scrollY <= heroHeight) {

        const movement =
          scrollY * 0.10;


        const scale =
          1 -
          Math.min(
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
      {
        passive: true
      }
    );


    moveHeroLogo();

  }


  /* =====================================================
     SMOOTH INTERNAL LINKS
  ===================================================== */

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach((link) => {

      link.addEventListener(
        "click",
        (event) => {

          const targetId =
            link.getAttribute(
              "href"
            );


          const target =
            document.querySelector(
              targetId
            );


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
    document.getElementById(
      "year"
    );


  if (year) {

    year.textContent =
      new Date().getFullYear();

  }

});
