(function () {

    const API = window.CONFIG.API_BASE_URL;

    function renderContact(data) {
        document.getElementById("contactPhoneDisplay").textContent =
            data.phone || "N/A";

        document.getElementById("contactEmailDisplay").textContent =
            data.email || "N/A";

        document.getElementById("contactAddressDisplay").textContent =
            data.address || "N/A";
    }

    async function loadContact() {
        try {
            const res = await fetch(`${API}/contact`);
            if (!res.ok) throw new Error();

            const data = await res.json();
            renderContact(data);

        } catch (err) {
            console.error("Error loading contact:", err);
        }
    }

    document.addEventListener("DOMContentLoaded", loadContact);

})();