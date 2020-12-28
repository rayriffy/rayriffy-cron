export const isPlayFC = (songElement: Element): boolean => {
  const acceptUrl = [
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_app.png',
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_ap.png',
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_fcp.png',
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_fc.png',
  ]

  return !(Array.from(songElement.querySelectorAll('img')).map(element => {
    const imageSource = element.getAttribute('src')
    return acceptUrl.includes(imageSource ?? '')
  }).filter(o => o === true).length === 0)
}
