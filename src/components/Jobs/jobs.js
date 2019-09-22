import React from 'react'
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'
import store from '../../utility/store'
import easygov from '../../utility/network'
import bootupsettings from '../../models/bootupsettings'
import FlatButton from '../Buttons/flat_button'
import { Button } from 'react-md'
import Filter from '../Filter/filter'

var data=[];
export default class Jobs extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
            jobsdata:[],
            openViewApplications :false
		}
    }

    componentDidMount(){
        easygov.send(bootupsettings.ENDPOINTS.ALL_JOBS,{},"ALL_JOBS", function (response, component) { })
        store.subscribe(() => {
            var response = store.getState()
			if (response.type === "GET_STUDENT_INFO") {
                console.log(response)
                data= response.results
               this.setState({
                jobsdata: data
               })
			}
		})
    }

    render(){
        return(
            <div className="right-panel-content-bg" >
                
                JOBS</div>
        )
    }

}