import XLSX from "xlsx";

var Excel = {
    generate(data, fileName, sheetName){
        var headers = new Array();
        for (let i = 0; i < Object.keys(data[0]).length; i++) {
          headers[i] = Object.keys(data[0])[i];
        }
        var ws_data = [headers];
        var ws = XLSX.utils.aoa_to_sheet(ws_data);
        data.forEach(eachData => {
          var result = new Array;
          for(let i = 0; i < headers.length; i++){
            result[i] = eachData[headers[i]]
          }
          XLSX.utils.sheet_add_aoa(ws, [
            result
          ], {origin: -1});
        });
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        XLSX.writeFile(wb, fileName + ".xlsx");
    }
}
export default Excel;