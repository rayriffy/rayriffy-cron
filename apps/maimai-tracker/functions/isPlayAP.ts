export const isPlayAP = (imageFlags: (string | null)[]): boolean => {
  const acceptUrl = [
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_app.png',
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_ap.png',
  ]

  return !(imageFlags.map(flag => {
    return acceptUrl.includes(flag ?? '')
  }).filter(o => o === true).length === 0)
}
