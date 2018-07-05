'use strict';

System.register(['app/plugins/sdk'], function (_export, _context) {
  "use strict";

  var QueryCtrl, _createClass, defaultQuery, KustoQueryCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_appPluginsSdk) {
      QueryCtrl = _appPluginsSdk.QueryCtrl;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      defaultQuery = '<Table Name> \n| $__timeFilter(<Time Column>) \n| order\xA0by\xA0<Time Column> asc';

      _export('KustoQueryCtrl', KustoQueryCtrl = function (_QueryCtrl) {
        _inherits(KustoQueryCtrl, _QueryCtrl);

        function KustoQueryCtrl($scope, $injector) {
          _classCallCheck(this, KustoQueryCtrl);

          var _this = _possibleConstructorReturn(this, (KustoQueryCtrl.__proto__ || Object.getPrototypeOf(KustoQueryCtrl)).call(this, $scope, $injector));

          _this.scope = $scope;

          _this.target.target = _this.target.target || 'select metric';

          _this.target.format = _this.target.format || 'timeserie';

          _this.formats = [{ text: 'Time series', value: 'time_series' }, { text: 'Table', value: 'table' }];

          _this.target.csl = _this.target.csl || defaultQuery;

          _this.showhelp = false;

          return _this;
        }

        _createClass(KustoQueryCtrl, [{
          key: 'getOptions',
          value: function getOptions(query) {

            return this.datasource.metricFindQuery(query || '');
          }
        }, {
          key: 'toggleEditorMode',
          value: function toggleEditorMode() {

            this.target.rawQuery = !this.target.rawQuery;
          }
        }, {
          key: 'onChangeInternal',
          value: function onChangeInternal() {

            this.panelCtrl.refresh(); // Asks the panel to refresh data.
          }
        }]);

        return KustoQueryCtrl;
      }(QueryCtrl));

      _export('KustoQueryCtrl', KustoQueryCtrl);

      KustoQueryCtrl.templateUrl = 'partials/query.editor.html';
    }
  };
});
//# sourceMappingURL=query_ctrl.js.map
