import React from 'react'
import { TextField} from 'react-md'
import Button from 'react-md/lib/Buttons/Button';
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'
import store from '../../utility/store'
import bootupsettings from '../../models/bootupsettings';
import easygov from '../../utility/network'

export default class StudentDetails extends React.Component {

    goBack() {
		store.dispatch({ type: "ET_STUDENT_INFO"})
	}


    render(){
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
	    }}
        console.group(this.props)
        var data= this.props.data
        return(
            <div className="right-panel-content-bg" >
                <h3 className="approve-beneficiary-text">Student Details</h3>

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
					</div>
                    </div>
            </div>
        )
    }

}