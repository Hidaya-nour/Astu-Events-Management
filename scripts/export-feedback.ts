const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function exportFeedback() {
  try {
    // Fetch all feedback data
    const feedbacks = await prisma.feedback.findMany({
      select: {
        userId: true,
        eventId: true,
        rating: true,
      },
    })

    // Create the output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Write to JSON file
    const outputPath = path.join(outputDir, 'feedback_data.json')
    fs.writeFileSync(
      outputPath,
      JSON.stringify(feedbacks, null, 2),
      'utf-8'
    )

    console.log(`Successfully exported ${feedbacks.length} feedback records to ${outputPath}`)
  } catch (error) {
    console.error('Error exporting feedback data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the export function
exportFeedback() 