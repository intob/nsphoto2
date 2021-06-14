import * as React from 'react'
import "../styles.css";
import "./styles.css";
import { readFile, processImage } from '../image';

export default class NSPImage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { modalVisible: false, progress: 0 };
  }

  handleShowModal = () => {
    this.setState({ modalVisible: true });
  };

  handleHideModal = () => {
    this.setState({ modalVisible: false });
  };

  handleRemoveImage = () => {
    this.props.onChange(null);
  }

  handleDropzoneDragOver = event => {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy"
  }

  handleDropzoneDrop = event => {
    event.stopPropagation();
    event.preventDefault();
    addFile(event.dataTransfer.files[0]);
  }

  handleFileInput = event => {
    this.addFile(event.target.files[0]);
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

  render() {
    const { value, classNameWidget } = this.props;
    let thumbnail = "";
    if (Array.isArray(value)) {
      thumbnail = value.filter(i => i.indexOf('webp') > -1)[0];
    } else if (typeof value === "object") {
      thumbnail = value.toArray().filter(i => i.indexOf('webp') > -1)[0];
    }

    return (
      <>
        <div className={`nsp-widget ${classNameWidget}`}>
          <img className="thumbnail" src={thumbnail}/>
          <button onClick={this.handleShowModal}>Choose image</button>
          <button onClick={this.handleRemoveImage} className="danger">Remove image</button>
        </div>
        <div className="nsp-modal" hidden={!this.state.modalVisible} onClick={this.handleHideModal}>
          <div className="dropzone" onDragOver={this.handleDropzoneDragOver} onDrop={this.handleDropzoneDrop} onClick={e => e.stopPropagation()}>
            <label className="upload">
                <input type="file" onInput={this.handleFileInput}/>
                {this.state.progress > 0 ? `${this.state.progress}%` : "Select a file, or drop here"}
            </label>
          </div>
        </div>
      </>
    );
  }
}