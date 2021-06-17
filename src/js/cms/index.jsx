import CMS from 'netlify-cms-app';

import NSPImage from './nsp-image';
import NSPImageList from './nsp-image-list';
import NSPYoutube from './nsp-youtube';

import HomePreview from './preview/home';
import PostPreview from './preview/post';
import AlbumPreview from './preview/album';
import ServicePreview from './preview/service';
import FilmPreview from './preview/film';

CMS.registerWidget('nsp-image', NSPImage);
CMS.registerWidget('nsp-image-list', NSPImageList);
CMS.registerWidget('nsp-youtube', NSPYoutube);

CMS.registerPreviewStyle('/index.css');
CMS.registerPreviewStyle('/hero.css');
CMS.registerPreviewStyle('/cms-preview-styles.css');

CMS.registerPreviewTemplate('home_en', HomePreview);
CMS.registerPreviewTemplate('home_de', HomePreview);
CMS.registerPreviewTemplate('post', PostPreview);
CMS.registerPreviewTemplate('album', AlbumPreview);
CMS.registerPreviewTemplate('film', FilmPreview);
CMS.registerPreviewTemplate('service', ServicePreview);

CMS.init();
