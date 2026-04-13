import Link from "next/link"
import { PawPrint, Heart } from "lucide-react"

const footerLinks = {
  adopt: [
    { name: "Dogs", href: "/pets?species=dog" },
    { name: "Cats", href: "/pets?species=cat" },
    { name: "Other Pets", href: "/pets?species=other" },
    { name: "How to Adopt", href: "/how-to-adopt" },
  ],
  resources: [
    { name: "AI Pet Advisor", href: "/chat" },
    { name: "Find Veterinarians", href: "/vets" },
    { name: "Report Injured Animal", href: "/report" },
    { name: "Pet Care Tips", href: "/tips" },
  ],
  about: [
    { name: "Our Mission", href: "/about" },
    { name: "Partner Shelters", href: "/shelters" },
    { name: "Success Stories", href: "/stories" },
    { name: "Contact Us", href: "/contact" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <PawPrint className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">PawFinder</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting loving families with pets in need. Every adoption creates a forever bond.
            </p>
          </div>

          {/* Adopt */}
          <div>
            <h3 className="mb-4 font-semibold">Adopt</h3>
            <ul className="space-y-2">
              {footerLinks.adopt.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 font-semibold">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="mb-4 font-semibold">About</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PawFinder. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Made with <Heart className="h-4 w-4 fill-destructive text-destructive" /> for animals everywhere
          </p>
        </div>
      </div>
    </footer>
  )
}
