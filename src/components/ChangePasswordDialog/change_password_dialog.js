import React from 'react'
import {TextField } from 'react-md/lib';
import { FlatButton } from 'react-md/lib/Buttons';
import easygov from '../../utility/network'
import bootupsettings from '../../models/bootupsettings'
import store from '../../utility/store'
import storage from '../../utility/encrypt_data'
import keys from '../../models/localStorage-keys';

 var password;
export default class ChangePassword extends React.Component {
    constructor() {
        super()
        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            confirmPasswordError : "",
            oldPasswordError: ""
        }
    }
    oldPassword(val) {
        this.setState({
            oldPassword: val,
            oldPasswordError: ""
        })

    }
    newPassword(val) {
        this.setState({
            newPassword: val,
            confirmPasswordError : ""
        })

    }
    // confirmPassword(val) {
    //     this.setState({
    //         confirmPassword: val,
    //         confirmPasswordError: ""
    //     })

    // }
    saveChanges() {

if(this.state.oldPassword==="" && this.state.newPassword !== ""){
    this.setState({
        oldPasswordError : "Current Password can't be left blank"
    })
}

else if(this.state.newPassword === ""&& this.state.oldPassword!==""){
    this.setState({
        confirmPasswordError: "New Password can't be left blank"
    })
}


else if(this.state.oldPassword==="" && this.state.newPassword === ""){
    this.setState({
        oldPasswordError : "Current Password can't be left blank",
        confirmPasswordError: "New Password can't be left blank"

    })
}

if(this.state.oldPassword!=="" && this.state.newPassword != ""){
    store.subscribe(() => {
        var response = store.getState()
        if (response.type === "RESPONSE_FAILED"&& response.response[0].message==="Current password does not match") {
            this.setState({
                oldPasswordError : response.response[0].message
            })
            
        }
       else if (response.type === "RESPONSE_FAILED"&& response.response[0].message!=="Current password does not match") {
            this.setState({
                confirmPasswordError : response.response.map(item=>{
                    return item.message
                })
            })
            
        }
    })

    
    if(this.state.newPassword.length >= 6){
        let change_password = {
                current_password: this.state.oldPassword,
                new_password: this.state.newPassword,
            }
            easygov.send(bootupsettings.ENDPOINTS.CHANGE_PASSWORD, change_password, "CHANGE_PASSWORD", function (response, component) { })
}

    else{
    this.setState({
                        confirmPasswordError : "New Password must be atleast 6 characters long."
                    })
}
        }
    }

    render() {

        var style = {
            textfield2: {
                width: '100%',
                fontFamily: 'Montserrat',
                height: '45px',
                backgroundColor: 'white',
                borderRadius: '3px',
                margin: "0 auto",
                border: "1px solid #cccccc",
                padding: '0 15px'
            }
        }
        return (
            <div>
                <div className="change-password-textfield">
                    <TextField
                        id="old-password"
                        placeholder="Old Password"
                        style={style.textfield2}
                        lineDirection="center"
                        type="password"
                        onChange={this.oldPassword.bind(this)}
                    />
                </div>
                <span className="error-message-text">{this.state.oldPasswordError}</span>
                <div className="change-password-textfield">
                    <TextField
                        id="new-password"
                        placeholder="New Password"
                        style={style.textfield2}
                        lineDirection="center"
                        type="password"
                        onChange={this.newPassword.bind(this)}
                    />
                </div>
            <span className="error-message-text">{this.state.confirmPasswordError}</span> 
                {/* <div className="change-password-textfield">
                    <TextField
                        id="confirm-password"
                        placeholder="Confirm Password"
                        style={style.textfield2}
                        lineDirection="center"
                        type="password"
                        onChange={this.confirmPassword.bind(this)}
                    />
                </div>
                <span className="error-message-text">{this.state.confirmPasswordError}</span> */}
                <div className="change-password-save-changes-btn">
                    <FlatButton flat label="Save Changes" className="save-changes-btn" onClick={this.saveChanges.bind(this)} />
                </div>
            </div>
        )
    }
}
