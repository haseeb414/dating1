/* script.js
 - Form behavior:
   - Optional EmailJS: add your USER_ID, SERVICE_ID, TEMPLATE_ID below
   - If EmailJS is not configured, fallback to mailto: (opens user's mail client)
 - WhatsApp links open with prefilled message
*/

// Configuration: optional EmailJS IDs (replace to enable)
const EMAILJS_USER_ID = "YOUR_EMAILJS_USER_ID"; // e.g. user_xxx
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";  // e.g. service_xxx
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // e.g. template_xxx

document.addEventListener("DOMContentLoaded", function () {
  // Set current year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // WhatsApp links
  const message = encodeURIComponent("I want to grow my business with your agency");
  const wa1 = `https://wa.me/923260203301?text=${message}`;
  const wa2 = `https://wa.me/923257723652?text=${message}`;
  const waTop = document.getElementById("waTop");
  const waHero = document.getElementById("waHero");
  const wa1El = document.getElementById("wa1");
  const wa2El = document.getElementById("wa2");
  if (waTop) waTop.href = wa1;
  if (waHero) waHero.href = wa1;
  if (wa1El) wa1El.href = wa1;
  if (wa2El) wa2El.href = wa2;

  // Form handling
  const form = document.getElementById("briefForm");
  const statusEl = document.getElementById("formStatus");
  const mailtoDirect = document.getElementById("mailtoDirect");

  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    statusEl.textContent = "";
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const budget = document.getElementById("budget").value.trim();
    const brief = document.getElementById("brief").value.trim();

    // Basic validation
    if (!name || !email) {
      statusEl.style.color = "red";
      statusEl.textContent = "Please add your name and email.";
      return;
    }

    // If EmailJS IDs are placeholders, use mailto fallback
    const emailjsNotConfigured = EMAILJS_USER_ID === "YOUR_EMAILJS_USER_ID" || !EMAILJS_USER_ID;

    if (emailjsNotConfigured) {
      // Use a safe mailto with encoded body and newlines
      const to = "trendhive1121@gmail.com";
      const subject = encodeURIComponent("New lead — TrendHive website");
      const bodyLines = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Daily budget (USD): ${budget}`,
        `Brief: ${brief}`
      ];
      // join with CRLF then encode
      const body = encodeURIComponent(bodyLines.join("\r\n"));
      const mailto = `mailto:${to}?subject=${subject}&body=${body}`;
      // Open mailto in same tab to trigger email client
      window.location.href = mailto;
      statusEl.style.color = "green";
      statusEl.textContent = "Opening your mail client... please send the email to complete.";
      return;
    }

    // If you want EmailJS client-side send, a minimal example is below.
    // Note: To use EmailJS you must include their client script or use their official SDK.
    try {
      statusEl.style.color = "black";
      statusEl.textContent = "Sending...";
      // Lazy-load EmailJS script
      if (!window.emailjs) {
        await loadScript("https://cdn.emailjs.com/sdk/2.3.2/email.min.js");
      }
      // initialize
      window.emailjs.init(EMAILJS_USER_ID);
      const templateParams = {
        from_name: name,
        from_email: email,
        from_phone: phone,
        budget_usd: budget,
        project_brief: brief,
        to_email: "trendhive1121@gmail.com"
      };
      const result = await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      console.log("EmailJS send result", result);
      statusEl.style.color = "green";
      statusEl.textContent = "Thanks — your brief was sent.";
      form.reset();
    } catch (err) {
      console.error(err);
      statusEl.style.color = "red";
      statusEl.textContent = "Sorry — something went wrong sending your brief.";
    }
  });
});

// tiny helper to load script
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve(true);
    s.onerror = () => reject(new Error("Failed to load script: " + src));
    document.head.appendChild(s);
  });
}
