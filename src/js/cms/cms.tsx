import CMS from "netlify-cms-app";

import NSPhotoMediaStore from './nsphoto-media-store';

import HomePreview from "./preview-templates/home";
import PostPreview from "./preview-templates/post";
import AlbumPreview from "./preview-templates/album";
import ServicePreview from "./preview-templates/service";
import FilmPreview from "./preview-templates/film";

CMS.registerMediaLibrary(NSPhotoMediaStore);

CMS.registerPreviewStyle('/index.css');

CMS.registerPreviewTemplate("home", HomePreview);
CMS.registerPreviewTemplate("post", PostPreview);
CMS.registerPreviewTemplate("album", AlbumPreview);
CMS.registerPreviewTemplate("film", FilmPreview);
CMS.registerPreviewTemplate("service", ServicePreview);

CMS.init();
