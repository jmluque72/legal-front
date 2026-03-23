import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Imágenes de fondo del carrusel. Podés reemplazar con las tuyas en public/images/ (ej. /images/hero-1.jpg).
const HERO_BG_IMAGES = [
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1920&q=80',
  'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=1920&q=80',
]

const INTERVAL_MS = 5500
const FADE_DURATION_MS = 1000

export default function LandingHero() {
  const [index, setIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(0)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setNextIndex((prev) => (prev + 1) % HERO_BG_IMAGES.length)
      setIsFading(true)
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!isFading) return
    const id = setTimeout(() => {
      setIndex(nextIndex)
      setIsFading(false)
    }, FADE_DURATION_MS)
    return () => clearTimeout(id)
  }, [isFading, nextIndex])

  return (
    <section className="relative min-h-[32rem] overflow-hidden bg-primary md:min-h-[36rem]">
      {/* Carrusel de fondo: dos capas para crossfade */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[1000ms] ease-out"
          style={{
            backgroundImage: `url(${HERO_BG_IMAGES[index]})`,
            opacity: isFading ? 0 : 1,
            zIndex: 1,
          }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[1000ms] ease-out"
          style={{
            backgroundImage: `url(${HERO_BG_IMAGES[nextIndex]})`,
            opacity: isFading ? 1 : 0,
            zIndex: 2,
          }}
        />
      </div>
      {/* Overlay oscuro para legibilidad */}
      <div
        className="absolute inset-0 z-[3] bg-gradient-to-br from-primary/92 via-primary/88 to-[#0d2d45]/95"
        aria-hidden
      />
      <div className="absolute right-0 top-1/4 z-[3] h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 z-[3] h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-20 md:grid-cols-2 md:gap-16 md:px-8 md:py-28 lg:py-32">
        <div className="max-w-xl">
          <h1 className="font-heading text-4xl font-bold leading-tight text-white md:text-5xl lg:text-[3.25rem]">
            Evaluamos tu situación sanitaria y legal con{' '}
            <span className="text-accent">rigor técnico</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/90">
            Análisis estructurado, evaluación integral y claridad para que tomes la mejor decisión.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/evaluar"
              className="rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-primary shadow-lg transition hover:bg-accent/90 hover:shadow-xl"
            >
              Evaluar mi caso
            </Link>
            <a
              href="#como-funciona"
              className="rounded-full border-2 border-white/80 px-7 py-3.5 text-base font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              Cómo funciona
            </a>
          </div>
        </div>
        <div className="relative flex justify-center md:justify-end">
          <div className="relative">
            <div className="aspect-square w-full max-w-md rounded-2xl bg-white/5 p-8 backdrop-blur-sm md:p-10">
              <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-accent/20">
                  <svg className="h-12 w-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                </div>
                <div>
                  <p className="font-heading text-xl font-semibold text-white">Análisis médico-legal</p>
                  <p className="mt-1 text-sm text-white/80">Evaluación integral con criterio técnico</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-sm">
              <p className="text-2xl font-bold text-accent">+500</p>
              <p className="text-xs font-medium text-white/90">casos analizados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores del carrusel */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2" aria-hidden>
        {HERO_BG_IMAGES.map((src, i) => (
          <button
            key={src}
            type="button"
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-8 bg-accent' : 'w-2 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Ir a imagen ${i + 1}`}
            onClick={() => {
              setIndex(i)
              setNextIndex(i)
              setIsFading(false)
            }}
          />
        ))}
      </div>
    </section>
  )
}
