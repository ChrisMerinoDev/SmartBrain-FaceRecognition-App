import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Keeps an <img> ref, tracks its rendered size, and converts Clarifai
 * ratio regions -> pixel boxes whenever image dims or regions change.
 */
export function useFaceBoxes() {
  const imgRef = useRef(null);
  const [imgDims, setImgDims] = useState({ width: 0, height: 0 });
  const [boxes, setBoxes] = useState([]);

  const measure = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    // clientWidth/Height are fine; getBoundingClientRect also works
    setImgDims({ width: img.clientWidth, height: img.clientHeight });
  }, []);

  const onImageLoad = useCallback(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    // Re-measure on window resize so boxes stay aligned
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure]);

  const computeBoxes = useCallback(
    (regions) => {
      if (!regions?.length || !imgDims.width || !imgDims.height) return [];
      return regions.map((r) => {
        const b = r.region_info.bounding_box; // ratios 0..1
        const top = b.top_row * imgDims.height;
        const left = b.left_col * imgDims.width;
        const bottom = b.bottom_row * imgDims.height;
        const right = b.right_col * imgDims.width;
        return {
          top,
          left,
          width: Math.max(0, right - left),
          height: Math.max(0, bottom - top),
        };
      });
    },
    [imgDims]
  );

  const updateBoxesFromRegions = useCallback(
    (regions) => setBoxes(computeBoxes(regions)),
    [computeBoxes]
  );

  return {
    imgRef,
    boxes,
    onImageLoad,            // call on <img onLoad/>
    updateBoxesFromRegions, // call when Clarifai regions arrive
    reset: () => setBoxes([]),
  };
}
