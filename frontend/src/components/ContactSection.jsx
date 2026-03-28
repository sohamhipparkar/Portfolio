import { ArrowUpRight } from 'lucide-react'

export default function ContactSection({ mailIcon, githubIcon, linkedinIcon }) {
  const links = [
    { img: mailIcon, lbl: 'Email', val: 'sohamhipparkar@gmail.com', href: 'mailto:sohamhipparkar@gmail.com' },
    { img: githubIcon, lbl: 'GitHub', val: 'github.com/sohamhipparkar', href: 'https://github.com/sohamhipparkar' },
    { img: linkedinIcon, lbl: 'LinkedIn', val: 'linkedin.com/in/soham-hipparkar', href: 'https://linkedin.com/in/soham-hipparkar' },
  ]

  const fields = [
    { type: 'text', ph: 'Driver Name' },
    { type: 'email', ph: 'Team Radio Frequency' },
    { type: 'text', ph: 'Subject' },
  ]

  return (
    <section id="contact" className="section">
      <div className="sec-label">04 - Team Radio</div>
      <div className="contact-grid">
        <div>
          <h2 className="contact-big">Ready to<br />build<br /><span className="red">something</span><br />fast?</h2>
          <p className="contact-desc">Open to new projects, collaborations, and opportunities. Drop me a message - I respond quickly. Always.</p>
          <div className="radio-links">
            {links.map(({ img, lbl, val, href }) => (
              <a key={lbl} href={href} className="radio-link">
                <div className="radio-left">
                  <img src={img} alt={`${lbl} icon`} style={{ width: 14, height: 14, objectFit: 'contain' }} />
                  <div>
                    <div className="radio-lbl">{lbl}</div>
                    <div className="radio-val">{val}</div>
                  </div>
                </div>
                <ArrowUpRight size={15} className="radio-arrow" />
              </a>
            ))}
          </div>
        </div>
        <div className="pit-form">
          {fields.map((field) => (
            <div key={field.ph} className="pit-field"><input type={field.type} placeholder={field.ph} /></div>
          ))}
          <div className="pit-field"><textarea placeholder="Your Message" rows={5} /></div>
          <div className="pit-submit">
            <button className="btn-f1 primary">Send Transmission <ArrowUpRight size={13} /></button>
          </div>
        </div>
      </div>
    </section>
  )
}
