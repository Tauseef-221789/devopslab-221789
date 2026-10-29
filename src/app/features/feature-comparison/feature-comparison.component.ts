import { Component } from '@angular/core';

type FeatureSet = 'paper_style' | 'pre_departure';

interface FeatureGroup {
  name: string;
  features: string[];
  leaky: boolean;
  count: number;
}

@Component({
  selector: 'app-feature-comparison',
  standalone: true,
  templateUrl: './feature-comparison.component.html',
  styles: []
})
export class FeatureComparisonComponent {
  activeSet: FeatureSet = 'paper_style';

  paperStyleGroups: FeatureGroup[] = [
    {
      name: 'Target-Leakage (Post-Arrival)',
      features: ['ArrDelay', 'TaxiIn', 'CarrierDelay', 'WeatherDelay', 'NASDelay', 'SecurityDelay', 'LateAircraftDelay'],
      leaky: true,
      count: 7
    },
    {
      name: 'Operational / Schedule',
      features: ['DayOfWeek', 'Month', 'DayOfYear', 'Carrier', 'FlightNumber', 'Origin', 'Dest', 'CRSDepTime', 'CRSArrTime', 'CRSElapsedTime', 'Distance', 'DepHourBin'],
      leaky: false,
      count: 12
    }
  ];

  preDepartureGroups: FeatureGroup[] = [
    {
      name: 'Pre-Departure (Known Before Departure)',
      features: ['DayOfWeek', 'Month', 'DayOfYear', 'Carrier', 'FlightNumber', 'Origin', 'Dest', 'CRSDepTime', 'CRSArrTime', 'CRSElapsedTime', 'Distance', 'DepHourBin'],
      leaky: false,
      count: 12
    }
  ];

  leakageFeatures = ['ArrDelay', 'TaxiIn', 'CarrierDelay', 'WeatherDelay', 'NASDelay', 'SecurityDelay', 'LateAircraftDelay'];

  get groups(): FeatureGroup[] {
    return this.activeSet === 'paper_style' ? this.paperStyleGroups : this.preDepartureGroups;
  }

  get setLabel(): string {
    return this.activeSet === 'paper_style' ? 'Paper-Style (21 features)' : 'Pre-Departure (12 features)';
  }

  get setDescription(): string {
    return this.activeSet === 'paper_style'
      ? 'Includes target-leakage features available only AFTER landing. Inflates reported performance.'
      : 'Realistic forecasting features known BEFORE departure. True out-of-sample performance.'
  }

  toggleSet(set: FeatureSet) {
    this.activeSet = set;
  }
}
