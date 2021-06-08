import * as React from 'react'
import "./styles.css";
import { readFile, processImage } from '../image-util';

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

  handleRemoveImage = image => {
    // find & remove
    //this.props.onChange(null);
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
    const files = event.dataTransfer.files;
    files.forEach(file => {
      readFile(file)
      .then(data => processImage(data, file, this.handleFileProgress, maxWidth))
      .then(responses => {
        this.props.onChange([...this.props.value, ...[{...responses}]]);
        this.setState(state => {
          state.uploads[file.name] = undefined;
        });
      });
    });
    
  }

  handleFileInput = event => {
    const maxWidth = this.props.field.get("max_width");
    const files = event.target.files;
    files.forEach(file => {
      readFile(file)
      .then(data => processImage(data, file, this.handleFileProgress, maxWidth))
      .then(responses => {
        this.props.onChange([...this.props.value, ...[{...responses}]]);
        this.setState(state => {
          state.uploads[file.name] = undefined;
        });
      });
    });
  }

  handleFileProgress = (file, newProgress) => {
    this.setState(state => state.uploads[file.name].progress = state.uploads[file.name].progress + newProgress);
  }

  renderUploadList = () => {
    let uploadList;
    for (const [fileName, progress] of Object.entries(this.state.uploads)) {
      uploadList += <><div>{fileName}: {progress}</div></>;
    }
    return uploadList;
  }

  renderImageList = () => {
    //let imageList;
    //console.log(this.props.value);
    return <><div className="image-list"><div>One image</div></div></>;
  }

  render() {
    const { value, classNameWidget } = this.props;

    console.log(value);

    return (
      <>
        <div className={`nsp-image-list-widget ${classNameWidget}`}>
          <button onClick={this.handleShowModal}>Add images</button>
          { this.renderImageList() }
        </div>
        <div className="nsp-image-modal" hidden={!this.state.modalVisible} onClick={this.handleHideModal}>
          <div id="dropzone" onDragOver={this.handleDropzoneDragOver} onDrop={this.handleDropzoneDrop} onClick={e => e.stopPropagation()}>
            <label className="upload">
                <input type="file" onInput={this.handleFileInput}/>
                {this.state.progress > 0 ? `${this.state.progress}%` : "Select a file, or drop here"}
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