'use strict';

System.register(['./datasource', './query_ctrl'], function (_export, _context) {
  "use strict";

  var KustoDatasource, KustoQueryCtrl, GenericConfigCtrl, GenericQueryOptionsCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_datasource) {
      KustoDatasource = _datasource.KustoDatasource;
    }, function (_query_ctrl) {
      KustoQueryCtrl = _query_ctrl.KustoQueryCtrl;
    }],
    execute: function () {
      _export('ConfigCtrl', GenericConfigCtrl = function GenericConfigCtrl() {
        _classCallCheck(this, GenericConfigCtrl);
      });

      GenericConfigCtrl.templateUrl = 'partials/config.html';

      _export('QueryOptionsCtrl', GenericQueryOptionsCtrl = function GenericQueryOptionsCtrl() {
        _classCallCheck(this, GenericQueryOptionsCtrl);
      });

      GenericQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

      _export('Datasource', KustoDatasource);

      _export('QueryCtrl', KustoQueryCtrl);

      _export('ConfigCtrl', GenericConfigCtrl);

      _export('QueryOptionsCtrl', GenericQueryOptionsCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map

