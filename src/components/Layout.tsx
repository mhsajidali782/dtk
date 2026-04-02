import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false);
    if (location.pathname !== "/") {
      window.location.href = `/#${sectionId}`;
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/20 px-4 sm:px-10 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link to="/" className="flex items-center gap-4 text-foreground">
          <div className="size-6 text-primary">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">dawntik</h2>
        </Link>
        <div className="hidden sm:flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-foreground/80 hover:text-foreground text-sm font-medium leading-normal transition-colors"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-foreground/80 hover:text-foreground text-sm font-medium leading-normal transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-foreground/80 hover:text-foreground text-sm font-medium leading-normal transition-colors"
            >
              FAQ
            </button>
          </div>
          <Button
            asChild
            className="min-w-[84px] bg-primary text-primary-foreground hover:opacity-90"
          >
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=mhsajidali143@gmail.com&su=Contact from Dawntik" target="_blank" rel="noopener noreferrer">
              Contact Us
            </a>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="sm:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-6 mt-8">
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-foreground text-lg font-medium leading-normal text-left hover:text-primary transition-colors"
                >
                  How it Works
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-foreground text-lg font-medium leading-normal text-left hover:text-primary transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-foreground text-lg font-medium leading-normal text-left hover:text-primary transition-colors"
                >
                  FAQ
                </button>
                <Button
                  asChild
                  className="w-full bg-primary text-primary-foreground hover:opacity-90"
                >
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=mhsajidali143@gmail.com&su=Contact from Dawntik" target="_blank" rel="noopener noreferrer">
                    Contact Us
                  </a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/20 mt-16 py-8 px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2025 dawntik. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
