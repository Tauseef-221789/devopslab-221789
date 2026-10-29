import { Component } from '@angular/core';
import { HeaderComponent } from './features/header/header.component';
import { QuickMetricsComponent } from './features/quick-metrics/quick-metrics.component';
import { PaperViewerComponent } from './features/paper-viewer/paper-viewer.component';
import { FeatureComparisonComponent } from './features/feature-comparison/feature-comparison.component';
import { EdaDashboardComponent } from './features/eda-dashboard/eda-dashboard.component';
import { BenchmarkMatrixComponent } from './features/benchmark-matrix/benchmark-matrix.component';
import { StatisticalSignificanceComponent } from './features/statistical-significance/statistical-significance.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    QuickMetricsComponent,
    PaperViewerComponent,
    FeatureComparisonComponent,
    EdaDashboardComponent,
    BenchmarkMatrixComponent,
    StatisticalSignificanceComponent
  ],
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  title = 'Flight Delay Prediction Benchmark';
}
