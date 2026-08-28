/* ==========================================================================
   The Graceful Grace — interactive book portfolio

   Ported from the DCLogic class in Portfolio v3.dc.html:
     state = { i, cover, turning, clip }
     open() / go(d) / componentDidMount() keydown  ->  same functions below
     renderVals()                                  ->  render()
   ========================================================================== */

(function () {
  'use strict';

  var PAGES = [
    {
      title: 'Automation Tools', word: 'automation', kicker: 'Automation Tools', meta: 'Tools', type: 'chapter',
      items: [
        { no: '1', name: 'B2B Invoice Automation', desc: 'Shopify, Extensiv WMS, and QuickBooks Online stitched into one invoicing app. Errors down, book close faster, no dedicated labor.', figure: '$13K/yr', result: 'labor cost replaced', video: 'uploads/B2B_Invoice_demo.mp4' },
        { no: '2', name: 'QuickDraft', desc: 'Bulk retailer order generation from a single file upload: 150+ orders drafted at once instead of typed one by one.', figure: '3 hrs/day', result: 'returned to the team', video: 'uploads/QuickDraft_demo.mp4' }
      ]
    },
    {
      title: 'Process & Pipeline Design', word: 'pipelines', kicker: 'Process & Pipeline Design', meta: 'Systems', type: 'chapter',
      items: [
        { no: '3', name: 'Product Launch Pipeline', desc: 'Claude-powered playbook that auto-generates SKUs and GS1 UPCs, builds Shopify pages with SEO content, and syncs new items to EDI vendor systems.', figure: 'Days to hours', result: 'launch prep, end to end', video: null },
        { no: '4', name: 'QVC Dropship Pipeline', desc: "Hourly pipeline that monitors Rithum, creates the order in Extensiv, attaches the shipping label, and notifies the warehouse in Slack before the chargeback window closes.", figure: '100%', result: "on-time within QVC's 48h window", video: 'uploads/QVC_Dropship.mp4' },
        { no: '5', name: 'Wholesale Pricing Operations', desc: 'Built from scratch: shipping-cost equations modeled across 149 accounts, tiered price breaks, and a 7-tier Partnership Incentive Program.', figure: '264%', result: 'growth in monthly order volume', video: null }
      ]
    },
    {
      title: 'Scaling Impact Across Teams', word: 'scaling', kicker: 'Scaling Impact Across Teams', meta: 'Enablement', type: 'chapter',
      items: [
        { no: '6', name: 'Claude Enablement at All-Hands', desc: 'Presented an AI training session to the full company, then helped teams run a time study on their own work to find the tasks worth automating. A personal workflow became a shared method.', figure: '20 FTE', result: 'enabled on an AI workflow', video: 'uploads/AllHands.mp4' },
        { no: '7', name: 'CX Open-Order Audit', desc: 'A Claude scheduled weekly open-order audit report for the CX team, sorting orders into five actionable categories, plus a co-authored SOP so the team owns it.', figure: '2 hrs/week', result: 'saved, backlog stabilized', video: null },
        { no: '8', name: 'Wholesale Team Build-Out', desc: 'Recruited, trained, and managed a cross-functional CX/Finance/Ops team as channels expanded across EDI, QVC, and Amazon.', figure: '3 channels', result: 'one team', video: null }
      ]
    },
    { title: 'Sourcing & Collabs', word: 'collabs', kicker: 'Supplement · Sticker Sheet', meta: 'Scrapbook', type: 'supplement' },
    { title: 'About the Editor', word: 'about', kicker: 'About', meta: 'Grace', type: 'about' },
    { title: 'Get in Touch', word: 'contact', kicker: 'Contact', meta: 'Back cover', type: 'contact' }
  ];

  var state = { i: 0, cover: true, turning: false, clip: null, tocOpen: false };

  var el = {
    stage: document.getElementById('stage'),
    spreadWrap: document.getElementById('spread-wrap'),
    spread: document.getElementById('spread'),
    pageLeft: document.getElementById('page-left'),
    spine: document.getElementById('spine'),
    cover: document.getElementById('cover'),
    tocToggle: document.getElementById('toc-toggle'),
    tocBackdrop: document.getElementById('toc-backdrop'),
    kicker: document.getElementById('page-kicker'),
    folio: document.getElementById('page-folio'),
    word: document.getElementById('page-word'),
    chapterList: document.getElementById('chapter-list'),
    counter: document.getElementById('page-counter'),
    clip: document.getElementById('clip'),
    clipVideo: document.getElementById('clip-video'),
    clipCaption: document.getElementById('clip-caption'),
    contentsItems: Array.prototype.slice.call(document.querySelectorAll('.contents__item')),
    variants: {
      chapter: document.getElementById('variant-chapter'),
      supplement: document.getElementById('variant-supplement'),
      about: document.getElementById('variant-about'),
      contact: document.getElementById('variant-contact')
    }
  };

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderChapterItems(items) {
    return items.map(function (it) {
      var watch = it.video
        ? '<button type="button" class="watch-btn" data-watch data-video="' + escapeHtml(it.video) + '" data-name="' + escapeHtml(it.name) + '">Watch demo →</button>'
        : '';
      return (
        '<article class="chapter-item">' +
          '<span class="item-no">' + escapeHtml(it.no) + '</span>' +
          '<div class="item-body">' +
            '<p class="item-name">' + escapeHtml(it.name) + '</p>' +
            '<p class="item-desc">' + escapeHtml(it.desc) + '</p>' +
            '<p class="item-figure"><span class="highlight">' + escapeHtml(it.figure) + ' ' + escapeHtml(it.result) + '</span></p>' +
          '</div>' +
          '<div class="item-action">' + watch + '</div>' +
        '</article>'
      );
    }).join('');
  }

  function render() {
    var closed = state.cover && !state.turning;
    var n = PAGES.length;
    var i = Math.min(state.i, n - 1);
    var page = PAGES[i];

    el.spreadWrap.classList.toggle('is-open', !closed);
    el.spread.classList.toggle('is-open', !closed);
    el.pageLeft.classList.toggle('is-open', !closed);
    el.spine.classList.toggle('is-open', !closed);

    // Mobile: the left page is a slide-in drawer, toggled independently
    // of the book-open animation above.
    el.pageLeft.classList.toggle('toc-open', state.tocOpen);
    el.tocBackdrop.classList.toggle('is-visible', state.tocOpen);

    if (state.cover) {
      el.cover.hidden = false;
      el.cover.classList.toggle('is-open', !closed);
    } else {
      el.cover.hidden = true;
    }

    el.kicker.textContent = page.kicker;
    el.folio.textContent = String(i * 2 + 3).padStart(2, '0');
    el.word.textContent = page.word;
    el.counter.textContent = (i + 1) + ' / ' + n;

    Object.keys(el.variants).forEach(function (key) {
      el.variants[key].classList.toggle('is-visible', key === page.type);
    });
    if (page.type === 'chapter') {
      el.chapterList.innerHTML = renderChapterItems(page.items);
    }

    el.contentsItems.forEach(function (btn, idx) {
      btn.classList.toggle('is-active', idx === i);
    });

    if (state.clip) {
      el.clip.hidden = false;
      if (el.clipVideo.getAttribute('src') !== state.clip.src) {
        el.clipVideo.src = state.clip.src;
        el.clipVideo.load();
      }
      el.clipVideo.play().catch(function () {});
      el.clipCaption.textContent = state.clip.name + ' — click anywhere to close';
    } else {
      el.clip.hidden = true;
      el.clipVideo.pause();
      el.clipVideo.removeAttribute('src');
      el.clipVideo.load();
    }
  }

  function open() {
    if (state.turning || !state.cover) return;
    state.turning = true;
    render();
    setTimeout(function () {
      state.cover = false;
      state.turning = false;
      render();
    }, 1250);
  }

  function go(d) {
    var n = PAGES.length;
    state.i = (state.i + d + n) % n;
    render();
  }

  function goTo(idx) {
    state.i = idx;
    state.tocOpen = false;
    render();
  }

  function toggleToc() {
    state.tocOpen = !state.tocOpen;
    render();
  }

  function closeToc() {
    state.tocOpen = false;
    render();
  }

  function openClip(video, name) {
    state.clip = { src: video, name: name };
    render();
  }

  function closeClip() {
    state.clip = null;
    render();
  }

  el.cover.addEventListener('click', open);
  document.getElementById('btn-prev').addEventListener('click', function () { go(-1); });
  document.getElementById('btn-next').addEventListener('click', function () { go(1); });

  el.contentsItems.forEach(function (btn) {
    btn.addEventListener('click', function () {
      goTo(parseInt(btn.getAttribute('data-goto'), 10));
    });
  });

  el.chapterList.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-watch]');
    if (!btn) return;
    openClip(btn.getAttribute('data-video'), btn.getAttribute('data-name'));
  });

  el.clip.addEventListener('click', closeClip);

  el.tocToggle.addEventListener('click', toggleToc);
  el.tocBackdrop.addEventListener('click', closeToc);

  window.addEventListener('keydown', function (e) {
    if (state.clip) {
      if (e.key === 'Escape') closeClip();
      return;
    }
    if (state.tocOpen && e.key === 'Escape') {
      closeToc();
      return;
    }
    if (state.cover) {
      if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') open();
      return;
    }
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  });

  render();
})();
