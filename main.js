/* --------------------------------------------------
   CUSTOM CURSOR
-------------------------------------------------- */
const dot  = document.getElementById("cur-dot");
const ring = document.getElementById("cur-ring");
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener("mousemove", e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + "px";
  dot.style.top  = my + "px";
});
(function animRing() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  ring.style.left = rx + "px";
  ring.style.top  = ry + "px";
  requestAnimationFrame(animRing);
})();
document.addEventListener("mouseleave", () => { dot.style.opacity = 0; ring.style.opacity = 0; });
document.addEventListener("mouseenter", () => { dot.style.opacity = 1; ring.style.opacity = 1; });

// Hover class on interactive elements
document.querySelectorAll("a,button,.sv-item,.port-card").forEach(el => {
  el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
  el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
});

/* --------------------------------------------------
   SCROLL PROGRESS
-------------------------------------------------- */
const prog = document.getElementById("progress");
const navbar = document.getElementById("nav");
window.addEventListener("scroll", () => {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  prog.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
  navbar.classList.toggle("scrolled", window.scrollY > 60);
}, { passive: true });

/* --------------------------------------------------
   HAMBURGER
-------------------------------------------------- */
const ham = document.getElementById("ham");
const mob = document.getElementById("mob");
ham.addEventListener("click", () => {
  const o = ham.classList.toggle("open");
  mob.classList.toggle("open", o);
  document.body.style.overflow = o ? "hidden" : "";
});
document.querySelectorAll(".ml").forEach(a => {
  a.addEventListener("click", () => {
    ham.classList.remove("open"); mob.classList.remove("open");
    document.body.style.overflow = "";
  });
});

/* --------------------------------------------------
   SCROLL REVEAL (IntersectionObserver)
-------------------------------------------------- */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("on"); obs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: "0px 0px -36px 0px" });
document.querySelectorAll(".r").forEach(el => obs.observe(el));

/* --------------------------------------------------
   SERVICE DESC HOVER REVEAL
-------------------------------------------------- */
document.querySelectorAll(".sv-item").forEach(item => {
  const desc = item.querySelector(".sv-desc");
  if (!desc) return;
  item.addEventListener("mouseenter", () => {
    desc.style.display = "block";
    desc.style.opacity = "0"; desc.style.transform = "translateY(6px)";
    requestAnimationFrame(() => {
      desc.style.transition = "opacity .35s, transform .35s";
      desc.style.opacity = "1"; desc.style.transform = "translateY(0)";
    });
  });
  item.addEventListener("mouseleave", () => {
    desc.style.opacity = "0"; desc.style.transform = "translateY(6px)";
    setTimeout(() => { desc.style.display = "none"; }, 280);
  });
});

/* --------------------------------------------------
   HERO PARALLAX ON MOUSE
-------------------------------------------------- */
const h1 = document.querySelector(".hero-h1");
document.addEventListener("mousemove", e => {
  if (!h1) return;
  const dx = (e.clientX - window.innerWidth / 2) / window.innerWidth;
  const dy = (e.clientY - window.innerHeight / 2) / window.innerHeight;
  h1.style.transform = `translate(${dx * 9}px,${dy * 5}px)`;
});

/* --------------------------------------------------
   PORTFOLIO CARD TILT
-------------------------------------------------- */
document.querySelectorAll(".port-card").forEach(c => {
  c.addEventListener("mousemove", e => {
    const r = c.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    c.style.transform = `perspective(800px) rotateY(${x*6}deg) rotateX(${-y*4}deg) scale(1.02)`;
  });
  c.addEventListener("mouseleave", () => { c.style.transform = ""; });
});

/* --------------------------------------------------
   STAT COUNT-UP
-------------------------------------------------- */
const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el  = e.target.querySelector(".stat-n");
    const cnt = parseInt(el.dataset.count);
    const sfx = el.dataset.suffix || "";
    if (!cnt) return;
    const start = performance.now();
    const dur = 1600;
    (function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.floor(eased * cnt) + (p >= 1 ? sfx : "");
      if (p < 1) requestAnimationFrame(step);
    })(start);
    statObs.unobserve(e.target);
  });
}, { threshold: 0.5 });
document.querySelectorAll(".stat").forEach(s => statObs.observe(s));

