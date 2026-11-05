$(function () {
  const $menu = $('#mobile-menu');
  const $menuToggle = $('#menu-toggle');
  const $themeToggle = $('#theme-toggle');
  const $themeIcon = $('#theme-icon');
  const $progressBar = $('#reading-progress-bar');

  // Menú móvil accesible
  $menuToggle.on('click', function () {
    const isExpanded = $(this).attr('aria-expanded') === 'true';
    $(this).attr('aria-expanded', String(!isExpanded));
    $(this).attr('aria-label', isExpanded ? 'Abrir menú' : 'Cerrar menú');
    $menu.toggleClass('hidden', isExpanded);
  });

  $menu.find('a').on('click', function () {
    $menu.addClass('hidden');
    $menuToggle.attr('aria-expanded', 'false').attr('aria-label', 'Abrir menú');
  });

  // Tema claro / oscuro con preferencia guardada (con fallback si el navegador bloquea storage)
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('san-gines-theme'); } catch (error) { /* almacenamiento no disponible */ }
  if (savedTheme === 'dark') document.documentElement.classList.add('dark');
  updateThemeIcon();

  $themeToggle.on('click', function () {
    document.documentElement.classList.toggle('dark');
    const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    try { localStorage.setItem('san-gines-theme', theme); } catch (error) { /* el cambio visual sigue funcionando */ }
    updateThemeIcon();
  });

  function updateThemeIcon() {
    const isDark = document.documentElement.classList.contains('dark');
    $themeToggle.attr('aria-label', isDark ? 'Activar modo claro' : 'Activar modo oscuro');
    $themeIcon.html(isDark
      ? '<path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z"/>'
      : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>');
  }

  // Librería adicional AOS: animaciones al entrar los elementos en pantalla.
  if (window.AOS) {
    AOS.init({ duration: 750, easing: 'ease-out-quart', once: true, offset: 70, disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches });
  }

  // Barra de lectura: indica cuánto ha avanzado el usuario por la página.
  function updateReadingProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    $progressBar.css('width', `${Math.min(100, Math.max(0, progress))}%`);
  }
  updateReadingProgress();
  $(window).on('scroll resize', updateReadingProgress);

  // Cierre del menú con Escape para mejorar la navegación por teclado.
  $(document).on('keydown', function (event) {
    if (event.key === 'Escape' && !$menu.hasClass('hidden')) {
      $menu.addClass('hidden');
      $menuToggle.attr('aria-expanded', 'false').attr('aria-label', 'Abrir menú').trigger('focus');
    }
  });
});
