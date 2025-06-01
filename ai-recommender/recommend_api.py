import pickle
import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np

app = FastAPI(
    title="Event Recommender API",
    description="API for getting event recommendations based on user feedback",
    version="1.0.0"
)

# Get the absolute path to the models directory
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
MODEL_PATH = os.path.join(MODEL_DIR, 'model.pkl')
METADATA_PATH = os.path.join(MODEL_DIR, 'event_metadata.pkl')

try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    with open(METADATA_PATH, 'rb') as f:
        event_metadata = pickle.load(f)
except FileNotFoundError:
    print("Warning: Model files not found. Please train the model first.")
    print(f"Looking for model at: {MODEL_PATH}")
    print(f"Looking for metadata at: {METADATA_PATH}")
    model = None
    event_metadata = None

class RecommendationResponse(BaseModel):
    eventId: str
    predictedRating: float

@app.get("/recommend/{user_id}", response_model=List[RecommendationResponse])
async def get_recommendations(
    user_id: str,
    available_event_ids: Optional[List[str]] = None,
    top_n: int = 5
):
    """
    Get event recommendations for a user.
    
    Args:
        user_id: The ID of the user to get recommendations for
        available_event_ids: Optional list of event IDs to consider
        top_n: Number of recommendations to return (default: 5)
    
    Returns:
        List of recommended events with predicted ratings
    """
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Please train the model first."
        )

    # Get all events or filter by available events
    if available_event_ids:
        events = event_metadata[event_metadata['eventId'].isin(available_event_ids)]
    else:
        events = event_metadata

    if len(events) == 0:
        raise HTTPException(
            status_code=404,
            detail="No events found matching the criteria"
        )

    # Get predictions for all events
    predictions = []
    for _, event in events.iterrows():
        pred = model.predict(user_id, event['eventId'])
        predictions.append({
            'eventId': event['eventId'],
            'predictedRating': pred.est
        })

    # Sort by predicted rating and get top N
    predictions.sort(key=lambda x: x['predictedRating'], reverse=True)
    return predictions[:top_n]

@app.get("/health")
async def health_check():
    """Check if the model is loaded and ready"""
    return {
        "status": "healthy" if model is not None else "model not loaded",
        "model_loaded": model is not None,
        "model_path": MODEL_PATH,
        "metadata_path": METADATA_PATH
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 