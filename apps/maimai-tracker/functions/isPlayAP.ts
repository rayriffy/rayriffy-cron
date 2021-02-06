export const isPlayAP = (imageFlags: (string | null)[]): boolean => {
  const acceptUrls = [
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_app.png',
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_ap.png',
  ]

  return imageFlagCompare(imageFlags, acceptUrls)
}
