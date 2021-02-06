import { imageFlagCompare } from './imageFlagCompare'

export const isPlaySSS = (imageFlags: (string | null)[]): boolean => {
  const acceptUrls = [
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_sssp.png',
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_sss.png',
  ]

  return imageFlagCompare(imageFlags, acceptUrls)
}
