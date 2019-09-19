import React, { Component } from 'react';
import { Drawer, Toolbar, Dialog, Snackbar } from 'react-md'
import keys from '../../models/localStorage-keys'
import store from '../../utility/store'
import storage from '../../utility/encrypt_data'
import IconButton from '../Buttons/icon_button'
import style from '../../utility/style'
import adminLogo from '../../img/harlabh-admin.svg'
import DrawerData from '../DrawerData/drawer_data'
import HomeView from '../HomeView/home_view'
import HelpDialog from '../HelpDialog/help_dialog'
import VerifyDocuments from '../VerifyDocuments/verify_documents'
import ImportData from '../ImportData/import'
import ViewApplication from '../ViewApplication/view_application'
import ApproveBeneficiary from '../ApproveBeneficiary/approve_beneficiary'
import Monetary from '../DisburseBenefit/monetary_dbt'
import NonMonetary from '../DisburseBenefit/non_monetary_home'
import BeneficiaryDetails from '../ApproveBeneficiary/beneficiary_details'
import ViewDocument from '../VerifyDocuments/view_document'
import bootupsettings from '../../models/bootupsettings';
import easygov from '../../utility/network'
import ChangePasswordDialog from '../ChangePasswordDialog/change_password_dialog'
import { ExpansionList } from 'react-md/lib/ExpansionPanels';
import ExpansionPanel from 'react-md/lib/ExpansionPanels/ExpansionPanel';
import ViewDoc from '../VerifyDocuments/view_document'

var enableHome = true, countData = {}
export default class Home extends Component {
	constructor() {
		super();

		this.state = {
			permissions: storage.getItemValue(keys.USER_PREFERENCE.PERMISSIONS),
			visible: false,
			position: 'left',
			dialog: "",
			display: "none",
			service_data: null,
			property: 1,
			view: false,
			newProps: '',
			activity: '',
			applicationsData: [],
			expanded: false,
			changePassword: false,
			toasts: [],
			autohide: true,
			showHome : false,
			check : "",
			import:false,
			info:false
		};
	}
	openDrawerRight = () => {
		this.setState({ visible: true, position: 'right' });
	};

	closeDrawer = () => {
		this.setState({ visible: false });
	};
	openDialog = () => {
		this.setState({ view: true });
	};


	addToast = (text, action, autohide = true) => {
		this.setState((state) => {
			const toasts = state.toasts.slice();
			toasts.push({ text, action });
			return { toasts, autohide };
		});
	};

	dismissToast = () => {
		const [, ...toasts] = this.state.toasts;
		this.setState({ toasts });
	};


	callToast = (val) => {
		this.addToast(val, "CLOSE");
	};

	closeDialog = () => {
		this.setState({ view: false });
	};
	openChangePasswordDialog = () => {
		this.setState({ changePassword: true });
	};

	closeChangePasswordDialog = () => {
		this.setState({ changePassword: false });
	};

	handleVisibility = (visible) => {
		this.setState({ visible });
	};

