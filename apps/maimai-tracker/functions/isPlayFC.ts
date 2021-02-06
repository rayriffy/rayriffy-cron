export const isPlayFC = (imageFlags: (string | null)[]): boolean => {
  const acceptUrls = [
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_app.png',
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_ap.png',
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_fcp.png',
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_fc.png',
  ]

  return !(
    acceptUrls.map(url => imageFlags.includes(url ?? '')).filter(o => o === true).length === 0
  )
}
