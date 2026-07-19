# User Manual

# VIT Student Knowledge Assistant (RAG Chatbot)

## 1. Introduction

The VIT Student Knowledge Assistant is a Retrieval-Augmented Generation (RAG) chatbot that answers student queries using official VIT documents.

Unlike a normal AI chatbot, this application retrieves relevant information from its knowledge base before generating a response. This ensures that answers are based on official university documents instead of general internet knowledge.

---

# 2. Features

- Answers questions using official VIT documents.
- Uses FAISS Vector Database for semantic document retrieval.
- Uses Sentence Transformers to generate embeddings.
- Uses Llama 3.2 (3B) running locally through Ollama.
- Displays the source documents used to generate each response.
- Does not fabricate answers if the requested information is unavailable in the provided documents.

---

# 3. Technologies Used

| Technology            | Purpose             |
| --------------------- | ------------------- |
| Python                | Backend Development |
| Streamlit             | User Interface      |
| LangChain             | RAG Pipeline        |
| FAISS                 | Vector Database     |
| Sentence Transformers | Text Embeddings     |
| Ollama                | Local LLM Runtime   |
| Llama 3.2 (3B)        | Language Model      |

---


# 4. How to Run the Project

## Step 1

Clone or download the project and open the project folder.

---

## Step 2

Create a virtual environment (recommended).

```bash
python -m venv venv
```

---

## Step 3

Activate the virtual environment.

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

---

## Step 4

Install the required dependencies.

```bash
pip install -r requirements.txt
```

---

## Step 5

Install and start Ollama.

Download and install Ollama from **https://ollama.com**.

After installation, pull the required language model:

```bash
ollama pull llama3.2:3b
```

Then start the Ollama server:

```bash
ollama serve
```

> If Ollama is already running, this step can be skipped.

---

## Step 6

Build the FAISS vector database.

> This step is required only the first time you run the project or whenever the documents inside the `data/` folder are modified.

```bash
python ingest.py
```

This command processes all PDF documents and creates the `vectorstore/` directory.

---

## Step 7

Launch the chatbot.

```bash
streamlit run app.py
```

The application will automatically open in your default web browser.

---

# 5. Knowledge Base

The chatbot has been trained on the following official VIT documents:

- Student Code of Conduct
- Statutes and Ordinances
- Hostel Admission Information
- Hostel Refund Policy
- Men's Hostel Fee Structure
- Ladies' Hostel Fee Structure
- Hostel Joint Affidavit
- General Student & Parent Affidavit
- Undertaking Form
- DPDPA Consent Form
- First Year Hostel Information

---

# 6. Sample Questions

## Hostel Admission

- What documents are required for hostel admission?
- What is the hostel admission process?
- Can I change my hostel room?

---

## Hostel Refund

- What is the hostel refund policy?
- Is the caution deposit refundable?
- When is the hostel refund processed?

---

## Hostel Fees

- What is the hostel fee?
- What is the hostel fee for first-year students?
- Is the hostel fee refundable?

---

## Student Conduct

- Is ragging prohibited in VIT?
- Can students smoke inside campus?
- What happens if a student damages institute property?
- What are the disciplinary actions for misconduct?

---

## Academic Rules

- What happens if I discontinue my studies?
- What is academic integrity?
- What are the responsibilities of students?

---

## Affidavits

- Why is the hostel joint affidavit required?
- Which affidavits must be signed during admission?

---

## General

- What documents are required before joining the hostel?
- What is the student code of conduct?
- What rules should students follow?

---

# 7. Expected Behaviour

The chatbot answers only from the uploaded documents.

If the information exists in the documents, the chatbot provides a relevant answer.

If the information is not available, the chatbot replies that it could not find the information in the provided documents.

This behaviour prevents the generation of incorrect or fabricated information.

---

# 8. Example Unsupported Questions

The chatbot cannot answer questions that are not present in the provided documents.

Examples:

- Who is the current Block-1 hostel warden?
- What is today's mess menu?
- Who is the Vice Chancellor?
- What events are happening this week?

The chatbot will indicate that the information is unavailable.

---

# 9. Notes for Evaluation

The following questions may be used to evaluate the chatbot:

1. What is the hostel refund policy?
2. Is ragging prohibited in VIT?
3. What documents are required for hostel admission?
4. What are the hostel fees?
5. What is academic integrity?
6. What disciplinary actions can be taken against students?
7. What happens if a student withdraws from the hostel?
8. What affidavits are required during admission?
9. What is the purpose of the DPDPA consent form?
10. What are the responsibilities of students according to the Code of Conduct?

---

# 10. Limitations

- The chatbot answers only from the uploaded knowledge base.
- It does not search the internet.
- It cannot answer real-time or dynamic information.
- The quality of responses depends on the uploaded documents.
