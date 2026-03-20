(function () {
    const STORAGE_KEY = "ee_site_data_v1";
    const SESSION_KEY = "ee_admin_session";

    const defaultData = {
        admin: {
            email: "admin@eternalelevator.com",
            passwordHash: ""
        },
        stats: [
            { value: 300, suffix: "+", label: "Projects" },
            { value: 20, suffix: "K+", label: "Hours" },
            { value: 30, suffix: "+", label: "Team Size Professionals" },
            { value: 1000, suffix: "+", label: "Amazon Listings" }
        ],
        infoCards: [
            "Easy Control Panel",
            "One-Click Updates",
            "Mobile Friendly",
            "Secure Data",
            "Cloud Backup"
        ],
        contact: {
            phone: "+91-78381-98739",
            email: "info@eternalelevator.com",
            address: "3rd Floor, R&R Tower, Plot F 298, Phase 8B, Industrial Area, Sector 74, Sahibzada Ajit Singh Nagar, Punjab 140307"
        },
        social: {
            instagram: "https://www.instagram.com/eternal_elevator/",
            pinterest: "https://in.pinterest.com/eternalelevator/",
            twitter: "https://x.com/et_elevator",
            facebook: "https://www.facebook.com/people/Eternal-Elevator-Pvt-Ltd/61562585987541/"
        },
        blogs: [
            {
                id: "seo-trends-2026",
                title: "SEO Trends to Watch in 2026",
                description: "Practical SEO updates to help your website rank higher and convert better.",
                content: "SEO in 2026 is less about isolated keywords and more about overall topic authority and usefulness.",
                date: "March 08, 2026",
                author: "Eternal Elevator",
                image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=700&q=70",
                link: "blogs/seo-trends-2026.html"
            },
            {
                id: "social-content-strategy",
                title: "How to Build a Better Social Content Strategy",
                description: "Simple framework to maintain consistency and improve audience engagement.",
                content: "Build a practical monthly calendar around 3 to 5 content pillars.",
                date: "March 08, 2026",
                author: "Eternal Elevator",
                image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=700&q=70",
                link: "blogs/social-content-strategy.html"
            },
            {
                id: "paid-ads-roi",
                title: "Paid Ads: Reduce Cost and Increase ROI",
                description: "Discover campaign structure tips that help lower cost-per-lead and scale results.",
                content: "Use stronger message match across ad headline, copy, and landing page.",
                date: "March 08, 2026",
                author: "Eternal Elevator",
                image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=700&q=70",
                link: "blogs/paid-ads-roi.html"
            },
            {
                id: "marketing-kpis",
                title: "Track Marketing KPIs That Matter",
                description: "Focus on the right metrics to improve campaign quality and business growth.",
                content: "Prioritize KPIs tied to outcomes: conversion rate, CAC, and customer lifetime value.",
                date: "March 08, 2026",
                author: "Eternal Elevator",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=700&q=70",
                link: "blogs/marketing-kpis.html"
            },
            {
                id: "full-funnel-plan",
                title: "How to Build a Full-Funnel Marketing Plan",
                description: "A practical full-funnel blueprint to turn visibility into qualified leads and sales.",
                content: "A full-funnel plan aligns content, channels, and offers with each customer stage.",
                date: "March 08, 2026",
                author: "Eternal Elevator",
                image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&q=70",
                link: "blogs/full-funnel-plan.html"
            },
            {
                id: "ecommerce-growth-levers",
                title: "E-commerce Growth Levers for Better Conversions",
                description: "Improve checkout performance, retention, and order value with tested tactics.",
                content: "Optimize product pages, reduce checkout friction, and improve retention loops.",
                date: "March 08, 2026",
                author: "Eternal Elevator",
                image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=700&q=70",
                link: "blogs/ecommerce-growth-levers.html"
            }
        ],
        reviews: [
            {
                id: "r1",
                clientName: "Commerceverse Team",
                projectTitle: "PPC Commerceverse",
                stars: 5,
                rating: "5.0",
                dateRange: "Mar 5, 2025 - Feb 26, 2026",
                review: "Client review: \"Feedback not shared publicly for this contract.\"",
                response: "Thanks for the honest feedback. Keep me posted with the NEW assignment."
            },
            {
                id: "r2",
                clientName: "Testing Client",
                projectTitle: "Testing",
                stars: 5,
                rating: "5.0",
                dateRange: "Feb 23, 2026 - Feb 26, 2026",
                review: "Excellent communication and great results",
                response: "Pleasure working with you."
            },
            {
                id: "r3",
                clientName: "Operations Client",
                projectTitle: "E-commerce Growth & Operations Manager",
                stars: 5,
                rating: "5.0",
                dateRange: "Nov 21, 2025 - Jan 25, 2026",
                review: "Does solid work overall",
                response: "Learned so much from you - wish you the best for the future."
            },
            {
                id: "r4",
                clientName: "Amazon Store Client",
                projectTitle: "Amazon Freelancer - Manage Amazon Store",
                stars: 5,
                rating: "5.0",
                dateRange: "Jan 12, 2026 - Jan 16, 2026",
                review: "Client review: \"Feedback not shared publicly for this contract.\"",
                response: "Thank you for the opportunity to support your Amazon store."
            },
            {
                id: "r5",
                clientName: "Amazon Management Client",
                projectTitle: "Amazon Management",
                stars: 5,
                rating: "5.0",
                dateRange: "Jun 2, 2025 - Jan 12, 2026",
                review: "Client review: \"Consistent delivery and dependable communication throughout the project.\"",
                response: "Thanks and looking forward."
            },
            {
                id: "r6",
                clientName: "Swiss Market Client",
                projectTitle: "Experienced Amazon Specialist for Swiss Market",
                stars: 5,
                rating: "5.0",
                dateRange: "Sep 29, 2023 - Jan 8, 2026",
                review: "Very reliable, good craftsmanship, very satisfied",
                response: "Thanks and looking forward to working with you again."
            }
        ],
        messages: [],
        messageSeenTimestamp: 0,
        updatedAt: new Date().toISOString()
    };

    function hashPassword(input) {
        const text = String(input || "");
        let hash = 5381;
        for (let index = 0; index < text.length; index += 1) {
            hash = (hash * 33) ^ text.charCodeAt(index);
        }
        return (hash >>> 0).toString(16);
    }

    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function ensureDefaults(data) {
        const merged = clone(defaultData);
        Object.assign(merged, data || {});
        merged.admin = Object.assign({}, defaultData.admin, data?.admin || {});
        merged.contact = Object.assign({}, defaultData.contact, data?.contact || {});
        merged.social = Object.assign({}, defaultData.social, data?.social || {});
        merged.stats = Array.isArray(data?.stats) && data.stats.length > 0 ? data.stats : clone(defaultData.stats);
        merged.blogs = Array.isArray(data?.blogs) && data.blogs.length > 0 ? data.blogs : clone(defaultData.blogs);
        merged.reviews = Array.isArray(data?.reviews) && data.reviews.length > 0 ? data.reviews : clone(defaultData.reviews);
        merged.messages = Array.isArray(data?.messages) ? data.messages : [];
        if (!merged.admin.passwordHash) {
            merged.admin.passwordHash = hashPassword("Admin@123");
        }
        return merged;
    }

    function getData() {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            const seeded = ensureDefaults({});
            saveData(seeded);
            return seeded;
        }
        try {
            return ensureDefaults(JSON.parse(raw));
        } catch (_error) {
            const fallback = ensureDefaults({});
            saveData(fallback);
            return fallback;
        }
    }

    function saveData(payload) {
        const next = ensureDefaults(payload);
        next.updatedAt = new Date().toISOString();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
    }

    function createSession() {
        const value = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
        window.sessionStorage.setItem(SESSION_KEY, value);
    }

    function clearSession() {
        window.sessionStorage.removeItem(SESSION_KEY);
    }

    function isAuthenticated() {
        return Boolean(window.sessionStorage.getItem(SESSION_KEY));
    }

    function login(email, password) {
        const data = getData();
        const emailOk = String(email || "").trim().toLowerCase() === String(data.admin.email || "").trim().toLowerCase();
        const passwordOk = hashPassword(password) === data.admin.passwordHash;
        if (emailOk && passwordOk) {
            createSession();
            return true;
        }
        return false;
    }

    function changePassword(oldPassword, newPassword) {
        const data = getData();
        const oldOk = hashPassword(oldPassword) === data.admin.passwordHash;
        if (!oldOk) {
            return { ok: false, message: "Incorrect old password" };
        }
        data.admin.passwordHash = hashPassword(newPassword);
        saveData(data);
        return { ok: true, message: "Password changed successfully" };
    }

    function downloadMessagesCsv(fileName) {
        const data = getData();
        const rows = data.messages || [];
        const headers = ["Name", "Email", "Phone", "Message", "Date"];
        const csvRows = [headers.join(",")];

        rows.forEach((row) => {
            const values = [row.name, row.email, row.phone, row.message, row.date].map((field) => {
                const text = String(field || "").replace(/"/g, '""');
                return `"${text}"`;
            });
            csvRows.push(values.join(","));
        });

        const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName || "contact-messages.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    window.SiteData = {
        getData,
        saveData,
        login,
        clearSession,
        isAuthenticated,
        changePassword,
        downloadMessagesCsv,
        hashPassword,
        STORAGE_KEY,
        SESSION_KEY
    };
})();
