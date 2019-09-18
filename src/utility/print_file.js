import React from 'react'


const printCommand = (val)=> {
    var mywindow = window.open('', 'PRINT', 'height=1000,width=1000');
    mywindow.document.write(document.getElementById(val).innerHTML);
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    mywindow.print();
		mywindow.close();
}

export default printCommand
