import CMS from "netlify-cms-app";

// Import main site styles as a string to inject into the CMS preview pane
import "../css/main.css";

import HomePreview from "./cms-preview-templates/home";
import PostPreview from "./cms-preview-templates/post";
import AlbumPreview from "./cms-preview-templates/album";
import ServicePreview from "./cms-preview-templates/service";

//CMS.registerPreviewStyle(styles, { raw: true });
CMS.registerPreviewTemplate("home", HomePreview);
CMS.registerPreviewTemplate("post", PostPreview);
CMS.registerPreviewTemplate("album", AlbumPreview);
CMS.registerPreviewTemplate("service", ServicePreview);

CMS.init();
