import React from 'react'
import Navbar from './navbar_harlabh'
import { colDept } from './department'
import { colSchema, colMeta } from './deptt_list'
import { Switch } from 'react-md';
import * as _ from 'lodash';
import bootupsettings from '../../models/bootupsettings'
import easygov from '../../utility/network'
import store from '../../utility/store'
import { Accordion, AccordionItem } from 'react-sanfona';

var response, districtList = [], departmentData = [], starArray = [], deptChecked = [], distChecked = []
const spanStyle = {
    fontSize: "20px",
    color: "#b8b8b8",
    width: "18px"
}
const spanColorStyle = {
    width: "18px",
    color: "#ee8830",
    fontSize: "20px"
}

class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            district: false,
            department: false,
        }

    }

    render() {
        return (
            <div>
                {(() => {
                    if (this.props.data && this.props.data.length) {
                        return <div>{this.props.data}</div>
                    }
                    else if (Number.isInteger(this.props.data)) {
                        let ratingResult = Math.ceil(this.props.data / 20)
                        if (ratingResult === 0) {
                            return (
                                <div>
                                    <span className="material-icons" style={spanStyle}>star_rate</span>
                                    <span className="material-icons" style={spanStyle}>star_rate</span>
                                    <span className="material-icons" style={spanStyle}>star_rate</span>
                                    <span className="material-icons" style={spanStyle}>star_rate</span>
                                    <span className="material-icons" style={spanStyle}>star_rate</span>
                                </div>
                            )
                        }
                        else if (ratingResult === 1) {
                            return (
                                <div>
                                    <span className="material-icons" style={spanColorStyle}>star_rate</span>
                                    <span className="material-icons" style={spanStyle}>star_rate</span>
                                    <span className="material-icons" style={spanStyle}>star_rate</span>
                                    <span className="material-icons" style={spanStyle}>star_rate</span>
                                    <span className="material-icons" style={spanStyle}>star_rate</span>
                                </div>
                            )
                        }
                        else if (ratingResult === 2) {
                            return (
                                <div>
                                    <span className="material-icons" style={spanColorStyle}>star_rate</span>
                                    <span className="material-icons" style={spanColorStyle}>star_rate</span>
                                    <span className="material-icons" style={spanStyle}>star_rate</span>
                                    <span className="material-icons" style={spanStyle}>star_rate</span>
                                    <span className="material-icons" style={spanStyle}>star_rate</span>
                                </div>
                            )
                        }
                        else if (ratingResult === 3) {
                            return (
                                <div>
                                    <span className="material-icons" style={spanColorStyle}>star_rate</span>
                                    <span className="material-icons" style={spanColorStyle}>star_rate</span>
                                    <span className="material-icons" style={spanColorStyle}>star_rate</span>
                                    <span className="material-icons" style={spanStyle}>star_rate</span>
                                    <span className="material-icons" style={spanStyle}>star_rate</span>
                                </div>
                            )
                        }
                        else if (ratingResult === 4) {
                            return (
                                <div>
                                    <span className="material-icons" style={spanColorStyle}>star_rate</span>
                                    <span className="material-icons" style={spanColorStyle}>star_rate</span>
                                    <span className="material-icons" style={spanColorStyle}>star_rate</span>
                                    <span className="material-icons" style={spanColorStyle}>star_rate</span>
                                    <span className="material-icons" style={spanStyle}>star_rate</span>
                                </div>
                            )
                        }
                        else if (ratingResult === 5) {
                            return (
                                <div>
                                    <span className="material-icons" style={spanColorStyle}>star_rate</span>
                                    <span className="material-icons" style={spanColorStyle}>star_rate</span>
                                    <span className="material-icons" style={spanColorStyle}>star_rate</span>
                                    <span className="material-icons" style={spanColorStyle}>star_rate</span>
                                    <span className="material-icons" style={spanColorStyle}>star_rate</span>
                                </div>
                            )
                        }

                    }
                    else if (this.props.data) {
                        return <div style={{ color: "blue" }}><i className="material-icons">done</i></div>
                    } else {
                        return <div style={{ color: "#c8c8c8" }}><i className="material-icons">remove</i></div>
                    }
                })()
                }
            </div>
        )
    }
}

