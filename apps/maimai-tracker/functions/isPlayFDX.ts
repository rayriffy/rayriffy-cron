export const isPlayFDX = (songElement: Element): boolean => {
  const acceptUrl = [
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_fsdp.png',
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_fsd.png',
  ]

  return !(Array.from(songElement.querySelectorAll('img')).map(element => {
    const imageSource = element.getAttribute('src')
    return acceptUrl.includes(imageSource ?? '')
  }).filter(o => o === true).length === 0)
}
