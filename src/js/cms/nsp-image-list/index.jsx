import * as React from 'react';
import "../styles.css";
import "./styles.css";
import { readFile, processImage } from '../image';

export default class NSPImageList extends React.Component {

	constructor(props) {
		super(props);
		this.state = { modalVisible: false, uploads: {} };
	}

	handleShowModal = () => {
		this.setState({ modalVisible: true });
	};

	handleHideModal = () => {
		this.setState({ modalVisible: false });
	};

	handleRemoveImageItem = imageItem => {
		const { value, onChange } = this.props;
		const newValue = value.filter(i => i !== imageItem);
		onChange(newValue);
	}

	handleDropzoneDragOver = event => {
		event.stopPropagation();
		event.preventDefault();
		event.dataTransfer.dropEffect = "copy"
	}

	handleDropzoneDrop = event => {
		event.stopPropagation();
		event.preventDefault();
		this.addFiles(event.dataTransfer.files);
	}

	handleFileInput = event => {
		this.addFiles(event.target.files);
	}

	addFiles = files => {
		const width = this.props.field.get("width");
		const height = this.props.field.get("height");
		const fit = this.props.field.get("fit");
		const quality = this.props.field.get("quality");
		const promises = [];
		[].forEach.call(files, file => {
			if (!this.state.uploads[file.name]) {
				this.setState(state => {
					state.uploads[file.name] = { progress: 0 };
				});
				const promise = readFile(file)
				.then(data => processImage(data, this.handleFileProgress, file.name, file.type, width, height, fit, quality))
				.then(responses => {
					this.setState(state => {
						state.uploads[file.name] = undefined;
					});
					this.props.onChange([...this.props.value||[], [...responses]]);
					return responses;
				});
				promises.push(promise);
			}
		});
		return Promise.all(promises).then(() => {
			this.setState({ modalVisible: false, uploads: []});
		});
	}

	handleFileProgress = (fileName, newProgress) => {
		this.setState(state => state.uploads[fileName].progress = state.uploads[fileName].progress + newProgress);
	}

	isValid = () => {
		const validCount = this.props.field.get("count");
		if (!validCount) {
			return true;
		}
		return this.getCount() === validCount;
	}

	getCount = () => {
		if (!this.props.value) {
			return 0;
		}
		if (Array.isArray(this.props.value)) {
			return this.props.value.length;
		} else {
			return this.props.value.toArray().length;
		}
	}

	renderUploadList = () => {
		const uploadList = [];
		for (const [fileName, value] of Object.entries(this.state.uploads)) {
			if (fileName && value && value.progress) {
				uploadList.push(<><div>{`${fileName}: ${value.progress}`}</div></>);
			}
		}
		return uploadList;
	}

	renderImageItems = () => {
		const { value } = this.props;
		const imageItems = [];

		let iterableValue = [];
		if (Array.isArray(value)) {
			iterableValue = value;
		} else {
			try {
				iterableValue = value.toArray();
			} catch {
			}
		}

		iterableValue.forEach(imageItem => {
			let iterableImageItem;
			if (Array.isArray(imageItem)) {
				iterableImageItem = imageItem;
			} else {
				iterableImageItem = imageItem.toArray();
			}

			imageItems.push(
				<>
					<div className="image-item">
						<img src={iterableImageItem.filter(i => i.indexOf('webp') > -1)[0]}/>
						<div className="remove" onClick={() => this.handleRemoveImageItem(imageItem)}>❌</div>
					</div>
				</>
			);
		});

		return imageItems;
	}

	render() {
		const { classNameWidget, field } = this.props;
		const validCount = field.get("count");
		return (
			<>
				<div className={`nsp-widget ${classNameWidget}`}>
					<button onClick={this.handleShowModal}>Add images</button>
					<div className="image-count">Count: {this.getCount()} {validCount ? ` / ${validCount}` : ""}</div>
					<div className="image-list">
						{ this.renderImageItems() }
					</div>
				</div>
				<div className="nsp-modal" hidden={!this.state.modalVisible} onClick={this.handleHideModal}>
					<div className="dropzone" onDragOver={this.handleDropzoneDragOver} onDrop={this.handleDropzoneDrop} onClick={e => e.stopPropagation()}>
						<label className="upload" hidden={this.state.uploads && Object.entries(this.state.uploads).length > 0}>
								<input type="file" onInput={this.handleFileInput}/>
								Select a file, or drop here
						</label>
						<div className="upload-list">
							{ this.renderUploadList() }
						</div>
					</div>
				</div>
			</>
		);
	}
}