	componentWillMount() {
		
			this.setState({
				showHome: true,
				import:true,
				info:true
			})

			easygov.send(bootupsettings.ENDPOINTS.STUDENT_INFO,{},"GET_STUDENT_INFO", function (response, component) { })

		// storage.removeItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)
		storage.removeItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE)
		store.subscribe(() => {
			var response = store.getState()

			if (response.type === "CHANGE_PASSWORD") {
				
					this.closeChangePasswordDialog()
					this.callToast("Password changed successfully !!")
				
			}
		})
	}

	_handleClick(val) {
		storage.removeItemValue(keys.USER_PREFERENCE.SCROLL_POSITION)
		storage.removeItemValue(keys.APP_PREFERENCE.PREVIOUS_COUNT)
		storage.removeItemValue(keys.USER_PREFERENCE.SEARCH_QUERY)
		storage.removeItemValue(keys.USER_PREFERENCE.PREVIOUS_PAGE)
		if (val === 5 || val === 6) {

			this.setState({
				newProps: 'monetary-active',
				property: val,
				expanded: true
			})
		}
		else {
			this.setState({
				property: val,
				newProps: '',
			})
		}

		
	}
	handleExpansion() {
		this.setState({
			expanded: !this.state.expanded
		})
	}

	logoutUser() {
		easygov.send(bootupsettings.ENDPOINTS.LOGOUT_USER, "", "LOGOUT_USER", function (response, component) { })
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "LOGOUT_USER") {
				if (response.code === 200) {
					storage.removeCookies()
					storage.removeItemValue(keys.USER_PREFERENCE.PERMISSIONS)
					storage.removeItemValue(keys.USER_PREFERENCE.USER_NAME)
					window.location.href = "/sign-in"
				}
				else if (response.code === 401) {
					storage.setItemValue(keys.APP_PREFERENCE.IS_TOKEN_EXPIRED, "TRUE")
					window.location.href = "/sign-in"
				}
			}
		})
	}
	goToDashboard() {
		window.location.href = "/dashboard/reports"
	}

	render() {
		const { toasts, autohide } = this.state;
		const { visible, position, view, changePassword } = this.state;
		const isRight = position === 'right';
		const closeBtn = <IconButton icon onClick={this.closeDrawer} displayName={isRight ? 'close' : null}></IconButton>;
		let permissionsArray = {
			"ViewDocument" : "data.change_review_documents",
			"ApproveBeneficiary" : "data.change_review_applications",
			"Monetary" : "data.change_verified_applications",
			"NonMonetary" : "data.add_non_monetary_beneficiary",
			"ViewApplication" : "data.add_review_applications",
			"Dashboard" : "data.dashboard_group"
		}
		return (
			<div className="homepage-bg">
				<div className="homepage-drawer">
					<Dialog
						id="signin-modal"
						visible={view}
						title="Help and Support"
						onHide={this.closeDialog}
						style={style.container}
						dialogStyle={style.dialogStyle}
						focusOnMount={false}
					>
						<div className="dialog-close-btn">
							<IconButton icon fixedPosition="tr" onClick={this.closeDialog} displayName='close'></IconButton>
						</div>
						<div>
							<HelpDialog />
						</div>
					</Dialog>
					<Dialog
						id="help-support-modal"
						visible={changePassword}
						title="Change Password"
						onHide={this.closeChangePasswordDialog}
						style={style.container}
						dialogStyle={style.dialogStyle}
						focusOnMount={false}
					>
						<div className="dialog-close-btn">
							<IconButton icon fixedPosition="tr" onClick={this.closeChangePasswordDialog} displayName='close'></IconButton>
						</div>
						<div>
							<ChangePasswordDialog />
						</div>
					</Dialog>
					<div style={{ display: "none" }}>
						<Drawer
							id="homepage-drawer"
							type={Drawer.DrawerTypes.TEMPORARY}
							visible={false}
							position={position}
							overlay
							style={style.drawer}
							clickableDesktopOverlay={true}
							onVisibilityToggle={this.handleVisibility}
							navItems={DrawerData()}
							defaultMedia={'desktop'}
							header={(
								<Toolbar
									nav={isRight ? null : closeBtn}
									actions={
										isRight ?
											<div className="admin-drawer-container">
												<div className="admin-right-panel-drawer">
													<div className="drawer-icon">
														{closeBtn}
													</div>
													<h5 className="recent-activity" > Recent Activity </h5>
													<div className="schedule-icon">
														<IconButton icon displayName="schedule" disabled />
													</div>
												</div>
											</div>
											: null
									}
									className="md-divider-border md-divider-border--bottom"
								/>
							)}
						/>
					</div>
				</div>
				<div className="md-grid">
					<div className="md-cell--3 width20">
						<div className="admin-left-panel-bg">
							<h3 className="harlabh-text">{/*<img src={adminLogo} alt="image" className="admin-logo" />*/} SarayuLabs <span className="admin-text">ADMIN</span></h3>
						</div>
						<div className="admin-left-panel-body">
							{
								this.state.showHome ?
									<div className={`admin-tab-panel ${this.state.property === 1 ? "active" : ""}`} onClick={this._handleClick.bind(this, 1)}>
										<h4 className="admin-tab">Home</h4>
									</div> : null
							}


{this.state.import ?<div className={`admin-tab-panel ${this.state.property === 2 ? "active" : ""}`} onClick={this._handleClick.bind(this, 2)}>
										<h4 className="admin-tab">Import Data</h4>
									</div>: null}

									{this.state.info ?<div className={`admin-tab-panel ${this.state.property === 3 ? "active" : ""}`} onClick={this._handleClick.bind(this, 3)}>
										<h4 className="admin-tab">Student Info</h4>
									</div>: null}
							
						</div>

						

					</div>
					<div className="md-cell--9 width80">
						<div className="admin-right-panel-bg">
							<div className="admin-right-panel-drawer" style={{ display: "none" }}>
								<div className="drawer-icon">
									<IconButton onClick={this.openDrawerRight} icon displayName="menu" />
								</div>
								<h5 className="recent-activity"> Recent Activity </h5>
								<div className="schedule-icon">
									<IconButton icon displayName="schedule" disabled />
								</div>
							</div>
							<div className="admin-greet-name dropdown">
								<div className="admin-greet-text-container">
									<h5 className="admin-greet-text">Hello, &nbsp; <span className="admin-name-text"> {storage.getItemValue(keys.USER_PREFERENCE.USER_NAME)}</span> <i className=" material-icons admin-activity-container">keyboard_arrow_down</i></h5>
									{/* <h6>( {storage.getItemValue(keys.USER_PREFERENCE.ISSUER_DIST)} )</h6> */}
								</div>
								<div className="triangle"></div>
								<div className="dropdown-content">
									{/*<a style={{ display: "none" }}><span className="material-icons" style={{ fontSize: '14px' }}>receipt</span><span className="change-passowrd">User Manual</span></a>
									<a onClick={this.openDialog} ><span className="material-icons" style={{ fontSize: '14px' }}>call</span><span className="change-passowrd">Help/Support</span></a>
									<div className="admin-activity-divider"></div>*/}
									<a onClick={this.openChangePasswordDialog}> <span className="material-icons" style={{ fontSize: '14px' }}>lock</span> <span className="change-passowrd">Change Password</span></a>
									<a onClick={this.logoutUser.bind(this)}><span className="material-icons" style={{ fontSize: '14px' }}>power_settings_new</span><span className="change-passowrd">Log Out</span></a>
								</div>
							</div>
						</div>
						<div>
							{
								this.state.property === 1 ?
									<HomeView /> : this.state.property === 2 ?
										<ImportData /> : null
							}
						</div>
					</div>
				</div>
				<div>
					<Snackbar
						id="app-password-snackbar"
						toasts={toasts}
						primary
						autohide={true}
						onDismiss={this.dismissToast}
					/>
				</div>
			</div>
		)
	}
}
