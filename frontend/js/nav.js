(function () {
    function resolveIndexPath() {
        const path = window.location.pathname;

        if (path.includes("/blogs/") || path.includes("/admin/")) {
            return "../index.html";
        }

        return "./index.html";
    }

    function isHomePage() {
        const path = window.location.pathname;
        return path.endsWith("/") || path.endsWith("/index.html");
    }

    function initNavbar() {
        const menuToggle = document.querySelector(".menu-toggle");
        const navWrap = document.querySelector(".nav-wrap");
        const navbar = document.querySelector(".nav-shell");

        if (!menuToggle || !navWrap) {
            return;
        }

        menuToggle.addEventListener("click", () => {
            const isOpen = navWrap.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navWrap.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", (event) => {
                const href = link.getAttribute("href") || "";
                const hash = href.includes("#") ? href.slice(href.indexOf("#")) : "";
                const isSectionLink = ["#home", "#services", "#about", "#testimonials", "#contact"].includes(hash);

                if (isSectionLink) {
                    if (isHomePage()) {
                        const target = document.querySelector(hash);
                        if (target) {
                            event.preventDefault();
                            target.scrollIntoView({ behavior: "smooth", block: "start" });
                            window.history.replaceState(null, "", hash);
                        }
                    } else {
                        event.preventDefault();
                        window.location.href = `${resolveIndexPath()}${hash}`;
                    }
                }

                navWrap.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", (event) => {
            if (navbar && !navbar.contains(event.target)) {
                navWrap.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    window.EEFrontend = window.EEFrontend || {};
    window.EEFrontend.initNavbar = initNavbar;
})();
