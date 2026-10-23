document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".destination-card");

  cards.forEach((card) => {
    const drawerId = card.dataset.drawer;
    const drawer = drawerId ? document.getElementById(drawerId) : null;

    if (!drawer) {
      return;
    }

    const openDrawer = () => {
      drawer.classList.add("open");
      drawer.setAttribute("aria-hidden", "false");
      card.setAttribute("aria-expanded", "true");
    };

    const closeDrawer = () => {
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
      card.setAttribute("aria-expanded", "false");
    };

    card.addEventListener("click", openDrawer);

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (drawer.classList.contains("open")) {
          closeDrawer();
          return;
        }

        openDrawer();
      }
    });

    const closeButton = drawer.querySelector(".close-btn");
    if (closeButton) {
      closeButton.addEventListener("click", closeDrawer);
    }

    drawer.addEventListener("click", (event) => {
      if (event.target === drawer) {
        closeDrawer();
      }
    });
  });

  const form = document.getElementById("contact-form");
  if (!form) {
    return;
  }

  const statusNode = document.getElementById("form-status");
  const fieldRules = {
    name: {
      validate: (value) => value.trim().length >= 2,
      message: "Please enter at least 2 characters for your name."
    },
    email: {
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      message: "Please enter a valid email address."
    },
    message: {
      validate: (value) => value.trim().length >= 10,
      message: "Please write a message with at least 10 characters."
    }
  };

  const setFieldError = (name, message) => {
    const field = form.elements[name];
    const errorNode = document.getElementById(`${name}-error`);

    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (errorNode) {
      errorNode.textContent = message;
      errorNode.classList.toggle("hidden", !message);
    }
  };

  const setStatus = (message, isError = false) => {
    if (!statusNode) {
      return;
    }

    statusNode.textContent = message;
    statusNode.classList.toggle("hidden", !message);
    statusNode.classList.toggle("error-message", isError);
    statusNode.classList.toggle("success-message", !isError);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let isValid = true;

    Object.entries(fieldRules).forEach(([name, rule]) => {
      const value = form.elements[name].value;
      const passes = rule.validate(value);
      if (!passes) {
        setFieldError(name, rule.message);
        isValid = false;
      } else {
        setFieldError(name, "");
      }
    });

    if (!isValid) {
      setStatus("Please fix the highlighted fields and try again.", true);
      return;
    }

    setStatus("Your message is being sent. Thanks for reaching out!", false);
    form.reset();
    Object.keys(fieldRules).forEach((name) => setFieldError(name, ""));
  });
});
