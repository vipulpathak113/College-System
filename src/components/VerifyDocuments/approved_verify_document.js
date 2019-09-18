import React from 'react'
import store from '../../utility/store'
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'
import easygov from '../../utility/network'
import bootupsettings from '../../models/bootupsettings'
import allApplicationsPagination from '../../utility/all_applications_pagination'
import { CSVLink } from 'react-csv'

var pages = 0, row = [], previousPage = 1, data = [], exportToData = [], totalCount = 0
export default class ApprovedVerifyDocuments extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			dropdownBorder: '1px solid rgba(32, 42, 51, 0.2)',
			applicationsData: []
		}
	}

	componentDidMount() {
		if (storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE)) {
			previousPage = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE))
		}
		easygov.send(bootupsettings.ENDPOINTS.SEARCH_APPLICATIONS, { "searchTerm": "", "searchType": "", "status": "all_documents_accepted", "size": 15, "pageNumber": previousPage }, "ALL_ACCEPTED_DOCUMENTS", function (response, component) { })

		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "ALL_ACCEPTED_DOCUMENTS" || response.type === "all_documents_accepted") {
				if (response.code === 200) {
					this.setState({ applicationsData: response.data.objects })
					exportToData = []
					data = response.data.objects
					pages = response.data.totalPages
					totalCount = response.data.totalCount
					this.setState({applicationsData : response.data.objects})
				}
				else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
					storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
					window.location.href = "/sign-in"
				}
			}
		})
	}

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
						this.state.applicationsData.length > 0 ?
							<div className="content-table-container">
								<CSVLink data={exportToData} >
									<div className="export-icon-text-container">
										<i className="material-icons export-icon">vertical_align_bottom</i>
										<span className="export-text">Export</span>
									</div>
								</CSVLink>
								<div>
									{allApplicationsPagination("all_documents_accepted", pages, "all_documents_accepted", totalCount)}
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
											<th className="table-coloumn-positions">STATUS</th>
											<th className="table-coloumn-positions">APPROVED BY</th>
										</tr>
									</thead>
									<tbody className="content-body-bottom-property">
										{
											this.state.applicationsData.map((item, i) => {
												if (item.status === "all_documents_accepted") {
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
															<td className="table-coloumn-positions">
																{item.applicationDocs.map((docs, j) => {
																	return (
																		<span className="verify-doc-type-text span-text-style" key={j}> <i className="material-icons done-icon-style">done</i>Approved </span>
																	)
																})}</td>
															<td className="table-coloumn-positions">{item.applicationDocs[0].approvedByUsername}<br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{item.applicationDocs[0].approved_by__issuer_details__designation__name}</span></td>
														</tr>
													)
												}
											})
										}
									</tbody>
								</table>
							</div>
							:
							<div className="no-record-found-text">
								<h4>No Records Found !!</h4>
							</div>

					}
				</div>
			</div>
		)
	}
}
