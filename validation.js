// ---------------------------------------------------------------------
// Server-side validation.
//
// This mirrors the checks the browser already does in public/js/app.js,
// but runs again here because client-side JavaScript can always be
// skipped (JS disabled, a hand-written fetch() call, curl, Postman...).
// The server must never trust data coming from the client, so every
// field is re-checked before anything is written to disk.
// ---------------------------------------------------------------------

// "HTML, CSS" -> ["HTML", "CSS"] (trim, drop empty/duplicate values)
// Accepts either a comma-separated string or an array of strings.
function toList(value) {
    if (Array.isArray(value)) {
        value = value.join(",");
    }
    if (value === undefined || value === null) {
        value = "";
    }
    const parts = String(value).split(",");
    const list = [];
    for (let i = 0; i < parts.length; i++) {
        const word = parts[i].trim();
        if (word !== "" && list.indexOf(word) === -1) {
            list.push(word);
        }
    }
    return list;
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
    if (typeof text !== "string" || text.length !== 10) {
        return false;
    }
    const parts = text.split("-");
    if (parts.length !== 3) {
        return false;
    }
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
        return false;
    }
    const d = new Date(year, month - 1, day);
    return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}

function str(value) {
    return typeof value === "string" ? value.trim() : "";
}

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB per photo/file (decoded size)
const MAX_FILES_PER_FIELD = 10;

// A data URL looks like "data:<mime>;base64,<data>". Estimate the decoded
// byte size from the base64 length, without actually decoding it.
function dataUrlSizeBytes(dataUrl) {
    const commaIndex = dataUrl.indexOf(",");
    if (commaIndex === -1) {
        return Infinity;
    }
    const base64 = dataUrl.slice(commaIndex + 1);
    return Math.floor((base64.length * 3) / 4);
}

// Validate an uploaded photos/files list: [{ name, dataUrl }, ...]
function validateFileList(list, fieldName, errors) {
    if (list === undefined || list === null || list === "") {
        return [];
    }
    if (!Array.isArray(list)) {
        errors[fieldName] = "Invalid upload data.";
        return [];
    }
    if (list.length > MAX_FILES_PER_FIELD) {
        errors[fieldName] = "Too many files (max " + MAX_FILES_PER_FIELD + ").";
        return [];
    }
    const cleaned = [];
    for (let i = 0; i < list.length; i++) {
        const entry = list[i];
        if (!entry || typeof entry.name !== "string" || typeof entry.dataUrl !== "string" || entry.dataUrl.indexOf("data:") !== 0) {
            errors[fieldName] = "Invalid upload data.";
            return [];
        }
        if (dataUrlSizeBytes(entry.dataUrl) > MAX_FILE_BYTES) {
            errors[fieldName] = '"' + entry.name + '" is larger than 5MB.';
            return [];
        }
        cleaned.push({ name: entry.name, dataUrl: entry.dataUrl });
    }
    return cleaned;
}

// Validate one "create portfolio item" submission.
// Returns { valid, errors, cleaned }.
//   errors  - { fieldName: "message" } for every field that failed
//   cleaned - trimmed/normalized values, safe to save when valid === true
function validatePortfolioItem(body) {
    body = body || {};
    const errors = {};

    const displayName = str(body.displayName);
    const whatIEnjoy = str(body.whatIEnjoy);
    const whatIveTried = str(body.whatIveTried);
    const whatImCuriousAbout = str(body.whatImCuriousAbout);
    const title = str(body.title);
    const type = str(body.type);
    const date = str(body.date);
    const role = str(body.role);
    const description = str(body.description);
    const whatIDid = str(body.whatIDid);
    const whatILearned = str(body.whatILearned);
    const challenge = str(body.challenge);
    const nextStep = str(body.nextStep);

    const required = [
        ["displayName", displayName, "Please enter a display name."],
        ["whatIEnjoy", whatIEnjoy, "Please tell us what you enjoy."],
        ["whatIveTried", whatIveTried, "Please tell us what you've tried."],
        ["whatImCuriousAbout", whatImCuriousAbout, "Please tell us what you are curious about."],
        ["title", title, "Please enter a title."],
        ["type", type, "Please select a type."],
        ["date", date, "Please select a date."],
        ["role", role, "Please enter your role."],
        ["description", description, "Please describe what you did."],
        ["whatIDid", whatIDid, "Please fill in what you did."],
        ["whatILearned", whatILearned, "Please fill in what you learned."],
        ["challenge", challenge, "Please fill in the challenge you faced."],
        ["nextStep", nextStep, "Please fill in your next step."]
    ];

    for (let i = 0; i < required.length; i++) {
        if (required[i][1] === "") {
            errors[required[i][0]] = required[i][2];
        }
    }

    if (date !== "" && !isValidDate(date)) {
        errors.date = "Invalid date. Please use the format YYYY-MM-DD.";
    }

    const skills = toList(body.skills);
    if (skills.length === 0) {
        errors.skills = "Please enter at least one skill, e.g. HTML, CSS.";
    }

    const evidence = toList(body.evidence);
    if (evidence.length === 0) {
        errors.evidence = "Please add at least one evidence link.";
    } else {
        for (let i = 0; i < evidence.length; i++) {
            if (!isValidUrl(evidence[i])) {
                errors.evidence = '"' + evidence[i] + '" is not a valid link. It must start with http:// or https:// (separate links with a comma).';
                break;
            }
        }
    }

    const photos = validateFileList(body.photos, "photos", errors);
    const files = validateFileList(body.files, "files", errors);

    const valid = Object.keys(errors).length === 0;

    return {
        valid: valid,
        errors: errors,
        cleaned: {
            displayName: displayName,
            whatIEnjoy: whatIEnjoy,
            whatIveTried: whatIveTried,
            whatImCuriousAbout: whatImCuriousAbout,
            title: title,
            type: type,
            date: date,
            role: role,
            description: description,
            whatIDid: whatIDid,
            whatILearned: whatILearned,
            challenge: challenge,
            nextStep: nextStep,
            skills: skills,
            evidence: evidence,
            photos: photos,
            files: files
        }
    };
}

module.exports = {
    toList: toList,
    isValidUrl: isValidUrl,
    isValidDate: isValidDate,
    validatePortfolioItem: validatePortfolioItem
};
