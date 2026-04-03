from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vectordb = Chroma(
    persist_directory="./vector_db",
    embedding_function=embedding_model
)

def search_properties(query: str):

    results = vectordb.similarity_search(query, k=3)

    context = "\n".join([doc.page_content for doc in results])

    return context

def add_property_to_vector_store(property_obj):

    content = f"""
    Title: {property_obj.title}
    Location: {property_obj.location}
    Price: {property_obj.price}
    Type: {property_obj.property_type}
    Bedrooms: {property_obj.bedrooms}
    Area: {property_obj.area}
    Amenities: {property_obj.amenities}
    Description: {property_obj.description}
    """

    doc = Document(page_content=content)

    vectordb.add_documents([doc])

def delete_property_from_vector_store(property_id: int):

    vectordb.delete(where={"property_id": property_id})