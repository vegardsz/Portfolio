import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const RASTER_IMAGE_PATTERN = /\.(png|jpe?g)(\?.*)?$/i;

function getOptimizedImageSrc(src) {
  if (!src || !RASTER_IMAGE_PATTERN.test(src)) return src;
  if (src.includes("/img/nrk_")) return src;
  if (/_nrk(?:_\d+)?\.png(\?.*)?$/i.test(src)) return src;
  return src.replace(RASTER_IMAGE_PATTERN, ".webp$2");
}

/** NRK Surface: slight zoom-out vs raw cover while still filling (104.17% × scale(0.96) ≈ 100%). */
function isSurfaceNrkBackdrop(src) {
  if (!src) return false;
  const normalizedSrc = src.split("?")[0];
  return normalizedSrc.endsWith("/img/surface_nrk.png");
}

function getImmersiveBackdropLayerStyle(src) {
  const backgroundImage = `url("${getOptimizedImageSrc(src)}")`;
  if (!isSurfaceNrkBackdrop(src)) {
    return { backgroundImage };
  }
  return {
    backgroundImage,
    backgroundSize: "cover",
    backgroundPosition: "center 42%",
    width: "104.17%",
    height: "104.17%",
    left: "-2.085%",
    top: "-2.085%",
    transform: "scale(0.96)",
    transformOrigin: "center center",
  };
}

function getSegmentBackgroundSrc(segment, segmentIndex, immersiveBackgrounds = [], immersiveBackgroundMap = {}) {
  if (!segment) return null;
  if (segment.backgroundImage) return segment.backgroundImage;
  if (immersiveBackgroundMap[segment.id]) return immersiveBackgroundMap[segment.id];
  if (immersiveBackgrounds.length > 0) return immersiveBackgrounds[segmentIndex % immersiveBackgrounds.length];
  if (segment.image) return segment.image;
  if (Array.isArray(segment.images) && segment.images.length > 0) return segment.images[0];
  return null;
}

