import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PawPrint, AlertTriangle, ArrowLeft } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-secondary/50 to-background px-4">
      <Card className="w-full max-w-md border-border/50 text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription>
            Something went wrong during the authentication process.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            This could happen if the link has expired, already been used, or if there 
            was a problem with your request. Please try again.
          </p>

          <div className="flex flex-col gap-3">
            <Button asChild className="gap-2">
              <Link href="/auth/login">
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
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
