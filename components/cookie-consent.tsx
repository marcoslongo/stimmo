"use client"

import CookieConsent from "react-cookie-consent"

export function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Aceitar"
      enableDeclineButton={false}
      cookieName="site_consent"
      style={{
        position: "fixed",
        left: "2rem",
        bottom: "2rem",
        width: "30%",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        borderRadius: "12px",
        color: "white",
        fontSize: "14px",
        lineHeight: "1.4",
        padding: "1rem 1.25rem",
        zIndex: 50,
        alignItems: "center",
        marginBottom: "1rem",
      }}
      buttonStyle={{
        background: "white",
        color: "black",
        fontSize: "13px",
        borderRadius: "8px",
        padding: "6px 12px",
        cursor: "pointer",
        fontWeight: 500,
      }}
      expires={150}
      containerClasses="cookie-banner"
    >
      A Simonetto usa cookies — pequenos arquivos para aprimorar e proteger a sua experiência :)
      <br />
      Tá curtindo e quer continuar navegando?<br />
      Clique em <strong>“Aceitar”</strong>.
      <br />
      <a
        href="/politicas-de-privacidade"
        style={{ textDecoration: "underline" }}
        aria-label="Política de Privacidade"
      >
        Política de Privacidade
      </a>
      <style jsx global>{`
        @media (max-width: 768px) {
          .cookie-banner {
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            border-radius: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </CookieConsent>
  )
}