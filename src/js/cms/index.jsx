import CMS from 'netlify-cms-app';

import NSPImage from './nsp-image/index';
import NSPImageList from './nsp-image-list/index';

//import HomePreview from './preview/home';
import PostPreview from './preview/post';
import AlbumPreview from './preview/album';
import ServicePreview from './preview/service';
import FilmPreview from './preview/film';

CMS.registerWidget('nsp-image', NSPImage);
CMS.registerWidget('nsp-image-list', NSPImageList);

CMS.registerPreviewStyle('/index.css');

//CMS.registerPreviewTemplate('home', HomePreview);
CMS.registerPreviewTemplate('post', PostPreview);
CMS.registerPreviewTemplate('album', AlbumPreview);
CMS.registerPreviewTemplate('film', FilmPreview);
CMS.registerPreviewTemplate('service', ServicePreview);

CMS.init();
