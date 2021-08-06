function changeColumnWidth() {
    columnWidth = document.querySelector('.columnWidth').value;
    DB.filter(table.fromYear,table.toYear);
    DB.structuring(table.toYear, table.yearHeight, columnWidth);
    DB.clearLines(table.container);
    DB.addToTable(table.container, table.containerH, table.yearHeight);
}

 function changeValue(){
     table.reDrawTable(
         document.querySelector('.fir').value, 
         document.querySelector('.sec').value, 
         document.querySelector('.third').value,
         document.querySelector('.fourth').value)
         DB.filter(table.fromYear,table.toYear)
         DB.structuring(table.toYear, table.yearHeight, columnWidth)
         DB.clearLines(table.container);
         DB.addToTable(table.container, table.containerH, table.yearHeight)
 }

 