import React from "react";
import FlatButton from '../Buttons/flat_button'
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'
import store from '../../utility/store'
import { CSVLink } from 'react-csv';
import network from '../../utility/network'
import bootupsettings from '../../models/bootupsettings'
import allApplicationsPagination from '../../utility/all_applications_pagination'

var data = [], pages = 0, row = [], previousPage = 1, totalCount = 0
export default class ApprovedTab extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            applicationsData: []
        }
    }

    viewApplication(data) {
        store.dispatch({
            type: "OPEN_BENEFICIARY_DETAILS",
            applicationData: data,
            currentComponent: 2
        })
    }

    componentWillMount() {
        if (storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE)) {
            previousPage = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE))
        }
        let term = "", type = ""
        if(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)){
    			term = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)).value
    			type = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)).type
    		}
        network.send(bootupsettings.ENDPOINTS.SEARCH_APPLICATIONS, { "searchTerm": term, "searchType": type, "status": "active_beneficiary", "size": 15, pageNumber: previousPage }, "active_beneficiary", function (response, component) { })
        store.subscribe(() => {
            var response = store.getState()
            if (response.type === "active_beneficiary") {
                if (response.code === 200) {
                    data = response.data.objects
                    pages = response.data.totalPages
                    totalCount = response.data.totalCount
                    this.setState({ applicationsData: response.data.objects })
                }
                else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
                    storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
                    window.location.href = "/sign-in"
                }
            }
        })
    }

    render() {
        let exportToData = []
        this.state.applicationsData.map((item) => {
            exportToData.push({
      				"Application Id": item.id,
                "Applicant Name": item.beneficiaryName, "Scheme Name": item.displayName, "Tehsil": item.tehsil,
                "Department Name": item.department, "Date": new Date(item.createdOn).toDateString().substring(4, 15),
                "District": item.district, "Status": 'Active Beneficiary'
            })
        })

        return (
            <div>
                {
                    data.length > 0 ?
                        <div className="content-table-container">
                            <CSVLink data={exportToData} >
                                <div className="export-icon-text-container">
                                    <i className="material-icons export-icon">vertical_align_bottom</i>
                                    <span className="export-text">Export</span>
                                </div>
                            </CSVLink>
                            <div>
                                {allApplicationsPagination("active_beneficiary", pages, "active_beneficiary", totalCount)}
                            </div>
                            <table cellSpacing="0" cellPadding="0" className="header-content-table">
                                <thead className="content-body-property">
                                    <tr>
                                        <th className="table-coloumn-positions">APPLICATION ID</th>
                                        <th className="table-coloumn-positions">SCHEME, DEPARTMENT</th>
                                        <th className="table-coloumn-positions">DATE & TIME OF APPLICATION</th>
                                        <th className="table-coloumn-positions">APPLICANT NAME</th>
                                        <th className="table-coloumn-positions">GEOGRAPHY</th>
                                        <th className="table-coloumn-positions">TEHSIL</th>
                                        <th className="table-coloumn-positions">APPLICATION</th>
                                        <th className="table-coloumn-positions">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody className="content-body-bottom-property">
                                    {
                                        this.state.applicationsData.map((item, i) => {
                                            if (item.status === "active_beneficiary") {
                                                return (
                                                    <tr className="content-table-row" key={i}>
                                                        <td className="table-coloumn-positions">{item.id}</td>
                                                        <td className="table-coloumn-positions">{item.displayName}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{item.department}</span></td>
                                                        <td className="table-coloumn-positions">{new Date(item.createdOn).toDateString().substring(4, 15)}, <br /> <span style={{ color: 'rgba(32,43,51,0.6)' }}>{new Date(item.createdOn).toLocaleTimeString()}</span></td>
                                                        <td className="table-coloumn-positions">{item.beneficiaryName}</td>
                                                        <td className="table-coloumn-positions">{item.district}</td>
                                                        <td className="table-coloumn-positions">{item.tehsil}</td>
                                                        <td className="table-coloumn-positions"><FlatButton flat label="View" className="view-application-approve-new-btn" onClick={this.viewApplication.bind(this, item)} /></td>
                                                        <td className="table-coloumn-positions">Active Beneficiary</td>
                                                    </tr>
                                                )
                                            }
                                        })
                                    }
                                </tbody>
                            </table>
                        </div> :
                        <div className="no-record-found-text">
                            <h4>No Records Found !!</h4>
                        </div>
                }
            </div>
        )
    }
}
