import React from 'react'
import { TextField, Dialog } from 'react-md'
import Button from 'react-md/lib/Buttons/Button';
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'
import store from '../../utility/store'
import bootupsettings from '../../models/bootupsettings';
import network from '../../utility/network'
import gallery from '../../img/gallery.svg'
import IconButton from '../Buttons/icon_button'

var applicationData, beneficiaryDocs = "Beneficiary's Documents", currentComponentValue, documentSelected= false, docInfo, permissions = ''
export default class BeneficiaryDetails extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			classProperty: 1,
			showDetails: true,
			view: false,
			surveyDetails: [],
			applicationDocs: [],
			img_obj: "",
			onHoldErrorMessage: "",
			imgDummy: false,
			viewPrintDialog : false,
			pdfData : "",
			img_type: ""
		}
		applicationData = props.data
		permissions = storage.getItemValue(keys.USER_PREFERENCE.PERMISSIONS)
		currentComponentValue = props.currentComponent
	}

	openDialog = () => {
		this.setState({ view: true });
	};

	closeDialog = () => {
		this.setState({ view: false });
	};

	closePrintDialog = () => {
		this.setState({ viewPrintDialog: false });
	};

	componentWillMount() {
		network.send(bootupsettings.ENDPOINTS.GET_SINGLE_APPLICATION, { "applicationId": applicationData.id, "sgmId": applicationData.sgmId }, "GET_SINGLE_APPLICATION", function (response, component) { })
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "GET_SINGLE_APPLICATION") {
				if (response.code === 200) {
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

	changeApplicationStatus(id) {
		network.send(bootupsettings.ENDPOINTS.CHANGE_APPLICATION_STATUS, { "applicationId": applicationData.id }, "CHANGE_APPLICATION_STATUS", function (response, component) { })
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "CHANGE_APPLICATION_STATUS") {
				if (response.code === 200) {
					this.goBack()
				}
				else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
					storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
					window.location.href = "/sign-in"
				}
			}
		})

	}

	printCommand(){
		network.send(bootupsettings.ENDPOINTS.PRINT_APPLICATION, { "applicationId": parseInt(applicationData.id), "sgmId": parseInt(applicationData.sgmId) }, "PRINT_APPLICATION", function (response, component) { })
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "PRINT_APPLICATION") {
				if (response.code === 200) {
					this.setState({
						viewPrintDialog : true,
						pdfData : response.data
					})
					// var mywindow = window.open('', 'PRINT', 'height=1000,width=1000');
					// mywindow.document.write(document.getElementById("print-dialog").innerHTML);
					// mywindow.document.close(); // necessary for IE >= 10
					// mywindow.focus(); // necessary for IE >= 10*/
					// mywindow.print();
					// mywindow.close();
					// document.printApplicationForm.action = `data:application/pdf;base64,${response.data}`
					// document.getElementById('printApplicationForm').submit();
					// return(
					// 	<a href={`data:application/pdf;base64,${response.data}`}>test</a>
					// )
					// console.log("response", response);
				}
				else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
					storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
					window.location.href = "/sign-in"
				}
			}
		})
	}

	getDocument = (event) => {
		docInfo = this.state.applicationDocs.find((item) => (item.fieldDisplayName.trim() === event.target.value))
		documentSelected = true
		network.send(bootupsettings.ENDPOINTS.GET_SINGLE_DOCUMENT, { "usDocId": parseInt(docInfo.id) }, "GET_SINGLE_DOCUMENT", function (response, component) { })
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "GET_SINGLE_DOCUMENT") {
				if (response.code === 200) {
					this.setState({
						img_obj: response.data,
						img_type: response.data.image.ext,
						imgDummy: true
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
		store.dispatch({ type: "CLOSE_VIEW_APPLICATION_DETAILS", currentComponent: currentComponentValue })
	}

	handleClick(val) {
		val === 1 ? this.setState({ classProperty: 1 }) :
			val === 2 ? this.setState({ classProperty: 2 }) : null
	}

	render() {
		let style = {
			dropdown: {
				width: '100%',
				height: '40px',
				borderRadius: '3px',
				outline: 'none',
				padding: '0 10px',
				cursor: 'pointer',
				backgroundColor: '#f7faf8'
			},
			container: {
	        backgroundColor: 'rgba(0,0,0,0.6)',
	    },
	    dialogStyle: {
	        width: '30%',
	        overflow: 'auto',
	        minHeight: '200px',
	        borderRadius: '5px',
	    },
	    printDialogStyle: {
	        width: '49%',
	        overflow: 'auto',
	        minHeight: '300px',
	        borderRadius: '5px',
	    },
		}

		let allowedStatus = ['all_documents_accepted', 'on_hold' , 'active_beneficiary', 'all_benefits_granted']
		return (
			<div className="beneficiary-details-right-panel-content-bg">
			<form name="paymentForm" id="printApplicationForm" method="post" action="">
			</form>
			<Dialog
				id="help-support-modal"
				visible={this.state.view}
				title="Confirm"
				onHide={this.closeDialog}
				style={style.container}
				dialogStyle={style.dialogStyle}
				focusOnMount={false}
				className="change-status-application"
			>
				<div className="dialog-close-btn">
					<IconButton icon fixedPosition="tr" onClick={this.closeDialog} displayName='close'></IconButton>
				</div>
				<div>
					<div>
						Are you sure you want to Reject this Application.
					</div>
					<div className="change-status-button-container">
						<div style={{float:"right"}}>
							<Button label="Confirm" flat className="change-status-confirm-btn" onClick={this.changeApplicationStatus.bind(this, applicationData.id)}/>
						</div>
						<div style={{float:"left"}}>
							<Button label="Cancel" flat className="change-status-cancel-btn" onClick={this.closeDialog}/>
						</div>
					</div>
				</div>
			</Dialog>
			<Dialog
				id="help-support-modal"
				visible={this.state.viewPrintDialog}
				onHide={this.closePrintDialog}
				style={style.container}
				dialogStyle={style.printDialogStyle}
				focusOnMount={false}
				className="change-status-application"
			>
				<embed style={{ width: "600px", height: "600px", maxHeight: '600px'}} src={`data:application/pdf;base64,${this.state.pdfData}`} alt="" type="application/pdf"/>
			</Dialog>

			<div id="print-dialog" style={{ width: "700px", height: "700px", maxHeight: '700px', display : "none"}}>
				<embed style={{ width: "600px", height: "600px", maxHeight: '600px'}} src={`data:application/pdf;base64,${this.state.pdfData}`} alt="" type="application/pdf"/>
			</div>

				<div className="non-monetary-heading-container">
					<div className="arrow-back-non-monetary">
						<Button icon onClick={this.goBack.bind(this)} className="going-back-btn-style">arrow_back</Button>
					</div>
					<div className="non-monetary-heading">
						View Application
              </div>
				</div>
				<div className="benefit-description">
					<h3 className="benefit-heading">Beneficiary Details <br/><span className="benefit-application-name">For-{applicationData.displayName}</span></h3>
				</div>
				<div className="beneficiary-details-print-btn-container" onClick={this.printCommand.bind(this)}>
					<div className="icon-text-container">
						<i className="material-icons beneficiary-details-print-icon">print</i>
						<span className="beneficiary-details-print-text">Print</span>
					</div>
				</div>
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
							(applicationData.status === "active_beneficiary" || applicationData.status === "all_documents_accepted") &&
							 	permissions.includes('add_review_applications') && permissions.includes('data.dashboard_group') &&
									!permissions.includes('data.delete_verified_applications') && !permissions.includes('data.change_verified_applications')?
								<div className="delete-application-container" onClick={this.openDialog}>
								Reject this Application
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
									onChange={this.getDocument}
								>
									<option>Select Any Option</option>
									{
										this.state.applicationDocs.map((item, i) => {
											return (
												<option>{item.fieldDisplayName}</option>
											)
										})
									}
								</select>
							</div>
							<div className="documents-image-viewer">
							{
								this.state.img_type === "pdf" ?
									<embed style={{ width: "100%", height: "100%", transform: `rotate(${this.state.rotate}deg)` }} src={`data:application/pdf;base64,${this.state.img_obj.image.base64}`} alt="" type="application/pdf"/> :
									<img style={{ width: "100%", height: "100%" }} src={this.state.imgDummy ? `data:image/jpeg;base64,${this.state.img_obj.image.base64}` : gallery} alt="" />
							}

							</div>
							<div>
								{
									documentSelected ?
										<div>
											{
												allowedStatus.includes(applicationData.status) || this.state.img_obj.isApproved?
													<div>
														<span className="view-doc-type-text document-span-text-style"> <i className="material-icons approved-icon-style">done</i>Approved </span>
													</div> : applicationData.status === "documents_rejected" || this.state.img_obj.isApproved === false ?
													<div>
														<span className="view-doc-type-text document-span-rejected-text-style"> <i className="material-icons approved-icon-style span-rejected-text-style">close</i> &nbsp;Rejected </span>
													</div> : this.state.img_obj.isApproved === null ?
													<div>
														<span className="view-doc-type-text document-span-rejected-text-style"> Verification Pending </span>
													</div> :null
											}
										</div> : null
								}
							</div>
						</div>
						<div>
							{
								this.state.img_obj.isApproved === false && documentSelected?
									<div>
										<div className="document-rejection-text">
											Reason for Rejection:
										</div>
										<div className="document-rejection-reason">
											{this.state.img_obj.documentStatusMappingMessage}
										</div>
									</div> : null
							}
						</div>
					</div>

				</div>
				<div>
					{
						this.state.imgDummy && !this.state.img_type === "pdf"?
							<a download={`${docInfo.fieldDisplayName}_${applicationData.id}.jpg`} href={`data:image/jpeg;base64,${this.state.img_obj.image.base64}`}>
								<div className="download-image-container">
									Download Document
								</div>
							</a> : null
					}
				</div>
			</div>
		)
	}
}