function getYouTubeEmbedSrc(src) {
  if (!src) return null;
  try {
    const url = new URL(src);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      const videoId = url.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

function ProjectSegmentSection({ segments, projectSlug, immersiveBackgrounds = [], immersiveBackgroundMap = {} }) {
  const BEFORE_AFTER_HANDLE_SIZE = 40;
  const [activeId, setActiveId] = useState(segments[0]?.id);
  const [viewerImage, setViewerImage] = useState(null);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const activeSegmentIndex = Math.max(
    0,
    segments.findIndex((segment) => segment.id === activeId)
  );
  const activeSegment = segments.find((segment) => segment.id === activeId) ?? segments[0];
  const isArtifact = activeSegment.id === "artifact";
  const isSystem = activeSegment.id === "system";
  const isConcept = activeSegment.id === "concept";
  const isScenario = activeSegment.id === "scenario";
  const isVerticalWide = activeSegment.id === "artifact" || activeSegment.id === "system" || activeSegment.id === "prototype";
  const isCityLifeProject = projectSlug === "privacy-pass";
  const isRoadUxSegment = activeSegment.id === "road-ux";
  const isRoadFrontEndSegment = projectSlug === "road-work-applications" && activeSegment.id === "road-front-end";
  const isNrkProject = projectSlug === "nrk-dock";
  const isNrkContentSegment = isNrkProject && activeSegment.id === "nrk-content";
  const isNrkSurfaceSegment = isNrkProject && activeSegment.id === "nrk-surface";
  const isNrkUseCasesSegment = isNrkProject && activeSegment.id === "nrk-use-cases";
  const isNrkTwoColumnLayout = isNrkProject && !isNrkSurfaceSegment && !isNrkUseCasesSegment;
  const isNrkImageSegment = isNrkProject && (activeSegment.id === "nrk-content" || activeSegment.id === "nrk-surface");
  const hasCarousel = Array.isArray(activeSegment.images) && activeSegment.images.length > 0;
  const activeImageSrc = hasCarousel ? activeSegment.images[carouselIndex] : activeSegment.image;
  const activeVideoSrc = activeSegment.video;
  const activeVideoEmbedSrc = getYouTubeEmbedSrc(activeVideoSrc);
  const activeImageAlt = hasCarousel
    ? `${activeSegment.title} (${carouselIndex + 1} of ${activeSegment.images.length})`
    : activeSegment.title;
  const hasBeforeAfterSlider = Boolean(activeSegment.beforeImage) && Boolean(activeSegment.afterImage);
  const isRoadUxBeforeAfter = hasBeforeAfterSlider && projectSlug === "road-work-applications" && isRoadUxSegment;
  const [beforeAfterRatio, setBeforeAfterRatio] = useState(0.12);
  const [beforeAfterViewerRatio, setBeforeAfterViewerRatio] = useState(0.12);
  const [beforeAfterAspectRatio, setBeforeAfterAspectRatio] = useState(null);
  const [currentBackgroundSrc, setCurrentBackgroundSrc] = useState(() =>
    getSegmentBackgroundSrc(segments[0], 0, immersiveBackgrounds, immersiveBackgroundMap)
  );
  const [previousBackgroundSrc, setPreviousBackgroundSrc] = useState(null);
  const [isBackgroundCrossfading, setIsBackgroundCrossfading] = useState(false);
  const closeButtonRef = useRef(null);
  const beforeAfterFrameRef = useRef(null);
  const beforeAfterControlRef = useRef(null);
  const beforeAfterViewerFrameRef = useRef(null);
  const beforeAfterViewerControlRef = useRef(null);
  const isBeforeAfterDraggingRef = useRef(false);
  const isBeforeAfterViewerDraggingRef = useRef(false);

  useEffect(() => {
    setCarouselIndex(0);
  }, [activeId]);

  useEffect(() => {
    setBeforeAfterRatio(0.12);
  }, [activeId]);

  useEffect(() => {
    setBeforeAfterAspectRatio(null);
  }, [activeId]);

  useEffect(() => {
    const nextBackgroundSrc = getSegmentBackgroundSrc(
      activeSegment,
      activeSegmentIndex,
      immersiveBackgrounds,
      immersiveBackgroundMap
    );
    if (!nextBackgroundSrc || nextBackgroundSrc === currentBackgroundSrc) return undefined;

    setPreviousBackgroundSrc(currentBackgroundSrc);
    setCurrentBackgroundSrc(nextBackgroundSrc);
    setIsBackgroundCrossfading(false);

    const frameId = window.requestAnimationFrame(() => {
      setIsBackgroundCrossfading(true);
    });

    const timeoutId = window.setTimeout(() => {
      setPreviousBackgroundSrc(null);
      setIsBackgroundCrossfading(false);
    }, 1380);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [activeSegment, activeSegmentIndex, currentBackgroundSrc, immersiveBackgroundMap, immersiveBackgrounds]);

  useEffect(() => {
    if (!viewerImage) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsViewerVisible(false);
        window.setTimeout(() => {
          setViewerImage(null);
        }, 220);
      }
    };

    window.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    window.setTimeout(() => {
      setIsViewerVisible(true);
      closeButtonRef.current?.focus();
    }, 10);

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [viewerImage]);

  const openViewer = () => {
    if (!activeImageSrc) return;
    setViewerImage({ src: activeImageSrc, alt: activeImageAlt, id: activeSegment.id });
  };

  const openBeforeAfterViewer = () => {
    if (!activeSegment.afterImage) return;
    setBeforeAfterViewerRatio(beforeAfterRatio);
    setViewerImage({ src: activeSegment.afterImage, alt: activeSegment.title, id: activeSegment.id });
  };

  const updateBeforeAfterRatio = (clientX) => {
    const sliderRef = isRoadUxBeforeAfter ? beforeAfterControlRef.current : beforeAfterFrameRef.current;
    if (!sliderRef) return;
    const rect = sliderRef.getBoundingClientRect();
    if (rect.width <= 0) return;
    const nextRatio = (clientX - rect.left) / rect.width;
    const clamped = Math.max(0, Math.min(1, nextRatio));

    if (isRoadUxBeforeAfter) {
      // UX slider compares full-width edges; allow true 0..1 reveal.
      setBeforeAfterRatio(clamped);
      return;
    }

    const handleOffsetRatio = (BEFORE_AFTER_HANDLE_SIZE / 2) / rect.width;
    const minRatio = Math.max(0, handleOffsetRatio);
    const maxRatio = Math.min(1, 1 - handleOffsetRatio);
    setBeforeAfterRatio(Math.max(minRatio, Math.min(maxRatio, clamped)));
  };

  const handleBeforeAfterDragStart = (event) => {
    isBeforeAfterDraggingRef.current = true;
    updateBeforeAfterRatio(event.clientX);
    event.preventDefault();
  };

  const updateBeforeAfterViewerRatio = (clientX) => {
    const sliderRef = beforeAfterViewerControlRef.current ?? beforeAfterViewerFrameRef.current;
    if (!sliderRef) return;
    const rect = sliderRef.getBoundingClientRect();
    if (rect.width <= 0) return;
    const nextRatio = (clientX - rect.left) / rect.width;
    const clamped = Math.max(0, Math.min(1, nextRatio));
    setBeforeAfterViewerRatio(clamped);
  };

  const handleBeforeAfterViewerDragStart = (event) => {
    isBeforeAfterViewerDraggingRef.current = true;
    updateBeforeAfterViewerRatio(event.clientX);
    event.preventDefault();
  };

  const closeViewer = () => {
    setIsViewerVisible(false);
    window.setTimeout(() => {
      setViewerImage(null);
    }, 220);
  };

  const viewerHasCarousel = Boolean(viewerImage && viewerImage.id === activeSegment.id && hasCarousel);
  const viewerSrc = viewerHasCarousel ? activeSegment.images[carouselIndex] : viewerImage?.src;
  const viewerAlt = viewerHasCarousel
    ? `${activeSegment.title} (${carouselIndex + 1} of ${activeSegment.images.length})`
    : viewerImage?.alt;
  const viewerSegment = viewerImage ? segments.find((segment) => segment.id === viewerImage.id) : null;
  const isRoadUxBeforeAfterViewer =
    Boolean(viewerSegment?.beforeImage) &&
    Boolean(viewerSegment?.afterImage) &&
    viewerImage?.id === "road-ux" &&
    projectSlug === "road-work-applications";
  const sectionRef = useRef(null);
  const controlsRef = useRef(null);
  const showInlineFrameControls = !activeVideoSrc && (hasCarousel || (!isSystem && !hasBeforeAfterSlider && !isRoadFrontEndSegment));
  const isCompactSegment = activeSegment.layoutMode === "compact";
  const beforeAfterFrameScale =
    typeof activeSegment.beforeAfterFrameScale === "number" ? activeSegment.beforeAfterFrameScale : 400;
  const beforeAfterFrameWidth =
    beforeAfterAspectRatio && Number.isFinite(beforeAfterAspectRatio)
      ? `min(100%, ${Math.round(beforeAfterAspectRatio * beforeAfterFrameScale)}px)`
      : "100%";

  useEffect(() => {
    if (!hasBeforeAfterSlider) return undefined;

    const handleMouseMove = (event) => {
      if (!isBeforeAfterDraggingRef.current) return;
      updateBeforeAfterRatio(event.clientX);
    };

    const handleMouseUp = () => {
      isBeforeAfterDraggingRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [hasBeforeAfterSlider]);

  useEffect(() => {
    if (!isRoadUxBeforeAfterViewer) return undefined;

    const handleMouseMove = (event) => {
      if (!isBeforeAfterViewerDraggingRef.current) return;
      updateBeforeAfterViewerRatio(event.clientX);
    };

    const handleMouseUp = () => {
      isBeforeAfterViewerDraggingRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isRoadUxBeforeAfterViewer]);

  return (
    <>
      <section
        ref={sectionRef}
        className={`relative isolate pt-18 pb-18 md:pt-20 md:pb-20 ${isCityLifeProject ? "md:pb-20" : "md:pb-24"} ${
          isNrkProject ? "min-h-[760px] md:min-h-[860px]" : ""
        }`}
      >
      {currentBackgroundSrc ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 left-1/2 w-dvw -translate-x-1/2 overflow-hidden bg-black"
        >
          {previousBackgroundSrc ? (
            <div
              className={`absolute bg-center transition-opacity duration-[1200ms] ease-out ${
                isSurfaceNrkBackdrop(previousBackgroundSrc)
                  ? "origin-center"
                  : "inset-0 bg-cover"
              } ${isBackgroundCrossfading ? "opacity-0" : "opacity-100"}`}
              style={getImmersiveBackdropLayerStyle(previousBackgroundSrc)}
            />
          ) : null}
          <div
            className={`absolute bg-center transition-opacity duration-[1200ms] ease-out ${
              isSurfaceNrkBackdrop(currentBackgroundSrc) ? "origin-center" : "inset-0 bg-cover"
            } ${
              previousBackgroundSrc ? (isBackgroundCrossfading ? "opacity-100" : "opacity-0") : "opacity-100"
            }`}
            style={getImmersiveBackdropLayerStyle(currentBackgroundSrc)}
          />
          <div
            className={`absolute inset-0 ${
              isNrkSurfaceSegment
                ? "bg-[rgba(0,0,0,0.55)] backdrop-blur-[2px]"
                : "bg-black/45"
            } transition-[background-color,backdrop-filter] duration-[1200ms] ease-out`}
          />
        </div>
      ) : null}

      <div className="relative z-10">
      <div ref={controlsRef} className="flex justify-center">
        <div
          className="inline-flex items-center gap-1 rounded-full bg-white/10 p-1.5 backdrop-blur-sm ring-1 ring-white/15"
        >
          {segments.map((segment) => {
            const isActive = segment.id === activeSegment.id;
            return (
              <button
                key={segment.id}
                type="button"
                onClick={() => {
                  setActiveId(segment.id);
                }}
                className={`rounded-full px-6 py-2.5 text-sm font-medium transition duration-700 ease-out ${
                  isActive
                    ? "bg-white/20 text-white shadow-sm backdrop-blur-sm"
                    : "text-white/75 hover:text-white"
                }`}
              >
                {segment.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`min-h-[520px] md:min-h-[580px] ${
          isNrkSurfaceSegment || isNrkContentSegment || isNrkUseCasesSegment ? "overflow-visible" : ""
        }`}
      >
      <div
        key={activeId}
        className={`grid content-start grid-cols-1 items-start ${
          isNrkProject
            ? isNrkSurfaceSegment
              ? "mt-12 gap-x-0 gap-y-2 md:mt-12 md:gap-y-3"
              : isNrkUseCasesSegment
                ? "mt-12 gap-x-0 gap-y-5 md:mt-12 md:gap-y-6"
                : "mt-12 gap-6 md:mt-12 md:gap-8"
            : isArtifact
            ? "mt-12 gap-3 md:mt-14 md:gap-4"
            : isRoadFrontEndSegment
              ? "mt-14 gap-6 md:mt-14 md:gap-8"
            : isCompactSegment
              ? "mt-12 gap-4 md:mt-12 md:gap-6"
            : isCityLifeProject
              ? "mt-14 gap-6 md:mt-14 md:gap-8"
              : "mt-20 gap-8 md:gap-12"
        } ${
          isNrkSurfaceSegment || isNrkUseCasesSegment || isVerticalWide || isCompactSegment
            ? ""
            : isNrkTwoColumnLayout
              ? "md:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]"
              : "md:grid-cols-2"
        } animate-segment-enter motion-reduce:animate-none`}
      >
        <div
          className={
            isNrkProject
              ? isNrkSurfaceSegment
                ? "w-full md:max-w-[24rem]"
                : isNrkUseCasesSegment
                  ? "w-full"
                  : "w-full min-h-[9.5rem] md:min-h-[10.5rem] md:max-w-[24rem]"
              : ""
          }
        >
          <h3 className="text-2xl font-normal tracking-tight text-white md:text-3xl">
            {activeSegment.title}
          </h3>
          <p
            className={`text-base leading-relaxed text-white md:text-lg ${
              isNrkSurfaceSegment || isNrkUseCasesSegment ? "mt-3 md:mt-3.5" : "mt-4"
            }`}
          >
            {activeSegment.description}
          </p>
        </div>
        {activeVideoSrc || activeImageSrc || hasBeforeAfterSlider ? (
          <div
            className={`self-start ${isNrkImageSegment ? "w-full min-w-0" : ""} ${
              isNrkSurfaceSegment || isNrkContentSegment || isNrkUseCasesSegment ? "overflow-visible" : ""
            } ${isNrkContentSegment ? "mb-6 md:mb-8" : ""}`}
          >
            {showInlineFrameControls ? (
            <div className="mb-2 flex items-center justify-end gap-2">
              {hasCarousel ? (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={() =>
                      setCarouselIndex((prev) =>
                        prev === 0 ? activeSegment.images.length - 1 : prev - 1
                      )
                    }
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/12 text-white opacity-85 backdrop-blur-sm transition-opacity duration-200 ease-out hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                      <path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={() =>
                      setCarouselIndex((prev) =>
                        prev === activeSegment.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/12 text-white opacity-85 backdrop-blur-sm transition-opacity duration-200 ease-out hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                      <path d="M7.5 4.5 13 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </>
              ) : null}
              {!isRoadFrontEndSegment ? (
                <button
                  type="button"
                  aria-label={`Expand ${activeSegment.title} image`}
                  onClick={openViewer}
                  className="relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/12 text-white/85 backdrop-blur-sm transition-colors duration-200 ease-out hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                    <path d="M7 3H3v4M13 3h4v4M17 13v4h-4M3 13v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              ) : null}
            </div>
            ) : null}
            {hasBeforeAfterSlider ? (
              <>
              <div
                ref={beforeAfterFrameRef}
                className="relative select-none overflow-hidden rounded-xl"
                style={{
                  aspectRatio: beforeAfterAspectRatio ?? "16 / 9",
                  width: beforeAfterFrameWidth,
                  maxWidth: "100%"
                }}
                onMouseDown={handleBeforeAfterDragStart}
                role="presentation"
              >
                <img
                  src={getOptimizedImageSrc(activeSegment.beforeImage)}
                  alt={activeSegment.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-contain object-center"
                  onLoad={(event) => {
                    const { naturalWidth, naturalHeight } = event.currentTarget;
                    if (!naturalWidth || !naturalHeight) return;
                    setBeforeAfterAspectRatio(naturalWidth / naturalHeight);
                  }}
                  draggable={false}
                />
                <img
                  src={getOptimizedImageSrc(activeSegment.afterImage)}
                  alt={activeSegment.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-contain object-center"
                  style={{ clipPath: `inset(0 ${100 - beforeAfterRatio * 100}% 0 0)` }}
                  draggable={false}
                />
                <button
                  type="button"
                  aria-label={`Expand ${activeSegment.title} image`}
                  onMouseDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation();
                    openBeforeAfterViewer();
                  }}
                  className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300/80 bg-white/92 text-zinc-700 shadow-sm backdrop-blur-sm transition-colors duration-200 ease-out hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 md:right-4 md:top-4"
                >
                  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                    <path d="M7 3H3v4M13 3h4v4M17 13v4h-4M3 13v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                <div
                  className="pointer-events-none absolute inset-y-0 w-px bg-white/75"
                  style={{ left: `${beforeAfterRatio * 100}%` }}
                />
              </div>
              {isRoadUxBeforeAfter ? (
                <div className="mt-3" style={{ width: beforeAfterFrameWidth, maxWidth: "100%" }}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-sm bg-zinc-100/90 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600">
                      Before
                    </span>
                    <span className="rounded-sm bg-zinc-100/90 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600">
                      After
                    </span>
                  </div>
                  <div
                    ref={beforeAfterControlRef}
                    className="relative h-2 w-full rounded-full bg-white/25"
                    onMouseDown={handleBeforeAfterDragStart}
                  >
                    <div
                      className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-white/55"
                      style={{ width: `${beforeAfterRatio * 100}%` }}
                    />
                    <button
                      type="button"
                      aria-label="Drag image comparison slider"
                      onMouseDown={handleBeforeAfterDragStart}
                      className="absolute top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-300/80 bg-white/92 text-zinc-700 shadow-sm transition-colors duration-200 ease-out hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
                      style={{ left: `${beforeAfterRatio * 100}%` }}
                    >
                      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                        <path d="M8.5 6 5.5 10l3 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M11.5 6 14.5 10l-3 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  aria-label="Drag image comparison slider"
                  onMouseDown={handleBeforeAfterDragStart}
                  className="absolute bottom-3 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-zinc-300/80 bg-white/92 text-zinc-700 shadow-sm transition-colors duration-200 ease-out hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
                  style={{ left: `${beforeAfterRatio * 100}%` }}
                >
                  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                    <path d="M8.5 6 5.5 10l3 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11.5 6 14.5 10l-3 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
              </>
            ) : activeVideoSrc ? (
              <div
                className={
                  isNrkUseCasesSegment
                    ? "mx-auto w-full max-w-[min(100%,52rem)] overflow-hidden rounded-xl"
                    : `w-full overflow-hidden rounded-xl ${
                        isNrkImageSegment
                          ? isNrkSurfaceSegment
                            ? "mx-auto max-w-[min(100%,56rem)]"
                            : "mx-auto max-w-full"
                          : ""
                      }`
                }
              >
                {activeVideoEmbedSrc ? (
                  <iframe
                    src={activeVideoEmbedSrc}
                    title={`${activeSegment.title} video`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className={`block w-full border-0 ${
                      isNrkUseCasesSegment ? "aspect-video max-h-[min(58vh,520px)] md:max-h-[min(58vh,560px)]" : "aspect-video"
                    } ${
                      isNrkImageSegment ? "rounded-none" : isNrkUseCasesSegment ? "rounded-none" : "rounded-xl"
                    }`}
                  />
                ) : (
                  <video
                    src={activeVideoSrc}
                    controls
                    playsInline
                    preload="metadata"
                    className={`block h-auto w-full ${
                      isNrkUseCasesSegment
                        ? "max-h-[min(58vh,520px)] object-contain md:max-h-[min(58vh,560px)]"
                        : ""
                    } ${
                      isNrkImageSegment ? "rounded-none" : isNrkUseCasesSegment ? "rounded-none" : "rounded-xl"
                    }`}
                  />
                )}
              </div>
            ) : hasCarousel ? (
              <div
                className={`w-full overflow-hidden rounded-xl ${isCityLifeProject ? "aspect-[16/8.4]" : "aspect-[16/9]"}`}
              >
                <div
                  className="flex h-full w-full transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                >
                  {activeSegment.images.map((imageSrc, index) => (
                    <div key={`${imageSrc}-${index}`} className="flex h-full w-full shrink-0 items-center justify-center">
                      <img
                        src={getOptimizedImageSrc(imageSrc)}
                        alt={`${activeSegment.title} (${index + 1} of ${activeSegment.images.length})`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : isRoadFrontEndSegment ? (
              <div className="h-[620px] w-full overflow-y-auto overflow-x-hidden rounded-xl bg-white/95 ring-1 ring-black/5 md:h-[690px]">
                <img
                  src={getOptimizedImageSrc(activeImageSrc)}
                  alt={activeImageAlt}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full object-contain"
                />
              </div>
            ) : (
              <div
                className={
                  isSystem
                    ? "relative flex items-start justify-end overflow-hidden rounded-xl bg-[#f5f5f5] ring-1 ring-black/5"
                    : isNrkImageSegment
                      ? isNrkSurfaceSegment
                        ? "mx-auto flex w-full max-w-[min(100%,56rem)] items-center justify-center overflow-visible px-0 py-1 md:px-2 md:py-2 max-h-[min(72vh,640px)] md:max-h-[min(72vh,720px)]"
                        : isNrkContentSegment
                          ? "mx-auto flex w-full max-w-full items-center justify-center overflow-visible py-0 md:py-1 max-h-[min(78vh,800px)] md:max-h-[min(78vh,880px)]"
                        : "flex w-full max-w-full max-h-[520px] items-center justify-center overflow-hidden md:max-h-[580px]"
                    : ""
                }
              >
                {isSystem ? (
                  <button
                    type="button"
                    aria-label={`Expand ${activeSegment.title} image`}
                    onClick={openViewer}
                    className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300/80 bg-white/92 text-zinc-700 shadow-sm backdrop-blur-sm transition-colors duration-200 ease-out hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 md:right-4 md:top-4"
                  >
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                      <path d="M7 3H3v4M13 3h4v4M17 13v4h-4M3 13v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                ) : null}
                <img
                  src={getOptimizedImageSrc(activeImageSrc)}
                  alt={activeImageAlt}
                  loading="lazy"
                  decoding="async"
                  className={`${isNrkContentSegment ? "mx-auto block" : "block self-start"} ${
                    isNrkImageSegment ? "rounded-none" : "rounded-xl"
                  } ${
                    isNrkSurfaceSegment
                      ? "h-auto w-full max-w-full origin-center object-contain max-h-[min(72vh,560px)] md:max-h-[min(72vh,640px)] scale-100 md:scale-[1.03]"
                      : isNrkContentSegment
                      ? "h-auto w-full max-w-full object-contain object-center max-h-[min(78vh,720px)] md:max-h-[min(78vh,800px)]"
                      : isNrkImageSegment
                      ? "h-auto max-h-full w-full max-w-full object-contain"
                      :
                    isArtifact
                      ? "aspect-[16/9] object-contain scale-[0.96]"
                      : isSystem
                      ? "aspect-[16/9] object-contain object-center p-4 scale-[0.92]"
                      : isVerticalWide
                    ? "aspect-[16/9] object-cover"
                      : isConcept
                      ? "mt-3 origin-top aspect-[5/4] object-contain scale-[1.2]"
                        : isScenario
                        ? "aspect-[4/3] object-contain"
                        : "aspect-[4/3] object-cover"
                  }`}
                />
              </div>
            )}
          </div>
        ) : (
          <div className={`placeholder-check w-full rounded-xl ${isVerticalWide ? "aspect-[16/9]" : "aspect-[4/3]"}`} />
        )}
      </div>
      </div>
      </div>
      </section>

      {viewerImage
        ? createPortal(
            <div
              className={`fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-5 backdrop-blur-sm transition-opacity duration-200 ease-out md:p-8 ${
                isViewerVisible ? "opacity-100" : "opacity-0"
              }`}
              role="dialog"
              aria-modal="true"
              aria-label="Fullscreen image viewer"
              onClick={closeViewer}
            >
          {viewerImage?.id === "system" ? null : (
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close fullscreen image"
              onClick={(event) => {
                event.stopPropagation();
                closeViewer();
              }}
              className="absolute right-5 top-5 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/80 text-zinc-700 backdrop-blur-sm transition-colors duration-200 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:right-8 md:top-8"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          )}

          {viewerHasCarousel ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(event) => {
                  event.stopPropagation();
                  setCarouselIndex((prev) => (prev === 0 ? activeSegment.images.length - 1 : prev - 1));
                }}
                className="absolute left-4 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/70 text-zinc-700 opacity-70 backdrop-blur-sm transition-opacity duration-200 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:left-8"
              >
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                  <path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(event) => {
                  event.stopPropagation();
                  setCarouselIndex((prev) => (prev === activeSegment.images.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-4 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/70 text-zinc-700 opacity-70 backdrop-blur-sm transition-opacity duration-200 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:right-8"
              >
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                  <path d="M7.5 4.5 13 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          ) : null}

          {isRoadUxBeforeAfterViewer ? (
            <div
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-[92vw]"
            >
              <div
                ref={beforeAfterViewerFrameRef}
                className="relative w-full select-none overflow-hidden rounded-xl"
                style={{ aspectRatio: beforeAfterAspectRatio ?? "16 / 9" }}
                onMouseDown={handleBeforeAfterViewerDragStart}
              >
                <img
                  src={getOptimizedImageSrc(viewerSegment.beforeImage)}
                  alt={viewerSegment.title}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-contain"
                  draggable={false}
                />
                <img
                  src={getOptimizedImageSrc(viewerSegment.afterImage)}
                  alt={viewerSegment.title}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-contain"
                  style={{ clipPath: `inset(0 ${100 - beforeAfterViewerRatio * 100}% 0 0)` }}
                  draggable={false}
                />
                <div
                  className="pointer-events-none absolute inset-y-0 w-px bg-white/75"
                  style={{ left: `${beforeAfterViewerRatio * 100}%` }}
                />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="rounded-sm bg-zinc-100/90 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600">
                  Before
                </span>
                <div
                  ref={beforeAfterViewerControlRef}
                  className="relative h-2 flex-1 rounded-full bg-white/25"
                  onMouseDown={handleBeforeAfterViewerDragStart}
                >
                  <div
                    className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-white/55"
                    style={{ width: `${beforeAfterViewerRatio * 100}%` }}
                  />
                  <button
                    type="button"
                    aria-label="Drag image comparison slider"
                    onMouseDown={handleBeforeAfterViewerDragStart}
                    className="absolute top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-300/80 bg-white/92 text-zinc-700 shadow-sm transition-colors duration-200 ease-out hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
                    style={{ left: `${beforeAfterViewerRatio * 100}%` }}
                  >
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                      <path d="M8.5 6 5.5 10l3 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M11.5 6 14.5 10l-3 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                <span className="rounded-sm bg-zinc-100/90 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600">
                  After
                </span>
              </div>
            </div>
          ) : viewerSrc ? (
            viewerImage.id === "system" ? (
              <div
                onClick={(event) => event.stopPropagation()}
                className={`relative flex items-start justify-end transition-transform duration-200 ease-out ${
                  isViewerVisible ? "scale-[1.15]" : "scale-[1.11]"
                }`}
              >
                <button
                  ref={closeButtonRef}
                  type="button"
                  aria-label="Close fullscreen image"
                  onClick={(event) => {
                    event.stopPropagation();
                    closeViewer();
                  }}
                  className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/80 text-zinc-700 backdrop-blur-sm transition-colors duration-200 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:right-4 md:top-4"
                >
                  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                    <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
                <img
                  src={getOptimizedImageSrc(viewerSrc)}
                  alt={viewerAlt}
                  decoding="async"
                  className="block max-h-[60vh] w-auto max-w-[92vw] object-contain"
                />
              </div>
            ) : (
              <img
                src={getOptimizedImageSrc(viewerSrc)}
                alt={viewerAlt}
                decoding="async"
                onClick={(event) => event.stopPropagation()}
                className={`rounded-xl object-contain transition-transform duration-200 ease-out ${
                  viewerImage.id === "scenario" ? "h-[75vh] w-[75vw]" : "h-[92vh] w-[95vw]"
                } ${
                  isViewerVisible ? "scale-100" : "scale-[0.98]"
                }`}
              />
            )
          ) : null}
            </div>,
            document.body
          )
        : null}
    </>
  );
}

export default ProjectSegmentSection;
