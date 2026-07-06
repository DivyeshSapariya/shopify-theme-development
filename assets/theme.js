/* ==========================================================================
   theme.js — minimal JS, only what's actually needed
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  // FAQ accordion
  document.querySelectorAll('[data-faq]').forEach(function (faq) {
    faq.querySelectorAll('[data-faq-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.theme-faq-item');
        var isOpen = item.classList.contains('is-open');

        // Close any other open item in this same FAQ block first
        faq.querySelectorAll('.theme-faq-item.is-open').forEach(function (openItem) {
          openItem.classList.remove('is-open');
          openItem.querySelector('[data-faq-toggle]').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });
});
