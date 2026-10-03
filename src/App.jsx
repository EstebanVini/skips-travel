import { useEffect, useRef, useState } from 'react'
import { trips, generalLinks } from './data'
import {
  Plane, Ship, Hotel, Package, Info, MapPin, Calendar, Star, AlertTriangle, X,
  ChevronLeft, ChevronRight, ExternalLink, Images, Users, Wallet, Check,
} from 'lucide-react'

const LINK_ICONS = { vuelo: Plane, hotel: Hotel, crucero: Ship, paquete: Package, info: Info }

function Carousel({ images, name }) {
  const ref = useRef(null)
  const [index, setIndex] = useState(0)
  const n = images.length
  const goTo = i => ref.current.scrollTo({ left: ref.current.clientWidth * ((i + n) % n), behavior: 'smooth' })
  const current = images[index]

  return (
    <div className="relative bg-slate-900">
      <div
        ref={ref}
        onScroll={e => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar aspect-[16/9] max-h-[60vh] w-full"
      >
        {images.map((img, i) => (
          <img key={img.src} src={img.src} alt={`${name}: ${img.title}`} loading={i ? 'lazy' : 'eager'}
            className="w-full h-full object-cover shrink-0 snap-center" />
        ))}
      </div>
      {n > 1 && (
        <>
          <button onClick={() => goTo(index - 1)} aria-label="Foto anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 text-slate-900 shadow-lg backdrop-blur hover:bg-white">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => goTo(index + 1)} aria-label="Foto siguiente"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 text-slate-900 shadow-lg backdrop-blur hover:bg-white">
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((img, i) => (
              <button key={img.src} onClick={() => goTo(i)} aria-label={`Ver foto ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/60'}`} />
            ))}
          </div>
        </>
      )}
      <p className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent px-4 pb-2 pt-6 text-[11px] text-white/80">
        {current.title} · Foto: <a href={current.page} target="_blank" rel="noreferrer" className="underline">{current.author}</a> ({current.license}, Wikimedia Commons)
      </p>
    </div>
  )
}

function LinkButton({ link }) {
  const Icon = LINK_ICONS[link.kind] ?? ExternalLink
  return (
    <a href={link.url} target="_blank" rel="noreferrer"
      className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-teal-600 hover:text-teal-700 hover:shadow-sm">
      <Icon className="h-4 w-4 shrink-0 text-teal-600" />
      <span className="flex-1">{link.label}</span>
      <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-teal-600" />
    </a>
  )
}

function Section({ title, children }) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-teal-700">{title}</h3>
      {children}
    </section>
  )
}

