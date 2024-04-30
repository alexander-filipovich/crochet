import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ParserService {
  constructor() { }

  static parseJson(file: File) {
    return new Promise<number[][]>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(event: ProgressEvent<FileReader>) {
        try {
          const result = event.target?.result;
          if (!result || typeof result != 'string') return;
          const data = JSON.parse(result);
          if (Array.isArray(data) && data.every(Array.isArray)) {
            resolve(data);
          } else {
            console.error("Invalid JSON data for expected format.");
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    })
  }
  static parseExcel(file: File) {
    return new Promise<number[][]>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(event: ProgressEvent<FileReader>) {
        const arrayBuffer = event.target?.result;
        if (!arrayBuffer) return;
    
        if (arrayBuffer instanceof ArrayBuffer) {
          const data = new Uint8Array(arrayBuffer);
          let binaryString = "";
      
          for (let i = 0; i < data.length; i++) {
            binaryString += String.fromCharCode(data[i]);
          }
      
          const workbook = XLSX.read(binaryString, {
            type: 'binary',
            cellStyles: true
          });
      
          let firstSheetName = workbook.SheetNames[0];
          let worksheet = workbook.Sheets[firstSheetName];
      
          const range = XLSX.utils.decode_range(worksheet['!ref']!);
      
          const fieldData: number[][] = [];
      
          for (let R = range.s.r; R <= range.e.r; R++) {
            fieldData[R] = fieldData[R] || [];
            for (let C = range.s.c; C <= range.e.c; C++) {
              const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
              const cell = worksheet[cellRef];
              fieldData[R][C] = cell && cell.s && cell.s.bgColor && cell.s.bgColor.rgb !== 'FFFFFF' ? 1 : 0;
            }
          }
          resolve(fieldData);
        } else {
          reject('File read did not result in an ArrayBuffer.');
        }
      };
    
      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    })
  }
}
