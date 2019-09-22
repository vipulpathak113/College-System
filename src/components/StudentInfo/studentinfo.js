import React from 'react'
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'
import store from '../../utility/store'
import easygov from '../../utility/network'
import bootupsettings from '../../models/bootupsettings'
import FlatButton from '../Buttons/flat_button'
import { Button } from 'react-md'
import StudentDetails from './student_details'
import Filter from '../Filter/filter'


var data=[],applicationData;

var openViewApplication = (data) => {
	store.dispatch({ type: "SHOW_VIEW_APPLICATION_DETAILS",  data: data })
}
export default class StudentInfo extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
            studentdata:[],
            openViewApplications :false
		}
    }
    

    componentDidMount(){
        console.log("hello")
        easygov.send(bootupsettings.ENDPOINTS.STUDENT_INFO,{},"GET_STUDENT_INFO", function (response, component) { })
        store.subscribe(() => {
            var response = store.getState()
			if (response.type === "GET_STUDENT_INFO") {
                data= response.results
               this.setState({
                   studentdata: data
               })
			}
		})
    }
    
    componentWillMount() {
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "SHOW_VIEW_APPLICATION_DETAILS") {
                applicationData = response.data
                this.setState({
                    openViewApplications: true
                })
            }
            else if (response.type === "CLOSE_VIEW_APPLICATION_DETAILS") {
				this.setState({
                    openViewApplications: false
                })

               if(response.type === "EDIT_STUDENT_INFO"){
                    data= response
                    console.log(data)
                   this.setState({
                    applicationData: response.data
                   })
                }
			}

		})
	}

    componentDidUpdate(prevProps, prevState) {
        store.subscribe(() => {
            var response = store.getState()
            if (response.type === "STUDENT_FILTER") {
                console.log(response)
                data= response.results
                this.setState({
                    studentdata: data
                })
            }
         
        
        
        })
      }



    render(){
        console.log(this.state.studentdata)
       var data= this.state.studentdata
        return (
            
            <div>
                {!this.state.openViewApplications ?
			<div className="right-panel-content-bg" >
                <h3 className="approve-beneficiary-text">Students</h3>
                <Filter/>
				<div >
               
								<div className="content-table-container">
                                { data.length > 0 ?
									<table cellSpacing="0" cellPadding="0" className="header-content-table">
										<thead className="content-body-property">
											<tr height="48">
												<th className="table-coloumn-positions">NAME</th>
                                                <th className="table-coloumn-positions">ROLL NO</th>
												<th className="table-coloumn-positions">EMAIL</th>
												<th className="table-coloumn-positions">PHONE NUMBER</th>
												<th className="table-coloumn-positions">DEPARTMENT</th>
                                                <th className="table-coloumn-positions">BATCH YEAR</th>
												
											</tr>
										</thead>

                                        
										<tbody className="content-body-bottom-property">
                                     {data.map((item, i) => {
                                     return(
                                        <tr className="content-table-row hover-clickable-table" key={i} onClick={openViewApplication.bind(this, item)}>
                                     <td className="table-coloumn-positions">{item.first_name} {item.last_name}</td>
                                     <td className="table-coloumn-positions">{item.profile.roll_number}</td>
                                     <td className="table-coloumn-positions">{item.email}</td>
                                     <td className="table-coloumn-positions">{item.phone_number}</td>
                                     <td className="table-coloumn-positions">{item.profile.department_details.name}</td>
                                     <td className="table-coloumn-positions">{item.profile.batch_year}</td>
                                     
                                      </tr>)})}
										</tbody>
                                        
									</table>
                                    :
                                    <div className="no-record-found-text">
                                        <h4>No Records Found !!</h4>
                                    </div>}  
                                </div> 
                              
				</div>
			</div>
            : <StudentDetails data={applicationData} studentdata={this.state.studentdata} />
        }
            </div>
		)

    }


}