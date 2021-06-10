import * as React from "react";

export default class HomePreview extends React.Component {
  render() {
    //const {entry, getAsset} = this.props;
    //let image = getAsset(entry.getIn(["data", "image"]));

    renderHeroItems() {
      return (
        <>
      
      <div class="hero-grid-item">
                  <picture data-super-lazy>
                      {{ $default := "" }}
                      {{ range . }}
                          {{ $mimeType := index (split . ":") 2 }}
                          <source data-srcset="{{ . }}" type="{{ $mimeType }}">
                          {{ if eq $mimeType "image/jpeg" }}
                              {{ $default = . }}
                          {{ end }}
                      {{ end }}
                      <img data-srcset="{{ $default }}" alt="img"/>
                  </picture>
              </div>
    }
    return (
      <>
        <article class="hero-grid">
          <div class="hero-grid-item title">
            <h1>{ entry.getIn(["data", "title"])}</h1>
          </div>
          <div class="hero-grid-item subtitle">
            <h2>{ entry.getIn(["data", "subtitle"])}</h2>
          </div>
          <div class="hero-grid-item intro">
            <h3>{ entry.getIn(["data", "intro"])}</h3>
          </div>
          <div class="hero-grid-item description">
              <h3>{{ .Params.description }}</h3>
          </div>
          {{ range .Params.images }}
              
          {{ end }}
        </article>
        <article>
            {{ partial "media-grid" . }}
            <section>
                {{ partial "latest-posts" . }}
            </section>
            <section>
                {{ partial "logo-grid" . }}
            </section>
        </article>
      </>
    );
  }
}