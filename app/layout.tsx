import Header from "@/components/header";
import "./globals.css";
import { Poppins } from "next/font/google";
import ActiveSectionContextProvider from "@/context/active-section-context";
import Footer from "@/components/footer";
import ThemeContextProvider from "@/context/theme-context";
import { LanguageContextProvider } from "@/context/language-context";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Yassine | Senior Laravel Developer",
  description: "Senior Laravel developer specializing in multi-tenant SaaS platforms, enterprise e-commerce solutions, and advanced admin panels. Expert in Laravel, Filament, Livewire, and modern PHP with 5+ years of experience.",
  keywords: ["Laravel developer", "Senior PHP developer", "Multi-tenant SaaS", "Laravel Filament", "Livewire", "E-commerce development", "Admin panels", "Laravel expert", "PHP", "WebSockets", "API development"],
  authors: [{ name: "Yassine" }],
  creator: "Yassine",
  openGraph: {
    title: "Yassine | Senior Laravel Developer",
    description: "Senior Laravel developer specializing in multi-tenant SaaS platforms, enterprise e-commerce solutions, and advanced admin panels",
    url: "https://yassine-kooli.vercel.app/",
    siteName: "Yassine's Portfolio",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body
        className={`${poppins.className} bg-light text-gray-950 relative pt-28 sm:pt-36 dark:bg-dark dark:text-gray-50 dark:text-opacity-90`}
      >
        <div className="bg-primary-100/50 absolute top-[-6rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-primary-900/20"></div>
        <div className="bg-secondary-100/50 absolute top-[-1rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-secondary-900/20"></div>

        <ThemeContextProvider>
          <LanguageContextProvider>
            <ActiveSectionContextProvider>
              <Header />
              {children}
              <Footer />

              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: 'var(--color-light)',
                    color: 'var(--color-dark)',
                    border: '1px solid var(--color-primary-200)',
                  },
                  className: 'dark:bg-dark dark:text-light dark:border-primary-800',
                }}
              />
            </ActiveSectionContextProvider>
          </LanguageContextProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
