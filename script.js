(function () {
  'use strict';

  var modal = document.getElementById('video-modal');
  var videoEl = document.getElementById('video-modal-video');
  if (!modal || !videoEl) return;

  function openModal(src) {
    videoEl.src = src;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    videoEl.play().catch(function () {});
  }

  function closeModal() {
    modal.hidden = true;
    videoEl.pause();
    videoEl.removeAttribute('src');
    videoEl.load();
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-video]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(btn.getAttribute('data-video'));
    });
  });

  document.querySelectorAll('[data-video-close]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
})();
