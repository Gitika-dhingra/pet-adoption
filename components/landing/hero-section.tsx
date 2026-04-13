"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, Search, Shield } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background pb-16 pt-8 md:pb-24 md:pt-12">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/4 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Heart className="h-4 w-4" />
              Over 10,000 pets found their forever homes
            </div>
            
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Find Your Perfect{" "}
              <span className="text-primary">Furry Companion</span>
            </h1>
            
            <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
              Connect with adorable pets waiting for a loving home. Get AI-powered care advice, 
              find nearby vets, and help injured animals in your community.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button size="lg" asChild className="gap-2 text-base">
                <Link href="/pets">
                  <Search className="h-5 w-5" />
                  Find a Pet
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2 text-base">
                <Link href="/report">
                  <Shield className="h-5 w-5" />
                  Report Injured Animal
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                  <Shield className="h-4 w-4 text-accent" />
                </div>
                <span>Verified Shelters</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                  <Heart className="h-4 w-4 text-primary" />
                </div>
                <span>24/7 Support</span>
              </div>
            </div>
          </motion.div>

          {/* Image Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto max-w-lg lg:max-w-none"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl bg-card shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=500&fit=crop"
                    alt="Happy golden retriever"
                    className="h-64 w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl bg-card shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop"
                    alt="Cute tabby cat"
                    className="h-40 w-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="overflow-hidden rounded-2xl bg-card shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop"
                    alt="Two dogs playing"
                    className="h-40 w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl bg-card shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=500&fit=crop"
                    alt="Orange cat looking up"
                    className="h-64 w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -bottom-4 -left-4 rounded-xl bg-card p-4 shadow-xl md:-left-8"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                  <ArrowRight className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-semibold">500+ Pets</p>
                  <p className="text-sm text-muted-foreground">Available now</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
