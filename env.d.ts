interface ImportMetaEnv {
  readonly SPOTIFY_CLIENT_ID: string;
  readonly SPOTIFY_CLIENT_SECRET: string;
  readonly SPOTIFY_REFRESH_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

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

interface Job {
  company: string;
  logo: string;
  date: string;
  role: string;
  description: string[];
  current?: boolean;
  color: string;
}

type ProjectTechnology =
  | "React.js"
  | "Next.js"
  | "Tailwind CSS"
  | "Flutter"
  | "Dart";

interface Project {
  name: string;
  screenshot: string;
  description: string;
  link: string;
  technologies: ProjectTechnology[];
}
