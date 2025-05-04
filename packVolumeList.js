import { exec } from "child_process";
import { Drive } from "./driveClass.js"
import { parseDataFromDiskpart } from "./parseDiskpart.js"

const listVolumes = async () => {
  return new Promise((res, rej) => {
    exec(`echo list volume | diskpart`, (error, stdout, stderr) => {
      if (error) {
        rej(`Error executing diskpart: ${error.message}`);
        return;
      }
      if (stderr) {
        rej(`stderr: ${stderr}`);
        return;
      }
      res(stdout)
    });
  });
};

const getDrives = async () => {
  const rawVolumeList = await listVolumes()
  const lines = rawVolumeList.split("\n");
  let volumeLines = lines.filter((line) => line.trim().startsWith("Volume")); // Array samo sa drive linijama
  volumeLines = volumeLines.map((e) => e.trimStart().slice(0, -1)); // Remova spaceova i \r
  // volumeLines = volumeLines.map((e) => e.split("")); // Splita u array sa svakim char

  const parsedData = parseDataFromDiskpart(volumeLines);
  const arrOfDrives = []
  parsedData.forEach(drive => {
    let newDrive = new Drive(...drive)
    arrOfDrives.push(newDrive)
  });

  // console.log(arrOfDrives)
  return arrOfDrives
};

export { getDrives }