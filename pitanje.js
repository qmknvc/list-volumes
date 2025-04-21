import { exec } from "child_process";

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
    let volumeLines = lines
    .filter((line) => line.trim().startsWith("Volume"))
    .filter((e) => e.includes("Removable"))
    .join(" ")
    .split(" ")
    .filter((e) => e != "");
    
    let removableVolume = volumeLines[1];
    let removableLetter = volumeLines[2];
    
    console.log(stdout)
  }
);
