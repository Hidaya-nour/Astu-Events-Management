import json
import os
from prisma import Prisma

async def export_feedback_data():
    print("Connecting to database...")
    prisma = Prisma()
    await prisma.connect()

    print("Fetching feedback data...")
    # Get only the essential fields needed for training
    feedback = await prisma.feedback.find_many(
        select={
            'userId': True,
            'eventId': True,
            'rating': True,
        }
    )

    # Create data directory if it doesn't exist
    data_dir = '../data'
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)

    # Save to JSON file
    output_path = os.path.join(data_dir, 'feedback_data.json')
    with open(output_path, 'w') as f:
        json.dump(feedback, f, indent=2)

    print(f"Exported {len(feedback)} feedback records to {output_path}")

    await prisma.disconnect()

if __name__ == "__main__":
    import asyncio
    asyncio.run(export_feedback_data()) 