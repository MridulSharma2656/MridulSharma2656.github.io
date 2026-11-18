// Render one word at a time, matching the row order and letter spacing in Java.
function renderWord(word) {
  const rows = [];
  for (let row = 0; row < 5; row++) {
    const letters = Array.from(word, character => glyphs[character][row]);
    rows.push(letters.join("   ").trimEnd());
  }
  return rows.join("\n");
}

const form = document.querySelector("#generator");
const field = document.querySelector("#pattern-input");
const output = document.querySelector("#pattern-output");
const statusText = document.querySelector("#pattern-status");
const renderedLabel = document.querySelector("#rendered-label");

function drawPattern(text) {
  const words = text.trim().toUpperCase().split(/ +/);
  const label = words.join(" ");
  output.textContent = words.map(renderWord).join("\n\n");
  output.setAttribute("aria-label", "Star pattern for " + label);
  renderedLabel.textContent = label;
}

field.addEventListener("input", () => field.setCustomValidity(""));
form.addEventListener("submit", event => {
  event.preventDefault();
  const input = field.value;
  if (!input.trim() || !/^[a-zA-Z0-9 ]{1,32}$/.test(input)) {
    field.setCustomValidity("Enter at least one letter or digit. Use only A–Z, 0–9, and spaces.");
    field.reportValidity();
    return;
  }
  drawPattern(input);
  statusText.textContent = "Rendered " + renderedLabel.textContent + ".";
});
drawPattern(field.value);

// Keep the desktop section index aligned with the visible reading position.
const sectionLinks = Array.from(document.querySelectorAll(".rail nav a"));
const sections = sectionLinks.map(link => document.querySelector(link.hash));
let scheduled = false;
function highlightSection() {
  const offset = Math.min(window.innerHeight / 3, 200);
  let active = 0;
  sections.forEach((section, index) => {
    if (section.getBoundingClientRect().top <= offset) active = index;
  });
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
    active = sections.length - 1;
  }
  sectionLinks.forEach((link, index) => {
    if (index === active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  scheduled = false;
}
function scheduleHighlight() {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(highlightSection);
  }
}
window.addEventListener("scroll", scheduleHighlight, { passive: true });
window.addEventListener("resize", scheduleHighlight);
highlightSection();
