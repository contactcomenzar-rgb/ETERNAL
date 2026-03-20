(function () {

    const API = window.CONFIG.API_BASE_URL;

    function renderSocial(data) {
        if (!data?.social) return;

        const socialMap = {
            Instagram: data.social.instagram,
            Pinterest: data.social.pinterest,
            Twitter: data.social.twitter,
            Facebook: data.social.facebook
        };

        document.querySelectorAll(".social-row a").forEach((anchor) => {
            const label = anchor.getAttribute("aria-label");
            if (label && socialMap[label]) {
                anchor.setAttribute("href", socialMap[label]);
            }
        });
    }

    async function loadFooterData() {
        try {
            const res = await fetch(`${API}/social`);
            const social = await res.json();

            renderSocial({ social });

        } catch (err) {
            console.error("Failed to load social links", err);
        }
    }

    loadFooterData();

})();