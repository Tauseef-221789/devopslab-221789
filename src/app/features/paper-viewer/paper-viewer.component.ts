import { Component } from '@angular/core';

interface PipelineStep {
  step: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-paper-viewer',
  standalone: true,
  templateUrl: './paper-viewer.component.html',
  styles: []
})
export class PaperViewerComponent {
  pipeline: PipelineStep[] = [
    {
      step: 1,
      title: 'Data Collection',
      description: 'BTS Flight Status Prediction dataset (2018–2022), ~4.08M records from Kaggle.'
    },
    {
      step: 2,
      title: 'Preprocessing',
      description: 'Missing value imputation, categorical encoding, target binning into Small/Medium/Large delay classes.'
    },
    {
      step: 3,
      title: 'Feature Selection',
      description: '21 features including post-arrival delay attributes (ArrDelay, TaxiIn, CarrierDelay, etc.).'
    },
    {
      step: 4,
      title: 'Class Imbalance Handling',
      description: 'Random OverSampler (ROS), SMOTE, and ADASYN applied to balance the Small/Medium/Large classes.'
    },
    {
      step: 5,
      title: 'Model Training',
      description: 'Random Forest, Decision Tree, SVC, Logistic Regression, KNN, and Naive Bayes classifiers.'
    },
    {
      step: 6,
      title: '10-Fold Cross-Validation',
      description: 'Stratified 10-fold CV with accuracy, macro-F1, weighted-F1, MCC, and ROC-AUC recorded per fold.'
    },
    {
      step: 7,
      title: 'Hyperparameter Tuning',
      description: 'Grid search over n_estimators, max_depth, C, kernel, k_neighbors, and alpha per classifier.'
    },
    {
      step: 8,
      title: 'Test Set Evaluation',
      description: 'Hold-out test set evaluation reporting the paper\'s headline metrics (Acc 0.90, F1 0.91, MCC 0.74, ROC-AUC 0.87).'
    },
    {
      step: 9,
      title: 'Statistical Testing',
      description: 'Paired t-test (t = 30.98, p &lt; 0.001) and McNemar test (χ² = 78.0, p ≈ 9.02×10⁻¹⁶⁵).'
    },
    {
      step: 10,
      title: 'Results Analysis',
      description: 'Comparison across classifiers and resamplers; identification of Random Forest + ROS as top performer.'
    }
  ];
}
