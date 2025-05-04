// "Volume 0     D                       DVD-ROM         0 B  No Media           "
// ["Volume 0", "D", null, null, "DVD-ROM", "0 B", "No Media", null]
const parseDataFromDiskpart = (inputArr) => {
  // Broj crta - od svake kolone plus dva spacea izmedju
  const fixedWidths = [12, 5, 13, 7, 12, 9, 11, 8];
  const result = [];

  inputArr.forEach((line) => {
    let cleanedArr = [];
    let currentIndex = 0;

    for (const width of fixedWidths) {
      let chunk = "";
      let charsRead = 0;
      while (charsRead < width && currentIndex < line.length) {
        chunk += line[currentIndex];
        currentIndex++;
        charsRead++;
      }
      const trimmedChunk = chunk.trim();
      if (trimmedChunk === "") {
        cleanedArr.push(null);
      } else {
        cleanedArr.push(trimmedChunk);
      }
    }
    result.push(cleanedArr);
  });
  return result;
}

export { parseDataFromDiskpart }