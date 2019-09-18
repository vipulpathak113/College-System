import React from 'react'
import FlatButton from '../Buttons/flat_button';
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'
import store from '../../utility/store'
import bootupsettings from '../../models/bootupsettings';
import easygov from '../../utility/network'
import { CSVLink } from 'react-csv'
import FilterNonDbtApplication from '../../utility/filter_non_dbt_application'

var activeAction = "", is_po = false, selectedApplicationData, selectedBenefitId, selectedUser, data = [], allApplications = []
var nonMonetaryApplications = [], nonMonetaryCompletedApplications = [], currentPage = 1, pageSize = 15, count = {}
var applicationsData = [], appStatus = "active_beneficiary", totalPages = 0, dataToExport = []
export default class NonDBT extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			classProperty: props.data,
			showCompleteTask: false,
			completedNonMonetaryTask: false,
			value: "",
			nonDbtApplications: props.data,
			facilitatorList: [],
			check: "",
			madeApiCall: false
		}
		count = props.count
		this.setWrapperRef = this.setWrapperRef.bind(this);
		this.handleClickOutside = this.handleClickOutside.bind(this)
	}
	openCompleteTask() {
		this.setState({
			showCompleteTask: true
		})
	}

	getDbtApplications() {
		easygov.send(bootupsettings.ENDPOINTS.GET_NON_DBT_APPLICATIONS, "", "GET_NON_DBT_APPLICATIONS")
	}

	handleTabChange(val) {
		applicationsData = []
		if(val === 1){
			appStatus = "active_beneficiary"
		}
		else {
			appStatus = "all_benefits_granted"
		}
		this.setState({ classProperty: val })
		if (document.getElementById('searchbar')) {
			document.getElementById('searchbar').value === ""
		}
		currentPage = 1
		this.getNonDbtApplications()
	}
	handleClick(appId, benefit_id) {
		this.setState({ display: 'block' })
		activeAction = appId + "_" + benefit_id
	}

	dropdownClick(appData, benefitId) {
		selectedApplicationData = appData
		selectedBenefitId = benefitId
		this.setState({ dropdownBorder: '1px solid #ef7950' })
	}

	completeAssignedTask(appData, benefitId) {
		selectedApplicationData = appData
		selectedBenefitId = benefitId
		this.completeNonDbtTask()
	}

	dropdownValue = (event) => {
		this.setState({ value: event.target.value });
	}

	handleSelectedUser = (event) => {
		selectedUser = event.target.value
	}

	handleAssignTo() {
		easygov.send(bootupsettings.ENDPOINTS.ASSIGN_BENEFIT, { "user_id": JSON.parse(selectedUser).user_id, "benefit_id": selectedBenefitId }, "ASSIGN_BENEFIT")
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "ASSIGN_BENEFIT") {
				if (response.code === 200) {
					applicationsData = []
					activeAction = null
					this.getNonDbtApplications()
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
			this.setState({ display: 'none', value: 'select' })
			document.getElementById('non-monetary-filter').selectedIndex = 0
		}
	}

	getNonDbtApplications() {
		let type = "", term = ""
		if(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)){
			type = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)).type
			term = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)).value
		}

		let searchObj = {
			searchType : type,
			searchTerm : term,
			status : appStatus,
			pageNumber : currentPage.toString()
		}
		easygov.send(bootupsettings.ENDPOINTS.GET_NON_DBT_APPLICATIONS, searchObj, "GET_NON_DBT_APPLICATIONS")
	}

	setCurrentPage(val, applications, totalPages) {
		applicationsData = []
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
		this.getNonDbtApplications()
	}

	newPaginationButtons(applications) {
		var row = []
		if (currentPage > 1) {
			row.push(<FlatButton className="page-boxes" label="First" onClick={this.setCurrentPage.bind(this, "first", applications)} id="first"></FlatButton>)
			row.push(<FlatButton className="page-boxes" label="Previous" onClick={this.setCurrentPage.bind(this, "previous", applications)} id="previous"></FlatButton>)
		}
		if (currentPage >= 1 && currentPage <= totalPages) {
			row.push(<div className="page-boxes-text" id="current">Showing page {currentPage} out of {totalPages}</div>)
		}
		if (currentPage < totalPages) {
			row.push(<FlatButton className="page-boxes" label="Next" onClick={this.setCurrentPage.bind(this, "next", applications)} id="next"></FlatButton>)
			row.push(<FlatButton className="page-boxes" label="Last" onClick={this.setCurrentPage.bind(this, "last", applications)} id="last"></FlatButton>)
		}
		// this.setState({check:""})
		return (
			<div  className="page-boxes-wrapper">{row}</div>
		)
	}

	componentDidMount() {
		currentPage = 1;
		this.getNonDbtApplications()
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "GET_NON_DBT_APPLICATIONS" || response.type === "SEARCH_DBT_APPLICATIONS") {
				if (response.code === 200) {
					dataToExport = []
					is_po = response.data.is_po
					allApplications = response.data.userApplications.objects
					totalPages = response.data.userApplications.totalPages
					activeAction = null
					this.setState({
						nonDbtApplications: response.data.userApplications.objects
					})
					if (response.data.is_po && response.data.userApplications.objects.length > 0 && appStatus === "active_beneficiary") {
						easygov.send(bootupsettings.ENDPOINTS.GET_FACILITATOR_USER, "", "GET_FACILITATOR_USER")
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
			}
			else if (response.type === "OPEN_COMPLETE_TAB") {
				this.setState({
					classProperty: 2
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

	completeNonDbtTask(val, selectedBenefit) {
		store.dispatch({ type: "SHOW_NON_DBT_COMPLETE_TASK", data: val, benefit: selectedBenefit })
	}

	showCompletedNonMonetaryTask(appData, selectedBenefit) {
		store.dispatch({ type: "SHOW_NON_DBT_COMPLETED_TASK", data: appData, benefit: selectedBenefit })
	}

	render() {

		let data = []

		let noPoNewExportToData = []
		// allApplications.map((item) => {
		// 	let address = item.kyc.house + ", " + item.kyc.street + ", " + item.kyc.vtc + ", " + item.kyc.loc + ", " + item.kyc.lm + "-" + item.kyc.subdist + ", " + item.kyc.dist + ", " + item.kyc.state + ", " + item.kyc.po
		// 	if (item.status === "active_beneficiary") {
		// 		noPoNewExportToData.push({
			// "Application Id: item.id,
		// 			"Applicant Name": item.beneficiaryName, "Scheme Name": item.displayName,
		// 			"Department Name": item.department,
		// 			"Address": address, "Task Detail": item.benefits.benefit_name,
		// 			"Assigned By": item.benefits.assigned_by, "Assigned On": new Date(item.benefits.assigned_on).toDateString().substring(4, 15)
		// 		})
		// 	}
		// })
		let newExportToData = []
		// allApplications.map((item) => {
		// 	let address = item.kyc.house + ", " + item.kyc.street + ", " + item.kyc.vtc + ", " + item.kyc.loc + ", " + item.kyc.lm + "-" + item.kyc.subdist + ", " + item.kyc.dist + ", " + item.kyc.state + ", " + item.kyc.po
		// 	if (item.status === "active_beneficiary") {
		// 		newExportToData.push({
			// "Application Id: item.id,
		// 			"Applicant Name": item.beneficiaryName, "Scheme Name": item.displayName,
		// 			"Department Name": item.department, "Date": new Date(item.createdOn).toDateString().substring(4, 15),
		// 			"Address": address, "Task Detail": item.benefits.benefit_name
		// 		})
		// 	}
		// })

		let noPoCompletedExportToData = []
		// allApplications.map((item) => {
		// 	let address = item.kyc.house + ", " + item.kyc.street + ", " + item.kyc.vtc + ", " + item.kyc.loc + ", " + item.kyc.lm + "-" + item.kyc.subdist + ", " + item.kyc.dist + ", " + item.kyc.state + ", " + item.kyc.po
		// 	if (item.status === "active_beneficiary") {
		// 		noPoCompletedExportToData.push({
			// "Application Id: item.id,
		// 			"Applicant Name": item.beneficiaryName, "Scheme Name": item.displayName,
		// 			"Department Name": item.department,
		// 			"Address": address, "Task Detail": item.benefits.benefit_name,
		// 			"Assigned By": item.benefits.assigned_by, "Assigned On": new Date(item.benefits.assigned_on).toDateString().substring(4, 15)
		// 		})
		// 	}
		// })

		let completedExportToData = []
		// allApplications.map((item) => {
		// 	let address = item.kyc.house + ", " + item.kyc.street + ", " + item.kyc.vtc + ", " + item.kyc.loc + ", " + item.kyc.lm + "-" + item.kyc.subdist + ", " + item.kyc.dist + ", " + item.kyc.state + ", " + item.kyc.po
		// 	completedExportToData.push({
			// "Application Id: item.id,
		// 		"Applicant Name": item.beneficiaryName, "Scheme Name": item.displayName,
		// 		"Department Name": item.department, "Date": new Date(item.createdOn).toDateString().substring(4, 15),
		// 		"Address": address, "Task Detail": item.benefits.benefit_name
		// 	})
		// })

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
			{ value: "service_id", label: "Application ID" },
			{ value: "scheme", label: "Scheme Name" },
			{ value: "department", label: "Department Name" },
			{ value: "name", label: "Applicant Name" },
		]
		return (
			<div>
				<div className="searchbar-container">
					<div className="content-tab-container">
						<span className={`content-tabs ${this.state.classProperty === 1 ? "tab-active" : ''}`} onClick={this.handleTabChange.bind(this, 1)}>New <span className="total-count-for-tabs">{count.nondbtNewCount}</span></span>
						<span className={`content-tabs ${this.state.classProperty === 2 ? "tab-active" : ''}`} onClick={this.handleTabChange.bind(this, 2)}>Completed <span className="total-count-for-tabs">{count.nondbtComplete}</span></span>
					</div>
					{FilterNonDbtApplication(filterTypesArray, appStatus)}
				</div>
				{
					this.state.classProperty === 1 ?
						<div>
							{/* for New Task*/}
							{
								allApplications.length > 0 ?
									!is_po ?
										<div className="content-table-container">
											<CSVLink data={dataToExport}>
												<div className="export-icon-text-container">
													<i className="material-icons export-icon">vertical_align_bottom</i>
													<span className="export-text">Export</span>
												</div>
											</CSVLink>
											<div>
												{this.newPaginationButtons(nonMonetaryApplications)}
											</div>
											<table cellSpacing="0" cellPadding="0" className="header-content-table">
												<thead className="content-body-property" >
													<tr height="48">
														<th className="table-coloumn-positions">APPLICANT ID</th>
														<th className="table-coloumn-positions">SCHEME, DEPARTMENT</th>
														<th className="table-coloumn-positions">APPLICANT NAME</th>
														<th className="table-coloumn-positions">COMMUNICATION ADDRESS</th>
														<th className="table-coloumn-positions">TASK DETAILS</th>
														<th className="table-coloumn-positions">ASSIGNED BY</th>
														<th className="table-coloumn-positions">ASSIGNED ON</th>
														<th className="table-coloumn-positions doc-type-mgmnt">TAKE ACTION</th>
													</tr>
												</thead>
												<tbody className="content-body-bottom-property" >
													{
														allApplications.map((item, i) => {
															if (item.status === "active_beneficiary" && !is_po) {
																let address = item.kyc.house + ", " + item.kyc.street + ", " + item.kyc.vtc + ", " + item.kyc.loc + ", " + item.kyc.lm + "-" + item.kyc.subdist + ", " + item.kyc.dist + ", " + item.kyc.state + ", " + item.kyc.po
																if (item.status === "active_beneficiary") {
																	return (
																		<tr className="content-table-row" key={i} >
																			<td className="table-coloumn-positions">{item.id}</td>
																			<td className="table-coloumn-positions">{item.displayName}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{item.department}</span></td>
																			<td className="table-coloumn-positions">{item.beneficiaryName}</td>
																			<td className="table-coloumn-positions">{address}</td>
																			<td className="table-coloumn-positions">
																				{
																					item.benefits.map((benefit, i) =>{
																						return(
																							<div>
																								{benefit.scheme_rule_set_sub_benefit__benefit} of ₹ {benefit.scheme_rule_set_sub_benefit__value}
																								<br />
																							</div>
																						)
																					})
																				}
																			</td>
																			<td className="table-coloumn-positions">
																				{
																					item.benefits.map((benefit, i) =>{
																						return(
																							<div>
																								{
																									benefit.completed_by__first_name === null ?
																										<td className="table-coloumn-positions">{benefit.assigned_by__first_name}</td> :
																											<td className="table-coloumn-positions">-</td>
																								}
																							</div>
																						)
																					})
																				}
																			</td>
																			<td className="table-coloumn-positions">
																				{
																					item.benefits.map((benefit, i) =>{
																						return(
																							<div>
																							{
																								benefit.completed_by__first_name === null ?
																									<td className="table-coloumn-positions">{new Date(benefit.assigned_on).toDateString().substring(4, 15)}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{new Date(benefit.assigned_on).toLocaleTimeString()}</span></td> :
																										<td className="table-coloumn-positions">-</td>
																							}
																							</div>
																						)
																					})
																				}
																			</td>
																			<td className="table-coloumn-positions">
																				{
																					item.benefits.map((benefit, i) =>{
																						return(
																							<div>
																							{
																								benefit.completed_by__first_name === null ?
																									<td className="table-coloumn-positions doc-type-mgmnt"><FlatButton flat label="Complete" className="view-application-approve-new-btn" onClick={this.completeAssignedTask.bind(this, item, benefit.id)} /></td> :
																										<td className="table-coloumn-positions">Completed</td>
																							}
																							</div>
																						)
																					})
																				}
																			</td>
																			{/*<td className="table-coloumn-positions">{item.benefits.benefit_name}</td>
																			<td className="table-coloumn-positions">{item.benefits.assigned_by}</td>
																			<td className="table-coloumn-positions">{new Date(item.benefits.assigned_on).toDateString().substring(4, 15)}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{new Date(item.benefits.assigned_on).toLocaleTimeString()}</span></td>
																			<td className="table-coloumn-positions doc-type-mgmnt"><FlatButton flat label="Complete" className="view-application-approve-new-btn" onClick={this.completeAssignedTask.bind(this, item, item.benefit.id)} /></td>*/}
																		</tr>
																	)

																}
															}
														})
													}
												</tbody>
											</table>
										</div> :
										<div className="content-table-container">
											<CSVLink data={newExportToData}>
												<div className="export-icon-text-container">
													<i className="material-icons export-icon">vertical_align_bottom</i>
													<span className="export-text">Export</span>
												</div>
											</CSVLink>
											<div>
												{this.newPaginationButtons(nonMonetaryApplications)}
											</div>
											<table cellSpacing="0" cellPadding="0" className="header-content-table">
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
												<tbody className="content-body-bottom-property">
													{
														allApplications.map((item, i) => {
															let address = item.kyc.house + ", " + item.kyc.street + ", " + item.kyc.vtc + ", " + item.kyc.loc + ", " + item.kyc.lm + "-" + item.kyc.subdist + ", " + item.kyc.dist + ", " + item.kyc.state + ", " + item.kyc.po
															if (item.status === "active_beneficiary" && !item.is_dbt) {
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
																							{benefit.scheme_rule_set_sub_benefit__benefit} of ₹ {benefit.scheme_rule_set_sub_benefit__value}
																							<br />
																						</div>
																					)
																				})
																			}
																		</td>
																		<td className="table-coloumn-positions">
																			{
																				item.benefits.map((benefit, i) => {
																					let dialog_id = item.id + "_" + benefit.id
																					if (benefit.assigned_to__first_name === null && benefit.completed_by__first_name === null) {
																						return(
																							<div>
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
																													onClick={this.dropdownClick.bind(this, item, item.benefits.id)}
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
																																<FlatButton flat label="Confirm" onClick={this.completeNonDbtTask.bind(this, item, benefit)} />
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
																										</div>
																										: null
																								}
																							</div>
																						)
																					}
																					else if(benefit.completed_by__first_name !== null) {
																						return (
																							<td className="table-coloumn-positions">Completed By :  <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{benefit.completed_by__first_name}</span></td>
																						)
																					}
																					else {
																						return (
																							<td className="table-coloumn-positions">Assigned To :  <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{benefit.assigned_to__first_name}</span></td>
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
								allApplications.length > 0 ?
									!is_po ?
										<div className="content-table-container">
											<CSVLink data={noPoCompletedExportToData}>
												<div className="export-icon-text-container">
													<i className="material-icons export-icon">vertical_align_bottom</i>
													<span className="export-text">Export</span>
												</div>
											</CSVLink>
											<div>
												{this.newPaginationButtons(allApplications)}
											</div>
											<table cellSpacing="0" cellPadding="0" className="header-content-table">
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
														allApplications.map((item, i) => {
															if (item.status === "all_benefits_granted") {
																let address = item.kyc.house + ", " + item.kyc.street + ", " + item.kyc.vtc + ", " + item.kyc.loc + ", " + item.kyc.lm + "-" + item.kyc.subdist + ", " + item.kyc.dist + ", " + item.kyc.state + ", " + item.kyc.po
																return (
																	<tr className="content-table-row" key={i} >
																		<td className="table-coloumn-positions">{item.id}</td>
																		<td className="table-coloumn-positions">{item.displayName}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{item.department}</span></td>
																		<td className="table-coloumn-positions">{item.beneficiaryName}</td>
																		<td className="table-coloumn-positions">{address}</td>
																		<td className="table-coloumn-positions">{item.benefits.benefit_name}</td>
																		<td className="table-coloumn-positions">{item.benefits.assigned_by}</td>
																		<td className="table-coloumn-positions">{
																			item.benefits.assigned_on !== "" || item.benefits.assigned_on !== null ?
																				<td>{new Date(item.benefits.assigned_on).toDateString().substring(4, 15)}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{new Date(item.benefits.assigned_on).toLocaleTimeString()}</span></td>
																				: <div>-</div>
																		}</td>
																		<td className="table-coloumn-positions">
																			<FlatButton flat label="Complete" className="view-application-approve-new-btn" onClick={this.completeAssignedTask.bind(this, item, item.benefits.id)} />
																		</td>
																	</tr>
																)
															}
														})
													}
												</tbody>
											</table>
										</div> :
										<div className="content-table-container">
											<CSVLink data={completedExportToData}>
												<div className="export-icon-text-container">
													<i className="material-icons export-icon">vertical_align_bottom</i>
													<span className="export-text">Export</span>
												</div>
											</CSVLink>
											<div>
												{this.newPaginationButtons(allApplications)}
											</div>
											<table cellSpacing="0" cellPadding="0" className="header-content-table">
												<thead className="content-body-property" >
													<tr height="48">
														<th className="table-coloumn-positions">APPLICANT ID</th>
														<th className="table-coloumn-positions">SCHECATEGORY, DEPARTMENT</th>
														<th className="table-coloumn-positions">APPLICANT NAME</th>
														<th className="table-coloumn-positions">APPLIED DATE, TIME</th>
														<th className="table-coloumn-positions">COMMUNICATION ADDRESS</th>
														<th className="table-coloumn-positions">TASK DETAILS</th>
														<th className="table-coloumn-positions">COMPLETED BY</th>
														<th className="table-coloumn-positions  doc-type-mgmnt">VIEW APPLICATION</th>
													</tr>
												</thead>
												<tbody className="content-body-bottom-property" >
													{
														allApplications.map((item, i) => {
															let address = item.kyc.house + ", " + item.kyc.street + ", " + item.kyc.vtc + ", " + item.kyc.loc + ", " + item.kyc.lm + "-" + item.kyc.subdist + ", " + item.kyc.dist + ", " + item.kyc.state + ", " + item.kyc.po
															if (item.status === "all_benefits_granted") {
																return (
																	<tr className="content-table-row" key={i} >
																		<td className="table-coloumn-positions">{item.id}</td>
																		<td className="table-coloumn-positions">{item.displayName}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{item.department}</span></td>
																		<td className="table-coloumn-positions">{item.beneficiaryName}</td>
																		<td className="table-coloumn-positions">{new Date(item.createdOn).toDateString().substring(4, 15)}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{new Date(item.createdOn).toLocaleTimeString()}</span></td>
																		<td className="table-coloumn-positions">{address}</td>
																		<td className="table-coloumn-positions">
																			{
																				item.benefits.map((benefit, i) =>{
																					return(
																						<div>
																						{benefit.scheme_rule_set_sub_benefit__benefit} of ₹ {benefit.scheme_rule_set_sub_benefit__value}
																						<br />
																						</div>
																					)
																				})
																			}
																		</td>
																		<td className="table-coloumn-positions">
																			{
																			item.benefits.map((benefit, i) =>{
																				return(
																					<div>
																					{benefit.completed_by__first_name}
																					</div>
																				)
																			})
																		}
																		</td>
																		<td className="table-coloumn-positions doc-type-mgmnt">
																			{
																			item.benefits.map((benefit, i) =>{
																				return(
																					<div>
																					<FlatButton flat label="View Details" className="view-application-approve-new-btn" onClick={this.showCompletedNonMonetaryTask.bind(this, item, benefit)} />
																					</div>
																				)
																			})
																		}
																		</td>
																		{/*
																			item.benefits.map((benefit, i) =>{
																				return(
																					<div>
																					<td className="table-coloumn-positions">
																						{benefit.scheme_rule_set_sub_benefit__benefit} of ₹ {benefit.scheme_rule_set_sub_benefit__value}
																						<br />
																					</td>
																					<td className="table-coloumn-positions">
																						{benefit.completed_by__first_name}
																					</td>
																					<td className="table-coloumn-positions doc-type-mgmnt">
																						<FlatButton flat label="View Details" className="view-application-approve-new-btn" onClick={this.showCompletedNonMonetaryTask.bind(this, item, benefit)} />
																					</td>
																					</div>
																				)
																			})
																		*/}
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
			</div>
		)
	}
}
