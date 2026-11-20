// js/challenge.js - Challenge Exchange (import / export)
(function () {
  "use strict";

  
  async function loadOurChallenge() {
    const response = await fetch("challenge-export.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }
    return JSON.parse(await response.text());
  }

  function downloadChallenge(challenge) {
    const text = JSON.stringify(challenge, null, 2);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = challenge.id + ".json";
    a.click();
    URL.revokeObjectURL(url);
  }

  // ---------- Error messages ----------
  function clearErrors() {
    const box = document.querySelector("#challenge-errors");
    box.classList.add("d-none");
    box.replaceChildren();
  }

  function showErrors(messages, heading) {
    const box = document.querySelector("#challenge-errors");
    box.replaceChildren();
    const intro = document.createElement("strong");
    intro.textContent = heading || "This challenge could not be imported:";
    const list = document.createElement("ul");
    list.className = "mb-0";
    messages.forEach(function (m) {
      const li = document.createElement("li");
      li.textContent = m;
      list.appendChild(li);
    });
    box.append(intro, list);
    box.classList.remove("d-none");
  }

  // ---------- Validation (Common Challenge Contract) ----------
  function validateChallenge(c) {
    const errors = [];

    if (typeof c !== "object" || c === null || Array.isArray(c)) {
      return ["The file must contain a single challenge object."];
    }

    const isText = function (v) {
      return typeof v === "string" && v.trim() !== "";
    };
    const isTextList = function (v) {
      return Array.isArray(v) && v.every(function (x) { return typeof x === "string"; });
    };

    if (c.schemaVersion !== "1.0") errors.push('schemaVersion must be "1.0".');
    if (!isText(c.id)) errors.push("id is missing or not text.");
    if (!isText(c.creatorGroup)) errors.push("creatorGroup is missing or not text.");
    if (!isText(c.title)) errors.push("title is missing or not text.");
    if (!isText(c.description)) errors.push("description is missing or not text.");

    if (!["discover", "mix", "levelup"].includes(c.category)) {
      errors.push("category must be discover, mix or levelup.");
    }

    if (!isTextList(c.instructions) || c.instructions.length < 1) {
      errors.push("instructions must be a list of text with at least 1 step.");
    }

    if (typeof c.estimatedMinutes !== "number" ||
        c.estimatedMinutes < 5 || c.estimatedMinutes > 10) {
      errors.push("estimatedMinutes must be a number from 5 to 10.");
    }

    if (!isText(c.evidencePrompt)) errors.push("evidencePrompt is missing or not text.");

    // tags may be empty; a missing tags field is also accepted so that
    // files from other groups don't fail on it. Unknown extra fields are ignored.
    if (c.tags !== undefined && !isTextList(c.tags)) {
      errors.push("tags must be a list of text.");
    }

    return errors;
  }

  // ---------- Display ----------
  
  function showChallenge(c) {
    const box = document.querySelector("#challenge-view");
    box.replaceChildren();

    const card = document.createElement("div");
    card.className = "card shadow-sm";
    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h3");
    title.className = "h5 card-title";
    title.textContent = c.title;

    const meta = document.createElement("p");
    meta.className = "text-body-secondary small";
    meta.textContent = c.category + " \u00B7 about " + c.estimatedMinutes +
      " min \u00B7 by " + c.creatorGroup;

    const desc = document.createElement("p");
    desc.textContent = c.description;

    const stepsTitle = document.createElement("h4");
    stepsTitle.className = "h6";
    stepsTitle.textContent = "Instructions";
    const steps = document.createElement("ol");
    c.instructions.forEach(function (step) {
      const li = document.createElement("li");
      li.textContent = step;
      steps.appendChild(li);
    });

    const evidenceTitle = document.createElement("h4");
    evidenceTitle.className = "h6";
    evidenceTitle.textContent = "Evidence to record";
    const evidence = document.createElement("p");
    evidence.className = "mb-0";
    evidence.textContent = c.evidencePrompt;

    body.append(title, meta, desc, stepsTitle, steps, evidenceTitle, evidence);

    if (Array.isArray(c.tags) && c.tags.length > 0) {
      const tags = document.createElement("div");
      tags.className = "mt-3";
      c.tags.forEach(function (t) {
        const badge = document.createElement("span");
        badge.className = "badge text-bg-secondary me-1";
        badge.textContent = t;
        tags.appendChild(badge);
      });
      body.appendChild(tags);
    }

    card.appendChild(body);
    box.appendChild(card);
  }

  // ---------- Wire up the page ----------
  document.querySelector("#export-challenge-btn").addEventListener("click", async function () {
    clearErrors();

    let ours;
    try {
      ours = await loadOurChallenge();
    } catch (err) {
      showErrors([
        "Could not read challenge.json. Make sure the file exists and is valid JSON.",
        "Open the site through Live Server or the server, not by double-clicking index.html."
      ], "Could not export our challenge:");
      return;
    }

    const problems = validateChallenge(ours);
    if (problems.length > 0) {
      showErrors(problems, "Our challenge.json does not match the contract:");
      return;
    }

    downloadChallenge(ours);
  });

  document.querySelector("#challenge-file").addEventListener("change", async function (e) {
    const file = e.target.files[0];
    if (!file) return;
    clearErrors();

    let challenge;
    try {
      challenge = JSON.parse(await file.text());
    } catch (err) {
      showErrors(["This file is not valid JSON."]);
      e.target.value = "";
      return;
    }

    const errors = validateChallenge(challenge);
    if (errors.length > 0) {
      showErrors(errors);
    } else {
      showChallenge(challenge);
    }
    e.target.value = ""; 
  });
})();
