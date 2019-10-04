import React from 'react'
import TablePopulator from './table_populator'
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'
import store from '../../utility/store'
import network from '../../utility/network'
import bootupsettings from '../../models/bootupsettings'

var data = [], pages = 0, previousPage = 1, totalCount = 0
export default class NewApplication extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			display: 'none',
			dropdownBorder: '1px solid rgba(32, 42, 51, 0.2)',
			applicationsData: []
		}
	}

	componentWillMount() {
		if(storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE)){
			previousPage = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE))
		}
		network.send(bootupsettings.ENDPOINTS.ALL_APPLICATIONS, {"pageNumber":previousPage, "size": 15}, "ALL_APPLICATIONS", function (response, component) { })
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "ALL_APPLICATIONS" || response.type === "SEARCH_ALL_APPLICATIONS") {
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
		// let newApplicationData = TablePopulator(this.state.applicationsData, "", 1, this)
		return (
			<div>
				{TablePopulator(data, "", 1, this, pages, "SEARCH_ALL_APPLICATIONS", totalCount)}
			</div>
		)
	}
}
