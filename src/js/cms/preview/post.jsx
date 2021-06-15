import * as React from "react";
import { format } from "date-fns";

export default class PostPreview extends React.Component {
	render() {
		const {entry, widgetFor} = this.props;

		let thumbnail = entry.getIn(["data", "thumbnail"]);
		if (thumbnail && !Array.isArray(thumbnail)) {
			thumbnail = thumbnail.toArray();
		}

		const thumbnailUrl = thumbnail && thumbnail.filter(i => i.indexOf('webp') > -1)[0];

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
						<picture>
							<img src={thumbnailUrl}/>
						</picture>
					</section>
					<section>
						{ widgetFor("body") }
					</section>
				</article>
			</>
		);
	}
}
