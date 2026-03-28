import { useEffect, useState } from "react";

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth="0" />
  </svg>
);

const socialLinks = [
  {
    icon: GitHubIcon,
    href: "https://github.com/sohamhipparkar",
    label: "GitHub",
  },
  {
    icon: LinkedInIcon,
    href: "https://linkedin.com/in/soham-hipparkar",
    label: "LinkedIn",
  },
  {
    icon: InstagramIcon,
    href: "https://instagram.com/soham_9105",
    label: "Instagram",
  },
  {
    icon: MailIcon,
    href: "mailto:sohamhipparkar09@gmail.com",
    label: "Email",
  },
];

export default function PortfolioSideElements() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');

        .side-socials {
          position: fixed;
          left: 6px;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          opacity: ${visible ? 1 : 0};
          transform: translateY(${visible ? "0px" : "12px"});
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .side-socials::after {
          content: '';
          display: block;
          width: 1px;
          height: 64px;
          background: linear-gradient(to bottom, rgba(160,160,160,0.5), transparent);
          margin-top: 6px;
        }

        .side-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 6px;
          color: #888;
          text-decoration: none;
          transition: color 0.2s ease, background 0.2s ease, transform 0.2s ease;
          position: relative;
        }

        .side-link:hover {
          color: #e8e8e8;
          background: rgba(255,255,255,0.07);
          transform: translateY(-2px);
        }

        .side-link::before {
          content: attr(aria-label);
          position: absolute;
          left: 38px;
          background: rgba(20,20,20,0.92);
          color: #d0d0d0;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.04em;
          padding: 3px 7px;
          border-radius: 4px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.18s ease, transform 0.18s ease;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .side-link:hover::before {
          opacity: 1;
          transform: translateX(0);
        }

        .avail-tag {
          position: fixed;
          right: 28px;
          bottom: 0;
          writing-mode: vertical-rl;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          color: #666;
          text-transform: uppercase;
          padding-bottom: 72px;
          opacity: ${visible ? 1 : 0};
          transform: translateY(${visible ? "0px" : "12px"});
          transition: opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s;
          user-select: none;
        }

        .avail-tag::after {
          content: '';
          display: block;
          width: 1px;
          height: 64px;
          background: linear-gradient(to bottom, rgba(160,160,160,0.5), transparent);
          position: absolute;
          bottom: 0;
          left: 50%;
        }

        .avail-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 6px #4ade80;
          animation: pulse 2.4s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #4ade80; }
          50% { opacity: 0.55; box-shadow: 0 0 12px #4ade80; }
        }
      `}</style>

      <div className="side-socials">
        {socialLinks.map(({ icon: Icon, href, label }) => (
          <a
            key={href}
            href={href}
            className="side-link"
            aria-label={label}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
          >
            <Icon />
          </a>
        ))}
      </div>

      <div className="avail-tag">
        <span className="avail-dot" />
        Available · Pune
      </div>
    </>
  );
}