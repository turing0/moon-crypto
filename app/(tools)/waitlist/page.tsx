import EmailForm from "@/components/shared/EmailFom";

export default function Home() {
  return (
    <>
      <section className="grid min-h-screen w-full grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500 px-6 py-12 text-white md:h-full">
          <h2 className="mb-6 text-center text-3xl font-bold md:text-4xl">Revolutionize Your Crypto Trading</h2>
          <ul className="space-y-4 text-lg">
            <li className="flex items-center">
              <svg className="mr-2 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Copy top-performing traders
            </li>
            <li className="flex items-center">
              <svg className="mr-2 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Automate your trading strategy
            </li>
            <li className="flex items-center">
              <svg className="mr-2 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Real-time market insights
            </li>
          </ul>
        </div>
        <main className="flex flex-col justify-center gap-8 px-6 py-12">
          <h1 className="max-w-lg text-4xl font-bold leading-tight text-zinc-900 md:text-5xl">
            Join the Crypto Copy Trading Revolution
          </h1>
          <p className="text-gray-600">
            Be among the first to experience the future of crypto trading.<br />
            Sign up now for exclusive offers and early access.
          </p>
          <EmailForm />
          <p className="text-sm text-gray-500">
            {"By joining, you'll get priority access to our platform and special launch discounts."}
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