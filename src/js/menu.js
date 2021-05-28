export default function initMenu() {
    const hamburger = document.querySelector(".hamburger");
    const nav = document.querySelector("nav");
    const navLink = document.querySelectorAll("nav a");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        nav.classList.toggle("active");
    });
    
    navLink.forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            nav.classList.remove("active");
        });
    });
}