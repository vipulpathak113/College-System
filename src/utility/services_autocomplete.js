import React from 'react'
import { Autocomplete } from 'react-md'
import storage from './encrypt_data'
import keys from '../models/localStorage-keys'
import url_utility from './url'
import urlKeys from '../config/urlKeys'

var dname, service_data, service_list
const services_autocomplete = (id, placeholder, inputStyle, rootStyle, listStyle) => {
	if (storage.getItemValue(keys.APP_PREFERENCE.SERVICE_LIST_ALL)) {
		service_data = JSON.parse(storage.getItemValue(keys.APP_PREFERENCE.SERVICE_LIST_ALL))
		dname = storage.getItemValue(keys.USER_PREFERENCE.CURRENT_DISTRICT)
		service_list = service_data.map((item) => ({
			// dataLabel: item.category.name,
			primaryText: item.service.name,
			id: item.service.id,
			key: item.service.id,
			secondaryText: item.category.name,
			dataLabel: item.service.name
		}))
	}

	var create_url_after_autocomplete = (value, index, matches) => {
		let val = matches[index].id;
		if (val !== "passport") {
			if (val !== "blank") {
				let selectedService = service_data.find((item) => (item.service.id === val))
				var category = selectedService.category.name.toLowerCase().replace(/\s/g, "-");
				var service_id = selectedService.sgmId;
				var service = selectedService.service.name.toLowerCase().replace(/\s/g, "-");
				if (!storage.getItemValue(keys.USER_PREFERENCE.LOGGEDIN_USER)) {
					let url = "/" + dname + urlKeys.user_story +
						url_utility.params.set_param(urlKeys.category, url_utility.escape_html(category)) +
						url_utility.params.set_param(urlKeys.service, url_utility.escape_html(service)) +
						"&" + url_utility.params.set_param(urlKeys.service_id, service_id)
					storage.setItemValue(keys.APP_PREFERENCE.NEXT_URL, url)
					window.location.href = urlKeys.sign_in
				}

				else {
					window.location.href = "/" + dname + urlKeys.user_story +
						url_utility.params.set_param(urlKeys.category, url_utility.escape_html(category)) +
						url_utility.params.set_param(urlKeys.service, url_utility.escape_html(service)) +
						"&" + url_utility.params.set_param(urlKeys.service_id, service_id)
				}
			}

			else {
				window.location.href = "/" + dname + urlKeys.user_story +
					url_utility.params.set_param(urlKeys.category, url_utility.escape_html(category)) +
					url_utility.params.set_param(urlKeys.service, url_utility.escape_html(service)) +
					"&" + url_utility.params.set_param(urlKeys.service_id, service_id)
			}
		}
		else {
			// window.location.href = "https://www.network.co.in/services/passport/?next=/apply/passport"
		}
	}


	return (
		<Autocomplete
			id={id}
			placeholder={placeholder}
			className="md-cell md-cell--4"
			data={service_list}
			filter={Autocomplete.caseInsensitiveFilter}
			inputStyle={inputStyle}
			focusInputOnAutocomplete={false}
			style={rootStyle}
			onBlur={() => { }}
			listStyle={listStyle}
			onAutocomplete={create_url_after_autocomplete}
		/>
	)
}

export default services_autocomplete;
