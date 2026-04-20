/** Instant scroll to top without CSS `scroll-behavior: smooth` animating the jump. */
export function instantScrollToTop() {
  const html = document.documentElement;
  const before = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  html.style.scrollBehavior = before;
}
