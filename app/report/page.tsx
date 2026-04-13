import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ReportForm } from "@/components/report/report-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Report Injured Animal | PawFinder",
  description: "Found an injured animal? Report it quickly with location and photos. We will connect you with nearby rescue services.",
}

export default function ReportPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold md:text-4xl">Report an Injured Animal</h1>
              <p className="text-muted-foreground">
                Help us rescue animals in need. Provide as much detail as possible so we can respond quickly.
              </p>
            </div>
            <ReportForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
