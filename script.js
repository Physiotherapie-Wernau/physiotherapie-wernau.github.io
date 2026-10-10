/* Praxis für Physiotherapie Schimann – interactions */
(function () {
  "use strict";

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  var onScroll = function () {
    header.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
  });

  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Active nav link while scrolling ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll("ul a"));

  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll (with failsafe so content is never hidden) ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  function revealAll() {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });

    /* failsafe: if the observer never fires (odd environments, print, etc.),
       make sure no content stays invisible */
    window.setTimeout(revealAll, 2500);
  } else {
    revealAll();
  }

  /* ---------- Highlight today in opening hours ---------- */
  var today = new Date().getDay(); /* 0 = Sunday */
  var row = document.querySelector('.hours tr[data-day="' + today + '"]');
  if (row) row.classList.add("today");

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Lightbox ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  var lightbox = document.getElementById("lightbox");
  var lbImg = lightbox.querySelector("img");
  var lbCaption = lightbox.querySelector("figcaption");
  var current = 0;
  var lastFocused = null;

  /* preload full images */
  items.forEach(function (item) {
    var pre = new Image();
    pre.src = item.querySelector("img").src;
  });

  function show(index) {
    current = (index + items.length) % items.length;
    var src = items[current].querySelector("img").src;
    lbImg.src = src;
    lbImg.alt = items[current].querySelector("img").alt;
    lbCaption.textContent = "Foto " + (current + 1) + " von " + items.length;
  }

  function open(index, trigger) {
    lastFocused = trigger || document.activeElement;
    show(index);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightbox.querySelector(".lightbox-close").focus();
  }

  function close() {
    lightbox.hidden = true;
    lbImg.src = "";
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  items.forEach(function (item, i) {
    item.addEventListener("click", function () { open(i, item); });
  });

  lightbox.querySelector(".lightbox-close").addEventListener("click", close);
  lightbox.querySelector(".lightbox-prev").addEventListener("click", function () { show(current - 1); });
  lightbox.querySelector(".lightbox-next").addEventListener("click", function () { show(current + 1); });

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", function (e) {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
    else if (e.key === "Tab") {
      /* keep focus trapped inside the lightbox */
      var focusables = lightbox.querySelectorAll("button");
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* simple swipe support */
  var touchX = null;
  lightbox.addEventListener("touchstart", function (e) {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 45) show(current + (dx < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });
})();
