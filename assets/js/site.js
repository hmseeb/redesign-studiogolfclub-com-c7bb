/* Studio Golf — site behaviour. Progressive enhancement only:
   every form and nav link works with JavaScript disabled. */
(function () {
  "use strict";

  /* ----------------------------------------------------- mobile navigation */
  var burger = document.querySelector("[data-burger]");
  var drawer = document.querySelector("[data-mobile-nav]");

  if (burger && drawer) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", open ? "false" : "true");
      drawer.classList.toggle("is-open", !open);
      document.body.classList.toggle("nav-open", !open);
    });

    drawer.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        burger.setAttribute("aria-expanded", "false");
        drawer.classList.remove("is-open");
        document.body.classList.remove("nav-open");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) {
        burger.setAttribute("aria-expanded", "false");
        drawer.classList.remove("is-open");
        document.body.classList.remove("nav-open");
        burger.focus();
      }
    });
  }

  /* --------------------------------------------- keyboard nav for dropdown */
  Array.prototype.forEach.call(
    document.querySelectorAll(".nav__item--has-sub > .nav__link"),
    function (trigger) {
      trigger.addEventListener("click", function (e) {
        if (trigger.tagName === "BUTTON") {
          e.preventDefault();
          var expanded = trigger.getAttribute("aria-expanded") === "true";
          trigger.setAttribute("aria-expanded", expanded ? "false" : "true");
        }
      });
    }
  );

  /* -------------------------------------------- stamp _page on every form */
  var here = window.location.href;
  Array.prototype.forEach.call(
    document.querySelectorAll('input[name="_page"]'),
    function (input) {
      input.value = here;
    }
  );

  /* ----------------------------- confirmation after plain HTML submission */
  var submitted = new URLSearchParams(window.location.search).get("submitted");
  if (submitted === "1") {
    var banners = document.querySelectorAll("[data-form-ok]");
    if (banners.length) {
      Array.prototype.forEach.call(banners, function (b) {
        b.classList.add("is-visible");
      });
      var first = banners[0];
      window.setTimeout(function () {
        first.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 120);
      first.setAttribute("tabindex", "-1");
    }
  }

  /* ---------------------------------- async submit (falls back gracefully) */
  Array.prototype.forEach.call(
    document.querySelectorAll("form[data-leadr]"),
    function (form) {
      form.addEventListener("submit", function (e) {
        if (!window.fetch || !form.reportValidity) return; // let the browser POST
        e.preventDefault();

        var ok = form.querySelector("[data-form-ok]");
        var err = form.querySelector("[data-form-err]");
        var btn = form.querySelector('button[type="submit"]');
        var label = btn ? btn.textContent : "";

        if (err) err.classList.remove("is-visible");
        if (btn) {
          btn.disabled = true;
          btn.textContent = "Sending…";
        }

        var payload = {};
        var data = new FormData(form);
        data.forEach(function (value, key) {
          if (typeof value === "string") payload[key] = value;
        });
        payload._page = window.location.href;

        fetch(form.action, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload)
        })
          .then(function (res) {
            return res.json().catch(function () {
              return { ok: res.ok };
            });
          })
          .then(function (json) {
            if (!json || json.ok !== true) throw new Error("rejected");
            form.reset();
            if (ok) {
              ok.classList.add("is-visible");
              ok.setAttribute("tabindex", "-1");
              ok.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          })
          .catch(function () {
            if (err) err.classList.add("is-visible");
          })
          .then(function () {
            if (btn) {
              btn.disabled = false;
              btn.textContent = label;
            }
          });
      });
    }
  );

  /* ----------------------------------------------- reveal-on-scroll polish */
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var targets = document.querySelectorAll("[data-reveal]");
    if (targets.length) {
      Array.prototype.forEach.call(targets, function (el) {
        el.style.opacity = "0";
        el.style.transform = "translateY(18px)";
        el.style.transition = "opacity .65s ease, transform .65s cubic-bezier(.2,0,.1,1)";
      });
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "none";
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      Array.prototype.forEach.call(targets, function (el) {
        io.observe(el);
      });
    }
  }
})();
