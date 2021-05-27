import React from "react";
import format from "date-fns/format";

export default class AlbumPreview extends React.Component {
  render() {
    const {entry} = this.props;
    let images = entry.getIn(["data", "images"]);

    const imagesTemplate = images.map(img => {
      const imageUrl = `${window.parent.location.protocol}//${window.parent.location.host}/${img.getIn(['image'])}`;
      return <div className="media-grid-item" style={{backgroundImage: `url(${imageUrl})`}}></div>;
  });

    return <article>
        <h1>{ entry.getIn(["data", "title"])}</h1>
        <div className="metadata light">
          <p>{ format(entry.getIn(["data", "date"]), "YYYY-MM-DD") }</p>
        </div>
        <p>{ entry.getIn(["data", "description"]) }</p>
      <div className="media-grid">
        { imagesTemplate }
      </div>
    </article>;
  }
}