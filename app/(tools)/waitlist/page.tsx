import EmailForm from "@/components/shared/EmailFom";
import { Check } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <section className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:h-full py-12 px-6 bg-gradient-to-br from-yellow-400 to-orange-500 flex flex-col justify-center items-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Revolutionize Your Crypto Trading</h2>
          <ul className="space-y-4 text-lg">
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Copy top-performing traders
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Automate your trading strategy
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Real-time market insights
            </li>
          </ul>
        </div>
        <main className="flex flex-col gap-8 justify-center px-6 py-12">
          <h1 className="font-bold text-zinc-900 text-4xl md:text-5xl leading-tight max-w-lg">
            Join the Crypto Copy Trading Revolution
          </h1>
          <p className="text-xl text-gray-600">
            Be among the first to experience the future of crypto trading. Sign up now for exclusive offers and early access.
          </p>
          <EmailForm />
          <p className="text-sm text-gray-500">
            By joining, you'll get priority access to our platform and special launch discounts.
          </p>

          {/* <div className="mt-8">
            <h3 className="font-semibold text-lg mb-2">Why Choose Us?</h3>
            <ul className="space-y-2">
              {[
                "Access to a diverse pool of expert traders",
                "Advanced algorithms for optimal trade selection",
                "Customizable risk management settings",
                "Real-time performance tracking and analytics",
                "24/7 customer support"
              ].map((item, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div> */}

        </main>
      </section>
    </>
  )
}