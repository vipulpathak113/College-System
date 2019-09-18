import React, { Component } from 'react';
import style from './style'
import { SelectField, Radio, DatePicker } from 'react-md/lib'
import language from '../config/config'

class RadioInline extends Component {
	constructor(props) {
		super();
		this.state = {
			checked: null,
			questions: ""
		}
	}

	handleChange(obj, quesId) {
		this.setState({ checked: obj })
	}

	render() {
		let options = this.props.config.options;
		let quesId = this.props.quesId
		return (
			<div>{
				options.map((item, i) => {
					let id = new Date();
					id = item + quesId + i
					return (
						<Radio
							inline
							id={id}
							required={true}
							name={quesId}
							value={item}
							label={item}
							checked={this.state.checked === item}
							onChange={this.handleChange.bind(this, item, quesId)}
						/>
					)
				})
			}
			</div>
		)
	}
}

var parse_response = {
	InputComponent(props) {
		let opts = props.config.input;
		let type = opts.type;
		let quesId = props.config.field_id
		let inputField = null;
		let errorId = props.errorId
		let divId = props.divId

		switch (type) {
			case 'boolean':
				inputField = <RadioInline
					config={opts}
					required={true}
					quesId={quesId}
					required={true}
				/>
				break;

			case 'options':
				inputField = <SelectField
					id={quesId}
					placeholder={language.convert["d412d576defdad339d6c7f90d3b9d47a"]}
					menuItems={opts.options}
					required={true}
					position={SelectField.Positions.BELOW}
					className="question-selectfield"
					style={style.parseResponse.SelectField}
					listStyle={style.parseResponse.listStyle}
					defaultValue=""
				/>
				break;

			case 'year_difference':
				inputField = <DatePicker
					id={quesId}
					lineDirection="center"
					required={true}
      				locales="en-US"
					autoOk
					style={style.parseResponse.date}
					display="portrait"
					maxDate={new Date()}
				/>
				break;

			case 'bounds':
				inputField = <input
					type="text"
					id={quesId}
					name={quesId}
					required
					style={style.parseResponse.inputField}
					size={20}
				/>
				break;
		}
		return (
			<div>
				<div id={divId}>
					{inputField}
				</div>
				<span id={errorId} className="question-card-error"></span>
			</div>
		)
	}
}

export default parse_response;
