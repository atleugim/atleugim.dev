export const joinArray = (array: Array<any>, locale = "en"): string => {
  const formatter = new Intl.ListFormat(locale, {
    style: "long",
    type: "conjunction",
  });
  return formatter.format(array);
};

export const getSmallestImage = (
  images: Array<SpotifyImage>,
): SpotifyImage | undefined => {
  if (!images || images.length === 0) return;

  return images.reduce((smallest, image) => {
    return smallest.width * smallest.height < image.width * image.height
      ? smallest
      : image;
  }, images[0]);
};

export const formatDate = (date: Date, locale = "en-US"): string => {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
};

export const getReadingTime = (body: string): string => {
  const words = body.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
};
