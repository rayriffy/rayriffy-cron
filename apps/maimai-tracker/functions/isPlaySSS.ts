export const isPlaySSS = (imageFlags: (string | null)[]): boolean => {
  const acceptUrl = [
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_sssp.png',
    'https://maimaidx-eng.com/maimai-mobile/img/music_icon_sss.png',
  ]

  return !(
    imageFlags
      .map(flag => {
        return acceptUrl.includes(flag ?? '')
      })
      .filter(o => o === true).length === 0
  )
}
