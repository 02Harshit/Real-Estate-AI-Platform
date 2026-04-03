from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models_db import Property

from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma


def generate_property_embeddings():

    db: Session = SessionLocal()

    properties = db.query(Property).all()

    documents = []

    for prop in properties:

        content = f"""
        Title: {prop.title}
        Location: {prop.location}
        Price: {prop.price}
        Type: {prop.property_type}
        Bedrooms: {prop.bedrooms}
        Area: {prop.area}
        Amenities: {prop.amenities}
        Description: {prop.description}
        """

        documents.append(Document(page_content=content))

    embedding_model = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    vectordb = Chroma.from_documents(
        documents,
        embedding_model,
        persist_directory="vector_db"
    )


    print("Property embeddings generated successfully!")

    
if __name__ == "__main__":
    generate_property_embeddings()