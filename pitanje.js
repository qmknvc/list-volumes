import { exec } from "child_process";
import { stat } from "fs";
import { parse } from "path";

const scriptPath = "./list_volumes.txt";

exec(
  `powershell -Command "diskpart /s "${scriptPath}""`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing diskpart: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    const lines = stdout.split("\n");
    let volumeLines = lines.filter((line) => line.trim().startsWith("Volume")); // Array samo sa drive linijama
    volumeLines = volumeLines.map((e) => e.trimStart().slice(0, -1)); // Remova spaceova i \r
    // volumeLines = volumeLines.map((e) => e.split(""));

    class Drive {
      constructor(volume, letter, label, fileSystem, type, size, status, info) {
        this.volume = volume;
        this.letter = letter;
        this.label = label;
        this.fileSystem = fileSystem;
        this.type = type;
        this.size = size;
        this.status = status;
        this.info = info;
      }
    }

    // "Volume 0     D                       DVD-ROM         0 B  No Media           "
    // ["Volume 0", "D", null, null, "DVD-ROM", "0 B", "No Media", null]
    function parseDataFromDiskpart(inputArr) {
      // Broj crta - od svake kolone plus dva spacea izmedju
      const fixedWidths = [12, 5, 13, 7, 12, 9, 11, 8];
      const result = []

      inputArr.forEach(line => {
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
      return result
    }

    const parsedData = parseDataFromDiskpart(volumeLines);
    const arrOfDrives = []
    parsedData.forEach(drive => {
      let newDrive = new Drive(...drive)
      arrOfDrives.push(newDrive)
    });

    console.log(arrOfDrives)

  }
);
