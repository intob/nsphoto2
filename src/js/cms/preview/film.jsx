import * as React from "react";
import { format } from "date-fns";

export default class FilmPreview extends React.Component {
	render() {
		const {entry} = this.props;
		const youtubeId = entry.getIn(["data", "youtube_video", "id"]);
		const youtubeIframeSrc = `https://www.youtube.com/embed/${youtubeId}?modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&color=white`
		
		let tags = entry.getIn(["data", "tags"]) || [];

		if (!Array.isArray(tags)) {
			tags = tags.toArray();
		}

		const tagsTemplate = tags.map(t => <><span>{t}</span></>);
		
		return (
			<>
				<article>
					<section className="limit-width">
						<div className="video-container">
							<iframe src={youtubeIframeSrc} width="560" height="315" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
						</div>
						<h1>{ entry.getIn(["data", "title"])}</h1>
						<div className="metadata light">
							<p>{ format(entry.getIn(["data", "date"]), "yyyy-mm-dd") }</p>
							<p className="tags">{tagsTemplate}</p>
						</div>
						<p>{ entry.getIn(["data", "description"]) }</p>
					</section>
				</article>
			</>
		);
	}
}