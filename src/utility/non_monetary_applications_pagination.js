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

var currentPage = 1, pageStatus = "", row = [], pages = 0
function setCurrentPage(type){
	if(type === "first"){
		openPage(1)
	}
	else if (type === "previous") {
		openPage(currentPage-1)
	}
	else if (type === "next") {
		openPage(currentPage + 1)
	}
	else {
		openPage(pages)
	}
}
function openPage(val) {
	currentPage = val
	storage.setItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE, val)
	network.send(bootupsettings.ENDPOINTS.SEARCH_NON_MONETARY_APPLICATIONS, { "searchTerm": "", "searchType": "", "status":pageStatus, "pageNumber":val }, "SEARCH_NON_MONETARY_APPLICATIONS", function (response, component) { })
}

function applicationPagination(status, totalPages) {
	pageStatus = status
	row = []
	if(storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE)){
		currentPage = JSON.parse(storage.getItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE))
	}
	pages = totalPages
	if(currentPage > 1){
		row.push(<div className="page-boxes" onClick={setCurrentPage.bind(this,"first")} id="first">First</div>)
		row.push(<div className="page-boxes" onClick={setCurrentPage.bind(this,"previous")} id="previous">Previous</div>)
	}
	if (currentPage >= 1 && currentPage <= totalPages) {
		row.push(<div className="page-boxes-text" onClick={setCurrentPage.bind(this,"current")} id="current">Showing page {currentPage} out of {totalPages}</div>)
	}
	if (currentPage < totalPages) {
		row.push(<div className="page-boxes" onClick={setCurrentPage.bind(this,"next")} id="next">Next</div>)
		row.push(<div className="page-boxes" onClick={setCurrentPage.bind(this,"last")} id="last">Last</div>)
	}

	return (
		<div className="page-boxes-wrapper">
			{row}
		</div>
	)
}

export default applicationPagination;
