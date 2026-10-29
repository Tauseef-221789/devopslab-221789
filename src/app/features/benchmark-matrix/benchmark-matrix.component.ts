import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild, inject, signal, computed, effect } from '@angular/core';
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title } from 'chart.js';
import { BenchmarkDataService, BenchmarkRow } from '../../services/benchmark-data.service';

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

const REPORTED_METRICS = { accuracy: 0.90, f1: 0.91, mcc: 0.74, auc: 0.87 };
const MAJORITY_BASELINE = 0.807;

type Metric = 'test_accuracy' | 'test_f1_macro' | 'test_f1_weighted' | 'test_mcc';
type FilterKey = 'setting' | 'model' | 'sampler';

interface FilterOption { value: string; label: string; count: number; }

@Component({
  selector: 'app-benchmark-matrix',
  standalone: true,
  templateUrl: './benchmark-matrix.component.html',
  styles: []
})
export class BenchmarkMatrixComponent implements AfterViewInit, OnDestroy {
  private readonly bs = inject(BenchmarkDataService);
  readonly reportedMetrics = REPORTED_METRICS;
  readonly majorityBaseline = MAJORITY_BASELINE;

  @ViewChild('accCanvas') accCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('f1Canvas') f1Canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('wf1Canvas') wf1Canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('mccCanvas') mccCanvas!: ElementRef<HTMLCanvasElement>;

  readonly data = signal<BenchmarkRow[]>([]);
  readonly filters = signal<{ setting: string; model: string; sampler: string }>({
    setting: '', model: '', sampler: ''
  });
  readonly sort = signal<{ key: string; dir: 'asc' | 'desc' }>({ key: 'test_accuracy', dir: 'desc' });

  readonly settings = signal<FilterOption[]>([]);
  readonly models = signal<FilterOption[]>([]);
  readonly samplers = signal<FilterOption[]>([]);

  readonly filtered = computed(() => {
    const rows = this.data();
    const f = this.filters();
    return rows.filter(r =>
      (f.setting ? r.Setting === f.setting : true) &&
      (f.model ? r.Model === f.model : true) &&
      (f.sampler ? r.Sampler === f.sampler : true)
    );
  });

  readonly sorted = computed(() => {
    const rows = this.filtered();
    const { key, dir } = this.sort();
    return [...rows].sort((a, b) => {
      const av = (a as any)[key]; const bv = (b as any)[key];
      if (av === bv) return 0;
      return dir === 'asc' ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1);
    });
  });

  private charts: Chart[] = [];

  constructor() {
    effect(() => {
      this.updateFilterOptions();
      this.renderCharts();
    });
  }

  ngAfterViewInit() {
    this.renderCharts();
  }

  ngOnDestroy() {
    this.charts.forEach(c => c.destroy());
  }

  loadData() {
    this.bs.getBenchmarkData().subscribe(rows => {
      this.data.set(rows);
    });
  }

  private updateFilterOptions() {
    const rows = this.data();
    const uniq = (k: keyof BenchmarkRow) => [...new Set(rows.map(r => r[k]))].sort().map(v => ({ value: String(v), label: String(v), count: rows.filter(r => r[k] === v).length }));
    this.settings.set(uniq('Setting'));
    this.models.set(uniq('Model'));
    this.samplers.set(uniq('Sampler'));
  }

  setFilter(key: FilterKey, value: string) {
    this.filters.update(f => ({ ...f, [key]: value }));
  }

  clearFilter(key: FilterKey) {
    this.filters.update(f => { f[key] = ''; return f; });
  }

  setSort(key: string) {
    this.sort.update(s => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' }));
  }

  sortIcon(key: string): string {
    const s = this.sort();
    if (s.key !== key) return '↕';
    return s.dir === 'asc' ? '↑' : '↓';
  }

  private renderCharts() {
    const rows = this.filtered();
    const metrics: { key: Metric; canvas: ElementRef<HTMLCanvasElement> | undefined; label: string; baseline: number; color: string }[] = [
      { key: 'test_accuracy', canvas: this.accCanvas, label: 'Accuracy', baseline: MAJORITY_BASELINE, color: '#3b82f6' },
      { key: 'test_f1_macro', canvas: this.f1Canvas, label: 'Macro-F1', baseline: REPORTED_METRICS.f1, color: '#10b981' },
      { key: 'test_f1_weighted', canvas: this.wf1Canvas, label: 'Weighted-F1', baseline: REPORTED_METRICS.f1, color: '#f59e0b' },
      { key: 'test_mcc', canvas: this.mccCanvas, label: 'MCC', baseline: REPORTED_METRICS.mcc, color: '#ef4444' }
    ];

    metrics.forEach(m => {
      if (!m.canvas) return;
      const ctx = m.canvas.nativeElement.getContext('2d')!;
      const bySetting: Record<string, BenchmarkRow[]> = {};
      rows.forEach(r => { (bySetting[r.Setting] ||= []).push(r); });
      const labels = rows.map(r => `${r.Model} • ${r.Sampler}`);
      const datasets = Object.entries(bySetting).map(([setting, rs]) => ({
        label: setting === 'paper_style' ? 'Paper-Style' : 'Pre-Departure',
        data: rs.map(r => Number(r[m.key])),
        backgroundColor: setting === 'paper_style' ? '#4f46e5' : '#f59e0b'
      }));

      const chart = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: { display: true, text: `${m.label} by Experiment (vs baseline ${m.baseline})`, font: { size: 13, weight: 600 }, color: '#374151' },
            legend: { position: 'top' },
            tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${(c.parsed.y as number).toFixed(3)}` } }
          },
          scales: {
            y: { beginAtZero: true, max: 1, title: { display: true, text: m.label }, ticks: { stepSize: 0.2, callback: (v) => Number(v).toFixed(2) } },
            x: { ticks: { maxRotation: 90, minRotation: 90, autoSkip: false } }
          },
          animation: { duration: 600 }
        }
      });
      this.charts.push(chart);
    });
  }

  metricClass(v: number): string {
    if (v >= 0.8) return 'bg-green-100 text-green-800';
    if (v >= 0.6) return 'bg-yellow-100 text-yellow-800';
    if (v >= 0.4) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  }

  deltaClass(v: number): string {
    return v >= 0 ? 'text-green-600' : 'text-red-600';
  }

  delta(v: number, ref: number): string {
    const d = v - ref;
    return (d >= 0 ? '+' : '') + d.toFixed(3);
  }

  isBest(row: BenchmarkRow): boolean {
    const all = this.data();
    const maxAcc = Math.max(...all.map(r => r.test_accuracy));
    return row.test_accuracy === maxAcc;
  }
}
