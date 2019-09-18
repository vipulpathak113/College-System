import React from 'react'
import { Button } from 'react-md/lib'
import language from '../../config/config'

export default class PageNotFound extends React.Component {
	handleClick(){
		window.location.href = '/'
	}
	render() {
		return (
			<div className="page-not-found">
				<div className="page-not-found-image-container">
					<div className="page-not-found-image">
						<img src="" alt="404 not found" />
					</div>
					<div className="heading-page-not-found">
						<h2>
							404
            			</h2>
						<h3>{language.convert['fef006509f5eba0faa59325f9bfe0154']}</h3>
					</div>
					<div className="back-to-home-btn">
						<Button flat label={language.convert['6957b0b6907b778b6f2977584b431bd2']} onClick={this.handleClick.bind(this)}/>
					</div>
				</div>
			</div>
		)
	}
}
