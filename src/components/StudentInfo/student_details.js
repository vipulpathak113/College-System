import React from 'react'
import { TextField} from 'react-md'
import Button from 'react-md/lib/Buttons/Button';
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'
import store from '../../utility/store'
import bootupsettings from '../../models/bootupsettings';
import network from '../../utility/network'
import $ from 'jquery'
import FlatButton from '../Buttons/flat_button'

var data=[]
export default class StudentDetails extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			studentdata:{},
			saveDisplay:"none",
			editDisplay:"block",
			cancelDisplay:"none",
			deptdata:[]
		}
    }


    goBack() {
		network.send(bootupsettings.ENDPOINTS.STUDENT_INFO,{},"GET_STUDENT_INFO", function (response, component) { })
		store.subscribe(() => {
            var response = store.getState()
			if (response.type === "GET_STUDENT_INFO") {
                data= response.results
               this.setState({
                   studentdata: data
               })
			}
		})
		store.dispatch({ type: "CLOSE_VIEW_APPLICATION_DETAILS",data: data})
	}

	edit(){
		$("input").prop('disabled', false);
		$("input").addClass("md-text--enabled");
		$("#department").prop('disabled', false);
		this.setState({
			editDisplay:"none",
			saveDisplay:"block",
			cancelDisplay:"block"
		})
	}

	save(){
		console.log(this.state.department)
		var data= this.props.data
		var detail={
			"id":data.id,
			"email": this.state.email?this.state.email:data.email,
			"first_name": this.state.first_name?this.state.first_name:data.first_name,
			"last_name": this.state.last_name?this.state.last_name:data.last_name,
			"phone_number": this.state.phone_number?this.state.phone_number:data.phone_number,
			"profile":{
			"address": this.state.address?this.state.address:data.profile.address,
			"aggregate": this.state.aggregate?this.state.aggregate:data.profile.aggregate,
			"batch_year": this.state.batch_year?this.state.batch_year:data.profile.batch_year,
			"department":this.state.department?this.state.department:data.profile.department_details.id,
				"department_details": {"id": this.state.department?this.state.department:data.profile.department_details.id},
			"num_of_backlogs": this.state.num_of_backlogs?this.state.num_of_backlogs:data.profile.num_of_backlogs,
			"roll_number": this.state.roll_number?this.state.roll_number:data.profile.roll_number,
			"cleared_backlogs": this.state.cleared_backlogs?this.state.cleared_backlogs:data.profile.cleared_backlogs,
			"placed_count":this.state.placed_count?this.state.placed_count:data.profile.placed_count,
			"is_placed": this.state.is_placed===undefined?data.profile.is_placed:this.state.is_placed
}

	}
		this.setState({
			detail:detail,
			editDisplay:"block",
			cancelDisplay:"none",
			saveDisplay:"none"
		})
		$("input").prop('disabled', true);
		$("input").removeClass("md-text--enabled");
		$("#department").prop('disabled', true);

		network.sendPatch(bootupsettings.ENDPOINTS.EDIT_STUDENT_INFO,detail,"EDIT_STUDENT_INFO", function (response, component) { })


	}

	cancel(){
		$("input").prop('disabled', true);
		$("input").removeClass("md-text--enabled");
		$("#department").prop('disabled', true);
		this.setState({
			editDisplay:"block",
			cancelDisplay:"none",
			saveDisplay:"none"
		})
	}

	componentDidMount(){
        network.send(bootupsettings.ENDPOINTS.GET_DEPARTMENT,{},"GET_DEPARTMENT", function (response, component) { })
        store.subscribe(() => {
			var response = store.getState()
			console.log(response)
			if (response.type === "GET_DEPARTMENT") {
				data= response.results
               this.setState({
                   deptdata: data
               })
			}
		})
	}
	
	onChanging(e){
		console.log(e.target.value)
		this.setState({
			[e.target.id]:e.target.value
		})
	}

	handleChecked (e) {
		var data= this.props.data
		this.setState({is_placed: !data.profile.is_placed});
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
		var data= this.props.data
		var deptdata= this.state.deptdata;
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
						<div className="schems-questions-container-content">
						
							<div>
							<div className="stu-details">Personal Info</div>
											<div className="field-containerR">
												<p style={{ margin: "3px" }}>First Name</p>
												<div className="beneficiary-details-textfields">
													<TextField
														id="first_name"
														style={style.textfield1}
														disabled
														defaultValue={data.first_name?data.first_name:""}
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
														defaultValue={data.email?data.email:""}
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
														defaultValue={data.profile.address?data.profile.address:""}
														onChange={this.onChanging.bind(this,event)}
														type="text"
													/>
												</div>
											</div>

											<div className="stu-details">Batch Detail</div>

											<div className="field-container">
												<p style={{ margin: "3px" }}>Roll Number</p>
												<div className="beneficiary-details-textfields">
													<TextField
														id="roll_number"
														style={style.textfield1}
														disabled
														defaultValue={data.profile.roll_number?data.profile.roll_number:""}
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
														defaultValue={data.profile.batch_year?data.profile.batch_year:""}
														onChange={this.onChanging.bind(this,event)}
														type="text"
													/>
												</div>
											</div>

											<div className="field-container">
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

											<div className="field-container">
												<p style={{ margin: "3px" }}>Placed Count</p>
												<div className="beneficiary-details-textfields">
													<TextField
														id="placed_count"
														style={style.textfield1}
														disabled
														defaultValue={data.profile.placed_count}
														type="text"
														onChange={this.onChanging.bind(this,event)}
													/>
												</div>
											</div>
											
											</div>

                                                  <div>
											<div className="field-containerL" style={{marginTop: "26px"}}>
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

											<div className="field-containerL" style={{marginTop: "111px"}}>
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
												  <div className="dropdiv">
													  <select
													  defaultValue= {deptdata.find(op => {
														return op.name === data.profile.department_details.name
													 })}
													onChange={this.onChanging.bind(this)}
													  className="selectstyle"
													  id="department"
													  style={{width: "166px",
														height: "31px" }}
														disabled
													  >
													{deptdata && deptdata.map((item,key)=>{
														return (
															<option value={item.id} key={key}>{item.name}</option>
														)
													})}	   
													  </select>
												  </div>
											  </div>
											 
											
										  

											<div className="field-containerL">
												<p style={{ margin: "3px" }}>Cleared Backlogs</p>
												<div className="beneficiary-details-textfields">
													<TextField
														id="cleared_backlogs"
														style={style.textfield1}
														disabled
														defaultValue={data.profile.cleared_backlogs}
														type="text"
														onChange={this.onChanging.bind(this,event)}
													/>
												</div>
											</div>

											<div style={{marginLeft: "92px",
											marginTop: "30px"}}>Is Placed: <input type="checkbox"
										    onChange={ this.handleChecked.bind(this) } disabled defaultChecked={data.profile.is_placed && data.profile.placed_count>=1}/></div>

											
											</div>
											<div>
											<FlatButton flat label="Save"  onClick={this.save.bind(this)} style={{display:this.state.saveDisplay}} className="saveButton"/>
											<FlatButton flat label="Cancel"  onClick={this.cancel.bind(this)} style={{display:this.state.cancelDisplay}} className="cancelButton"/>
											<FlatButton flat label="Edit"  onClick={this.edit.bind(this)} style={{display:this.state.editDisplay}} className="editButton"/>	
											
											</div>
										
						</div>
						
					</div>
					
					
                    </div>
						
					
            </div>
        )
    }

}