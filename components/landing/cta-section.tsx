"use client"

import { Button } from "@/components/ui/button"
import { PawPrint, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function CTASection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-8 text-center md:p-16"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl" />
          </div>

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20 mb-6">
            <PawPrint className="h-8 w-8 text-primary-foreground" />
          </div>

          <h2 className="mb-4 text-balance text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
            Ready to Find Your New Best Friend?
          </h2>
          
          <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-primary-foreground/90">
            Thousands of adorable pets are waiting for a loving home. 
            Start your journey today and give a deserving animal a second chance at happiness.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button 
              size="lg" 
              variant="secondary" 
              asChild 
              className="gap-2 text-base"
            >
              <Link href="/pets">
                Browse Available Pets
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild 
              className="gap-2 border-primary-foreground/30 bg-transparent text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="/auth/sign-up">
                Create Free Account
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
