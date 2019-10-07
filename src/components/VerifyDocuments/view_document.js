import React from 'react'
import { Button, Dialog } from 'react-md'
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'
import store from '../../utility/store'
import bootupsettings from '../../models/bootupsettings';
import network from '../../utility/network'
import style from '../../utility/style'
import IconButton from '../Buttons/icon_button'
import KycDetails from './kyc_details'

import FlatButton from '../Buttons/flat_button'

var docData = {}, applicationDetails, rejectionMessage = "", currentComponentValue, documentIndex, row = [], allDocumentsLength, documentStatus = []
export default class ViewDocument extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			permissions: storage.getItemValue(keys.USER_PREFERENCE.PERMISSIONS),
			classProperty: 1,
			img_file_name: "",
			img_type: "",
			view: false,
			rejectionErrorMessage: "",
			rotate: 0,
			check: "",
			img_obj: ""
		}
		docData = props.docInfo
		applicationDetails = props.applicationInfo
		currentComponentValue = props.currentComponent
	}
	openDialog = () => {
		this.setState({ view: true });
	};

	closeDialog = () => {
		this.setState({ view: false });
	};
	handleClick(val) {
		val === 1 ? this.setState({ classProperty: 1 }) :
			val === 2 ? this.setState({ classProperty: 2 }) : null
	}
	takeReviewAction(val) {
		network.send(bootupsettings.ENDPOINTS.REVIEW_DOCUMENT_ACTION, { "usDocsId": docData.id }, "REVIEW_DOCUMENT_ACTION", function (response, component) { })
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "REVIEW_DOCUMENT_ACTION") {
				if (response.code === 200) {
					documentStatus[documentIndex] = "review_later";
					storage.setItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS, JSON.stringify({ "status": applicationDetails.status, "id": applicationDetails.id }))
					this.setState({
						check: ""
					})
				}
				else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
					storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
					window.location.href = "/sign-in"
				}
			}
		})
	}

	takeAction(val) {
		let actionModel = { "usDocsId": docData.id, "type": "", "message": "" }
		let apiCall = false
		if (val === "approved") {
			actionModel.type = "_approve"
			apiCall = true
		}
		else if (val === "rejected") {
			let errorMessage
			if (document.getElementById('rejectionMessageField')) {
				errorMessage = document.getElementById('rejectionMessageField').value
			}
			if (errorMessage === "") {
				this.setState({
					rejectionErrorMessage: "This field is required"
				})
			}
			else {
				apiCall = true
				actionModel.type = "_reject"
				actionModel.message = errorMessage
			}
		}

		if (apiCall) {
			this.setState({
				view: false
			})
			network.send(bootupsettings.ENDPOINTS.TAKE_DOCUMENT_ACTION, actionModel, "TAKE_DOCUMENT_ACTION", function (response, component) { })
			store.subscribe(() => {
				var response = store.getState()
				if (response.type === "TAKE_DOCUMENT_ACTION") {
					if (response.code === 200) {
						storage.setItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS, JSON.stringify({ "status": applicationDetails.status, "id": applicationDetails.id }))
						documentStatus[documentIndex] = val;
						this.setState({
							check : ""
						})
						//this.goBack()
					}
					else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
						storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
						window.location.href = "/sign-in"
					}
				}
			})
		}
	}

	takeSuggestedAction(val) {
		let actionModel = { "doc_id": docData.id, "action_type": "", "message": "" }
		let apiCall = false
		if (val === "approve-suggested") {
			actionModel.action_type = 1
			apiCall = true
		}
		else if (val === "reject-suggested") {
			let errorMessage
			if (document.getElementById('rejectionMessageField')) {
				errorMessage = document.getElementById('rejectionMessageField').value
			}
			if (errorMessage === "") {
				this.setState({
					rejectionErrorMessage: "This field is required"
				})
			}
			else {
				apiCall = true
				actionModel.action_type = 0
				actionModel.message = errorMessage
			}
		}

		if (apiCall) {
			this.setState({
				view: false
			})
			network.send(bootupsettings.ENDPOINTS.TAKE_DOCUMENT_SUGGESSTION_ACTION, actionModel, "TAKE_DOCUMENT_SUGGESSTION_ACTION", function (response, component) { })
			store.subscribe(() => {
				var response = store.getState()
				if (response.type === "TAKE_DOCUMENT_SUGGESSTION_ACTION") {
					if (response.code === 200) {
						storage.setItemValue(keys.APP_PREFERENCE.CURRENT_APPLICATION_STATUS, JSON.stringify({ "status": applicationDetails.status, "id": applicationDetails.id }))
						documentStatus[documentIndex] = val;
						this.setState({
							check : ""
						})
						//this.goBack()
					}
					else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
						storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
						window.location.href = "/sign-in"
					}
				}
			})
		}
	}

	goBack() {
		store.dispatch({ type: "CLOSE_VIEW_DOCUMENT", currentComponent: currentComponentValue })
	}

	toggleButtonAction(val){
		if(val === "previous"){
			documentIndex = documentIndex - 1
			docData = applicationDetails.applicationDocs[documentIndex]
		} else {
			documentIndex = documentIndex + 1
			docData = applicationDetails.applicationDocs[documentIndex]
		}

		this.getDocument()
	}

	getDocument(){
		network.send(bootupsettings.ENDPOINTS.GET_SINGLE_DOCUMENT, { "usDocId": docData.id }, "GET_SINGLE_DOCUMENT", function (response, component) { })
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "GET_SINGLE_DOCUMENT") {
				if (response.code === 200) {
					this.setState({ img_file_name: response.data.image.base64, img_obj: response.data, img_type: response.data.image.ext })
					this.toggleButtons()
				}
				else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
					storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
					window.location.href = "/sign-in"
				}
			}
		})
	}

	toggleButtons(){
		documentIndex = applicationDetails.applicationDocs.indexOf(docData)
		allDocumentsLength = applicationDetails.applicationDocs.length - 1
		row = []

		if (documentIndex > 0) {
			row.push(<FlatButton className="page-boxes" label="Previous" onClick={this.toggleButtonAction.bind(this, "previous")} id="previous"></FlatButton>)
		}
		if (documentIndex < allDocumentsLength) {
			row.push(<FlatButton className="page-boxes" label="Next" onClick={this.toggleButtonAction.bind(this, "next")} id="next"></FlatButton>)
		}
	}

	componentWillMount() {
		this.toggleButtons()
		this.getDocument()
		for(let i=0; i<applicationDetails.applicationDocs.length; i++){
			let currentDoc = applicationDetails.applicationDocs[i]
			if(!currentDoc.isPending && currentDoc.isApproved && currentDoc.suggested_action){
				documentStatus[i] = "approved"
			}
			else if(!currentDoc.isPending && currentDoc.isApproved === false && !currentDoc.suggested_action){
				documentStatus[i] = "rejected"
			}
			else if(!currentDoc.isPending && currentDoc.suggested_action && currentDoc.isApproved === null){
				documentStatus[i] = "approve-suggested"
			}
			else if(currentDoc.isPending !== null && currentDoc.suggested_action !== null && currentDoc.isApproved === null){
				documentStatus[i] = "reject-suggested"
			}
			else if(currentDoc.isPending){
				documentStatus[i] = "review_later"
			}
			else {
				documentStatus[i] = "no_action"
			}
		}
	}

	printCommand(val) {
		var mywindow = window.open('', 'PRINT', 'height=1000,width=1000');
		mywindow.document.write(document.getElementById(val).innerHTML);
		mywindow.document.close(); // necessary for IE >= 10
		mywindow.focus(); // necessary for IE >= 10*/
		mywindow.print();
		mywindow.close();
	}

	rotateImage(val) {
		this.setState({
			rotate: val + this.state.rotate
		})
	}

	// {/*<span className="verify-doc-type-text document-span-text-style">Sent for Approval </span> :*/}
	// {/*<span className="verify-doc-type-text document-span-rejected-text-style">Sent for Rejection </span> :*/}

	render() {

		if(document.getElementById('rejectionMessageField')){
			document.getElementById('rejectionMessageField').value = docData.suggested_message
		}
		// <Button flat label="Approve" className="view-doc-approve-btn" onClick={this.takeAction.bind(this, "approved")} />
		// <Button flat label="Review Later" className="view-doc-review-btn" onClick={this.takeReviewAction.bind(this)} />
		// <Button flat label="Reject" className="view-doc-rejected-btn" onClick={this.openDialog} />
		return (
			<div className="right-panel-content-bg">
				<Dialog
					id="help-support-modal"
					visible={this.state.view}
					title="Reason For Rejection"
					onHide={this.closeDialog}
					style={style.container}
					dialogStyle={style.dialogStyle}
					focusOnMount={false}
				>
					<div className="dialog-close-btn">
						<IconButton icon fixedPosition="tr" onClick={this.closeDialog} displayName='close'></IconButton>
					</div>
					<div>
						<div className="rejected-reason-textarea">
						{
							this.state.permissions.includes("data.change_review_documents") && this.state.permissions.includes("data.change_review_applications") && docData !== {} &&
										!docData.suggested_action && docData.suggested_message !== null?
									<textarea
										type="text"
										id="rejectionMessageField"
										placeholder="Write Reason here"
										cols="33"
										rows="3"
										className="non-monetary-address-textarea"
										value={docData.suggested_message}
									> </textarea> :
									<textarea
										type="text"
										id="rejectionMessageField"
										placeholder="Write Reason here"
										cols="33"
										rows="3"
										className="non-monetary-address-textarea"
									/>
						}
						</div>
						<p className="error-message-text">
							{this.state.rejectionErrorMessage}
						</p>
						<div>
						{
							this.state.permissions.includes("data.change_review_documents") && !this.state.permissions.includes("data.change_review_applications") ?
								<Button label="Done" flat className="reject-messgage-done-btn" onClick={this.takeAction.bind(this, "rejected")} /> :
									this.state.permissions.includes("data.change_review_documents") && this.state.permissions.includes("data.change_review_applications") ?
										<Button label="Done" flat className="reject-messgage-done-btn" onClick={this.takeAction.bind(this, "rejected")} /> : null
						}
						</div>
					</div>
				</Dialog>
				<div className="non-monetary-heading-container">
					<div className="arrow-back-non-monetary">
						<Button icon onClick={this.goBack.bind(this)} className="going-back-btn-style">arrow_back</Button>
					</div>
					<div className="non-monetary-heading">Documents</div>
				</div>
				<div className="benefit-description">
					<h3 className="benefit-heading">{docData.fieldDisplayName}</h3>
					<span className="benefit-date-time">For-{applicationDetails.displayName}</span>
				</div>
				{/*<div className="beneficiary-details-print-btn-container">
					<div className="icon-text-container" onClick={this.printCommand.bind(this, "benefit-picture-container")}>
						<i className="material-icons beneficiary-details-print-icon">print</i>
						<span className="beneficiary-details-print-text">Print</span>
					</div>
				</div>*/}
				<div className="document-viewer-container">
					<div className="benefits-providing-pictures-container">
						<div className="benefit-picture-container" id = "benefit-picture-container">
						{
							this.state.img_type === "pdf" ?
								<embed style={{ width: "600px", height: "600px", maxHeight: '600px', transform: `rotate(${this.state.rotate}deg)` }} src={`data:application/pdf;base64,${this.state.img_file_name}`} alt="" type="application/pdf"/> :
								<img style={{ width: "600px", height: "600px", maxHeight: '600px', transform: `rotate(${this.state.rotate}deg)` }} src={`data:image/jpeg;base64,${this.state.img_file_name}`} alt="" />
						}

						</div>
						<div className="rotate-btn-container" style={{paddingTop: "10px"}}>
							{row}
							<Button icon onClick={this.rotateImage.bind(this, 90)}>rotate_right</Button>
						</div>
						{
							this.state.permissions.includes("data.change_review_documents") && this.state.permissions.includes("data.change_review_applications") &&
								( documentStatus[documentIndex] === "approve-suggested" || documentStatus[documentIndex] === "reject-suggested" )?
								<div className="approve-reject-review-btn">
								{
									docData.suggested_action ?
										<div>
											<Button flat label="Reject" className="view-doc-rejected-btn" onClick={this.openDialog} />
											<Button flat label="Review and Approve" className="action-approve-btn" onClick={this.takeAction.bind(this, "approved")} />
										</div> :
										<div>
											<Button flat label="Approve" className="view-doc-approval-btn" onClick={this.takeAction.bind(this, "approved")} />
											<Button flat label="Review and Reject" className="action-rejection-btn" onClick={this.openDialog} />
										</div>


								}
								</div> :

								this.state.permissions.includes("data.change_review_documents") && this.state.permissions.includes("data.change_review_applications") &&
																									documentStatus[documentIndex] === "approved" ?
										<span className="verify-doc-type-text document-span-text-style"> <i className="material-icons approved-icon-style">done</i>Approved </span> :

								this.state.permissions.includes("data.change_review_documents") && this.state.permissions.includes("data.change_review_applications") &&
																									documentStatus[documentIndex] === "rejected" ?
										<span className="verify-doc-type-text document-span-rejected-text-style"> <i className="material-icons approved-icon-style span-rejected-text-style">close</i> &nbsp;Rejected </span> :

								this.state.permissions.includes("data.change_review_documents") && this.state.permissions.includes("data.change_review_applications") &&
																									documentStatus[documentIndex] === "review_later" ?
									<span className="verify-doc-type-text span-rejected-text-style" style={{float:'left'}}> Pending with TWO</span> : null
							}
							{
								this.state.permissions.includes("data.change_review_documents") && !this.state.permissions.includes("data.change_review_applications") &&
																									documentStatus[documentIndex] === "no_action" ?
									<div className="approve-reject-review-btn">
										<Button flat label="Approve" className="view-doc-suggest-approve-btn" onClick={this.takeAction.bind(this, "approved")} />
										<Button flat label="Review Later" className="view-doc-review-btn" onClick={this.takeReviewAction.bind(this)} />
										<Button flat label="Reject" className="view-doc-suggest-rejected-btn" onClick={this.openDialog} />
									</div> :

									this.state.permissions.includes("data.change_review_documents") && !this.state.permissions.includes("data.change_review_applications") &&
																										documentStatus[documentIndex] === "approve-suggested" ?
											<div className="approve-reject-review-btn">
												<Button flat label="Approve" className="view-doc-suggest-approve-btn" onClick={this.takeAction.bind(this, "approved")} />
												<Button flat label="Review Later" className="view-doc-review-btn" onClick={this.takeReviewAction.bind(this)} />
												<Button flat label="Reject" className="view-doc-suggest-rejected-btn" onClick={this.openDialog} />
											</div> :

									this.state.permissions.includes("data.change_review_documents") && !this.state.permissions.includes("data.change_review_applications") &&
																										documentStatus[documentIndex] === "approved" ?
											<span className="verify-doc-type-text document-span-text-style">Approved </span> :

									this.state.permissions.includes("data.change_review_documents") && !this.state.permissions.includes("data.change_review_applications") &&
																										documentStatus[documentIndex] === "reject-suggested" ?
											<div className="approve-reject-review-btn">
												<Button flat label="Approve" className="view-doc-suggest-approve-btn" onClick={this.takeAction.bind(this, "approved")} />
												<Button flat label="Review Later" className="view-doc-review-btn" onClick={this.takeReviewAction.bind(this)} />
												<Button flat label="Reject" className="view-doc-suggest-rejected-btn" onClick={this.openDialog} />
											</div> :

									this.state.permissions.includes("data.change_review_documents") && !this.state.permissions.includes("data.change_review_applications") &&
																										documentStatus[documentIndex] === "rejected" ?
											<span className="verify-doc-type-text document-span-rejected-text-style">Rejected </span> :

									this.state.permissions.includes("data.change_review_documents") && !this.state.permissions.includes("data.change_review_applications") &&
																										documentStatus[documentIndex] === "review_later" ?
										<div>
											<div className="view-document-status-text">
												<p className="document-span-rejected-text-style" style={{float:'none'}}> <i className="material-icons approved-icon-style span-rejected-text-style">history</i> &nbsp;Pending for Review Later </p>
											</div>
											<div className="review-later-action-buttons">
												<Button flat label="Approve" className="view-doc-suggest-approve-btn" onClick={this.takeAction.bind(this, "approved")} />
												<Button flat label="Reject" className="view-doc-suggest-rejected-btn" onClick={this.openDialog} />
											</div>
										</div> : null
								}
					</div>
					<div className="beneficiary-details">
						<div className="beneficiary-details-container">
							<div className="beneficiary-details-heading"> APPLICANT DETAILS </div>
							{
								KycDetails(applicationDetails.kyc, applicationDetails.gender)
							}
						</div>
					</div>
				</div>
			</div>
		)
	}
}
//
