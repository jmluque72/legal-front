export default function Contact() {
  return (
    <section className="landing-contact" id="contacto">
      <h2>Contacto</h2>
      <form>
        <input type="text" placeholder="Nombre" />
        <input type="email" placeholder="Email" />
        <textarea placeholder="Mensaje"></textarea>
        <button type="submit">Enviar</button>
      </form>
    </section>
  )
}