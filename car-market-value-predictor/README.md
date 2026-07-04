# 🚗 Car Market Value Predictor

A machine learning-powered web application that predicts the estimated resale market value of a vehicle based on its specifications.

The application uses a tuned Gradient Boosting regression model and performs the complete prediction process directly in the browser. No backend server or prediction API is required.

## Overview

Car resale valuation can vary based on factors such as the vehicle's present price, age, distance driven, fuel type, seller type, transmission, and ownership history.

This project applies machine learning to estimate a vehicle's selling price from these characteristics.

The project combines:

- Machine learning model development with Python and Scikit-learn
- Data preprocessing and feature engineering
- Regression model comparison
- Cross-validation and hyperparameter tuning
- Custom browser-side Gradient Boosting inference
- A responsive single-page interface built with Next.js and Tailwind CSS

## Features

- Predicts estimated car resale value in ₹ Lakhs
- Uses seven vehicle characteristics for prediction
- Runs the trained ML model entirely in the browser
- No Flask, FastAPI, or backend prediction server
- Custom TypeScript implementation of Gradient Boosting inference
- Responsive single-page user interface
- Input validation and model loading states
- Dynamic prediction result display

## Machine Learning Inputs

The final model uses the following seven vehicle features:

| Feature | Description |
| --- | --- |
| `Present_Price` | Present price of the vehicle in ₹ Lakhs |
| `Kms_Driven` | Total distance driven in kilometres |
| `Owner` | Number of previous owners |
| `Car_Age` | Age of the vehicle in years |
| `Fuel_Type` | Petrol, Diesel, or CNG |
| `Seller_Type` | Dealer or Individual |
| `Transmission` | Manual or Automatic |

The prediction target is:

`Selling_Price` — estimated resale value of the vehicle in ₹ Lakhs.

## Dataset

The model was trained using the Car Data dataset available on Kaggle.

Dataset source:

https://www.kaggle.com/datasets/athirags/car-data

The original dataset contains:

- 301 records
- 9 columns
- Numerical and categorical vehicle attributes

During preprocessing:

- 2 duplicate records were removed
- No missing values were found
- `Car_Age` was engineered from the `Year` column
- `Car_Name` was excluded from the final feature set
- Numerical features were standardized
- Categorical features were one-hot encoded

The cleaned dataset contains 299 records.

## Machine Learning Workflow

The model development process followed the pipeline below:

```text
Raw Car Dataset
        ↓
Data Inspection
        ↓
Duplicate Removal
        ↓
Feature Engineering
        ↓
Feature Selection
        ↓
Standard Scaling
        ↓
One-Hot Encoding
        ↓
Model Training
        ↓
5-Fold Cross-Validation
        ↓
Model Comparison
        ↓
Hyperparameter Tuning
        ↓
Final Gradient Boosting Model
        ↓
JSON Model Export
        ↓
Browser-Side Inference
```

## Model Comparison

Three regression algorithms were evaluated:

- Linear Regression
- Random Forest Regressor
- Gradient Boosting Regressor

The models were compared using 5-fold cross-validation.

| Model | Mean MAE | Mean RMSE | Mean R² |
| --- | ---: | ---: | ---: |
| Gradient Boosting | 0.723 | 1.405 | 0.9050 |
| Random Forest | 0.792 | 1.673 | 0.8522 |
| Linear Regression | 1.231 | 1.870 | 0.8520 |

Gradient Boosting achieved the best overall cross-validation performance and was selected for hyperparameter tuning.

## Hyperparameter Tuning

GridSearchCV was used to evaluate 243 Gradient Boosting parameter combinations across 5 folds.

A total of 1,215 model fits were performed.

The selected parameters were:

```text
learning_rate      = 0.05
max_depth          = 4
min_samples_leaf   = 1
min_samples_split  = 5
n_estimators       = 300
```

The tuned model achieved:

```text
Mean Cross-Validation R²: 0.9197
```

The untuned Gradient Boosting model achieved a mean cross-validation R² of `0.9050`.

## Frontend-Only ML Architecture

A key part of this project is that predictions do not use a Python backend.

A typical machine learning web application may use:

```text
Frontend
   ↓
Prediction API
   ↓
Python Server
   ↓
Pickle Model
```

This project instead uses:

```text
Python Model Training
        ↓
Export Model Structure
        ↓
model.json
        ↓
Next.js Application
        ↓
Browser-Side Preprocessing
        ↓
Decision Tree Traversal
        ↓
Gradient Boosting Prediction
```

