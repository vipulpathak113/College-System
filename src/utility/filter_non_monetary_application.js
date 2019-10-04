import React from 'react'
import { TextField } from 'react-md'
import FlatButton from '../components/Buttons/flat_button'
import style from './style'
import network from './network'
import store from './store'
import bootupsettings from '../models/bootupsettings'
import get_service_details from './get_service_details'

var response, searchKey = ""

function getValue(event) {
	searchKey = event.target.value
}

function clearSearchResults() {
	document.getElementById('searchbar').value = ""
	network.send(bootupsettings.ENDPOINTS.NON_MONETARY_APPLICATIONS, "", "NON_MONETARY_APPLICATIONS", function (response, component) { })
}
function searchApplications() {
	var searchPhrase = document.getElementById('searchbar').value
	if (searchKey !== "" && searchPhrase !== "") {
		// network.send(bootupsettings.ENDPOINTS.SEARCH_APPLICATIONS, { "size": "1000", "searchTerm": searchPhrase, "searchType": searchKey }, "SEARCH_APPLICATIONS", function (response, component) { })
		network.send(bootupsettings.ENDPOINTS.SEARCH_NON_MONETARY_APPLICATIONS, { "searchTerm": searchPhrase, "searchType": searchKey }, "SEARCH_NON_MONETARY_APPLICATIONS", function (response, component) { })
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
function searchApplicationsOnEnter(e) {
	if (e.key === "Enter") {
		var searchPhrase = document.getElementById('searchbar').value
		if (searchKey !== "" && searchPhrase !== "") {
			network.send(bootupsettings.ENDPOINTS.SEARCH_APPLICATIONS, { "size": "1000", "searchTerm": searchPhrase, "searchType": searchKey }, "SEARCH_APPLICATIONS", function (response, component) { })
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
}

function filterApplication(array) {
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
