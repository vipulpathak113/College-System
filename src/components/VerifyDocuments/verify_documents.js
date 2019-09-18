import React from 'react'
import { Snackbar } from 'react-md'
import ApprovedVerifyDocuments from './approved_verify_document'
import NewVerifyDocuments from './new_verify_document'
import PendingVerifyDocuments from './pending_verify_document'
import RejectedVerifyDocuments from './rejected_verify_document'
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'
import store from '../../utility/store'
import ViewDocument from './view_document'
import FilterApplications from '../../utility/filter_application'

var documentInfo, applicationInfo, currentComponentValue, openViewDocs = false, pageStatus = "form_filled_up", exportData = [], count = {}
export default class VerifyDocument extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			permissions: storage.getItemValue(keys.USER_PREFERENCE.PERMISSIONS),
			classProperty: 1,
			showViewDocument: false,
			applicationsData: props.data,
			toasts: [],
			autohide: true,
			check: ""
		}
		count = props.count
	}
	handleClick(val) {
		// GetAllApplications()
		if(val !== this.state.classProperty){
			storage.removeItemValue(keys.APP_PREFERENCE.PREVIOUS_COUNT)
			storage.removeItemValue(keys.USER_PREFERENCE.SCROLL_POSITION)
			storage.removeItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)
			storage.removeItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE)
			if (document.getElementById('searchbar') && document.getElementById('new-search-bar-filter')) {
				document.getElementById('searchbar').value = ""
				document.getElementById('new-search-bar-filter').value = "search-select-any-one"
			}
		}
		this.setState({ classProperty: val })
		val === 1 ? pageStatus = "form_filled_up" :
			val === 2 ? pageStatus = "documents_pending" :
				val === 3 ? pageStatus = "all_documents_accepted" :
					val === 4 ? pageStatus = "documents_rejected" : null

	}

	checkApplicationStatus() {
		if (storage.getItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS)) {
			let obj = JSON.parse(storage.getItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS))
			this.state.applicationsData.map((item, i) => {
				if (item.id === obj.id) {
					if (item.status !== obj.status) {
						if (item.status === "all_documents_accepted") {
							this.callToast("Application has been moved to Approved tab.")
							storage.removeItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS)
						}
						else if (item.status === "documents_rejected") {
							this.callToast("Application has been moved to Rejected tab.")
							storage.removeItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS)
						}
						else if (item.status === "documents_pending") {
							this.callToast("Application has been moved to Pending tab.")
							storage.removeItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS)
						}
					}
					else {
						storage.removeItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS)
					}
				}
			})
		}
	}


	addToast = (text, action, autohide = true) => {
		this.setState((state) => {
			const toasts = state.toasts.slice();
			toasts.push({ text, action });
			return { toasts, autohide };
		});
	};

	dismissToast = () => {
		const [, ...toasts] = this.state.toasts;
		this.setState({ toasts });
	};


	callToast = (val) => {
		this.addToast(val, "CLOSE");
	};

	componentDidMount() {
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "VIEW_DOCUMENT") {
				documentInfo = response.docData
				applicationInfo = response.applicationInfo
				currentComponentValue = response.currentComponent
				openViewDocs = true
				this.setState({
					showViewDocument: true
				})
			}
			else if (response.type === "CLOSE_VIEW_DOCUMENT") {
				openViewDocs = false
				// GetAllApplications()
				this.setState({
					showViewDocument: false
				})
			}
			else if (response.type === "COUNT_UPDATED") {
				count = response.data
				this.setState({
					check: ""
				})
			}
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
	render() {
		const { toasts, autohide } = this.state;
		let filterTypesArray = [
			{ value: "service_id", label: "Application ID" },
			// { value: "name", label: "Applicant Name" },
			{ value: "scheme", label: "Scheme Name" },
			{ value: "department", label: "Department Name" },
			{ value: "district", label: "Geography" },
		]
		return (
			<div>
				{
					!openViewDocs ?
						<div className="right-panel-content-bg">
							<h3 className="approve-beneficiary-text">Verify Documents</h3>
							<div className="export-btn-container">
								<div className="icon-text-container" onClick={this.printCommand.bind(this, "verify-document-print")}>
									<i className="material-icons export-icon">print</i>
									<span className="export-text">Print</span>
								</div>
							</div>
							<div className="searchbar-container">
								<div className="content-tab-container">
									<span className={`content-tabs ${this.state.classProperty === 1 ? "tab-active" : ''}`} onClick={this.handleClick.bind(this, 1)}>New <span className="total-count-for-tabs">{count.documentsApprovedRemaining}</span></span>
									{
										this.state.permissions.includes("data.change_review_documents") && !this.state.permissions.includes("data.change_review_applications") ?
											<span className={`content-tabs ${this.state.classProperty === 2 ? "tab-active" : ''}`} onClick={this.handleClick.bind(this, 2)}>Pending <span className="total-count-for-tabs">{count.documentsPending}</span></span> : null
									}
									<span className={`content-tabs ${this.state.classProperty === 3 ? "tab-active" : ''}`} onClick={this.handleClick.bind(this, 3)}>Approved <span className="total-count-for-tabs">{count.allDocumentsAccepted}</span></span>
									<span className={`content-tabs ${this.state.classProperty === 4 ? "tab-active" : ''}`} onClick={this.handleClick.bind(this, 4)}>Rejected <span className="total-count-for-tabs">{count.rejected}</span></span>
								</div>
								{FilterApplications(filterTypesArray, pageStatus)}
							</div>
							<div id="verify-document-print">
								{
									this.state.classProperty === 1 ?
										<NewVerifyDocuments /> : this.state.classProperty === 2 ?
											<PendingVerifyDocuments /> : this.state.classProperty === 3 ?
												<ApprovedVerifyDocuments /> : this.state.classProperty === 4 ?
													<RejectedVerifyDocuments /> : null
								}
							</div>
						</div>
						: <ViewDocument docInfo={documentInfo} applicationInfo={applicationInfo} currentComponent={currentComponentValue} />
				}
				<div>
					<Snackbar
						id="app-password-snackbar"
						toasts={toasts}
						primary
						autohide={true}
						onDismiss={this.dismissToast}
					/>
				</div>
			</div>
		)
	}
}
