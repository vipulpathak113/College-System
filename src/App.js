import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Snackbar } from 'react-md/lib';
import Home from './components/Homepage/home';
import Signin from './components/Signin/sign_in';
import store from './utility/store';
import language from './config/config'
import storage from './utility/encrypt_data'
import keys from './models/localStorage-keys'
import Navbar from './components/GovtDashboard/navbar_harlabh'
import Reports from './components/GovtDashboard/reports'
import Compare from './components/GovtDashboard/compare'
import ErrorPage from './components/PageNotFound/page_not_found'

class App extends Component {
	state = {
		permissions: [],
		showLoader: false,
		show_file_loader: false,
		file_loader_class: "c100 p0 blue",
		percentage: 0,
		toasts: [],
		autohide: true
	}

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


	callToast = () => {
		this.addToast(language.convert['a5a96a6c64e954e6f6bbfb08eedefaa1'], "CLOSE");
	};

	componentDidMount() {
		if (storage.getItemValue(keys.USER_PREFERENCE.PERMISSIONS)) {
			this.setState({
				permissions: storage.getItemValue(keys.USER_PREFERENCE.PERMISSIONS)
			})
		}
		store.subscribe(() => {
			var response = store.getState()
			if (response.type === "API_CALL") {
				this.setState({
					showLoader: response.value
				})
			}
			else if (response.type === "RESPONSE_FAILED") {
				this.setState({
					showLoader: false
				})
				this.callToast()
			}
		})
	}


	render() {
		const { toasts, autohide } = this.state;
		return (
			<div>
				{
					this.state.showLoader ?
						<div id="overlay">
							<div id="preloader">
								<div id="loader">
								</div>
							</div>
						</div> : null
				}
				<Route
					render={({ location }) => (
						<Switch key={location.key}>
							<Route exact path="/" component={Signin} />
							{
								this.state.permissions.includes("data.dashboard_group") ?
									<Route path="/dashboard/reports" component={Reports} /> : null
							}
							{/* {
								this.state.permissions.includes("data.dashboard_group") ?
									<Route path="/dashboard/compare" component={Compare} /> : null
							} */}

							<Route path="/dashboard" component={Home} />
							<Route path="/sign-in" component={Signin} />
						</Switch>
					)}
				/>
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
		);
	}
}
export default App;
