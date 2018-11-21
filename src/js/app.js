import $ from 'jquery';
import {parseCode,Parser} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        var elements = Parser(parsedCode);
        var htbl = document.getElementById('table');
        htbl.innerHTML = makeHtmlTable(elements, ['line', 'type', 'name', 'condition', 'value']);
    });
});

function makeHtmlTable(data, col_names) {
    var tbl = '';
    tbl +='<thead>';
    tbl +='<tr>';
    tbl +='<th>Line</th>';
    tbl +='<th>Type</th>';
    tbl +='<th>Name</th>';
    tbl +='<th>Condition</th>';
    tbl +='<th>Value</th>';
    tbl +='</tr>';
    tbl +='</thead>';
    for (var r = 0; r < data.length; r++) {
        tbl += '<tr>';
        for (var c = 0; c < col_names.length; c++)
            tbl += '<td>' + data[r][col_names[c]] + '</td>';
        tbl += '</tr>';
    }
    return tbl;
}