function TripDialog({ trip, onClose }) {
  const ref = useRef(null)
  useEffect(() => ref.current.showModal(), [])

  return (
    <dialog ref={ref} onClose={onClose} onClick={e => e.target === ref.current && ref.current.close()}
      className="m-auto w-[min(64rem,calc(100%-1.5rem))] max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-2xl bg-slate-50 p-0 shadow-2xl backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm">
      <div className="relative">
        <Carousel images={trip.images} name={trip.name} />
        <button onClick={() => ref.current.close()} aria-label="Cerrar"
          className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white backdrop-blur hover:bg-black/70">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-8 p-6 sm:p-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-teal-700">{trip.type}</span>
            <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">{trip.name}</h2>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{trip.location}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{trip.duration}</span>
            </p>
          </div>
          <div className="sm:text-right">
            <p className="font-display text-3xl font-semibold text-teal-700">{trip.price}</p>
            <p className="text-sm text-slate-500">{trip.priceAlt} · total para 2</p>
          </div>
        </header>

        <p className="text-base leading-relaxed text-slate-700">{trip.summary}</p>

        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p><strong>A considerar:</strong> {trip.cons}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="space-y-8 lg:col-span-3">
            <Section title="Itinerario sugerido">
              <ol className="relative space-y-5 border-l-2 border-teal-100 pl-6">
                {trip.itinerary.map(d => (
                  <li key={d.day} className="relative">
                    <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-white bg-teal-600 ring-2 ring-teal-100" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{d.day}</p>
                    <p className="font-semibold text-slate-900">{d.title}</p>
                    <p className="text-sm text-slate-600">{d.detail}</p>
                  </li>
                ))}
              </ol>
            </Section>

            <Section title="Actividades recomendadas">
              <ul className="grid gap-2 sm:grid-cols-2">
                {trip.activities.map(a => (
                  <li key={a} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />{a}
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          <div className="space-y-8 lg:col-span-2">
            <Section title="Reservar">
              <div className="space-y-2">
                {trip.links.map(l => <LinkButton key={l.url + l.label} link={l} />)}
              </div>
            </Section>

            <Section title="Desglose estimado (MXN)">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-200">
                  {trip.costs.map(([label, amount]) => (
                    <tr key={label}>
                      <td className="py-2 pr-3 text-slate-600">{label}</td>
                      <td className="py-2 text-right font-medium tabular-nums text-slate-900">{amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          </div>
        </div>

        {trip.alternatives && (
          <Section title="Otros hoteles en el destino">
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full min-w-[32rem] text-sm">
                <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr><th className="px-4 py-2">Hotel</th><th className="px-4 py-2">Por noche</th><th className="px-4 py-2">Total 4 / 5 noches</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trip.alternatives.map(h => (
                    <tr key={h.name}>
                      <td className="px-4 py-3">
                        <a href={h.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-teal-700 hover:underline">
                          {h.name}<ExternalLink className="h-3 w-3" />
                        </a>
                        <p className="text-xs text-slate-500">{h.type}</p>
                      </td>
                      <td className="px-4 py-3 tabular-nums">{h.night}</td>
                      <td className="px-4 py-3 tabular-nums">{h.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}
      </div>
    </dialog>
  )
}

function TripCard({ trip, onOpen }) {
  const Icon = trip.type === 'Crucero' ? Ship : Hotel
  return (
    <button onClick={onOpen}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={trip.images[0].src} alt={trip.name} loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        {trip.isRecommended && (
          <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-950 shadow">
            <Star className="h-3 w-3 fill-current" /> Recomendado
          </span>
        )}
        <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-xs text-white backdrop-blur">
          <Images className="h-3 w-3" /> {trip.images.length}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-white/80">
            <Icon className="h-3.5 w-3.5" />{trip.type}
          </p>
          <h3 className="font-display text-2xl font-semibold leading-tight text-white">{trip.name}</h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 space-y-1 text-sm text-slate-500">
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{trip.location}</p>
          <p className="flex items-center gap-2"><Calendar className="h-4 w-4" />{trip.duration}</p>
        </div>
        <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-700">{trip.description}</p>
        <div className="flex items-end justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-500">Total estimado para 2</p>
            <p className="font-display text-2xl font-semibold text-teal-700">{trip.price}</p>
          </div>
          <span className="flex items-center gap-1 text-sm font-semibold text-teal-700 transition group-hover:gap-2">
            Ver detalles <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </button>
  )
}

function SectionTitle({ eyebrow, title, children }) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">{title}</h2>
      <p className="mt-3 text-slate-600">{children}</p>
    </div>
  )
}

const FACTS = [
  [Calendar, 'Fechas', '3 al 7 u 8 de mayo, 2027'],
  [Users, 'Viajeros', '2 adultos'],
  [Plane, 'Salida', 'CDMX (AICM o AIFA)'],
  [Wallet, 'Presupuesto', '$30,000 – $50,000 MXN'],
]

function App() {
  const [selected, setSelected] = useState(null)
  const recommended = trips.filter(t => t.isRecommended)
  const cruises = trips.filter(t => !t.isRecommended && t.type === 'Crucero')
  const beaches = trips.filter(t => !t.isRecommended && t.type !== 'Crucero')
  const grid = list => list.map(t => <TripCard key={t.id} trip={t} onOpen={() => setSelected(t)} />)

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-900">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-2 text-white">
            <Plane className="h-5 w-5 text-teal-300" />
            <span className="font-display text-xl font-semibold tracking-tight">Skips Travel</span>
          </a>
          <nav className="hidden gap-8 text-sm font-medium text-white/80 md:flex">
            <a href="#recomendados" className="hover:text-white">Recomendados</a>
            <a href="#destinos" className="hover:text-white">Playas</a>
            <a href="#cruceros" className="hover:text-white">Cruceros</a>
            <a href="#antes" className="hover:text-white">Antes de reservar</a>
          </nav>
        </div>
      </header>

      <div className="relative isolate flex min-h-[85vh] items-end overflow-hidden">
        <img src={trips[0].images[0].src} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/20" />
        <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-300">Propuesta de luna de miel · Mayo 2027</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[1.05] text-white sm:text-7xl">
            Playas del Pacífico y cruceros, todo incluido
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/80">
            Diez opciones investigadas y comparadas, de la más económica a la más especial. Haz clic en cualquiera para ver itinerario, actividades, fotos y links para reservar.
          </p>
          <dl className="mt-10 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/15 ring-1 ring-white/15 backdrop-blur md:grid-cols-4">
            {FACTS.map(([Icon, label, value]) => (
              <div key={label} className="bg-slate-950/40 p-4">
                <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/60"><Icon className="h-3.5 w-3.5" />{label}</dt>
                <dd className="mt-1 text-sm font-semibold text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <main className="mx-auto max-w-7xl space-y-24 px-4 py-20 sm:px-6 lg:px-8">
        <section id="recomendados" className="scroll-mt-24">
          <SectionTitle eyebrow="Top 3" title="Nuestras recomendaciones">
            La mejor combinación de experiencia, precio y clima para mayo: mar del Pacífico sin sargazo o un crucero distinto.
          </SectionTitle>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">{grid(recommended)}</div>
        </section>

        <section id="destinos" className="scroll-mt-24">
          <SectionTitle eyebrow="Resorts todo incluido" title="Más destinos de playa">
            Alternativas para distintos presupuestos. En cada una encontrarás otros hoteles del mismo destino.
          </SectionTitle>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">{grid(beaches)}</div>
        </section>

        <section id="cruceros" className="scroll-mt-24">
          <SectionTitle eyebrow="Desde EE. UU." title="Más cruceros">
            Todos zarpan el 3 de mayo entre 15:30 y 16:00. Requieren pasaporte y visa B1/B2 vigente para los dos.
          </SectionTitle>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">{grid(cruises)}</div>
        </section>

        <section id="antes" className="scroll-mt-24 rounded-3xl bg-slate-900 p-8 text-slate-300 sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">Antes de reservar</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">Lo básico para presupuestar</h2>
          <div className="mt-10 grid gap-12 lg:grid-cols-2">
            <ul className="space-y-4 text-sm leading-relaxed">
              <li><strong className="text-white">Clima:</strong> mayo es temporada seca en el Pacífico; la temporada de huracanes empieza el 15 de mayo. En el Caribe, mayo coincide con el pico de sargazo.</li>
              <li><strong className="text-white">Documentos:</strong> INE o pasaporte para destinos nacionales; pasaporte con 6 meses de vigencia y visa B1/B2 para cruceros.</li>
              <li><strong className="text-white">Beneficio de luna de miel:</strong> avisen al reservar y lleven el acta de matrimonio; muchos resorts dan vino, decoración o upgrade.</li>
              <li><strong className="text-white">Cuándo comprar:</strong> aparten el hotel ya (con cancelación gratuita) y compren los vuelos nacionales con 5 a 8 semanas de anticipación.</li>
              <li><strong className="text-white">Margen:</strong> dejen libre entre 10 y 15% del presupuesto (~$4,000–6,000) para tours, spa o cambios de tarifa.</li>
            </ul>
            <div>
              <p className="mb-3 text-sm font-semibold text-white">Comparar paquetes y vuelos</p>
              <div className="grid gap-2 sm:grid-cols-2">{generalLinks.map(l => <LinkButton key={l.url} link={l} />)}</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-10 text-center text-sm text-slate-500">
        <p>Precios estimados para 2 personas (tipo de cambio $17.50 MXN/USD), investigados en octubre de 2026. Sujetos a disponibilidad.</p>
        <p className="mt-1">Fotos de Wikimedia Commons; autor y licencia en cada galería.</p>
      </footer>

      {selected && <TripDialog key={selected.id} trip={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

export default App
