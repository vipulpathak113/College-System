import React from 'react'
import NonDBT from './non_dbt'
import DBT from './dbt'
import store from '../../utility/store'
import bootupsettings from '../../models/bootupsettings';
import easygov from '../../utility/network'
import NonDBTCompleteTask from './non_dbt_complete_task'
import NonDBTCompletedTask from './non_dbt_completed_task_details'

var activeAction = "", selectedApplicationData, completedTasks = false, completeTask = false, lastTab =1, count = {}, selectedBenefitData
export default class MonetaryBenefits extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dbtActive: 1,
            applicationsData: [],
            showCompleteTask: false,
            showCompletedTask: false,
            lastOpenedTab: 1,
            check : ""
        }
        count = props.count
    }
    handleActive(val) {
        lastTab = 1;
        this.setState({ dbtActive: val })
    }
    printCommand(val) {
        var mywindow = window.open('', 'PRINT', 'height=1000,width=1000');
        mywindow.document.write(document.getElementById(val).innerHTML);
        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/
        mywindow.print();
        mywindow.close();
    }

    componentWillMount() {
        // easygov.send(bootupsettings.ENDPOINTS.GET_DBT_APPLICATIONS, "", "GET_DBT_APPLICATIONS", function (response, component) { })
        store.subscribe(() => {
            var response = store.getState()
            if (response.type === "SHOW_NON_DBT_COMPLETE_TASK") {
                selectedApplicationData = response.data
                selectedBenefitData = response.benefit
                completeTask = true
                this.setState({
                    showCompleteTask: true
                })
            }
            else if (response.type === "CLOSE_NON_DBT_COMPLETE_TASK") {
                completeTask = false
                easygov.send(bootupsettings.ENDPOINTS.GET_DBT_APPLICATIONS, "", "GET_DBT_APPLICATIONS", function (response, component) { })
                lastTab = 1
                this.setState({
                    showCompleteTask: false,
                    dbtActive: 2,
                    lastOpenedTab: 1
                })
            }
            else if (response.type === "SHOW_NON_DBT_COMPLETED_TASK") {
                selectedApplicationData = response.data
                selectedBenefitData = response.benefit
                completedTasks = true
                this.setState({
                    showCompletedTask: true,
                })
            }
            else if (response.type === "CLOSE_NON_DBT_COMPLETED_TASK") {
                easygov.send(bootupsettings.ENDPOINTS.GET_DBT_APPLICATIONS, "", "GET_DBT_APPLICATIONS", function (response, component) { })
                completedTasks = false
                lastTab = 2
                this.setState({
                    showCompletedTask: false,
                    dbtActive: 2,
                    lastOpenedTab: 2
                })
                store.dispatch({ type: "OPEN_COMPLETE_TAB" })
            }
            else if (response.type === "COUNT_UPDATED") {
                count = response.data
                this.setState({
                    check: ""
                })
            }
        })
    }

    render() {
        return (
            <div>
                {
                    !completedTasks ?
                        !completeTask ?
                            <div className="right-panel-content-bg">
                                <h3 className="approve-beneficiary-text">Disburse Benefits <span className="dbt-definition">{this.state.dbtActive === 1 ? "DBT (Direct Benefit Transfer)" : "NON-DBT (Monetary in form of FD or concession etc)"}</span></h3>
                                <div className="export-btn-container">
                                    <div className="icon-text-container" onClick={this.printCommand.bind(this, "monetary-content-to-print")}>
                                        <i className="material-icons export-icon">print</i>
                                        <span className="export-text">Print</span>
                                    </div>
                                </div>
                                <div className="dbt-nondbt-container">
                                    <div className="dbt-nondbt-capsule">
                                        <div className={`dbt-title ${this.state.dbtActive === 1 ? 'dbt-active' : ""}`} onClick={this.handleActive.bind(this, 1)}>
                                            <h4>DBT</h4>
                                        </div>
                                        <div className={`non-dbt-title ${this.state.dbtActive === 2 ? 'dbt-active' : ""}`} > {/*onClick={this.handleActive.bind(this, 2)}>*/}
                                            <h4>NON-DBT</h4>
                                        </div>
                                    </div>
                                </div>
                                <div id="monetary-content-to-print">
                                    {
                                        this.state.dbtActive === 1 ?
                                            <DBT count={count}/> : this.state.dbtActive === 2 ?
                                                <NonDBT data={lastTab} count={count}/> : null
                                    }
                                </div>
                            </div> : <NonDBTCompleteTask data={selectedApplicationData} benefit={selectedBenefitData}/> :
                        <NonDBTCompletedTask data={selectedApplicationData} benefit={selectedBenefitData}/>
                }
            </div>
        )
    }
}
