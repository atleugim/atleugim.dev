import type { SpotifyImage } from "../types";

export const joinArray = (array: Array<any>, locale = "en"): string => {
  const formatter = new Intl.ListFormat(locale, {
    style: "long",
    type: "conjunction",
  });
  return formatter.format(array);
};

export const getSmallestImage = (
  images: Array<SpotifyImage>
): SpotifyImage | undefined => {
  if (!images || images.length === 0) return undefined;

  return images.reduce((smallest, image) => {
    return smallest.width * smallest.height < image.width * image.height
      ? smallest
      : image;
  }, images[0]);
};
