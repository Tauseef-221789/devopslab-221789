import { Component } from '@angular/core';

interface StatCard {
  test: string;
  statistic: string;
  pValue: string;
  interpretation: string;
  comparison: string;
  significant: boolean;
}

@Component({
  selector: 'app-statistical-significance',
  standalone: true,
  templateUrl: './statistical-significance.component.html',
  styles: []
})
export class StatisticalSignificanceComponent {
  cards: StatCard[] = [
    {
      test: 'Paired t-test',
      statistic: 't = 30.98',
      pValue: 'p < 0.001',
      interpretation: 'Extremely significant difference in mean performance across the 10 CV folds.',
      comparison: 'Random Forest + RandomOverSampler vs KNN + ADASYN',
      significant: true
    },
    {
      test: 'McNemar Test',
      statistic: 'χ² = 78.0',
      pValue: 'p ≈ 9.02 × 10⁻¹⁶⁵',
      interpretation: 'The disagreement in predictions between the two models is highly statistically significant.',
      comparison: 'Random Forest + RandomOverSampler vs KNN + ADASYN',
      significant: true
    }
  ];
}
