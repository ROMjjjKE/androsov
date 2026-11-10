
(function () {
  'use strict';
  var WA = 'https://wa.me/375336168855';
  var VAN = { L: 300, W: 150, H: 150, KG: 1500, V: 6.75 };
  var ITEMS = [["box-s", "Коробка средняя", "60 × 40 × 40 см", 0.096, 15, [60, 40, 40]], ["box-l", "Коробка большая", "80 × 60 × 50 см", 0.24, 25, [80, 60, 50]], ["sofa", "Диван 2-местный", "190 × 90 × 85 см", 1.45, 70, [190, 90, 85]], ["washer", "Стиральная машина", "85 × 60 × 60 см", 0.31, 65, [85, 60, 60]], ["fridge", "Холодильник", "185 × 70 × 70 см стоя", 0.91, 70, [70, 70, 185]], ["pallet", "Поддон с грузом", "120 × 80 × 150 см", 1.44, 300, [120, 80, 150]], ["cement", "Мешок цемента 50 кг", "70 × 40 × 15 см", 0.042, 50, [70, 40, 15]], ["board", "Пиломатериал, 3 м", "300 × 20 × 10 см", 0.06, 25, [300, 20, 10]]];

  function initDrawer() {
    var d = document.getElementById('drawer');
    var b = document.querySelector('.header .burger');
    if (!d || !b) return;
    var last = null;
    function open() {
      last = document.activeElement;
      d.hidden = false; d.setAttribute('data-open', '');
      b.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-locked');
      var f = d.querySelector('a, button'); if (f) f.focus({ preventScroll: true });
    }
    function close() {
      d.hidden = true; d.removeAttribute('data-open');
      b.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
      if (last) last.focus({ preventScroll: true });
    }
    b.addEventListener('click', function () { d.hidden ? open() : close(); });
    d.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]') || e.target.closest('a') || !e.target.closest('.drawer__in')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !d.hidden) close();
      if (e.key === 'Tab' && !d.hidden) {
        var it = d.querySelectorAll('a, button, input');
        if (!it.length) return;
        var f = it[0], l = it[it.length - 1];
        if (e.shiftKey && document.activeElement === f) { e.preventDefault(); l.focus(); }
        else if (!e.shiftKey && document.activeElement === l) { e.preventDefault(); f.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1024 && !d.hidden) close(); });
  }

  function initFit() {
    var L = document.getElementById('fL');
    if (!L) return;
    var W = document.getElementById('fW'), H = document.getElementById('fH'), M = document.getElementById('fM');
    var rows = document.getElementById('fRows'), title = document.getElementById('fTitle');
    var note = document.getElementById('fNote'), go = document.getElementById('fGo');
    var side = document.getElementById('vSide'), rear = document.getElementById('vRear');

    function drawSide(l, h) {
      var x0 = 40, y0 = 108, bw = 280, bh = 74; // кузов 3 м × 1,5 м
      var p = ['<rect width="360" height="140" fill="#FBF9F4"/>'];
      p.push('<rect x="' + x0 + '" y="' + (y0 - bh) + '" width="' + bw + '" height="' + bh + '" fill="#EFEEE6" stroke="#1D2320" stroke-width="1.6"/>');
      // шасси
      p.push('<path d="M' + (x0 - 18) + ' ' + y0 + ' h' + (bw + 36) + '" stroke="#1D2320" stroke-width="2.4"/>');
      p.push('<circle cx="' + (x0 + 52) + '" cy="' + (y0 + 8) + '" r="7" fill="none" stroke="#1D2320" stroke-width="2"/>');
      p.push('<circle cx="' + (x0 + bw - 44) + '" cy="' + (y0 + 8) + '" r="7" fill="none" stroke="#1D2320" stroke-width="2"/>');
      // груз
      var gw = Math.min(l / VAN.L, 1) * bw, gh = Math.min(h / VAN.H, 1) * bh;
      if (l > 0 && h > 0) {
        p.push('<rect x="' + (x0 + bw - gw) + '" y="' + (y0 - gh) + '" width="' + gw + '" height="' + gh + '" fill="#E0A32B" fill-opacity="0.85" stroke="#B07C15" stroke-width="1"/>');
      }
      // размеры
      p.push('<line x1="' + x0 + '" y1="' + (y0 + 24) + '" x2="' + (x0 + bw) + '" y2="' + (y0 + 24) + '" stroke="#17553C" stroke-width="1"/>');
      p.push('<text x="' + (x0 + bw / 2) + '" y="' + (y0 + 36) + '" text-anchor="middle" font-family="Space Mono, monospace" font-size="8" fill="#17553C">3,0 м</text>');
      p.push('<line x1="' + (x0 - 8) + '" y1="' + (y0 - bh) + '" x2="' + (x0 - 8) + '" y2="' + y0 + '" stroke="#17553C" stroke-width="1"/>');
      p.push('<text x="' + (x0 + 6) + '" y="' + (y0 - bh / 2) + '" font-family="Space Mono, monospace" font-size="8" fill="#17553C">1,5 м</text>');
      p.push('<text x="' + (x0 + bw + 8) + '" y="' + (y0 - 4) + '" font-family="Space Mono, monospace" font-size="7.5" fill="#6E7A72">задняя</text>');
      p.push('<text x="' + (x0 + bw + 8) + '" y="' + (y0 + 4) + '" font-family="Space Mono, monospace" font-size="7.5" fill="#6E7A72">дверь</text>');
      side.innerHTML = p.join('');
    }

    function drawRear(w, h) {
      var cx = 180, y0 = 108, bw = 132, bh = 74;
      var p = ['<rect width="360" height="140" fill="#FBF9F4"/>'];
      p.push('<rect x="' + (cx - bw / 2) + '" y="' + (y0 - bh) + '" width="' + bw + '" height="' + bh + '" fill="#EFEEE6" stroke="#1D2320" stroke-width="1.6"/>');
      p.push('<path d="M' + (cx - bw / 2 - 26) + ' ' + y0 + ' h' + (bw + 52) + '" stroke="#1D2320" stroke-width="2.4"/>');
      p.push('<circle cx="' + (cx - bw / 2 - 10) + '" cy="' + (y0 + 8) + '" r="7" fill="none" stroke="#1D2320" stroke-width="2"/>');
      p.push('<circle cx="' + (cx + bw / 2 + 10) + '" cy="' + (y0 + 8) + '" r="7" fill="none" stroke="#1D2320" stroke-width="2"/>');
      var gw = Math.min(w / VAN.W, 1) * bw, gh = Math.min(h / VAN.H, 1) * bh;
      if (w > 0 && h > 0) {
        p.push('<rect x="' + (cx - gw / 2) + '" y="' + (y0 - gh) + '" width="' + gw + '" height="' + gh + '" fill="#E0A32B" fill-opacity="0.85" stroke="#B07C15" stroke-width="1"/>');
      }
      p.push('<line x1="' + (cx - bw / 2) + '" y1="' + (y0 + 24) + '" x2="' + (cx + bw / 2) + '" y2="' + (y0 + 24) + '" stroke="#17553C" stroke-width="1"/>');
      p.push('<text x="' + cx + '" y="' + (y0 + 36) + '" text-anchor="middle" font-family="Space Mono, monospace" font-size="8" fill="#17553C">1,5 м</text>');
      p.push('<line x1="' + (cx - bw / 2 - 12) + '" y1="' + (y0 - bh) + '" x2="' + (cx - bw / 2 - 12) + '" y2="' + y0 + '" stroke="#17553C" stroke-width="1"/>');
      p.push('<text x="' + (cx - bw / 2 - 16) + '" y="' + (y0 - bh / 2) + '" text-anchor="end" font-family="Space Mono, monospace" font-size="8" fill="#17553C">1,5 м</text>');
      rear.innerHTML = p.join('');
    }

    function num(el) { var v = parseFloat(String(el.value).replace(',', '.')); return isFinite(v) ? v : 0; }

    function calc() {
      var l = num(L), w = num(W), h = num(H), m = num(M);
      var checks = [
        ['Длина', l, VAN.L, 'см'],
        ['Ширина', w, VAN.W, 'см'],
        ['Высота', h, VAN.H, 'см'],
        ['Вес', m, VAN.KG, 'кг']
      ];
      var bad = [];
      rows.innerHTML = checks.map(function (c) {
        var ok = c[1] <= c[2] && c[1] > 0;
        if (!ok) bad.push(c[0].toLowerCase());
        return '<div class="vrow"><b>' + c[0] + '</b><span class="num ' + (ok ? 'ok' : 'bad') + '">' + c[1] + ' / ' + c[2] + '</span>' +
          '<span class="vstate ' + (ok ? 'ok' : 'bad') + '">' + (c[1] > 0 ? (ok ? 'проходит' : 'больше нормы на ' + Math.round(c[1] - c[2]) + ' ' + c[3]) : 'не указано') + '</span></div>';
      }).join('');

      if (!bad.length) {
        var vol = (l / 100) * (w / 100) * (h / 100);
        var pct = vol / VAN.V * 100;
        title.textContent = 'Груз проходит';
        title.className = 'ok';
        note.textContent = 'Объём груза ' + vol.toFixed(2).replace('.', ',') + ' м³ — это примерно ' +
          Math.round(pct) + '% кузова. Остаётся ' + Math.max(0, VAN.V - vol).toFixed(2).replace('.', ',') + ' м³ и ' +
          Math.max(0, VAN.KG - m) + ' кг по весу.';
      } else {
        title.textContent = 'Не проходит: ' + bad.join(', ');
        title.className = 'bad';
        var hint = [];
        if (bad.indexOf('высота') >= 0) hint.push('по высоте кузов 1,5 м: холодильники и высокие шкафы везём лёжа или другой машиной');
        if (bad.indexOf('длина') >= 0) hint.push('длинномер длиннее 3 м в этот кузов не входит');
        if (bad.indexOf('вес') >= 0) hint.push('вес больше 1,5 т — это уже два рейса или другая машина');
        if (bad.indexOf('ширина') >= 0) hint.push('ширина больше 1,5 м не проходит по проёму задних дверей');
        note.textContent = 'Что можно сделать: ' + (hint.length ? hint.join('; ') : 'уточнить размеры') + '. Варианты обсудим по телефону.';
      }

      drawSide(l, h);
      drawRear(w, h);
      go.href = WA + '?text=' + encodeURIComponent('Заявка с сайта: перевозка.\nГруз: ' + l + ' × ' + w + ' × ' + h + ' см, вес ' + m + ' кг.' +
        '\nПроверка по кузову 3 × 1,5 × 1,5 м: ' + (bad.length ? 'не проходит (' + bad.join(', ') + ')' : 'проходит') +
        '\n\nПодскажите стоимость и когда можно.');
    }

    [L, W, H, M].forEach(function (el) { el.addEventListener('input', calc); });
    calc();
  }

  function initTrip() {
    var box = document.getElementById('tItems');
    if (!box) return;
    var qty = {};
    ITEMS.forEach(function (it) { qty[it[0]] = it[0] === 'box-s' ? 8 : it[0] === 'box-l' ? 4 : 0; });

    box.innerHTML = ITEMS.map(function (it) {
      return '<div class="item"><span>' + it[1] + '<em>' + it[2] + ' · ' + String(it[3]).replace('.', ',') + ' м³ · ' + it[4] + ' кг</em></span>' +
        '<span class="step"><button type="button" data-m="-1" data-k="' + it[0] + '" aria-label="Убрать">−</button>' +
        '<i data-q="' + it[0] + '">0</i><button type="button" data-m="1" data-k="' + it[0] + '" aria-label="Добавить">+</button></span></div>';
    }).join('');

    var pctEl = document.getElementById('tPct'), volEl = document.getElementById('tVol'), wtEl = document.getElementById('tWt');
    var volBar = document.querySelector('#tVolBar i'), wtBar = document.querySelector('#tWtBar i');
    var rides = document.getElementById('tRides'), alerts = document.getElementById('tAlerts'), go = document.getElementById('tGo');

    function calc() {
      var vol = 0, wt = 0, list = [], bad = [];
      ITEMS.forEach(function (it) {
        var q = qty[it[0]] || 0;
        if (!q) return;
        vol += it[3] * q; wt += it[4] * q;
        list.push(it[1] + ' — ' + q + ' шт');
        if (it[5][0] > VAN.L || it[5][1] > VAN.W || it[5][2] > VAN.H) {
          bad.push(it[1] + ': ' + it[2]);
        }
        box.querySelector('[data-q="' + it[0] + '"]').textContent = q;
      });
      var pv = Math.min(vol / VAN.V * 100, 100), pw = Math.min(wt / VAN.KG * 100, 100);
      pctEl.textContent = Math.round(Math.max(pv, pw)) + '%';
      volEl.textContent = vol.toFixed(2).replace('.', ',') + ' / 6,75 м³';
      wtEl.textContent = Math.round(wt) + ' / 1500 кг';
      volBar.style.width = pv + '%';
      wtBar.style.width = pw + '%';
      document.getElementById('tVolBar').className = 'bar' + (vol > VAN.V ? ' over' : '');
      document.getElementById('tWtBar').className = 'bar' + (wt > VAN.KG ? ' over' : '');

      var n = Math.max(Math.ceil(vol / VAN.V), Math.ceil(wt / VAN.KG), 1);
      if (!list.length) rides.textContent = 'Список пуст: добавьте вещи, чтобы увидеть заполнение.';
      else if (n === 1) rides.textContent = 'Это один рейс. ' + (vol > 0 ? 'По объёму занято ' + Math.round(vol / VAN.V * 100) + '%.' : '');
      else rides.textContent = 'Нужно рейсов: ' + n + '. Лимит выбирает ' + (vol / VAN.V >= wt / VAN.KG ? 'объём' : 'вес') + '.';

      alerts.innerHTML = bad.length ? '<div class="alert">Не проходит по габаритам кузова: ' + bad.join('; ') + '. Обсудим: разобрать, положить лёжа или другая машина.</div>' : '';

      go.href = WA + '?text=' + encodeURIComponent('Заявка с сайта: перевозка.\nСписок груза:\n' +
        list.map(function (s) { return '— ' + s; }).join('\n') +
        '\n\nОбъём: ' + vol.toFixed(2).replace('.', ',') + ' м³, вес: ' + Math.round(wt) + ' кг.' +
        '\nРейсов: ' + n + '.\n\nПодскажите стоимость и время.');
    }

    box.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-k]'); if (!b) return;
      var k = b.getAttribute('data-k'), d = parseInt(b.getAttribute('data-m'), 10);
      qty[k] = Math.max(0, Math.min(60, (qty[k] || 0) + d));
      calc();
    });
    calc();
  }

  function initLead() {
    var f = document.getElementById('lead');
    if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = document.getElementById('lName'), t = document.getElementById('lTel');
      var from = document.getElementById('lFrom'), to = document.getElementById('lTo'), c = document.getElementById('lCargo');
      var bad = false;
      [n, t].forEach(function (el) {
        if (!el.value.trim()) { el.style.borderColor = '#A3341C'; bad = true; } else { el.style.borderColor = ''; }
      });
      if (bad) return;
      var msg = 'Заявка с сайта: грузоперевозка.\nИмя: ' + n.value.trim() + '\nТелефон: ' + t.value.trim() +
        (from && from.value.trim() ? '\nОткуда: ' + from.value.trim() : '') +
        (to && to.value.trim() ? '\nКуда: ' + to.value.trim() : '') +
        (c && c.value.trim() ? '\nГруз: ' + c.value.trim() : '') +
        '\n\nФото груза прикреплю следом.';
      window.open(WA + '?text=' + encodeURIComponent(msg), '_blank');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initDrawer(); initFit(); initTrip(); initLead();
    var y = document.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();
  });
})();
