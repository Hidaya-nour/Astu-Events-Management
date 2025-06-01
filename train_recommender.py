import json
import pandas as pd
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
from surprise import accuracy

# Load feedback data
with open('data/feedback_data.json', 'r') as f:
    feedback = json.load(f)

# Convert to DataFrame
df = pd.DataFrame(feedback)

# Surprise expects columns: user, item, rating
reader = Reader(rating_scale=(1, 5))  # Adjust if your ratings use a different scale
data = Dataset.load_from_df(df[['userId', 'eventId', 'rating']], reader)

# Split into train and test
trainset, testset = train_test_split(data, test_size=0.2, random_state=42)

# Build and train the SVD model
algo = SVD()
algo.fit(trainset)

# Evaluate on test set
predictions = algo.test(testset)
print("RMSE:", accuracy.rmse(predictions))

# Example: Recommend top 5 events for a user
def get_top_n_recommendations(algo, user_id, event_ids, n=5):
    # Predict ratings for all events the user hasn't rated
    predictions = [algo.predict(user_id, event_id) for event_id in event_ids]
    # Sort by estimated rating
    predictions.sort(key=lambda x: x.est, reverse=True)
    return predictions[:n]

# Get all unique event IDs
all_event_ids = df['eventId'].unique()

# Example usage
user_id = df['userId'].iloc[0]  # Replace with the user you want recommendations for
top_n = get_top_n_recommendations(algo, user_id, all_event_ids)
print(f"Top recommendations for user {user_id}:")
for pred in top_n:
    print(f"Event: {pred.iid}, Predicted Rating: {pred.est:.2f}")