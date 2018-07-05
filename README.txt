Kusto datasource plugin for grafana

This can be used by directly downloading it to /var/lib/grafana/plugins/
In case you make any changes or want to recompile you'll need to install the dependencies first.

To install dependencies:

npm install
npm install -g grunt
npm install -g grunt-cli


To compile:

sudo npm run build
sudo service grafana-server restart

How to use Kusto datasource

Setting up grafana to perform datasource authentication for kusto

In the plugin.json go to routes{} and edit url there.
Go to routes {tokeAuth{params{}}} and edit resource there.

Configuration

Register an app on Azure AAD that will act as a client for Kusto. AppId will be Client Id.
Grant it permission to access your KustoService under Required Permissions.
Create a Key for the app. The key value will be the Client Secret
Your AAD directory id will be your directory id.
Enter your clusters Rest API url under input for host
Enter these values in the config page.

Queries

All kusto read queries that are supported by its Rest API will work with this connector.

Table

To have a table panel, press add panel and select table.
Click on panel title and select edit from the dropdown.
Select table from the format dropdown.
Enter your kusto query in the code-editor.
The datasource doesn’t sort your results so you need to include that in your query if you need sorted results.

Graph

To have a Graph panel, press add panel and select graph.
Click on panel title and select edit from the dropdown.
Select timeseries from the format dropdown.
Enter your kusto query in the code-editor.
In order to graph your query the expected response columns must be as follows
Option 1
One datetime column and any number of columns as number values
These number columns will be different series  on Y-axis and datetime column is X-axis

Option 2
One datetime column, one number column and one string column
This is for queries that group by a string column as well as a time column
<Database Name>
| where EventDate > ago(15d)
| summarize dcount(Value1) by Property1, bin(EventDate, 1d)
| order by EventDate asc
Grafana doesn’t sort your results so you MUST sort in ascending order in your query otherwise you will get meaning less graphs or warnings that points are outside data range.

Macros
$__timeFilter(datetimecolumn)
It is advisable to use this macro so that the query will request only the datapoints in the time range at the top right corner of the Grafana UI.
