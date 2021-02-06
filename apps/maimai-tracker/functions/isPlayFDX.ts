export const isPlayFDX = (imageFlags: (string | null)[]): boolean => {
  const acceptUrls = [
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_fsdp.png',
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_fsd.png',
  ]

  return !(
    acceptUrls.map(url => imageFlags.includes(url ?? '')).filter(o => o === true).length === 0
  )
}
