import React from 'react'

import Header1 from './mvpblocks/header-1'
import { ShoppingCart, Zap } from 'lucide-react'
import SearchBar from './SearchBar'
import FooterGlow from './mvpblocks/footer-glow'

const Navbar = () => {
    const handleSearchResults = (results) => {
        console.log('Search results:', results);
        
      };
  return (
    <>
    <Header1 />
    {/* hero section */}
    <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                
                  <h2 className="text-5xl font-bold text-primary leading-tight">
                    Find the Best Deals
                    <span className="block text-pink-600">Across the Web</span>
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    Compare prices from thousands of stores and save money on every purchase. 
                    Get real-time price comparisons and never overpay again.
                  </p>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-pink-600" />
                    <span className="text-foreground">Thousands of stores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-pink-600" />
                    <span className="text-foreground">Real-time prices</span>
                  </div>
                </div>

                <SearchBar onSearchResults={handleSearchResults} />
              </div>

              <div className="lg:order-last">
                <img 
                  src="https://ee6e71de-40c3-469e-815f-d91b84ccfac9.lovableproject.com/src/assets/hero-shopping.jpg"
                  alt="Price comparison illustration" 
                  className="w-full h-auto rounded-2xl shadow-card"
                />
              </div>
            </div>
          </div>
        </section>

        <FooterGlow />
    </>
  )
}

export default Navbar