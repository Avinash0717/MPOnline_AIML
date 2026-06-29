# Adult Census Income Classification

Predicts whether an individual's annual income exceeds $50,000 using demographic and employment data.

## Project Structure

```
Adult-Census-Income-Classification/
├── dataset/adult.csv               # Raw dataset
├── notebook/Adult_Income_Assignment.ipynb  # Jupyter notebook (all 5 tasks)
├── report/Assignment_Report.docx   # Word report
├── images/
│   ├── confusion_matrix.png        # Confusion matrices for all models
│   ├── roc_curve.png               # ROC curves comparison
│   └── feature_importance.png      # Feature importance (Random Forest)
├── requirements.txt
└── README.md
```

## Tasks

| Task | Description            | Marks |
| ---- | ---------------------- | ----- |
| 1    | Dataset Understanding  | 10    |
| 2    | Data Cleaning          | 20    |
| 3    | Feature Engineering    | 15    |
| 4    | Model Building         | 30    |
| 5    | Performance Evaluation | 15    |

## Results

| Algorithm           | Accuracy | Precision | Recall | F1 Score | ROC-AUC |
| ------------------- | -------- | --------- | ------ | -------- | ------- |
| Logistic Regression | 0.8227   | 0.7070    | 0.4509 | 0.5506   | 0.8504  |
| Decision Tree       | 0.8506   | 0.7141    | 0.6339 | 0.6716   | 0.8835  |
| Random Forest       | 0.8450   | 0.7066    | 0.6097 | 0.6546   | 0.8874  |
| KNN                 | 0.8251   | 0.6534    | 0.5842 | 0.6168   | 0.8432  |
| SVM                 | 0.8483   | 0.7619    | 0.5389 | 0.6313   | 0.8846  |

**Best Model:** Decision Tree (highest F1 Score: 0.6716)

## Setup

```bash
pip install -r requirements.txt
jupyter notebook notebook/Adult_Income_Assignment.ipynb
```
