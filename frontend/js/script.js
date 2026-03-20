(function () {

    const API = window.CONFIG.API_BASE_URL;


    function renderStats(data) {
    const statCards = document.querySelectorAll(".stats-grid .stat-card");
    if (!statCards.length) return;

    const stats = Array.isArray(data)
        ? data.slice(0, 4)
        : Array.isArray(data?.stats)
            ? data.stats.slice(0, 4)
            : [];

    stats.forEach((stat, index) => {
        const card = statCards[index];
        if (!card) return;

        const counter = card.querySelector(".counter");
        const suffixNode = counter ? counter.nextSibling : null;

        if (counter) {
            counter.textContent = "0";
            counter.setAttribute("data-target", String(stat.value || 0));
        }

        if (suffixNode && suffixNode.nodeType === Node.TEXT_NODE) {
            suffixNode.nodeValue = stat.suffix || "";
        }

        const label = card.querySelector("p");
        if (label) {
            label.textContent = stat.label || "";
        }
    });
}


    function bindContactForm() {
    const form = document.querySelector(".contact-form");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const payload = {
            name: form.querySelector("#name").value.trim(),
            email: form.querySelector("#email").value.trim(),
            phone: form.querySelector("#phone").value.trim(),
            message: form.querySelector("#message").value.trim()
        };

        if (!payload.name || !payload.email || !payload.message) {
            alert("Please fill required fields");
            return;
        }

        try {
            const res = await fetch(`${API}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) throw new Error();

            alert("Message sent successfully ✅");
            form.reset();

        } catch (err) {
            console.error(err);
            alert("Failed to send message ❌");
        }
    });
}

    function initRevealAnimation() {
        const revealElements = document.querySelectorAll(".reveal");

        if ("IntersectionObserver" in window && revealElements.length > 0) {
            const revealObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("visible");
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.14,
                    rootMargin: "0px 0px -40px 0px"
                }
            );

            revealElements.forEach((element) => {
                revealObserver.observe(element);
            });
        } else {
            revealElements.forEach((element) => {
                element.classList.add("visible");
            });
        }
    }

    function initCounterAnimation() {
        const counters = document.querySelectorAll(".counter");

        if (counters.length > 0 && "IntersectionObserver" in window) {
            const animateCounter = (counter) => {
                const target = Number.parseInt(counter.dataset.target || "0", 10);
                const duration = 1400;
                const startTime = performance.now();

                const step = (currentTime) => {
                    const progress = Math.min((currentTime - startTime) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const value = Math.floor(eased * target);
                    counter.textContent = String(value);

                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    }
                };

                window.requestAnimationFrame(step);
            };

            const counterObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            animateCounter(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.45
                }
            );

            counters.forEach((counter) => {
                counterObserver.observe(counter);
            });
        } else {
            counters.forEach((counter) => {
                counter.textContent = counter.dataset.target || "0";
            });
        }
    }


async function loadStats() {
    try {
        const res = await fetch(`${API}/stats`);
        const data = await res.json();

        

        renderStats(data);
        initCounterAnimation();

    } catch (err) {
        console.error("Error loading stats", err);
    }
}
    

    if (window.EEFrontend?.initNavbar) {
        window.EEFrontend.initNavbar();
    }
    if (window.EEFrontend?.initToTopButton) {
        window.EEFrontend.initToTopButton();
    }

    // initRevealAnimation();
    // initCounterAnimation();
    // bindContactForm();
    // loadStats();
    initRevealAnimation();
    bindContactForm();
    loadStats(); // load first
})();
