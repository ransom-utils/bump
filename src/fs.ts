import path from "node:path";
import fs from "node:fs";
import * as jsonc from 'jsonc-parser'
/**
 * Describes a plain-text file.
 */
export interface TextFile {
  path: string;
  data: string;
}

/**
 * Modifies a JSON file.
 */
type ModifyUnion = [jsonc.JSONPath, unknown]

/**
 * Describes a JSON file.
 */
interface JsonFile {
  path: Readonly<string>
  data: Readonly<unknown>
  text: Readonly<string>
  modified: ModifyUnion[]
}

export async function readJsonFile(name: string, cwd: string): Promise<JsonFile> {
  const file = await readTextFile(name, cwd);
  const data = JSON.parse(file.data);
  const modified: ModifyUnion[] = []
  return {
    ...file,
    data,
    modified,
    text: file.data
  };
}

export function writeJsonFile(file: JsonFile): Promise<void> {
  let newJSON = file.text

  for (const [key, value] of file.modified) {
    const edit = (jsonc.modify(newJSON, key, value, {}))
    newJSON = jsonc.applyEdits(newJSON, edit)
  }


  return writeTextFile({
    ...file,
    data: newJSON,
  });
}

export function readTextFile(name: string, cwd: string): Promise<TextFile> {
  return new Promise((resolve, reject) => {
    const filePath = path.join(cwd, name);
    fs.readFile(filePath, "utf-8", (err, text) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          path: filePath,
          data: text,
        });
      }
    });
  });
}

export function writeTextFile(file: TextFile): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(file.path, file.data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
