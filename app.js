/**
 * Subject Document Portal - Pure Word Data Edition
 */

// Subject Data pointing to the pure Word (.docx) files
const SUBJECTS = [
  {
    id: "fsd-ii",
    code: "FSD - II",
    title: "Full Stack Development - II",
    filename: "R23 FSD - II Lab Manuaul.docx",
    filesize: "132.5 KB",
    badge: "R23 Lab Manual",
    description: "Complete practical manual covering modern JavaScript, DOM manipulation, event handling, asynchronous programming, Node.js, and Full Stack applications.",
    iconColor: "#059669",
    accentLight: "rgba(5, 150, 105, 0.12)",
    iconSvg: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
      <line x1="14" y1="4" x2="10" y2="20"></line>
    </svg>`
  },
  {
    id: "os-sp",
    code: "OS & SP",
    title: "Operating Systems & System Programming",
    filename: "OS&SP Programs 8,9,10 week.docx",
    filesize: "26.8 KB",
    badge: "Programs 8, 9, 10 Week",
    description: "Complete process scheduling algorithms, inter-process communication (IPC), thread synchronization, and system calls with zero data loss.",
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
    filename: "nlp.docx",
    filesize: "13.1 KB",
    badge: "Complete Programs",
    description: "Lab exercises and implementations for tokenization, stemming, POS tagging, N-gram modeling, and text processing pipelines in full fidelity.",
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
let activeRenderAbort = null;

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

// Document Viewer Modal
const docViewerModal = document.getElementById("docViewerModal");
const closeViewerBtn = document.getElementById("closeViewerBtn");
const viewerTitle = document.getElementById("viewerTitle");
const viewerSubjectTag = document.getElementById("viewerSubjectTag");
const viewerPrintBtn = document.getElementById("viewerPrintBtn");
const viewerDownloadBtn = document.getElementById("viewerDownloadBtn");
const docLoader = document.getElementById("docLoader");
const docLoaderText = document.getElementById("docLoaderText");
const docxContent = document.getElementById("docxContent");

// Toast
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  populateDropdown();
  renderSubjectCards(SUBJECTS);
  setupEventListeners();

  // Set default subject selection for immediate 1-click usage
  setTimeout(() => {
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
        <span>Word Document (.docx)</span>
      </div>
      <div class="card-actions">
        <button class="btn btn-card-view" data-action="view" data-id="${sub.id}" title="View Document">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          View Doc
        </button>
        <button class="btn btn-card-download" data-action="download" data-id="${sub.id}" title="Download Word (.docx)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download .docx
        </button>
      </div>
    `;

    // Clicking card opens the choice prompt modal
    card.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (btn) {
        const action = btn.getAttribute("data-action");
        if (action === "view") {
          e.stopPropagation();
          viewDocument(sub);
          return;
        } else if (action === "download") {
          e.stopPropagation();
          downloadDocument(sub);
          return;
        }
      }
      openActionModal(sub);
    });

    // Keyboard accessibility
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
      viewDocument(currentSelectedSubject);
    }
  });

  quickDownloadBtn.addEventListener("click", () => {
    if (currentSelectedSubject) {
      downloadDocument(currentSelectedSubject);
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
      viewDocument(subject);
    }
  });

  modalDownloadActionBtn.addEventListener("click", () => {
    if (activeModalSubject) {
      const subject = activeModalSubject;
      closeActionModal();
      downloadDocument(subject);
    }
  });

  // Document Viewer Modal controls
  closeViewerBtn.addEventListener("click", closeDocViewer);
  docViewerModal.addEventListener("click", (e) => {
    if (e.target === docViewerModal) closeDocViewer();
  });

  viewerPrintBtn.addEventListener("click", () => {
    window.print();
  });

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeActionModal();
      closeDocViewer();
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

// Open Action Prompt Modal
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

// In-memory blob cache for instant re-opening
const documentBlobCache = new Map();

