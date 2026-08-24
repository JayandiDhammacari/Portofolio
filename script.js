/* ===================== Theme Toggle ===================== */
(function(){
  const toggleBtn = document.getElementById('theme-toggle');
  if(!toggleBtn) return;
  const icon = toggleBtn.querySelector('i');
  const stored = localStorage.getItem('site-theme');

  function applyTheme(theme){
    document.body.classList.toggle('light-theme', theme === 'light');
    icon.classList.toggle('fa-moon', theme !== 'light');
    icon.classList.toggle('fa-sun', theme === 'light');
  }

  applyTheme(stored || 'dark');

  toggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-theme');
    const next = isLight ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('site-theme', next);
  });
})();

/* ===================== Full-page Terminal ===================== */
(function(){
  const body = document.getElementById('terminal-body');
  const input = document.getElementById('terminal-input');
  const ghost = document.getElementById('terminal-ghost');
  const tabHint = document.getElementById('terminal-tab-hint');
  const suggestions = document.querySelectorAll('.terminal-suggestions button');
  const openBtn = document.getElementById('open-terminal-btn');
  const backBtn = document.getElementById('terminal-back-btn');
  if(!body || !input) return;

  const commandHistory = [];
  let historyIndex = -1;

  /* snapshot of the terminal's original welcome content, used to reset it */
  const initialTerminalHTML = body.innerHTML;

  /* ---- open / close full-page terminal ---- */
  function openTerminal(){
    document.body.classList.add('terminal-mode');
    document.getElementById('terminal-view').setAttribute('aria-hidden', 'false');
    input.focus();
    body.scrollTop = body.scrollHeight;
  }

  function closeTerminal(){
    document.body.classList.remove('terminal-mode');
    document.getElementById('terminal-view').setAttribute('aria-hidden', 'true');

    /* wipe the session: next time the terminal opens, it starts fresh */
    body.innerHTML = initialTerminalHTML;
    input.value = '';
    commandHistory.length = 0;
    historyIndex = -1;
    updateGhost();
  }

  if(openBtn) openBtn.addEventListener('click', openTerminal);
  if(backBtn) backBtn.addEventListener('click', closeTerminal);

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && document.body.classList.contains('terminal-mode')){
      const certificateModal = document.getElementById('certificate-modal');

      if(certificateModal) return;

      closeTerminal();
    }
  });

  /* ---- output helpers ---- */
  function printText(text, cls){
    if(text === null || text === undefined) return null;
    const p = document.createElement('p');
    p.className = 'terminal-line' + (cls ? ' ' + cls : '');
    p.textContent = text;
    body.appendChild(p);
    return p;
  }

  function printHTML(html){
    const wrapper = document.createElement('div');
    wrapper.className = 'terminal-line';
    wrapper.innerHTML = html;
    body.appendChild(wrapper);
    return wrapper;
  }

  /* ---- tech stack data (logos via devicon, with graceful text-badge fallback) ---- */
  const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';
  const techSecondary = [
    { name: 'JavaScript', icon: `${DEVICON_BASE}/javascript/javascript-original.svg`, fallback: 'JS' },
    { name: 'PHP',        icon: `${DEVICON_BASE}/php/php-original.svg`,               fallback: 'PHP' },
    { name: 'Laravel',    icon: `${DEVICON_BASE}/laravel/laravel-original.svg`,       fallback: 'Lv' },
    { name: 'C#',         icon: `${DEVICON_BASE}/csharp/csharp-original.svg`,         fallback: 'C#' },
    { name: 'Unity',      icon: `${DEVICON_BASE}/unity/unity-original.svg`,           fallback: 'Un' },
    { name: 'Python',     icon: `${DEVICON_BASE}/python/python-original.svg`,         fallback: 'Py' },
    { name: 'Java',       icon: `${DEVICON_BASE}/java/java-original.svg`,             fallback: 'Jv' },
    { name: 'HTML5',      icon: `${DEVICON_BASE}/html5/html5-original.svg`,           fallback: 'H5' },
    { name: 'CSS3',       icon: `${DEVICON_BASE}/css3/css3-original.svg`,             fallback: 'C3' },
    { name: 'Git',        icon: `${DEVICON_BASE}/git/git-original.svg`,               fallback: 'Git' },
  ];

  /* ---- project data (shared by projects / project <n>) ---- */
  const projects = [
    {
      img: 'Image/Project 1.png',
      title: 'SAP - WEB Integration Project',
      url: 'https://www.linkedin.com/posts/jayandi-dhammacari_sap-abap-activity-7327702421869068289--eOJ?utm_source=social_share_send&utm_medium=android_app&rcm=ACoAAEkIlLIBUyybKEo38i4mUyouU8zvjbpZpUs&utm_campaign=copy_link'
    },
    {
      img: 'Image/Project 2.png',
      title: 'Automatically Update Target Value in Scheduling Agreement SAP',
      url: 'https://jayandicode.blogspot.com/2025/09/how-to-automatically-update-target_3.html'
    },
    {
      img: 'Image/Project 3.png',
      title: 'Upload Multiple Attachment to SAP GOS',
      url: 'https://jayandicode.blogspot.com/2025/09/how-to-upload-multiple-attachments-to.html'
    },
    {
      img: 'Image/Project 4.png',
      title: 'MM60 Custom Field Enhancement',
      url: 'https://jayandicode.blogspot.com/2026/02/adding-addtional-field-dan-selection.html'
    },
    {
      img: 'Image/Project 5.png',
      title: 'Mass Download Attachment in SAP',
      url: 'https://jayandicode.blogspot.com/2026/02/sap-abap-mass-download-attachment.html'
    },
    {
      img: 'Image/Project 6.png',
      title: 'Automating Direct Activity Allocation in SAP',
      url: 'https://jayandicode.blogspot.com/2025/09/automating-direct-activity-allocation.html'
    }
  ];

  /* ---- blog data (reinforces ABAP-specialist positioning - update as you post) ---- */
  const blogPosts = [
    { title: "Why Can't I Find This Text in SE16N? Mastering READ_TEXT", url: 'https://jayandicode.blogspot.com/2026/02/why-cant-i-find-this-text-in-se16n.html' },
    { title: 'Learn How to Use STVARV for Dynamic ABAP Programs', url: 'https://jayandicode.blogspot.com/2026/02/learn-how-to-use-stvarv-for-dynamic.html' },
    { title: 'SAP ABAP Mass Download Attachment', url: 'https://jayandicode.blogspot.com/2026/02/sap-abap-mass-download-attachment.html' },
    { title: 'Building a Dynamic Table in ALV Report - SAP ABAP', url: 'https://jayandicode.blogspot.com/2026/02/building-dynamic-table-in-alv-report.html' },
    { title: 'MM60 Custom Field Enhancement', url: 'https://jayandicode.blogspot.com/2026/02/adding-addtional-field-dan-selection.html' },
  ];

  /* ---- commands ---- */
  const commands = {};

  /* command list also powers help text + tab-autocomplete, so they can never drift out of sync */
  const HELP_ROWS = [
    ['about', 'who I am'],
    ['education', 'degree & thesis'],
    ['experience', 'current role & responsibilities'],
    ['techstack', 'tools & technologies I use'],
    ['projects', "a gallery of things I've built"],
    ['project <n>', 'view one project in detail, e.g. "project 3"'],
    ['blog', 'recent posts from my ABAP blog'],
    ['contact', 'how to reach me'],
    ['clear', 'clear this screen'],
    ['back', 'return to my profile page'],
  ];

  const SUGGESTABLE_COMMANDS = ['help', ...HELP_ROWS.filter(([c]) => !c.includes('<')).map(([c]) => c)];

  commands.help = () => {
    const rows = HELP_ROWS.map(([cmd, desc]) => `
      <div class="term-help-row">
        <span class="term-help-cmd">${cmd}</span>
        <span class="term-help-desc">${desc}</span>
      </div>
    `).join('');
    printHTML(`
      <div class="term-help">
        <div class="term-help-title">Available commands: <span class="term-help-tip">(press Tab to autocomplete as you type)</span></div>
        ${rows}
      </div>
    `);
    return null;
  };

  commands.about = () => `Jayandi Dhammacari — SAP ABAP Developer at PT Indonesia Morowali Industrial Park.

I focus on turning business requirements into practical SAP solutions, from reports and 
forms to enhancements and system integrations.

Before focusing on SAP, I worked with web, mobile, and AR development. That background 
shapes how I approach problems today, especially when connecting SAP with external systems 
through APIs and BAPIs.

I enjoy building things that solve real problems, whether they live entirely inside SAP or 
connect SAP with the outside world.`;

  commands.education = () => {
    printHTML(`
      <div class="term-media">
        <img src="Image/logo.png" alt="Bunda Mulia University logo" class="term-thumb">
        <div class="term-media-text">
          <strong style="color:var(--accent)">Bunda Mulia University</strong><br>
          Bachelor of Computer Science (S.Kom)<br>
          Aug 2020 - Feb 2024 &middot; GPA 3.68 &middot; Completed in 3.5 years<br>
          Thesis: Developed a mobile Augmented Reality (AR) application for human anatomy learning media using Unity and C#
          <strong style="color:var(--accent)"><br><br>Certification</strong><br>
          Certified International Specialist in Data Visualization<br>
          PASAS Institute, Singapore<br>
          Issued: 2024 &middot; Credential ID: CISDV14472<br>
          <button type="button" class="term-certificate-btn" id="view-certificate-btn">
          View Certificate
          </button>
        </div>
      </div>
    `);
    const certificateBtn = document.getElementById('view-certificate-btn');

    if(certificateBtn){
      certificateBtn.addEventListener('click', openCertificateModal);
    }
    return null;
  };

  function openCertificateModal(){
  const existing = document.getElementById('certificate-modal');
  if(existing) return;

  const modal = document.createElement('div');
  modal.id = 'certificate-modal';
  modal.className = 'certificate-modal';

  modal.innerHTML = `
    <div class="certificate-modal-content" role="dialog" aria-modal="true" aria-label="CISDV Certificate">
      <button type="button" class="certificate-modal-close" aria-label="Close certificate">
        &times;
      </button>
      <img src="Image/CISDV.jpg" alt="Certified International Specialist in Data Visualization certificate">
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = modal.querySelector('.certificate-modal-close');

  function closeCertificate(){
    modal.remove();
  }

  closeBtn.addEventListener('click', closeCertificate);

  modal.addEventListener('click', (e) => {
    if(e.target === modal){
      closeCertificate();
    }
  });

  document.addEventListener('keydown', function handleEscape(e){
    if(e.key === 'Escape'){
      closeCertificate();
      document.removeEventListener('keydown', handleEscape);
    }
  });

  modal.querySelector('img').addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

  commands.experience = () => {
    printHTML(`
      <div class="term-media">
        <img src="Image/logo-imip-putih.png" alt="PT Indonesia Morowali Industrial Park logo" class="term-thumb">
        <div class="term-media-text">
          <strong style="color:var(--accent)">PT. Indonesia Morowali Industrial Park</strong><br>
          SAP ABAP Developer &middot; May 2024 - Present
          <ul class="term-list">
            <li>Develop custom ALV Grid reports</li>
            <li>Develop & customize SmartForms</li>
            <li>Debug & troubleshoot ABAP programs</li>
            <li>Build Excel-to-SAP data import programs</li>
            <li>Implement BAdI / User Exit / Customer Exit to enhance SAP Standard Transactions</li>
            <li>Develop custom fields on SAP standard reports</li>
            <li>Integrate SAP with external web systems through APIs</li>
            <li>Automate document generation & business processes using BAPIs</li>
          </ul>
        </div>
      </div>
    `);
    return null;
  };

  commands.techstack = () => {
    /* Core tier: SAP tooling first and biggest, so this is the first thing a recruiter's
       eye lands on - not the JavaScript/PHP list below it. */
    const coreBadges = ['SmartForms', 'ALV Grid', 'BAdI / User Exit', 'BAPI'].map(name => `
      <span class="term-sap-pill">${name}</span>
    `).join('');

    const secondaryItems = techSecondary.map(t => `
      <div class="term-tech-item">
        <div class="term-tech-icon-wrap">
          <img src="${t.icon}" alt="" class="term-tech-icon"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="term-tech-fallback">${t.fallback}</div>
        </div>
        <span class="term-tech-name">${t.name}</span>
      </div>
    `).join('');

    printHTML(`
      <div class="term-techstack">
        <div class="term-tech-tier-label">Core &mdash; SAP Development</div>
        <div class="term-sap-feature">
          <div class="term-sap-logo"><img src="Image/SAP_logo.svg" alt="SAP logo"></div>
          <div class="term-media-text">
            <strong style="color:var(--accent)">SAP ABAP</strong> &mdash; Core focus, used daily to build
            custom reports, forms, enhancements, and performance tuning.
            <div class="term-sap-pills">${coreBadges}</div>
          </div>
        </div>

        <div class="term-tech-tier-label term-tech-tier-secondary">Also comfortable with &mdash; from my full-stack background</div>
        <div class="term-tech-grid">${secondaryItems}</div>
      </div>
    `);
    return null;
  };

  commands.skills = commands.techstack;

  commands.projects = () => {
    const items = projects.map((p, i) => `
      <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="term-gallery-item">
        <img src="${p.img}" alt="${p.title}">
        <div class="term-gallery-caption"><span class="term-num">${i + 1}.</span>${p.title}</div>
      </a>
    `).join('');
    printHTML(`<div class="term-gallery">${items}</div>`);
    printText('Click a thumbnail to open it, or type "project <n>" (e.g. project 2) to view one full-size here.');
    return null;
  };

  commands.blog = () => {
    const items = blogPosts.map(p => `
      <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="term-blog-row">
        <i class="fa-solid fa-arrow-up-right-from-square"></i>
        <span>${p.title}</span>
      </a>
    `).join('');
    printHTML(`
      <div class="term-media-text" style="margin-bottom:1rem;">Latest from <strong style="color:var(--accent)">Learn ABAP Together</strong>, my ABAP tips & tutorials blog:</div>
      <div class="term-blog-list">${items}</div>
    `);
    printHTML(`Full archive: <a href="https://jayandicode.blogspot.com/" target="_blank" rel="noopener noreferrer">jayandicode.blogspot.com</a>`);
    return null;
  };

  commands.contact = () => {
    printHTML(`
      <div class="term-contact">
        <div class="term-contact-row">
          <i class="fa-brands fa-linkedin"></i>
          <div class="term-contact-text">
            <strong>LinkedIn</strong>
            <a href="https://www.linkedin.com/in/jayandi-dhammacari" target="_blank" rel="noopener noreferrer">Connect on LinkedIn</a>
          </div>
        </div>
        <div class="term-contact-row">
          <i class="fa-brands fa-instagram"></i>
          <div class="term-contact-text">
            <strong>Instagram</strong>
            <a href="https://www.instagram.com/jayandi_dhammacari/" target="_blank" rel="noopener noreferrer">Follow me on Instagram</a>
          </div>
        </div>
        <div class="term-contact-row">
          <i class="fa-brands fa-facebook"></i>
          <div class="term-contact-text">
            <strong>Facebook</strong>
            <a href="https://www.facebook.com/jayandi.dhammacari?locale=id_ID" target="_blank" rel="noopener noreferrer">Find me on Facebook</a>
          </div>
        </div>
        <div class="term-contact-row">
          <i class="fa-brands fa-blogger"></i>
          <div class="term-contact-text">
            <strong>Blog</strong>
            <a href="https://jayandicode.blogspot.com/" target="_blank" rel="noopener noreferrer">Visit my Blog</a>
          </div>
        </div>
        <div class="term-contact-row">
          <i class="fa-solid fa-envelope"></i>
          <div class="term-contact-text">
            <strong>E-Mail</strong>
            <a href="https://mail.google.com/" target="_blank" rel="noopener noreferrer">jayandidhammacari10@gmail.com</a>
          </div>
        </div>
      </div>
    `);
    return null;
  };

  commands.whoami = () => `visitor@jayandis-portfolio`;

  commands.ls = () => `about  education  experience  techstack  projects  blog  contact`;

  commands.clear = () => { body.innerHTML = ''; return null; };

  commands.back = commands.exit = () => {
    closeTerminal();
    return null;
  };

  function runProjectCommand(indexStr){
    const n = parseInt(indexStr, 10);
    if(!n || n < 1 || n > projects.length){
      printText(`No such project "${indexStr}". Try a number from 1 to ${projects.length}, or type "projects" to see them all.`, 'error');
      return;
    }
    const p = projects[n - 1];
    printHTML(`
      <div class="term-single-project">
        <img src="${p.img}" alt="${p.title}">
        <div class="term-media-text"><strong style="color:var(--accent)">${n}. ${p.title}</strong></div>
      </div>
    `);
    printHTML(`<a href="${p.url}" target="_blank" rel="noopener noreferrer" style="color:var(--accent)">${p.url}</a>`);
  }

  /* ---- tab-autocomplete (ghost text) ---- */
  function bestMatch(value){
    const v = value.toLowerCase();
    if(!v) return null;
    const match = SUGGESTABLE_COMMANDS
      .slice()
      .sort()
      .find(cmd => cmd.startsWith(v) && cmd !== v);
    return match || null;
  }

  function updateGhost(){
    const value = input.value;
    const match = bestMatch(value);
    if(!match){
      ghost.innerHTML = '';
      if(tabHint) tabHint.classList.remove('visible');
      return;
    }
    const rest = match.slice(value.length);
    ghost.innerHTML = `<span class="ghost-typed">${escapeHTML(value)}</span><span class="ghost-rest">${escapeHTML(rest)}</span>`;
    if(tabHint) tabHint.classList.add('visible');
  }

  function escapeHTML(str){
    return str.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  }

  input.addEventListener('input', updateGhost);

  /* ---- run / dispatch ---- */
  function runCommand(raw){
    const cmd = raw.trim();
    if(!cmd) return;
    const echoEl = printText('jayandi@portfolio:~$ ' + cmd, 'echoed');

    commandHistory.push(cmd);
    historyIndex = commandHistory.length;

    const key = cmd.toLowerCase();

    if(key.startsWith('project ')){
      runProjectCommand(key.slice(8).trim());
    } else if(commands[key]){
      const output = commands[key]();
      if(output !== null && output !== undefined) printText(output);
    } else {
      printText(`Command not found: "${cmd}". Type "help" to see what's available.`, 'error');
    }

    requestAnimationFrame(() => {
      if(echoEl && echoEl.isConnected){
        body.scrollTop = echoEl.offsetTop;
      } else {
        body.scrollTop = body.scrollHeight;
      }
    });
  }

  input.addEventListener('keydown', (e) => {
    if(e.key === 'Tab'){
      e.preventDefault();
      const match = bestMatch(input.value);
      if(match){
        input.value = match;
        updateGhost();
      }
    } else if(e.key === 'Enter'){
      runCommand(input.value);
      input.value = '';
      updateGhost();
    } else if(e.key === 'ArrowRight'){
      /* let the right arrow also accept the suggestion, when the caret is already at the end */
      const match = bestMatch(input.value);
      if(match && input.selectionStart === input.value.length){
        e.preventDefault();
        input.value = match;
        updateGhost();
      }
    } else if(e.key === 'ArrowUp'){
      e.preventDefault();
      if(historyIndex > 0){
        historyIndex--;
        input.value = commandHistory[historyIndex] || '';
        updateGhost();
      }
    } else if(e.key === 'ArrowDown'){
      e.preventDefault();
      if(historyIndex < commandHistory.length - 1){
        historyIndex++;
        input.value = commandHistory[historyIndex] || '';
      } else {
        historyIndex = commandHistory.length;
        input.value = '';
      }
      updateGhost();
    }
  });

  suggestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      runCommand(cmd);
      input.focus();
    });
  });

  document.querySelector('.terminal-window')?.addEventListener('click', (e) => {
    if(e.target.closest('a') || e.target.closest('button')) return;
    input.focus();
  });
})();
