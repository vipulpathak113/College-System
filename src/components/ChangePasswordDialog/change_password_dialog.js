import React from 'react'
import {TextField } from 'react-md/lib';
import { FlatButton } from 'react-md/lib/Buttons';
import network from '../../utility/network'
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
    confirmPassword(val) {
        this.setState({
            confirmPassword: val,
            confirmPasswordError: ""
        })

    }
    saveChanges() {
        if(this.state.oldPassword != "" ){
            if (this.state.newPassword != "" && this.state.confirmPassword != ""){
                if(this.state.newPassword.length >= 6){
                    if(this.state.newPassword === this.state.confirmPassword){
                        let change_password = {
                            current_password: this.state.oldPassword,
                            new_password: this.state.newPassword,
                            confirmPassword: this.state.confirmPassword
                        }
                        network.sendpost(bootupsettings.ENDPOINTS.CHANGE_PASSWORD, change_password, "CHANGE_PASSWORD", function (response, component) { })
                    }
                    else{
                        this.setState({
                            confirmPasswordError : "New Password and Confirm Password doesnot match."
                        })
                    }
                }
                else{
                    this.setState({
                        confirmPasswordError : "New Password must be atleast 6 characters long."
                    })
                }
            }
            else if (this.state.newPassword !== "" && this.state.confirmPassword === ""){
                this.setState({
                    confirmPasswordError : "Confirm Password can't be left blank."
                })
            }
            else{
                this.setState({
                    confirmPasswordError: "New Password can't be left blank."
                })
            }
        }
        else{
            this.setState({
                oldPasswordError : "This field is required"
            })
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
                <div className="change-password-textfield">
                    <TextField
                        id="confirm-password"
                        placeholder="Confirm Password"
                        style={style.textfield2}
                        lineDirection="center"
                        type="password"
                        onChange={this.confirmPassword.bind(this)}
                    />
                </div>
                <span className="error-message-text">{this.state.confirmPasswordError}</span>
                <div className="change-password-save-changes-btn">
                    <FlatButton flat label="Save Changes" className="save-changes-btn" onClick={this.saveChanges.bind(this)} />
                </div>
            </div>
        )
    }
}
