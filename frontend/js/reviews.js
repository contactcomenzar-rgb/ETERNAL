(function () {

    const API = window.CONFIG.API_BASE_URL;
    

    const REVIEW_TARGET_URL = "https://www.upwork.com/ab/g/pub/wom/prx/eyJwZXJzb25VaWQiOiI2MzgyMjc4MDYxNTkwMzY0MTYiLCJjb250cmFjdFJpZCI6IjQyMjMyNzE0IiwiYmFubmVyVHlwZSI6ImNvbnRyYWN0IiwiYmFubmVyVmFyaWFudCI6ImRlZmF1bHQiLCJ3b20iOiJmbHYyIiwicmVkaXJlY3QiOiJmbF9wcm9maWxlX3Byb21vIn0=?network=twitter";

    function parseSortableDate(review) {
        const endDate = review && review.endDate ? new Date(review.endDate).getTime() : 0;
        if (Number.isFinite(endDate) && endDate > 0) return endDate;

        const startDate = review && review.startDate ? new Date(review.startDate).getTime() : 0;
        if (Number.isFinite(startDate) && startDate > 0) return startDate;

        const rawRange = (review && review.dateRange) || "";
        const parsedLegacy = new Date(rawRange).getTime();
        return Number.isFinite(parsedLegacy) ? parsedLegacy : 0;
    }

    function formatDate(input) {
        if (!input) return "";
        const date = new Date(input);
        if (!Number.isFinite(date.getTime())) return "";
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric"
        });
    }

    function formatCurrency(input) {
        const value = Number(input);
        if (!Number.isFinite(value)) return "-";
        return `$${value.toFixed(2)}`;
    }

    function getReviewLink(review) {
        const candidate = review && review.reviewLink ? String(review.reviewLink).trim() : "";
        if (!candidate) return REVIEW_TARGET_URL;

        try {
            const parsed = new URL(candidate);
            if (parsed.protocol === "http:" || parsed.protocol === "https:") {
                return parsed.href;
            }
            return REVIEW_TARGET_URL;
        } catch {
            return REVIEW_TARGET_URL;
        }
    }

    function renderReviews(data) {
        const grid = document.querySelector(".client-reviews-grid");
        if (!grid) return;

        const reviews = Array.isArray(data) ? data : [];

        const sortedReviews = reviews
            .slice()
            .sort((left, right) => parseSortableDate(right) - parseSortableDate(left))
            .slice(0, 6);

        if (sortedReviews.length === 0) {
            grid.innerHTML = "<p>No reviews available.</p>";
            return;
        }

        grid.innerHTML = sortedReviews.map((review) => {
            const numericRating = Number.parseFloat(review.rating);
            const starsCount = Math.max(1, Math.min(5, Math.round(Number.isFinite(numericRating) ? numericRating : (Number.parseInt(review.stars, 10) || 5))));
            const stars = "★".repeat(starsCount);
            const ratingText = Number.isFinite(numericRating) ? numericRating.toFixed(1) : (review.rating || "5.0");

            const jobTitle = review.jobTitle || review.projectTitle || "Untitled";
            const startDate = formatDate(review.startDate);
            const endDate = review.isOngoing ? "Present" : formatDate(review.endDate);
            const dateRange = startDate ? `${startDate} - ${endDate || "Present"}` : (review.dateRange || "");

            const earnings = formatCurrency(review.totalEarnings);
            const hourlyRate = formatCurrency(review.hourlyRate);
            const totalHours = Number.isFinite(Number(review.totalHours)) ? `${Number(review.totalHours)} hours` : "-";
            const response = review.freelancerResponse || review.response || "";
            const reviewLink = getReviewLink(review);

            return `
                <article class="review-card" data-review-link="${reviewLink}">
                    <h3 class="review-project">${jobTitle}</h3>
                    <div class="review-rating-row">
                        <span class="review-rating-stars" aria-label="${ratingText} out of 5">${stars}</span>
                        <span class="review-rating-number">${ratingText}</span>
                    </div>
                    <p class="review-duration">${dateRange}</p>
                    <p class="review-text">${review.review || ""}</p>
                    <div class="review-response">
                        <p class="review-response-label">Freelancer's response</p>
                        <p>${response}</p>
                    </div>
                    <div class="review-metrics" aria-label="Review work summary">
                        <span>${earnings}</span>
                        <span>${hourlyRate} / hr</span>
                        <span>${totalHours}</span>
                    </div>
                </article>
            `;
        }).join("");
    }

    function bindReviewClicks() {
        const reviewCards = document.querySelectorAll(".review-card");
        reviewCards.forEach((card) => {
            card.style.cursor = "pointer";
            card.setAttribute("role", "link");
            card.setAttribute("tabindex", "0");

            const openReviewLink = () => {
                const link = card.dataset.reviewLink || REVIEW_TARGET_URL;
                window.open(link, "_blank", "noopener,noreferrer");
            };

            card.addEventListener("click", openReviewLink);
            card.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openReviewLink();
                }
            });
        });
    }

    window.EEFrontend = window.EEFrontend || {};
    window.EEFrontend.renderReviews = renderReviews;
    window.EEFrontend.bindReviewClicks = bindReviewClicks;


    async function loadReviewsFromAPI() {
    try {
        
        const res = await fetch(`${API}/reviews`);
       
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const reviews = await res.json();
       

        if (window.EEFrontend && window.EEFrontend.renderReviews) {
            window.EEFrontend.renderReviews(reviews);
            window.EEFrontend.bindReviewClicks();
        }
    } catch (err) {
        console.error("Error loading reviews:", err);
    }
}

// Run when page loads
document.addEventListener("DOMContentLoaded", loadReviewsFromAPI);

})();
