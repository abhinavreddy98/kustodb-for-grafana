import _ from "lodash";

export class KustoDatasource {
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
        const csl = this.queryMacros(options);
        const resultDiv = document.getElementById("result");
        if (resultDiv) {
            resultDiv.innerHTML = csl;
        }
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
        console.log(queries);
        if (queries.length <= 0) {
          return this.$q.when({data: []});
        }
        const url = `/kusto/query`
        return this.doRequest({
            url: this.url + url,
            method: 'POST',
            headers: this.headers,
            data: {
                from: options.range.from,
                to: options.range.to,
                queries: queries,
                db: this.database,
                csl: csl,
                timezone: "browser"
            }
        }).then(this.responseParser);
    }

    responseParser(res){
        console.log(res);
        var data  = [], datapoints = [], titles = [];
        var i = 0;
        var j = 0;
        if (!res.data.Tables) {
          return { data: data };
        }

        if(res.config.data.queries[0].format === "time_series"){
          var timepos = 0;
          for(j=0; j<res.data.Tables[0].Columns.length; j++){
            if(res.data.Tables[0].Columns[j].ColumnType == "datetime"){
              timepos = j;
              break;
            }
          }

          var stringpos = -1;
          for(j=0; j<res.data.Tables[0].Columns.length; j++){
            if(res.data.Tables[0].Columns[j].ColumnType == "string"){
              stringpos = j;
              break;
            }
          }

          if(stringpos == -1){
            for(j=0; j<res.data.Tables[0].Columns.length; j++){
              if(j != timepos){
                for(i=0; i<res.data.Tables[0].Rows.length; i++){
                  datapoints.push([
                    res.data.Tables[0].Rows[i][j] , +new Date(res.data.Tables[0].Rows[i][timepos])
                  ]);
                }
                data.push({
                  target: res.data.Tables[0].Columns[j].ColumnName,
                  datapoints: datapoints,
                  refid: res.config.data.queries[0].refId,
                });
              }
            }
            console.log(data);
            return {data: data};
          }

          else{
            var count = 0, series = {};
            var Rows = res.data.Tables[0].Rows;
            for(var row in Rows){
              if(!series[Rows[row][stringpos]]){
                series[Rows[row][stringpos]] = [];
              }
              series[Rows[row][stringpos]].push([
                Rows[row][stringpos + 1], +new Date(Rows[row][timepos])
              ]);
            }
            var datapoints = [];
            for(var target in series){
              for(var i = 0; i<series[target].length; i++){
                datapoints[series[target].length - 1 - i] = series[target][i];
              }
              for(var i = 0; i<series[target].length; i++){
                series[target][i] = datapoints[i];
              }
            }
            for(var target in series){
              data.push({
                target: target,
                datapoints: series[target],
              });
            }
            console.log(data);
            return {data: data};
          }
        }

        if(res.config.data.queries[0].format === "table"){
          for(j = 0; j < res.data.Tables[0].Columns.length; j++){
            titles.push({
                text: res.data.Tables[0].Columns[j].ColumnName,
                type: res.data.Tables[0].Columns[j].DataType,
            });
          }
          for(j = 0; j < res.data.Tables[0].Rows.length; j++){
            datapoints.push(
                res.data.Tables[0].Rows[j]
            );
          }

          data.push({
            columns: titles,
            rows: datapoints,
            type: "table",
          });
          return {data: data};
        }
    }

    queryMacros(options){
        console.log(options);
        //var csl = document.getElementById("csl").value;
        var csl = options.targets[0].csl;
        console.log(csl);
        var pos = csl.indexOf("$__timeFilter");
        if(pos == -1){
          return csl;
        }
        var filterlength = 0;
        for(pos = pos + 14; csl[pos] != ')' && pos < csl.length; pos++){
          if(pos == csl.length - 1 && csl[pos] != ')'){
            return csl;
          }
          filterlength++;
        }
        pos = csl.indexOf("$__timeFilter");
        var first = csl.slice(0, pos);
        var filter = csl.slice(pos + 14, pos + 14 + filterlength);
        var last = csl.slice(pos + 14 + filterlength, csl.length)
        var from = new Date(options.range.from+100000).toISOString();
        var to = new Date(options.range.to).toISOString();
        var middle = filter + " > todatetime(\"" + from + "\") and " + filter + " < todatetime(\"" + to + "\"";
        return (first + middle + last);
    }


  metricFindQuery(query, optionalOptions) {
    return this.backendSrv
      .datasourceRequest({
        url: '/kusto/query',
        method: 'POST',
        data: {
        },
      });

  }



    testDatasource() {
        return this.doRequest({
          url: this.url + '/ping',
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
      }
}
