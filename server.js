// ---------------------------------------------------------------------
// Personal Learning Portfolio - Backend Server
//
// Responsibilities (CS100 POWER UP - Backend Developer role):
//   1. Receive portfolio data from the frontend (JS fetch() POST) and
//      save it to a JSON file on the server (works the same on a local
//      machine or on an EC2 instance).
//   2. Re-validate every field on the server before saving anything -
//      never trust data that only passed the browser's own JS checks.
//   3. Keep the JSON data file OUTSIDE the public/ folder, so it can
//      never be fetched directly by typing its URL in a browser.
// ---------------------------------------------------------------------

const express = require("express");
const path = require("path");
const fs = require("fs");
const { validatePortfolioItem } = require("./validation");

const app = express();
const PORT = process.env.PORT || 3000;

const PUBLIC_DIR = path.join(__dirname, "public");

// --- Hidden data store -------------------------------------------------
// data/ is a SIBLING of public/, not a subfolder of it. Only this server
// process (via fs) can read/write it. Because express.static() below only
// ever serves files under PUBLIC_DIR, there is no URL - not
// "/data/portfolios.json", not "/../data/portfolios.json" - that a
// browser can use to reach this file directly.
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "portfolios.json");


function seedFromSampleFiles() {
    // First run on a fresh machine (e.g. a brand new EC2 instance): seed
    // the hidden data file from the sample JSON files committed to the
    // repo, so the demo has something to show immediately.
    const seeds = {
        portfolio_1: path.join(__dirname, "sample-portfolio-1.json"),
        portfolio_2: path.join(__dirname, "sample-portfolio-2.json")
    };
    const portfolios = {};
    for (const id of Object.keys(seeds)) {
        try {
            const text = fs.readFileSync(seeds[id], "utf8");
            portfolios[id] = JSON.parse(text);
        } catch (error) {
            // No sample file (or it's invalid) - just start empty for this id.
        }
    }
    return portfolios;
}

function ensureDataFile() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(seedFromSampleFiles(), null, 2), "utf8");
    }
}

function loadPortfolios() {
    ensureDataFile();
    try {
        const text = fs.readFileSync(DATA_FILE, "utf8");
        return JSON.parse(text);
    } catch (error) {
        console.error("Could not read portfolios.json, starting from an empty object:", error.message);
        return {};
    }
}

function savePortfolios(portfolios) {
    ensureDataFile();
    // Write to a temp file first, then rename over the real file. If the
    // process crashes mid-write, the original data file is never left
    // half-written/corrupted.
    const tempFile = DATA_FILE + ".tmp";
    fs.writeFileSync(tempFile, JSON.stringify(portfolios, null, 2), "utf8");
    fs.renameSync(tempFile, DATA_FILE);
}

// --- Middleware ----------------------------------------------------------

// Parse JSON bodies. Raised above the 100kb default because photos/files
// are sent as base64 data URLs inside the JSON body.
app.use(express.json({ limit: "20mb" }));

// Serve the frontend (index.html, css/, js/). This is the ONLY folder
// exposed to the browser - data/, server.js, validation.js, package.json
// etc. all live outside it and are never served.
app.use(express.static(PUBLIC_DIR));

// --- API routes ------------------------------------------------------

// GET /api/portfolios
// Returns every saved portfolio so the frontend can render the
// "View Portfolio" section after loading the page.
app.get("/api/portfolios", (req, res) => {
    const portfolios = loadPortfolios();
    res.json({ ok: true, portfolios: portfolios });
});

// POST /api/portfolios
// Creates a new portfolio profile.
app.post("/api/portfolios", (req, res) => {
    const data = req.body;

    // Validate the profile fields
    const errors = {};

    if (!data.displayName || !data.displayName.trim()) {
        errors.displayName = "Please enter a display name.";
    }
    if (!data.whatIEnjoy || !data.whatIEnjoy.trim()) {
        errors.whatIEnjoy = "Please tell us what you enjoy.";
    }
    if (!data.whatIveTried || !data.whatIveTried.trim()) {
        errors.whatIveTried = "Please tell us what you've tried.";
    }
    if (!data.whatImCuriousAbout || !data.whatImCuriousAbout.trim()) {
        errors.whatImCuriousAbout = "Please tell us what you are curious about.";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ ok: false, errors: errors });
    }

    const portfolios = loadPortfolios();

    // Generate the next available portfolio ID
    let number = 1;
    while (portfolios["portfolio_" + number]) {
        number++;
    }

    const id = "portfolio_" + number;

    const newPortfolio = {
        id: id,
        displayName: data.displayName.trim(),
        whatIEnjoy: data.whatIEnjoy.trim(),
        whatIveTried: data.whatIveTried.trim(),
        whatImCuriousAbout: data.whatImCuriousAbout.trim(),
        items: []
    };

    portfolios[id] = newPortfolio;

    try {
        savePortfolios(portfolios);
    } catch (error) {
        console.error("Could not save portfolios.json:", error.message);
        return res.status(500).json({
            ok: false,
            errors: { server: "Could not create the portfolio." }
        });
    }

    res.status(201).json({
        ok: true,
        portfolio: newPortfolio
    });
});

