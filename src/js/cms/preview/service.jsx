import * as React from "react";

export default class ServicePreview extends React.Component {
  render() {
    const {entry, getAsset} = this.props;
    let image = getAsset(entry.getIn(["data", "image"]));

    // Bit of a nasty hack to make relative paths work as expected as a background image here
    if (image && !image.fileObj) {
      image.url = window.parent.location.protocol + "//" + window.parent.location.host + image.url;
    }

    return (
      <>
        <h1>Service</h1>
      </>
    );
  }
}
