export const isPlayAP = (imageFlags: (string | null)[]): boolean => {
  const acceptUrls = [
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_app.png',
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_ap.png',
  ]

  return !(
    acceptUrls.map(url => imageFlags.includes(url ?? '')).filter(o => o === true).length === 0
  )
}
