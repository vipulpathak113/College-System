import React from 'react'
import store from '../../utility/store'
import getStatus from './get_status'
import allApplicationsPagination from '../../utility/all_applications_pagination'
import _ from "lodash"

var openViewApplication = (data, currentComponentValue) => {
	store.dispatch({ type: "SHOW_VIEW_APPLICATION_DETAILS", data: data, currentComponent: currentComponentValue })
}

var table_populator = (applicationData, applicationStatus, currentComponent, component, totalPages, tab, totalCount) => {
	applicationData =  _.orderBy(applicationData, ['createdOn'], ['desc']);
	var data= this.state.studentdata
        return (
			<div className="right-panel-content-bg" >
                <h3 className="approve-beneficiary-text">Student Details</h3>
				<div >
					
								<div className="content-table-container">
									<table cellSpacing="0" cellPadding="0" className="header-content-table">
										<thead className="content-body-property">
											<tr height="48">
												<th className="table-coloumn-positions">NAME</th>
                                                <th className="table-coloumn-positions">ROLL NO</th>
												<th className="table-coloumn-positions">EMAIL</th>
												<th className="table-coloumn-positions">PHONE NUMBER</th>
												<th className="table-coloumn-positions">DEPARTMENT</th>
                                                <th className="table-coloumn-positions">BATCH YEAR</th>
												
											</tr>
										</thead>
										<tbody className="content-body-bottom-property">
                                        {
                                     data.length > 0 ?
                                     data.map((item, i) => {
                                     return(
										<tr className="content-table-row hover-clickable-table" key={i} onClick={openViewApplication.bind(this, item, currentComponent)}>
                                     <td className="table-coloumn-positions">{item.first_name} {item.last_name}</td>
                                     <td className="table-coloumn-positions">{item.profile.roll_number}</td>
                                     <td className="table-coloumn-positions">{item.email}</td>
                                     <td className="table-coloumn-positions">{item.phone_number}</td>
                                     <td className="table-coloumn-positions">{item.profile.department}</td>
                                     <td className="table-coloumn-positions">{item.profile.batch_year}</td>
                                     
                                      </tr>)}):
                                     <div className="no-record-found-text">
                                         <h4>No Records Found !!</h4>
                                     </div>
                             }
										</tbody>
									</table>
								</div> 
				</div>
			</div>
		)
}

export default table_populator;
