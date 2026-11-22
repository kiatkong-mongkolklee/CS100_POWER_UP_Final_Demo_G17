const form = document.getElementById("portfolio-profile-form");
const createSelect = document.getElementById("portfolio-select");
const viewSelect = document.getElementById("view-portfolio-select");
const typeSelect = document.getElementById("item-type");
const otherType = document.getElementById("other-type");

form.noValidate = true;

// Show the "Other" input only when the type is "Other"
function toggleOtherType() {
    if (typeSelect.value === "Other") {
        otherType.classList.remove("d-none");
    } else {
        otherType.classList.add("d-none");
    }
}

typeSelect.addEventListener("change", toggleOtherType);

// Read one File into a data URL ({ name, dataUrl }) so it can be sent
// to the server as JSON and shown later as an <img> or a download link.
function readFile(file) {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function () {
            resolve({ name: file.name, dataUrl: reader.result });
        };
        reader.onerror = function () {
            reject(reader.error);
        };
        reader.readAsDataURL(file);
    });
}

// Read every selected file in a <input type="file"> into [{ name, dataUrl }]
async function readFilesAsDataUrls(input) {
    const files = [];
    for (let i = 0; i < input.files.length; i++) {
        files.push(await readFile(input.files[i]));
    }
    return files;
}

// Read every value from the form and return them in one object
async function readForm() {
    let type = typeSelect.value;
    if (type === "Other") {
        type = otherType.value.trim();
    }

    return {
        displayName: document.getElementById("profile-name").value.trim(),
        whatIEnjoy: document.getElementById("what-i-enjoy").value.trim(),
        whatIveTried: document.getElementById("what-ive-tried").value.trim(),
        whatImCuriousAbout: document.getElementById("what-curious").value.trim(),
        title: document.getElementById("item-title").value.trim(),
        type: type,
        date: document.getElementById("item-date").value,
        role: document.getElementById("item-role").value.trim(),
        description: document.getElementById("item-description").value.trim(),
        skills: document.getElementById("item-skills").value,
        whatIDid: document.getElementById("what-i-did").value.trim(),
        whatILearned: document.getElementById("what-i-learned").value.trim(),
        challenge: document.getElementById("challenge").value.trim(),
        nextStep: document.getElementById("next-step").value.trim(),
        evidence: document.getElementById("item-evidence").value,
        photos: await readFilesAsDataUrls(document.getElementById("item-photo")),
        files: await readFilesAsDataUrls(document.getElementById("item-file"))
    };
}

let toastTimer = null;

// Show a message box at the top (type = "danger" or "success")
function showMessage(text, type) {
    const box = document.getElementById("error-toast");
    box.textContent = text;
    box.className = "alert alert-" + type;
    box.classList.remove("d-none");
    box.scrollIntoView({ behavior: "smooth", block: "center" });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
        box.classList.add("d-none");
    }, 5000);
}

// Show a red border and an error message under the input
function setError(input, message) {
    input.classList.add("is-invalid");
    let feedback = input.parentElement.querySelector(".invalid-feedback");
    if (feedback === null) {
        feedback = document.createElement("div");
        feedback.className = "invalid-feedback";
        input.parentElement.appendChild(feedback);
    }
    feedback.textContent = message;
}

// Remove all red borders
function clearErrors() {
    const bad = form.querySelectorAll(".is-invalid");
    for (let i = 0; i < bad.length; i++) {
        bad[i].classList.remove("is-invalid");
    }
}

// Check that the text is a link starting with http:// or https://
function isValidUrl(text) {
    try {
        const url = new URL(text);
        const okProtocol = url.protocol === "http:" || url.protocol === "https:";
        return okProtocol && url.hostname.includes(".");
    } catch (error) {
        return false;
    }
}

// Check the date format YYYY-MM-DD and that the day really exists
// (for example 2026-02-31 is not allowed)
function isValidDate(text) {
    if (text.length !== 10) {
        return false;
    }
    const parts = text.split("-");
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);
    const d = new Date(year, month - 1, day);
    return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}

// "HTML, CSS" -> ["HTML", "CSS"]  (remove spaces, empty and duplicate values)
function toList(text) {
    const parts = text.split(",");
    const list = [];
    for (let i = 0; i < parts.length; i++) {
        const word = parts[i].trim();
        if (word !== "" && list.indexOf(word) === -1) {
            list.push(word);
        }
    }
    return list;
}

