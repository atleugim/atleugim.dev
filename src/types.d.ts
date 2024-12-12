import type { ImageMetadata } from "astro";

// SPOTIFY
export interface SpotifyArtist {
  name: string;
}

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyExternalUrls {
  spotify: string;
}

export interface SpotifyNowPlaying {
  artists: SpotifyArtist[];
  external_urls: SpotifyExternalUrls;
  name: string;
  image?: SpotifyImage;
}

// EXPERIENCE
export interface Job {
  title: string;
  description: string;
  role: string;
  date: string;
  current?: boolean;
  color: string;
  image: ImageMetadata;
}

// PORTFOLIO
export interface Project {
  title: string;
  image: ImageMetadata;
  link: string;
}
