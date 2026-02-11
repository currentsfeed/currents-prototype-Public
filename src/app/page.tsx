import Image from "next/image";
import Link from "next/link";
import markets from "../../market-data.json";

export default function Home() {
  // Get hero market (first one)
  const heroMarket = markets[0];
  
  // Get grid markets (next 8)
  const gridMarkets = markets.slice(1, 9);
  
  // Get stream markets (remaining)
  const streamMarkets = markets.slice(9);

  // Categories
  const categories = ["All", "Politics", "Technology", "Entertainment", "Sports", "Finance", "Media"];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        {/* Ticker Tape */}
        <div className="bg-gray-900 text-xs py-1.5 px-4 overflow-hidden whitespace-nowrap">
          <div className="inline-flex gap-8 animate-scroll">
            <span>🔴 9 casualties held in Gaza 89% • <span className="text-green-500">Will a ceasefire hold? / Gaza 89%</span> • <span className="text-red-500">Yes, ceasefire failed • 44%</span> • Will Dani Audije be an NBA All... • <span className="text-red-500">Yes, selected All-Star • +62%</span> • <span className="text-green-500">Will Dani Audije be an NBA All... • Yes, selected All-Star • +62%</span></span>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-xl">Currents</span>
            </Link>
            <span className="text-xs text-gray-500">Powered by O</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 rounded text-sm font-medium">
              Ask
            </button>
            <button className="p-2 hover:bg-gray-800 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-800 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="px-4 py-1.5 hover:bg-gray-800 rounded text-sm">Sign In</button>
            <button className="px-4 py-1.5 bg-white text-black hover:bg-gray-200 rounded text-sm font-medium">Sign Up</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroMarket.image || "/placeholder-hero.jpg"}
            alt={heroMarket.question}
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
          <div className="max-w-2xl">
            {/* Category Badge */}
            <div className="inline-block mb-4">
              <span className="text-orange-500 text-xs font-bold tracking-wider uppercase">WORLD</span>
              <span className="text-gray-500 text-xs ml-2">165 SHARE</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              {heroMarket.question}
            </h1>

            {/* Description */}
            <p className="text-gray-400 text-sm mb-6 leading-relaxed max-w-xl">
              Following escalating tensions and direct strikes on US bases in Iraq and Syria by Iranian-backed groups, analysts warn of potential US military retaliation, raising fears of a widening conflict for diplomatic resolution.
            </p>

            {/* The Current - Probability Bar */}
            <div className="mb-6">
              <div className="text-xs text-gray-500 mb-2 font-medium">THE CURRENT</div>
              <div className="flex gap-2 mb-2">
                <div 
                  className="h-2 bg-green-500 rounded-l"
                  style={{ width: `${heroMarket.probability}%` }}
                ></div>
                <div 
                  className="h-2 bg-red-500 rounded-r flex-1"
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <div>
                  <span className="text-green-500 font-medium">YES</span>
                  <span className="text-gray-500 ml-2">{heroMarket.probability}%</span>
                </div>
                <div>
                  <span className="text-gray-500 mr-2">{100 - heroMarket.probability}%</span>
                  <span className="text-red-500 font-medium">NO</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>{heroMarket.volume.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>${heroMarket.volume.toLocaleString()} volume</span>
              </div>
              <button className="text-orange-500 hover:text-orange-400 font-medium">Place Prediction →</button>
            </div>
          </div>

          {/* Percentage Callout */}
          <div className="absolute top-8 right-8 bg-black/80 backdrop-blur-sm px-8 py-6 rounded">
            <div className="text-6xl font-bold">{heroMarket.probability}%</div>
            <div className="text-sm text-green-500 font-medium">Lean to "NO"</div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8 text-sm">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`py-4 font-medium transition-colors ${
                  i === 0 
                    ? "text-orange-500 border-b-2 border-orange-500" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Market Grid */}
      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              <span className="text-orange-500">14:31</span> UTC
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {gridMarkets.map((market) => (
              <div key={market.id} className="group cursor-pointer">
                <div className="relative h-48 mb-3 overflow-hidden rounded">
                  <Image
                    src={market.image || "/placeholder.jpg"}
                    alt={market.question}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                  
                  {/* Percentage Badge */}
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded">
                    <div className="text-2xl font-bold">{market.probability}%</div>
                    <div className="text-[10px] text-green-500">Lean to "Yes"</div>
                  </div>
                </div>

                {/* Category */}
                <div className="text-orange-500 text-xs font-bold tracking-wider mb-2">
                  {market.groupItemTitle?.toUpperCase() || "TECHNOLOGY"}
                </div>

                {/* Question */}
                <h3 className="font-medium text-sm mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors">
                  {market.question}
                </h3>

                {/* Probability Bar */}
                <div className="flex gap-1 mb-2">
                  <div 
                    className="h-1 bg-green-500 rounded-l"
                    style={{ width: `${market.probability}%` }}
                  ></div>
                  <div className="h-1 bg-red-500 rounded-r flex-1"></div>
                </div>

                {/* Stats */}
                <div className="text-xs text-gray-500">
                  {market.volume.toLocaleString()} views
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Stream */}
      <section className="py-12 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">The Stream</h2>
              <p className="text-gray-500 text-sm">Every question, a narrative in motion</p>
            </div>
            <button className="text-orange-500 hover:text-orange-400 text-sm font-medium">
              View all →
            </button>
          </div>

          <div className="space-y-4">
            {streamMarkets.map((market) => (
              <div key={market.id} className="flex gap-4 group cursor-pointer hover:bg-gray-900/50 p-4 rounded transition-colors">
                <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded">
                  <Image
                    src={market.image || "/placeholder.jpg"}
                    alt={market.question}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-orange-500 text-xs font-bold tracking-wider mb-1">
                    {market.groupItemTitle?.toUpperCase() || "MARKETS"}
                  </div>
                  
                  <h3 className="font-medium text-sm mb-2 line-clamp-1 group-hover:text-orange-500 transition-colors">
                    {market.question}
                  </h3>

                  <div className="text-xs text-gray-500 mb-2">
                    {market.volume.toLocaleString()} views
                  </div>

                  <div className="flex gap-1">
                    <div 
                      className="h-1 bg-green-500 rounded-l"
                      style={{ width: `${market.probability}%` }}
                    ></div>
                    <div className="h-1 bg-red-500 rounded-r flex-1"></div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold">{market.probability}%</div>
                  <div className="text-xs text-gray-500">Lean to "Yes"</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">C</span>
              </div>
              <span className="font-bold text-white">Currents</span>
              <span className="ml-2 text-xs">Powered by O</span>
            </div>

            <div className="text-xs">
              Where collective conviction meets the present moment
            </div>

            <div className="flex gap-6 text-xs">
              <Link href="#" className="hover:text-white transition-colors">About</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
