import React from 'react'
import {TextField, Dialog } from 'react-md'
import FlatButton from '../Buttons/flat_button'
import Button from 'react-md/lib/Buttons/Button';
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'
import store from '../../utility/store'
import bootupsettings from '../../models/bootupsettings';
import network from '../../utility/network'
import gallery from '../../img/gallery.svg'

var applicationData, beneficiaryDocs = "Beneficiary's Documents", currentComponentValue
export default class BeneficiaryDetails extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			permissions: storage.getItemValue(keys.USER_PREFERENCE.PERMISSIONS),
			classProperty: 1,
			showDetails: true,
			view: false,
			surveyDetails: [],
			applicationDocs: [],
			img_file_name: {gallery},
			onHoldErrorMessage: "",
			apiImg : false,
			img_type: ""
		}
		applicationData = props.data
		currentComponentValue = props.currentComponent
	}

	openDialog = () => {
		this.setState({ view: true });
	};

	closeDialog = () => {
		this.setState({ view: false });
	};

	componentWillMount() {
		network.send(bootupsettings.ENDPOINTS.GET_SINGLE_APPLICATION, { "applicationId": applicationData.id, "sgmId": applicationData.sgmId }, "GET_SINGLE_APPLICATION", function (response, component) { })
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "GET_SINGLE_APPLICATION") {
				if(response.code === 200){
					this.setState({
						surveyDetails: response.data.surveyDetails,
						applicationDocs: response.data.files
					})
				}
				else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
						storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
						window.location.href = "/sign-in"
				}
			}
		})
	}

	holdApplication() {
		let message = document.getElementById('onHoldMessageField').value

		if (message !== "") {
			network.send(bootupsettings.ENDPOINTS.HOLD_BENEFICIARY, { "applicationId": applicationData.id, "messageData": message }, "HOLD_BENEFICIARY", function (response, component) { })
			store.subscribe(() => {
				var response = store.getState()
				if (response.type === "HOLD_BENEFICIARY") {
					if(response.code === 200){
						storage.setItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS, JSON.stringify({"id": applicationData.id, "status": applicationData.status}))
						this.goBack()
					}
					else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
							storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
							window.location.href = "/sign-in"
					}
				}
			})
		}
		else {
			this.setState({
				onHoldErrorMessage: "This field id required."
			})
		}
	}

	handleApproveAction() {
		let array = []
		array.push(applicationData.id )
		network.send(bootupsettings.ENDPOINTS.ACTIVE_BENEFICIARY, { "applicationId": array }, "ACTIVE_BENEFICIARY", function (response, component) { })
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "ACTIVE_BENEFICIARY") {
				if(response.code === 200){
					storage.setItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS, JSON.stringify({"id":applicationData.id, "status": applicationData.status }))
					this.goBack()
				}
			}
			else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
					storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
					window.location.href = "/sign-in"
			}
		})
	}

	getDocument = (event) => {
		// let docInfo = this.state.applicationDocs.find((item) => (item.fieldDisplayName === event.target.value))
		network.send(bootupsettings.ENDPOINTS.GET_SINGLE_DOCUMENT, { "usDocId": parseInt(event.target.value) }, "GET_SINGLE_DOCUMENT", function (response, component) { })
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "GET_SINGLE_DOCUMENT") {
				if(response.code === 200){
					this.setState({
						img_file_name: response.data.image.base64,
						img_type: response.data.image.ext,
						apiImg : true
					})
				}
				else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
						storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
						window.location.href = "/sign-in"
				}
			}
		})
	}

	goBack() {
		store.dispatch({ type: "CLOSE_BENEFICIARY_DETAILS", currentComponent: { currentComponentValue } })
	}
	handleClick(val) {
		val === 1 ? this.setState({ classProperty: 1 }) :
			val === 2 ? this.setState({ classProperty: 2 }) : null
	}
	render() {
		const { view } = this.state
		let style = {
			dropdown: {
				width: '100%',
				height: '40px',
				borderRadius: '3px',
				outline: 'none',
				padding: '0 10px',
				cursor: 'pointer',
				backgroundColor: '#f7faf8'
			}
		}
		return (
			<div className="beneficiary-details-right-panel-content-bg">
				<Dialog
					id="signin-modal"
					visible={view}
					title="Reason for putting application On Hold"
					onHide={this.closeDialog}
					style={style.container}
					dialogStyle={style.dialogStyle}
					focusOnMount={false}
				>
					<div className="dialog-close-btn">
						<Button icon fixedPosition="tr" onClick={this.closeDialog}>close</Button>
					</div>
					<div style={{width : '100%'}}>
						<div className="rejected-reason-textarea">
							<textarea
								type="text"
								defaultValue=""
								id="onHoldMessageField"
								placeholder="Write Reason here"
								cols="33"
								rows="3"
								className="non-monetary-address-textarea"
							/>
						</div>
						<div className="rejected-reason-error-text">
							{this.state.onHoldErrorMessage}
						</div>
						<div>
							<Button label="Done" flat className="reject-messgage-done-btn" onClick={this.holdApplication.bind(this)} />
						</div>
					</div>
				</Dialog>
				<div className="non-monetary-heading-container">
					<div className="arrow-back-non-monetary">
						<Button icon onClick={this.goBack.bind(this)} className="going-back-btn-style">arrow_back</Button>
					</div>
					<div className="non-monetary-heading">
						Approve Beneficiary
                  </div>
				</div>
				<div className="benefit-description">
					<h3 className="benefit-heading">Beneficiary Details <br/><span className="benefit-application-name">For-{applicationData.displayName}</span></h3>
				</div>
				{/* <div className="beneficiary-details-print-btn-container">
					<div className="icon-text-container">
						<i className="material-icons beneficiary-details-print-icon">print</i>
						<span className="beneficiary-details-print-text">Print</span>
					</div>
				</div> */}
				<div className="outer-container">
					<div className="schemes-questions-container">
						<div className="container-heading">Beneficiary Name - {applicationData.beneficiaryName}</div>
						<div className="schems-questions-container-content">
							{
								this.state.surveyDetails.map((item, i) => {
									if (item.srbm !== "" && item.hasOwnProperty('srbm') && item.displayValue !== "") {
										return (
											<div className="field-container">
												<p style={{ margin: "0px" }}>{item.srbm}</p>
												<div className="beneficiary-details-textfields">
													<TextField
														id="SigninTextfield"
														style={style.textfield1}
														disabled
														defaultValue={item.displayValue}
														lineDirection="center"
														type="text"
													/>
												</div>
											</div>
										)
									}
								})
							}
						</div>
						{
							applicationData.status === "all_documents_accepted" && this.state.permissions.includes("data.change_review_applications") ?
								<div className="schemes-questions-button-container">
									<FlatButton id="approve" flat label="Approve" className="beneficiary-approve-btn" onClick={this.handleApproveAction.bind(this)} />
									<FlatButton id="onhold" flat label="On Hold" className="beneficiary-reject-btn" onClick={this.openDialog} />
								</div> : null
						}
					</div>
					<div className="documents-details">
						<div className="container-heading">
							{beneficiaryDocs}
						</div>
						<div className="documents-viewer-container">
							<div className="document-selectfield-container">
								<select
									id="document"
									placeholder="Select Document"
									style={style.dropdown}
									onChange={this.getDocument.bind(this)}
								>
									<option>Select Any Option</option>
									{
										this.state.applicationDocs.map((item, i) => {
											return (
												<option value={item.id}>{item.fieldDisplayName}</option>
											)
										})
									}
								</select>
							</div>
							<div className="documents-image-viewer">
							{
								this.state.img_type === "pdf" ?
									<embed style={{ width: "100%", height: "100%", transform: `rotate(${this.state.rotate}deg)` }} src={`data:application/pdf;base64,${this.state.img_file_name}`} alt="" type="application/pdf"/> :
									<img style={{ width: "100%", height: "100%",padding:'15px' }} src={this.state.apiImg ? `data:image/jpeg;base64,${this.state.img_file_name}`: gallery} alt="" />
							}

							</div>
						</div>
					</div>
				</div>
			</div >
		)
	}
}
