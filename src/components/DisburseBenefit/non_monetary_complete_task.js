import React from 'react'
import { Button } from 'react-md'
import gallery from '../../img/gallery.svg'
import FlatButton from '../Buttons/flat_button';
import NonMonetaryHome from './non_monetary_home'
import KycDetails from '../VerifyDocuments/kyc_details';
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'
import store from '../../utility/store'
import bootupsettings from '../../models/bootupsettings';
import easygov from '../../utility/network'



var fileObject, nonMonetaryObj = new FormData()
export default class NonMonetaryCompletedTask extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			classProperty: 1,
			file: [],
			showHome: false,
			applicationData: props.applicationData,
			benefitData : props.benefit,
			benefitId: props.benefitId,
			benefitDetails: {},
			showRealImg: false
		}
	}
	handleClick(val) {
		val === 1 ? this.setState({ classProperty: 1 }) :
			val === 2 ? this.setState({ classProperty: 2 }) : null
	}
	goBack() {
		store.dispatch({ type: "CLOSE_NON_MONETARY_COMPLETE_TASK" })
		// this.setState({
		// 	showHome: true
		// })
	}

	getFile(val) {
		var file = this.refs.file.files[0];
		var reader = new FileReader();
		var url = reader.readAsDataURL(file);
		nonMonetaryObj.append("image", file)
		reader.onloadend = function (e) {
			this.setState({
				imgSrc: [reader.result],
				showRealImg: true
			})
		}.bind(this);

	}

	componentWillMount() {
		this.state.applicationData.benefits.map((item, i) => {
			if (item.benefit_id === this.state.benefitId) {
				this.setState({
					benefitDetails: item
				})
			}
		})
	}

	completeTask() {
		let obj = {}
		nonMonetaryObj.append("benefit_id", this.state.benefitData.id)
		nonMonetaryObj.append("message", document.getElementById('feedbackMessage').value)

		if (document.getElementById('proof-image').value !== "") {
			easygov.send_file(bootupsettings.ENDPOINTS.COMPLETE_NON_MONETARY_BENEFIT, nonMonetaryObj, "COMPLETE_NON_MONETARY_BENEFIT", function (response, component) { })
			store.subscribe(() => {
				var response = store.getState()
				if (response.type === "COMPLETE_NON_MONETARY_BENEFIT") {
					if (response.code === 200) {
						easygov.send(bootupsettings.ENDPOINTS.APPLICATION_COUNT, "", "NEW_APPLICATIONS_COUNT", function (response, component) { })
						this.goBack()
						// store.dispatch({type:"CLOSE_NON_MONETARY_TASK"})
					}
					else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
						storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
						window.location.href = "/sign-in"
					}
				}
			})
		}
		else if (document.getElementById('proof-image').value === "") {
			window.alert("Please upload image of benefit provided.")
		}
	}

	render() {
		return (
			<div>
				{!this.state.showHome ?
					<div className="right-panel-content-bg">
						<div className="non-monetary-heading-container">
							<div className="arrow-back-non-monetary">
								<Button icon onClick={this.goBack.bind(this)} className="going-back-btn-style">arrow_back</Button>
							</div>
							<div className="non-monetary-heading">
								Non-Monetary
              </div>
						</div>
						<div className="benefit-description">
							<h3 className="upload-heading"> Upload proof : <span className="benefit-description-text">{this.state.benefitData.scheme_rule_set_sub_benefit__benefit}</span></h3>
						</div>
						<div className="benefits-distribution-details">
							<div className="benefits-providing-pictures-container">
								<div className="benefit-picture-container">
									<img style={{width:'100%', height:'500px', padding:'30px'}} src={this.state.showRealImg ? this.state.imgSrc : gallery} alt="gallery" />
								</div>
								<div className="upload-image-document-container">
									<span className="upload-image-title">Upload Image/Document</span>
									<form>
										<input
											id="proof-image"
											ref="file"
											type="file"
											name="user[image]"
											accept="image/png,image/jpeg,image/jpg"
											onChange={this.getFile.bind(this)} />
									</form>
								</div>
								<div className="benefit-feedback-textarea">
									<textarea
										type="text"
										defaultValue=""
										id="feedbackMessage"
										cols="33"
										rows="3"
										placeholder="Write feedback here"
									/>
								</div>
								<div className="mark-as-completed-btn">
									<FlatButton flat label="Mark as Completed" onClick={this.completeTask.bind(this)} />
								</div>
							</div>
							<div className="beneficiary-details">
								<div className="beneficiary-details-container">
									<div className="beneficiary-details-heading">BENEFICIARY DETAILS</div>
									{
										KycDetails(this.state.applicationData.kyc, this.state.applicationData.gender)
									}
								</div>
							</div>
						</div>
					</div> : <NonMonetaryHome currentTab={1} />}
			</div>
		)
	}
}
