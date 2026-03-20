// Load navbar and footer components dynamically
(function () {
    function getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/blogs/') || path.includes('/admin/')) {
            return '../';
        }
        return './';
    }

    function normalizeNavbarLinks(basePath) {
        const nav = document.querySelector('.site-header .nav-wrap');
        if (!nav) {
            return;
        }

        const indexHref = `${basePath}index.html`;
        const blogHref = `${basePath}blogs.html`;

        const brandLink = document.querySelector('.site-header .brand');
        if (brandLink) {
            brandLink.setAttribute('href', indexHref);
        }

        const anchors = nav.querySelectorAll('a[href]');
        anchors.forEach((anchor) => {
            const href = anchor.getAttribute('href') || '';

            if (href === '/') {
                anchor.setAttribute('href', indexHref);
                return;
            }

            if (href.startsWith('/#')) {
                anchor.setAttribute('href', `${indexHref}${href.slice(1)}`);
                return;
            }

            if (href.startsWith('index.html#')) {
                const hash = href.includes('#') ? href.slice(href.indexOf('#')) : '';
                anchor.setAttribute('href', `${indexHref}${hash}`);
                return;
            }

            if (href === 'blogs.html') {
                anchor.setAttribute('href', blogHref);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', async function () {
        const basePath = getBasePath();
        
        try {
            // Load and inject navbar
            const navbarResponse = await fetch(`${basePath}components/navbar.html?v=20260320`, {
                cache: 'no-store'
            });
            if (navbarResponse.ok) {
                const navbarHtml = await navbarResponse.text();
                const main = document.querySelector('main');
                if (main) {
                    main.insertAdjacentHTML('beforebegin', navbarHtml);
                    normalizeNavbarLinks(basePath);
                }
            }

            // Load and inject footer
            const footerResponse = await fetch(`${basePath}components/footer.html?v=20260323`, {
                cache: 'no-store'
            });
            if (footerResponse.ok) {
                const footerHtml = await footerResponse.text();
                const oldFooter = document.querySelector('footer');
                if (oldFooter) {
                    oldFooter.remove();
                }
                document.body.insertAdjacentHTML('beforeend', footerHtml);
            }

            // Initialize navbar after injection
            setTimeout(() => {
                if (window.EEFrontend && window.EEFrontend.initNavbar) {
                    window.EEFrontend.initNavbar();
                }
            }, 100);
        } catch (error) {
            console.error('Error loading components:', error);
        }
    });
})();
