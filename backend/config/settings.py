import os
from dotenv import load_dotenv
load_dotenv()
from pydantic import BaseModel

class Settings(BaseModel):
    app_name: str = "AEGIS Agentic Fraud Investigation Platform"
    demo_mode: bool = os.getenv("DEMO_MODE", "false").lower() == "true"
    port: int = int(os.getenv("PORT", "8000"))
    
    # TigerGraph Settings
    tigergraph_host: str = os.getenv("TIGERGRAPH_HOST", "https://production.i.tgcloud.io")
    tigergraph_graph_name: str = os.getenv("TIGERGRAPH_GRAPH_NAME", "FraudInvestigationGraph")
    tigergraph_username: str = os.getenv("TIGERGRAPH_USERNAME", "tigergraph")
    tigergraph_password: str = os.getenv("TIGERGRAPH_PASSWORD", "tigergraph")
    tigergraph_secret: str = os.getenv("TIGERGRAPH_SECRET", "secret")
    
    # LLM Settings
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    llm_model: str = os.getenv("LLM_MODEL", "gpt-4o")

settings = Settings()
