"""
app.py
------
Streamlit interface for the VIT Hostel Knowledge Assistant.

Loads the FAISS vector database built by ingest.py,
retrieves the most relevant document chunks,
and sends them to a local Ollama LLM.
"""

import os
import streamlit as st

from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama import ChatOllama
from langchain_classic.chains import RetrievalQA
from langchain_core.prompts import PromptTemplate

VECTORSTORE_DIR = "vectorstore"

st.set_page_config(
    page_title="VIT Hostel Knowledge Assistant",
    page_icon="🎓",
    layout="wide"
)

st.title("🎓 VIT Hostel Knowledge Assistant")
st.caption(
    "Ask questions about hostel rules, fees, refunds, admissions, affidavits, "
    "student conduct, or other official VIT documents."
)


@st.cache_resource
def load_qa_chain():

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    vectorstore = FAISS.load_local(
        VECTORSTORE_DIR,
        embeddings,
        allow_dangerous_deserialization=True
    )

    retriever = vectorstore.as_retriever(
        search_kwargs={"k": 5}
    )

    llm = ChatOllama(
        model="llama3.2:3b",
        temperature=0
    )

    prompt_template = """
You are the VIT Hostel Knowledge Assistant.

Answer ONLY from the supplied context.

Rules:

1. Do not make up information.
2. If the answer is not present in the context, clearly state:
   "I could not find this information in the provided documents."
3. Keep answers clear and concise.
4. If multiple documents contain relevant information, combine them.
5. Mention important conditions whenever applicable.

Context:
{context}

Question:
{question}

Answer:
"""

    prompt = PromptTemplate(
        template=prompt_template,
        input_variables=["context", "question"]
    )

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        chain_type="stuff",
        chain_type_kwargs={
            "prompt": prompt
        },
        return_source_documents=True,
    )

    return qa_chain


if not os.path.exists(VECTORSTORE_DIR) or not os.listdir(VECTORSTORE_DIR):
    st.error(
        "No FAISS index found.\n\nRun:\n\npython ingest.py"
    )
    st.stop()


qa_chain = load_qa_chain()


if "messages" not in st.session_state:
    st.session_state.messages = []


for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])


user_question = st.chat_input(
    "Ask a question about VIT hostel..."
)


if user_question:

    st.session_state.messages.append(
        {
            "role": "user",
            "content": user_question
        }
    )

    with st.chat_message("user"):
        st.markdown(user_question)

    with st.chat_message("assistant"):

        with st.spinner("Searching official documents..."):

            result = qa_chain.invoke(
                {"query": user_question}
            )

            answer = result["result"]
            sources = result["source_documents"]

            st.markdown(answer)

            with st.expander("📄 Sources Used"):

                for i, doc in enumerate(sources, start=1):

                    source = doc.metadata.get(
                        "source",
                        "Unknown Document"
                    )

                    page = doc.metadata.get(
                        "page",
                        "Unknown"
                    )

                    st.markdown(
                        f"### {i}. {source} (Page {page + 1 if isinstance(page, int) else page})"
                    )

                    st.write(doc.page_content[:500] + "...")

    st.session_state.messages.append(
        {
            "role": "assistant",
            "content": answer
        }
    )