// Check the whole form on the CLIENT. This is only for a fast, friendly
// UI (instant red borders, no round trip). It is NOT the real security
// boundary - the server (server.js) repeats every one of these checks
// again before it ever writes to the data file, because anyone can call
// the API directly (curl, Postman, a browser with JS disabled) and skip
// this function entirely.

// Check only the profile fields when creating a new portfolio
function validateProfileForm() {
    clearErrors();
    let ok = true;

    const required = [
        ["profile-name", "Please enter a display name."],
        ["what-i-enjoy", "Please tell us what you enjoy."],
        ["what-ive-tried", "Please tell us what you've tried."],
        ["what-curious", "Please tell us what you are curious about."]
    ];

    for (let i = 0; i < required.length; i++) {
        const input = document.getElementById(required[i][0]);

        if (input.value.trim() === "") {
            setError(input, required[i][1]);
            ok = false;
        }
    }

    // Check for duplicate portfolio name
    const displayName = document.getElementById("profile-name").value.trim().toLowerCase();

    const duplicateName = Object.values(portfolios).some(function (portfolio) {
        return portfolio.displayName.trim().toLowerCase() === displayName;
    });

    if (duplicateName) {
        const input = document.getElementById("profile-name");
        setError(input, "A portfolio with this name already exists.");
        ok = false;
    }

    const firstError = form.querySelector(".is-invalid");

    if (firstError !== null) {
        firstError.focus();
    }

    return ok;
}

function validateForm() {
    clearErrors();
    let ok = true;

    const required = [
        ["profile-name", "Please enter a display name."],
        ["what-i-enjoy", "Please tell us what you enjoy."],
        ["what-ive-tried", "Please tell us what you've tried."],
        ["what-curious", "Please tell us what you are curious about."],
        ["item-title", "Please enter a title."],
        ["item-type", "Please select a type."],
        ["item-date", "Please select a date."],
        ["item-role", "Please enter your role."],
        ["item-description", "Please describe what you did."],
        ["item-skills", "Please enter at least one skill, e.g. HTML, CSS."],
        ["what-i-did", "Please fill in what you did."],
        ["what-i-learned", "Please fill in what you learned."],
        ["challenge", "Please fill in the challenge you faced."],
        ["next-step", "Please fill in your next step."],
        ["item-evidence", "Please add at least one evidence link."]
    ];

    for (let i = 0; i < required.length; i++) {
        const input = document.getElementById(required[i][0]);
        if (input.value.trim() === "") {
            setError(input, required[i][1]);
            ok = false;
        }
    }

    if (typeSelect.value === "Other" && otherType.value.trim() === "") {
        setError(otherType, "Please type your own type.");
        ok = false;
    }

    const dateInput = document.getElementById("item-date");
    if (dateInput.value !== "" && !isValidDate(dateInput.value)) {
        setError(dateInput, "Invalid date. Please use the format YYYY-MM-DD.");
        ok = false;
    }

    const evidenceInput = document.getElementById("item-evidence");
    const links = toList(evidenceInput.value);
    for (let i = 0; i < links.length; i++) {
        if (!isValidUrl(links[i])) {
            setError(evidenceInput, '"' + links[i] + '" is not a valid link. It must start with http:// or https:// (separate links with a comma).');
            ok = false;
            break;
        }
    }

    const firstError = form.querySelector(".is-invalid");
    if (firstError !== null) {
        firstError.focus();
    }
    return ok;
}

// When the user fixes an input, remove its red border
form.addEventListener("input", function (event) {
    event.target.classList.remove("is-invalid");
});
form.addEventListener("change", function (event) {
    event.target.classList.remove("is-invalid");
});

// The Clear button (type="reset"): hide "Other" and remove red borders
form.addEventListener("reset", function () {
    setTimeout(function () {
        toggleOtherType();
        clearErrors();
    }, 0);
});

// Map each field name the SERVER's error object can use back to the
// <input>/<select> it belongs to, so a validation error coming back
// from the API can be shown as a red border in exactly the same way
// validateForm() shows one.
const SERVER_FIELD_TO_INPUT_ID = {
    displayName: "profile-name",
    whatIEnjoy: "what-i-enjoy",
    whatIveTried: "what-ive-tried",
    whatImCuriousAbout: "what-curious",
    title: "item-title",
    type: "item-type",
    date: "item-date",
    role: "item-role",
    description: "item-description",
    skills: "item-skills",
    whatIDid: "what-i-did",
    whatILearned: "what-i-learned",
    challenge: "challenge",
    nextStep: "next-step",
    evidence: "item-evidence",
    photos: "item-photo",
    files: "item-file"
};

