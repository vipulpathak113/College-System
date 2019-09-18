import React from 'react'
import ActiveBeneficiaryApplication from './active_beneficiary_application'
import AllBenefitGrantedApplication from './all_benefit_granted_application'
import AppliedApplication from './applied_application'
import DocumentsApprovedApplication from './documents_approved_application'
import DocumentsRejectedApplication from './documents_rejected_application'
import DocumentsPendingApplication from './documents_pending_application'
import HoldApplication from './hold_application'
import NewApplication from './new_application'
import store from '../../utility/store'
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'
import ViewApplicationDetails from './view_application_details'
import FilterApplications from '../../utility/filter_application'
import $ from 'jquery'
import { CSVLink } from 'react-csv'

var applicationData, currentComponentValue, openViewApplication = false, pageStatus = "", count ={}, rejectedData = []
export default class ViewApplication extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			classProperty: 1,
			showViewApplicationDetails: false,
			check: ""
		}
		count = props.count
	}

	componentWillMount() {
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "SHOW_VIEW_APPLICATION_DETAILS") {
				applicationData = response.data
				currentComponentValue = response.currentComponent
				openViewApplication = true
				this.setState({
					showViewApplicationDetails: true
				})
			}
			else if (response.type === "CLOSE_VIEW_APPLICATION_DETAILS") {
				openViewApplication = false
				this.setState({
					showViewApplicationDetails: false,
					classProperty: response.currentComponent
				})
			}
			else if (response.type === "REJECTED_APPLICATION_DATA") {
				rejectedData = response.data
				this.setState({
					check : ""
				})
			}
			else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
				storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
				window.location.href = "/sign-in"
			}
		})
	}

	handleClick(val) {
		if(val !== this.state.classProperty){
			storage.removeItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE)
			storage.removeItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)
			if (document.getElementById('searchbar') && document.getElementById('new-search-bar-filter')) {
				document.getElementById('searchbar').value = ""
				document.getElementById('new-search-bar-filter').value = "search-select-any-one"
			}
		}
		this.setState({ classProperty: val })
		val === 1 ? pageStatus = "" :
			val === 2 ? pageStatus = "form_filled_up" :
				val === 3 ? pageStatus = "all_documents_accepted" :
					val === 4 ? pageStatus = "documents_rejected" :
						val === 5 ? pageStatus = "documents_pending" :
							val === 6 ? pageStatus = "on_hold" :
								val === 7 ? pageStatus = "active_beneficiary" :
									val === 8 ? pageStatus = "all_benefits_granted" : null
	}

	printCommand(val) {
		var mywindow = window.open('', 'PRINT', 'height=1000,width=1000');
		mywindow.document.write(document.getElementById(val).innerHTML);
		mywindow.document.close(); // necessary for IE >= 10
		mywindow.focus(); // necessary for IE >= 10*/
		mywindow.print();
		mywindow.close();
	}

	callAction() {
		let file = new Blob([$('.content-table-container').html()], { type: "application/vnd.ms-excel" });
		let url = URL.createObjectURL(file);
		let a = $("<a />", {
			href: url,
			download: "filename.xls"
		})
			.appendTo("body")
			.get(0)
			.click();
	}

	render() {
		let filterTypesArray = [
			{ value: "service_id", label: "Application ID" },
			// { value: "name", label: "Applicant Name" },
			{ value: "scheme", label: "Scheme Name" },
			{ value: "department", label: "Department Name" },
			{ value: "district", label: "Geography" },
		]
		let dataToExport = []
		rejectedData.map((item) => {
			let approvedDocs = []
			let rejectedDocs = []
			let reason = []
			item.applicationDocs.map((doc) => {
				if(doc.isApproved) {
					approvedDocs.push(doc.fieldDisplayName)
				}
				else if (!doc.isApproved) {
					rejectedDocs.push(doc.fieldDisplayName)
					reason.push(doc.documentStatusMappingMessage)
				}
				// docs.push(doc.fieldDisplayName)
			})
			let address = item.kyc.loc + item.kyc.street + ", " + item.kyc.lm + ", " + item.kyc.subdist + ", " + item.kyc.dist + ", " + item.kyc.state
			dataToExport.push({
				"Application Id": item.id,
				"Applicant Name": item.beneficiaryName,
				"Scheme Name": item.displayName,
				"Department Name": item.department,
				"Address": address,
				"District": item.district,
				"Tehsil": item.tehsil,
				"Contact Number": item.kyc.phone,
				"Care of Name": item.kyc.co,
				"Approved Documents": approvedDocs,
				"Rejected Documents": rejectedDocs,
				"Reason": reason,

			})
		})
		// {value:"applied", label:"Applied On"},
		return (
			<div>
				{!openViewApplication ?
					<div className="right-panel-content-bg">
						<h3 className="approve-beneficiary-text">View Application</h3>
						<div className="export-btn-container">
							<div className="view-print-icon-text-container" onClick={this.printCommand.bind(this, "content-to-print")}>
								<i className="material-icons export-icon">print</i>
								<span className="export-text" >Print</span>
							</div>
							{
								this.state.classProperty !== 4 ?
									<div className="icon-text-container" onClick={this.callAction.bind(this)}>
									<i className="material-icons export-icon">vertical_align_bottom</i>
									<span className="export-text">Export</span>
									</div> :
									<CSVLink data={dataToExport} >
										<div className="export-icon-text-container">
											<i className="material-icons export-icon">vertical_align_bottom</i>
											<span className="export-text">Export</span>
										</div>
									</CSVLink>

							}
						</div>
						<div className="searchbar-container">
							<div className="content-tab-container">
								<span className={`content-tabs ${this.state.classProperty === 1 ? "tab-active" : ''}`} onClick={this.handleClick.bind(this, 1)}>All <span className="total-count-for-tabs">{count.totalApplications}</span></span>
								<span className={`content-tabs ${this.state.classProperty === 2 ? "tab-active" : ''}`} onClick={this.handleClick.bind(this, 2)}>Applied <span className="total-count-for-tabs">{count.documentsApprovedRemaining}</span></span>
								<span className={`content-tabs ${this.state.classProperty === 3 ? "tab-active" : ''}`} onClick={this.handleClick.bind(this, 3)}>Documents Approved <span className="total-count-for-tabs">{count.allDocumentsAccepted}</span></span>
								<span className={`content-tabs ${this.state.classProperty === 4 ? "tab-active" : ''}`} onClick={this.handleClick.bind(this, 4)}>Documents Rejected <span className="total-count-for-tabs">{count.rejected}</span></span>
								<span className={`content-tabs ${this.state.classProperty === 5 ? "tab-active" : ''}`} onClick={this.handleClick.bind(this, 5)}>Documents Approval Pending <span className="total-count-for-tabs">{count.documentsPending}</span></span>
								<span className={`content-tabs ${this.state.classProperty === 6 ? "tab-active" : ''}`} onClick={this.handleClick.bind(this, 6)}>Application On Hold <span className="total-count-for-tabs">{count.onHold}</span></span>
								<span className={`content-tabs ${this.state.classProperty === 7 ? "tab-active" : ''}`} onClick={this.handleClick.bind(this, 7)}>Active Beneficiary <span className="total-count-for-tabs">{count.benefitsRemaining}</span></span>
								<span className={`content-tabs ${this.state.classProperty === 8 ? "tab-active" : ''}`} onClick={this.handleClick.bind(this, 8)}>All Benefit Granted <span className="total-count-for-tabs">{count.benefitsGranted}</span></span>
							</div>
							{FilterApplications(filterTypesArray, pageStatus)}
						</div>
						<div id="content-to-print">
							{
								this.state.classProperty === 1 ?
									<NewApplication /> : this.state.classProperty === 2 ?
										<AppliedApplication /> : this.state.classProperty === 3 ?
											<DocumentsApprovedApplication /> : this.state.classProperty === 4 ?
												<DocumentsRejectedApplication /> : this.state.classProperty === 5 ?
													<DocumentsPendingApplication /> : this.state.classProperty === 6 ?
														<HoldApplication /> : this.state.classProperty === 7 ?
															<ActiveBeneficiaryApplication /> : this.state.classProperty === 8 ?
																<AllBenefitGrantedApplication /> : null
							}
						</div>
					</div> : <ViewApplicationDetails data={applicationData} currentComponent={currentComponentValue} />
				}
			</div>
		)
	}
}
