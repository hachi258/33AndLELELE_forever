/* ============================================================
 *  main.js —— 全站交互逻辑
 *  内容全部来自 js/data.js，这里只负责「怎么显示」。
 * ============================================================ */
(function () {
  'use strict';

  var DATA = window.COUPLE || {};
  var PLACEHOLDER = 'images/p1.svg';
  var DAY = 86400000;

  /* ---------------- 小工具 ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function parseDate(str) {
    var p = String(str || '').split('-');
    return new Date(+p[0], (+p[1] || 1) - 1, +p[2] || 1, 0, 0, 0, 0);
  }

  function startOfToday() {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  }

  function fmtDate(str) {
    var p = String(str || '').split('-');
    if (p.length >= 3) return p[0] + '.' + pad(+p[1]) + '.' + pad(+p[2]);
    if (p.length === 2) return pad(+p[0]) + '月' + pad(+p[1]) + '日';
    return str || '';
  }

  function fmtCn(str) {
    var p = String(str || '').split('-');
    if (p.length >= 3) return p[0] + ' 年 ' + (+p[1]) + ' 月 ' + (+p[2]) + ' 日';
    if (p.length === 2) return '每年 ' + (+p[0]) + ' 月 ' + (+p[1]) + ' 日';
    return str || '';
  }

  function daysBetween(a, b) { return Math.round((b - a) / DAY); }

  /* 图片标签（带加载失败的兜底图） */
  function img(src, alt, cls) {
    return '<img src="' + esc(src) + '" alt="' + esc(alt) + '"' +
      (cls ? ' class="' + cls + '"' : '') + ' loading="lazy" decoding="async">';
  }

  // 任意图片加载失败时，自动替换成占位图，避免出现破图
  document.addEventListener('error', function (e) {
    var el = e.target;
    if (el && el.tagName === 'IMG' && el.src.indexOf('p1.svg') === -1) {
      el.src = PLACEHOLDER;
    }
  }, true);

  /* ---------------- 站点信息注入 ---------------- */
  function injectSiteInfo() {
    var site = DATA.site || {};

    $$('[data-site-brand]').forEach(function (el) {
      var a = (DATA.people && DATA.people.a && DATA.people.a.name) || '我';
      var b = (DATA.people && DATA.people.b && DATA.people.b.name) || '你';
      el.innerHTML = esc(a) + ' <em>&amp;</em> ' + esc(b);
    });

    $$('[data-site-subtitle]').forEach(function (el) { el.textContent = site.subtitle || ''; });
    $$('[data-site-footer]').forEach(function (el) { el.textContent = site.footer || ''; });
    $$('[data-since-text]').forEach(function (el) { el.textContent = fmtDate(site.since); });

    var y = $('#year');
    if (y) y.textContent = new Date().getFullYear();

    var days = 0;
    if (site.since) days = Math.max(0, daysBetween(parseDate(site.since), startOfToday()));
    $$('.js-days').forEach(function (el) { el.textContent = days; });
    var fd = $('#footerDays');
    if (fd) fd.textContent = days;
  }

  /* ---------------- 导航 ---------------- */
  function initNav() {
    var header = $('#siteHeader');
    var toggle = $('#navToggle');
    var nav = $('#siteNav');

    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        toggle.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      $$('.nav-link', nav).forEach(function (a) {
        a.addEventListener('click', function () {
          nav.classList.remove('is-open');
          toggle.classList.remove('is-open');
        });
      });
    }

    // 高亮当前页面
    var page = document.body.getAttribute('data-page');
    $$('.nav-link').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if ((page === 'home' && href.indexOf('index') === 0) ||
          (page === 'timeline' && href.indexOf('timeline') === 0) ||
          (page === 'gallery' && href.indexOf('gallery') === 0) ||
          (page === 'places' && href.indexOf('places') === 0)) {
        a.classList.add('is-active');
      }
    });

    var toTop = $('#toTop');
    function onScroll() {
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 20);
      if (toTop) toTop.classList.toggle('is-show', window.scrollY > 420);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ---------------- 滚动出现动画 ---------------- */
  var revealObserver = null;
  function observeReveal() {
    var items = $$('[data-reveal]:not(.is-visible)');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    }
    items.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 5) * 70 + 'ms';
      revealObserver.observe(el);
    });
  }

  /* ---------------- 数字滚动 ---------------- */
  function animateNumber(el, to, duration) {
    var from = 0;
    var start = null;
    duration = duration || 1400;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (to - from) * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------------- 首页：在一起天数 ---------------- */
  function initDays() {
    var site = DATA.site || {};
    if (!site.since || !$('#daysTogether')) return;

    var start = parseDate(site.since);
    var days = Math.max(0, daysBetween(start, startOfToday()));

    animateNumber($('#daysTogether'), days);
    if ($('#daysExact')) $('#daysExact').textContent = days;
    if ($('#dayIndex')) $('#dayIndex').textContent = days + 1;

    var a = DATA.people && DATA.people.a;
    var b = DATA.people && DATA.people.b;
    var ht = $('[data-hero-title]');
    if (a && b && ht) {
      ht.innerHTML = esc(a.name) + ' <span class="amp">&amp;</span> ' + esc(b.name);
    }
    var av = $('#avatarBox');
    if (av && a && b) {
      av.innerHTML = [a, b].map(function (p) {
        return '<div class="avatar-item">' +
          img(p.avatar || PLACEHOLDER, p.name, 'avatar') +
          '<div class="avatar-name">' + esc(p.name) + '</div>' +
          '</div>';
      }).join('');
    }
  }

  /* ---------------- 纪念日计算 ---------------- */
  function isRecurring(str) { return String(str).split('-').length === 2; }

  /* 返回 {next: Date, label: string} */
  function nextOccurrence(str) {
    var today = startOfToday();
    if (isRecurring(str)) {
      var p = String(str).split('-');
      var d = new Date(today.getFullYear(), +p[0] - 1, +p[1]);
      if (daysBetween(today, d) < 0) d = new Date(today.getFullYear() + 1, +p[0] - 1, +p[1]);
      return d;
    }
    var full = parseDate(str);
    return daysBetween(today, full) >= 0 ? full : null;
  }

  /* ---------------- 首页：倒计时 ---------------- */
  function initCountdown() {
    var box = $('#cdTitle');
    if (!box) return;

    var list = (DATA.anniversaries || []).map(function (a) {
      return { item: a, next: nextOccurrence(a.date) };
    }).filter(function (x) { return x.next; })
      .sort(function (x, y) { return x.next - y.next; });

    if (!list.length) {
      $('#cdDate').textContent = '去 js/data.js 里添加纪念日吧';
      return;
    }

    var target = list[0];
    var targetDate = new Date(target.next.getFullYear(), target.next.getMonth(), target.next.getDate(), 0, 0, 0, 0);

    $('#cdTitle').textContent = (target.item.emoji ? target.item.emoji + ' ' : '') + target.item.title;
    $('#cdDate').textContent = fmtCn(target.item.date) + ' · ' + fmtDate(
      targetDate.getFullYear() + '-' + pad(targetDate.getMonth() + 1) + '-' + pad(targetDate.getDate())
    );

    var elD = $('#cdDays'), elH = $('#cdHours'), elM = $('#cdMins'), elS = $('#cdSecs');

    function tick() {
      var diff = targetDate - new Date();
      if (diff < 0) diff = 0;
      var d = Math.floor(diff / DAY);
      var h = Math.floor(diff % DAY / 3600000);
      var m = Math.floor(diff % 3600000 / 60000);
      var s = Math.floor(diff % 60000 / 1000);
      elD.textContent = pad(d);
      elH.textContent = pad(h);
      elM.textContent = pad(m);
      elS.textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------- 首页：情话打字机 ---------------- */
  function initTypewriter() {
    var el = $('#typewriter');
    var quotes = DATA.quotes || [];
    if (!el || !quotes.length) return;

    var qi = 0, ci = 0, deleting = false;

    function loop() {
      var text = quotes[qi];
      el.textContent = text.slice(0, ci);

      if (!deleting && ci < text.length) {
        ci++;
        setTimeout(loop, 90);
      } else if (!deleting && ci === text.length) {
        deleting = true;
        setTimeout(loop, 2200);
      } else if (deleting && ci > 0) {
        ci--;
        setTimeout(loop, 35);
      } else {
        deleting = false;
        qi = (qi + 1) % quotes.length;
        setTimeout(loop, 320);
      }
    }
    loop();
  }

  /* ---------------- 首页：最近点滴 + 相册预览 ---------------- */
  function sortByDateDesc(list) {
    return list.slice().sort(function (a, b) { return parseDate(b.date) - parseDate(a.date); });
  }

  function initHomeLists() {
    var recent = $('#recentList');
    if (recent) {
      var items = sortByDateDesc(DATA.timeline || []).slice(0, 3);
      recent.innerHTML = items.map(function (it) {
        return '<article class="card mini-item" data-reveal>' +
          '<div class="mini-date">' + esc(fmtDate(it.date)) + '</div>' +
          '<div class="mini-body">' +
            '<h4>' + esc(it.title) + '</h4>' +
            '<p>' + esc(it.text || '') + '</p>' +
          '</div>' +
          (it.tag ? '<span class="tag">' + esc(it.tag) + '</span>' : '') +
        '</article>';
      }).join('');
    }

    var grid = $('#previewGrid');
    if (grid) {
      var photos = (DATA.gallery || []).slice(0, 6);
      grid.innerHTML = photos.map(function (p) {
        return '<a class="preview-item" href="gallery.html" data-title="' + esc(p.title || '') + '">' +
          img(p.src, p.title || '照片') +
        '</a>';
      }).join('');
    }
  }

  /* ---------------- 纪念日页面 ---------------- */
  function initAnniversaries() {
    var grid = $('#anniGrid');
    if (!grid) return;

    var today = startOfToday();
    var list = (DATA.anniversaries || []).map(function (a, i) {
      var next = nextOccurrence(a.date);
      return {
        data: a,
        index: i,
        next: next,
        days: next ? daysBetween(today, next) : null
      };
    }).sort(function (x, y) {
      if (x.days === null) return 1;
      if (y.days === null) return -1;
      return x.days - y.days;
    });

    grid.innerHTML = list.map(function (x, i) {
      var a = x.data;
      var isNext = i === 0 && x.days !== null;
      var countText, dateText;

      if (x.days === null) {
        countText = '<b>—</b><span>已经过去啦</span>';
      } else if (x.days === 0) {
        countText = '<b>今天</b><span>就是这一天</span>';
      } else {
        countText = '<b>' + x.days + '</b><span>天后</span>';
      }
      dateText = fmtCn(a.date);

      return '<article class="card anni-card' + (isNext ? ' is-next' : '') + '" data-reveal>' +
        (isNext ? '<span class="anni-badge">最近的一个</span>' : '') +
        '<div class="anni-emoji">' + esc(a.emoji || '💙') + '</div>' +
        '<h3>' + esc(a.title) + '</h3>' +
        '<div class="anni-date">' + esc(dateText) + '</div>' +
        (a.note ? '<p>' + esc(a.note) + '</p>' : '') +
        '<div class="anni-count">' + countText + '</div>' +
      '</article>';
    }).join('');
  }

  /* ---------------- 时间轴页面 ---------------- */
  function initTimeline() {
    var list = $('#timelineList');
    if (!list) return;

    var items = sortByDateDesc(DATA.timeline || []);
    var filterBar = $('#tlFilter');
    var current = '全部';

    var tags = ['全部'];
    items.forEach(function (it) {
      if (it.tag && tags.indexOf(it.tag) === -1) tags.push(it.tag);
    });

    function render() {
      var shown = current === '全部' ? items : items.filter(function (it) { return it.tag === current; });

      if (!shown.length) {
        list.innerHTML = '<p class="tl-empty">这一类还没有记录～</p>';
        return;
      }

      list.innerHTML = shown.map(function (it) {
        return '<div class="tl-item" data-reveal>' +
          '<article class="card tl-card">' +
            '<div class="tl-top">' +
              '<span class="tl-date">' + esc(fmtDate(it.date)) + '</span>' +
              (it.tag ? '<span class="tag">' + esc(it.tag) + '</span>' : '') +
            '</div>' +
            '<h3>' + esc(it.title) + '</h3>' +
            (it.text ? '<p>' + esc(it.text) + '</p>' : '') +
            (it.image ? '<div class="tl-photo" data-lb-src="' + esc(it.image) + '" data-lb-title="' + esc(it.title) + '" data-lb-meta="' + esc(fmtDate(it.date)) + '">' +
              img(it.image, it.title) + '</div>' : '') +
          '</article>' +
        '</div>';
      }).join('');

      observeReveal();
    }

    if (filterBar && tags.length > 2) {
      filterBar.innerHTML = tags.map(function (t) {
        return '<button class="filter-btn' + (t === current ? ' is-active' : '') + '" data-tag="' + esc(t) + '">' + esc(t) + '</button>';
      }).join('');

      filterBar.addEventListener('click', function (e) {
        var btn = e.target.closest('.filter-btn');
        if (!btn) return;
        current = btn.getAttribute('data-tag');
        $$('.filter-btn', filterBar).forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        render();
      });
    } else if (filterBar) {
      filterBar.hidden = true;
    }

    render();
  }

  /* ---------------- 相册页面 + 灯箱 ---------------- */
  function initGallery() {
    var grid = $('#galleryGrid');
    if (!grid) return;

    var all = DATA.gallery || [];
    var filterBar = $('#galFilter');
    var current = '全部';
    var shown = all.slice();

    var cats = ['全部'];
    all.forEach(function (p) {
      if (p.category && cats.indexOf(p.category) === -1) cats.push(p.category);
    });

    var countEl = $('.js-photo-count');
    if (countEl) countEl.textContent = all.length;

    function render() {
      shown = current === '全部' ? all.slice() : all.filter(function (p) { return p.category === current; });

      var empty = $('#galEmpty');
      if (empty) empty.hidden = shown.length > 0;

      grid.innerHTML = shown.map(function (p, i) {
        return '<figure class="gal-item" data-index="' + i + '" style="animation-delay:' + (i % 10) * 45 + 'ms">' +
          img(p.src, p.title || '照片') +
          '<figcaption class="gal-info">' +
            '<h4>' + esc(p.title || '') + '</h4>' +
            '<span>' + esc(fmtDate(p.date)) + (p.category ? ' · ' + esc(p.category) : '') + '</span>' +
          '</figcaption>' +
        '</figure>';
      }).join('');
    }

    if (filterBar && cats.length > 2) {
      filterBar.innerHTML = cats.map(function (c) {
        return '<button class="filter-btn' + (c === current ? ' is-active' : '') + '" data-cat="' + esc(c) + '">' + esc(c) + '</button>';
      }).join('');

      filterBar.addEventListener('click', function (e) {
        var btn = e.target.closest('.filter-btn');
        if (!btn) return;
        current = btn.getAttribute('data-cat');
        $$('.filter-btn', filterBar).forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        render();
      });
    } else if (filterBar) {
      filterBar.hidden = true;
    }

    render();

    /* ---- 灯箱 ---- */
    var lb = $('#lightbox');
    if (!lb) return;

    var lbImg = $('#lbImg'), lbTitle = $('#lbTitle'), lbMeta = $('#lbMeta');
    var idx = 0;

    function show(i) {
      if (!shown.length) return;
      idx = (i + shown.length) % shown.length;
      var p = shown[idx];
      lbImg.src = p.src;
      lbImg.alt = p.title || '照片';
      lbTitle.textContent = p.title || '';
      lbMeta.textContent = fmtDate(p.date) + (p.category ? ' · ' + p.category : '') + '   (' + (idx + 1) + '/' + shown.length + ')';
    }

    function open(i) {
      show(i);
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    grid.addEventListener('click', function (e) {
      var fig = e.target.closest('.gal-item');
      if (!fig) return;
      open(+fig.getAttribute('data-index'));
    });

    $('#lbClose').addEventListener('click', close);
    $('#lbPrev').addEventListener('click', function () { show(idx - 1); });
    $('#lbNext').addEventListener('click', function () { show(idx + 1); });

    lb.addEventListener('click', function (e) {
      if (e.target === lb) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });

    // 触摸滑动切图
    var startX = null;
    lb.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      startX = null;
    }, { passive: true });
  }

  /* ---------------- 足迹页面 ---------------- */
  function initPlaces() {
    var grid = $('#placeGrid');
    if (!grid) return;

    var all = DATA.places || [];
    var filterBar = $('#placeFilter');
    var current = '全部';

    var tags = ['全部'];
    all.forEach(function (p) {
      (p.tags || []).forEach(function (t) { if (tags.indexOf(t) === -1) tags.push(t); });
    });

    /* 统计数字 */
    var statGrid = $('#statGrid');
    if (statGrid) {
      var site = DATA.site || {};
      var days = site.since ? Math.max(0, daysBetween(parseDate(site.since), startOfToday())) : 0;
      var stats = [
        { num: all.length, label: '一起去过的城市' },
        { num: (DATA.gallery || []).length, label: '相册里的照片' },
        { num: (DATA.timeline || []).length, label: '记录下的点滴' },
        { num: days, label: '在一起的天数' }
      ];
      statGrid.innerHTML = stats.map(function (s, i) {
        return '<div class="card stat-card" data-reveal>' +
          '<div class="stat-num" data-count="' + s.num + '">0</div>' +
          '<div class="stat-label">' + esc(s.label) + '</div>' +
        '</div>';
      }).join('');

      // 数字滚动
      $$('[data-count]', statGrid).forEach(function (el) {
        var run = function () { animateNumber(el, +el.getAttribute('data-count'), 1200); };
        if ('IntersectionObserver' in window) {
          var io = new IntersectionObserver(function (ents) {
            ents.forEach(function (en) {
              if (en.isIntersecting) { run(); io.disconnect(); }
            });
          }, { threshold: 0.4 });
          io.observe(el);
        } else { run(); }
      });
    }

    function render() {
      var shown = current === '全部' ? all : all.filter(function (p) {
        return (p.tags || []).indexOf(current) !== -1;
      });

      var empty = $('#placeEmpty');
      if (empty) empty.hidden = shown.length > 0;

      grid.innerHTML = shown.map(function (p) {
        return '<article class="card place-card" data-reveal>' +
          '<div class="place-cover">' +
            img(p.cover, p.city) +
            (p.region ? '<span class="place-region">' + esc(p.region) + '</span>' : '') +
            '<span class="place-city">' + esc(p.city) + '</span>' +
          '</div>' +
          '<div class="place-body">' +
            '<div class="place-date">' + esc(fmtDate(p.date)) + '</div>' +
            (p.note ? '<p>' + esc(p.note) + '</p>' : '') +
            '<div class="place-tags">' + (p.tags || []).map(function (t) {
              return '<span class="tag">' + esc(t) + '</span>';
            }).join('') + '</div>' +
          '</div>' +
        '</article>';
      }).join('');

      observeReveal();
    }

    if (filterBar && tags.length > 2) {
      filterBar.innerHTML = tags.map(function (t) {
        return '<button class="filter-btn' + (t === current ? ' is-active' : '') + '" data-tag="' + esc(t) + '">' + esc(t) + '</button>';
      }).join('');

      filterBar.addEventListener('click', function (e) {
        var btn = e.target.closest('.filter-btn');
        if (!btn) return;
        current = btn.getAttribute('data-tag');
        $$('.filter-btn', filterBar).forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        render();
      });
    } else if (filterBar) {
      filterBar.hidden = true;
    }

    render();
  }

  /* ---------------- 时间轴里的小图也可以点开看 ---------------- */
  function initTimelinePhotos() {
    var lb = $('#lightbox');
    if (!lb) return; // 时间轴页没有灯箱，跳过
    document.addEventListener('click', function (e) {
      var box = e.target.closest('.tl-photo');
      if (!box) return;
      $('#lbImg').src = box.getAttribute('data-lb-src');
      $('#lbTitle').textContent = box.getAttribute('data-lb-title') || '';
      $('#lbMeta').textContent = box.getAttribute('data-lb-meta') || '';
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  }

  /* ---------------- 撒小心心 ---------------- */
  function initHeartFab() {
    var fab = $('#heartFab');
    if (!fab) return;
    var icons = ['♥', '💙', '💗', '✨'];

    fab.addEventListener('click', function () {
      var rect = fab.getBoundingClientRect();
      for (var i = 0; i < 9; i++) {
        (function (i) {
          var span = document.createElement('span');
          span.className = 'heart-pop';
          span.textContent = icons[i % icons.length];
          span.style.left = (rect.left + rect.width / 2 + (Math.random() * 60 - 30)) + 'px';
          span.style.top = (rect.top + rect.height / 2) + 'px';
          span.style.animationDelay = (i * 55) + 'ms';
          span.style.fontSize = (14 + Math.random() * 12) + 'px';
          document.body.appendChild(span);
          setTimeout(function () { span.remove(); }, 1500 + i * 55);
        })(i);
      }
    });
  }

  /* ---------------- 启动 ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
    injectSiteInfo();
    initNav();
    initDays();
    initCountdown();
    initTypewriter();
    initHomeLists();
    initAnniversaries();
    initTimeline();
    initGallery();
    initPlaces();
    initTimelinePhotos();
    initHeartFab();
    observeReveal();
  });
})();
