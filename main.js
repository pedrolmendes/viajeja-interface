// =====================
// MENU MOBILE
// =====================
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuToggle?.addEventListener("click", () => {
  nav.classList.toggle("active");
});

// =====================
// FILTRO DE DESTINOS
// =====================
const filterButtons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".card");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;

    cards.forEach(card => {
      card.style.display =
        filter === "all" || card.dataset.category === filter
          ? "block"
          : "none";
    });
  });
});

// =====================
// REVEAL ON SCROLL
// =====================
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < windowHeight - 100) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// =====================
// PARALLAX
// =====================
const hero = document.querySelector("[data-parallax]");

window.addEventListener("scroll", () => {
  if (!hero) return;
  hero.style.backgroundPositionY = `${window.scrollY * 0.4}px`;
});

// =====================
// MODAL DE AUTENTICAÇÃO
// =====================
const registerFields = document.querySelectorAll(".register-only");
const loginBtn = document.querySelector(".btn-login");
const registerBtn = document.querySelector(".btn-register");
const modal = document.getElementById("authModal");
const closeModal = document.querySelector(".modal-close");
const switchAuth = document.getElementById("switchAuth");
const modalTitle = document.getElementById("modalTitle");
const authSubmit = document.getElementById("authSubmit");
const switchText = document.getElementById("switchText");

let isLogin = true;

loginBtn?.addEventListener("click", () => {
  modal.classList.add("active");
  setLogin();
});

registerBtn?.addEventListener("click", () => {
  modal.classList.add("active");
  setRegister();
});

closeModal?.addEventListener("click", () => {
  modal.classList.remove("active");
  setLogin();
});

switchAuth?.addEventListener("click", e => {
  e.preventDefault();
  isLogin ? setRegister() : setLogin();
});

function setLogin() {
  isLogin = true;
  modalTitle.textContent = "Entrar no Viaje Já";
  authSubmit.textContent = "Entrar";
  switchText.textContent = "Não tem conta?";
  switchAuth.textContent = "Cadastre-se";
  registerFields.forEach(el => el.style.display = "none");
}

function setRegister() {
  isLogin = false;
  modalTitle.textContent = "Criar conta no Viaje Já";
  authSubmit.textContent = "Cadastrar";
  switchText.textContent = "Já tem conta?";
  switchAuth.textContent = "Entrar";
  registerFields.forEach(el => el.style.display = "block");
}

// =====================
// VALIDAÇÃO + LOGIN
// =====================
const authForm = document.getElementById("authForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const fullNameInput = document.getElementById("fullName");
const formError = document.getElementById("formError");

authForm?.addEventListener("submit", e => {
  e.preventDefault();
  formError.style.display = "none";

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email.includes("@")) return showError("Digite um email válido.");
  if (password.length < 6)
    return showError("A senha deve ter no mínimo 6 caracteres.");

  if (!isLogin) {
    const fullName = fullNameInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (fullName.length < 3)
      return showError("Digite seu nome completo.");

    if (password !== confirmPassword)
      return showError("As senhas não coincidem.");

    const user = {
      name: fullName.split(" ")[0],
      email,
      password
    };

    localStorage.setItem("viajeja_user", JSON.stringify(user));
    loginUser(user.name);
  } else {
    const storedUser = JSON.parse(localStorage.getItem("viajeja_user"));

    if (
      !storedUser ||
      storedUser.email !== email ||
      storedUser.password !== password
    ) {
      return showError("Email ou senha inválidos.");
    }

    loginUser(storedUser.name);
  }
});

function showError(message) {
  formError.textContent = message;
  formError.style.display = "block";
}

// =====================
// LOGIN DO USUÁRIO
// =====================

function loginUser(name) {
  modal.classList.remove("active");
  updateHeaderUser(name);
}

function updateHeaderUser(name) {
  const headerActions = document.querySelector(".header-actions");

  headerActions.innerHTML = `
    <span class="user-greeting">
      Olá, <strong>${name}</strong>
    </span>
    <button class="btn-login" id="logoutBtn">Sair</button>
  `;

  document
    .getElementById("logoutBtn")
    .addEventListener("click", logoutUser);
}


// =====================
// LOGOUT DO USUÁRIO
// =====================

function logoutUser() {
  localStorage.removeItem("viajeja_user");

  const headerActions = document.querySelector(".header-actions");
  headerActions.innerHTML = `
    <button class="btn-login">Entrar</button>
    <button class="btn-register">Cadastrar</button>
  `;

  // Reativar eventos dos botões
  document.querySelector(".btn-login").addEventListener("click", () => {
    modal.classList.add("active");
    setLogin();
  });

  document.querySelector(".btn-register").addEventListener("click", () => {
    modal.classList.add("active");
    setRegister();
  });
}

// =====================
// MANTER LOGIN APÓS RELOAD
// =====================

document.addEventListener("DOMContentLoaded", () => {
  const storedUser = JSON.parse(localStorage.getItem("viajeja_user"));
  if (storedUser?.name) {
    updateHeaderUser(storedUser.name);
  }
});

window.addEventListener("scroll", () => {
  document
    .querySelector(".header")
    .classList.toggle("scrolled", window.scrollY > 20);
});
