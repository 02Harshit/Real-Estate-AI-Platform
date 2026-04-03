from ai.crew_pipeline import run_triage
from rag.vector_store import search_properties

def execute_triage(message: str) -> dict:
    property_context = search_properties(message)
    return run_triage(message,property_context)
