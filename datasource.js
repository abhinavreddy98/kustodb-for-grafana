import _ from "lodash";

export class GenericDatasource {
    constructor(instanceSettings, $q, backendSrv, templateSrv) {
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
    };

    query(options) {

        const csl = document.getElementById("csl").value;
        var queries = _.filter(options.targets, item => {
            return item.hide !== true;
          }).map(item => {
            return {
              refId: item.refId,
              intervalMs: options.intervalMs,
              maxDataPoints: options.maxDataPoints,
              format: item.format,
            };
          });
        if (queries.length <= 0) {
          return this.$q.when({data: []});
        }
        return this.doRequest({
            url: `api/datasources/proxy/${this.id}/kusto/query`,
            method: 'POST',
            headers: this.headers,
            data: {
                db: this.database,
                csl: csl,
                from: options.range.from,
                to: options.range.to,
                queries: queries,
            }
        });
    }


  metricFindQuery(query, optionalOptions) {
    return this.backendSrv
      .datasourceRequest({
        url: `api/datasources/proxy/${this.id}/kusto/query`,
        method: 'POST',
        data: {
        },
      });

  }



    testDatasource() {
        return this.doRequest({
          url: `api/datasources/proxy/${this.id}/kusto/ping`,
          method: 'GET',
        }).then(response => {
          if (response.status === 200) {
            return { status: "success", message: "Data source is working", title: "Success" };
          }
        });
      }

      doRequest(options) {
        options.withCredentials = this.withCredentials;
        options.headers = this.headers;
        return this.backendSrv.datasourceRequest(options);
