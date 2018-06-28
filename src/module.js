import {KustoDatasource} from './datasource';
import {KustoQueryCtrl} from './query_ctrl';

class GenericConfigCtrl {}
GenericConfigCtrl.templateUrl = 'partials/config.html';

class GenericQueryOptionsCtrl {}
GenericQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

export {
  KustoDatasource as Datasource,
  KustoQueryCtrl as QueryCtrl,
  GenericConfigCtrl as ConfigCtrl,
  GenericQueryOptionsCtrl as QueryOptionsCtrl,
};