// Apply a { fieldName: "message" } object returned by the server onto
// the matching form inputs.
function applyServerErrors(errors) {
    clearErrors();
    let firstInput = null;
    for (const fieldName in errors) {
        const inputId = SERVER_FIELD_TO_INPUT_ID[fieldName];
        const input = inputId ? document.getElementById(inputId) : null;
        if (input !== null) {
            setError(input, errors[fieldName]);
            if (firstInput === null) {
                firstInput = input;
            }
        }
    }
    if (firstInput !== null) {
        firstInput.focus();
    }
}

// All portfolios the server has sent us, keyed by id ("portfolio_1", ...).
// This is a client-side CACHE of what is saved on the server - the real
// data lives in the hidden JSON file the server writes to, not here.
let portfolios = {};

// Generate options for portfolio dropdowns
function renderPortfolioDropdowns() {
    const importSelect = document.getElementById("import-portfolio-select");

    createSelect.innerHTML = '<option value="" disabled selected>Select Portfolio</option>';
    viewSelect.innerHTML = '<option value="" disabled selected>Select Portfolio</option>';
    if (importSelect) {
        importSelect.innerHTML = '<option value="" disabled selected>Select Portfolio</option>';
    }

    Object.keys(portfolios).forEach(id => {
        const portfolio = portfolios[id];

        const option1 = document.createElement("option");
        option1.value = id;
        option1.textContent = portfolio.displayName;

        const option2 = document.createElement("option");
        option2.value = id;
        option2.textContent = portfolio.displayName;

        createSelect.appendChild(option1);
        viewSelect.appendChild(option2);

        if (importSelect) {
            const option3 = document.createElement("option");
            option3.value = id;
            option3.textContent = portfolio.displayName;
            importSelect.appendChild(option3);
        }
    });
}

// GET /api/portfolios - load every portfolio from the server.
async function loadPortfolios() {
    try {
        const response = await fetch("/api/portfolios");
        const result = await response.json();

        portfolios = result.portfolios || {};
        renderPortfolioDropdowns();

    } catch (error) {
        portfolios = {};
        renderPortfolioDropdowns();

        showMessage("Could not reach the server to load saved portfolios. Showing an empty view.", "danger");
    }
}

