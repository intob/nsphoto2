import * as React from 'react'
import "./styles.css";
import { readFile, processImage } from '../image-util';

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
    const maxWidth = this.props.field.get("max_width");
    const file = event.dataTransfer.files[0];
    this.setState({ progress: 1 });
    readFile(file)
      .then(data => processImage(data, file, this.handleProgress, maxWidth))
      .then(responses => {
        this.handleHideModal();
        this.props.onChange(responses);
        this.setState({ progress: 0 });
      });
  }

  handleFileInput = event => {
    const maxWidth = this.props.field.get("max_width");
    const file = event.target.files[0];
    this.setState({ progress: 1 });
    readFile(file)
      .then(data => processImage(data, file, this.handleProgress, maxWidth))
      .then(responses => {
        this.handleHideModal();
        this.props.onChange(responses);
        this.setState({ progress: 0 });
      });
  }

  handleProgress = (file, newProgress) => {
    this.setState(state => ({
      progress: state.progress + newProgress
    }));
  }

  render() {
    const { value, classNameWidget } = this.props;
    let thumbnail = "";
    if (Array.isArray(value)) {
      thumbnail = value.filter(i => i.indexOf('webp') > -1)[0];
    } else if (value && typeof value === "object") {
      thumbnail = value.toArray().filter(i => i.indexOf('webp') > -1)[0];
    }

    return (
      <>
        <div className={`nsp-image-widget ${classNameWidget}`}>
          <img className="thumbnail" src={thumbnail}/>
          <button onClick={this.handleShowModal}>Choose image</button>
          <button onClick={this.handleRemoveImage} className="danger">Remove image</button>
        </div>
        <div className="nsp-image-modal" hidden={!this.state.modalVisible} onClick={this.handleHideModal}>
          <div id="dropzone" onDragOver={this.handleDropzoneDragOver} onDrop={this.handleDropzoneDrop} onClick={e => e.stopPropagation()}>
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