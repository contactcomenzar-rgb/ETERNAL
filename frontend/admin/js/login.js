(function () {

    const API = window.CONFIG.API_BASE_URL;
    const form = document.getElementById("adminLoginForm");
    const errorEl = document.getElementById("loginError");

    // ✅ Redirect if already logged in
    const existingToken = localStorage.getItem("adminToken");
    if (existingToken) {
        window.location.href = "index.html";
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        errorEl.textContent = "";

        const email = document.getElementById("adminEmail").value.trim();
        const password = document.getElementById("adminPassword").value;

        if (!email || !password) {
            errorEl.textContent = "Please enter email and password.";
            return;
        }

        try {
            const res = await fetch(`${API}/admin/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            // ❌ Login failed
            if (!res.ok) {
                errorEl.textContent = data.message || "Invalid credentials";
                return;
            }

            // ✅ Save token
            localStorage.setItem("adminToken", data.token);

            // ✅ Save admin info (optional)
            if (data.admin) {
                localStorage.setItem("adminData", JSON.stringify(data.admin));
            }

            // ✅ Redirect to dashboard
            window.location.href = "index.html";

        } catch (err) {
            console.error("Login error:", err);
            errorEl.textContent = "Server error. Please try again.";
        }
    });

})();