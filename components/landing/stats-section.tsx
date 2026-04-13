"use client"

import { motion } from "framer-motion"

const stats = [
  { value: "10,000+", label: "Pets Adopted" },
  { value: "500+", label: "Partner Shelters" },
  { value: "50,000+", label: "Happy Families" },
  { value: "98%", label: "Satisfaction Rate" },
]

export function StatsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-primary p-8 md:p-12"
        >
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mb-2 text-4xl font-bold text-primary-foreground md:text-5xl">
                  {stat.value}
                </div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
