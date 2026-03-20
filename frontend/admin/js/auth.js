// ✅ Get token
function getToken() {
    return localStorage.getItem("adminToken");
}

// ✅ Logout
function logout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    window.location.href = "login.html";
}

// ✅ Protected fetch (AUTO Bearer + AUTO logout)
async function authFetch(url, options = {}) {
    const token = getToken();

    if (!token) {
        logout();
        return;
    }

    const headers = {
        ...(options.headers || {}),
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
    };

    const res = await fetch(url, {
        ...options,
        headers
    });

    // 🔥 Auto logout if token invalid/expired
    if (res.status === 401) {
        logout();
        return;
    }

    return res;
}