/**
 * Subject PDF Portal - Application Logic
 */

// Subject Data based on workspace PDF files
const SUBJECTS = [
  {
    id: "cv-ip",
    code: "CV & IP",
    title: "Computer Vision & Image Processing",
    filename: "CV & IP WEEK PROGRAMS (1).pdf",
    filesize: "24.1 KB",
    description: "Weekly practical programs covering image filtering, edge detection, spatial transformations, and feature analysis.",
    iconColor: "#4f46e5",
    accentLight: "rgba(79, 70, 229, 0.12)",
    iconSvg: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>`
  },
  {
    id: "os-sp",
    code: "OS & SP",
    title: "Operating Systems & System Programming",
    filename: "OS&SP Programs.pdf",
    filesize: "38.0 KB",
    description: "Comprehensive programs on process scheduling algorithms, inter-process communication, memory allocation, and POSIX threads.",
    iconColor: "#0284c7",
    accentLight: "rgba(2, 132, 199, 0.12)",
    iconSvg: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2"></rect>
      <rect x="9" y="9" width="6" height="6"></rect>
      <line x1="9" y1="1" x2="9" y2="4"></line>
      <line x1="15" y1="1" x2="15" y2="4"></line>
      <line x1="9" y1="20" x2="9" y2="23"></line>
      <line x1="15" y1="20" x2="15" y2="23"></line>
      <line x1="20" y1="9" x2="23" y2="9"></line>
      <line x1="20" y1="14" x2="23" y2="14"></line>
      <line x1="1" y1="9" x2="4" y2="9"></line>
      <line x1="1" y1="14" x2="4" y2="14"></line>
    </svg>`
  },
  {
    id: "nlp",
    code: "NLP",
    title: "Natural Language Processing",
    filename: "nlp.pdf",
    filesize: "39.6 KB",
    description: "Lab exercises and implementations for tokenization, stemming, POS tagging, N-gram modeling, and text processing pipelines.",
    iconColor: "#7c3aed",
    accentLight: "rgba(124, 58, 237, 0.12)",
    iconSvg: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      <line x1="8" y1="9" x2="16" y2="9"></line>
      <line x1="8" y1="13" x2="13" y2="13"></line>
    </svg>`
  }
];

// State
let currentSelectedSubject = null;
let activeModalSubject = null;

// DOM Elements
const subjectSelectDropdown = document.getElementById("subjectSelectDropdown");
const quickViewBtn = document.getElementById("quickViewBtn");
const quickDownloadBtn = document.getElementById("quickDownloadBtn");
const subjectsGrid = document.getElementById("subjectsGrid");
const searchInput = document.getElementById("searchInput");
const themeToggleBtn = document.getElementById("themeToggleBtn");

// Action Prompt Modal
const actionModal = document.getElementById("actionModal");
const closeActionModalBtn = document.getElementById("closeActionModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const modalSubjectTitle = document.getElementById("modalSubjectTitle");
const modalSubjectCode = document.getElementById("modalSubjectCode");
const modalFilename = document.getElementById("modalFilename");
const modalSubjectIcon = document.getElementById("modalSubjectIcon");
const modalViewActionBtn = document.getElementById("modalViewActionBtn");
const modalDownloadActionBtn = document.getElementById("modalDownloadActionBtn");

// PDF Viewer Modal
const pdfViewerModal = document.getElementById("pdfViewerModal");
const closeViewerBtn = document.getElementById("closeViewerBtn");
const viewerTitle = document.getElementById("viewerTitle");
const viewerSubjectTag = document.getElementById("viewerSubjectTag");
const viewerOpenTabBtn = document.getElementById("viewerOpenTabBtn");
const viewerDownloadBtn = document.getElementById("viewerDownloadBtn");
const pdfFrame = document.getElementById("pdfFrame");

// Toast
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  populateDropdown();
  renderSubjectCards(SUBJECTS);
  setupEventListeners();

  // If user opens the website, show prompt dialog automatically for the first subject
  // or user can pick immediately!
  setTimeout(() => {
    // Select first subject by default in dropdown for swift 1-click usage
    if (SUBJECTS.length > 0) {
      subjectSelectDropdown.value = SUBJECTS[0].id;
      handleDropdownChange(SUBJECTS[0].id);
    }
  }, 100);
});

// Setup dropdown
function populateDropdown() {
  SUBJECTS.forEach(sub => {
    const opt = document.createElement("option");
    opt.value = sub.id;
    opt.textContent = `${sub.code} — ${sub.title}`;
    subjectSelectDropdown.appendChild(opt);
  });
}

// Render cards
function renderSubjectCards(list) {
  subjectsGrid.innerHTML = "";
  if (list.length === 0) {
    subjectsGrid.innerHTML = `
      <div class="no-results">
        <p>No matching subjects found.</p>
      </div>
    `;
    return;
  }

  list.forEach(sub => {
    const card = document.createElement("div");
    card.className = "subject-card";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Options for ${sub.title}`);

    card.innerHTML = `
      <div class="card-top">
        <div class="card-icon" style="background: ${sub.accentLight}">
          ${sub.iconSvg}
        </div>
        <span class="card-code">${sub.code}</span>
      </div>
      <h3 class="card-title">${sub.title}</h3>
      <p class="card-description">${sub.description}</p>
      <div class="card-meta">
        <span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          ${sub.filesize}
        </span>
        <span>•</span>
        <span>PDF Document</span>
      </div>
      <div class="card-actions">
        <button class="btn btn-card-view" data-action="view" data-id="${sub.id}" title="View PDF">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          View PDF
        </button>
        <button class="btn btn-card-download" data-action="download" data-id="${sub.id}" title="Download PDF">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download PDF
        </button>
      </div>
    `;

    // Clicking card opens the choice prompt modal
    card.addEventListener("click", (e) => {
      // Check if button inside card was clicked directly
      const btn = e.target.closest("button");
      if (btn) {
        const action = btn.getAttribute("data-action");
        if (action === "view") {
          e.stopPropagation();
          viewPdf(sub);
          return;
        } else if (action === "download") {
          e.stopPropagation();
          downloadPdf(sub);
          return;
        }
      }
      openActionModal(sub);
    });

    // Keyboard support for card
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        if (!e.target.closest("button")) {
          e.preventDefault();
          openActionModal(sub);
        }
      }
    });

    subjectsGrid.appendChild(card);
  });
}

