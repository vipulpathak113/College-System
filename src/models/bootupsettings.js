const HOST = 'https://dev.tnpCrew.sarayulabs.in';

class bootupsettings {
	constructor(endpoints, url) {
		this.ENDPOINTS = endpoints;
		this.URL = url
	}
}

const ENDPOINTS = {
	SIGNIN : HOST + '/api/auth/login',




	ALL_APPLICATIONS : HOST + 'adminpanel/harlabhadmin/getallapplications/',
	GET_SINGLE_APPLICATION: HOST + 'adminpanel/harlabhadmin/getsingleapplication/',
	GET_SINGLE_DOCUMENT: HOST + 'adminpanel/harlabhadmin/getsingledocument/',
	APPLICATION_COUNT: HOST + 'adminpanel/harlabhadmin/getapplicationcount/',
	GET_DBT_APPLICATIONS: HOST + 'adminpanel/harlabhadmin/getdbtapplications/',
	PRINT_APPLICATION: HOST + 'adminpanel/harlabhadmin/printapplication/',
	GET_NON_DBT_APPLICATIONS: HOST + 'adminpanel/harlabhadmin/getnondbtapplications/',
	NON_MONETARY_APPLICATIONS: HOST + 'adminpanel/harlabhadmin/getnonmonetaryapplications/',
	TAKE_DOCUMENT_ACTION: HOST + 'adminpanel/harlabhadmin/documentaction/',
	TAKE_DOCUMENT_SUGGESSTION_ACTION: HOST + 'adminpanel/harlabhadmin/suggesteddocumentaction/',
	REVIEW_DOCUMENT_ACTION : HOST + 'adminpanel/harlabhadmin/documentreviewlater/',
	CHANGE_APPLICATION_STATUS: HOST + 'adminpanel/harlabhadmin/changeapplicationstatus/',
	ACTIVE_BENEFICIARY : HOST + 'adminpanel/harlabhadmin/activebeneficiary/',
	HOLD_BENEFICIARY : HOST + 'adminpanel/harlabhadmin/holdapplication/',
	DISBURSE_DBT_AMOUNT : HOST + 'adminpanel/harlabhadmin/disbursedbtamount/',
	GET_FACILITATOR_USER : HOST + 'adminpanel/harlabhadmin/getfacilitatoruser/',
	COMPLETE_NON_MONETARY_BENEFIT : HOST + 'adminpanel/harlabhadmin/completesubbenefit/',
	ASSIGN_BENEFIT : HOST + 'adminpanel/harlabhadmin/assignbenefit/',
	SEARCH_APPLICATIONS : HOST + 'adminpanel/harlabhadmin/searchapplications/',
	SEARCH_DBT_APPLICATIONS : HOST + 'adminpanel/harlabhadmin/searchdbt/',
	SEARCH_NON_MONETARY_APPLICATIONS : HOST + 'adminpanel/harlabhadmin/searchnonmonetary/',
	VIEW_BENEFIT_DATA : HOST + 'adminpanel/harlabhadmin/viewbenefitdata/',
	LOGOUT_USER : HOST + 'adminpanel/logout/',
	CHANGE_PASSWORD: HOST + '/api/auth/password_change',
	STUDENT_INFO: HOST+ '/api/students',
	HARLABH_DASHBOARD: HOST + 'harlabhdashboard/righttoservicestatus/',
	HARLABH_DISTRICT_WISE_DATA_COUNT: HOST + 'harlabhdashboard/districtwisedatacount/',
	HARLABH_COMPARE_ONBOARDING_STATUS: HOST + 'harlabhdashboard/comparing_onboarding_status/',
	HARLABH_FILTER_SERVICES: HOST + 'harlabhdashboard/filterservices/',
}
const URL = {
	COMPARE: "compare",
	REPORTS: "reports"
}


export default (new bootupsettings(ENDPOINTS, URL));
