import { Component } from '@angular/core';

export interface MetricCard {
  label: string;
  value: string;
  delta?: string;
  deltaType?: 'good' | 'bad';
  sublabel?: string;
}

@Component({
  selector: 'app-quick-metrics',
  standalone: true,
  templateUrl: './quick-metrics.component.html',
  styles: []
})
export class QuickMetricsComponent {
  cards: MetricCard[] = [
    {
      label: 'Top Model',
      value: 'Random Forest + ROS / Decision Tree + SMOTE',
      sublabel: 'Paper-reported best'
    },
    {
      label: 'Accuracy',
      value: '0.90',
      sublabel: 'Paper-reported (test set)'
    },
    {
      label: 'Macro-F1',
      value: '0.91',
      sublabel: 'Paper-reported'
    },
    {
      label: 'MCC',
      value: '0.74',
      sublabel: 'Matthews Correlation Coefficient'
    },
    {
      label: 'ROC-AUC',
      value: '0.87',
      sublabel: 'Paper-reported'
    },
    {
      label: 'Dataset Size',
      value: '~4.08M rows',
      sublabel: 'BTS Flight Status 2018–2022'
    },
    {
      label: 'Target Classes',
      value: 'Small / Medium / Large',
      sublabel: '&lt;15 / 15–44 / ≥45 min'
    },
    {
      label: 'Experiments',
      value: '36',
      sublabel: '2 feature sets × 6 classifiers × 3 resamplers'
    }
  ];
}