// Event Listeners setup
function setupEventListeners() {
  // Dropdown change
  subjectSelectDropdown.addEventListener("change", (e) => {
    handleDropdownChange(e.target.value);
  });

  // Quick Action buttons from top banner
  quickViewBtn.addEventListener("click", () => {
    if (currentSelectedSubject) {
      viewPdf(currentSelectedSubject);
    }
  });

  quickDownloadBtn.addEventListener("click", () => {
    if (currentSelectedSubject) {
      downloadPdf(currentSelectedSubject);
    }
  });

  // Search filter
  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();
    const filtered = SUBJECTS.filter(s => 
      s.title.toLowerCase().includes(term) ||
      s.code.toLowerCase().includes(term) ||
      s.description.toLowerCase().includes(term) ||
      s.filename.toLowerCase().includes(term)
    );
    renderSubjectCards(filtered);
  });

  // Action Modal controls
  closeActionModalBtn.addEventListener("click", closeActionModal);
  cancelModalBtn.addEventListener("click", closeActionModal);
  actionModal.addEventListener("click", (e) => {
    if (e.target === actionModal) closeActionModal();
  });

  modalViewActionBtn.addEventListener("click", () => {
    if (activeModalSubject) {
      const subject = activeModalSubject;
      closeActionModal();
      viewPdf(subject);
    }
  });

  modalDownloadActionBtn.addEventListener("click", () => {
    if (activeModalSubject) {
      const subject = activeModalSubject;
      closeActionModal();
      downloadPdf(subject);
    }
  });

  // PDF Viewer Modal controls
  closeViewerBtn.addEventListener("click", closePdfViewer);
  pdfViewerModal.addEventListener("click", (e) => {
    if (e.target === pdfViewerModal) closePdfViewer();
  });

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeActionModal();
      closePdfViewer();
    }
  });

  // Theme toggle
  themeToggleBtn.addEventListener("click", toggleTheme);
}

function handleDropdownChange(subjectId) {
  const found = SUBJECTS.find(s => s.id === subjectId);
  if (found) {
    currentSelectedSubject = found;
    quickViewBtn.disabled = false;
    quickDownloadBtn.disabled = false;
  }
}

// Open Choice Prompt Modal
function openActionModal(subject) {
  activeModalSubject = subject;
  modalSubjectTitle.textContent = subject.title;
  modalSubjectCode.textContent = subject.code;
  modalFilename.textContent = `${subject.filename} (${subject.filesize})`;
  modalSubjectIcon.innerHTML = subject.iconSvg;
  modalSubjectIcon.style.background = subject.accentLight;

  actionModal.classList.add("open");
  actionModal.setAttribute("aria-hidden", "false");
}

function closeActionModal() {
  actionModal.classList.remove("open");
  actionModal.setAttribute("aria-hidden", "true");
  activeModalSubject = null;
}

// View PDF in in-app modal viewer
function viewPdf(subject) {
  // Encode URI to safely handle special characters like spaces and parentheses
  const encodedPath = encodeURI(subject.filename);

  viewerTitle.textContent = `${subject.title} — ${subject.filename}`;
  viewerSubjectTag.textContent = subject.code;
  
  // Set toolbar links
  viewerOpenTabBtn.href = encodedPath;
  viewerDownloadBtn.href = `${encodedPath}?download=1`;
  viewerDownloadBtn.setAttribute("download", subject.filename);

  // Load in iframe
  pdfFrame.src = encodedPath;

  // Open viewer modal
  pdfViewerModal.classList.add("open");
  pdfViewerModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  showToast(`Viewing ${subject.code} PDF in reader`);
}

function closePdfViewer() {
  pdfViewerModal.classList.remove("open");
  pdfViewerModal.setAttribute("aria-hidden", "true");
  pdfFrame.src = "about:blank";
  document.body.style.overflow = "";
}

// Download PDF directly
function downloadPdf(subject) {
  const encodedPath = encodeURI(subject.filename) + "?download=1";
  
  // Create virtual link to trigger download cleanly
  const link = document.createElement("a");
  link.href = encodedPath;
  link.setAttribute("download", subject.filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`Downloading "${subject.filename}"...`);
}

// Toast notification helper
let toastTimeout;
function showToast(message) {
  clearTimeout(toastTimeout);
  toastMessage.textContent = message;
  toast.classList.add("show");

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// Theme handling
function initTheme() {
  const saved = localStorage.getItem("docuhub-theme") || "light";
  document.body.setAttribute("data-theme", saved);
}

function toggleTheme() {
  const current = document.body.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.body.setAttribute("data-theme", next);
  localStorage.setItem("docuhub-theme", next);
}
