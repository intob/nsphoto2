import "./css/main.css";

const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector("nav");
const navLink = document.querySelectorAll("nav a");

hamburger.addEventListener("click", toggleMobileMenu);
navLink.forEach(link => link.addEventListener("click", closeMobileMenu));

function toggleMobileMenu() {
    hamburger.classList.toggle("active");
    nav.classList.toggle("active");
}

function closeMobileMenu() {
    hamburger.classList.remove("active");
    nav.classList.remove("active");
}