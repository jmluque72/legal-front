import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Problema from '../components/Problema'
import QueEs from '../components/QueEs'
import ComoFunciona from '../components/ComoFunciona'
import Diferenciadores from '../components/Diferenciadores'
import Modulos from '../components/Modulos'
import CtaFinal from '../components/CtaFinal'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Problema />
      <QueEs />
      <ComoFunciona />
      <Diferenciadores />
      <Modulos />
      <CtaFinal />
      <Contact />
      <Footer />
    </>
  )
}
