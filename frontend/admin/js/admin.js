
(function () {

    const token = localStorage.getItem("adminToken");

    if (!token) {
        window.location.href = "login.html";
    }

    const API = window.CONFIG.API_BASE_URL;

    const alertEl = document.getElementById("adminAlert");
    const sectionTitle = document.getElementById("adminSectionTitle");
    const navButtons = Array.from(document.querySelectorAll(".admin-nav-btn"));
    const sections = Array.from(document.querySelectorAll(".admin-section"));
    const homeStatsForm = document.getElementById("homeStatsForm");
    const saveHomeStatsBtn = document.getElementById("saveHomeStatsBtn");

    let data = {
        blogs: [],
        reviews: [],
        messages: [],
        stats: [],
        social: {},
        contact: {}
    };

    function getDefaultHomeStats() {
        return [
            { value: 300, suffix: "+", label: "Projects" },
            { value: 20, suffix: "K+", label: "Hours" },
            { value: 30, suffix: "+", label: "Team Size Professionals" },
            { value: 1000, suffix: "+", label: "Amazon Listings" }
        ];
    }

    // function getSiteDataSafe() {
    //     if (window.SiteData && typeof window.SiteData.getData === "function") {
    //         return window.SiteData.getData();
    //     }
    //     return null;
    // }

    // ---------------- ALERT ----------------
   
   
    function showAlert(message, isError) {
        alertEl.textContent = message;
        alertEl.style.color = isError ? "#a02020" : "#116d2b";
        setTimeout(() => alertEl.textContent = "", 2500);
    }

    // ---------------- LOAD DATA ----------------
    async function loadData() {
        try { 
            
            const [blogs, reviews, messages, contact, social, statsRes] = await Promise.all([
                fetch(`${API}/blogs`).then(res => res.json()),
                fetch(`${API}/reviews`).then(res => res.json()),
                fetch(`${API}/messages`).then(res => res.json()),
                fetch(`${API}/contact`).then(res => res.json()),
                fetch(`${API}/social`).then(res => res.json()),
                fetch(`${API}/stats`).then(res => res.json())
            ]);

            data.blogs = blogs;
            data.reviews = reviews;
            data.messages = messages;
            loadMessageCount();
            data.contact = contact;
            data.social = social;
            data.stats = statsRes.stats || [];


            renderAll();
        } catch (err) {
            console.error(err);
            showAlert("Error loading data", true);
            renderDashboard();
            renderHomeManagement();
        }
    }

  function loadMessageCount() {
    const countEl = document.getElementById("newMessageCount");
    if (countEl) {
        countEl.textContent = data.messages.length;
    }
}

    // ---------------- NAVIGATION ----------------
    function openSection(name) {
        navButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.target === name));
        sections.forEach(sec => sec.classList.toggle("active", sec.id === `section-${name}`));
        const active = navButtons.find(btn => btn.dataset.target === name);
        sectionTitle.textContent = active ? active.textContent : "Dashboard";
    }

    navButtons.forEach(btn => {
        btn.addEventListener("click", () => openSection(btn.dataset.target));
    });

    // ---------------- DASHBOARD ----------------
    function renderDashboard() {
        document.getElementById("totalBlogs").textContent = data.blogs.length;
        document.getElementById("totalReviews").textContent = data.reviews.length;
        document.getElementById("totalMessages").textContent = data.messages.length;

        const stats = Array.isArray(data.stats) && data.stats.length > 0
            ? data.stats.slice(0, 4)
            : getDefaultHomeStats();

        stats.forEach((stat, index) => {
            const statEl = document.getElementById(`dashStat${index}`);
            if (statEl) {
                statEl.textContent = `${Number(stat.value) || 0}${stat.suffix || ""}`;
            }
        });
    }

    function renderHomeManagement() {
        const stats = Array.isArray(data.stats) && data.stats.length > 0
            ? data.stats.slice(0, 4)
            : getDefaultHomeStats();

        homeStatsForm.innerHTML = "";

        stats.forEach((stat, index) => {
            const wrapper = document.createElement("div");
            wrapper.className = "admin-card";
            wrapper.innerHTML = `
                <h4>Card ${index + 1}</h4>
                <label>Label <input id="homeStatLabel${index}" value="${stat.label || ""}" required></label>
                <label>Value <input id="homeStatValue${index}" type="number" min="0" value="${Number(stat.value) || 0}" required></label>
                <label>Suffix <input id="homeStatSuffix${index}" value="${stat.suffix || ""}" placeholder="+, K+, %"></label>
            `;
            homeStatsForm.appendChild(wrapper);
        });
    }

    saveHomeStatsBtn.addEventListener("click", async () => {
    const nextStats = [0, 1, 2, 3].map((index) => ({
        label: document.getElementById(`homeStatLabel${index}`).value.trim(),
        value: Number.parseInt(document.getElementById(`homeStatValue${index}`).value, 10) || 0,
        suffix: document.getElementById(`homeStatSuffix${index}`).value.trim()
    }));

    try {
        const res = await fetch(`${API}/stats`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ stats: nextStats })
        });

        if (!res.ok) throw new Error();

        alert("Changes applied successfully")
        loadData();
    } catch (err) {
        alert("Error saving stats", true);
    }
});

    // ---------------- BLOGS ----------------
    function renderBlogs() {
    const list = document.getElementById("blogList");
    list.innerHTML = "";

    data.blogs.forEach(blog => {
        const item = document.createElement("div");
        item.className = "admin-list-item";
        item.innerHTML = `
            <h4>${blog.title}</h4>
            <p>${blog.description}</p>
            <p><strong>Author:</strong> ${blog.author || "-"}</p>
            <p><strong>Date:</strong> ${blog.date || "-"}</p>
            <button data-id="${blog._id}" data-action="delete-blog">Delete</button>
        `;
        list.appendChild(item);
    });
}

    const blogForm = document.getElementById("blogForm");
    const blogFormReset = document.getElementById("blogFormReset");
    const blogContent = document.getElementById("blogContent");
    const blogImageFileInput = document.getElementById("blogImageFile");
    const blogImagePreview = document.getElementById("blogImagePreview");
    const blogEditorToolbar = document.querySelector(".admin-editor-toolbar");
    const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
    // const MAX_UPLOAD_DATA_URL_BYTES = 2.2 * 1024 * 1024;

    // function getBlogImageInputValue() {
    //     return blogImageInput ? blogImageInput.value.trim() : "";
    // }

    // function clearBlogImageInputValue() {
    //     if (blogImageInput) {
    //         blogImageInput.value = "";
    //     }
    // }

    function surroundSelectedText(textarea, before, after) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        const selected = value.slice(start, end);
        const replacement = `${before}${selected || "text"}${after}`;
        textarea.value = `${value.slice(0, start)}${replacement}${value.slice(end)}`;

        const caret = start + replacement.length;
        textarea.focus();
        textarea.setSelectionRange(caret, caret);
    }

    function prefixSelectedLines(textarea, prefix) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;

        const lineStart = value.lastIndexOf("\n", start - 1) + 1;
        const lineEndIndex = value.indexOf("\n", end);
        const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;

        const block = value.slice(lineStart, lineEnd);
        const prefixed = block
            .split("\n")
            .map((line) => line.trim() ? `${prefix} ${line}` : line)
            .join("\n");

        textarea.value = `${value.slice(0, lineStart)}${prefixed}${value.slice(lineEnd)}`;
        textarea.focus();
        textarea.setSelectionRange(lineStart, lineStart + prefixed.length);
    }

    function updateBlogImagePreview(src) {
        const imageSrc = String(src || "").trim();
        if (!imageSrc) {
            blogImagePreview.hidden = true;
            blogImagePreview.removeAttribute("src");
            return;
        }

        blogImagePreview.src = imageSrc;
        blogImagePreview.hidden = false;
    }

    // function fileToDataURL(file) {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.onload = () => resolve(String(reader.result || ""));
    //         reader.onerror = () => reject(new Error("Failed to read image file"));
    //         reader.readAsDataURL(file);
    //     });
    // }

    // function estimateDataUrlBytes(dataUrl) {
    //     const parts = String(dataUrl || "").split(",");
    //     if (parts.length < 2) return 0;
    //     const base64 = parts[1];
    //     return Math.floor((base64.length * 3) / 4);
    // }

    // function loadImageElement(dataUrl) {
    //     return new Promise((resolve, reject) => {
    //         const img = new Image();
    //         img.onload = () => resolve(img);
    //         img.onerror = () => reject(new Error("Invalid image data"));
    //         img.src = dataUrl;
    //     });
    // }

    // async function compressImageToDataUrl(file) {
    //     const originalDataUrl = await fileToDataURL(file);
    //     const img = await loadImageElement(originalDataUrl);

    //     const maxDimension = 1600;
    //     let width = img.naturalWidth || img.width;
    //     let height = img.naturalHeight || img.height;

    //     const scale = Math.min(1, maxDimension / Math.max(width, height));
    //     width = Math.max(1, Math.round(width * scale));
    //     height = Math.max(1, Math.round(height * scale));

    //     const canvas = document.createElement("canvas");
    //     canvas.width = width;
    //     canvas.height = height;

    //     const ctx = canvas.getContext("2d");
    //     if (!ctx) {
    //         throw new Error("Failed to process image");
    //     }

    //     ctx.fillStyle = "#ffffff";
    //     ctx.fillRect(0, 0, width, height);
    //     ctx.drawImage(img, 0, 0, width, height);

    //     let quality = 0.86;
    //     let output = canvas.toDataURL("image/jpeg", quality);

    //     while (estimateDataUrlBytes(output) > MAX_UPLOAD_DATA_URL_BYTES && quality > 0.45) {
    //         quality = Number((quality - 0.08).toFixed(2));
    //         output = canvas.toDataURL("image/jpeg", quality);
    //     }

    //     return output;
    // }

    blogEditorToolbar?.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-editor-action]");
        if (!button) return;

        const action = button.dataset.editorAction;
        if (action === "bold") {
            surroundSelectedText(blogContent, "**", "**");
            return;
        }

        if (action === "h2") {
            prefixSelectedLines(blogContent, "##");
            return;
        }

        if (action === "h3") {
            prefixSelectedLines(blogContent, "###");
            return;
        }

        if (action === "linebreak") {
            const pos = blogContent.selectionStart;
            const value = blogContent.value;
            blogContent.value = `${value.slice(0, pos)}\n\n${value.slice(pos)}`;
            blogContent.focus();
            blogContent.setSelectionRange(pos + 2, pos + 2);
        }
    });

    // blogImageInput?.addEventListener("input", () => {
    //     const imageValue = getBlogImageInputValue();
    //     if (imageValue) {
    //         blogImageFileInput.value = "";
    //     }
    //     updateBlogImagePreview(imageValue);
    // });

    blogImageFileInput.addEventListener("change", () => {
    const file = blogImageFileInput.files && blogImageFileInput.files[0];

    if (!file) {
        updateBlogImagePreview("");
        return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
        blogImageFileInput.value = "";
        showAlert("Image too large. Please upload under 12MB", true);
        return;
    }

    const previewURL = URL.createObjectURL(file);
    updateBlogImagePreview(previewURL);
});

    blogFormReset?.addEventListener("click", () => {
        blogForm.reset();
        updateBlogImagePreview("");
    });

  blogForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = blogImageFileInput.files && blogImageFileInput.files[0];

    // Optional validation
    if (file && file.size > 12 * 1024 * 1024) {
        showAlert("Image too large. Please upload under 12MB", true);
        return;
    }

    const formData = new FormData();

    formData.append("title", document.getElementById("blogTitle").value.trim());
    formData.append("description", document.getElementById("blogDescription").value.trim());
    formData.append("content", blogContent.value.trim());
    formData.append("date", document.getElementById("blogDate").value.trim());
    formData.append("author", document.getElementById("blogAuthor").value.trim());
    formData.append("link", document.getElementById("blogLink").value.trim());

    // ✅ Send image file (Cloudinary will handle it)
    if (file) {
        formData.append("image", file);
    }

    try {
        const res = await fetch(`${API}/blogs`, {
            method: "POST",
            body: formData // ❗ NO headers here
        });

        // if (!res.ok) {
        //     let message = "Failed to save blog";

            // try {
            //     const data = await res.json();
            //     message = data.message || message;
            // } catch {
            //     const text = await res.text();
            //     if (text) message = text;
            // }
        //     if (!res.ok) {
        //             const errorData = await res.json().catch(() => null);
        //             throw new Error(errorData?.message || "Failed to save blog");
        //         }

        //     throw new Error(message);
        // }
        if (!res.ok) {
                const errorData = await res.json().catch(() => null);
                throw new Error(errorData?.message || "Failed to save blog");
            }

        showAlert("Blog saved successfully ✅");

        blogForm.reset();
        blogImageFileInput.value = "";
        updateBlogImagePreview("");

        loadData();

    } catch (err) {
        console.error(err);
        showAlert(`Error: ${err.message}`, true);
    }
});

    // ---------------- REVIEWS ----------------
    const reviewForm = document.getElementById("reviewForm");
    const reviewEndDate = document.getElementById("reviewEndDate");
    const reviewOngoing = document.getElementById("reviewOngoing");

    function updateReviewEndDateState() {
        if (reviewOngoing.checked) {
            reviewEndDate.value = "";
            reviewEndDate.disabled = true;
        } else {
            reviewEndDate.disabled = false;
        }
    }

    function formatCurrency(amount) {
        const value = Number(amount);
        if (!Number.isFinite(value)) return "-";
        return `$${value.toFixed(2)}`;
    }

    function formatHourlyRate(rate) {
        const value = Number(rate);
        if (!Number.isFinite(value)) return "-";
        return `$${value.toFixed(2)} / hr`;
    }

    function toIsoDateOnly(dateValue) {
        if (!dateValue) return "";
        const date = new Date(dateValue);
        if (!Number.isFinite(date.getTime())) return "";
        return date.toISOString().split("T")[0];
    }

    function renderReviews() {
        const list = document.getElementById("reviewList");
        list.innerHTML = "";

        data.reviews.forEach((r) => {
            const jobTitle = r.jobTitle || r.projectTitle || "-";
            const rating = Number(r.rating);
            const ratingText = Number.isFinite(rating) ? rating.toFixed(1) : "-";
            const startDate = toIsoDateOnly(r.startDate);
            const endDate = r.isOngoing ? "Present" : (toIsoDateOnly(r.endDate) || "-");

            const item = document.createElement("div");
            item.className = "admin-list-item";
            item.innerHTML = `
                <h4>${jobTitle}</h4>
                <p><strong>Client:</strong> ${r.clientName || "-"}</p>
                <p><strong>Rating:</strong> ${ratingText}</p>
                <p><strong>Duration:</strong> ${startDate || "-"} to ${endDate}</p>
                <p><strong>Earnings:</strong> ${formatCurrency(r.totalEarnings)} | ${formatHourlyRate(r.hourlyRate)} | ${Number.isFinite(Number(r.totalHours)) ? `${Number(r.totalHours)} hrs` : "-"}</p>
                <p><strong>Review Link:</strong> ${r.reviewLink ? `<a href="${r.reviewLink}" target="_blank" rel="noopener noreferrer">Open Review</a>` : "-"}</p>
                <p>${r.review || "-"}</p>
                <button data-id="${r._id}" data-action="delete-review">Delete</button>
            `;

            list.appendChild(item);
        });
    }

    reviewForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const startDateValue = document.getElementById("reviewStartDate").value;
        const endDateValue = document.getElementById("reviewEndDate").value;
        const isOngoing = reviewOngoing.checked;

        if (!isOngoing && !endDateValue) {
            showAlert("Please add an end date or mark the job as ongoing", true);
            return;
        }

        const review = {
            clientName: document.getElementById("reviewClientName").value.trim(),
            jobTitle: document.getElementById("reviewJobTitle").value.trim(),
            reviewLink: document.getElementById("reviewLink").value.trim(),
            rating: Number.parseFloat(document.getElementById("reviewRating").value),
            startDate: startDateValue || null,
            endDate: isOngoing ? null : (endDateValue || null),
            isOngoing,
            totalEarnings: Number.parseFloat(document.getElementById("reviewTotalEarnings").value),
            hourlyRate: Number.parseFloat(document.getElementById("reviewHourlyRate").value),
            totalHours: Number.parseInt(document.getElementById("reviewTotalHours").value, 10),
            review: document.getElementById("reviewText").value.trim(),
            freelancerResponse: document.getElementById("reviewResponse").value.trim(),

            // Legacy keys for compatibility with old frontend records.
            projectTitle: document.getElementById("reviewJobTitle").value.trim(),
            stars: Math.max(1, Math.min(5, Math.round(Number.parseFloat(document.getElementById("reviewRating").value) || 5))),
            dateRange: `${startDateValue || ""} - ${isOngoing ? "Present" : (endDateValue || "")}`.trim(),
            response: document.getElementById("reviewResponse").value.trim()
        };

        try {
            const res = await fetch(`${API}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(review)
            });

            if (!res.ok) throw new Error();

            showAlert("Review saved");
            reviewForm.reset();
            updateReviewEndDateState();
            loadData();
        } catch (err) {
            console.error(err);
            showAlert("Error saving review", true);
        }
    });

    reviewOngoing.addEventListener("change", updateReviewEndDateState);
    document.getElementById("reviewFormReset").addEventListener("click", () => {
        reviewForm.reset();
        updateReviewEndDateState();
    });

    // ---------------- MESSAGES ----------------
    function renderMessages() {
        const list = document.getElementById("messagesList");
        list.innerHTML = "";

        data.messages.forEach(msg => {
            const item = document.createElement("div");
            item.className = "admin-list-item";
            item.innerHTML = `
                <p>${msg.name} - ${msg.message}</p>
                <button data-id="${msg._id}" data-action="delete-message">Delete</button>
            `;
            list.appendChild(item);
        });
    }

    function escapeCsvValue(value) {
        const safe = String(value ?? "").replace(/\r?\n|\r/g, " ").trim();
        return `"${safe.replace(/"/g, '""')}"`;
    }

    function formatCsvDate(value) {
        const date = new Date(value);
        if (!Number.isFinite(date.getTime())) {
            return "";
        }
        return date.toISOString();
    }

    function downloadMessagesCsv() {
        if (!Array.isArray(data.messages) || data.messages.length === 0) {
            showAlert("No messages available to download", true);
            return;
        }

        const headers = ["Name", "Email", "Phone", "Message", "Date"];
        const rows = data.messages.map((msg) => [
            msg.name,
            msg.email,
            msg.phone,
            msg.message,
            formatCsvDate(msg.createdAt || msg.date)
        ]);

        const csvLines = [
            headers.map(escapeCsvValue).join(","),
            ...rows.map((row) => row.map(escapeCsvValue).join(","))
        ];

        // BOM helps Excel open UTF-8 CSV correctly.
        const csvContent = `\uFEFF${csvLines.join("\r\n")}`;
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, "0");
        const d = String(now.getDate()).padStart(2, "0");
        const fileName = `contact-messages-${y}${m}${d}.csv`;

        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
        showAlert("Messages CSV downloaded");
    }

    const downloadMessagesBtn = document.getElementById("downloadMessagesBtn");
    downloadMessagesBtn?.addEventListener("click", downloadMessagesCsv);

    // ---------------- DELETE HANDLER ----------------
    document.addEventListener("click", async (e) => {
        const btn = e.target.closest("button[data-action]");
        if (!btn) return;

        const { action, id } = btn.dataset;

        try {
            if (action === "delete-blog") {
                await fetch(`${API}/blogs/${id}`, { method: "DELETE" });
                showAlert("Blog deleted");
            }

            if (action === "delete-review") {
                await fetch(`${API}/reviews/${id}`, { method: "DELETE" });
                showAlert("Review deleted");
            }

            if (action === "delete-message") {
                await fetch(`${API}/messages/${id}`, { method: "DELETE" });
                showAlert("Message deleted");
            }

            loadData();
        } catch {
            showAlert("Delete failed", true);
        }
    });


    document.getElementById("contactInfoForm").addEventListener("submit", async (e) => {
    e.preventDefault();

            const contact = {
                phone: document.getElementById("contactPhone").value.trim(),
                email: document.getElementById("contactEmail").value.trim(),
                address: document.getElementById("contactAddress").value.trim()
            };

            try {
                const res = await fetch(`${API}/contact`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(contact)
                });

                if (!res.ok) throw new Error();

                showAlert("Contact info saved");
                loadData();

            } catch (err) {
                showAlert("Error saving contact info", true);
            }
        });

        const socialForm = document.getElementById("socialForm");

socialForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const social = {
        instagram: document.getElementById("socialInstagram").value.trim(),
        pinterest: document.getElementById("socialPinterest").value.trim(),
        twitter: document.getElementById("socialTwitter").value.trim(),
        facebook: document.getElementById("socialFacebook").value.trim()
    };

    try {
        const res = await fetch(`${API}/social`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(social)
        });

        if (!res.ok) throw new Error();

        showAlert("Social links saved");
    } catch (err) {
        showAlert("Error saving social links", true);
    }
});


    const changePasswordForm = document.getElementById("changePasswordForm");

changePasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!oldPassword || !newPassword || !confirmPassword) {
        alert("All fields are required");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("New passwords do not match");
        return;
    }

    try {
        const res = await fetch(`${API}/admin/change-password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("adminToken")
            },
            body: JSON.stringify({ oldPassword, newPassword })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Failed to change password");
            return;
        }

        alert("Password changed successfully ✅");

        // 🔥 Logout after password change (important)
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");

        window.location.href = "login.html";

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
});

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        const confirmLogout = confirm("Are you sure you want to logout?");

        if (confirmLogout) {
            logout();
        }
    });
}

function logout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");

    // 🔥 Replace history (no back access)
    window.location.replace("login.html");
}

    function renderContact() {
    document.getElementById("contactPhone").value = data.contact.phone || "";
    document.getElementById("contactEmail").value = data.contact.email || "";
    document.getElementById("contactAddress").value = data.contact.address || "";
}

    function renderSocial() {
    document.getElementById("socialInstagram").value = data.social.instagram || "";
    document.getElementById("socialPinterest").value = data.social.pinterest || "";
    document.getElementById("socialTwitter").value = data.social.twitter || "";
    document.getElementById("socialFacebook").value = data.social.facebook || "";
}

    // ---------------- RENDER ALL ----------------
    function renderAll() {
        renderDashboard();
        renderHomeManagement();
        renderBlogs();
        renderReviews();
        renderMessages();
        renderContact();
        renderSocial();
    }

    // ---------------- INIT ----------------
    loadData();
    setInterval(loadMessageCount, 5000);

})();

