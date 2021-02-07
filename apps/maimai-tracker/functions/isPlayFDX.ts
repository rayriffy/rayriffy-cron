import { imageFlagCompare } from './imageFlagCompare'

export const isPlayFDX = (imageFlags: (string | null)[]): boolean => {
  const acceptUrls = [
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_fsdp.png',
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_fsd.png',
  ]

  return imageFlagCompare(imageFlags, acceptUrls)
}
