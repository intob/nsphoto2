import * as React from "react";

export default class HomePreview extends React.Component {
  render() {
    const {entry} = this.props;
    let images = entry.getIn(["data", "images"]);
    let clientLogos = entry.getIn(["data", "client_logos"]);

    if (images && !Array.isArray(images)) {
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

    if (clientLogos && !Array.isArray(clientLogos)) {
      clientLogos = clientLogos.toArray();
    }

    const clientLogosTemplate =  clientLogos && clientLogos.map(clientLogo => {
      let iterableClientLogo = clientLogo;
      if (!Array.isArray(clientLogo)) {
        iterableClientLogo = clientLogo.toArray();
      }
      const imageUrl = iterableClientLogo.filter(i => i.indexOf('webp') > -1)[0];
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
      <article className="hero">
        <div className="hero-grid">
          <div className="hero-grid-item title">
            <h1>{entry.getIn(["data", "title"])}</h1>
          </div>
          <div className="hero-grid-item subtitle">
            <h2>{entry.getIn(["data", "subtitle"])}</h2>
          </div>
          <div className="hero-grid-item intro">
            <h3>{entry.getIn(["data", "intro"])}</h3>
          </div>
          <div className="hero-grid-item description">
              <h3>{entry.getIn(["data", "description"])}</h3>
          </div>
          { heroImagesTemplate }
        </div>
      </article>
      <article>
        <section>
          <div className="logo-grid">
            { clientLogosTemplate }
          </div>
        </section>
      </article>
      </>
    );
  }
}