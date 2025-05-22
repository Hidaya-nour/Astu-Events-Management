import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

export default function FAQPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">Help Center</Badge>
                <h1 className="text-3xl font-bold tracking-tighter text-foreground sm:text-5xl">
                  Frequently Asked Questions
                </h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find answers to common questions about ASTU University events.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-8">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-border mb-4 rounded-lg">
                    <AccordionTrigger className="text-left text-lg font-medium text-foreground px-6">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground px-6 pb-4">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/90">Browse by Topic</Badge>
                <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">FAQ Categories</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find answers specific to your needs.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-2 rounded-lg border-border p-6 text-center shadow-sm bg-card hover:shadow-md hover:border-primary transition-all"
                >
                  <h3 className="text-xl font-bold text-foreground">{category.title}</h3>
                  <p className="text-center text-muted-foreground">{category.description}</p>
                  <Link href={category.link} className="text-sm font-medium text-primary hover:text-primary/90">
                    View FAQs
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background border-t border-border">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/90 mx-auto">Need More Help?</Badge>
              <h2 className="text-3xl font-bold tracking-tighter text-foreground md:text-4xl/tight">
                Still Have Questions?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our event support team is here to help. Contact us anytime and we'll get back to you as soon as
                possible.
              </p>
            </div>
            <div className="mx-auto flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                  Contact Support
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/events">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 px-8"
                >
                  Browse Events
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

const faqs = [
  {
    question: "How do I register for an event?",
    answer:
      "To register for an event, navigate to the specific event page and click the 'Register Now' button. You'll need to fill out a registration form with your details. For some events, you may need to log in with your ASTU student or staff credentials first.",
  },
  {
    question: "Are events open to non-ASTU students?",
    answer:
      "Most academic conferences, cultural events, and public lectures are open to visitors from outside ASTU. However, some workshops and department-specific events may be restricted to ASTU students and staff. Each event page will clearly indicate if it's open to the public or restricted.",
  },
  {
    question: "Is there a fee to attend events?",
    answer:
      "Many events at ASTU are free for students and staff with valid university ID. Some specialized conferences, workshops, and cultural events may have registration fees. The event details page will always display any applicable fees before you register.",
  },
  {
    question: "How can I get a certificate of participation?",
    answer:
      "For events that offer certificates (such as workshops and conferences), you must register in advance and attend the full event. Certificates are typically distributed electronically to the email address you provided during registration within 7 days after the event concludes.",
  },
  {
    question: "Can I cancel my registration?",
    answer:
      "Yes, you can cancel your registration by logging into your account and visiting the 'My Events' section. For free events, you can cancel anytime. For paid events, refund policies vary and are stated on the event page. Generally, cancellations made more than 7 days before the event are eligible for a full refund.",
  },
  {
    question: "Where can I find the schedule for an event?",
    answer:
      "Detailed schedules are published on each event's page. For multi-day events, you can download the full program as a PDF. Schedule updates are communicated via email to registered participants and posted on the event page.",
  },
  {
    question: "Are events recorded or streamed online?",
    answer:
      "Many academic lectures, conferences, and public events are recorded and later made available on ASTU's YouTube channel. Some events also offer live streaming. The event page will indicate if recording or streaming is available.",
  },
  {
    question: "How can I present my research at an ASTU conference?",
    answer:
      "Academic conferences typically have a 'Call for Papers' period where you can submit your research abstract. Visit the specific conference page for submission guidelines, deadlines, and the review process. Submissions are usually evaluated by a committee of faculty members.",
  },
  {
    question: "Can student organizations host events?",
    answer:
      "Yes, recognized student organizations can host events on campus. To organize an event, student groups must submit an Event Request Form through the Student Affairs Office at least 3 weeks before the proposed date. Resources and venues are allocated based on availability.",
  },
  {
    question: "How can I volunteer for an event?",
    answer:
      "Many events need student volunteers. You can apply to volunteer by clicking the 'Volunteer' button on the event page or by contacting the event organizers directly. Volunteers often receive benefits such as free admission, certificates, and networking opportunities.",
  },
]

const categories = [
  {
    title: "Registration & Attendance",
    description: "Information about signing up for events and attendance policies",
    link: "/faq/registration",
  },
  {
    title: "Academic Conferences",
    description: "Details about research presentations and scholarly events",
    link: "/faq/academic",
  },
  {
    title: "Cultural Events",
    description: "Information about cultural celebrations and performances",
    link: "/faq/cultural",
  },
  {
    title: "Workshops & Training",
    description: "Questions about skill-building and professional development events",
    link: "/faq/workshops",
  },
  {
    title: "Student Organizations",
    description: "Information for student clubs hosting or participating in events",
    link: "/faq/student-orgs",
  },
  {
    title: "Venue & Logistics",
    description: "Details about event locations, parking, and accessibility",
    link: "/faq/venues",
  },
]
