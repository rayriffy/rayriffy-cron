export const imageFlagCompare = (
  imageFlags: (string | null)[],
  acceptUrls: string[]
) => {
  return (
    imageFlags
      .map(imageFlag => {
        const isMatch =
          acceptUrls
            .map(acceptUrl => (imageFlag ?? '').includes(acceptUrl ?? ''))
            .filter(o => o === true).length !== 0
        return isMatch
      })
      .filter(o => o === true).length !== 0
  )
}
