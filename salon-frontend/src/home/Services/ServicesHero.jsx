export const ServicesHero=()=>{
    return (<section className="bg-bg container mx-auto">
    
    <div>
            <h1 className="text-6xl text-black font-bold text-center mt-12"> Choose your perfect pampering</h1>
            <p className="text-4xl text-center mx-auto text-gray-600 mt-8">Hair, skin and beauty treatments crafted to match your style and schedule. From haircuts to spa treatments, we offer premium beauty services with expert professionals. Book your appointment online today!</p>
    </div>
   
     <div className="bg-bg to-orange-50  rounded-3xl h-auto shadow-custom py-10 mt-15">
        <h1 className="text-5xl text-heading font-semibold text-center">Popular Salon Services</h1>
        <div className="grid grid-cols-2 py-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 pl-6 pr-6 items-center justify-center gap-5">
            <div className="w-full bg-blue-50 hover:bg-blue-100 transition-all duration-200 rounded py-6 px-6 text-center  mt-12 mb-4">
                <h1 className="text-2xl text-primary font-semibold">Hair cut & Styling</h1>
            </div>
            <div className="w-full bg-blue-50 hover:bg-blue-100 transition-all duration-200 rounded py-6 px-6 text-center  mt-12 mb-4">
                <h1 className="text-2xl text-primary font-semibold">Facial & Skin Care</h1>
            </div>
             <div className="w-full bg-blue-50 hover:bg-blue-100 transition-all duration-200 rounded py-6 px-6 text-center  mt-12 mb-4">
                <h1 className="text-2xl text-primary font-semibold">Hair Spa Treatment</h1>
            </div>
             <div className="w-full bg-blue-50 hover:bg-blue-100 transition-all duration-200 rounded py-6 px-6 text-center  mt-12 mb-4">
                <h1 className="text-2xl text-primary font-semibold">Waxing Services</h1>
            </div>
             <div className="w-full bg-blue-50 hover:bg-blue-100 transition-all duration-200 rounded py-6 px-6 text-center  mt-12 mb-4">
                <h1 className="text-2xl text-primary font-semibold">Beard Grooming</h1>
            </div>
             <div className="w-full bg-blue-50 hover:bg-blue-100 transition-all duration-200 rounded py-6 px-6 text-center  mt-12 mb-4">
                <h1 className="text-2xl text-primary font-semibold">Hair Coloring Service</h1>
            </div>
        </div>
     </div>

    
    </section>)
}