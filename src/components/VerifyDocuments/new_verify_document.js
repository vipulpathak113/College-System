import React from 'react'
import FlatButton from '../Buttons/flat_button'
import { Button } from 'react-md'
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'
import store from '../../utility/store'
import network from '../../utility/network'
import bootupsettings from '../../models/bootupsettings'
import allApplicationsPagination from '../../utility/all_applications_pagination'
import { CSVLink } from 'react-csv'
import $ from 'jquery'

var activeAction = "", applicantKyc, docData, data = [], pages = 0, row = [], previousPage = 1, exportToData = [], totalCount = 0
export default class NewVerifyDocuments extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			permissions: storage.getItemValue(keys.USER_PREFERENCE.PERMISSIONS),
			display: 'none',
			openDocInfo: false,
			applicationsData: []
		}
	}

	showDocument(docInfo, applicationInfo) {
		storage.removeItemValue(keys.USER_PREFERENCE.SCROLL_POSITION)
		storage.setItemValue(keys.USER_PREFERENCE.SCROLL_POSITION, $(window).scrollTop())
		store.dispatch({
			type: "VIEW_DOCUMENT",
			docData: docInfo,
			applicationInfo: applicationInfo,
			currentComponent: 1
		})
	}

	componentDidMount() {
		window.$ = $
		if (storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE)) {
			previousPage = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE))
		}
		let searchObj = {
			"size": 15,
			"searchTerm" : "",
			"searchType" : "",
			"status" : "form_filled_up",
			"pageNumber": previousPage
		}
		// { "searchTerm": term, "searchType": type, "status": "form_filled_up", "size": 15, "pageNumber": previousPage }

		if(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)){
			searchObj.searchTerm = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)).value
			searchObj.searchType = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)).type
		}
		network.send(bootupsettings.ENDPOINTS.SEARCH_APPLICATIONS, searchObj, "form_filled_up", function (response, component) { })
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "form_filled_up") {
				if (response.code === 200) {
					data = response.data.objects
					pages = response.data.totalPages
					totalCount = response.data.totalCount
					this.setState({ applicationsData: data })
					if (storage.getItemValue(keys.APP_PREFERENCE.PREVIOUS_COUNT)) {
						if (response.data.totalCount !== storage.getItemValue(keys.APP_PREFERENCE.PREVIOUS_COUNT)) {
							network.send(bootupsettings.ENDPOINTS.APPLICATION_COUNT, "", "NEW_APPLICATIONS_COUNT", function (response, component) { })
						}
					}
					else {
						storage.setItemValue(keys.APP_PREFERENCE.PREVIOUS_COUNT, response.data.totalCount)
					}
				}
				else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
					storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
					window.location.href = "/sign-in"
				}
			}
		})
	}
	showMessage(docs) {
		this.setState({
			showRejectMessage: docs.id
		})
	}

	hideMessage() {
		this.setState({
			showRejectMessage: ""
		})
	}

	handleBlur(val) {
		this.setState({ display: 'block' })
	}

	scrollPage() {
		if (storage.getItemValue(keys.USER_PREFERENCE.SCROLL_POSITION)) {
			window.scrollTo(0, storage.getItemValue(keys.USER_PREFERENCE.SCROLL_POSITION))
		}
	}

	// {/*<span className="verify-doc-type-text span-text-style">Sent for Approval</span>*/}
	// {/*<div>
	// 	<span className="verify-doc-type-text span-rejected-text-style" onMouseOver={this.showMessage.bind(this, docs)} onMouseOut={this.hideMessage.bind(this)}>Sent for Rejection</span>
	// 	{
	// 		this.state.showRejectMessage === docs.id ?
	// 			<div className="reject-message-wrapper" >
	// 				<div className="reject-arrow-down"></div>
	// 				<div className="approve-benefit-dropdown-container" >
	// 					<div className="">
	// 						<h4 className="apply-an-action-text">{docs.suggested_message}</h4>
	// 					</div>
	// 				</div>
	// 			</div>
	// 			: null
	// 	}
	// </div>*/}

	render() {
		exportToData = []
		data.map((item) => {
			let docs = []
			item.applicationDocs.map((doc) => {
				docs.push(doc.fieldDisplayName)
			})
			let address = item.kyc.loc + item.kyc.street + ", " + item.kyc.lm + ", " + item.kyc.subdist + ", " + item.kyc.dist + ", " + item.kyc.state
			exportToData.push({
				"Application Id": item.id,
				"Applicant Name": item.beneficiaryName,
				"Scheme Name": item.displayName,
				"Department Name": item.department,
				"Address": address,
				"District": item.district,
				"Tehsil": item.tehsil,
				"Contact Number": item.kyc.phone,
				"Care of Name": item.kyc.co,
				"Documents": docs

			})
		})
		return (
			<div>
				<div>
					{
						data.length > 0 ?
							!this.state.openDocInfo ?
								<div className="content-table-container">
								<CSVLink data={exportToData} >
									<div className="export-icon-text-container">
										<i className="material-icons export-icon">vertical_align_bottom</i>
										<span className="export-text">Export</span>
									</div>
								</CSVLink>
									<div>
										{allApplicationsPagination("form_filled_up", pages, "form_filled_up", totalCount)}
									</div>
									<table cellSpacing="0" cellPadding="0" className="header-content-table">
										<thead className="content-body-property">
											<tr height="48">
												<th className="table-coloumn-positions">APPLICANT ID</th>
												<th className="table-coloumn-positions">APPLICANT NAME</th>
												<th className="table-coloumn-positions">GEOGRAPHY</th>
												<th className="table-coloumn-positions">TEHSIL</th>
												<th className="table-coloumn-positions">DATE & TIME OF APPLICATION</th>
												<th className="table-coloumn-positions">SCHEME, DEPARTMENT</th>
												<th className="table-coloumn-positions doc-type-mgmnt">DOCUMENT</th>
												<th className="table-coloumn-positions doc-type-mgmnt">ACTION</th>
												<th className="table-coloumn-positions" style={{ display: "none" }}>APPROVED BY</th>
											</tr>
										</thead>
										<tbody className="content-body-bottom-property">
											{
												data.map((item, i) => {
													if (i === data.length - 1) {
														this.scrollPage()
													}
													if (item.applicationDocs.length !== 0 && item.status === "form_filled_up") {
														return (
															<tr className="content-table-row" key={i}>
																<td className="table-coloumn-positions">{item.id}</td>
																<td className="table-coloumn-positions">{item.beneficiaryName}</td>
																<td className="table-coloumn-positions">{item.district}</td>
																<td className="table-coloumn-positions">{item.tehsil}</td>
																<td className="table-coloumn-positions">{new Date(item.createdOn).toDateString().substring(4, 15)}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{new Date(item.createdOn).toLocaleTimeString()}</span></td>
																<td className="table-coloumn-positions">{item.displayName}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{item.department}</span></td>
																<td className="table-coloumn-positions doc-type-mgmnt">
																	{item.applicationDocs.map((docs, i) => {
																		return (
																			<div className="verify-doc-type-text span-text-style" key={i}>
																				{docs.fieldDisplayName}
																				<br />
																			</div>
																		)
																	})}</td>

																<td className="table-coloumn-positions doc-type-mgmnt">
																	{item.applicationDocs.map((docs, j) => {
																		if (docs.isApproved === true && docs.isPending === false) {
																			return (
																				<span className="verify-doc-type-text span-text-style"> <i className="material-icons done-icon-style">done</i>Approved </span>
																			)
																		}
																		else if (docs.isApproved === false && docs.isPending === false) {
																			return (
																				<div>
																					<span className="verify-doc-type-text span-rejected-text-style" onMouseOver={this.showMessage.bind(this, docs)} onMouseOut={this.hideMessage.bind(this)}> <i className="material-icons done-icon-style span-rejected-text-style">close</i> &nbsp;Rejected </span>
																					{
																						this.state.showRejectMessage === docs.id ?
																							<div className="reject-message-wrapper" >
																								<div className="reject-arrow-down"></div>
																								<div className="approve-benefit-dropdown-container" >
																									<div className="">
																										<h4 className="apply-an-action-text">{docs.documentStatusMappingMessage}</h4>
																									</div>
																								</div>
																							</div>
																							: null
																					}
																				</div>
																			)
																		}
																		else if (docs.isPending === true && (docs.isApproved === null || !docs.hasOwnProperty('isApproved'))) {
																			return (
																				<div className="verify-doc-type-text verify-review-later-btn-container">
																					{
																						this.state.permissions.includes("data.change_review_documents") && !this.state.permissions.includes("data.change_review_applications") ?
																							<Button flat label="Review Later" iconClassName="material-icons" className="verify-doc-type-text span-review-later-text-style" onClick={this.showDocument.bind(this, item.applicationDocs[j], item)}>history</Button> :
																								!this.state.permissions.includes("data.change_review_documents") && !this.state.permissions.includes("data.change_review_applications") ?
																									<span className="verify-doc-type-text span-text-style">Review Later </span> :
																										this.state.permissions.includes("data.change_review_documents") && this.state.permissions.includes("data.change_review_applications") ?
																											<span className="verify-doc-type-text span-rejected-text-style"> Pending with TWO</span> : null
																					}
																				</div>
																			)
																		}
																		else if (docs.isPending === null && docs.isApproved === null && docs.suggested_action === null || !docs.hasOwnProperty("isPending") && !docs.hasOwnProperty("isApproved") && !docs.hasOwnProperty("suggested_action")) {
																			return (
																				<div className="verify-doc-type-text verify-review-later-btn-container">
																					{ this.state.permissions.includes("data.change_review_documents") && !this.state.permissions.includes("data.change_review_applications") ?
																							<FlatButton flat label="Verify Now" className="view-application-approve-new-btn" onClick={this.showDocument.bind(this, item.applicationDocs[j], item)} /> :
																								this.state.permissions.includes("data.change_review_documents") && this.state.permissions.includes("data.change_review_applications") ?
																								  <span className="verify-doc-type-text span-rejected-text-style"> Pending with TWO</span>: null}
																				</div>
																			)
																		}
																		else if (docs.isPending === null && docs.isApproved === null  && this.state.permissions.includes("data.change_review_documents") && this.state.permissions.includes("data.change_review_applications")) {
																			return (
																				<div className="verify-doc-type-text verify-review-later-btn-container">
																					{this.state.permissions.includes("data.change_review_documents") ?
																						<FlatButton flat label="Pending for Approval" className="view-application-approve-new-btn" onClick={this.showDocument.bind(this, item.applicationDocs[j], item)} /> : null}
																				</div>
																			)
																		}
																		else if (!docs.isPending && docs.isApproved === null && docs.suggested_action && this.state.permissions.includes("data.change_review_documents") && !this.state.permissions.includes("data.change_review_applications") || !docs.hasOwnProperty("isPending") && !docs.hasOwnProperty("isApproved")) {
																			return (
																				<div className="verify-doc-type-text verify-review-later-btn-container">
																					<FlatButton flat label="Verify Now" className="view-application-approve-new-btn" onClick={this.showDocument.bind(this, item.applicationDocs[j], item)} />
																				</div>
																			)
																		}
																		else if (!docs.isPending && docs.isApproved === null && this.state.permissions.includes("data.change_review_documents") && this.state.permissions.includes("data.change_review_applications") ||  !docs.hasOwnProperty("isPending") && !docs.hasOwnProperty("isApproved")) {
																			return (
																				<div className="verify-doc-type-text verify-review-later-btn-container">
																					<FlatButton flat label="Verify Now" className="view-application-approve-new-btn" onClick={this.showDocument.bind(this, item.applicationDocs[j], item)} />
																				</div>
																			)
																		}
																		else if (!docs.isPending && docs.isApproved === null && this.state.permissions.includes("data.change_review_documents") && !this.state.permissions.includes("data.change_review_applications") || !docs.hasOwnProperty("isPending") && !docs.hasOwnProperty("isApproved")) {
																			return (
																				<div className="verify-doc-type-text verify-review-later-btn-container">
																					<FlatButton flat label="Verify Now" className="view-application-approve-new-btn" onClick={this.showDocument.bind(this, item.applicationDocs[j], item)} />
																				</div>
																			)
																		}
																	})}</td>
															</tr>
														)
													}
												})
											}
										</tbody>
									</table>
								</div> :
								null :
							<div className="no-record-found-text">
								<h4>No Records Found !!</h4>
							</div>
					}
				</div>
			</div>
		)
	}
}
