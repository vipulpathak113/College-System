import React from 'react'
import { TextField } from 'react-md'
import FlatButton from '../components/Buttons/flat_button'
import style from './style'
import easygov from './network'
import store from './store'
import bootupsettings from '../models/bootupsettings'
import get_service_details from './get_service_details'
import storage from './encrypt_data'
import keys from '../models/localStorage-keys'

var response, searchKey = "", previousPage=1, currentPage = 1, currentStatus = ""

function getValue(event) {
	searchKey = event.target.value
}

function clearSearchResults(status) {
	if(storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE)){
		currentPage = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE))
	}
	else {
		currentPage = 1
	}
	storage.removeItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)
	storage.removeItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE)
	document.getElementById('searchbar').value = ""
	document.getElementById('new-search-bar-filter').value = "search-select-any-one"
	if(status === ""){
		// easygov.send(bootupsettings.ENDPOINTS.SEARCH_APPLICATIONS, { "searchTerm": "", "searchType": "", "status": status, "size":15, "pageNumber": currentPage }, "SEARCH_ALL_APPLICATIONS", function (response, component) { })
		easygov.send(bootupsettings.ENDPOINTS.ALL_APPLICATIONS, { "pageNumber": currentPage, "size": 15 }, "SEARCH_ALL_APPLICATIONS", function (response, component) { })
	}else {
		easygov.send(bootupsettings.ENDPOINTS.SEARCH_APPLICATIONS, { "searchTerm": "", "searchType": "", "status": status, "size":15, "pageNumber": currentPage, "size": 15 }, status, function (response, component) { })
	}
}
function searchApplications(pageStatus) {
	// if(storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE)){
	// 	previousPage = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE))
	// }
	searchKey = document.getElementById('new-search-bar-filter').value
	var searchPhrase = document.getElementById('searchbar').value
	if (searchKey !== "search-select-any-one" && searchPhrase !== "") {
		storage.setItemValue(keys.USER_PREFERENCE.SEARCH_QUERY, JSON.stringify({"type": searchKey, "value": searchPhrase}))
		if(pageStatus === ""){
			easygov.send(bootupsettings.ENDPOINTS.SEARCH_APPLICATIONS, { "status": currentStatus, "searchTerm": searchPhrase, "searchType": searchKey, "pageNumber":previousPage, "size": 15 }, "SEARCH_ALL_APPLICATIONS", function (response, component) { })
		}else {
			easygov.send(bootupsettings.ENDPOINTS.SEARCH_APPLICATIONS, { "status": currentStatus, "searchTerm": searchPhrase, "searchType": searchKey, "pageNumber":previousPage, "size": 15 }, currentStatus, function (response, component) { })
		}
	}
	else if (searchPhrase === "" && searchKey !== "") {
		window.alert("Please enter some text in the text field to search.")
		// searchPhraseError = "This field is required"
	}
	else if (searchKey === "" && searchPhrase !== "") {
		window.alert("Please select any Field type to perform search.")
		// searchKeyError = "This filed can't be left blank"
	}
	else {
		window.alert("Please select a Field type and enter some text to perform search.")
	}
}
function searchApplicationsOnEnter(pageStatus, e) {
	if (e.key === "Enter") {
		searchApplications(pageStatus)
	}
}

function filterApplication(array, pageStatus) {
	currentStatus = pageStatus
	let term = "", type = ""
	if(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)){
		term = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)).value
		type = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)).type
	}
	return (
		<div className="filter-container">
			<div className="filter-dropdown-container">
				<select
					id="new-search-bar-filter"
					style={style.dropdown}
					onChange={getValue.bind(this)}
				>
					<option value="search-select-any-one">Select any one</option>
					{
						array.map((item, i) => {
							if(item.value === type){
								return (
									<option value={item.value} key={i} selected="selected">{item.label}</option>
								)
							}
							else {
								return (
									<option value={item.value} key={i}>{item.label}</option>
								)
							}

						})
					}
				</select>
			</div>
			<div className="search-bar-bg">
				<TextField
					id="searchbar"
					placeholder="Search Application"
					style={style.autocomplete}
					onKeyPress={searchApplicationsOnEnter.bind(this, pageStatus)}
					defaultValue={term}
				/>
			</div>
			<FlatButton flat label="Search" onClick={searchApplications.bind(this, pageStatus)} className="all-page-search-button" />
			<FlatButton flat label="Clear" onClick={clearSearchResults.bind(this, pageStatus)} className="all-page-clear-button" />
		</div>
	)
}

export default filterApplication;
