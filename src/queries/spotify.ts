import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_NOW_PLAYING_ENDPOINT,
  SPOTIFY_REFRESH_TOKEN,
  SPOTIFY_TOKEN_ENDPOINT,
} from "../utils/constants";

import type { SpotifyNowPlaying } from "../types";
import { getSmallestImage } from "../utils";

const getAccessToken = async (): Promise<{
  access_token: string;
}> => {
  const basic = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const params = new URLSearchParams([
    ["grant_type", "refresh_token"],
    ["refresh_token", SPOTIFY_REFRESH_TOKEN],
  ]);

  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  return response.json();
};

export const getNowPlaying = async (): Promise<
  SpotifyNowPlaying | undefined
> => {
  try {
    const { access_token } = await getAccessToken();

    if (!access_token) {
      throw new Error("No access token");
    }

    const response = await fetch(SPOTIFY_NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const res = await response.json();

    return {
      artists: res.item.artists,
      external_urls: res.item.external_urls,
      name: res.item.name,
      image: getSmallestImage(res.item.album.images),
    };
  } catch (err) {
    return undefined;
  }
};