The trained Scikit-learn model was exported into a browser-compatible JSON representation.

The exported model contains:

- StandardScaler mean values
- StandardScaler scale values
- OneHotEncoder category mappings
- Feature ordering information
- Initial Gradient Boosting prediction
- Learning rate
- 300 regression tree structures
- Tree thresholds
- Tree feature indices
- Tree child node indices
- Tree leaf values

The Next.js application reproduces the trained model's inference logic directly in TypeScript.

## Browser-Side Prediction

The browser performs the following operations:

1. Loads `/models/model.json`
2. Reads the seven vehicle inputs
3. Standardizes numerical features
4. One-hot encodes categorical features
5. Creates the 11 transformed model features
6. Traverses all 300 regression trees
7. Calculates each tree prediction
8. Applies the Gradient Boosting learning rate
9. Adds the initial model prediction
10. Displays the estimated market value

The Gradient Boosting prediction is calculated conceptually as:

```text
Prediction =
Initial Prediction
+
Learning Rate × Tree 1 Prediction
+
Learning Rate × Tree 2 Prediction
+
...
+
Learning Rate × Tree 300 Prediction
```

## Model Export Verification

The exported JSON model was verified against the original Scikit-learn model.

Five sample records were evaluated using both implementations.

```text
Record 1 Difference: 0.0
Record 2 Difference: 0.0
Record 3 Difference: 0.0
Record 4 Difference: 0.0
Record 5 Difference: 0.0
```

The JSON inference implementation reproduced the Scikit-learn predictions exactly for all five verification records.

Example:

```text
Present Price : 5.59 Lakhs
Kms Driven    : 27000
Owner Count   : 0
Car Age       : 5
Fuel Type     : Petrol
Seller Type   : Dealer
Transmission  : Manual
```

Model prediction:

```text
3.5260558793634935 Lakhs
```

Displayed by the web application as:

```text
₹ 3.53 Lakhs
```

## Tech Stack

### Machine Learning

- Python
- Pandas
- NumPy
- Scikit-learn
- Jupyter Notebook

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Machine Learning Techniques

- Data preprocessing
- Feature engineering
- Standard scaling
- One-hot encoding
- Regression analysis
- Gradient Boosting
- 5-fold cross-validation
- Grid search hyperparameter tuning
- Model serialization to JSON
- Browser-side model inference

## Project Structure

```text
car-market-value-predictor/
│
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── ml/
│   ├── data/
│   │   └── cardata.csv
│   ├── requirements.txt
│   └── train_model.ipynb
│
├── public/
│   └── models/
│       └── model.json
│
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

## Getting Started

### Prerequisites

Install:

- Node.js
- npm

Python is only required if you want to retrain or inspect the machine learning model.

### Clone the Repository

```bash
git clone <your-repository-url>
cd car-market-value-predictor
```

### Install Frontend Dependencies

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

Open the local development URL shown in the terminal.

## ML Development Setup

To run the machine learning notebook, create a Python virtual environment.

### Windows CMD

```cmd
python -m venv venv
venv\Scripts\activate
```

Install the ML dependencies:

```cmd
pip install -r ml\requirements.txt
```

Open:

```text
ml/train_model.ipynb
```

and run the notebook cells in order.

The notebook performs dataset preprocessing, model comparison, cross-validation, hyperparameter tuning, final model selection, JSON export, and inference verification.

## Limitations

The model was trained on a relatively small dataset containing 299 cleaned records.

The dataset is also skewed toward lower-priced vehicles, with relatively few high-value cars.

`Car_Name` was intentionally excluded from the final model because the dataset contains a large number of unique car names relative to the number of available records.

As a result, the model estimates value from general vehicle characteristics and may produce larger errors for unusual or high-value vehicles.

The prediction should be treated as a machine learning estimate rather than a professional vehicle appraisal or real-time market quotation.

## Future Improvements

Potential improvements include:

- Training on a larger and more recent vehicle dataset
- Adding vehicle brand and model information with improved categorical encoding
- Adding regional market information
- Comparing additional boosting algorithms
- Implementing prediction confidence intervals
- Adding model explainability using feature contribution analysis
- Tracking model version and training metadata
- Adding automated model export tests

## Author

**Avinash Rajput**

B.Tech Computer Science and Engineering  
VIT Bhopal University

Interests include Artificial Intelligence, Machine Learning, full-stack development, and building practical data-driven applications.

## License

This project is intended for educational and portfolio purposes.