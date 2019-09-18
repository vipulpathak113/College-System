import React from 'react'
import storage from '../../utility/encrypt_data'
import keys from '../../models/localStorage-keys'

export default class HelpDialog extends React.Component{
    constructor(){
        super()
    }
    render(){
      let nodal_officer_data = storage.getItemValue(keys.USER_PREFERENCE.NODAL_OFFICER_DATA)
        return(
            <div>
                <h4 className="officer-name-text">Nodal Officer- Gurnitika Kaur</h4>
                <div className="contact-no-container">
                    <i className="material-icons email-icon-position">call</i>
                    <h4 className="contact-no-text"> +91 - 94780 29773</h4>
                </div>
                <div className="contact-no-container">
                    <i className="material-icons email-icon-position">email</i>
                    <h4 className="contact-no-text"> dbcharyana@gmail.com</h4>
                </div>
            </div>
        )
    }
}

//{nodal_officer_data.name}
//{nodal_officer_data.phone}
//{nodal_officer_data.email}
