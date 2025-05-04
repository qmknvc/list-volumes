// Personal function Imports
import { blockUSB } from "./blockUSB.js";
import { restoreUSB } from "./restoreUSB.js";
import { getDrives } from "./packVolumeList.js";
//
const hideAllRemovableDrives = async (drives) => {
  console.log("Hiding drives...");
  const removableDrives = drives.filter(drive => drive.type == "Removable")
  removableDrives.forEach(drive => {
    if (drive.letter) blockUSB(drive.letter)
  });
}

const restoreAllRemovableDrives = async (drives) => {
  const preferredLetters = ['G','H','I','J','K','L','M','N','O','P'];
  const occupiedLetters = drives.map(drive => drive.letter).filter(ltr => ltr != null)
  const availableLetters = preferredLetters.filter(ltr => !occupiedLetters.includes(ltr));

  const removableDrivesWithNoLetter = drives.filter(drive => drive.type == "Removable" && !drive.letter)
  for (let drive of removableDrivesWithNoLetter){
    console.log(`Restoring Drive: "${drive.volume}", and assigning it letter: "${availableLetters[0]}"`)
    const letter = availableLetters.shift()
    await restoreUSB(drive.volume, letter)
  }
}

export { hideAllRemovableDrives, restoreAllRemovableDrives }