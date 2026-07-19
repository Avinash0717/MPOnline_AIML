# User Manual

---



# IMPORTANT

The models folder does not contain similarity.pkl due to its file size being larger than 100mb, **RUN THE NOTEBOOK ONCE, JUST DO THE RUN ALL**. The notebook will regenerate:

- movies.pkl
- similarity.pkl

These files are required to run the Streamlit application.

---



# Movie Recommendation System

**Version:** 1.0
**Technology:** Python, Streamlit, Scikit-learn, Pandas, NLTK
**Recommendation Technique:** Content-Based Filtering

---

# Table of Contents

1. Introduction
2. Project Objective
3. System Requirements
4. Project Structure
5. Installation Guide
6. Running the Application
7. How to Use
8. Sample Test Cases
9. Machine Learning Workflow
10. Technologies Used
11. Features
12. Limitations
13. Troubleshooting
14. Frequently Asked Viva Questions
15. Conclusion

---

# 1. Introduction

The Movie Recommendation System is a Machine Learning application that recommends movies similar to the one selected by the user.

The system analyzes movie metadata such as genres, keywords, cast members, directors, and movie descriptions to find similar movies.

Unlike recommendation systems that depend on user ratings, this project uses **Content-Based Filtering**, meaning recommendations are generated using movie features rather than user preferences.

---

# 2. Project Objective

The objective of this project is to develop a recommendation system capable of suggesting movies with similar characteristics based on movie content.

The project demonstrates:

- Data Cleaning
- Feature Engineering
- Natural Language Processing
- Text Vectorization
- Cosine Similarity
- Streamlit Deployment

---

# 3. System Requirements

## Software

- Python 3.10 or above
- Visual Studio Code (Recommended)
- Streamlit

## Python Libraries

- pandas
- numpy
- scikit-learn
- nltk
- matplotlib
- seaborn
- streamlit

All required libraries are available in:

requirements.txt

---

# 4. Project Structure

```
Movie-Recommendation-System/
│
├── .venv/
├── data/
│   ├── tmdb_5000_movies.csv
│   └── tmdb_5000_credits.csv
│
├── models/
│   ├── movies.pkl
│   └── similarity.pkl
│
├── notebooks/
│   └── movie_recommendation.ipynb
│
├── app.py
├── requirements.txt
├── .gitignore
└── user_manual.md
```

---

# 5. Usage Guide

## Step 1

Clone or download the project.

---

## Step 2

Open the project folder.

---

## Step 3

Create a virtual environment (optional).

Windows

```bash
python -m venv .venv
```

Activate it

```bash
.venv\Scripts\activate
```

---

## Step 4

Install the dependencies.

```bash
pip install -r requirements.txt
```

---



## Step 5

Run the notebook movie_recommendation.ipynb.

This will generate the models.

---

# 6. Running the Application

Run the following command:

```bash
streamlit run app.py
```

The application will automatically open in your default web browser.

If it does not open automatically, visit:

```
http://localhost:8501
```

---

# 7. How to Use

### Step 1

Launch the application.

---

### Step 2

Locate the movie selection dropdown.

---

### Step 3

Select any movie available in the list.

Examples:

- Avatar
- Spider-Man
- Batman Begins
- Titanic
- Iron Man
- Toy Story

---

### Step 4

Click the **Recommend** button.

---

### Step 5

The application displays **five similar movies** based on the selected movie.

---

# 8. Sample Test Cases

## Test Case 1

### Input

Spider-Man 3

### Expected Output

Movies similar to Spider-Man 3, such as:

- Spider-Man
- Spider-Man 2
- The Amazing Spider-Man
- The Amazing Spider-Man 2
- Arachnophobia

---

## Test Case 2

### Input

Avatar

### Expected Output

Movies with similar science-fiction and adventure themes.

---

## Test Case 3

### Input

Batman Begins

### Expected Output

Batman series and other action/crime movies.

---

## Test Case 4

### Input

Titanic

### Expected Output

Movies containing similar romantic and dramatic elements.

---

# 9. Machine Learning Workflow

```
TMDB Dataset
      │
      ▼
Load Dataset
      │
      ▼
Merge Datasets
      │
      ▼
Data Cleaning
      │
      ▼
Feature Extraction
      │
      ▼
Overview Processing
      │
      ▼
Genres Extraction
      │
      ▼
Keywords Extraction
      │
      ▼
Cast Extraction
      │
      ▼
Director Extraction
      │
      ▼
Combine Features
      │
      ▼
Stemming
      │
      ▼
CountVectorizer
      │
      ▼
Cosine Similarity
      │
      ▼
Recommendation Function
      │
      ▼
Streamlit Interface
```

---

# 10. Technologies Used

| Technology        | Purpose                |
| ----------------- | ---------------------- |
| Python            | Programming Language   |
| Pandas            | Data Processing        |
| NumPy             | Numerical Operations   |
| NLTK              | Text Preprocessing     |
| Scikit-learn      | Machine Learning       |
| CountVectorizer   | Text Vectorization     |
| Cosine Similarity | Similarity Measurement |
| Streamlit         | Web Application        |

---

# 11. Features

- Content-Based Recommendation
- Interactive User Interface
- Dropdown Movie Selection
- Instant Recommendations
- Machine Learning Powered
- Streamlit Web Application
- Fast Recommendation Generation

---

# 12. Limitations

- Recommendations are limited to movies available in the TMDB dataset.
- The system does not use user ratings or viewing history.
- Personalized recommendations are not supported.
- New movies outside the dataset cannot be recommended.

---

# 13. Troubleshooting

## Problem

ModuleNotFoundError

### Solution

Install the required libraries.

```bash
pip install -r requirements.txt
```

---

## Problem

movies.pkl not found

### Solution

Run the notebook completely to regenerate the model files.

---

## Problem

Application does not open.

### Solution

Verify Streamlit is installed.

```bash
streamlit --version
```

Run

```bash
streamlit run app.py
```

---

# 14. Frequently Asked Viva Questions

## Q1. What type of recommendation system is this?

**Answer:**
Content-Based Recommendation System.

---

## Q2. Which dataset is used?

**Answer:**
TMDB 5000 Movie Dataset.

---

## Q3. Which machine learning technique is used?

**Answer:**
Content-Based Filtering.

---

## Q4. Which algorithm converts text into numbers?

**Answer:**
CountVectorizer.

---

## Q5. Which similarity measure is used?

**Answer:**
Cosine Similarity.

---

## Q6. Why is Cosine Similarity used?

**Answer:**
It measures how similar two movies are based on the angle between their feature vectors rather than their magnitude.

---

## Q7. Why are only the top three cast members selected?

**Answer:**
The leading actors generally contribute most to a movie's identity while reducing unnecessary data.

---

## Q8. Why is the director extracted separately?

**Answer:**
The director has a significant influence on a movie's style, making it an important feature for similarity.

---

## Q9. Why is stemming used?

**Answer:**
Stemming converts related words to a common root, improving text matching and reducing vocabulary size.

---

## Q10. What is the output of the system?

**Answer:**
The system returns the top five movies that are most similar to the selected movie.

---

# 15. Conclusion

The Movie Recommendation System successfully demonstrates the implementation of a **Content-Based Recommendation Engine** using Machine Learning and Natural Language Processing techniques.

The application processes movie metadata, converts textual information into numerical vectors using **CountVectorizer**, computes similarities using **Cosine Similarity**, and recommends the five most similar movies through an interactive **Streamlit** interface.

This project showcases practical applications of data preprocessing, feature engineering, vectorization, similarity analysis, and web deployment using Python.
