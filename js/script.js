/* ==========================================================================
   Portfolio Diarietou Ngom
   1. Menu mobile  2. Lien actif du menu  3. Apparition au défilement
   4. Fenêtres de détail des projets  5. Copie de l'adresse email
   ========================================================================== */

const reduireMouvements = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* --------------------------------------------------------------------------
   1. Menu mobile : ouverture / fermeture accessible
   -------------------------------------------------------------------------- */
const boutonMenu = document.getElementById("menu-toggle");
const navigation = document.querySelector(".navigation");

if (boutonMenu && navigation) {
    const icone = boutonMenu.querySelector(".menu-icone");
    const texte = boutonMenu.querySelector(".menu-texte");
    const ecranLarge = window.matchMedia("(min-width: 768px)"); // même seuil que le CSS

    // Met à jour l'affichage du menu, l'état ARIA et le libellé du bouton
    function definirEtatMenu(ouvert) {
        navigation.classList.toggle("menu-ouvert", ouvert);
        boutonMenu.setAttribute("aria-expanded", String(ouvert));
        icone.textContent = ouvert ? "✕" : "☰";
        texte.textContent = ouvert ? "Fermer" : "Menu";
    }

    function menuEstOuvert() {
        return boutonMenu.getAttribute("aria-expanded") === "true";
    }

    boutonMenu.addEventListener("click", function () {
        definirEtatMenu(!menuEstOuvert());
    });

    // Clic sur un lien du menu : on referme le menu
    navigation.querySelectorAll("a").forEach(function (lien) {
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

    // Clic en dehors du menu : on le referme
    document.addEventListener("click", function (evenement) {
        if (menuEstOuvert() && !evenement.target.closest(".entete")) {
            definirEtatMenu(false);
        }
    });

    // Passage en grand écran : le menu mobile n'a plus lieu d'être ouvert
    ecranLarge.addEventListener("change", function () {
        definirEtatMenu(false);
    });
}

/* --------------------------------------------------------------------------
   2. Lien actif : le lien de la section visible est mis en surbrillance
   -------------------------------------------------------------------------- */
const liensMenu = document.querySelectorAll(".menu a");

if ("IntersectionObserver" in window && liensMenu.length) {
    const sectionsSuivies = [];
    liensMenu.forEach(function (lien) {
        const section = document.querySelector(lien.getAttribute("href"));
        if (section) {
            sectionsSuivies.push(section);
        }
    });

    const observateurSections = new IntersectionObserver(function (entrees) {
        entrees.forEach(function (entree) {
            if (!entree.isIntersecting) {
                return;
            }
            liensMenu.forEach(function (lien) {
                if (lien.getAttribute("href") === "#" + entree.target.id) {
                    lien.setAttribute("aria-current", "true");
                } else {
                    lien.removeAttribute("aria-current");
                }
            });
        });
    }, { rootMargin: "-45% 0px -50% 0px" }); // zone de détection : le milieu de l'écran

    sectionsSuivies.forEach(function (section) {
        observateurSections.observe(section);
    });
}

/* --------------------------------------------------------------------------
   3. Apparition douce des blocs pendant le défilement
   -------------------------------------------------------------------------- */
const blocsAReveler = document.querySelectorAll(".reveler");

if ("IntersectionObserver" in window && !reduireMouvements) {
    const observateurBlocs = new IntersectionObserver(function (entrees, observateur) {
        entrees.forEach(function (entree) {
            if (entree.isIntersecting) {
                entree.target.classList.add("visible");
                observateur.unobserve(entree.target); // une seule fois
            }
        });
    }, { threshold: 0.12 });

    blocsAReveler.forEach(function (bloc) {
        observateurBlocs.observe(bloc);
    });
} else {
    // Navigateur ancien ou mouvements réduits : tout est affiché directement
    blocsAReveler.forEach(function (bloc) {
        bloc.classList.add("visible");
    });
}

/* --------------------------------------------------------------------------
   4. Fenêtres de détail des projets (élément <dialog>)
   -------------------------------------------------------------------------- */
document.querySelectorAll("[data-dialog]").forEach(function (bouton) {
    const fenetre = document.getElementById(bouton.dataset.dialog);
    if (!fenetre || typeof fenetre.showModal !== "function") {
        return;
    }

    bouton.addEventListener("click", function () {
        fenetre.showModal();
        fenetre.scrollTop = 0;
    });
});

document.querySelectorAll(".fenetre").forEach(function (fenetre) {
    // Bouton ✕
    fenetre.querySelector(".fenetre-fermer").addEventListener("click", function () {
        fenetre.close();
    });

    // Clic sur le fond sombre, autour de la fenêtre
    fenetre.addEventListener("click", function (evenement) {
        if (evenement.target === fenetre) {
            fenetre.close();
        }
    });
});

/* --------------------------------------------------------------------------
   5. Copie de l'adresse email
   -------------------------------------------------------------------------- */
const boutonCopier = document.getElementById("copier-email");
const retourCopie = document.getElementById("copier-retour");

if (boutonCopier && retourCopie) {
    if (!navigator.clipboard) {
        boutonCopier.hidden = true; // copie impossible : on masque le bouton
    } else {
        boutonCopier.addEventListener("click", function () {
            navigator.clipboard.writeText(boutonCopier.dataset.email)
                .then(function () {
                    retourCopie.textContent = "Adresse copiée ✓";
                })
                .catch(function () {
                    retourCopie.textContent = "Copie impossible : " + boutonCopier.dataset.email;
                });

            setTimeout(function () {
                retourCopie.textContent = "";
            }, 3000);
        });
    }
}
