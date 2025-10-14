const FaceRecognition = ({ imageUrl, boxes = [], imgRef, onImageLoad }) => {
  const safeRef =
    imgRef && typeof imgRef === "object" && "current" in imgRef ? imgRef : null;

  return (
    <div className="relative mx-auto max-w-xl">
      {imageUrl && (
        <img
          ref={safeRef}
          src={imageUrl}
          alt="face detection target"
          onLoad={onImageLoad}
          className="w-full h-auto block rounded-lg shadow-sm shadow-gray-800"
        />
      )}
      {boxes.map((b, i) => (
        <div
          key={i}
          className="absolute border-2 border-emerald-400 shadow"
          style={{
            top: `${b.top}px`,
            left: `${b.left}px`,
            width: `${b.width}px`,
            height: `${b.height}px`,
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
  );
};

export default FaceRecognition;