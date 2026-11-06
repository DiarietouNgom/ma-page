const boutonMenu = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

boutonMenu.addEventListener("click", function() {
    menu.classList.toggle("menu-ouvert");
});