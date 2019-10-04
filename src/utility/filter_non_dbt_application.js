import React from 'react'
import { TextField } from 'react-md'
import FlatButton from '../components/Buttons/flat_button'
import style from './style'
import network from './network'
import store from './store'
import bootupsettings from '../models/bootupsettings'
import get_service_details from './get_service_details'
import keys from '../models/localStorage-keys'
import storage from './encrypt_data'

var response, searchKey="", pageStatus = ""

function getValue(event) {
	searchKey = event.target.value
}

function clearSearchResults() {
	storage.removeItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)
	document.getElementById('searchbar').value=""
	network.send(bootupsettings.ENDPOINTS.GET_NON_DBT_APPLICATIONS, {"status": pageStatus, "searchTerm": "", "searchType": ""}, "GET_NON_DBT_APPLICATIONS", function (response, component) { })
}
function searchApplications() {
	var searchPhrase = document.getElementById('searchbar').value
	if(searchKey !== "" && searchPhrase !== ""){
		storage.setItemValue(keys.USER_PREFERENCE.SEARCH_QUERY, JSON.stringify({"type": searchKey, "value": searchPhrase}))
		network.send(bootupsettings.ENDPOINTS.GET_NON_DBT_APPLICATIONS, { "status": pageStatus, "searchTerm": searchPhrase, "searchType": searchKey }, "GET_NON_DBT_APPLICATIONS", function (response, component) { })
	}
	else if (searchPhrase === "" && searchKey !== "") {
		window.alert("Please enter some text in the text field to search.")
	}
	else if (searchKey === "" && searchPhrase !== "") {
		window.alert("Please select any Field type to perform search.")
	}
	else {
		window.alert("Please select a Field type and enter some text to perform search.")
	}
}
function searchApplicationsOnEnter(e) {
	if (e.key === "Enter") {
		searchApplications()
	}
}

function filterApplication(array, status) {
	pageStatus = status
	return (
		<div className="filter-container">
			<div className="filter-dropdown-container">
				<select
					id="filter"
					style={style.dropdown}
					onChange={getValue.bind(this)}
				>
					<option value="select">Select any one</option>
					{
						array.map((item, i) => {
							return (
								<option value={item.value}>{item.label}</option>
							)
						})
					}
				</select>
			</div>
			<div className="search-bar-bg">
				<TextField
					id="searchbar"
					placeholder="Search Application"
					style={style.autocomplete}
					onKeyPress={searchApplicationsOnEnter.bind(this)}
				/>
			</div>
			<FlatButton label="Search" onClick={searchApplications.bind(this)} className="all-page-search-button" />
			<FlatButton label="Clear" onClick={clearSearchResults.bind(this)} className="all-page-clear-button" />
		</div>
	)
}

export default filterApplication;
