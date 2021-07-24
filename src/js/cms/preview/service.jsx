import * as React from "react";
import { flushSync } from 'react-dom';

export default class ServicePreview extends React.Component {
	render() {
		const {entry, widgetFor} = this.props;

		let thumbnail = entry.getIn(["data", "thumbnail"]);
		if (thumbnail && !Array.isArray(thumbnail)) {
			thumbnail = thumbnail.toArray();
		}
		const thumbnailUrl = thumbnail && thumbnail.filter(i => i.indexOf('webp') > -1)[0];

		let pkg = entry.getIn(["data", "packages"]);

		if (pkg && !Array.isArray(pkg)) {
			pkg = pkg.toArray();
		}

		console.log(pkg);

		const packagesTemplate = pkg && pkg.map(p => {
			let features = p.getIn(["features"]);

			if (features && !Array.isArray(features)) {
				features = features.toArray();
			}

			const featuresTemplate = features && features.map(f => {
				return (
					<>
						<li>
							<h4>{ f.getIn(["name"]) }</h4>
							<div class="price">{ f.getIn(["price"]) }</div>
							<p>{ f.getIn(["description"]) }</p>
						</li>
					</>
				);
			});

			return (
				<>
					<li>
						<header>
							<h3>{ p.getIn(["name"]) }</h3>
							<h3 className="price">{ p.getIn(["price"]) }.- CHF</h3>
						</header>
						<p>{ p.getIn(["description"]) }</p>
						<ul>
							{ featuresTemplate }
						</ul>
					</li>
				</>
			);
		});
		
		return (
			<>
				<article>
					<section className="limit-width">
						<h1>{ entry.getIn(["data", "title"])}</h1>
						<p>{ entry.getIn(["data", "description"]) }</p>
						<picture>
							<img src={thumbnailUrl}/>
						</picture>
						{ widgetFor("body") }
					</section>
					<section className="limit-width packages">
						<h2>Packages</h2>
						<ul>
							{ packagesTemplate }
						</ul>
					</section>
				</article>
			</>
		);
	}
}
