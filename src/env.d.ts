interface ImportMetaEnv {
  readonly SPOTIFY_CLIENT_ID: string;
  readonly SPOTIFY_CLIENT_SECRET: string;
  readonly SPOTIFY_REFRESH_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// SPOTIFY
interface SpotifyArtist {
  name: string;
}

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyExternalUrls {
  spotify: string;
}

interface SpotifyNowPlaying {
  artists: SpotifyArtist[];
  external_urls: SpotifyExternalUrls;
  name: string;
  image?: SpotifyImage;
}

// EXPERIENCE
interface Job {
  title: string;
  description: string;
  role: string;
  date: string;
  current?: boolean;
  color: string;
  image: ImageMetadata;
}

// PORTFOLIO
interface Project {
  title: string;
  image: ImageMetadata;
  link: string;
}
