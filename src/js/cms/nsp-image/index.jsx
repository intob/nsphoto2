import * as React from 'react'
import "./styles.css";
import { readFile, processImage } from './upload';

export default class NSPImage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { modalVisible: false, preview: null };
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
    this.handleHideModal();
    const maxWidth = this.props.field.get("max_width");
    const file = event.target.files[0];
    readFile(file)
      .then(data => processImage(data, file.type, maxWidth))
      .then(responses => {
        this.props.onChange(responses);
      });
  }

  handleFileInput = event => {
    this.handleHideModal();
    const maxWidth = this.props.field.get("max_width");
    const file = event.target.files[0];
    readFile(file)
      .then(data => processImage(data, file.type, maxWidth))
      .then(responses => {
        this.props.onChange(responses);
      });
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
                Select a file, or drop here
            </label>
          </div>
        </div>
      </>
    );
  }
}