export default class Compare extends React.Component {
    constructor() {
        super();
        this.state = {
            check: "",
            deptData: [],
            colSchema: [],
            colDept: [],
            visible: "options",
            department: true,
            distClass: "compare-accordion-title",
            deptClass: "compare-accordion-title"
        }
    }
    componentWillMount() {

        easygov.send(bootupsettings.ENDPOINTS.HARLABH_DISTRICT_WISE_DATA_COUNT, "", "HARLABH_DISTRICT_WISE_DATA_COUNT", function (response, component) {
        })

        easygov.send(bootupsettings.ENDPOINTS.HARLABH_COMPARE_ONBOARDING_STATUS, "", "HARLABH_COMPARE_ONBOARDING_STATUS", function (response, component) {
        })
        store.subscribe(() => {
            response = store.getState()
            if (response.type === "HARLABH_DISTRICT_WISE_DATA_COUNT" && response) {
                var code = response.code
                if (code === 200) {
                    districtList = response.data.districtwiseData.reduce((l, data, i) => {
                        l.push({
                            name: data.geography,
                            total: data.total_transactions,
                            amount: data.amount_transferred,
                            beneficiary: data.beneficiary,
                            id: data.geo_Id,
                            isVisible: false
                        });
                        return l;
                    }, []);
                    for (let i = districtList.length - 1; i >= 0; i--) {
                        distChecked[i + 1] = false;
                        districtList[i + 1] = districtList[i];
                        if (i === 0) {
                            districtList[0] = { name: "All Districts", id: "0000", isVisible: false }
                        }
                    }

                    let colSchema = Object.keys(districtList[1]).filter((k) => ['id', 'name', 'isVisible'].indexOf(k) < 0).map(v => v).reduce((l, c, i) => {
                        let meta = colMeta[c];
                        l.push({
                            displayName: meta.displayName,
                            name: c,
                            color: meta.color,
                            borderColor: meta.borderColor
                        })
                        return l;
                    }, [])
                    this.setState({
                        check: true,
                        deptData: districtList,
                        colSchema: colSchema
                    })
                }
                else if (code === 401) {
                    localStorage.setItem("next-url", "36")
                    window.location.href = "sign-in"
                }
            }

            else if (response.type === "HARLABH_COMPARE_ONBOARDING_STATUS" && response) {
                var code = response.code
                if (code === 200) {
                    departmentData = response.data.reduce((l, data, i) => {
                        l.push({
                            id: data.id,
                            name: data.name,
                            boarded: data.boarded,
                            rating: data.rating,
                            fullyAutomated: data.fully_automated,
                            interoperableAPIs: data.interoperable_apis,
                            citizenFeedback: data.taking_citizen_feedback,
                            manuallyRunning: data.manually_running

                        });
                        return l;
                    }, []);
                    for (let i = departmentData.length - 1; i >= 0; i--) {
                        deptChecked[i + 1] = false
                        departmentData[i + 1] = departmentData[i];
                        if (i === 0) {
                            deptChecked[0] = false
                            departmentData[0] = { name: "All Departments", id: "1111" }
                        }
                    }
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

    //////////////////////////////////////////////////////////////////////////////////////
    //for district population
    updateRow(id, index, val) {

        let _deptData = this.state.deptData;
        if (id === "0000") {
            distChecked[0] = val;
            for (let i = 0; i < _deptData.length - 1; i++) {
                _deptData[i + 1].isVisible = val;
                distChecked[i + 1] = val
            }
        }
        else {
            let isChecked = 0;
            let row = _.find(_deptData, { id: id });
            row.isVisible = val;
            distChecked[index] = val
            if (distChecked[0] === true) {
                distChecked[0] = false;
            }
            else {
                for (let j = 1; j < _deptData.length; j++) {
                    if (distChecked[j] === false) {
                        isChecked += 1;
                        break;
                    }
                }
                if (isChecked === 0) {
                    distChecked[0] = true
                }
            }
        }
        this.setState({ deptData: _deptData });

    }

    //for department population
    updateDepartment(id, index, val) {
        let _coldata = departmentData;
        if (id === "1111") {
            deptChecked[0] = val;
            for (let i = 0; i < _coldata.length - 1; i++) {
                _coldata[i + 1].isVisible = val;
                deptChecked[i + 1] = val
            }
        }
        else if (id !== "1111") {
            let isChecked = 0;
            let row = _.find(_coldata, { id: id });
            row.isVisible = val;
            deptChecked[index] = val
            if (deptChecked[0] === true) {
                deptChecked[0] = false
            }
            else {
                for (let j = 1; j < departmentData.length; j++) {
                    if (deptChecked[j] === false) {
                        isChecked += 1;
                        break;
                    }
                }
                if (isChecked === 0) {
                    deptChecked[0] = true
                }
            }
        }
        this.setState({ colDept: _coldata });

    }

    //////////////////////////////////////////////////////////////////////////////////////
    expandedAccordion(val) {
        if (val === "district") {
            this.setState({
                distClass: 'compare-accordion-active-title',
                visible: 'district'
            })

        }
        else if (val === "department") {
            this.setState({
                deptClass: 'compare-accordion-active-title',
                visible: 'department'
            })

        }
    }

    closedAccordion(val) {
        if (val === "district") {
            this.setState({
                distClass: 'compare-accordion-title'
            })
        }
        else if (val === "department") {
            this.setState({
                deptClass: 'compare-accordion-title'
            })
        }
    }

    render() {

        return (
            <div>
                <Navbar />
                <div className="">
                    <div className="md-grid govt-dashboard-bg">
                        <div className="md-cell md-cell--3 ">
                            <div className="harlabh-report-panel">
                                <div className="compare-panel-text-container">
                                    <div className="height-8px">
                                        <div className="hr-text-box">
                                            <h6>HR</h6>
                                        </div>
                                    </div>
                                    <div className="harlabh-report-text">
                                        <h3>Compare </h3>
                                    </div>
                                </div>
                                <div className="compare-expansion-panel">
                                    <div className="select-any-option">
                                        <h3>Select Any Options</h3>
                                    </div>
                                    <Accordion>
                                        <AccordionItem title="District" className="compare-accordion-panel" duration={1000}
                                            titleClassName={this.state.distClass} onExpand={this.expandedAccordion.bind(this, 'district')} onClose={this.closedAccordion.bind(this, 'district')}>
                                            <div>
                                                {districtList.map((d, i) => {
                                                    return (
                                                        <div className="compare-toggle-btn" key={i}>
                                                            <Switch
                                                                id={"dist" + d.id}
                                                                type="switch"
                                                                label={d.name}
                                                                checked={distChecked[i]}
                                                                name="district-toggle"
                                                                labelBefore
                                                                onChange={this.updateRow.bind(this, d.id, i)}
                                                            />
                                                        </div>
                                                    )
                                                }
                                                )}
                                            </div>
                                        </AccordionItem>
                                        <AccordionItem title="Department" className="compare-accordion-panel" duration={1000}
                                            titleClassName={this.state.deptClass} onExpand={this.expandedAccordion.bind(this, 'department')} onClose={this.closedAccordion.bind(this, 'department')}>
                                            <div>
                                                {departmentData.map((d, i) => {
                                                    return (
                                                        <div className="compare-toggle-btn" key={i}>
                                                            <Switch
                                                                id={"dept" + d.id}
                                                                type="switch"
                                                                label={d.name}
                                                                checked={deptChecked[i]}
                                                                name="department-toggle"
                                                                labelBefore
                                                                onChange={this.updateDepartment.bind(this, d.id, i)}
                                                            />
                                                        </div>
                                                    )
                                                }
                                                )}
                                            </div>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                        <div className="md-cell md-cell--9 width-76">
                            {
                                (this.state.deptClass === "compare-accordion-title" && this.state.distClass === "compare-accordion-title") ?
                                    <div className="comparing-right-service">
                                        <h2 style={{ textAlign: 'center', paddingTop: '50px' }}>Please Select Any Option</h2>
                                    </div>
                                    : <div></div>

                            }
                            {
                                (this.state.visible === "district") ?
                                    (this.state.distClass === "compare-accordion-active-title") ?
                                        <div className="compare-data-container" style={{ marginTop: '7px' }}>
                                            <h3>Comparing Right to service Status</h3>
                                            {
                                                this.state.deptData.map((row, i) => {
                                                    let visibility = row.isVisible ? 'block' : 'none';
                                                    let opacity = row.isVisible ? 1 : 0;
                                                    return (
                                                        <div key={i} style={{ opacity: opacity, display: (this.state.visible === "district") ? visibility : "", transition: 'opacity 1s ease-out' }}>
                                                            <div className="compare-dist-name-container">
                                                                <h6>{row.name}</h6>
                                                            </div>
                                                            <div className="md-grid district-data-list">
                                                                {this.state.colSchema.map((col, n) => {
                                                                    return (
                                                                        <div key={n} className={`md-cell md-cell--${12 / colSchema.length}`}>
                                                                            <div className="list" style={{ color: col.color, borderColor: col.borderColor }}>
                                                                                <h3>{row[col.name]}</h3>
                                                                                <h6>{col.displayName}</h6>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div> : <div></div>
                                    : <div></div>
                            }

                            {
                                (this.state.visible === "department") ?

                                    (this.state.deptClass === "compare-accordion-active-title") ?
                                        <div className="compare-data-deptt-wise-container" style={{ marginTop: '25px' }}>
                                            <h3>Comparing Onboarding Status</h3>
                                            <div className="deptt-data-compare-table">
                                                <div className="md-grid">
                                                    {
                                                        colDept.map((col, n) => {
                                                            return (
                                                                <div key={n} className="md-cell" style={{ width: 100 / colDept.length + '%' }}>
                                                                    <div className="">
                                                                        {col.displayName}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            {
                                                departmentData.map((row, i) => {
                                                    let display = row.isVisible ? 'block' : 'none';
                                                    let opacity = row.isVisible ? 1 : 0;
                                                    return (
                                                        <div key={i} style={{ opacity: opacity, display: display, transition: 'opacity 1s ease-out' }}>
                                                            <div className="compare-deptt-data-container">
                                                                <div className="md-grid">
                                                                    {colDept.map((col, n) => {
                                                                        return (
                                                                            <div key={n} className="md-cell" style={{ width: 100 / colDept.length + '%' }}>
                                                                                <div className="compare-table-padding">
                                                                                    <Cell data={row[col.name]} />
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div> : <div></div>
                                    : <div></div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
