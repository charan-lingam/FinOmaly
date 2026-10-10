import React from "react";

// Types not needed in JS, but keeping the props structure
export const GlassEffect = ({
  children,
  className = "",
  style = {},
  href,
  target = "_blank",
}) => {
  const glassStyle = {
    boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
    transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
    position: "relative",
    display: "flex",
    fontWeight: 600,
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.7s",
    borderRadius: "24px", // rounded-3xl approx
    ...style,
  };

  const content = (
    <div className={className} style={glassStyle}>
      {/* Glass Layers */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          borderRadius: "inherit",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)", // fallback
          filter: "url(#glass-distortion)",
          isolation: "isolate",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          borderRadius: "inherit",
          background: "rgba(255, 255, 255, 0.15)", // slightly less white for dark theme
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          borderRadius: "inherit",
          overflow: "hidden",
          boxShadow:
            "inset 2px 2px 1px 0 rgba(255, 255, 255, 0.3), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.2)",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 30, width: "100%", height: "100%" }}>{children}</div>
    </div>
  );

  return href ? (
    <a href={href} target={target} rel="noopener noreferrer" style={{ display: "block", textDecoration: "none" }}>
      {content}
    </a>
  ) : (
    content
  );
};

export const GlassButton = ({ children, href, style = {}, onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  
  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{ display: 'inline-block' }}
    >
      <GlassEffect
        href={href}
        style={{
          padding: hovered ? "18px 42px" : "16px 40px",
          borderRadius: hovered ? "28px" : "24px",
          overflow: "hidden",
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 2.2)",
          ...style
        }}
      >
        <div
          style={{
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 2.2)",
            transform: hovered ? "scale(0.95)" : "scale(1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%"
          }}
        >
          {children}
        </div>
      </GlassEffect>
    </div>
  );
};

export const GlassFilter = () => (
  <svg style={{ display: "none" }}>
    <filter
      id="glass-distortion"
      x="0%"
      y="0%"
      width="100%"
      height="100%"
      filterUnits="objectBoundingBox"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.001 0.005"
        numOctaves="1"
        seed="17"
        result="turbulence"
      />
      <feComponentTransfer in="turbulence" result="mapped">
        <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
        <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
        <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
      </feComponentTransfer>
      <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
      <feSpecularLighting
        in="softMap"
        surfaceScale="5"
        specularConstant="1"
        specularExponent="100"
        lightingColor="white"
        result="specLight"
      >
        <fePointLight x="-200" y="-200" z="300" />
      </feSpecularLighting>
      <feComposite
        in="specLight"
        operator="arithmetic"
        k1="0"
        k2="1"
        k3="1"
        k4="0"
        result="litImage"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="softMap"
        scale="200"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
);

