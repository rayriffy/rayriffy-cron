export const isPlayFDX = (imageFlags: (string | null)[]): boolean => {
  const acceptUrl = [
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_fsdp.png',
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_fsd.png',
  ]

  return !(imageFlags.map(flag => {
    return acceptUrl.includes(flag ?? '')
  }).filter(o => o === true).length === 0)
}
