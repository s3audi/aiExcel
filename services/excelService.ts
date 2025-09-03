import { TableRow } from '../types';

// Let TypeScript know that XLSX is available globally from the script tag in index.html
declare const XLSX: any;

export interface SheetData {
  headers: string[];
  data: TableRow[];
}

export interface ParsedExcelData {
  sheetNames: string[];
  sheets: Record<string, SheetData>;
}


export const parseExcelFile = (file: File): Promise<ParsedExcelData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        if (!data) {
          throw new Error("Dosya okunamadı.");
        }
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetNames = workbook.SheetNames;
        const sheets: Record<string, SheetData> = {};

        if (sheetNames.length === 0) {
            reject(new Error("Excel dosyasında sayfa bulunamadı."));
            return;
        }

        sheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData: TableRow[] = XLSX.utils.sheet_to_json(worksheet);
          
          if (jsonData.length > 0) {
            const headers = Object.keys(jsonData[0]);
            sheets[sheetName] = { headers, data: jsonData };
          } else {
            // Handle empty sheets gracefully
            sheets[sheetName] = { headers: [], data: [] };
          }
        });

        resolve({ sheetNames, sheets });
      } catch (error) {
        console.error("Excel ayrıştırma hatası:", error);
        reject(new Error("Geçersiz veya bozuk Excel dosyası."));
      }
    };

    reader.onerror = (error) => {
      console.error("Dosya okuma hatası:", error);
      reject(new Error("Dosya okunurken bir hata oluştu."));
    };

    reader.readAsBinaryString(file);
  });
};