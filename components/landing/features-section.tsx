"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Bot, MapPin, Heart, AlertTriangle, Stethoscope, Users } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Heart,
    title: "Easy Pet Adoption",
    description: "Browse hundreds of adorable pets from verified shelters. Filter by species, age, size, and more to find your perfect match.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Bot,
    title: "AI Pet Advisor",
    description: "Get instant answers to all your pet care questions. Our AI assistant provides personalized advice 24/7.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: AlertTriangle,
    title: "Report Injured Animals",
    description: "Found an injured animal? Report it quickly with location and photos. We will connect you with nearby rescue services.",
    color: "bg-destructive/10 text-destructive",
  },
  {
    icon: MapPin,
    title: "Find Nearby Vets",
    description: "Locate trusted veterinarians in your area. View ratings, hours, and get directions with one click.",
    color: "bg-chart-2/20 text-chart-2",
  },
  {
    icon: Stethoscope,
    title: "Health Tracking",
    description: "Keep track of your pet's vaccinations, medications, and vet visits all in one convenient place.",
    color: "bg-chart-3/20 text-chart-3",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Join a community of pet lovers. Share stories, get advice, and connect with other adopters.",
    color: "bg-chart-4/20 text-chart-4",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">
            Everything You Need for Pet Care
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            From finding your new best friend to keeping them healthy and happy, 
            we have got you covered with powerful tools and resources.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <Card className="h-full border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/20 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
