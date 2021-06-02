import * as React from "react";
import * as CMS from "netlify-cms-core";
import { format } from "date-fns";

export default class AlbumPreview extends React.Component<CMS.PreviewTemplateComponentProps> {
  render() {
    const {entry} = this.props;
    let images = entry.getIn(["data", "images"]);
    let videos = entry.getIn(["data", "videos"]);

    const videosTemplate = videos.map((video: { getIn: (arg0: string[]) => any; }) => {
      const file = video.getIn(["data", "video_file"]);
      const poster = video.getIn(["data", "poster"]);
      const videoUrl = `${window.parent.location.protocol}//${window.parent.location.host}/${file}`;
      return <div className="media-grid-item">
        <video src={videoUrl} poster={poster} controls playsInline /></div>;
    });

    const imagesTemplate = images.map((img: any) => {
      const imageUrl = `${window.parent.location.protocol}//${window.parent.location.host}/${img}`;
      return <div className="media-grid-item" style={{backgroundImage: `url(${imageUrl})`}}></div>;
    });

    return (
      <>
        <article>
          <h1>{ entry.getIn(["data", "title"])}</h1>
          <div className="metadata light">
            <p>{ format(entry.getIn(["data", "date"]), "YYYY-MM-DD") }</p>
          </div>
          <p>{ entry.getIn(["data", "description"]) }</p>
          <div className="media-grid">
            { videosTemplate }
            { imagesTemplate }
          </div>
        </article>
      </>
    );
  }
}