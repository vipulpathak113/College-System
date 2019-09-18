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
	return (
		<div>
			{
				applicationData.length > 0 ?
					<div>
						<div>
							{allApplicationsPagination(applicationStatus, totalPages, tab, totalCount)}
						</div>
						<div className="content-table-container">
							<table cellSpacing="0" cellPadding="0" className="header-content-table">
								<thead className="content-body-property" >
									<tr height="48">
										<th className="table-coloumn-positions">APPLICATION ID</th>
										<th className="table-coloumn-positions">SCHEME, DEPARTMENT</th>
										<th className="table-coloumn-positions">APPLICANT NAME</th>
										<th className="table-coloumn-positions">CONTACT NUMBER</th>
										<th className="table-coloumn-positions">DATE & TIME OF APPLICATION</th>
										{/*<th className="table-coloumn-positions">DATE OF BIRTH</th>*/}
										<th className="table-coloumn-positions">GEOGRAPHY</th>
										<th className="table-coloumn-positions">TEHSIL</th>
										<th className="table-coloumn-positions">STATUS</th>
									</tr>
								</thead>
								<tbody className="content-body-bottom-property" >
									{
										applicationData.map((item, i) => {
											var createdOn = new Date(item.createdOn)
											createdOn = createdOn.toDate
											if (applicationStatus !== "") {
												if (item.status === applicationStatus) {
													return (
														<tr className="content-table-row hover-clickable-table" key={i} onClick={openViewApplication.bind(this, item, currentComponent)}>
															<td className="table-coloumn-positions">{item.id}</td>
															<td className="table-coloumn-positions">{item.displayName}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{item.department}</span></td>
															<td className="table-coloumn-positions">{item.beneficiaryName}</td>
															<td className="table-coloumn-positions">{item.kyc.phone}</td>
															<td className="table-coloumn-positions">{new Date(item.createdOn).toDateString().substring(4, 15)}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{new Date(item.createdOn).toLocaleTimeString()}</span></td>
															{/*<td className="table-coloumn-positions">{item.kyc.dob}</td>*/}
															<td className="table-coloumn-positions">{item.district}</td>
															<td className="table-coloumn-positions">{item.tehsil}</td>
															{
																applicationStatus === "on_hold" ?
																	<td className="table-coloumn-positions">{getStatus(item.status)} <br />( {item.onHoldFeedback} )</td>
																	: <td className="table-coloumn-positions">{getStatus(item.status)}</td>
															}
														</tr>
													)
												}
											}
											else {
												// <tr className="content-table-row hover-clickable-table" key={i} onClick={component.openViewApplication.bind(component,item)}>
												if (item.status !== "initiate") {
													return (
														<tr className="content-table-row hover-clickable-table" key={i} onClick={openViewApplication.bind(this, item, currentComponent)}>
															<td className="table-coloumn-positions">{item.id}</td>
															<td className="table-coloumn-positions">{item.displayName}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{item.department}</span></td>
															<td className="table-coloumn-positions">{item.beneficiaryName}</td>
															<td className="table-coloumn-positions">{item.kyc.phone}</td>
															<td className="table-coloumn-positions">{new Date(item.createdOn).toDateString().substring(4, 15)}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{new Date(item.createdOn).toLocaleTimeString()}</span></td>
															{/*<td className="table-coloumn-positions">{item.kyc.dob}</td>*/}
															<td className="table-coloumn-positions">{item.district}</td>
															<td className="table-coloumn-positions">{item.tehsil}</td>
															<td className="table-coloumn-positions">{getStatus(item.status)}</td>
														</tr>
													)
												}
											}
										})
									}
								</tbody>
							</table>
						</div>
					</div> :
					<div className="no-record-found-text">
						<h4>No Records Found !!</h4>
					</div>
			}
		</div>
	)
}

export default table_populator;
