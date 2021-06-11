import * as React from "react";

export default class HomePreview extends React.Component {
  render() {
    const {entry, getAsset} = this.props;
    let images = getAsset(entry.getIn(["data", "images"]));
    let clientLogos = getAsset(entry.getIn(["data", "client_logos"]));

    if (!Array.isArray(images)) {
      images = images.toArray();
    }

    const heroImagesTemplate = images && images.map(img => {
      let iterableImg = img;
      if (!Array.isArray(img)) {
        iterableImg = img.toArray();
      }
      const imageUrl = iterableImg.filter(i => i.indexOf('webp') > -1)[0];
      return (
      <>
        <div className="hero-grid-item">
          <picture>
            <img src={imageUrl}/>
          </picture>
        </div>
      </>
      );
    });

    if (!Array.isArray(clients)) {
      clients = clients.toArray();
    }

    const clientLogosTemplate =  clientLogos && clientLogos.map(clientLogo => {
      return (
        <>
          <div className="logo-grid-item">
            <picture>
              <img src={imageUrl}/>
            </picture>
          </div>
        </>
        );
    });

    return (
      <>
      <article class="hero-grid">
        <div class="hero-grid-item title">
          <h1>{entry.getIn(["data", "title"])}</h1>
        </div>
        <div class="hero-grid-item subtitle">
          <h2>{entry.getIn(["data", "subtitle"])}</h2>
        </div>
        <div class="hero-grid-item intro">
          <h3>{entry.getIn(["data", "intro"])}</h3>
        </div>
        <div class="hero-grid-item description">
            <h3>{entry.getIn(["data", "description"])}</h3>
        </div>
        { heroImagesTemplate }
      </article>
      <article>
        <section>
          <div class="logo-grid">
            { clientLogosTemplate }
          </div>
        </section>
      </article>
      </>
    );
  }
}