"""
ingest.py
---------
Reads all PDF documents from the data/ folder, splits them into text chunks,
creates embeddings, and builds a FAISS vector index.

Run whenever you add/remove/update documents:

    python ingest.py
"""

import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

DATA_DIR = "data"
VECTORSTORE_DIR = "vectorstore"


def load_pdf_documents(data_dir: str):
    """
    Load every PDF inside the data directory.
    """
    documents = []

    pdf_files = [
        file for file in os.listdir(data_dir)
        if file.lower().endswith(".pdf")
    ]

    if not pdf_files:
        print("No PDF files found.")
        return documents

    print(f"\nFound {len(pdf_files)} PDF(s):\n")

    for pdf_file in pdf_files:
        pdf_path = os.path.join(data_dir, pdf_file)

        print(f"Loading: {pdf_file}")

        loader = PyPDFLoader(pdf_path)
        docs = loader.load()

        for doc in docs:
            doc.metadata["source"] = pdf_file

        documents.extend(docs)

    print(f"\nLoaded {len(documents)} pages from all PDFs.\n")

    return documents


def build_vectorstore():

    documents = load_pdf_documents(DATA_DIR)

    if not documents:
        raise ValueError(
            "No PDF documents found inside the 'data' folder."
        )

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150
    )

    chunks = splitter.split_documents(documents)

    print(f"Created {len(chunks)} text chunks.\n")

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    print("Generating embeddings...")

    vectorstore = FAISS.from_documents(
        chunks,
        embeddings
    )

    os.makedirs(VECTORSTORE_DIR, exist_ok=True)

    vectorstore.save_local(VECTORSTORE_DIR)

    print("\nFAISS index successfully created!")
    print(f"Saved to: {VECTORSTORE_DIR}/")


if __name__ == "__main__":
    build_vectorstore()