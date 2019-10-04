import React from 'react'
import FlatButton from '../Buttons/flat_button';
import NonMonetaryCompleteTask from './non_monetary_complete_task'
import NonMonetaryCompletedTaskDetails from './completed_task_details'
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'
import store from '../../utility/store'
import bootupsettings from '../../models/bootupsettings';
import network from '../../utility/network'
import { CSVLink } from 'react-csv'

var activeAction = "", is_po = false, selectedApplicationData, selectedBenefit, selectedUser, allApplicationsData = []
var previousPage = 1, pageStatus = "active_beneficiary", pages = 0, ponew = [], pocompleted = [], count = {}, totalPages = 0
var openCompleteTask = false, openCompletedTask = false, previousPage = 1, nonponew = [], nonpocompleted = [],currentPage = 1

export default class NonMonetary extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			classProperty: props.currentTab,
			showCompleteTask: false,
			completedNonMonetaryTask: false,
			value: "select-any-one",
			nonMonetaryApplications: [],
			facilitatorList: [],
			check: "",
			madeApiCall: false
		}
		count = props.count
		this.setWrapperRef = this.setWrapperRef.bind(this);
		this.handleClickOutside = this.handleClickOutside.bind(this)
	}

	handleTabChange(val) {
		this.setState({ classProperty: val })
		val === 1 ? pageStatus = "active_beneficiary" :
			val === 2 ? pageStatus = "all_benefits_granted" : null
		this.searchApplication()
	}
	handleClick(appId, benefit_id) {
		this.setState({ display: 'block' })
		activeAction = appId + "_" + benefit_id
	}

	dropdownClick(appData, benefitId) {
		selectedApplicationData = appData
		selectedBenefit = benefitId
		this.setState({ dropdownBorder: '1px solid #ef7950' })
	}

	completeAssignedTask(appData, benefitId) {
		selectedApplicationData = appData
		selectedBenefit = benefitId
		this.completeNonMonetaryTask()
	}

	dropdownValue = (event) => {
		this.setState({ value: event.target.value });
	}

	handleSelectedUser = (event) => {
		selectedUser = event.target.value
	}

	handleAssignTo() {
		network.send(bootupsettings.ENDPOINTS.ASSIGN_BENEFIT, { "user_id": JSON.parse(selectedUser).user_id, "benefit_id": selectedBenefit.id }, "ASSIGN_BENEFIT", function (response, component) { })
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "ASSIGN_BENEFIT") {
				if (response.code === 200) {
					activeAction = null
					pageStatus = "active_beneficiary"
					this.searchApplication()
					// network.send(bootupsettings.ENDPOINTS.NON_MONETARY_APPLICATIONS, { "size": 2000 }, "NON_MONETARY_APPLICATIONS", function (response, component) { })
				}
				else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
					storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
					window.location.href = "/sign-in"
				}
			}
		})
	}

	setWrapperRef(node) {
		this.wrapperRef = node;
	}
	handleClickOutside(event) {
		if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
			this.setState({ display: 'none', value: 'select-any-one' })
			document.getElementById('non-monetary-filter').selectedIndex = 0
		}
	}

	searchApplication() {
		if (storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE)) {
			previousPage = storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE)
		}
		else {
			previousPage = 1
		}
		network.send(bootupsettings.ENDPOINTS.SEARCH_NON_MONETARY_APPLICATIONS, { "searchTerm": "", "searchType": "", "status": pageStatus, "pageNumber": currentPage }, "SEARCH_NON_MONETARY_APPLICATIONS", function (response, component) { })
	}

	componentWillMount() {
		this.searchApplication()
		// network.send(bootupsettings.ENDPOINTS.NON_MONETARY_APPLICATIONS, { "size": 2000 }, "NON_MONETARY_APPLICATIONS", function (response, component) { })
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "SEARCH_NON_MONETARY_APPLICATIONS") {
				if (response.code === 200) {
					totalPages = response.data.applications.totalPages
					is_po = response.data.is_po
					allApplicationsData = response.data.applications.objects
					this.setState({ nonMonetaryApplications: response.data.applications.objects })
					if (response.data.is_po === true && response.data.applications.objects.length > 0 && pageStatus === "active_beneficiary") {
						network.send(bootupsettings.ENDPOINTS.GET_FACILITATOR_USER, "", "GET_FACILITATOR_USER", function (response, component) { })
					}
				}
				else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
					storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
					window.location.href = "/sign-in"
				}
			}
			else if (response.type === "GET_FACILITATOR_USER") {
				if (response.code === 200) {
					this.setState({
						facilitatorList: response.data.users
					})
				}
				else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
					storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
					window.location.href = "/sign-in"
				}
			}
			else if (response.type === "CLOSE_NON_MONETARY_COMPLETED_TASK") {
				openCompletedTask = false
				this.setState({
					completedNonMonetaryTask: false
				})
				pageStatus = "all_benefits_granted"
				this.searchApplication()
			}
			else if (response.type === "CLOSE_NON_MONETARY_COMPLETE_TASK") {
				activeAction = null
				pageStatus = "active_beneficiary"
				this.searchApplication()
				openCompleteTask = false
				this.setState({
					showCompleteTask: false
				})
			}
			else if (response.type === "COUNT_UPDATED") {
					count = response.data
					this.setState({
							check: ""
					})
			}
		})
		document.addEventListener('mousedown', this.handleClickOutside);
	}

	completeNonMonetaryTask() {
		openCompleteTask = true
		this.setState({
			showCompleteTask: true
		})
	}

	showCompletedNonMonetaryTask(appData, benefitId) {
		selectedApplicationData = appData
		selectedBenefit = benefitId
		openCompletedTask = true
		this.setState({
			completedNonMonetaryTask: true
		})
	}
	printCommand(val) {
		var mywindow = window.open('', 'PRINT', 'height=1000,width=1000');
		mywindow.document.write(document.getElementById(val).innerHTML);
		mywindow.document.close(); // necessary for IE >= 10
		mywindow.focus(); // necessary for IE >= 10*/
		mywindow.print();
		mywindow.close();
	}

	setCurrentPage(val) {
			if (val === "first") {
					currentPage = 1
			}
			else if (val === "previous") {
					currentPage = currentPage - 1
			}
			else if (val === "next") {
					currentPage = currentPage + 1
			}
			else if (val === "last") {
					currentPage = totalPages
			}
			this.setState({ check: "" })
			this.searchApplication()
	}

	newPaginationButtons(applications) {
			var row = []

			if (currentPage > 1) {
					row.push(<FlatButton className="page-boxes" label="First" onClick={this.setCurrentPage.bind(this, "first")} id="first"></FlatButton>)
					row.push(<FlatButton className="page-boxes" label="Previous" onClick={this.setCurrentPage.bind(this, "previous")} id="previous"></FlatButton>)
			}
			if (currentPage >= 1 && currentPage <= totalPages) {
					row.push(<div className="page-boxes-text" id="current">Showing page {currentPage} out of {totalPages}</div>)
			}
			if (currentPage < totalPages) {
					row.push(<FlatButton className="page-boxes" label="Next" onClick={this.setCurrentPage.bind(this, "next")} id="next"></FlatButton>)
					row.push(<FlatButton className="page-boxes" label="Last" onClick={this.setCurrentPage.bind(this, "last")} id="last"></FlatButton>)
			}
			return (
					<div className="page-boxes-wrapper">{row}</div>
			)
	}

	render() {
		ponew = pocompleted = nonponew = nonpocompleted = []
		let data = [], completedData = []
		allApplicationsData.map((item) => {
			if (item.status === "active_beneficiary") {
				data.push(item)
			}
			else if (item.status === "all_benefits_granted") {
				completedData.push(item)
			}
		})

		const approveDropdown = {
			width: '100%',
			height: '40px',
			borderRadius: '3px',
			outline: 'none',
			padding: '0 10px',
			cursor: 'pointer',
			backgroundColor: '#f7faf8'
		}
		const nonDbtDropdown = {
			width: '100%',
			height: '40px',
			borderRadius: '3px',
			outline: 'none',
			padding: '0 10px',
			margin: '10px 0 0 0',
			cursor: 'pointer',
			backgroundColor: '#f7faf8'
		}
		let filterTypesArray = [
			{ value: "scheme", label: "Scheme Name" },
			{ value: "department", label: "Department Name" },
			{ value: "name", label: "Applicant Name" },
		]
		return (
			<div>
				{
					!openCompletedTask ?
						!openCompleteTask ?
							<div className="right-panel-content-bg">
								<h3 className="approve-beneficiary-text">Disburse Benefits <span className="dbt-definition">Non-Monetary</span></h3>
								<div className="export-btn-container" onClick={this.printCommand.bind(this, "content-to-print")}>
									<div className="icon-text-container">
										<i className="material-icons export-icon">print</i>
										<span className="export-text">Print</span>
									</div>
								</div>
								<div className="searchbar-container">
									<div className="content-tab-container">
										<span className={`content-tabs ${this.state.classProperty === 1 ? "tab-active" : ''}`} onClick={this.handleTabChange.bind(this, 1)}>New <span className="total-count-for-tabs">{count.onmNew}</span></span>
										<span className={`content-tabs ${this.state.classProperty === 2 ? "tab-active" : ''}`} onClick={this.handleTabChange.bind(this, 2)}>Completed <span className="total-count-for-tabs">{count.onmComplete}</span></span>
									</div>
								</div>
								{/* {FilterNonMonetaryApplications(filterTypesArray)} */}
								{
									this.state.classProperty === 1 ?
										<div>
											{/* for New Task*/}
											{
												data.length > 0 ?
													!is_po ?
														<div className="content-table-container" id="content-to-print">
															<CSVLink data={nonponew}>
																<div className="export-icon-text-container">
																	<i className="material-icons export-icon">vertical_align_bottom</i>
																	<span className="export-text">Export</span>
																</div>
															</CSVLink>
															<div>
																{this.newPaginationButtons(data)}
															</div>
															<table cellSpacing="0" cellPadding="0" className="header-content-table" >
																<thead className="content-body-property" >
																	<tr height="48">
																		<th className="table-coloumn-positions">APPLICANT ID</th>
																		<th className="table-coloumn-positions">SCHEME, DEPARTMENT</th>
																		<th className="table-coloumn-positions">APPLICANT NAME</th>
																		<th className="table-coloumn-positions">COMMUNICATION ADDRESS</th>
																		<th className="table-coloumn-positions">TASK DETAILS</th>
																		<th className="table-coloumn-positions">ASSIGNED BY</th>
																		<th className="table-coloumn-positions">ASSIGNED ON</th>
																		<th className="table-coloumn-positions">TAKE ACTION</th>
																	</tr>
																</thead>
																<tbody className="content-body-bottom-property" >
																	{
																		data.map((item, i) => {
																			if (item.status === "active_beneficiary") {
																				let address = item.service_pickup_address.street1 + ", " + item.service_pickup_address.street2 + ", " + item.service_pickup_address.city + ", " + item.service_pickup_address.district + ", " + item.service_pickup_address.state + "-" + item.service_pickup_address.zip
																				if (item.status === "active_beneficiary") {
																					nonponew.push({
																						"Applicant Name": item.beneficiaryName,
																						"Scheme Name": item.displayName,
																						"Department": item.department,
																						"Communication Address": address,
																						"Task Details": item.benefits[0].benefit_name,
																						"Assigned By": item.benefits[0].assigned_by,
																						"Assigned On": new Date(item.benefits[0].assigned_on).toDateString().substring(4, 15)
																					})
																					return (
																						<tr className="content-table-row" key={i} >
																							<td className="table-coloumn-positions">{item.id}</td>
																							<td className="table-coloumn-positions">{item.displayName}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{item.department}</span></td>
																							<td className="table-coloumn-positions">{item.beneficiaryName}</td>
																							<td className="table-coloumn-positions">{address}</td>
																							<td className="table-coloumn-positions">{
																								item.benefits.map((benefit, i) => {
																									return (
																										<div>
																											{benefit.scheme_rule_set_sub_benefit__benefit}
																										</div>
																									)
																								})
																							}</td>
																							<td className="table-coloumn-positions">{
																								item.benefits.map((benefit, i) => {
																									if (benefit.assigned_by !== null && benefit.completed_by__first_name === null) {
																										return (
																											<div>{benefit.assigned_by__first_name}</div>
																										)
																									}
																									else {
																										return (
																											<td className="table-coloumn-positions">Completed By :  <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{benefit.completed_by__first_name}</span></td>
																										)
																									}
																								})}
																							</td>
																							<td className="table-coloumn-positions">{
																								item.benefits.map((benefit, i) => {
																									if (benefit.assigned_on !== "" || benefit.assigned_on !== null) {
																										return (
																											<td>{new Date(benefit.assigned_on).toDateString().substring(4, 15)}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{new Date(benefit.assigned_on).toLocaleTimeString()}</span></td>
																										)
																									}
																									else {
																										return (
																											<div>-</div>
																										)
																									}
																								})}
																							</td>
																							<td className="table-coloumn-positions">{
																								item.benefits.map((benefit, i) => {
																									if (!benefit.is_completed) {
																										return (
																											<div>
																												<FlatButton flat label="Complete" className="view-application-approve-new-btn" onClick={this.completeAssignedTask.bind(this, item, benefit)} />
																											</div>
																										)
																									}
																									else {
																										return(
																											<td className="table-coloumn-positions">Completed<br /></td>
																										)
																									}
																								})
																							}
																							</td>
																						</tr>
																					)
																				}
																			}
																		})
																	}
																</tbody>
															</table>
														</div> :
														<div className="content-table-container" id="content-to-print">
															<CSVLink data={ponew}>
																<div className="export-icon-text-container">
																	<i className="material-icons export-icon">vertical_align_bottom</i>
																	<span className="export-text">Export</span>
																</div>
															</CSVLink>
															<div>
																{this.newPaginationButtons(data)}
															</div>
															<table cellSpacing="0" cellPadding="0" className="header-content-table" >
																<thead className="content-body-property" >
																	<tr height="48">
																		<th className="table-coloumn-positions">APPLICANT ID</th>
																		<th className="table-coloumn-positions">SCHEME, DEPARTMENT</th>
																		<th className="table-coloumn-positions">APPLICANT NAME</th>
																		<th className="table-coloumn-positions">APPLIED DATE, TIME</th>
																		<th className="table-coloumn-positions">COMMUNICATION ADDRESS</th>
																		<th className="table-coloumn-positions">TASK DETAILS</th>
																		<th className="table-coloumn-positions">TAKE ACTION</th>
																	</tr>
																</thead>
																<tbody className="content-body-bottom-property" >
																	{
																		data.map((item, i) => {
																			let address = item.service_pickup_address.street1 + ", " + item.service_pickup_address.street2 + ", " + item.service_pickup_address.city + ", " + item.service_pickup_address.district + ", " + item.service_pickup_address.state + "-" + item.service_pickup_address.zip
																			if (item.status === "active_beneficiary") {
																				ponew.push({
																					"Applicant Name": item.beneficiaryName,
																					"Scheme Name": item.displayName,
																					"Department": item.department,
																					"Communication Address": address,
																					"Task Details": item.benefits[0].benefit_name,
																				})

																				return (
																					<tr className="content-table-row" key={i} >
																						<td className="table-coloumn-positions">{item.id}</td>
																						<td className="table-coloumn-positions">{item.displayName}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{item.department}</span></td>
																						<td className="table-coloumn-positions">{item.beneficiaryName}</td>
																						<td className="table-coloumn-positions">{new Date(item.createdOn).toDateString().substring(4, 15)}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{new Date(item.createdOn).toLocaleTimeString()}</span></td>
																						<td className="table-coloumn-positions">{address}</td>
																						<td className="table-coloumn-positions">
																							{
																								item.benefits.map((benefit, i) => {
																									return (
																										<div className="verify-doc-type-text span-text-style hr-benefit-padding">
																											{benefit.scheme_rule_set_sub_benefit__benefit}
																											<br />
																										</div>
																									)
																								})
																							}</td>
																						<td className="table-coloumn-positions">
																							{
																								item.benefits.map((benefit, i) => {
																									let dialog_id = item.id + "_" + benefit.id
																									if (benefit.assigned_to__first_name === null && benefit.completed_by__first_name === null) {
																										return (
																											<div className="hr-benefit-btn-padding">
																												<FlatButton flat label="Action" className="view-application-approve-new-btn" onClick={this.handleClick.bind(this, item.id, benefit.id)} />
																												{
																													activeAction === dialog_id ?
																														<div className="approve-action-wrapper" style={{ display: this.state.display }} ref={this.setWrapperRef}>
																															<div className="approve-arrow-down"></div>
																															<div className="approve-benefit-dropdown-container" >
																																<div className="">
																																	<h4 className="apply-an-action-text">Apply an action below</h4>
																																</div>
																																<select
																																	id="non-monetary-filter"
																																	style={approveDropdown}
																																	onClick={this.dropdownClick.bind(this, item, benefit)}
																																	onChange={this.dropdownValue}
																																>
																																	<option value="select-any-one">Select any one</option>
																																	<option value="complete">Complete</option>
																																	<option value="assignTo">Assign To</option>
																																</select >
																																<div>
																																	{
																																		this.state.value === 'complete' ?
																																			<div className="approve-dropdown-btn-container">
																																				<FlatButton flat label="Confirm" onClick={this.completeNonMonetaryTask.bind(this, item, benefit)} />
																																			</div> :
																																			this.state.value === 'assignTo' ?
																																				<div>
																																					<select
																																						id="assignTo"
																																						style={nonDbtDropdown}
																																						onChange={this.handleSelectedUser}
																																					>
																																						<option value="select-any-one">Select any one</option>
																																						{
																																							this.state.facilitatorList.map((list, i) => {
																																								return (
																																									<option value={JSON.stringify(list)}>{list.label}</option>

																																								)
																																							})
																																						}
																																					</select >
																																					<div className="approve-dropdown-btn-container">
																																						<FlatButton flat label="Done" onClick={this.handleAssignTo.bind(this)} />
																																					</div>
																																				</div> : null
																																	}
																																</div>
																															</div>
																														</div> :
																														null
																												}
																											</div>
																										)
																									}
																									else if (benefit.assigned_to__first_name !== null) {
																										return (
																											<td className="table-coloumn-positions">Assigned To :  <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{benefit.assigned_to}</span></td>
																										)
																									}
																									else {
																										return(
																											<td className="table-coloumn-positions">Completed By :  <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{benefit.completed_by__first_name}</span></td>
																										)
																									}
																								})
																							}
																						</td>
																					</tr>
																				)
																			}
																		})
																	}
																</tbody>
															</table>
														</div> :
													<div className="no-record-found-text">
														<h4>No Records Found !!</h4>
													</div>
											}
										</div> :
										<div>
											{/* for completed tasks*/}
											{
												completedData.length > 0 ?
													!is_po ?
														<div className="content-table-container" id="content-to-print">
															<CSVLink data={nonpocompleted}>
																<div className="export-icon-text-container">
																	<i className="material-icons export-icon">vertical_align_bottom</i>
																	<span className="export-text">Export</span>
																</div>
															</CSVLink>
															<div>
																{this.newPaginationButtons(data)}
															</div>
															<table cellSpacing="0" cellPadding="0" className="header-content-table" >
																<thead className="content-body-property" >
																	<tr height="48">
																		<th className="table-coloumn-positions">APPLICANT ID</th>
																		<th className="table-coloumn-positions">SCHEME, DEPARTMENT</th>
																		<th className="table-coloumn-positions">APPLICANT NAME</th>
																		<th className="table-coloumn-positions">COMMUNICATION ADDRESS</th>
																		<th className="table-coloumn-positions">TASK DETAILS</th>
																		<th className="table-coloumn-positions">ASSIGNED BY</th>
																		<th className="table-coloumn-positions">ASSIGNED ON</th>
																		<th className="table-coloumn-positions">VIEW DETAILS</th>
																	</tr>
																</thead>
																<tbody className="content-body-bottom-property" >
																	{
																		completedData.map((item, i) => {
																			if (item.status === "all_benefits_granted") {
																				let address = item.service_pickup_address.street1 + ", " + item.service_pickup_address.street2 + ", " + item.service_pickup_address.city + ", " + item.service_pickup_address.district + ", " + item.service_pickup_address.state + "-" + item.service_pickup_address.zip
																				nonpocompleted.push({
																					"Applicant Name": item.beneficiaryName,
																					"Scheme Name": item.displayName,
																					"Department": item.department,
																					"Communication Address": address,
																					"Task Details": item.benefits[0].benefit_name,
																					"Assigned By": item.benefits[0].assigned_by,
																					"Assigned On": new Date(item.benefits[0].assigned_on).toDateString().substring(4, 15),
																				})
																				return (
																					<tr className="content-table-row" key={i} >
																						<td className="table-coloumn-positions">{item.id}</td>
																						<td className="table-coloumn-positions">{item.displayName}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{item.department}</span></td>
																						<td className="table-coloumn-positions">{item.beneficiaryName}</td>
																						<td className="table-coloumn-positions">{address}</td>
																						<td className="table-coloumn-positions">{
																							item.benefits.map((benefit, i) => {
																								return (
																									<div>
																										{benefit.scheme_rule_set_sub_benefit__benefit}
																									</div>
																								)
																							})
																						}</td>
																						<td className="table-coloumn-positions">{
																							item.benefits.map((benefit, i) => {
																								if (benefit.assigned_by !== null && benefit.completed_by__first_name === null) {
																									return (
																										<div>{benefit.assigned_by__first_name}</div>
																									)
																								}
																								else {
																									return (
																										<td className="table-coloumn-positions">Completed By :  <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{benefit.completed_by__first_name}</span></td>
																									)
																								}
																							})}
																						</td>
																						<td className="table-coloumn-positions">{
																							item.benefits.map((benefit, i) => {
																								if (benefit.assigned_on !== "" || benefit.assigned_on !== null) {
																									return (
																										<td>{new Date(benefit.assigned_on).toDateString().substring(4, 15)}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{new Date(benefit.assigned_on).toLocaleTimeString()}</span></td>
																									)
																								}
																								else {
																									return (
																										<div>-</div>
																									)
																								}
																							})}
																						</td>
																						<td className="table-coloumn-positions">{
																							item.benefits.map((benefit, i) => {
																								if (benefit.is_completed) {
																									return (
																										<div>
																											<FlatButton flat label="View Details" className="view-application-approve-new-btn btn-width" onClick={this.showCompletedNonMonetaryTask.bind(this, item, benefit)} />
																										</div>
																									)
																								}
																							})
																						}</td>
																					</tr>
																				)
																			}
																		})
																	}
																</tbody>
															</table>
														</div> :
														<div className="content-table-container" id="content-to-print">
															<CSVLink data={pocompleted}>
																<div className="export-icon-text-container">
																	<i className="material-icons export-icon">vertical_align_bottom</i>
																	<span className="export-text">Export</span>
																</div>
															</CSVLink>
															<div>
																{this.newPaginationButtons(data)}
															</div>
															<table cellSpacing="0" cellPadding="0" className="header-content-table" >
																<thead className="content-body-property" >
																	<tr height="48">
																		<th className="table-coloumn-positions">APPLICANT ID</th>
																		<th className="table-coloumn-positions">SCHEME, DEPARTMENT</th>
																		<th className="table-coloumn-positions">APPLICANT NAME</th>
																		<th className="table-coloumn-positions">APPLIED DATE, TIME</th>
																		<th className="table-coloumn-positions">COMMUNICATION ADDRESS</th>
																		<th className="table-coloumn-positions">TASK DETAILS</th>
																		<th className="table-coloumn-positions">VIEW DETAILS</th>
																	</tr>
																</thead>
																<tbody className="content-body-bottom-property" >
																	{
																		completedData.map((item, i) => {
																			let address = item.service_pickup_address.street1 + ", " + item.service_pickup_address.street2 + ", " + item.service_pickup_address.city + ", " + item.service_pickup_address.district + ", " + item.service_pickup_address.state + "-" + item.service_pickup_address.zip
																			if (item.status === "all_benefits_granted") {
																				pocompleted.push({
																					"Applicant Name": item.beneficiaryName,
																					"Scheme Name": item.displayName,
																					"Department": item.department,
																					"Communication Address": address,
																					"Task Details": item.benefits[0].benefit_name
																				})
																				return (
																					<tr className="content-table-row" key={i} >
																						<td className="table-coloumn-positions">{item.id}</td>
																						<td className="table-coloumn-positions">{item.displayName}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{item.department}</span></td>
																						<td className="table-coloumn-positions">{item.beneficiaryName}</td>
																						<td className="table-coloumn-positions">{new Date(item.createdOn).toDateString().substring(4, 15)}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{new Date(item.createdOn).toLocaleTimeString()}</span></td>
																						<td className="table-coloumn-positions">{address}</td>
																						<td className="table-coloumn-positions">
																							{
																								item.benefits.map((benefit, i) => {
																									return (
																										<div className="verify-doc-type-text span-text-style">
																											{benefit.scheme_rule_set_sub_benefit__benefit}
																											<br />
																										</div>
																									)
																								})
																							}</td>
																						<td className="table-coloumn-positions view-details-button">
																							{
																								item.benefits.map((benefit, i) => {
																									return (
																										<div>
																											<FlatButton flat label="View Details" className="view-application-approve-new-btn btn-width" onClick={this.showCompletedNonMonetaryTask.bind(this, item, benefit)} />
																											<br/>
																										</div>
																									)
																								})
																							}
																						</td>
																					</tr>
																				)
																			}
																		})
																	}
																</tbody>
															</table>
														</div> :
													<div className="no-record-found-text">
														<h4>No Records Found !!</h4>
													</div>
											}
										</div>
								}
							</div> : <NonMonetaryCompleteTask applicationData={selectedApplicationData} benefit={selectedBenefit} /> :

						<NonMonetaryCompletedTaskDetails applicationData={selectedApplicationData} benefit={selectedBenefit} />

				}
			</div>
		)
	}
}