// High-fidelity Word Document Viewer
async function viewDocument(subject) {
  const encodedPath = encodeURIComponent(subject.filename);

  viewerTitle.textContent = `${subject.title} — ${subject.filename}`;
  viewerSubjectTag.textContent = subject.code;
  
  // Set toolbar download link
  viewerDownloadBtn.href = `${encodedPath}?download=1`;
  viewerDownloadBtn.setAttribute("download", subject.filename);

  // Open viewer modal
  docViewerModal.classList.add("open");
  docViewerModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // Reset content & show loader
  docxContent.innerHTML = "";
  docLoader.classList.add("active");
  docLoaderText.textContent = `Loading ${subject.title} (${subject.filesize})...`;

  try {
    let blob;
    if (documentBlobCache.has(encodedPath)) {
      blob = documentBlobCache.get(encodedPath);
    } else {
      const response = await fetch(encodedPath);
      if (!response.ok) {
        throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
      }

      const contentLength = response.headers.get("content-length");
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;

      if (response.body && totalBytes > 0 && typeof ReadableStream !== "undefined") {
        const reader = response.body.getReader();
        let receivedBytes = 0;
        const chunks = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          receivedBytes += value.length;
          const mb = (receivedBytes / (1024 * 1024)).toFixed(1);
          const totalMb = (totalBytes / (1024 * 1024)).toFixed(1);
          docLoaderText.textContent = `Loading document: ${mb} MB / ${totalMb} MB...`;
        }
        blob = new Blob(chunks, { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      } else {
        blob = await response.blob();
      }
      documentBlobCache.set(encodedPath, blob);
    }

    docLoaderText.textContent = "Rendering document pages & figures...";

    // Check if docx-preview library is loaded
    if (window.docx && typeof window.docx.renderAsync === "function") {
      await window.docx.renderAsync(blob, docxContent, null, {
        className: "docx",
        inWrapper: true,
        ignoreWidth: false,
        ignoreHeight: false,
        ignoreFonts: true,
        breakPages: true,
        ignoreLastRenderedPageBreak: true,
        renderHeaders: true,
        renderFooters: true,
        renderFootnotes: true,
        renderEndnotes: true,
        useBase64URL: false
      });
      docLoader.classList.remove("active");
      showToast(`Rendered ${subject.code} successfully!`);
    } else {
      // Fallback if docx library couldn't be loaded
      renderFallbackViewer(subject);
    }
  } catch (error) {
    console.error("Error rendering document:", error);
    docLoader.classList.remove("active");
    docxContent.innerHTML = `
      <div style="background: #ffffff; color: #1e293b; padding: 2.5rem; border-radius: 8px; max-width: 650px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
        <h3 style="margin-bottom: 0.75rem; font-size: 1.25rem; font-weight: 700;">Document Ready for Direct Access</h3>
        <p style="color: #64748b; margin-bottom: 1.5rem; font-size: 0.95rem;">
          This document (${subject.filesize}) contains high-resolution data. You can download the pure .docx file directly to view in Microsoft Word with 100% precision.
        </p>
        <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
          <a href="${encodedPath}?download=1" download="${subject.filename}" class="btn btn-primary">
            Download ${subject.filename}
          </a>
        </div>
      </div>
    `;
    showToast(`Notice: Large file ready for download`);
  }
}

function renderFallbackViewer(subject) {
  docLoader.classList.remove("active");
  const encodedPath = encodeURIComponent(subject.filename);
  docxContent.innerHTML = `
    <div style="background: #ffffff; color: #1e293b; padding: 2.5rem; border-radius: 8px; max-width: 650px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
      <h3 style="margin-bottom: 0.75rem; font-size: 1.25rem; font-weight: 700;">${subject.title}</h3>
      <p style="color: #64748b; margin-bottom: 1.5rem; font-size: 0.95rem;">
        File: <strong>${subject.filename}</strong> (${subject.filesize})
      </p>
      <a href="${encodedPath}?download=1" download="${subject.filename}" class="btn btn-primary">
        Download Word File (.docx)
      </a>
    </div>
  `;
}

function closeDocViewer() {
  docViewerModal.classList.remove("open");
  docViewerModal.setAttribute("aria-hidden", "true");
  docxContent.innerHTML = "";
  docLoader.classList.remove("active");
  document.body.style.overflow = "";
}

// Download Word document directly (100% original binary, zero data loss)
function downloadDocument(subject) {
  const encodedPath = encodeURIComponent(subject.filename) + "?download=1";
  
  const link = document.createElement("a");
  link.href = encodedPath;
  link.setAttribute("download", subject.filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`Downloading "${subject.filename}" with pure data...`);
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
