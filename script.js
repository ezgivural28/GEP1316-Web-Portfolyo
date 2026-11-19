(function () {
  const THEME_KEY = "portfolyo_theme";
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const menuToggle = document.getElementById("menu-toggle");
  const navList = document.getElementById("nav-list");

  // 1. Karanlık Mod Etkileşimi
  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      if (themeToggle) {
        themeToggle.setAttribute("aria-pressed", "true");
        themeToggle.textContent = "Açık Mod";
      }
    } else {
      root.removeAttribute("data-theme");
      if (themeToggle) {
        themeToggle.setAttribute("aria-pressed", "false");
        themeToggle.textContent = "Karanlık Mod";
      }
    }
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(savedTheme === "dark" ? "dark" : "light");

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const isDark = root.getAttribute("data-theme") === "dark";
      const nextTheme = isDark ? "light" : "dark";
      localStorage.setItem(THEME_KEY, nextTheme);
      applyTheme(nextTheme);
    });
  }

  // 2. Mobil Menü Etkileşimi
  if (menuToggle && navList) {
    menuToggle.addEventListener("click", function () {
      const isOpen = navList.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navList.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navList.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 3 & 4. Proje Filtreleme ve Arama Etkileşimi
  const searchInput = document.getElementById("project-search");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const noResultsBox = document.getElementById("no-results");

  if (projectCards.length > 0) {
    let activeCategory = "all";

    function filterProjects() {
      const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
      let visibleCount = 0;

      projectCards.forEach(function (card) {
        const category = card.getAttribute("data-category") || "";
        const keywords = (card.getAttribute("data-keywords") || "").toLowerCase();
        const text = card.textContent.toLowerCase();

        const matchesCategory = activeCategory === "all" || category === activeCategory;
        const matchesQuery =
          query === "" || keywords.includes(query) || text.includes(query);

        const show = matchesCategory && matchesQuery;
        card.hidden = !show;
        if (show) {
          visibleCount += 1;
        }
      });

      if (noResultsBox) {
        noResultsBox.hidden = visibleCount > 0;
      }
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeCategory = btn.getAttribute("data-filter") || "all";
        filterButtons.forEach(function (b) {
          b.classList.remove("btn-primary");
          b.classList.add("btn-secondary");
        });
        btn.classList.remove("btn-secondary");
        btn.classList.add("btn-primary");
        filterProjects();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", filterProjects);
    }
  }

  // 5. İletişim Formu Doğrulama ve Geri Bildirim Etkileşimi
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const nameInput = document.getElementById("sender-name");
    const emailInput = document.getElementById("sender-email");
    const topicSelect = document.getElementById("message-topic");
    const messageInput = document.getElementById("sender-message");

    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const topicError = document.getElementById("topic-error");
    const messageError = document.getElementById("message-error");
    const feedbackBox = document.getElementById("form-feedback");

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      nameError.textContent = "";
      emailError.textContent = "";
      topicError.textContent = "";
      messageError.textContent = "";
      feedbackBox.hidden = true;
      feedbackBox.textContent = "";

      let isValid = true;
      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const topicVal = topicSelect.value.trim();
      const messageVal = messageInput.value.trim();

      if (nameVal.length < 2) {
        nameError.textContent = "Lütfen en az 2 karakterlik ad soyad giriniz.";
        isValid = false;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailVal)) {
        emailError.textContent = "Lütfen geçerli bir e-posta adresi giriniz.";
        isValid = false;
      }

      if (!topicVal) {
        topicError.textContent = "Lütfen bir konu seçiniz.";
        isValid = false;
      }

      if (messageVal.length < 10) {
        messageError.textContent = "Lütfen en az 10 karakterlik bir mesaj yazınız.";
        isValid = false;
      }

      if (!isValid) {
        feedbackBox.hidden = false;
        feedbackBox.textContent = "Formda eksik veya hatalı alanlar var. Lütfen kontrol ediniz.";
        return;
      }

      feedbackBox.hidden = false;
      feedbackBox.textContent =
        "Teşekkürler, " +
        nameVal +
        "! Mesajınız form doğrulamasından geçti (bu statik portfolyo formunda sunucuya harici veri gönderimi yapılmaz).";
      contactForm.reset();
    });
  }
})();