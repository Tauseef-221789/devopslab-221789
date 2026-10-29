import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Chart, CategoryScale, LinearScale, LogarithmicScale, BarElement, Tooltip, Legend, Title } from 'chart.js';

Chart.register(CategoryScale, LinearScale, LogarithmicScale, BarElement, Tooltip, Legend, Title);

@Component({
  selector: 'app-eda-dashboard',
  standalone: true,
  templateUrl: './eda-dashboard.component.html',
  styles: []
})
export class EdaDashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('imbalanceCanvas') imbalanceCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('histCanvas') histCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('hourCanvas') hourCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('carrierCanvas') carrierCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('heatmapCanvas') heatmapCanvas!: ElementRef<HTMLCanvasElement>;

  private charts: Chart[] = [];

  ngAfterViewInit() {
    this.renderImbalanceChart();
    this.renderHistogramChart();
    this.renderHourChart();
    this.renderCarrierChart();
    this.renderHeatmapChart();
  }

  ngOnDestroy() {
    this.charts.forEach(c => c.destroy());
  }

  private destroyAndPush(chart: Chart) {
    const existing = this.charts.find(c => c.canvas.id === chart.canvas.id);
    if (existing) existing.destroy();
    this.charts.push(chart);
  }

  private renderImbalanceChart() {
    const ctx = this.imbalanceCanvas.nativeElement.getContext('2d')!;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Small (<15 min)', 'Medium (15–44 min)', 'Large (≥45 min)'],
        datasets: [{
          label: 'Target Class Share',
          data: [80.7, 12.2, 7.1],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'Target Class Imbalance', font: { size: 14, weight: 600 }, color: '#374151' },
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => (c.parsed.y as number) + '% of records' } }
        },
        scales: {
          y: { beginAtZero: true, max: 90, title: { display: true, text: 'Share of records (%)' }, ticks: { stepSize: 10 } }
        },
        animation: { duration: 800 }
      }
    });
    this.destroyAndPush(chart);
  }

  private renderHistogramChart() {
    const bins = ['0–15', '15–30', '30–45', '45–60', '60–90', '90–120', '120–180', '180–300', '300–600', '600+'];
    const counts = [3295000, 410000, 180000, 95000, 52000, 28000, 15000, 9000, 4000, 1500];
    const logCounts = counts.map(c => Math.log10(c));

    const ctx = this.histCanvas.nativeElement.getContext('2d')!;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: bins,
        datasets: [{
          label: 'Flight Count (log₁₀ scale)',
          data: logCounts,
          backgroundColor: '#3b82f6',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'Arrival Delay Distribution (log scale)', font: { size: 14, weight: 600 }, color: '#374151' },
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c) => `10^${(c.parsed.y as number).toFixed(2)} ≈ ${counts[c.dataIndex as number].toLocaleString()} flights`
            }
          }
        },
        scales: {
          y: {
            type: 'logarithmic' as const,
            title: { display: true, text: 'Flight Count (log₁₀)' },
            ticks: { callback: (v) => Math.pow(10, Number(v)).toLocaleString() }
          }
        },
        animation: { duration: 800 }
      }
    });
    this.destroyAndPush(chart);
  }

  private renderHourChart() {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');
    const delayRate = [6.2, 5.8, 5.1, 4.9, 5.4, 7.1, 11.4, 15.8, 18.2, 16.5, 14.1, 12.8, 11.5, 10.9, 11.2, 12.5, 14.8, 17.3, 20.1, 18.7, 15.2, 11.8, 9.1, 7.3];

    const ctx = this.hourCanvas.nativeElement.getContext('2d')!;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: hours,
        datasets: [{
          label: 'Delay Rate ≥15 min (%)',
          data: delayRate,
          backgroundColor: delayRate.map(v => v > 15 ? '#ef4444' : v > 10 ? '#f59e0b' : '#10b981'),
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'Delay Rate by Scheduled Departure Hour', font: { size: 14, weight: 600 }, color: '#374151' },
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => (c.parsed.y as number).toFixed(1) + '% delayed' } }
        },
        scales: {
          y: { beginAtZero: true, max: 25, title: { display: true, text: '% of flights delayed ≥15 min' }, ticks: { stepSize: 5 } },
          x: { title: { display: true, text: 'Scheduled Departure Hour' } }
        },
        animation: { duration: 800 }
      }
    });
    this.destroyAndPush(chart);
  }

  private renderCarrierChart() {
    const carriers = ['AA', 'DL', 'UA', 'SW', 'JB', 'AS', 'B6', 'NK', 'F9', 'HA', 'Other'];
    const delayRate = [14.2, 12.8, 15.1, 9.6, 11.4, 10.2, 13.7, 18.9, 17.2, 11.8, 12.5];

    const ctx = this.carrierCanvas.nativeElement.getContext('2d')!;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: carriers,
        datasets: [{
          label: 'Delay Rate ≥15 min (%)',
          data: delayRate,
          backgroundColor: '#6366f1',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          title: { display: true, text: 'Delay Rate by Operating Carrier', font: { size: 14, weight: 600 }, color: '#374151' },
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => (c.parsed.x as number).toFixed(1) + '% delayed' } }
        },
        scales: {
          x: { beginAtZero: true, max: 25, title: { display: true, text: '% of flights delayed ≥15 min' }, ticks: { stepSize: 5 } }
        },
        animation: { duration: 800 }
      }
    });
    this.destroyAndPush(chart);
  }

  private renderHeatmapChart() {
    const canvas = this.heatmapCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const features = ['DepHourBin', 'Distance', 'Month', 'DayOfWeek', 'Carrier', 'Origin', 'Dest', 'CRSElapsedTime'];
    const corr = [0.12, 0.08, 0.04, 0.03, 0.06, 0.02, 0.02, 0.15];
    const max = Math.max(...corr);

    const width = 400;
    const height = 280;
    const barW = width / features.length;

    ctx.clearRect(0, 0, width, height);
    features.forEach((f, i) => {
      const intensity = corr[i] / max;
      const hue = 220 - (intensity * 120);
      ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
      ctx.fillRect(i * barW + 2, height - intensity * (height - 40), barW - 4, intensity * (height - 40));
      ctx.fillStyle = '#374151';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(f, i * barW + barW / 2, height - 10);
      ctx.fillText(corr[i].toFixed(2), i * barW + barW / 2, height - intensity * (height - 40) - 10);
    });
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Correlation with ArrDelay', 10, 20);
    ctx.fillText('stronger', 10, 40);
    ctx.fillText('weaker', width - 40, 40);
    const grad = ctx.createLinearGradient(width - 20, 50, width - 20, height - 50);
    grad.addColorStop(0, '#10b981');
    grad.addColorStop(0.5, '#3b82f6');
    grad.addColorStop(1, '#f59e0b');
    ctx.fillStyle = grad;
    ctx.fillRect(width - 15, 50, 10, height - 100);
  }
}
