(function () {
    const API = window.CONFIG.API_BASE_URL;
    const BLOGS_PAGE_FILE = "blogs.html";

    function getBlogGrid() {
        return document.querySelector(".blog-grid");
    }

    function renderBlogSkeletons() {
        const blogGrid = getBlogGrid();
        if (!blogGrid) return;

        const isBlogsPage = Boolean(document.getElementById("blogs-page-title"));
        const count = isBlogsPage ? 6 : 3;

        blogGrid.classList.remove("is-loaded");
        blogGrid.classList.add("is-loading");
        blogGrid.innerHTML = Array.from({ length: count }).map(() => `
            <article class="blog-card blog-skeleton" aria-hidden="true">
                <div class="blog-skeleton-media"></div>
                <div class="blog-skeleton-meta"></div>
                <div class="blog-skeleton-title"></div>
                <div class="blog-skeleton-text"></div>
                <div class="blog-skeleton-link"></div>
            </article>
        `).join("");
    }

    function parseSortableDate(input) {
        if (!input) return 0;
        const parsed = new Date(String(input).trim()).getTime();
        return Number.isFinite(parsed) ? parsed : 0;
    }

    function getBlogIdentifier(blog) {
        return String(blog?._id || blog?.id || "").trim();
    }

    function normalizeBlogLink(blog, isBlogsPage) {
        const link = (blog && blog.link ? String(blog.link) : "").trim();
        if (link) return link;

        const blogId = getBlogIdentifier(blog);
        if (blogId) return `${BLOGS_PAGE_FILE}?id=${encodeURIComponent(blogId)}`;

        // Final safe fallback if no id/link exists.
        return BLOGS_PAGE_FILE;
    }

    function createBlogCard(blog, isBlogsPage) {
        const article = document.createElement("article");
        article.className = "blog-card reveal visible";

        const image = blog.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=700&q=70";
        const title = blog.title || "Blog Post";
        const description = blog.description || "";
        const meta = `${blog.date || ""} | By ${blog.author || "Eternal Elevator"}`;
        const link = normalizeBlogLink(blog, isBlogsPage);
        article.innerHTML = `
            <img src="${image}" width="700" height="420" loading="lazy" alt="${title}">
            <p class="blog-meta">${meta}</p>
            <h3>${title}</h3>
            <p>${description}</p>
            <a href="${link}">Read More</a>
        `;

        return article;
    }

    function escapeHtml(text) {
        return String(text || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function applyInlineBold(text) {
        return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    }

    function formatBlogContent(content) {
        const safe = escapeHtml(content);
        const lines = safe.split(/\r?\n/);
        const html = [];
        let paragraphBuffer = [];

        const flushParagraph = () => {
            if (paragraphBuffer.length === 0) return;
            html.push(`<p>${applyInlineBold(paragraphBuffer.join(" "))}</p>`);
            paragraphBuffer = [];
        };

        lines.forEach((line) => {
            const trimmed = line.trim();
            if (!trimmed) {
                flushParagraph();
                return;
            }

            if (trimmed.startsWith("### ")) {
                flushParagraph();
                html.push(`<h4>${applyInlineBold(trimmed.slice(4))}</h4>`);
                return;
            }

            if (trimmed.startsWith("## ")) {
                flushParagraph();
                html.push(`<h3>${applyInlineBold(trimmed.slice(3))}</h3>`);
                return;
            }

            if (trimmed.startsWith("# ")) {
                flushParagraph();
                html.push(`<h2>${applyInlineBold(trimmed.slice(2))}</h2>`);
                return;
            }

            paragraphBuffer.push(trimmed);
        });

        flushParagraph();
        return html.join("");
    }

    function renderBlogDetail(blog) {
        const blogGrid = document.querySelector(".blog-grid");
        if (!blogGrid) return;
        const blogSection = document.querySelector("section.blog");

        const sectionTitle = document.getElementById("blogs-page-title");
        if (sectionTitle) {
            sectionTitle.textContent = blog?.title || "Blog";
        }

        const image = blog?.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=70";
        const title = blog?.title || "Blog Post";
        const meta = `${blog?.date || ""} | By ${blog?.author || "Eternal Elevator"}`;
        const content = blog?.content || blog?.description || "No content available.";
        const formattedContent = formatBlogContent(content);

        if (blogSection) {
            blogSection.classList.add("blog-detail-mode");
        }

        blogGrid.classList.remove("is-loading", "expanded");
        blogGrid.innerHTML = `
            <article class="blog-detail reveal visible" aria-labelledby="blog-detail-title">
                <figure class="blog-detail-hero">
                    <img src="${image}" width="1200" height="700" loading="eager" alt="${title}">
                </figure>
                <p class="blog-meta">${meta}</p>
                <h2 id="blog-detail-title" class="blog-detail-title">${title}</h2>
                <div class="blog-detail-content">
                    ${formattedContent || `<p>${escapeHtml(content)}</p>`}
                </div>
                <div class="blog-detail-actions">
                    <a class="btn btn-outline" href="${BLOGS_PAGE_FILE}">Back to All Blogs</a>
                </div>
            </article>
        `;

        window.requestAnimationFrame(() => {
            blogGrid.classList.add("is-loaded");
        });
    }

    function renderBlogs(blogs) {
        const blogGrid = getBlogGrid();
        if (!blogGrid) return;

        const isBlogsPage = Boolean(document.getElementById("blogs-page-title"));
        const blogId = new URLSearchParams(window.location.search).get("id");

        const sortedBlogs = (Array.isArray(blogs) ? blogs : [])
            .slice()
            .sort((left, right) => parseSortableDate(right.date) - parseSortableDate(left.date));

        if (isBlogsPage && blogId) {
            const selected = sortedBlogs.find((blog) => getBlogIdentifier(blog) === blogId);
            if (selected) {
                renderBlogDetail(selected);
                return;
            }
        }

        const renderSet = isBlogsPage ? sortedBlogs : sortedBlogs.slice(0, 3);

        blogGrid.classList.remove("is-loading", "is-loaded");
        blogGrid.innerHTML = "";

        renderSet.forEach((blog) => {
            if (!blog.title && !blog.description) return;
            blogGrid.appendChild(createBlogCard(blog, isBlogsPage));
        });

        if (blogGrid.children.length === 0) {
            blogGrid.innerHTML = "<p>No blogs available right now.</p>";
        }

        window.requestAnimationFrame(() => {
            blogGrid.classList.add("is-loaded");
        });
    }

    function getFallbackBlogs() {
        try {
            if (window.SiteData && typeof window.SiteData.getData === "function") {
                const siteData = window.SiteData.getData();
                return Array.isArray(siteData.blogs) ? siteData.blogs : [];
            }
        } catch (_error) {
            // Ignore fallback read issues and return empty list.
        }

        return [];
    }

    async function loadBlogs() {
        renderBlogSkeletons();

        try {
            const res = await fetch(`${API}/blogs`);
            if (!res.ok) throw new Error("Failed to fetch blogs");
            const blogs = await res.json();

            if (Array.isArray(blogs) && blogs.length > 0) {
                renderBlogs(blogs);
                return;
            }

            renderBlogs(getFallbackBlogs());
        } catch (err) {
            console.error("Error loading blogs:", err);
            renderBlogs(getFallbackBlogs());
        }
    }

    loadBlogs();
})();
