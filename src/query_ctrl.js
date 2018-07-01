import {QueryCtrl} from 'app/plugins/sdk';

const defaultQuery = `<Table Name>
| $__timeFilter(<Time Column>)
| order by <Time Column> desc`;

export class KustoQueryCtrl extends QueryCtrl {

  constructor($scope, $injector)  {

    super($scope, $injector);



    this.scope = $scope;

    this.target.target = this.target.target || 'select metric';

    this.target.format = this.target.format || 'timeserie';

    this.formats = [{ text: 'Time series', value: 'time_series' }, { text: 'Table', value: 'table' }];

    this.target.csl = this.target.csl || defaultQuery;

    this.showhelp = false;

  }



  getOptions(query) {

    return this.datasource.metricFindQuery(query || '');

  }



  toggleEditorMode() {

    this.target.rawQuery = !this.target.rawQuery;

  }



  onChangeInternal() {

    this.panelCtrl.refresh(); // Asks the panel to refresh data.

  }

}



KustoQueryCtrl.templateUrl = 'partials/query.editor.html';
