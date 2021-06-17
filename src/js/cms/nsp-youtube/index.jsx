import * as React from 'react'
import "../styles.css";
import "./styles.css";
import { processImage } from '../image';

export default class NSPYoutube extends React.Component {

	constructor(props) {
		super(props);
		this.state = { progress: 0, id: this.getStoredId() };
	}

	handleInputChange = event => {
		this.setState(() => ({id: event.target.value}));
	}

	handleProgress = (fileName, newProgress) => {
		this.setState(state => ({progress: state.progress + newProgress}));
	}

	getYoutubeThumbnail = id => {
		return fetch(`https://nsphoto-youtube.dr-useless.workers.dev/vi/${id}/maxresdefault.jpg`)
			.then(response => response.arrayBuffer());
	}

	loadThumbnail = () => {
		const width = this.props.field.get("thumbnail_width");
		this.setState(() => ({progess: 5}));
		return this.getYoutubeThumbnail(this.state.id)
			.then(data => processImage(data, this.handleProgress, undefined, "image/jpeg", width))
			.then(responses => {
				this.props.onChange({id: this.state.id, thumbnail: responses});
				this.setState(() => ({progress: 0}));
			});
	}

	getStoredId = () => {
		const value = this.props.value;
		return value && (value.id || value.getIn(["id"]) || "");
	}

	render() {
		const { value, classNameWidget } = this.props;

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
						<input type="text" id="youtube-id" value={this.state.id} onChange={this.handleInputChange}/>
						<button onClick={this.loadThumbnail} disabled={this.getStoredId() === this.state.id}>Load thumbnail</button>
						<div className="progress" hidden={this.state.progress === 0}>{this.state.progress > 0 ? `${this.state.progress}%` : ""}</div>
					</fieldset>
					<img className="thumbnail" src={thumbnail}/>
				</div>
			</>
		);
	}
}