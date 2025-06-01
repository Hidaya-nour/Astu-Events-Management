# AI Event Recommender

This module contains the AI recommender system for the ASTU Events platform. It uses collaborative filtering to recommend events to users based on their and others' feedback.

## Setup

1. Install the required packages:
```bash
pip install -r requirements.txt
```

2. Make sure you have the feedback data:
- The feedback data should be in `../data/feedback_data.json`
- The file should contain user feedback with fields: userId, eventId, rating

## Training the Model

To train the recommender model:

```bash
python train_model.py
```

This will:
1. Load the feedback data
2. Train an SVD model
3. Evaluate the model using RMSE
4. Save the trained model to `models/model.pkl`
5. Save event metadata to `models/event_metadata.pkl`

## Model Details

- Algorithm: SVD (Singular Value Decomposition)
- Features: 100 latent factors
- Training epochs: 20
- Learning rate: 0.005
- Regularization: 0.02

## Output Files

- `models/model.pkl`: The trained recommender model
- `models/event_metadata.pkl`: Event metadata for making recommendations 