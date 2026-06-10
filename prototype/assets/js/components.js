/* Component nhỏ dùng chung cho prototype tĩnh. */
(function () {
  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function money(value) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value || 0);
  }

  function dateTime(value) {
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
  }

  function badge(text, tone) {
    return '<span class="badge badge-' + esc(tone || 'neutral') + '">' + esc(text) + '</span>';
  }

  function kpi(items) {
    return '<div class="kpi-grid">' + items.map(function (item) {
      return '<div class="kpi-tile tone-' + esc(item.tone || 'blue') + '">' +
        '<div class="kpi-label">' + esc(item.label) + '</div>' +
        '<div class="kpi-value">' + esc(item.value) + '</div>' +
        '<div class="kpi-note">' + esc(item.note || '') + '</div>' +
      '</div>';
    }).join('') + '</div>';
  }

  function table(columns, rows, emptyText) {
    if (!rows || !rows.length) {
      return '<div class="empty">' + esc(emptyText || 'Chưa có dữ liệu') + '</div>';
    }
    return '<div class="table-wrap"><table><thead><tr>' + columns.map(function (col) {
      return '<th>' + esc(col.label) + '</th>';
    }).join('') + '</tr></thead><tbody>' + rows.map(function (row) {
      return '<tr>' + columns.map(function (col) {
        var value = typeof col.render === 'function' ? col.render(row) : row[col.key];
        return '<td>' + (value == null ? '' : value) + '</td>';
      }).join('') + '</tr>';
    }).join('') + '</tbody></table></div>';
  }

  function panel(title, body, action) {
    return '<section class="panel">' +
      '<div class="panel-head"><div><h2>' + esc(title) + '</h2></div>' + (action || '') + '</div>' +
      '<div class="panel-body">' + body + '</div>' +
    '</section>';
  }

  function tabs(items, active, baseHash) {
    return '<div class="tabs">' + items.map(function (item) {
      var cls = item.id === active ? 'tab active' : 'tab';
      return '<a class="' + cls + '" href="' + baseHash + '/' + item.id + '">' + esc(item.label) + '</a>';
    }).join('') + '</div>';
  }

  function modal(title, body, footer) {
    var root = document.getElementById('modal-root');
    root.hidden = false;
    root.innerHTML = '<div class="modal" role="dialog" aria-modal="true">' +
      '<div class="modal-head"><h2>' + esc(title) + '</h2><button class="icon-btn" data-close-modal type="button">×</button></div>' +
      '<div class="modal-body">' + body + '</div>' +
      '<div class="modal-foot">' + (footer || '') + '</div>' +
    '</div>';
  }

  function closeModal() {
    var root = document.getElementById('modal-root');
    root.hidden = true;
    root.innerHTML = '';
  }

  function toast(message, tone) {
    var wrap = document.getElementById('toast-wrap');
    var item = document.createElement('div');
    item.className = 'toast toast-' + (tone || 'info');
    item.textContent = message;
    wrap.appendChild(item);
    setTimeout(function () { item.remove(); }, 3200);
  }

  document.addEventListener('click', function (event) {
    if (event.target.matches('[data-close-modal]') || event.target.id === 'modal-root') closeModal();
  });

  window.UI = { esc: esc, money: money, dateTime: dateTime, badge: badge, kpi: kpi, table: table, panel: panel, tabs: tabs, modal: modal, closeModal: closeModal, toast: toast };
})();
