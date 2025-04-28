// Personal function Imports
import { blockUSB } from "./blockUSB.js";
import { restoreUSB } from "./restoreUSB.js";
import { getDrives } from "./packVolumeList.js";
//
const hideAllRemovableDrives = async () => {
  console.log("Hiding drives...");
  const drives = await getDrives()
  const removableDrives = drives.filter(drive => drive.type == "Removable")
  const hiddenDrives = []
  removableDrives.forEach(drive => {
    hiddenDrives.push({volume: drive.volume, letter: drive.letter})
    blockUSB(drive.letter)
  });
  return hiddenDrives
}

const restoreAllRemovableDrives = async (hiddenDrives) => {
  console.log("Restoring drives...");
  await hiddenDrives.forEach(drive => {
    restoreUSB(drive.volume, drive.letter)
  });
}

export { hideAllRemovableDrives, restoreAllRemovableDrives }