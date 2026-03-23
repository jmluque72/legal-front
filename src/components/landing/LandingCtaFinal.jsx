import { Link } from 'react-router-dom'

export default function LandingCtaFinal() {
  return (
    <section className="bg-primary py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
        <h2 className="font-heading text-3xl font-bold leading-tight text-white md:text-4xl">
          Obtén claridad sobre tu situación sanitaria y legal
        </h2>
        <p className="mt-4 text-lg text-white/90">
          No prometemos milagros. Prometemos orden, criterio y humanidad en los conflictos de salud.
        </p>
        <p className="mt-2 text-white/80">
          Cuéntanos tu caso y te orientamos con rigor técnico.
        </p>
        <Link
          to="/evaluar"
          className="mt-10 inline-block rounded-full bg-accent px-8 py-4 text-lg font-semibold text-primary shadow-lg transition hover:bg-accent/90 hover:shadow-xl"
        >
          Evaluar mi caso
        </Link>
      </div>
    </section>
  )
}
