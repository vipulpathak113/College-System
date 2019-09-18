import React from 'react'
import TablePopulator from './table_populator'
import keys from '../../models/localStorage-keys'
import storage from '../../utility/encrypt_data'
import store from '../../utility/store'
import easygov from '../../utility/network'
import bootupsettings from '../../models/bootupsettings'

var activeAction = "", data = [], pages = 0, previousPage = 1, totalCount = 0
export default class HoldApplication extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			display: 'none',
			dropdownBorder: '1px solid rgba(32, 42, 51, 0.2)',
			applicationsData : []
		}
	}
	handleClick(val) {
		this.setState({ display: 'block' })
		activeAction = val;
	}

	componentWillMount() {
		if(storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE)){
			previousPage = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE))
		}
		let term = "", type = ""
		if(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)){
			term = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)).value
			type = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)).type
		}
		easygov.send(bootupsettings.ENDPOINTS.SEARCH_APPLICATIONS, { "searchTerm": term, "searchType": type, "status": "on_hold", "size":15, "pageNumber":previousPage }, "on_hold", function (response, component) { })
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "on_hold" || response.type === "on_hold_tab") {
				if (response.code === 200) {
					data = response.data.objects
					pages = response.data.totalPages
					totalCount = response.data.totalCount
					this.setState({
						applicationsData: response.data.objects
					})
				}
				else if (response.code === 401 && response.message.toLowerCase().includes("token")) {
					storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
					window.location.href = "/sign-in"
				}
			}
		})
	}

	handleBlur(val) {
		this.setState({ display: 'block' })
	}
	dropdownClick() {
		this.setState({ dropdownBorder: '1px solid #ef7950' })
	}
	render() {
		const approveDropdown = {
			width: '100%',
			height: '40px',
			border: this.state.dropdownBorder,
			borderRadius: '3px',
			backgroundColor: '#f7faf8'
		}

		return (
			<div>
				{TablePopulator(this.state.applicationsData, "on_hold", 6, this, pages, "on_hold_tab", totalCount)}
			</div>
		)
	}
}
