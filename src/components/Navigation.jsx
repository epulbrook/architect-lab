import React from 'react'

function Navigation() {
  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold">The Architects</h1>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <a href="#" className="px-3 py-2 text-sm font-medium">Home</a>
              <a href="#" className="px-3 py-2 text-sm font-medium">About</a>
              <a href="#" className="px-3 py-2 text-sm font-medium">Work</a>
              <a href="#" className="px-3 py-2 text-sm font-medium">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation 