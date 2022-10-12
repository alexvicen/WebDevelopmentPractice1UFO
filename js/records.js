var recordsTable = document.getElementById("records_table");
var _table_ = document.createElement("table"),
  _tr_ = document.createElement("tr"),
  _th_ = document.createElement("th"),
  _td_ = document.createElement("td");
var result;

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if (this.readyState != 4) return;
  switch (this.status) {
    case 401:
      alert("no valid token");
      break;
    case 500:
      alert("Server error");
      break;
    case 200:
      buildHtmlTable(JSON.parse(this.responseText));
      break;
    default:
      alert("Unknown error");
      break;
  }
};
xhttp.open("GET", "http://wd.etsisi.upm.es:10000/records", false);
xhttp.send("");

function buildHtmlTable(arr) {
  var table = _table_.cloneNode(false);
  var columns = addAllColumnHeaders(arr, table);
  for (var i = 0, maxi = arr.length; i < maxi; ++i) {
    var tr = _tr_.cloneNode(false);
    tr.className = "tr";
    for (var j = 0, maxj = columns.length; j < maxj; ++j) {
      var td = _td_.cloneNode(false);
      var cellKey = columns[j];
      var cellValue = arr[i][columns[j]];
      if (cellKey == "recordDate") {
        cellValue = new Date(cellValue).toLocaleDateString("es-ES");
      }

      td.appendChild(document.createTextNode(cellValue || ""));
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  recordsTable.appendChild(table);
}
function addAllColumnHeaders(arr, table) {
  var columnSet = [];
  var tr = _tr_.cloneNode(false);
  tr.className = "tr";
  for (var i = 0, l = arr.length; i < l; i++) {
    for (var key in arr[i]) {
      if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key) === -1) {
        columnSet.push(key);
        var th = _th_.cloneNode(false);
        th.appendChild(document.createTextNode(key));
        th.className = "th";
        tr.appendChild(th);
      }
    }
  }
  table.appendChild(tr);
  return columnSet;
}
