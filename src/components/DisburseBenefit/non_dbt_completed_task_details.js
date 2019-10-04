import React from 'react'
import { Button } from 'react-md'
import KycDetails from '../VerifyDocuments/kyc_details';
import store from '../../utility/store'
import bootupsettings from '../../models/bootupsettings';
import network from '../../utility/network'
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'

var fileObject, nonMonetaryObj = new FormData()
export default class NonDBTCompletedTask extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			classProperty: 1,
			showHome: false,
			applicationData: props.data,
			benefitData: props.benefit,
			img_file_name: "",
			feedbackMessageValue: ""
		}
	}
	handleClick(val) {
		val === 1 ? this.setState({ classProperty: 1 }) :
			val === 2 ? this.setState({ classProperty: 2 }) : null
	}
	goBack() {
		store.dispatch({ type: "CLOSE_NON_DBT_COMPLETED_TASK" })
	}

	getFile(val) {
		fileObject = val
		nonMonetaryObj.append("image", val)
	}

	componentWillMount() {
		network.send(bootupsettings.ENDPOINTS.VIEW_BENEFIT_DATA, { "benefit_id": this.state.benefitData.id }, "VIEW_BENEFIT_DATA", function (response, component) { })
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "VIEW_BENEFIT_DATA") {
				if (response.code === 200) {
					this.setState({
						img_file_name: response.data.image,
						feedbackMessageValue: response.data.message
					})
				}
				else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
					storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
					window.location.href = "/sign-in"
				}
			}
		})
	}

	render() {
		return (
			<div>
				<div className="right-panel-content-bg">
					<div className="non-monetary-heading-container">
						<div className="arrow-back-non-monetary">
							<Button icon onClick={this.goBack.bind(this)} className="going-back-btn-style">arrow_back</Button>
						</div>
						<div className="non-monetary-heading">
							Non-DBT Completed Task
      			</div>
					</div>
					<div className="benefit-description">
						<h3 className="upload-heading">Completed Benefit Details of <span className="benefit-description-text">{this.state.benefitData.scheme_rule_set_sub_benefit__benefit} of ₹ {this.state.benefitData.scheme_rule_set_sub_benefit__value}</span></h3>
						{/* <h3 className="upload-heading"> Upload proof
						 </h3>
						<span className="benefit-date-time">{this.state.applicationData.benefits.benefit_name}</span>*/}
					</div>
					<div className="benefits-distribution-details">
						<div className="benefits-providing-pictures-container">
							<div className="benefit-picture-container">
								<div className="beneficiary-pictures-card">
									<div className="beneficiary-pictures">
										<img style={{ width: "100%", height: "100%" }} src={`data:image/jpeg;base64,${this.state.img_file_name}`} alt="" />
									</div>
								</div>
							</div>
							<div className="benefit-feedback-textarea">
								<textarea
									type="text"
									disabled
									value={this.state.feedbackMessageValue}
									id="feedbackMessage"
									cols="33"
									rows="3"
								/>
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
				</div>
			</div>
		)
	}
}
