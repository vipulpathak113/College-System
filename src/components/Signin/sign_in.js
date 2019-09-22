import React, { Component } from 'react';
import {TextField, Checkbox, Dialog } from 'react-md'
import keys from '../../models/localStorage-keys'
import logo from '../../img/tnp-logo.png'
import _ from 'lodash';
import storage from '../../utility/encrypt_data'
import FlatButton from '../Buttons/flat_button'
import store from '../../utility/store'
import bootupsettings from '../../models/bootupsettings';
import network from '../../utility/network'
import IconButton from '../Buttons/icon_button'
import HelpDialog from '../HelpDialog/help_dialog'

var userIdValue = "", passwordValue = ""
export default class Signin extends Component {
	constructor() {
		super();
		this.state = {
			visible: false,
			loginErrorMessage: ""
		}

		this.state = {
		};
	}


	closeDialog = () => {
		this.setState({ visible: false });
	};

	getUserId(val) {
		userIdValue = val
	}

	getPassword(val) {
		passwordValue = val;
	}
	searchApplicationsOnEnter(e){
		if(e.key === "Enter"){
			this.callSigninApi()
		}
	}
	openForgetPassword() {
		this.setState({
			visible: true
		})
	}

	componentWillMount() {
		if (storage.getItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED)) {
			this.setState({
				loginErrorMessage: "Your current session expired, Please login again to continue."
			})
		}
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "SIGNIN") {
					storage.setCookies(keys.USER_PREFERENCE.TOKEN, response.auth_token)
					storage.setCookies(keys.USER_PREFERENCE.EMAIL, userIdValue)
					storage.setCookies(keys.USER_PREFERENCE.PASSWORD, passwordValue)
					storage.setCookies(keys.USER_PREFERENCE.USER_NAME, response.first_name)

					// debugger;
					storage.removeItemValue(keys.USER_PREFERENCE.IS_TOKEN_EXPIRED)
					window.history.replaceState({}, window.location.href, "/dashboard");
					window.location.href = "/dashboard"
				}
				else if (response.errors) {
					window.alert("Either username or password is incorrect.")
			}
		})
	}

	callSigninApi() {
		if (userIdValue !== "" && passwordValue !== "") {
			network.sendLogin(bootupsettings.ENDPOINTS.SIGNIN, { "email": userIdValue, "password": passwordValue }, "SIGNIN")
		}
		else if (userIdValue === "" && passwordValue !== "") {
			window.alert("Username is required")
		}
		else if (passwordValue === "" && userIdValue !== "") {
			window.alert("Password is required.")
		}
		else {
			window.alert("Username and Password can't be left blank.")
		}
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "SIGNIN") {
				console.log(userIdValue)
					storage.setCookies(keys.USER_PREFERENCE.TOKEN, response.auth_token)
					storage.setCookies(keys.USER_PREFERENCE.EMAIL, userIdValue)
					storage.setCookies(keys.USER_PREFERENCE.PASSWORD, passwordValue)
					storage.removeItemValue(keys.USER_PREFERENCE.IS_TOKEN_EXPIRED)
					storage.setCookies(keys.USER_PREFERENCE.USER_NAME, response.first_name)
					window.location.href = "/dashboard"
			}
		})
	}

	render() {
		const { visible } = this.state
		window._ = _
		var style = {
			textfield1: {
				width: '255px',
				fontFamily: 'Montserrat',
				height: '45px',
				backgroundColor: 'white',
				borderRadius: '1px',
				margin: "0 auto",
				borderTop: "1px solid #cccccc",
				borderRight: "1px solid #cccccc"
			},
			textfield2: {
				width: '255px',
				fontFamily: 'Montserrat',
				height: '45px',
				backgroundColor: 'white',
				borderRadius: '1px',
				margin: "0 auto",
				border: "1px solid #cccccc",
				borderLeft: "0px",
				textAlign : 'left'
			},
			button: {
				width: "300px",
				height: "45px",
				backgroundColor: "#1951AF",
				color: "white",
				fontSize: "16px",
				borderRadius: "4px"
			}
		}
		return (
			<div className="signin-container">
				<Dialog
					id="signin-modal"
					visible={visible}
					title="Help and Support"
					onHide={this.closeDialog}
					style={style.container}
					dialogStyle={style.modalStyle}
					focusOnMount={false}
				>
					<div className="dialog-close-btn">
						<IconButton icon fixedPosition="tr" onClick={this.closeDialog} displayName='close'> </IconButton>
					</div>
					<div>
						<HelpDialog/>
					</div>
				</Dialog>
				<div className="signin-panel">
					<div className="login-error-message">
						{
							window.location.href === "/sign-in" ?
								this.state.loginErrorMessage : null
						}
					</div>
					<img src={logo} className="home-logo" alt="" /><h1 className="home-title">T&P Crew  <span className="heading-admin-title"> ADMIN</span></h1>
					<div className="signin-textfield">
						<div className="userid-textfield-area">
							<div className="userid-icon">
								<i className="material-icons userid-icon-property">perm_identity</i>
							</div>
							<div className="userid-textfield">
								<TextField
									id="signin"
									placeholder="User Id"
									style={style.textfield1}
									lineDirection="center"
									type="text"
									onChange={this.getUserId.bind(this)}
								/>
							</div>
						</div>
						<div className="userid-textfield-area">
							<div className="password-icon">
								<i className="material-icons userid-icon-property">lock_outline</i>
							</div>
							<div className="userid-textfield">
								<TextField
									id="password"
									placeholder="Password"
									style={style.textfield2}
									lineDirection="center"
									type="password"
									onKeyPress={this.searchApplicationsOnEnter.bind(this)}
									onChange={this.getPassword.bind(this)}
								/>
							</div>
						</div>
					</div>
					<div className="signin-button">
						<FlatButton
							label="Login"
							style={style.button}
							flat
							onClick={this.callSigninApi.bind(this)}
						/>
					</div>
					<div className="signin-bottom-link">
						<div className="signin-remember-password">
							<Checkbox id="remember-me" label="Remember Me" />
						</div>
						<div className="signin-forget-password">
							<h5 style={{ cursor: "pointer" }} onClick={this.openForgetPassword.bind(this)}>Forget Password?</h5>
						</div>
					</div>
					{/*<div className="statement-bottom">
						<h4></h4>
					</div>*/}
				</div>
			</div>
		);
	}
}
