'use strict';

System.register(['lodash'], function (_export, _context) {
                "use strict";

                var _, _createClass, KustoDatasource;

                function _classCallCheck(instance, Constructor) {
                                if (!(instance instanceof Constructor)) {
                                                throw new TypeError("Cannot call a class as a function");
                                }
                }

                return {
                                setters: [function (_lodash) {
                                                _ = _lodash.default;
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

                                                _export('KustoDatasource', KustoDatasource = function () {
                                                                function KustoDatasource(instanceSettings, $q, backendSrv, templateSrv) {
                                                                                _classCallCheck(this, KustoDatasource);

                                                                                this.type = instanceSettings.type;
                                                                                this.url = instanceSettings.url;
                                                                                this.id = instanceSettings.id;
                                                                                this.name = instanceSettings.name;
                                                                                this.database = instanceSettings.jsonData.database;
                                                                                this.q = $q;
                                                                                this.backendSrv = backendSrv;
                                                                                this.templateSrv = templateSrv;
                                                                                this.withCredentials = instanceSettings.withCredentials;
                                                                                this.headers = {
                                                                                                'Content-Type': 'application/json; charset=utf-8',
                                                                                                'x-ms-app': 'kustoresource'
                                                                                };
                                                                }

                                                                _createClass(KustoDatasource, [{
                                                                                key: 'query',
                                                                                value: function query(options) {
                                                                                                var csl = this.queryMacros(options);
                                                                                                var resultDiv = document.getElementById("result");
                                                                                                if (resultDiv) {
                                                                                                                resultDiv.innerHTML = csl;
                                                                                                }
                                                                                                if (options.targets[0].length <= 0) {
                                                                                                                return this.$q.when({ data: [] });
                                                                                                }
                                                                                                var url = '/kusto/query';
                                                                                                return this.doRequest({
                                                                                                                url: this.url + url,
                                                                                                                method: 'POST',
                                                                                                                headers: this.headers,
                                                                                                                data: {
                                                                                                                                options: options,
                                                                                                                                db: this.database,
                                                                                                                                csl: csl
                                                                                                                }
                                                                                                }).then(this.responseParser);
                                                                                }
                                                                }, {
                                                                                key: 'responseParser',
                                                                                value: function responseParser(res) {
                                                                                                var data = [],
                                                                                                    datapoints = [],
                                                                                                    titles = [];
                                                                                                var i = 0;
                                                                                                var j = 0;
                                                                                                if (!res.data.Tables) {
                                                                                                                return { data: data };
                                                                                                }

                                                                                                if (res.config.data.options.targets[0].format === "time_series") {
                                                                                                                var timepos = 0,
                                                                                                                    stringpos = -1,
                                                                                                                    datapos = 0;
                                                                                                                for (j = 0; j < res.data.Tables[0].Columns.length; j++) {
                                                                                                                                if (res.data.Tables[0].Columns[j].ColumnType == "datetime") {
                                                                                                                                                timepos = j;
                                                                                                                                } else if (res.data.Tables[0].Columns[j].ColumnType == "string") {
                                                                                                                                                stringpos = j;
                                                                                                                                } else {
                                                                                                                                                datapos = j;
                                                                                                                                }
                                                                                                                }

                                                                                                                if (stringpos == -1) {
                                                                                                                                for (j = 0; j < res.data.Tables[0].Columns.length; j++) {
                                                                                                                                                if (j != timepos) {
                                                                                                                                                                for (i = 0; i < res.data.Tables[0].Rows.length; i++) {
                                                                                                                                                                                datapoints.push([res.data.Tables[0].Rows[i][j], +new Date(res.data.Tables[0].Rows[i][timepos])]);
                                                                                                                                                                }
                                                                                                                                                                data.push({
                                                                                                                                                                                target: res.data.Tables[0].Columns[j].ColumnName,
                                                                                                                                                                                datapoints: datapoints,
                                                                                                                                                                                refid: res.config.data.queries[0].refId
                                                                                                                                                                });
                                                                                                                                                }
                                                                                                                                }
                                                                                                                                return { data: data };
                                                                                                                } else {
                                                                                                                                var count = 0,
                                                                                                                                    series = {};
                                                                                                                                var Rows = res.data.Tables[0].Rows;
                                                                                                                                for (var row in Rows) {
                                                                                                                                                if (!series[Rows[row][stringpos]]) {
                                                                                                                                                                series[Rows[row][stringpos]] = [];
                                                                                                                                                }
                                                                                                                                                series[Rows[row][stringpos]].push([Rows[row][datapos], +new Date(Rows[row][timepos])]);
                                                                                                                                }
                                                                                                                                for (var target in series) {
                                                                                                                                                data.push({
                                                                                                                                                                target: target,
                                                                                                                                                                datapoints: series[target]
                                                                                                                                                });
                                                                                                                                }
                                                                                                                                return { data: data };
                                                                                                                }
                                                                                                }

                                                                                                if (res.config.data.options.targets[0].format === "table") {
                                                                                                                for (j = 0; j < res.data.Tables[0].Columns.length; j++) {
                                                                                                                                titles.push({
                                                                                                                                                text: res.data.Tables[0].Columns[j].ColumnName,
                                                                                                                                                type: res.data.Tables[0].Columns[j].DataType
                                                                                                                                });
                                                                                                                }
                                                                                                                for (j = 0; j < res.data.Tables[0].Rows.length; j++) {
                                                                                                                                datapoints.push(res.data.Tables[0].Rows[j]);
                                                                                                                }

                                                                                                                data.push({
                                                                                                                                columns: titles,
                                                                                                                                rows: datapoints,
                                                                                                                                type: "table"
                                                                                                                });
                                                                                                                return { data: data };
                                                                                                }
                                                                                }
                                                                }, {
                                                                                key: 'queryMacros',
                                                                                value: function queryMacros(options) {
                                                                                                var csl = options.targets[0].csl;
                                                                                                var pos = csl.indexOf("$__timeFilter");
                                                                                                if (pos == -1) {
                                                                                                                return csl;
                                                                                                }
                                                                                                var filterlength = 0;
                                                                                                var stack = 1;
                                                                                                for (pos = pos + 15; stack != 0 && pos < csl.length; pos++) {
                                                                                                                if (pos == csl.length - 1 && csl[pos] != ')') {
                                                                                                                                return csl;
                                                                                                                }
                                                                                                                if (csl[pos] == '(') {
                                                                                                                                stack++;
                                                                                                                } else if (csl[pos] == ')') {
                                                                                                                                stack--;
                                                                                                                }
                                                                                                                filterlength++;
                                                                                                }
                                                                                                pos = csl.indexOf("$__timeFilter");
                                                                                                var first = csl.slice(0, pos);
                                                                                                var filter = csl.slice(pos + 14, pos + 14 + filterlength);
                                                                                                var last = csl.slice(pos + 14 + filterlength, csl.length);
                                                                                                var from = new Date(options.range.from).toISOString();
                                                                                                var to = new Date(options.range.to).toISOString();
                                                                                                var middle = filter + " > todatetime(\"" + from + "\") and " + filter + " < todatetime(\"" + to + "\"";
                                                                                                return first + middle + last;
                                                                                }
                                                                }, {
                                                                                key: 'metricFindQuery',
                                                                                value: function metricFindQuery(query, optionalOptions) {
                                                                                                return this.backendSrv.datasourceRequest({
                                                                                                                url: '/kusto/query',
                                                                                                                method: 'POST',
                                                                                                                data: {}
                                                                                                });
                                                                                }
                                                                }, {
                                                                                key: 'testDatasource',
                                                                                value: function testDatasource() {
                                                                                                return this.doRequest({
                                                                                                                url: this.url + '/ping',
                                                                                                                method: 'GET'
                                                                                                }).then(function (response) {
                                                                                                                if (response.status === 200) {
                                                                                                                                return { status: "success", message: "Data source is working", title: "Success" };
                                                                                                                }
                                                                                                });
                                                                                }
                                                                }, {
                                                                                key: 'doRequest',
                                                                                value: function doRequest(options) {
                                                                                                options.withCredentials = this.withCredentials;
                                                                                                options.headers = this.headers;
                                                                                                return this.backendSrv.datasourceRequest(options);
                                                                                }
                                                                }]);

                                                                return KustoDatasource;
                                                }());

                                                _export('KustoDatasource', KustoDatasource);
                                }
                };
});
//# sourceMappingURL=datasource.js.map
