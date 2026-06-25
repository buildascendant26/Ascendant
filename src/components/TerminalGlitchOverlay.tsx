import { useEffect } from "react";
import { gsap } from "gsap";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&<>[]{}+-*/_";
const TEXT_SELECTOR =
  "h1,h2,h3,h4,h5,p,li,a,button,span,[data-terminal-text]";

const isSafeTextNode = (element: HTMLElement) => {
  if (element.closest("[data-no-terminal-glitch]")) return false;
  if (element.querySelector("svg,img,canvas,video,input,textarea,select")) {
    return false;
  }
  if (element.children.length > 0) return false;
  return Boolean(element.textContent?.trim());
};

const scrambleElement = (element: HTMLElement, delay: number) => {
  const originalText =
    element.dataset.terminalOriginal || element.textContent || "";
  element.dataset.terminalOriginal = originalText;

  const driver = { progress: 0 };
  const chars = originalText.split("");

  gsap.killTweensOf(driver);
  gsap.to(driver, {
    progress: 1,
    duration: 0.55 + Math.random() * 0.45,
    delay,
    ease: "power2.out",
    onStart: () => {
      element.classList.add("terminal-glitch-active");
    },
    onUpdate: () => {
      const resolvedCount = Math.floor(driver.progress * chars.length);
      element.textContent = chars
        .map((char, index) => {
          if (char === " " || char === "\n") return char;
          if (index < resolvedCount) return char;
          return SCRAMBLE_CHARS[
            Math.floor(Math.random() * SCRAMBLE_CHARS.length)
          ];
        })
        .join("");
    },
    onComplete: () => {
      element.textContent = originalText;
      element.classList.remove("terminal-glitch-active");
    },
  });
};

export const TerminalGlitchOverlay = () => {
  useEffect(() => {
    const appearedSections = new WeakSet<Element>();
    const sections = Array.from(
      document.querySelectorAll("header, main > section, footer")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || appearedSections.has(entry.target)) return;
          appearedSections.add(entry.target);

          const textElements = Array.from(
            entry.target.querySelectorAll<HTMLElement>(TEXT_SELECTOR)
          ).filter(isSafeTextNode);

          textElements.forEach((element, index) => {
            scrambleElement(element, index * 0.018);
          });
        });
      },
      {
        threshold: 0.22,
        rootMargin: "-8% 0px -12% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
};