// POST /api/portfolios/:id/items
// Saves the profile fields + adds one new portfolio item.
// Body shape matches what public/js/app.js's readForm() produces.
app.post("/api/portfolios/:id/items", (req, res) => {
    const id = req.params.id;
    const portfolios = loadPortfolios();
    const existing = portfolios[id];

    if (!existing) {
        return res.status(404).json({
            ok: false,
            errors: { portfolio: "Portfolio not found." }
        });
    }

    // --- Server-side validation (defense in depth) ---
    // The browser already validated this data, but the server re-checks
    // everything from scratch: it never assumes a request came from our
    // own frontend or that the browser's JS actually ran.
    const result = validatePortfolioItem(req.body);
    if (result.valid === false) {
        return res.status(400).json({ ok: false, errors: result.errors });
    }
    const data = result.cleaned;

    const items = Array.isArray(existing.items) ? existing.items : [];

    const newItem = {
        id: "item" + String(items.length + 1).padStart(3, "0"),
        title: data.title,
        type: data.type,
        date: data.date,
        role: data.role,
        description: data.description,
        skills: data.skills,
        reflection: {
            whatIDid: data.whatIDid,
            whatILearned: data.whatILearned,
            challenge: data.challenge,
            nextStep: data.nextStep
        },
        evidence: data.evidence,
        photos: data.photos,
        files: data.files
    };

    items.push(newItem);

    portfolios[id] = {
        id: id,
        displayName: data.displayName,
        whatIEnjoy: data.whatIEnjoy,
        whatIveTried: data.whatIveTried,
        whatImCuriousAbout: data.whatImCuriousAbout,
        items: items
    };

    try {
        savePortfolios(portfolios);
    } catch (error) {
        console.error("Could not save portfolios.json:", error.message);
        return res.status(500).json({ ok: false, errors: { server: "Could not save data on the server. Please try again." } });
    }

    res.status(201).json({ ok: true, portfolio: portfolios[id] });
});

// POST /api/portfolios/:id/import
// Imports an external portfolio item JSON (copied from another booth/challenge)
app.post("/api/portfolios/:id/import", (req, res) => {
    const id = req.params.id;
    const portfolios = loadPortfolios();
    const existing = portfolios[id];

    if (!existing) {
        return res.status(404).json({
            ok: false,
            error: "Portfolio not found."
        });
    }

    const raw = req.body;
    if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
        return res.status(400).json({
            ok: false,
            error: "Invalid JSON format: expected an item object."
        });
    }

    // ตรวจสอบฟิลด์หลักที่จำเป็นของ Portfolio Item
    const requiredStrings = ["title", "type", "date", "role", "description"];
    for (const field of requiredStrings) {
        if (typeof raw[field] !== "string" || raw[field].trim() === "") {
            return res.status(400).json({
                ok: false,
                error: `Missing or invalid required field: ${field}`
            });
        }
    }

    // จัดรูปแบบ skills ให้เป็น Array ของข้อความเสมอ
    let skills = [];
    if (Array.isArray(raw.skills)) {
        skills = raw.skills.map(s => String(s).trim()).filter(Boolean);
    } else if (typeof raw.skills === "string") {
        skills = raw.skills.split(",").map(s => s.trim()).filter(Boolean);
    }

    // จัดรูปแบบ reflection (รองรับทั้งแบบ object ซ้อนด้านใน และแบบแยกฟิลด์)
    const ref = (typeof raw.reflection === "object" && raw.reflection !== null) ? raw.reflection : raw;
    const reflection = {
        whatIDid: typeof ref.whatIDid === "string" && ref.whatIDid.trim() ? ref.whatIDid.trim() : "-",
        whatILearned: typeof ref.whatILearned === "string" && ref.whatILearned.trim() ? ref.whatILearned.trim() : "-",
        challenge: typeof ref.challenge === "string" && ref.challenge.trim() ? ref.challenge.trim() : "-",
        nextStep: typeof ref.nextStep === "string" && ref.nextStep.trim() ? ref.nextStep.trim() : "-"
    };

    // จัดรูปแบบ evidence ให้เป็น Array ของลิงก์เสมอ
    let evidence = [];
    if (Array.isArray(raw.evidence)) {
        evidence = raw.evidence.map(e => String(e).trim()).filter(Boolean);
    } else if (typeof raw.evidence === "string") {
        evidence = raw.evidence.split(",").map(e => e.trim()).filter(Boolean);
    }

    const items = Array.isArray(existing.items) ? existing.items : [];

    const importedItem = {
        id: "item" + String(items.length + 1).padStart(3, "0"),
        title: raw.title.trim(),
        type: raw.type.trim(),
        date: raw.date.trim(),
        role: raw.role.trim(),
        description: raw.description.trim(),
        skills: skills,
        reflection: reflection,
        evidence: evidence,
        photos: Array.isArray(raw.photos) ? raw.photos : [],
        files: Array.isArray(raw.files) ? raw.files : []
    };

    items.push(importedItem);
    existing.items = items;
    portfolios[id] = existing;

    try {
        savePortfolios(portfolios);
    } catch (error) {
        console.error("Could not save imported item:", error.message);
        return res.status(500).json({
            ok: false,
            error: "Could not save imported item on the server."
        });
    }

    res.status(201).json({
        ok: true,
        portfolio: portfolios[id]
    });
});

app.listen(PORT, () => {
    console.log("Portfolio server running at http://localhost:" + PORT);
    console.log("Data file (hidden from the browser): " + DATA_FILE);
});
