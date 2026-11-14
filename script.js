/* ==========================================================================
   LOCALIZA RENT A CAR - DICIONARIO DE DADOS E GOVERNANCA (SCRIPT.JS)
   Funcionalidades:
   1. Toggle Light / Dark Mode com persistência em localStorage
   2. Menu Lateral Dinâmico Responsivo (Drawer Mobile + Filtro + ScrollSpy)
   3. Pesquisa em Tempo Real (tabelas, atributos, tipos, LGPD, linhagem, RBAC)
   4. Visualizador do DER em Modal Tela Cheia com Panzoom.js (Zoom +, Zoom -, Reset, Pan e Scroll)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. LIGHT / DARK MODE TOGGLE
  // ------------------------------------------------------------------------
  const htmlEl = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('localiza_dict_theme', theme);
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-sun';
      themeLabel.textContent = 'Modo Claro';
    } else {
      themeIcon.className = 'fa-solid fa-moon';
      themeLabel.textContent = 'Modo Escuro';
    }
  }

  const savedTheme = localStorage.getItem('localiza_dict_theme') || 'light';
  applyTheme(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    applyTheme(current === 'light' ? 'dark' : 'light');
  });

  // ------------------------------------------------------------------------
  // 2. SIDEBAR RESPONSIVA E SINCRONIZACAO DINAMICA DE TABELAS
  // ------------------------------------------------------------------------
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebarMenuList = document.getElementById('sidebarMenuList');
  const sidebarQuickFilter = document.getElementById('sidebarQuickFilter');
  const sidebarTableCount = document.getElementById('sidebarTableCount');
  const dictSections = Array.from(document.querySelectorAll('.dict-section'));

  // Reconstrói/sincroniza dinamicamente o menu lateral a partir das seções do DOM
  function buildDynamicSidebar() {
    sidebarMenuList.innerHTML = '';
    dictSections.forEach((section) => {
      const tableName = section.getAttribute('data-table');
      const rowCount = section.querySelectorAll('tbody tr').length;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${tableName}`;
      a.setAttribute('data-target', tableName);
      a.innerHTML = `<span class="nav-tbl-name">${tableName}</span><span class="nav-col-count">${rowCount}</span>`;
      a.addEventListener('click', () => {
        closeMobileSidebar();
      });
      li.appendChild(a);
      sidebarMenuList.appendChild(li);
    });
    sidebarTableCount.textContent = dictSections.length;
  }

  buildDynamicSidebar();

  function openMobileSidebar() {
    sidebar.classList.add('open');
    sidebarBackdrop.classList.add('visible');
  }

  function closeMobileSidebar() {
    sidebar.classList.remove('open');
    sidebarBackdrop.classList.remove('visible');
  }

  sidebarToggleBtn.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) {
      closeMobileSidebar();
    } else {
      openMobileSidebar();
    }
  });

  sidebarBackdrop.addEventListener('click', closeMobileSidebar);

  // Filtro rápido no menu lateral
  sidebarQuickFilter.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    const items = sidebarMenuList.querySelectorAll('li');
    let visibleCount = 0;

    items.forEach((li) => {
      const text = li.textContent.toLowerCase();
      const match = text.includes(query);
      li.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    sidebarTableCount.textContent = visibleCount;
  });

  // Destaque ativo na sidebar durante rolagem (ScrollSpy)
  const navLinks = () => Array.from(sidebarMenuList.querySelectorAll('a'));

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 130;

    dictSections.forEach((section) => {
      if (section.style.display === 'none') return;
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks().forEach((link) => {
      link.classList.toggle('active', link.getAttribute('data-target') === currentId);
    });
  });

  // ------------------------------------------------------------------------
  // 3. PESQUISA EM TEMPO REAL E FILTRO DE PRIVACIDADE (LGPD)
  // ------------------------------------------------------------------------
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const lgpdChips = Array.from(document.querySelectorAll('.filter-chip'));
  const searchResultsCounter = document.getElementById('searchResultsCounter');
  const emptySearchState = document.getElementById('emptySearchState');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');

  let activeLgpdFilter = 'ALL';

  function normalizeText(str) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function filterDictionary() {
    const rawQuery = searchInput.value.trim();
    const query = normalizeText(rawQuery);
    clearSearchBtn.classList.toggle('visible', rawQuery.length > 0);

    let visibleTables = 0;
    let visibleAttributes = 0;

    dictSections.forEach((section) => {
      const tableName = normalizeText(section.getAttribute('data-table') || '');
      const tablePurpose = normalizeText(section.querySelector('.table-purpose')?.textContent || '');
      const tableMatchesDirectly = query.length > 0 && (tableName.includes(query) || tablePurpose.includes(query));

      const rows = Array.from(section.querySelectorAll('tbody tr'));
      let sectionVisibleRows = 0;

      rows.forEach((row) => {
        const rowLgpd = row.getAttribute('data-lgpd');
        const matchesLgpd = activeLgpdFilter === 'ALL' || rowLgpd === activeLgpdFilter;

        const rowText = normalizeText(row.textContent || '');
        const matchesText = query.length === 0 || tableMatchesDirectly || rowText.includes(query);

        const isVisible = matchesLgpd && matchesText;
        row.style.display = isVisible ? '' : 'none';

        if (isVisible) {
          sectionVisibleRows++;
          visibleAttributes++;
        }
      });

      const showSection = sectionVisibleRows > 0;
      section.style.display = showSection ? '' : 'none';

      // Sincroniza visibilidade do item correspondente no menu lateral
      const sideLink = sidebarMenuList.querySelector(`a[data-target="${section.id}"]`);
      if (sideLink && sideLink.parentElement) {
        sideLink.parentElement.style.display = showSection ? '' : 'none';
      }

      if (showSection) {
        visibleTables++;
      }
    });

    sidebarTableCount.textContent = visibleTables;
    searchResultsCounter.innerHTML = `Exibindo <strong>${visibleTables}</strong> ${visibleTables === 1 ? 'tabela' : 'tabelas'} e <strong>${visibleAttributes}</strong> ${visibleAttributes === 1 ? 'atributo' : 'atributos'}.`;
    emptySearchState.classList.toggle('hidden', visibleTables > 0);
  }

  searchInput.addEventListener('input', filterDictionary);

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    filterDictionary();
    searchInput.focus();
  });

  lgpdChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      lgpdChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      activeLgpdFilter = chip.getAttribute('data-lgpd');
      filterDictionary();
    });
  });

  resetFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    activeLgpdFilter = 'ALL';
    lgpdChips.forEach((c) => c.classList.toggle('active', c.getAttribute('data-lgpd') === 'ALL'));
    filterDictionary();
  });

  // ------------------------------------------------------------------------
  // 4. VISUALIZADOR DO DER EM MODAL COM PANZOOM.JS
  // ------------------------------------------------------------------------
  const derModal = document.getElementById('derModal');
  const openDerModalBtn = document.getElementById('openDerModalBtn');
  const closeDerModalBtn = document.getElementById('closeDerModalBtn');
  const derViewport = document.getElementById('derViewport');
  const panzoomTarget = document.getElementById('panzoomTarget');
  const derImage = document.getElementById('derImage');
  const derFallbackNotice = document.getElementById('derFallbackNotice');
  const zoomInBtn = document.getElementById('zoomInBtn');
  const zoomOutBtn = document.getElementById('zoomOutBtn');
  const zoomResetBtn = document.getElementById('zoomResetBtn');

  let panzoomInstance = null;

  // Tratamento caso o usuário ainda não tenha exportado assets/der.png
  derImage.addEventListener('error', () => {
    derImage.classList.add('hidden');
    derFallbackNotice.classList.remove('hidden');
  });

  derImage.addEventListener('load', () => {
    derImage.classList.remove('hidden');
    derFallbackNotice.classList.add('hidden');
  });

  function initPanzoom() {
    if (typeof Panzoom !== 'undefined' && !panzoomInstance) {
      panzoomInstance = Panzoom(panzoomTarget, {
        maxScale: 5,
        minScale: 0.4,
        step: 0.25,
        contain: false
      });

      // Zoom In e Zoom Out via scroll do mouse no viewport do modal
      derViewport.addEventListener('wheel', (event) => {
        event.preventDefault();
        panzoomInstance.zoomWithWheel(event);
      }, { passive: false });
    }
  }

  function openDerModal() {
    derModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    initPanzoom();
    if (panzoomInstance) {
      panzoomInstance.reset({ animate: false });
    }
  }

  function closeDerModal() {
    derModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  openDerModalBtn.addEventListener('click', openDerModal);
  closeDerModalBtn.addEventListener('click', closeDerModal);

  // Fechar clicando fora da área interna ou pressionando ESC
  derModal.addEventListener('click', (e) => {
    if (e.target === derModal) {
      closeDerModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !derModal.classList.contains('hidden')) {
      closeDerModal();
    }
  });

  // Botões fixos de controle (Zoom +, Zoom -, Reset)
  zoomInBtn.addEventListener('click', () => {
    if (panzoomInstance) panzoomInstance.zoomIn();
  });

  zoomOutBtn.addEventListener('click', () => {
    if (panzoomInstance) panzoomInstance.zoomOut();
  });

  zoomResetBtn.addEventListener('click', () => {
    if (panzoomInstance) panzoomInstance.reset();
  });
});