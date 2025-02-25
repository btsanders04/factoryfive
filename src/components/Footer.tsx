// Footer component
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-6">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Sanders Factory Five MK5 Build Journey
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link 
              href="/privacy" 
              className="text-muted-foreground hover:text-primary-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="text-muted-foreground hover:text-primary-400 transition-colors"
            >
              Terms of Use
            </Link>
            <Link 
              href="/contact" 
              className="text-muted-foreground hover:text-primary-400 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};