// Menu mobile : ouverture / fermeture accessible
const boutonMenu = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

if (boutonMenu && menu) {
    const icone = boutonMenu.querySelector(".menu-icone");
    const texte = boutonMenu.querySelector(".menu-texte");

    // Met à jour l'affichage du menu, l'état ARIA et le libellé du bouton
    function definirEtatMenu(ouvert) {
        menu.classList.toggle("menu-ouvert", ouvert);
        boutonMenu.setAttribute("aria-expanded", String(ouvert));
        icone.textContent = ouvert ? "✕" : "☰";
        texte.textContent = ouvert ? "Fermer" : "Menu";
    }

    function menuEstOuvert() {
        return boutonMenu.getAttribute("aria-expanded") === "true";
    }

    // Clic sur le bouton : on inverse l'état
    boutonMenu.addEventListener("click", function () {
        definirEtatMenu(!menuEstOuvert());
    });

    // Clic sur un lien du menu : on referme le menu
    menu.querySelectorAll("a").forEach(function (lien) {
        lien.addEventListener("click", function () {
            definirEtatMenu(false);
        });
    });

    // Touche Échap : on referme le menu et on remet le focus sur le bouton
    document.addEventListener("keydown", function (evenement) {
        if (evenement.key === "Escape" && menuEstOuvert()) {
            definirEtatMenu(false);
            boutonMenu.focus();
        }
    });
}
