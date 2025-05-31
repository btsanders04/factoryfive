import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
  "name": "Factory Five",
  "short_name": "Factory Five",
  "description": "Factory Five Application",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/car-silhouette.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/car-silhouette.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
  };
}
