import * as React from 'react'
import "../styles.css";
import "./styles.css";
import { processImage } from '../image';

export default class NSPYoutube extends React.Component {

	constructor(props) {
		super(props);
		this.state = { progress: 0 };
	}

	handleProgress = (fileName, newProgress) => {
		this.setState(state => ({
			progress: state.progress + newProgress
		}));
	}

	getYoutubeThumbnail = id => {
		return fetch(`https://nsphoto-youtube.dr-useless.workers.dev/vi/${id}/maxresdefault.jpg`)
			.then(response => response.arrayBuffer());
	}

	handleChange = event => {
		const id = event.target.value;
		const width = this.props.field.get("thumbnail_width");
		return this.getYoutubeThumbnail(id)
			.then(data => processImage(data, this.handleProgress, undefined, "image/jpeg", width))
			.then(responses => {
				this.props.onChange({id: id, thumbnail: responses});
				this.setState(state => ({progress: 0}));
			});
	}

	render() {
		const { value, classNameWidget } = this.props;

		console.log(value);
		const id = value && (value.id || value.getIn(["id"]) || "");

		let thumbnail = value && (value.thumbnail || value.getIn(["thumbnail"]) || "");
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