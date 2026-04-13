import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PawPrint, Mail, ArrowRight } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-secondary/50 to-background px-4">
      <Card className="w-full max-w-md border-border/50 text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
            <Mail className="h-8 w-8 text-accent" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>
            We&apos;ve sent you a confirmation link to verify your email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Click the link in the email to activate your account and start exploring 
            adorable pets waiting for their forever homes.
          </p>
          
          <div className="rounded-lg bg-secondary/50 p-4">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or request a new confirmation link.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild className="gap-2">
              <Link href="/pets">
                Browse Pets While You Wait
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <PawPrint className="mr-2 h-4 w-4" />
                Return to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
