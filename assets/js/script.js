'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// profile elements to populate dynamically
const profileAvatar = document.querySelector('.sidebar .avatar-box img');
const profileName = document.querySelector('.sidebar .info-content .name');
const profileTitle = document.querySelector('.sidebar .info-content .title');
const githubContactLink = document.querySelector('.contacts-list .contact-link');
const socialGithubLink = document.querySelector('.social-list .social-link');

// sidebar toggle functionality for mobile
if (sidebarBtn && sidebar) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}


// load profile data (fallback to static content on failure)
document.addEventListener('DOMContentLoaded', () => {
  fetch('./assets/data/profile.json')
    .then(res => res.json())
    .then(profile => {
      if (profileAvatar && profile.avatar_url) profileAvatar.src = profile.avatar_url;
      if (profileAvatar && profile.name) profileAvatar.alt = profile.name;
      if (profileName && profile.name) profileName.textContent = profile.name;
      if (profileTitle && profile.bio) profileTitle.textContent = profile.bio;
      if (githubContactLink && profile.github_url) {
        githubContactLink.href = profile.github_url;
        githubContactLink.textContent = profile.github_url.replace(/^https?:\/\//, '');
      }
      if (socialGithubLink && profile.github_url) {
        socialGithubLink.href = profile.github_url;
      }
      // after profile is loaded, fetch GitHub repos and render into portfolio
      const githubUsername = profile.username || (profile.github_url && profile.github_url.split('/').pop()) || 'moamenalmahe';
      fetchAndRenderRepos(githubUsername, profile.avatar_url);
    })
    .catch(err => {
      // silently ignore and keep static HTML content
      console.warn('Could not load profile.json', err);
    });
});

// fallback button to manually load repos if needed
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'load-repos-btn') {
    // try to get username from profile.json synchronously via fetch
    fetch('./assets/data/profile.json')
      .then(r => r.json())
      .then(profile => {
        const username = profile.username || (profile.github_url && profile.github_url.split('/').pop()) || 'moamenalmahe';
        fetchAndRenderRepos(username, profile.avatar_url);
      })
      .catch(err => console.warn('Could not load profile.json for manual repo load', err));
  }
});



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}


/**
 * Fetch public repositories for a GitHub username and render them
 * into the Portfolio `.project-list` element. Keeps existing items
 * if fetch fails or there are no repos.
 */
function fetchAndRenderRepos(username, avatarUrl) {
  if (!username) return;
  const api = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;
  // try to read an optional token from profile.json to avoid hardcoding tokens in the JS
  fetch('./assets/data/profile.json')
    .then(r => r.json())
    .then(profile => {
      const token = profile.github_token && profile.github_token.length ? profile.github_token : null;
      const headers = token ? { 'Authorization': `token ${token}` } : {};
      if (!token) console.info('No GitHub token found in profile.json — using unauthenticated API calls (may be rate-limited)');

      return fetch(api, { headers });
    })
    .then(res => {
      if (!res.ok) throw new Error('GitHub API error: ' + res.status);
      return res.json();
    })
    .then(repos => {
      if (!Array.isArray(repos) || repos.length === 0) return;
      const projectList = document.querySelector('.project-list');
      if (!projectList) return;

      // clear existing demo items
      projectList.innerHTML = '';

      repos.forEach(repo => {
        const item = renderRepoItem(repo, avatarUrl);
        projectList.appendChild(item);
      });
    })
    .catch(err => {
      console.warn('Could not fetch GitHub repos', err);
    });
}


function renderRepoItem(repo, avatarUrl) {
  // Render a rectangular project card with image, title and category
  const li = document.createElement('li');
  li.className = 'project-card-item';

  const a = document.createElement('a');
  a.href = repo.html_url || '#';
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.className = 'project-card';

  const figure = document.createElement('figure');
  figure.className = 'project-card-figure';

  const img = document.createElement('img');
  img.alt = repo.name || 'project image';
  img.loading = 'lazy';
  const socialPreviewUrl = `https://opengraph.githubassets.com/1/${repo.owner.login}/${repo.name}`;
  const defaultImg = './assets/images/project-1.jpg';
  img.src = socialPreviewUrl;
  img.onerror = function () { img.src = defaultImg; };

  figure.appendChild(img);

  const content = document.createElement('div');
  content.className = 'project-card-content';

  const h3 = document.createElement('h3');
  h3.className = 'project-card-title';
  h3.textContent = repo.name;

  const p = document.createElement('p');
  p.className = 'project-card-category';
  p.textContent = repo.language || 'Web development';

  content.appendChild(h3);
  content.appendChild(p);

  a.appendChild(figure);
  a.appendChild(content);
  li.appendChild(a);

  return li;
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
if (modalCloseBtn) modalCloseBtn.addEventListener("click", testimonialsModalFunc);
if (overlay) overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
if (navigationLinks.length && pages.length) {
  navigationLinks.forEach(navLink => {
    navLink.addEventListener('click', function () {
      const targetPage = this.innerText.trim().toLowerCase();

      // Toggle pages
      pages.forEach(page => {
        if (page.dataset.page === targetPage) {
          page.classList.add('active');
        } else {
          page.classList.remove('active');
        }
      });

      // Toggle nav link active state
      navigationLinks.forEach(link => {
        if (link === this) link.classList.add('active'); else link.classList.remove('active');
      });

      window.scrollTo(0, 0);
    });
  });
}

// Activate page from URL hash on load (e.g., #cv)
document.addEventListener('DOMContentLoaded', () => {
  const hash = (location.hash || '').replace('#', '').toLowerCase();
  if (hash) {
    // find nav link that matches
    const link = Array.from(navigationLinks).find(l => l.innerText.trim().toLowerCase() === hash);
    if (link) link.click();
  }
});