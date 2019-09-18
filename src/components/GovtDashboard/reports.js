import React from 'react'
import Chart from './chart';
import Navbar from './navbar_harlabh'
import bootupsettings from '../../models/bootupsettings'
import reports from '../../models/harlabh-reports'
import easygov from '../../utility/network'
import store from '../../utility/store'
import storage from '../../utility/encrypt_data'
import { LinearProgress, Button, SelectField } from 'react-md/lib'
import { CSVLink } from 'react-csv'

var response, date, today, total_transactions, departmentList = [], beneficiaries, districtId = "", districtName = "All Districts"
var boarded = 0, feedback = 0, fullyAutomated = 0, interoperableApis = 0, manuallyRunning = 0, amount_transferred, districtList = []
var total_service, districtWiseData, filterService = [], departmentWiseData, departmentId = "", departmentName = "All Departments"
var serviceId = "", serviceWiseData = [], api_endpoints, exportData = [], schemeName = "All Schemes"
export default class Reports extends React.Component {
    constructor() {
        super()
        this.state = {
            check: "",
            config: ""
        }
    }

    componentWillMount() {
        easygov.send(bootupsettings.ENDPOINTS.HARLABH_DASHBOARD, reports, "HARLABH_DASHBOARD", function (response, component) {})
        store.subscribe(() => {
            response = store.getState()
            if (response.type === "HARLABH_DASHBOARD" && response) {
              var code = response.code
              if (code === 200) {
                exportData = []
                response.data.objects.map((item) => {
                  exportData.push({
                    "Applied On" : item.date,
                    "District" : districtName,
                    "Department": departmentName,
                    "Scheme Name" : schemeName,
                    "Total Applications": item.userAppliedCount,
                    "Under Processing" : item.userProcessedCount,
                    "Approved" : item.userApprovedCount,
                    "Rejected" : item.userRejectedCount,
                  })
                  // date.push(item.date)
                })
                // response = JSON.parse(JSON.stringify(response.data.objects))
                date = Object.values(response.data.objects).map((item) => {
                    return item.date;
                })
                this.setState({
                  check : ""
                })
              }
              else if (code === 401) {
                  localStorage.setItem("next-url", "36")
                  window.location.href = "sign-in"
              }
            }

        })

        easygov.send(bootupsettings.ENDPOINTS.HARLABH_FILTER_SERVICES, { size: 1000 }, "HARLABH_FILTER_SERVICES", function (response, component) {})
        store.subscribe(() => {
            response = store.getState()
            if (response.type === "HARLABH_FILTER_SERVICES" && response) {
                var code = response.code
                if (code === 200) {
                    response = response.data.objects
                    serviceWiseData = response
                    filterService = response.map((item) => {
                        return item.serviceName;
                    })
                    filterService = filterService.sort()
                    filterService.splice(0, 0, "All Schemes")
                    filterService.join()
                    this.setState({
                        check: "true"
                    })
                }
                else if (code === 401) {
                    localStorage.setItem("next-url", "36")
                    window.location.href = "sign-in"
                }
            }
        })

        easygov.send(bootupsettings.ENDPOINTS.HARLABH_DISTRICT_WISE_DATA_COUNT, {}, "HARLABH_DISTRICT_WISE_DATA_COUNT", function (response, component) {})
        store.subscribe(() => {
            response = store.getState()
            if (response.type === "HARLABH_DISTRICT_WISE_DATA_COUNT" && response) {
                var code = response.code
                if (code === 200) {
                    // response = JSON.parse(JSON.stringify(response.data.districtwise=))
                    districtWiseData = JSON.parse(JSON.stringify(response.data.districtwiseData))
                    districtList = Object.values(districtWiseData).map((item) => {
                        return item.geography;
                    })
                    districtList = districtList.sort()
                    districtList.splice(0, 0, "All Districts")
                    districtList.join()
                    response = JSON.parse(JSON.stringify(response.data))
                    total_transactions = response.totalNoOfTransactions
                    total_service = response.totalServiceCount
                    amount_transferred = response.totalAmountOfTransactions
                    beneficiaries = response.totalNoOfBeneficaries
                    this.setState({
                        check: "true"
                    })

                }
                else if (code === 401) {
                    localStorage.setItem("next-url", "36")
                    window.location.href = "sign-in"
                }
            }
        })

        easygov.send(bootupsettings.ENDPOINTS.HARLABH_COMPARE_ONBOARDING_STATUS, { size: 1000 }, "HARLABH_COMPARE_ONBOARDING_STATUS", function (response, component) {})
        store.subscribe(() => {
            var localboarded = 0, localfeedback = 0, localfullyAutomated = 0, localinteroperableApis = 0, localmanuallyRunning = 0
            response = store.getState()
            if (response.type === "HARLABH_COMPARE_ONBOARDING_STATUS" && response) {
                var code = response.code
                if (code === 200) {
                    departmentWiseData = response.data;
                    departmentList = response.data.map((item) => {
                        return item.name;
                    });
                    departmentList = departmentList.sort()
                    departmentList.splice(0, 0, "All Departments")
                    departmentList.join()
                    for (let k = 0; k < response.data.length; k++) {
                        let dept = response.data[k]
                        if (dept.boarded === true) {
                            localboarded += 1
                        }
                        if (dept.interoperableApis === true) {
                            localinteroperableApis += 1
                        }
                        if (dept.takingCitizenFeedback === true) {
                            localfeedback += 1
                        }
                        if (dept.manuallyRunning === true) {
                            localmanuallyRunning += 1
                        }
                        if (dept.fullyAutomated === true) {
                            localfullyAutomated += 1
                        }
                    }
                    boarded = Math.ceil((localboarded / response.data.length) * 100)
                    interoperableApis = Math.ceil(((localinteroperableApis / response.data.length) * 100), 1)
                    feedback = Math.ceil(((localfeedback / response.data.length) * 100), 1)
                    manuallyRunning = Math.ceil(((localmanuallyRunning / response.data.length) * 100), 1)
                    fullyAutomated = Math.ceil(((localfullyAutomated / response.data.length) * 100), 1)
                    this.setState({
                        check: true
                    })
                }
                else if (code === 401) {
                    localStorage.setItem("next-url", "36")
                    window.location.href = "sign-in"
                }
            }

        })
    }
    // componentDidMount() {
    //     window.scroll({
    //         top: 0,
    //         left: 0,
    //         behavior: 'smooth'
    //     })
    // }