/* --------------------------------------------------
   CONTACT FORM
-------------------------------------------------- */
document.getElementById("ctform").addEventListener("submit", async e => {
  e.preventDefault();
  const n = document.getElementById("fn").value.trim();
  const em = document.getElementById("fe").value.trim();
  const msg = document.getElementById("fm").value.trim();
  const fb = document.getElementById("f-msg");
  if (!n || !em || !msg) {
    fb.textContent = "Please fill in all required fields.";
    fb.style.color = "#c23b22"; fb.style.opacity = "1"; return;
  }
  fb.textContent = "Sending…";
  fb.style.color = "var(--col-muted)"; fb.style.opacity = "1";
  try {
    const formData = {
      name:    document.getElementById("fn").value.trim(),
      email:   document.getElementById("fe").value.trim(),
      message: document.getElementById("fm").value.trim()
    };
    const res = await fetch("https://formspree.io/f/xbdzvjqy", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      fb.textContent = "Message received! We'll be in touch very soon.";
      fb.style.color = "var(--col-accent)";
      e.target.reset();
      setTimeout(() => { fb.style.opacity = "0"; }, 5000);
    } else {
      fb.textContent = "Something went wrong. Please try again or email us directly.";
      fb.style.color = "#c23b22";
    }
  } catch {
    fb.textContent = "Network error. Please check your connection and try again.";
    fb.style.color = "#c23b22";
  }
});

/* --------------------------------------------------
   SMOOTH ANCHOR SCROLL (offset for nav)
-------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", function(e) {
    const id = this.getAttribute("href");
    if (id === "#") return;
    const t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  });
});

/* --------------------------------------------------
   LIGHTBOX — Gallery image viewer
   Opens on click/Enter on any .gal-item
   Keyboard: Escape=close, ←/→=navigate
-------------------------------------------------- */
(function initLightbox() {
  const lb       = document.getElementById("lightbox");
  const lbImg    = document.getElementById("lb-img");
  const lbCat    = document.getElementById("lb-cat");
  const lbTitle  = document.getElementById("lb-title");
  const lbCount  = document.getElementById("lb-counter");
  const btnClose = document.getElementById("lb-close");
  const btnPrev  = document.getElementById("lb-prev");
  const btnNext  = document.getElementById("lb-next");

  // Collect all gallery items in DOM order
  const items = Array.from(document.querySelectorAll(".gal-item"));
  let current = 0;

  // Map index → { src, title, cat }
  function getItemData(el) {
    return {
      src:   el.querySelector("img").src,
      alt:   el.querySelector("img").alt,
      title: el.dataset.title || "",
      cat:   el.dataset.cat   || "",
    };
  }

  function openAt(idx) {
    current = (idx + items.length) % items.length;
    const d = getItemData(items[current]);

    // Fade out, swap src, fade in
    lbImg.classList.add("loading");
    const newImg = new Image();
    newImg.onload = () => {
      lbImg.src = d.src;
      lbImg.alt = d.alt;
      lbImg.classList.remove("loading");
    };
    newImg.src = d.src;

    lbCat.textContent   = d.cat;
    lbTitle.textContent = d.title;
    lbCount.textContent = (current + 1) + " / " + items.length;

    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    btnClose.focus();
  }

  function close() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Attach click to each gallery item
  items.forEach((el, idx) => {
    el.addEventListener("click",   () => openAt(idx));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openAt(idx); }
    });
  });

  // Controls
  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click",  () => openAt(current - 1));
  btnNext.addEventListener("click",  () => openAt(current + 1));

  // Click backdrop to close
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape")      close();
    if (e.key === "ArrowLeft")   openAt(current - 1);
    if (e.key === "ArrowRight")  openAt(current + 1);
  });

  // Touch swipe support
  let touchStartX = 0;
  lb.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend",   (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? openAt(current + 1) : openAt(current - 1);
  });
})();
