import React from 'react'
import { trips } from './data'
import { Plane, Ship, MapPin, DollarSign, Calendar, Star, AlertTriangle } from 'lucide-react'

function TripCard({ trip }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow flex flex-col h-full relative group">
      {trip.isRecommended && (
        <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full z-10 flex items-center shadow-md">
          <Star className="w-3 h-3 mr-1" />
          Recomendado
        </div>
      )}
      <div className="h-48 overflow-hidden relative">
        <img 
          src={trip.image} 
          alt={trip.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-xl font-bold text-white">{trip.name}</h3>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded border border-blue-200 inline-block">
            {trip.type}
          </span>
          <span className="font-bold text-lg text-emerald-600">{trip.price}</span>
        </div>
        
        <div className="space-y-2 mb-4 text-sm text-gray-600 flex-1">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            {trip.location}
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            {trip.duration}
          </div>
        </div>
        
        <p className="text-gray-700 text-sm mb-4 leading-relaxed">
          {trip.description}
        </p>

        {trip.cons && (
          <div className="mt-auto bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-start border border-red-100">
            <AlertTriangle className="w-4 h-4 mr-2 shrink-0 mt-0.5 text-red-500" />
            <p>{trip.cons}</p>
          </div>
        )}
        
        <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          Cotizar Ahora
        </button>
      </div>
    </div>
  )
}

function App() {
  const recommendedTrips = trips.filter(t => t.isRecommended);
  const otherTrips = trips.filter(t => !t.isRecommended);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-indigo-900 tracking-tight">Skips Travel</h1>
          </div>
          <nav className="hidden md:flex gap-6 font-medium text-gray-600">
            <a href="#destinos" className="hover:text-indigo-600 transition-colors">Destinos</a>
            <a href="#cruceros" className="hover:text-indigo-600 transition-colors">Cruceros</a>
            <a href="#contacto" className="hover:text-indigo-600 transition-colors">Contacto</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-indigo-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/huatulco.jpg" 
            alt="Huatulco Beach" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
            Tu Luna de Miel Perfecta
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-100">
            Descubre nuestras opciones cuidadosamente seleccionadas para mayo 2027. Desde playas paradisíacas hasta cruceros premium.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Recommended Section */}
        <section>
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900 inline-flex items-center justify-center">
              <Star className="w-8 h-8 text-yellow-400 mr-3 fill-yellow-400" />
              Nuestras Recomendaciones Top
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Las mejores opciones con excelente relación calidad-precio y sin riesgo de sargazo para tu viaje en mayo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Other Options */}
        <section id="destinos">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Más Opciones y Destinos</h2>
            <p className="mt-2 text-gray-600">Explora alternativas que se ajustan a distintos presupuestos y estilos de viaje.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {otherTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12" id="contacto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 opacity-50">
            <Plane className="w-6 h-6" />
            <h2 className="text-xl font-bold text-white tracking-tight">Skips Travel</h2>
          </div>
          <p>Precios estimados sujetos a disponibilidad y cambio sin previo aviso.</p>
          <p className="mt-2">Mayo 2027 • CDMX / AIFA</p>
        </div>
      </footer>
    </div>
  )
}

export default App
