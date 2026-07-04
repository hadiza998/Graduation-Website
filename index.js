document.addEventListener("DOMContentLoaded", () => {
  /*** ELEMENT QUERIES ***/
  const rsvpForm = document.getElementById("rsvp-form");
  const rsvpButton = document.getElementById("rsvp-button");
  const participantsDiv = document.querySelector(".rsvp-participants");
  const rsvpCountText = document.getElementById("rsvp-count");
  const themeButton = document.getElementById("theme-button");
  const modal = document.getElementById("success-modal");
  const modalText = document.getElementById("modal-text");
  const modalImage = document.getElementById("modal-image");
  const headerButtons = document.querySelectorAll("[data-scroll-target]");

  /* ===================== RSVP HELPERS ===================== */

  const getCurrentRsvpCount = () => {
    if (!rsvpCountText) return 0;
    const match = rsvpCountText.textContent.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const updateRsvpCount = (newCount) => {
    if (!rsvpCountText) return;
    rsvpCountText.textContent = `⭐ ${newCount} people have RSVP'd to this event!`;
  };

  const addParticipant = (person) => {
    if (!participantsDiv) return;

    const newParticipant = document.createElement("p");
    newParticipant.textContent = `🩷 ${person.name} from ${person.hometown} has RSVP'd.`;
    participantsDiv.appendChild(newParticipant);

    const current = getCurrentRsvpCount();
    updateRsvpCount(current + 1);
  };

  /* ===================== FORM VALIDATION ===================== */

  const validateForm = (event) => {
    if (event) event.preventDefault();
    if (!rsvpForm) return;

    let containsErrors = false;
    const rsvpInputs = rsvpForm.elements;

    const person = {
      name: document.getElementById("rsvp-name").value.trim(),
      email: document.getElementById("rsvp-email").value.trim(),
      hometown: document.getElementById("rsvp-state").value.trim(),
    };
    // EMAIL VALIDATION
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(person.email)) {
        containsErrors = true;
        document.getElementById("rsvp-email").classList.add("error-email");
    } else {
  document.getElementById("rsvp-email").classList.remove("error-email");
     }


    // basic validation
    for (let i = 0; i < rsvpInputs.length; i++) {
      const input = rsvpInputs[i];
      if (input.type === "submit") continue;

      if (input.value.trim().length < 2) {
        containsErrors = true;
        input.classList.add("error");
      } else {
        input.classList.remove("error");
      }
    }

    if (!containsErrors) {
      addParticipant(person);
      toggleModal(person);

      // clear fields
      for (let i = 0; i < rsvpInputs.length; i++) {
        const input = rsvpInputs[i];
        if (input.type !== "submit") {
          input.value = "";
        }
      }
    }
  };

  // fire on form submit (if button is type="submit" and inside form)
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", validateForm);
  }

  // also fire directly on button click (covers button outside the form)
  if (rsvpButton) {
    rsvpButton.addEventListener("click", validateForm);
  }

  /* ===================== MODAL + ANIMATION ===================== */

  let rotateFactor = 0;
  let intervalId = null;

  const animateImage = () => {
    if (!modalImage) return;
    rotateFactor = rotateFactor === 0 ? -10 : 0;
    modalImage.style.transform = `rotate(${rotateFactor}deg)`;
  };

  const closeModal = () => {
    if (!modal) return;
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const toggleModal = (person) => {
    if (!modal || !modalText) return;

    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    modalText.textContent = `Thanks for RSVPing, ${person.name}! I can't wait to see you! 🎉`;

    if (!intervalId) {
      intervalId = setInterval(animateImage, 500);
    }

    setTimeout(() => {
      closeModal();
    }, 5000);
  };

  if (modal) {
    modal.addEventListener("click", () => {
      closeModal();
    });
  }

  // expose for any external usage if needed
  window.toggleModal = toggleModal;

  /* ===================== SMOOTH SCROLL ===================== */

  headerButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetSelector = btn.getAttribute("data-scroll-target");
      if (!targetSelector) return;
      const section = document.querySelector(targetSelector);
      if (!section) return;
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const navLinks = document.querySelectorAll(".navbar a[href^='#']");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const section = document.querySelector(targetId);
      if (!section) return;
      e.preventDefault();
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ===================== DARK MODE ===================== */

  const applyTheme = (mode) => {
    if (mode === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark" || savedTheme === "light") {
    applyTheme(savedTheme);
  }

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark-mode");
      const newTheme = isDark ? "light" : "dark";
      applyTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }
});
