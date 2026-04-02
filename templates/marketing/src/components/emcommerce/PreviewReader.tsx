import { useState, useEffect } from "react";
import AudioPlayer from "./AudioPlayer";
import FormatSelector from "./FormatSelector";

interface Variant {
  type: string;
  label: string;
  price: number;
  compareAtPrice?: number | null;
  sku: string;
  isbn?: string;
  fulfillment: "digital" | "bookvault" | "manual";
  bookvault_id?: string | null;
  digital_files?: { format: string; url: string }[] | null;
  includes?: string[];
  metadata?: Record<string, unknown>;
}

interface PreviewReaderProps {
  previewHtml: string;
  previewAudioUrl?: string;
  narrator?: string;
  audioRuntime?: string;
  variants: Variant[];
  productId: string;
  productSlug: string;
  productTitle: string;
}

type Tab = "read" | "listen";

function getStorageKey(slug: string) {
  return `emcommerce_preview_${slug}`;
}

export default function PreviewReader({
  previewHtml,
  previewAudioUrl,
  narrator,
  audioRuntime,
  variants,
  productId,
  productSlug,
  productTitle,
}: PreviewReaderProps) {
  const [activeTab, setActiveTab] = useState<Tab>("read");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(getStorageKey(productSlug));
      if (stored === "true") {
        setIsUnlocked(true);
      }
    } catch {
      // localStorage unavailable
    }
  }, [productSlug]);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // TODO: wire to real API
      console.log("Lead capture:", {
        email,
        source: "preview-gate",
        productSlug,
      });

      // POST to `/_emdash/api/plugins/emcommerce/leads`
      // await fetch("/_emdash/api/plugins/emcommerce/leads", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, source: "preview-gate", productSlug }),
      // });

      setIsUnlocked(true);
      try {
        localStorage.setItem(getStorageKey(productSlug), "true");
      } catch {
        // localStorage unavailable
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // --- Styles ---

  const s = {
    section: {
      backgroundColor: "#1c1917",
      padding: "64px 24px",
      color: "#fafaf9",
    },
    inner: {
      maxWidth: "800px",
      margin: "0 auto",
    },
    heading: {
      fontSize: "32px",
      fontWeight: 700,
      textAlign: "center" as const,
      marginBottom: "8px",
    },
    subtext: {
      fontSize: "16px",
      color: "#a8a29e",
      textAlign: "center" as const,
      marginBottom: "32px",
    },
    tabContainer: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "24px",
    },
    tabPill: {
      display: "inline-flex",
      backgroundColor: "#292524",
      borderRadius: "9999px",
      padding: "4px",
      gap: "4px",
    },
    tabButton: (active: boolean) =>
      ({
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        borderRadius: "9999px",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 500,
        transition: "background-color 0.2s, color 0.2s",
        backgroundColor: active ? "#d97706" : "transparent",
        color: active ? "#fff" : "#a8a29e",
      }) as React.CSSProperties,
    card: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      overflow: "hidden",
    },
    cardInner: {
      padding: "32px",
    },
    // Read tab
    previewWrapper: (locked: boolean) =>
      ({
        position: "relative" as const,
        maxHeight: locked ? "300px" : "none",
        overflow: locked ? "hidden" : "visible",
      }) as React.CSSProperties,
    previewText: {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: "17px",
      lineHeight: 1.8,
      color: "#1c1917",
    },
    gradientOverlay: {
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      height: "200px",
      background: "linear-gradient(to top, white, transparent)",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      paddingBottom: "0",
    },
    // Listen tab
    listenContainer: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "24px",
    },
    // Email gate card
    gateCard: {
      backgroundColor: "#fafaf9",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "32px",
      textAlign: "center" as const,
      maxWidth: "420px",
      margin: "0 auto",
    },
    gateIconCircle: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      backgroundColor: "#fef3c7",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "16px",
    },
    gateHeading: {
      fontSize: "20px",
      fontWeight: 700,
      color: "#1c1917",
      marginBottom: "8px",
    },
    gateSubtext: {
      fontSize: "14px",
      color: "#78716c",
      marginBottom: "20px",
    },
    form: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "12px",
    },
    emailInput: {
      padding: "12px 16px",
      border: "1px solid #d6d3d1",
      borderRadius: "8px",
      fontSize: "15px",
      outline: "none",
      width: "100%",
      boxSizing: "border-box" as const,
    },
    submitButton: {
      padding: "12px 24px",
      backgroundColor: "#d97706",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontSize: "15px",
      fontWeight: 600,
      cursor: "pointer",
      width: "100%",
      boxSizing: "border-box" as const,
    },
    disclaimer: {
      fontSize: "12px",
      color: "#a8a29e",
      marginTop: "4px",
    },
    // Conversion prompt
    conversionSection: {
      borderTop: "1px solid #e5e7eb",
      marginTop: "32px",
      paddingTop: "32px",
    },
    conversionHeading: {
      fontSize: "22px",
      fontWeight: 700,
      color: "#1c1917",
      marginBottom: "8px",
    },
    conversionSubtext: {
      fontSize: "15px",
      color: "#78716c",
      marginBottom: "24px",
    },
    badge: {
      display: "inline-block",
      backgroundColor: "#fef3c7",
      color: "#92400e",
      fontSize: "13px",
      fontWeight: 600,
      padding: "6px 14px",
      borderRadius: "9999px",
      marginBottom: "20px",
    },
  };

  // --- Icons ---

  const bookIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z" />
    </svg>
  );

  const headphonesIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );

  const mailIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );

  // --- Email gate component ---

  function EmailGate({ headingText, subtextMsg }: { headingText: string; subtextMsg: string }) {
    return (
      <div style={s.gateCard}>
        <div style={s.gateIconCircle}>{mailIcon}</div>
        <div style={s.gateHeading}>{headingText}</div>
        <div style={s.gateSubtext}>{subtextMsg}</div>
        <form onSubmit={handleEmailSubmit} style={s.form}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={s.emailInput}
          />
          <button type="submit" style={s.submitButton} disabled={isSubmitting}>
            {isSubmitting ? "Unlocking..." : "Unlock Chapters"}
          </button>
          <div style={s.disclaimer}>No spam. Unsubscribe anytime.</div>
        </form>
      </div>
    );
  }

  // --- Tab content ---

  function ReadTab() {
    return (
      <>
        <div style={s.previewWrapper(!isUnlocked)}>
          <div
            style={s.previewText}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
          {!isUnlocked && (
            <div style={s.gradientOverlay} />
          )}
        </div>
        {!isUnlocked && (
          <div style={{ marginTop: "24px" }}>
            <EmailGate
              headingText="Keep Reading for Free"
              subtextMsg="Enter your email to unlock the first 3 chapters"
            />
          </div>
        )}
        {isUnlocked && <ConversionPrompt />}
      </>
    );
  }

  function ListenTab() {
    if (!previewAudioUrl) {
      return (
        <div style={{ textAlign: "center", color: "#78716c", padding: "40px 0" }}>
          No audio preview available for this title.
        </div>
      );
    }

    return (
      <div style={s.listenContainer}>
        <AudioPlayer src={previewAudioUrl} narrator={narrator} runtime={audioRuntime} />
        {!isUnlocked && (
          <EmailGate
            headingText="Listen to the Full Preview"
            subtextMsg="Enter your email to unlock the complete audio sample"
          />
        )}
        {isUnlocked && <ConversionPrompt />}
      </div>
    );
  }

  function ConversionPrompt() {
    return (
      <div style={s.conversionSection}>
        <div style={s.badge}>Use code PREVIEW15 for 15% off</div>
        <div style={s.conversionHeading}>Enjoying the preview?</div>
        <div style={s.conversionSubtext}>
          Get the full book — choose your format
        </div>
        <FormatSelector
          variants={variants}
          productId={productId}
          productSlug={productSlug}
          compact={true}
        />
      </div>
    );
  }

  // --- Render ---

  return (
    <section style={s.section}>
      <div style={s.inner}>
        <h2 style={s.heading}>Experience the Journey</h2>
        <p style={s.subtext}>
          Read or listen to a free preview of {productTitle}
        </p>

        <div style={s.tabContainer}>
          <div style={s.tabPill}>
            <button
              type="button"
              style={s.tabButton(activeTab === "read")}
              onClick={() => setActiveTab("read")}
            >
              {bookIcon}
              Read Excerpt
            </button>
            <button
              type="button"
              style={s.tabButton(activeTab === "listen")}
              onClick={() => setActiveTab("listen")}
            >
              {headphonesIcon}
              Listen to Sample
            </button>
          </div>
        </div>

        <div style={s.card}>
          <div style={s.cardInner}>
            {activeTab === "read" ? <ReadTab /> : <ListenTab />}
          </div>
        </div>
      </div>
    </section>
  );
}
