import React from 'react'
import { Link } from 'react-router-dom'
import HaryanaLogo from '../../img/haryana-logo.png'
import store from '../../utility/store'
import bootupsettings from '../../models/bootupsettings'


export default class Navbar extends React.Component {
    constructor() {
        var getLocation = function (href) {
            var l = document.createElement("a");
            l.href = href;
            return l;
        };
        var l = getLocation(window.location.href);
        var k = l.pathname.replace(/\//g, "");
        super();
        if (k === "dashboardcompare") {
            this.state = {
                compare: "report-compare-active",
                report: "",
                color: "",
                fontWeight: 'harlabh-font-color'
            }
        }
        else {
            this.state = {
                report: "report-compare-active",
                compare: "",
                color: "harlabh-font-color",
                fontWeight: "",
            }
        }
    }

    // handleClick(){
    //     window.location.href = '/logout/'
    // }
    openUrl(){
        window.location.href = '/dashboard'
    }


    reports(val) {

        if (val === "reports") {
            this.setState({
                report: "report-compare-active",
                compare: "",
                color: "harlabh-font-color",
                fontWeight: '',
            })

            // window.scroll({
            //     top: 0,
            //     left: 0,
            //     behavior: 'fast'
            // });

        }
        else if (val === "compare") {
            this.setState({
                compare: "report-compare-active",
                report: "",
                color: "",
                fontWeight: 'harlabh-font-color'
            })
            // window.scroll({
            //     top: 0,
            //     left: 0,
            //     behavior: 'fast'
            // });
        }
    }
    render() {

        return (
            <div className="harlabh-bg">
                <div className="md-grid height-100">
                    <div className="md-cell md-cell--2 margin-0 height-100 cursor-pointer" onClick={this.openUrl.bind(this)}>
                        {/*<div className="haryana-logo">
                            <img src={HaryanaLogo} alt="logo" />
                        </div>*/}
                        <div className="harlabh-heading-text">
                            <h3>SaryuLabs</h3>
                        </div>
                    </div>
                    <div className="md-cell md-cell--1"></div>
                    <div className="md-cell md-cell--6">
                        <div className="harlabh-links">
                            <div className="md-grid">
                                <div className="md-cell md-cell--2 text-align-center" onClick={this.reports.bind(this, "reports")}>
                                    <div className={this.state.report}>
                                        {
                                            (() => {
                                                var params
                                                store.subscribe({
                                                    params: store.getState()
                                                })
                                            })

                                        }
                                        <Link to={bootupsettings.URL.REPORTS} className={this.state.color}>Reports</Link>
                                    </div>
                                </div>
                                {/* <div className="md-cell md-cell--2 text-align-center" onClick={this.reports.bind(this, "compare")}>
                                    <div className={this.state.compare}>
                                        <Link to={bootupsettings.URL.COMPARE} className={this.state.fontWeight}>Compare</Link>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    {/* <div className="md-cell--3">
                        <div className="harlabh-log-out-btn">
                            <Button flat label="Log Out" onClick={this.handleClick.bind(this)}/>
                        </div>
                    </div> */}
                </div>
            </div>
        )
    }
}
