import React from 'react';
import { Line } from 'react-chartjs-2';
import store from '../../utility/store'

var response, approved = [], applied = [], processed = [], rejected = [], date = [], chartData

export default class Chart extends React.Component {
    constructor() {
        super();
        this.state = {
            check: ""
        }
    }

    componentWillMount() {
        store.subscribe(() => {
            response = store.getState()
            if (response.type === "HARLABH_DASHBOARD" && response) {
                var code = response.code
                if (code === 200) {
                    response = JSON.parse(JSON.stringify(response.data.objects))
                    applied = Object.values(response).map((item) => {
                        return item.userAppliedCount;
                    })
                    approved = Object.values(response).map((item) => {
                        return item.userApprovedCount;
                    })
                    processed = Object.values(response).map((item) => {
                        return item.userProcessedCount;
                    })
                    rejected = Object.values(response).map((item) => {
                        return item.userRejectedCount;
                    })
                    date = Object.values(response).map((item) => {
                        return item.date;
                    })
                    this.setState({
                        check: "done"
                    })
                }
                else if (code === 401) {
                    window.location.href = "sign-in"
                }
            }
        })
    }

    static defaultProps = {
        displayTitle: true,
        displayLegend: true,
        legendPosition: 'top',
    }

    render() {
        var appliedTotalCount = 0
        applied.reduce((a, b) => appliedTotalCount = a + b, 0)
        // if (appliedTotalCount - 24 < 0) {
        //     appliedTotalCount = 0
        // } else {
        //     appliedTotalCount = appliedTotalCount - 24
        // }

        let approvedTotalCount = 0
        approved.reduce((a, b) => approvedTotalCount = a + b, 0)
        // if (approvedTotalCount - 12 < 0) {
        //     approvedTotalCount = 0
        // } else {
        //     approvedTotalCount = approvedTotalCount - 12
        // }

        let processedTotalCount = 0
        processed.reduce((a, b) => processedTotalCount = a + b, 0)
        // if (processedTotalCount - 12 < 0) {
        //     processedTotalCount = 0
        // } else {
        //     processedTotalCount = processedTotalCount - 12
        // }

        let rejectedTotalCount = 0
        rejected.reduce((a, b) => rejectedTotalCount = a + b, 0)

        chartData = {
            labels: date,
            datasets: [
                {
                    label: `Total Applications (${appliedTotalCount})`,
                    data: applied,
                    backgroundColor: [
                        'rgba(212, 86, 86, 0.1)',
                    ],
                    borderColor: 'red',
                    borderWidth: 1
                },
                {
                    label: `Approved (${approvedTotalCount})`,
                    data: approved,
                    backgroundColor: [
                        'rgba(90, 192, 192, 0.1)',
                    ],
                    borderColor: '#ee8830',
                    borderWidth: 1
                },
                {
                    label: `Under Processing (${processedTotalCount})`,
                    data: processed,
                    backgroundColor: [
                        'rgba(235, 86, 86, 0.1)',
                    ],
                    borderColor: 'blue',
                    borderWidth: 1
                },
                {
                    label: `Rejected (${rejectedTotalCount})`,
                    data: rejected,
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.1)',
                    ],
                    borderColor: 'green',
                    borderWidth: 1
                },
            ]

        }
        return (
            <div>
                <Line
                    height={125}
                    data={chartData}
                    options={{
                        title: {
                            display: this.props.displayTitle,
                            text: '',
                            fontSize: 25,
                        },
                        legend: {
                            labels: {
                                boxWidth: 20,
                                fontFamily: "Montserrat",
                                borderRadius: "50%",
                                fontColor: "#ee8033",
                                padding: 50,
                                fontSize: 15
                            },
                            display: this.props.displayLegend,
                            position: this.props.legendPosition,
                            fontFamily: 'Montserrat',
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }}
                />
            </div>
        )
    }
}
