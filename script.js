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
   FUNDRAISING COUNTER — SEQUENTIAL
===================================================== */

const counters = document.querySelectorAll(".counter");

if (counters.length) {

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) return;

        observer.unobserve(entry.target);

        // Start the sequence only from the first counter
        if (entry.target !== counters[0]) return;

        let currentIndex = 0;

        function runNextCounter() {

          if (currentIndex >= counters.length) return;

          const counter = counters[currentIndex];

          const target = parseFloat(
            counter.dataset.target
          );

          const decimals = parseInt(
            counter.dataset.decimals || "0",
            10
          );

          if (isNaN(target)) {
            currentIndex++;
            runNextCounter();
            return;
          }

          const duration = 1800;
          const startTime = performance.now();

          function animateCounter(currentTime) {

            const progress = Math.min(
              (currentTime - startTime) / duration,
              1
            );

            // Smooth ease-out
            const eased =
              1 - Math.pow(1 - progress, 3);

            const value = target * eased;

            counter.textContent =
              decimals > 0
                ? value.toFixed(decimals)
                : Math.floor(value).toLocaleString();

            if (progress < 1) {

              requestAnimationFrame(
                animateCounter
              );

            } else {

              // Exact final value
              counter.textContent =
                decimals > 0
                  ? target.toFixed(decimals)
                  : target.toLocaleString();

              currentIndex++;

              // Immediately start the next counter
              runNextCounter();
            }
          }

          requestAnimationFrame(
            animateCounter
          );
        }

        runNextCounter();
      });
    },
    {
      threshold: 0.5
    }
  );

  counterObserver.observe(counters[0]);
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

/* =================================
   BETTER TOMORROW FUNDS
   VOLUNTEER FORM EMAIL SUBMISSION
================================= */


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("btfVolunteerForm");
  if (!form) return;

  const button = document.getElementById("volunteerSubmit");
  const status = document.getElementById("volunteerStatus");
  const error = document.getElementById("volunteerError");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    status.textContent = "Sending your application...";
    status.classList.remove("error");
    error.textContent = "";

    const interests = [
      ...form.querySelectorAll(
        'input[name="interest"]:checked'
      )
    ].map(input => input.value);

    if (interests.length === 0) {
      error.textContent =
        "Please select at least one area of interest.";
      status.textContent = "";
      return;
    }

    if (!form.reportValidity()) return;

    const data = new FormData(form);

    const payload = {
      _subject: "New BetterTomorrowFunds Volunteer Application",
      _template: "table",
      _replyto: data.get("email"),
      Name: data.get("name"),
      Email: data.get("email"),
      Interests: interests.join(", "),
      Availability: data.get("availability"),
      Format: data.get("format"),
      Message: data.get("message") || "Not provided",
      Permission: "Yes"
    };

    button.disabled = true;
    button.textContent = "Sending...";

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/bettertomorrowfunds@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const result = await response.json();

      console.log("FormSubmit response:", result);

      // FormSubmit returns success as a string.
      if (String(result.success) !== "true") {
        throw new Error(
          result.message || "FormSubmit rejected the application."
        );
      }

      form.reset();
      status.textContent =
        "Thank you! Your application was successfully submitted.";

    } catch (err) {
      console.error("Volunteer submission error:", err);

      status.textContent =
        "Submission failed: " + err.message +
        " Please try again or email bettertomorrowfunds@gmail.com.";

      status.classList.add("error");

    } finally {
      button.disabled = false;
      button.innerHTML =
        'Send my interest <span>↗</span>';
    }
  });
});

