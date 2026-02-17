export default function EstadoProyecto() {
  const estadoActual = [
    'Arquitectura legal y técnica completa',
    'Protocolos operativos cerrados',
    'Anexos contractuales definidos',
    'Manual del fundador implementado',
    'MVP listo para piloto controlado',
    'Ronda de inversión — búsqueda activa',
    'Lanzamiento de piloto con clientes ancla',
  ]

  const modeloNegocio = [
    'Fee por admisión de caso',
    'Honorarios por módulo',
    'Suscripciones institucionales B2B',
    'Revenue share con abogados',
    'Licenciamiento B2B',
    'Servicios premium — alto impacto',
  ]

  return (
    <>
      <div className="section-header" id="estado-proyecto">
        <h2>Estado del Proyecto & Modelo de Negocio</h2>
      </div>
      <section className="landing-estado-proyecto">
        <div className="estado-proyecto-grid">
          <div className="estado-proyecto-block">
            <h3>Estado actual</h3>
            <ul>
              {estadoActual.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="estado-proyecto-block">
            <h3>Modelo de negocio</h3>
            <ul>
              {modeloNegocio.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
