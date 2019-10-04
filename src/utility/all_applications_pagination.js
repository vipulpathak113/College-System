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

var currentPage = 1, pageStatus = "", row = [], pages = 0, searchTerm = "", searchType = "", tabValue = "", searchResult = ""

function setCurrentPage(type) {
	storage.removeItemValue(keys.USER_PREFERENCE.SCROLL_POSITION)
	storage.removeItemValue(keys.APP_PREFERENCE.PREVIOUS_COUNT)
	store.dispatch({ type: "CLEAR_CHECKBOX" })
	if (type === "first") {
		openPage(1)
	}
	else if (type === "previous") {
		openPage(currentPage - 1)
	}
	else if (type === "next") {
		openPage(currentPage + 1)
	}
	else {
		openPage(pages)
	}
}
function openPage(val) {
	if (storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)) {
		searchType = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)).type
		searchTerm = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)).value
		currentPage = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE))
	}
	currentPage = val
	storage.setItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE, val)
	if(pageStatus !== ""){
		network.send(bootupsettings.ENDPOINTS.SEARCH_APPLICATIONS, { "searchTerm": searchTerm, "searchType": searchType, "status": pageStatus, "size": 15, pageNumber: val }, tabValue, function (response, component) { })
	}else {
		network.send(bootupsettings.ENDPOINTS.ALL_APPLICATIONS, {"pageNumber":val, "size": 15}, "ALL_APPLICATIONS", function (response, component) { })
	}
}

function applicationPagination(status, totalPages, tab, totalCount) {
	if(storage.getItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)){
		searchResult = "Total Search Count : " + totalCount
	}
	else {
		searchResult = ""
	}
	pageStatus = status
	tabValue = tab
	row = []
	if (storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE)) {
		currentPage = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE))
	}
	else {
		currentPage = 1
	}
	// storage.setItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE, previousPage)
	pages = totalPages
	// if(pages>1){
	if (currentPage > 1) {
		row.push(<FlatButton className="page-boxes" label="First" onClick={setCurrentPage.bind(this, "first")} id="first"></FlatButton>)
		row.push(<FlatButton className="page-boxes" label="Previous" onClick={setCurrentPage.bind(this, "previous")} id="previous"></FlatButton>)
	}
	if (currentPage >= 1 && currentPage <= totalPages) {
		row.push(<div key="1" className="page-boxes-text" id="current">Showing page {currentPage} out of {totalPages}</div>)
	}
	if (currentPage < totalPages) {
		row.push(<FlatButton className="page-boxes" label="Next" onClick={setCurrentPage.bind(this, "next")} id="next"></FlatButton>)
		row.push(<FlatButton className="page-boxes" label="Last" onClick={setCurrentPage.bind(this, "last")} id="last"></FlatButton>)
	}
	// }
	// storage.removeItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE)
	// for(let i=0; i<totalPages;i++){
	// 	if(currentPage === i){
	// 		row.push(<div className="page-boxes" id={i+1}>{i+1}</div>)
	// 	}
	// 	else {
	// 		row.push(<div className="page-boxes" onClick={openPage.bind(this, i+1)} id={i+1}>{i+1}</div>)
	// 	}
	// }
	// <div>
	// {searchResult}
	// </div>
	return (
		<div className="page-boxes-wrapper-new">
				<div className="page-result-count">{searchResult}</div>
				<div className="pagination-btn-wrapper">{row}</div>
		</div>
	)
}

export default applicationPagination;
