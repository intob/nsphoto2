import * as React from "react";
import * as CMS from "netlify-cms-core";
import { format } from "date-fns";

export default class PostPreview extends React.Component<CMS.PreviewTemplateComponentProps> {
  render() {
    const {entry, widgetFor, getAsset} = this.props;
    //const image = getAsset(entry.getIn(["data", "featured_image"]));

    return (
      <>
        <article>
          <section>
            <h1>{ entry.getIn(["data", "title"])}</h1>
            <div className="metadata light">
              <p>{ format(entry.getIn(["data", "date"]), "yyyy-mm-dd") }</p>
              <p>Read in x minutes</p>
            </div>
            <p>{ entry.getIn(["data", "description"]) }</p>
            
          </section>
          <section>
            { widgetFor("body") }
          </section>
        </article>
      </>
    );
  }
}
