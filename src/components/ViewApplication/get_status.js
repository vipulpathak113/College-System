var get_status = (status) => {
	if(status === "form_filled_up"){
		return "Applied"
	}
	else if(status === "documents_rejected"){
		return "Documents Rejected"
	}
	else if(status === "all_documents_accepted"){
		return "Documents Approved"
	}
	else if(status === "on_hold"){
		return "On Hold"
	}
	else if(status === "active_beneficiary"){
		return "Active Beneficiary"
	}
	else if(status === "all_benefits_granted"){
		return "All Benefits Granted"
	}
	else if(status === "documents_pending"){
		return "Documents Approval Pending"
	}
}

export default get_status;
