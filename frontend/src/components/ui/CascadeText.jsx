import React, { useMemo, useState } from "react";

const CascadeText = React.memo(function CascadeText({
  text,
  as: Component = "span",
  href,
  target,
  className = "",
  style,
  fontSize = "3rem",
  staggerDelay = 25,
  duration = 250,
  easing = "ease-in-out",
  color = "inherit",
  hoverColor = "var(--blue)",
  direction = "up",
  onClick,
}) {
  const [hovered, setHovered] = useState(false);

  const chars = useMemo(() => {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
      return Array.from(segmenter.segment(text), (s) => s.segment);
    }
    return [...text];
  }, [text]);

  const sign = direction === "up" ? 1 : -1;

  const rootProps = {
    className,
    style: {
      display: "inline-block",
      position: "relative",
      textDecoration: "none",
      fontWeight: 800,
      textTransform: "uppercase",
      letterSpacing: "-0.025em",
      overflow: "hidden",
      cursor: "pointer",
      userSelect: "none",
      fontSize,
      color: hovered ? hoverColor : color,
      transition: "color 0.35s ease",
      padding: "0.15em 0.2em",
      lineHeight: 1,
      ...style,
    },
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onClick,
    "aria-label": text,
  };

  if (Component === "a") {
    rootProps.href = href ?? "#";
    if (target) rootProps.target = target;
    if (target === "_blank") rootProps.rel = "noopener noreferrer";
  }

  return (
    <Component {...rootProps}>
      <span
        style={{ display: "inline-flex", overflow: "hidden", position: "relative", height: "1em" }}
        aria-hidden="true"
      >
        {chars.map((char, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              position: "relative",
              willChange: "transform",
              textShadow: `0 ${sign}em currentColor`,
              transition: `transform ${duration}ms ${easing}`,
              transitionDelay: `${i * staggerDelay}ms`,
              transform: hovered ? `translateY(${-sign}em)` : "translateY(0)",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </Component>
  );
});

CascadeText.displayName = "CascadeText";
export default CascadeText;
