import CMS from "netlify-cms-app";

import HomePreview from "./cms/preview-templates/home";
import PostPreview from "./cms/preview-templates/post";
import AlbumPreview from "./cms/preview-templates/album";
import ServicePreview from "./cms/preview-templates/service";
import FilmPreview from "./cms/preview-templates/film";

CMS.registerPreviewStyle('/index.css');
CMS.registerPreviewTemplate("home", HomePreview);
CMS.registerPreviewTemplate("post", PostPreview);
CMS.registerPreviewTemplate("album", AlbumPreview);
CMS.registerPreviewTemplate("film", FilmPreview);
CMS.registerPreviewTemplate("service", ServicePreview);

CMS.init();