    fetchDist(val) {
      districtName = val
        if (val === "All Districts") {
            districtId = "";
            easygov.send(bootupsettings.ENDPOINTS.HARLABH_DASHBOARD, { districtId: districtId, departmentId: departmentId, serviceId: serviceId, from_date: "06-12-2017", size : 100000}, "HARLABH_DASHBOARD", function (response, component) {
            })
            easygov.send(bootupsettings.ENDPOINTS.HARLABH_FILTER_SERVICES, { districtId: districtId, size: 1000 }, "HARLABH_FILTER_SERVICES", function (response, component) {
            })
        }
        else {
            var districtsData = districtWiseData.find((item) => (item.geography == val))
            districtId = districtsData.districtId
            // store.dispatch({data :{districtId : districtId} })
            easygov.send(bootupsettings.ENDPOINTS.HARLABH_DASHBOARD, { districtId: districtId, departmentId: departmentId, serviceId: serviceId, from_date: "06-12-2017", size : 100000 }, "HARLABH_DASHBOARD", function (response, component) {
            })
            easygov.send(bootupsettings.ENDPOINTS.HARLABH_FILTER_SERVICES, { districtId: districtId, size: 1000 }, "HARLABH_FILTER_SERVICES", function (response, component) {
            })

        }
        store.dispatch({ type: "reportsResponse", data: { districtId: districtId } })
    }
    fetchDept(val) {
      departmentName = val
        if (val === "All Departments") {
            departmentId = ""
            easygov.send(bootupsettings.ENDPOINTS.HARLABH_DASHBOARD, { serviceId: serviceId, districtId: districtId, departmentId: departmentId, from_date: "06-12-2017", size : 100000}, "HARLABH_DASHBOARD", function (response, component) {
            })
            easygov.send(bootupsettings.ENDPOINTS.HARLABH_FILTER_SERVICES, { departmentId: departmentId, districtId: districtId, serviceId: serviceId, size: 1000 }, "HARLABH_FILTER_SERVICES", function (response, component) {
            })
        }

        else {
            var departmentData = departmentWiseData.find((item) => (item.name == val))
            departmentId = departmentData.id
            // store.dispatch({data :{districtId : districtId, departmentId : departmentId} })
            easygov.send(bootupsettings.ENDPOINTS.HARLABH_FILTER_SERVICES, { departmentId: departmentId, districtId: districtId, size: 1000 }, "HARLABH_FILTER_SERVICES", function (response, component) {
            })
            easygov.send(bootupsettings.ENDPOINTS.HARLABH_DASHBOARD, { departmentId: departmentId, serviceId: serviceId, districtId: districtId, from_date: "06-12-2017", size : 100000 }, "HARLABH_DASHBOARD", function (response, component) {
            })
        }
        store.dispatch({ type: "reportsResponse", data: { districtId: districtId, departmentId: departmentId } })
    }
    fetchService(val) {
      schemeName = val
        if (val === "All Schemes") {
            serviceId = ""
            easygov.send(bootupsettings.ENDPOINTS.HARLABH_DASHBOARD, { serviceId: serviceId, districtId: districtId, departmentId: departmentId, from_date: "06-12-2017", size : 100000 }, "HARLABH_DASHBOARD", function (response, component) {
            })
        }

        else {
            var serviceData = serviceWiseData.find((item) => (item.serviceName == val))
            serviceId = serviceData.serviceId
            // store.dispatch({data :{districtId : districtId, departmentId : departmentId, serviceId : serviceId} })
            easygov.send(bootupsettings.ENDPOINTS.HARLABH_DASHBOARD, { departmentId: departmentId, serviceId: serviceId, districtId: districtId, from_date: "06-12-2017", size : 100000 }, "HARLABH_DASHBOARD", function (response, component) {
            })
        }
        store.dispatch({ type: "reportsResponse", data: { districtId: districtId, departmentId: departmentId, serviceId: serviceId } })
    }
    formatChange(date) {
        var dd = date.getDate();
        var mm = date.getMonth() + 1;
        var yyyy = date.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }
        var today = dd + '-' + mm + '-' + yyyy;
        return today;
    }

    dateSender(id) {
        var formData
        var last_date = "06-12-2017"
        formData = {
            from_date: "06-12-2017",
            to_date: today,
            size: 10000
        }
        var last_date_value = new Date(last_date)
        var date = today = new Date();
        today = this.formatChange(today)
        if (id === 100) {
            formData['districtId'] = districtId
            formData['departmentId'] = departmentId
            formData['serviceId'] = serviceId
        }
        else {
            date.setDate(date.getDate() - id)
            var previousDate = this.formatChange(date)
            if (last_date_value > date) {
                previousDate = formData.from_date
            }
            formData = {
                from_date: previousDate,
                to_date: today,
                districtId: districtId,
                departmentId: departmentId,
                serviceId: serviceId
            }
        }
        easygov.send(bootupsettings.ENDPOINTS.HARLABH_DASHBOARD, formData, "HARLABH_DASHBOARD", function (response, component) {
        })
    }

    render() {

        const style = {
            dropdown: {
                width: "100%",
                borderBottom: "1px solid #d8d8d8",
                minHeight: "7em",
                paddingBottom: "20px",
                height: 'auto'
            }
        }

        const summary = [
            {
                label: "Total Transactions",
                value: total_transactions,
                color: "#ee8033",
                weight: "700"
            },
            {
                label: "Amount Transferred",
                value: amount_transferred,
                color: "#37be90",
                weight: "700"
            },
            {
                label: "Beneficiaries",
                value: beneficiaries,
                color: "#8c6239",
                weight: "700"
            },
            {
                label: "Schemes/Services",
                value: total_service,
                color: "#29abe2",
                weight: "700"
            }
        ]
        return (
            <div>
                <Navbar />
                <div className="">
                    <div className="md-grid govt-dashboard-bg">
                        <div className="md-cell md-cell--3 width-25">
                            <div className="harlabh-report-panel">
                                <div className="report-panel-text-container">
                                    <div className="height-8px">
                                        <div className="hr-text-box">
                                            <h6>BR</h6>
                                        </div>
                                    </div>
                                    <div className="harlabh-report-text">
                                        <h3>Report</h3>
                                    </div>
                                </div>
                                <div className="harlabh-dropdown-container">
                                    <div className="harlabh-dropdown-position">
                                        <SelectField
                                            id="Search-district"
                                            label="District"
                                            position={SelectField.Positions.BELOW}
                                            menuItems={districtList}
                                            className="md-cell"
                                            style={style.dropdown}
                                            defaultValue = "All Districts"
                                            onChange={this.fetchDist.bind(this)}
                                        />
                                    </div>
                                    <div className="harlabh-dropdown-position">
                                        <SelectField
                                            id="search-department"
                                            label="Department"
                                            position={SelectField.Positions.BELOW}
                                            menuItems={departmentList}
                                            className="md-cell"
                                            style={style.dropdown}
                                            defaultValue="All Departments"
                                            onChange={this.fetchDept.bind(this)}
                                        />
                                    </div>
                                    <div className="harlabh-dropdown-position">
                                        <SelectField
                                            id="search-schemes"
                                            label="Schemes / Services"
                                            position={SelectField.Positions.BELOW}
                                            menuItems={filterService}
                                            className="md-cell"
                                            style={style.dropdown}
                                            defaultValue="All Schemes"
                                            onChange={this.fetchService.bind(this)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md-cell md-cell--9 width-75">
                            <div className="summary-list">
                                <div className="md-grid">
                                    {summary.map((s, i) => {
                                        return (
                                            <div className="md-cell md-cell--3" key={i}>
                                                <div className="item" style={{ color: s.color, borderColor: s.color, fontWeight: s.weight }}>
                                                    <h3>{s.value}</h3>
                                                    <h6>{s.label}</h6>
                                                </div>
                                            </div>
                                        )
                                    })
                                    }
                                </div>
                            </div>
                            <div className="harlabh-legend-container">
                                <div className="right-to-service-text">
                                    <CSVLink data={exportData}>
                                        <div className="icon-text-container">
                                          <i className="material-icons export-icon">vertical_align_bottom</i>
                                          <span className="export-text">Export</span>
                                        </div>
                                    </CSVLink>

                                    {/* <div className="report-chart-btn">
                                        <div className="md-grid">
                                            <div className="md-cell md-cell--2" >
                                            </div>
                                            <div className="md-cell md-cell--2" >
                                            </div>
                                            <div className="md-cell md-cell--2" >
                                            </div>
                                            <div className="md-cell md-cell--2" >
                                                <div className="legend-list">
                                                    <Button label="Last 30 Days" flat onClick={this.dateSender.bind(this, 30)}></Button>
                                                </div>
                                            </div>
                                            <div className="md-cell md-cell--2" >
                                                <div className="legend-list">
                                                    <Button label="Last 90 Days" flat onClick={this.dateSender.bind(this, 90)}></Button>
                                                </div>
                                            </div>
                                            <div className="md-cell md-cell--2" >
                                                <div className="legend-list">
                                                    <Button label="All Time" flat onClick={this.dateSender.bind(this, 100)}></Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="harlabh-chart-bg">
                                    <Chart />
                                </div>
                                {/* <div className="progress-bar-container">
                                    <div className="dept-onbrd-text">
                                        <h4>Departments Onboarding Status</h4>
                                    </div>
                                    <div className="progress-bar-line">
                                        <div className="md-grid">
                                            <div className="md-cell md-cell--4 boarded-text-container">
                                                <h4 style={{ color: "#5bbeb9" }}>Boarded </h4>
                                            </div>
                                            <div className="md-cell md-cell--7 boarded-progress-bar width-60">
                                                <LinearProgress
                                                    id="progress-bar"
                                                    value={boarded}
                                                    className="vertical-progress"
                                                    style={{ height: 15, width: `${100}%` }}
                                                />
                                            </div>
                                            <div className="md-cell md-cell--1 progress-bar-percentage">
                                                <h4 style={{ color: "#5bbeb9" }}>{boarded}%</h4>
                                            </div>
                                            <div className="md-cell md-cell--4 boarded-text-container">
                                                <h4 style={{ color: "#5163c5" }}>Manually Running </h4>
                                            </div>
                                            <div className="md-cell md-cell--7 manually-progress-bar width-60">
                                                <LinearProgress
                                                    id="progress-bar"
                                                    value={manuallyRunning}
                                                    className="vertical-progress"
                                                    style={{ height: 15, width: `${100}%` }}
                                                />
                                            </div>
                                            <div className="md-cell md-cell--1 progress-bar-percentage">
                                                <h4 style={{ color: "#5163c5" }}>{manuallyRunning}%</h4>
                                            </div>
                                            <div className="md-cell md-cell--4 boarded-text-container">
                                                <h4 style={{ color: "#ee7e31" }}>Fully Automated </h4>
                                            </div>
                                            <div className="md-cell md-cell--7 automated-progress-bar width-60">
                                                <LinearProgress
                                                    id="progress-bar"
                                                    value={fullyAutomated}
                                                    className="vertical-progress"
                                                    style={{ height: 15, width: `${100}%` }}
                                                />
                                            </div>
                                            <div className="md-cell md-cell--1 progress-bar-percentage">
                                                <h4 style={{ color: "#ee7e31" }}>{fullyAutomated}%</h4>
                                            </div>
                                            <div className="md-cell md-cell--4 boarded-text-container">
                                                <h4 style={{ color: "#95c451" }}>Taking Citizen Feedback </h4>
                                            </div>
                                            <div className="md-cell md-cell--7 feedback-progress-bar width-60">
                                                <LinearProgress
                                                    id="progress-bar"
                                                    value={feedback}
                                                    className="vertical-progress"
                                                    style={{ height: 15, width: `${100}%` }}
                                                />
                                            </div>
                                            <div className="md-cell md-cell--1 progress-bar-percentage">
                                                <h4 style={{ color: "#95c451" }}>{feedback}%</h4>
                                            </div>
                                            <div className="md-cell md-cell--4 boarded-text-container">
                                                <h4 style={{ color: "#b99e84" }}>Interoperable APIs </h4>
                                            </div>
                                            <div className="md-cell md-cell--7 api-progress-bar width-60">
                                                <LinearProgress
                                                    id="progress-bar"
                                                    value={interoperableApis}
                                                    className="vertical-progress"
                                                    style={{ height: 15, width: `${100}%` }}
                                                />
                                            </div>
                                            <div className="md-cell md-cell--1 progress-bar-percentage">
                                                <h4 style={{ color: "#b99e84" }}>{interoperableApis}%</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
