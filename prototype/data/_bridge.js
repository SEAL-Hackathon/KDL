/* Bridge dữ liệu thật từ charts_html/data/*.js sang namespace dùng riêng của prototype. */
(function () {
  window.KDL_SOURCE = {
    slides: typeof SLIDES !== 'undefined' ? SLIDES : [],
    toData: typeof TO_DATA !== 'undefined' ? TO_DATA : {},
    reqs: typeof REQS_DATA !== 'undefined' ? REQS_DATA : {},
    frMap: typeof FR_MAP !== 'undefined' ? FR_MAP : {},
    nfr: typeof NFR_DATA !== 'undefined' ? NFR_DATA : [],
    schema: typeof SCHEMA_DATA !== 'undefined' ? SCHEMA_DATA : {}
  };
})();
