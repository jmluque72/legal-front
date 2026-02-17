export default function Cambia() {
  const rows = [
    { before: '✕ Improvisación', after: '✔ Previsibilidad' },
    { before: '✕ Paciente desprotegido', after: '✔ Mejor protección del paciente' },
    { before: '✕ Baja calidad jurídica', after: '✔ Decisiones más fundamentadas' },
    { before: '✕ Trazabilidad nula', after: '✔ Registro auditable completo' },
    { before: '✕ Ética ignorada', after: '✔ Bioética integrada desde el inicio' },
  ]

  return (
    <>
      <div className="section-header">
        <h2>¿Qué cambia con NexoSalud Legal?</h2>
      </div>
      <section className="landing-cambia">
        <div className="landing-cambia-grid">
          {rows.map((row, i) => (
            <div key={i} className="landing-cambia-row">
              <span className="before">{row.before}</span>
              <span className="arrow">→</span>
              <span className="after">{row.after}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