// POST /api/portfolios - create a new portfolio profile
async function createPortfolio(data) {
    let response;

    try {
        response = await fetch("/api/portfolios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
    } catch (error) {
        showMessage("Could not reach the server. Please check your connection and try again.", "danger");
        return;
    }

    let result;

    try {
        result = await response.json();
    } catch (error) {
        showMessage("The server sent back an unexpected response.", "danger");
        return;
    }

    if (response.ok === false || result.ok === false) {
        applyServerErrors(result.errors || {});
        showMessage("Could not create the portfolio. Please check the highlighted fields.", "danger");
        return;
    }

    const id = result.portfolio.id;

    portfolios[id] = result.portfolio;

    renderPortfolioDropdowns();
    selectPortfolio(id);

    showMessage("Portfolio created successfully!", "success");
}

// Clear only the item inputs (keep the profile inputs)
function clearItemFields() {
    const fields = document.querySelectorAll("#item-section input, #item-section textarea, #item-section select");
    for (let i = 0; i < fields.length; i++) {
        if (fields[i].tagName === "SELECT") {
            fields[i].selectedIndex = 0;
        } else {
            fields[i].value = "";
        }
    }
    toggleOtherType();
}

// POST /api/portfolios/:id/items - send the profile + new item to the
// server with fetch(). The server re-validates everything, saves it to
// the hidden JSON file, and answers with JSON (never a full page reload,
// the URL never changes - we just read the JSON and update the page's
// textContent/innerHTML ourselves).
async function saveItem(data) {
    const id = createSelect.value;

    let response;
    try {
        response = await fetch("/api/portfolios/" + encodeURIComponent(id) + "/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
    } catch (error) {
        showMessage("Could not reach the server. Please check your connection and try again.", "danger");
        return;
    }

    let result;
    try {
        result = await response.json();
    } catch (error) {
        showMessage("The server sent back an unexpected response.", "danger");
        return;
    }

    if (response.ok === false || result.ok === false) {
        applyServerErrors(result.errors || {});
        showMessage("Please check the highlighted fields. Nothing was saved.", "danger");
        return;
    }

    portfolios[id] = result.portfolio;

    clearItemFields();
    renderView();
    showMessage("Portfolio saved!", "success");
}

const NO_INFO = "No information available.";
const emptyHtml = document.getElementById("view-items").innerHTML;

// Change special characters so user text cannot break our HTML
function esc(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Make the HTML card of one item
function itemCard(item) {
    const r = item.reflection;

    let skills = "";
    for (let i = 0; i < item.skills.length; i++) {
        skills += '<span class="badge text-bg-secondary skill-tag me-1">' + esc(item.skills[i]) + "</span>";
    }

    let links = "";
    for (let i = 0; i < item.evidence.length; i++) {
        const url = esc(item.evidence[i]);
        links += '<li><a href="' + url + '" target="_blank" rel="noopener noreferrer">' + url + "</a></li>";
    }

    let photos = "";
    for (let i = 0; i < item.photos.length; i++) {
        const photo = item.photos[i];
        photos += '<img src="' + esc(photo.dataUrl) + '" alt="' + esc(photo.name) + '" class="item-photo-thumb me-2 mb-2">';
    }
    if (photos !== "") {
        photos = '<h6 class="mt-3">Photos</h6><div class="d-flex flex-wrap">' + photos + "</div>";
    }

    let files = "";
    for (let i = 0; i < item.files.length; i++) {
        const file = item.files[i];
        files += '<li><a href="' + esc(file.dataUrl) + '" download="' + esc(file.name) + '">' + esc(file.name) + "</a></li>";
    }
    if (files !== "") {
        files = '<h6 class="mt-3">Files</h6><ul>' + files + "</ul>";
    }

    return `
        <div class="col-12 col-lg-6">
            <div class="card h-100 item-card">
                <div class="card-header"><h5 class="mb-0">${esc(item.title)}</h5></div>
                <div class="card-body">
                    <p class="text-body-secondary small">${esc(item.type)} · ${esc(item.date)} · ${esc(item.role)}</p>
                    <p>${esc(item.description)}</p>
                    <div class="mb-3">${skills}</div>
                    <p class="mb-1"><b>What I did:</b> ${esc(r.whatIDid)}</p>
                    <p class="mb-1"><b>What I learned:</b> ${esc(r.whatILearned)}</p>
                    <p class="mb-1"><b>Challenge:</b> ${esc(r.challenge)}</p>
                    <p class="mb-1"><b>Next step:</b> ${esc(r.nextStep)}</p>
                    <h6 class="mt-3">Evidence</h6>
                    <ul>${links}</ul>
                    ${photos}
                    ${files}
                </div>
            </div>
        </div>`;
}

// Show the selected portfolio in the "View" section
function renderView() {
    const p = portfolios[viewSelect.value];

    if (p === undefined) {
        document.getElementById("view-profile-name").textContent = "Portfolio Name";
        document.getElementById("view-enjoy").textContent = NO_INFO;
        document.getElementById("view-tried").textContent = NO_INFO;
        document.getElementById("view-curious").textContent = NO_INFO;
        document.getElementById("item-count").textContent = "0 Items";
        document.getElementById("view-items").innerHTML = emptyHtml;
        return;
    }

    document.getElementById("view-profile-name").textContent = p.displayName;
    document.getElementById("view-enjoy").textContent = p.whatIEnjoy;
    document.getElementById("view-tried").textContent = p.whatIveTried;
    document.getElementById("view-curious").textContent = p.whatImCuriousAbout;

    const count = p.items.length;
    if (count === 1) {
        document.getElementById("item-count").textContent = "1 Item";
    } else {
        document.getElementById("item-count").textContent = count + " Items";
    }

    if (count === 0) {
        document.getElementById("view-items").innerHTML = emptyHtml;
    } else {
        let html = "";
        for (let i = 0; i < p.items.length; i++) {
            html += itemCard(p.items[i]);
        }
        document.getElementById("view-items").innerHTML = html;
    }
}

// When the user picks a portfolio: fill the profile inputs, clear the item inputs
function selectPortfolio(id) {
    const p = portfolios[id];
    createSelect.value = id;
    viewSelect.value = id;

    if (p === undefined) {
        document.getElementById("profile-name").value = "";
        document.getElementById("what-i-enjoy").value = "";
        document.getElementById("what-ive-tried").value = "";
        document.getElementById("what-curious").value = "";
    } else {
        document.getElementById("profile-name").value = p.displayName;
        document.getElementById("what-i-enjoy").value = p.whatIEnjoy;
        document.getElementById("what-ive-tried").value = p.whatIveTried;
        document.getElementById("what-curious").value = p.whatImCuriousAbout;
    }

    clearItemFields();
    clearErrors();
    renderView();
}

createSelect.addEventListener("change", function () {
    selectPortfolio(createSelect.value);
});
viewSelect.addEventListener("change", function () {
    selectPortfolio(viewSelect.value);
});

// Create a new portfolio when the Create Portfolio button is clicked
const createPortfolioBtn = document.getElementById("create-portfolio-btn");

createPortfolioBtn.addEventListener("click", async function () {
    createPortfolioBtn.disabled = true;

    if (validateProfileForm() === false) {
        showMessage("Please check the highlighted profile fields.", "danger");
        createPortfolioBtn.disabled = false;
        return;
    }

    const data = {
        displayName: document.getElementById("profile-name").value.trim(),
        whatIEnjoy: document.getElementById("what-i-enjoy").value.trim(),
        whatIveTried: document.getElementById("what-ive-tried").value.trim(),
        whatImCuriousAbout: document.getElementById("what-curious").value.trim()
    };

    await createPortfolio(data);

    createPortfolioBtn.disabled = false;
});

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    if (createSelect.value === "") {
        showMessage("Please create or select a portfolio first.", "danger");
        submitBtn.disabled = false;
        return;
    }

    if (validateForm() === false) {
        showMessage("Please check the highlighted fields. Nothing was saved.", "danger");
        submitBtn.disabled = false;
        return;
    }

    const data = await readForm();
    await saveItem(data);

    submitBtn.disabled = false;
});

// Start-up: load whatever is already saved on the server, THEN render.
(async function init() {
    toggleOtherType();
    await loadPortfolios();

    selectPortfolio("");
})();

// ==========================================
// Export My Portfolio (.json)
// ==========================================
const exportPortfolioBtn = document.getElementById("export-portfolio-btn");
if (exportPortfolioBtn) {
    exportPortfolioBtn.addEventListener("click", function () {
        const id = viewSelect.value;
        const p = portfolios[id];

        if (!id || !p) {
            showMessage("Please select a portfolio in 'View Portfolio' first before exporting.", "danger");
            return;
        }

        const jsonText = JSON.stringify(p, null, 2);
        const blob = new Blob([jsonText], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "my-portfolio.json";
        a.click();
        URL.revokeObjectURL(url);

        showMessage("Exported " + p.displayName + " (my-portfolio.json) successfully!", "success");
    });
}

// ==========================================
// Import Portfolio Item from JSON (Paste)
// ==========================================
const importItemBtn = document.getElementById("import-item-btn");
if (importItemBtn) {
    importItemBtn.addEventListener("click", async function () {
        const textarea = document.getElementById("import-json-textarea");
        const importSelect = document.getElementById("import-portfolio-select");
        const rawText = textarea.value.trim();
        const portfolioId = importSelect.value;

        if (!portfolioId) {
            showMessage("Please select a target portfolio to import into.", "danger");
            return;
        }

        if (!rawText) {
            showMessage("Please paste the Item JSON code first.", "danger");
            return;
        }

        // 1. ตรวจสอบว่าเป็นรูปแบบ JSON ที่ถูกต้องไหม
        let parsedItem;
        try {
            parsedItem = JSON.parse(rawText);
        } catch (err) {
            showMessage("Invalid JSON format. Please check the pasted code and try again.", "danger");
            return;
        }

        // 2. ตรวจสอบ Fields พื้นฐานเบื้องต้น
        if (typeof parsedItem !== "object" || parsedItem === null || Array.isArray(parsedItem)) {
            showMessage("JSON must be a single item object.", "danger");
            return;
        }

        if (!parsedItem.title || !parsedItem.type || !parsedItem.date || !parsedItem.role || !parsedItem.description) {
            showMessage("Missing required fields (title, type, date, role, or description).", "danger");
            return;
        }

        // 3. ส่งข้อมูลไปให้ Backend บันทึกลงไฟล์
        importItemBtn.disabled = true;
        try {
            const response = await fetch("/api/portfolios/" + encodeURIComponent(portfolioId) + "/import", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsedItem)
            });

            const result = await response.json();

            if (!response.ok || result.ok === false) {
                showMessage(result.error || "Server rejected the imported item.", "danger");
                importItemBtn.disabled = false;
                return;
            }

            // อัปเดตข้อมูลหน้าเว็บและแสดงผลทันที
            portfolios[portfolioId] = result.portfolio;
            textarea.value = "";
            selectPortfolio(portfolioId);
            showMessage("Imported item into portfolio successfully!", "success");

        } catch (error) {
            showMessage("Could not reach the server to import item.", "danger");
        }
        importItemBtn.disabled = false;
    });
}