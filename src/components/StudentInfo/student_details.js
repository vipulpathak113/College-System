import React from 'react'
import { TextField} from 'react-md'
import Button from 'react-md/lib/Buttons/Button';
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'
import store from '../../utility/store'
import bootupsettings from '../../models/bootupsettings';
import easygov from '../../utility/network'
import $ from 'jquery'
import FlatButton from '../Buttons/flat_button'

export default class StudentDetails extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
		}
    }


    goBack() {
		store.dispatch({ type: "CLOSE_VIEW_APPLICATION_DETAILS"})
	}

	edit(){
		$("input").prop('disabled', false);
		$("input").addClass("md-text--enabled");
	}

	save(){
		var data= this.props.data
		this.setState({
			detail:{
					"email": this.state.email?this.state.email:data.email,
					"first_name": this.state.first_name?this.state.first_name:data.first_name,
					"last_name": this.state.last_name?this.state.last_name:data.last_name,
					"phone_number": this.state.phone_number?this.state.phone_number:data.phone_number,
					"profile":{
					"address": this.state.address?this.state.address:data.profile.address,
					"aggregate": this.state.aggregate?this.state.aggregate:data.profile.aggregate,
					"batch_year": this.state.batch_year?this.state.batch_year:data.profile.batch_year,
						"department_details": {"name": this.state.departmentname?this.state.departmentname:data.profile.department_details.name},
					"num_of_backlogs": this.state.num_of_backlogs?this.state.num_of_backlogs:data.profile.num_of_backlogs,
					"roll_number": this.state.roll_number?this.state.roll_number:data.profile.roll_number
}
			}
		})
	}

	onChanging(e){
		console.log(e.target.defaultValue)
		this.setState({
			[e.target.id]:e.target.value?e.target.value:e.target.defaultValue
		})
	}

    render(){
		console.log(this.state.detail)
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
		var data= this.props.data
        return(
            <div className="right-panel-content-bg" >

                <div className="non-monetary-heading-container">
					<div className="arrow-back-non-monetary">
						<Button icon onClick={this.goBack.bind(this)} className="going-back-btn-style">arrow_back</Button>
					</div>
					<div className="non-monetary-heading">
						View Student
              </div>
			  </div>
			  <div className="benefit-description">
					<h3 className="benefit-heading">Student Details <br/></h3>
				</div>
				
				<div className="outer-container">
					<div className="schemes-questions-container">
						<div className="container-heading">Student Name - {data.first_name} {data.last_name}</div>
						<div className="schems-questions-container-content">

							<div>
											<div className="field-containerR">
												<p style={{ margin: "3px" }}>First Name</p>
												<div className="beneficiary-details-textfields">
													<TextField
														id="first_name"
														style={style.textfield1}
														disabled
														defaultValue={data.first_name}
														onChange={this.onChanging.bind(this,event)}
														type="text"
													/>
												</div>
											</div>
											<div className="field-container">
												<p style={{ margin: "3px" }}>Email</p>
												<div className="beneficiary-details-textfields">
													<TextField
														id="email"
														style={style.textfield1}
														disabled
														defaultValue={data.email}
														onChange={this.onChanging.bind(this,event)}
														type="text"
													/>
												</div>
											</div>

											<div className="field-container">
												<p style={{ margin: "3px" }}>Roll Number</p>
												<div className="beneficiary-details-textfields">
													<TextField
														id="roll_number"
														style={style.textfield1}
														disabled
														defaultValue={data.profile.roll_number}
														onChange={this.onChanging.bind(this,event)}
														type="text"
													/>
												</div>
											</div>
											
                                     
											<div className="field-container">
												<p style={{ margin: "3px" }}>Address</p>
												<div className="beneficiary-details-textfields">
													<TextField
														id="address"
														style={style.textfield1}
														disabled
														defaultValue={data.profile.address}
														onChange={this.onChanging.bind(this,event)}
														type="text"
													/>
												</div>
											</div>
											<div className="field-container">
												<p style={{ margin: "3px" }}>Batch Year</p>
												<div className="beneficiary-details-textfields">
													<TextField
														id="batch_year"
														style={style.textfield1}
														disabled
														defaultValue={data.profile.batch_year}
														onChange={this.onChanging.bind(this,event)}
														type="text"
													/>
												</div>
											</div>

											
											</div>

                                                  <div>
											<div className="field-containerL">
												<p style={{ margin: "3px" }}>Last Name</p>
												<div className="beneficiary-details-textfields">
													<TextField
														id="last_name"
														style={style.textfield1}
														disabled
														defaultValue={data.last_name}
														onChange={this.onChanging.bind(this,event)}
														type="text"
													/>
												</div>
											</div>

											<div className="field-containerL">
												<p style={{ margin: "3px" }}>Phone Number</p>
												<div className="beneficiary-details-textfields">
													<TextField
														id="phone_number"
														style={style.textfield1}
														disabled
														defaultValue={data.phone_number?data.phone_number:""}
														onChange={this.onChanging.bind(this,event)}
														type="text"
													/>
												</div>
											</div>

											<div className="field-containerL">
												<p style={{ margin: "3px" }}>Aggregate</p>
												<div className="beneficiary-details-textfields">
													<TextField
														id="aggregate"
														style={style.textfield1}
														disabled
														defaultValue={data.profile.aggregate?data.profile.aggregate:""}
														onChange={this.onChanging.bind(this,event)}
														type="text"
													/>
												</div>
											</div>

											<div className="field-containerL">
												<p style={{ margin: "3px" }}>Department Name</p>
												<div className="beneficiary-details-textfields">
													<TextField
														id="departmentname"
														style={style.textfield1}
														disabled
														defaultValue={data.profile.department_details.name + (data.profile.department_details.short_name ?data.profile.department_details.short_name:"")}
														type="text"
														onChange={this.onChanging.bind(this,event)}
													/>
												</div>
											</div>

											<div className="field-containerL">
												<p style={{ margin: "3px" }}>Number of Backlogs</p>
												<div className="beneficiary-details-textfields">
													<TextField
														id="num_of_backlogs"
														style={style.textfield1}
														disabled
														defaultValue={data.profile.num_of_backlogs}
														type="text"
														onChange={this.onChanging.bind(this,event)}
													/>
												</div>
											</div>
											<FlatButton flat label="Save"  onClick={this.save.bind(this)} className="editButton"/>
											<FlatButton flat label="Edit"  onClick={this.edit.bind(this)} className="editButton"/>	
												
											</div>
						</div>
						
					</div>
					
                    </div>
					
            </div>
        )
    }

}