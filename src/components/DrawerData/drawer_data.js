import React from "react";

const data = [
    {
        docType: 'Documents',
        date: '19-06-2018',
        time: '11:35 PM',
        docName: 'PAN Card, Vikas Singh',
        docStatus: 'Approved',
        color: '#2fccd3'
    },
    {
        docType: 'Documents',
        date: '19-06-2018',
        time: '11:35 PM',
        docName: 'PAN Card, Vikas Singh',
        docStatus: 'Rejected',
        color: '#dd6277'
    },
    {
        docType: 'Documents',
        date: '19-06-2018',
        time: '11:35 PM',
        docName: 'PAN Card, Vikas Singh',
        docStatus: 'Approved',
        color: '#2fccd3'
    },
    {
        docType: 'Documents',
        date: '19-06-2018',
        time: '11:35 PM',
        docName: 'PAN Card, Vikas Singh',
        docStatus: 'Rejected',
        color: '#dd6277'
    },
    {
        docType: 'Applications',
        date: '19-06-2018',
        time: '11:35 PM',
        docName: 'PAN Card, Vikas Singh',
        docStatus: 'Disburse',
        color: '#6f90ef'
    },
    {
        docType: 'Documents',
        date: '19-06-2018',
        time: '11:35 PM',
        docName: 'PAN Card, Vikas Singh',
        docStatus: 'Approved',
        color: '#2fccd3'
    },
]

const Drawerdata = () => {
    let tempData = data.map((item, i) => {
        return (
            <div key={i} className="drawer-data-container">
                <div className="doctype-text-container">
                    <h5 className="doctype-text">{item.docType} &nbsp; &nbsp; &nbsp;<span className="date-text">{item.date}</span> &nbsp;<span className="date-text">{item.time}</span></h5>
                    <h6 className="docname-text">{item.docName}</h6>
                    <p className="doc-status" style={{color:item.color}}>{item.docStatus}</p>
                </div>
            </div>
        )
    })
    return tempData;
}
export default Drawerdata