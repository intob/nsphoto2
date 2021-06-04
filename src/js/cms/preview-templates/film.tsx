import * as React from "react";
import * as CMS from "netlify-cms-core";
import { format } from "date-fns";

export default class FilmPreview extends React.Component<CMS.PreviewTemplateComponentProps> {
  render() {
    const {entry} = this.props;
    const youtubeId = entry.getIn(["data", "youtube_id"]);
    const youtubeIframeSrc = `https://www.youtube.com/embed/${youtubeId}?modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&color=white`
    return (
      <>
        <article>
          <div className="media-grid">
            <div className="media-grid-item span span-3-2">
              <h1>{ entry.getIn(["data", "title"])}</h1>
              <div className="metadata light">
                <p>{ format(entry.getIn(["data", "date"]), "yyyy-mm-dd") }</p>
              </div>
              <p>{ entry.getIn(["data", "description"]) }</p>
              <div className="video-container">
                <iframe src={youtubeIframeSrc} width="560" height="315" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
            </div>
          </div>
        </article>
      </>
    );
  }
}