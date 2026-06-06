// MENU MOBILE

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});


// MODE SOMBRE

const themeBtn = document.getElementById("theme-toggle");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark")
        ? "dark"
        : "light"
    );

});

if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark");
}


// ANIMATION AU SCROLL

const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {

    reveals.forEach(section => {

        const top = section.getBoundingClientRect().top;

        if(top < window.innerHeight - 100){
            section.classList.add("active");
        }

    });

});


// Animation immédiate si déjà visible

window.dispatchEvent(new Event("scroll"));