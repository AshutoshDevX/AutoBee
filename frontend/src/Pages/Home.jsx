import React from 'react'

export const Home = () => {
    return (
        <div className="flex flex-col">
            <section className="relative py-16 md:py-28 dotted-background">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mb-8">
                        <h1 className="text-5xl md:text-8xl mb-4 bg-gradient-to-br from-white to-slate-500 font-extrabold tracking-tighter pr-2 pb-2 text-transparent bg-clip-text">Find you dream car with AutoBee AI</h1>
                        <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
                            Advanced AI car search and test drive from thousands of vehicles.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
