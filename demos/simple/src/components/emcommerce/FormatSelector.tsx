import React, { useState } from "react";

// --- Types ---

interface Variant {
  type: string;
  label: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  isbn?: string;
  fulfillment: string;
  digital_files?: Array<{ format: string; url: string }>;
  bookvault_id?: string | null;
  metadata?: Record<string, any>;
  includes?: string[];
}

interface FormatSelectorProps {
  variants: Variant[];
  productId: string;
  productSlug: string;
  productTitle: string;
  compact?: boolean;
}

// --- Helpers ---

function formatPrice(cents: number): string {
  return "$" + (cents / 100).toFixed(2);
}

function getDefaultVariant(variants: Variant[]): Variant {
  return variants.find((v) => v.type === "paperback") ?? variants[0];
}

function isCombo(type: string): boolean {
  const baseTypes = ["ebook", "audiobook", "paperback", "hardcover"];
  return !baseTypes.includes(type);
}

// --- Icons (inline SVG) ---

function EbookIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12" y2="18.01" />
    </svg>
  );
}

function AudiobookIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5z" />
    </svg>
  );
}

function PaperbackIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function HardcoverIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function LayersIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function PackageIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 9.4l-9-5.19" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function GiftIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

function FormatIcon({ type, selected }: { type: string; selected: boolean }) {
  const color = selected ? "#d97706" : "#6b7280";
  switch (type) {
    case "ebook":
      return <EbookIcon color={color} />;
    case "audiobook":
      return <AudiobookIcon color={color} />;
    case "paperback":
      return <PaperbackIcon color={color} />;
    case "hardcover":
      return <HardcoverIcon color={color} />;
    case "digital-combo":
      return <LayersIcon color={color} />;
    case "trio-combo":
      return <PackageIcon color={color} />;
    case "ultimate-bundle":
      return <GiftIcon color={color} />;
    default:
      return <PackageIcon color={color} />;
  }
}

// --- Styles ---

const styles = {
  wrapper: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: 480,
    width: "100%",
  } as React.CSSProperties,

  sectionLabel: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    color: "#6b7280",
    marginBottom: 8,
  } as React.CSSProperties,

  baseGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 16,
  } as React.CSSProperties,

  comboRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
    marginBottom: 20,
  } as React.CSSProperties,

  card: (selected: boolean): React.CSSProperties => ({
    border: `2px solid ${selected ? "#d97706" : "#e5e7eb"}`,
    borderRadius: 10,
    padding: 14,
    background: selected ? "#fffbeb" : "#ffffff",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    position: "relative",
    transition: "border-color 0.15s, background 0.15s",
  }),

  iconWrap: (selected: boolean): React.CSSProperties => ({
    width: 44,
    height: 44,
    borderRadius: 10,
    background: selected ? "#fef3c7" : "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s",
  }),

  cardLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#1f2937",
    textAlign: "center" as const,
  } as React.CSSProperties,

  cardPrice: {
    fontSize: 14,
    fontWeight: 700,
    color: "#111827",
  } as React.CSSProperties,

  cardCompare: {
    fontSize: 12,
    color: "#9ca3af",
    textDecoration: "line-through",
    marginLeft: 4,
  } as React.CSSProperties,

  checkmark: {
    position: "absolute" as const,
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#d97706",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,

  comboIncludes: {
    fontSize: 11,
    color: "#6b7280",
    textAlign: "center" as const,
    lineHeight: 1.3,
    marginTop: 2,
  } as React.CSSProperties,

  cta: {
    width: "100%",
    padding: "14px 24px",
    fontSize: 16,
    fontWeight: 700,
    color: "#ffffff",
    background: "#d97706",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    transition: "background 0.15s",
    letterSpacing: "0.01em",
  } as React.CSSProperties,

  ctaHover: {
    background: "#b45309",
  } as React.CSSProperties,

  trustLine: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center" as const,
    marginTop: 10,
  } as React.CSSProperties,
};

// --- Component ---

export default function FormatSelector({
  variants,
  productId,
  productSlug,
  productTitle,
  compact = false,
}: FormatSelectorProps) {
  const defaultVariant = getDefaultVariant(variants);
  const [selectedSku, setSelectedSku] = useState(defaultVariant.sku);
  const [ctaHovered, setCtaHovered] = useState(false);

  const baseVariants = variants.filter((v) => !isCombo(v.type));
  const comboVariants = variants.filter((v) => isCombo(v.type));
  const selected = variants.find((v) => v.sku === selectedSku) ?? defaultVariant;

  function handleAddToCart() {
    const payload = {
      productId,
      productSlug,
      variantSku: selected.sku,
      quantity: 1,
    };
    // TODO: POST to /api/cart/add when API exists
    console.log("[Emcommerce] Add to cart:", payload);
  }

  function renderCard(variant: Variant) {
    const isSelected = variant.sku === selectedSku;
    return (
      <div
        key={variant.sku}
        style={styles.card(isSelected)}
        onClick={() => setSelectedSku(variant.sku)}
        role="radio"
        aria-checked={isSelected}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setSelectedSku(variant.sku);
          }
        }}
      >
        {isSelected && (
          <span style={styles.checkmark}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        )}
        <div style={styles.iconWrap(isSelected)}>
          <FormatIcon type={variant.type} selected={isSelected} />
        </div>
        <div style={styles.cardLabel}>{variant.label}</div>
        <div>
          <span style={styles.cardPrice}>{formatPrice(variant.price)}</span>
          {variant.compareAtPrice != null && (
            <span style={styles.cardCompare}>
              {formatPrice(variant.compareAtPrice)}
            </span>
          )}
        </div>
        {variant.includes && variant.includes.length > 0 && (
          <div style={styles.comboIncludes}>
            {variant.includes.join(" + ")}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={styles.wrapper} role="radiogroup" aria-label={`Choose format for ${productTitle}`}>
      {/* Base formats: 2x2 grid */}
      {baseVariants.length > 0 && (
        <>
          {!compact && (
            <div style={styles.sectionLabel}>Choose your format</div>
          )}
          <div style={styles.baseGrid}>
            {baseVariants.map(renderCard)}
          </div>
        </>
      )}

      {/* Combo variants: row of up to 3 */}
      {comboVariants.length > 0 && (
        <>
          {!compact && (
            <div style={styles.sectionLabel}>Bundles &amp; combos</div>
          )}
          <div
            style={{
              ...styles.comboRow,
              gridTemplateColumns:
                comboVariants.length < 3
                  ? `repeat(${comboVariants.length}, 1fr)`
                  : "repeat(3, 1fr)",
            }}
          >
            {comboVariants.map(renderCard)}
          </div>
        </>
      )}

      {/* CTA button */}
      <button
        style={{
          ...styles.cta,
          ...(ctaHovered ? styles.ctaHover : {}),
        }}
        onMouseEnter={() => setCtaHovered(true)}
        onMouseLeave={() => setCtaHovered(false)}
        onClick={handleAddToCart}
      >
        Add {selected.label} to Cart &mdash; {formatPrice(selected.price)}
        {selected.compareAtPrice != null && (
          <span
            style={{
              marginLeft: 8,
              textDecoration: "line-through",
              opacity: 0.7,
              fontWeight: 400,
              fontSize: 14,
            }}
          >
            {formatPrice(selected.compareAtPrice)}
          </span>
        )}
      </button>

      {/* Trust line */}
      <p style={styles.trustLine}>
        Secure checkout via Stripe. 100% money-back guarantee.
      </p>
    </div>
  );
}
