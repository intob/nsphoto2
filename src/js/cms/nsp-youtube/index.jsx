import * as React from 'react'
import "../styles.css";
import "./styles.css";
import { processImage } from '../image';

export default class NSPYoutube extends React.Component {

	constructor(props) {
		super(props);
		this.state = { progress: 0 };
	}

	handleProgress = (file, newProgress) => {
		this.setState(state => ({
			progress: state.progress + newProgress
		}));
	}

	addFile = file => {
		const width = this.props.field.get("width");
		const height = this.props.field.get("height");
		const fit = this.props.field.get("fit");
		const quality = this.props.field.get("quality");
		this.setState({ progress: 1 });
		readFile(file)
			.then(data => processImage(data, file, this.handleProgress, width, height, fit, quality))
			.then(responses => {
				this.handleHideModal();
				this.props.onChange(responses);
				this.setState({ progress: 0 });
			});
	}

	handleChange = event => {
		this.props.onChange({id: event.target.value});
	}

	render() {
		const { value, classNameWidget } = this.props;

		console.log(value);
		const id = value && (value.id || value.getIn(["id"]) || "");

		let thumbnail = ""
		if (Array.isArray(thumbnail)) {
			thumbnail = thumbnail.filter(i => i.indexOf('webp') > -1)[0];
		} else if (typeof thumbnail === "object") {
			thumbnail = thumbnail.toArray().filter(i => i.indexOf('webp') > -1)[0];
		}

		return (
			<>
				<div className={`nsp-widget ${classNameWidget}`}>
					<fieldset>
						<label>Youtube ID</label>
						<input type="text" onChange={this.handleChange} value={id}/>
					</fieldset>
					<div className="progress">{this.state.progress}</div>
					<img className="thumbnail" src={thumbnail}/>
				</div>
			</>
		);
	}
}