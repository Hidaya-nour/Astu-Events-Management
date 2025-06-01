import json
import pandas as pd
import pickle
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
from surprise import accuracy
import os

def train_recommender_model():
    # Get the absolute path to the project root
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    
    print("Loading feedback data...")
    # Load feedback data
    feedback_path = os.path.join(project_root, 'data', 'feedback_data.json')
    with open(feedback_path, 'r') as f:
        feedback = json.load(f)

    # Convert to DataFrame
    df = pd.DataFrame(feedback)
    print(f"Loaded {len(df)} feedback records")

    # Create Surprise dataset
    reader = Reader(rating_scale=(1, 5))
    data = Dataset.load_from_df(df[['userId', 'eventId', 'rating']], reader)

    # Split into train and test sets
    print("Splitting data into train and test sets...")
    trainset, testset = train_test_split(data, test_size=0.2, random_state=42)

    # Train the SVD model
    print("Training SVD model...")
    algo = SVD(n_factors=100, n_epochs=20, lr_all=0.005, reg_all=0.02)
    algo.fit(trainset)

    # Evaluate the model
    print("Evaluating model...")
    predictions = algo.test(testset)
    rmse = accuracy.rmse(predictions)
    print(f"RMSE: {rmse}")

    # Save the model
    print("Saving model...")
    model_dir = os.path.join(os.path.dirname(__file__), 'models')
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)
    
    model_path = os.path.join(model_dir, 'model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(algo, f)
    
    print(f"Model saved to {model_path}")

    # Save event metadata for later use
    event_metadata = df[['eventId']].drop_duplicates()
    metadata_path = os.path.join(model_dir, 'event_metadata.pkl')
    with open(metadata_path, 'wb') as f:
        pickle.dump(event_metadata, f)
    
    print(f"Event metadata saved to {metadata_path}")

    return algo

if __name__ == "__main__":
    train_recommender_model() 