// 1. `main.ts`ファイルには以下の処理を含める。
//  - `csv.ts`を使って`input.csv`を読み込み、整形する。
//  - 整形した結果を`output.csv`に書き込む。
import * as fs from 'fs';
import * as csv from 'csv-parse';

class CSVProcessor {
  private data: number[] = [];

  constructor(private inputPath: string, private outputPath: string) {}

  private isPrime(num: number): boolean {
    for(let i = 2; i < num; i += 1)
      if(num % i === 0) return false;
    return num > 1;
  }

  private formatNumber(num: number): string {
    if (this.isPrime(num)) {
      return `[${num}]`.replace(" ","");
    } else if (num % 7 === 0) {
      return `<${num}>`.replace(" ","");
    } else if (num % 15 === 0) {
      return `(${num})`.replace(" ","");
    } else {
      return num.toString().trim().padStart(5, '0').replace(" ",""); // 数値を5桁の0埋めで文字列に変換
    }
  }

  public async processCSV(): Promise<void> {
    fs.createReadStream(this.inputPath)
      .pipe(csv.parse())
      .on('data', (row: number[]) => {
        row.forEach(r => this.data.push(r))
      })
      .on('end', () => {
        const formattedData = this.data.sort((a, b) => a - b).map((num) => this.formatNumber(num));
        const chunkedData = [];
        for (let i = 0; i < formattedData.length; i += 20) {
          chunkedData.push(formattedData.slice(i, i + 20).join(","));
        }
        console.log(chunkedData);
        fs.writeFileSync(this.outputPath, chunkedData.join("\n"));
      });
  }
}

const processor = new CSVProcessor('input.csv', 'output.csv');
processor.processCSV();