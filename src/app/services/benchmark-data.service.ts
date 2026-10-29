import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import * as Papa from 'papaparse';

export interface BenchmarkRow {
  Setting: string;
  Model: string;
  Sampler: string;
  train_rows: number;
  cv_accuracy: number;
  test_accuracy: number;
  test_precision_macro: number;
  test_recall_macro: number;
  test_f1_macro: number;
  test_f1_weighted: number;
  test_mcc: number;
  test_roc_auc: number;
  seconds: number;
}

@Injectable({
  providedIn: 'root'
})
export class BenchmarkDataService {
  constructor(private http: HttpClient) {}

  getBenchmarkData(): Observable<BenchmarkRow[]> {
    return this.http.get('assets/flight_delay_results.csv', { responseType: 'text' }).pipe(
      map(csvString => {
        const parsed = Papa.parse<BenchmarkRow>(csvString, { header: true, dynamicTyping: true });
        return parsed.data.filter(row => row.Model && row.Setting);
      })
    );
  }
}
