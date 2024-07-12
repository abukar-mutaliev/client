// src/components/ImageCropper/ImageCropper.js

import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./cropImage"; // Дополнительная утилита для получения обрезанного изображения
import "./ImageCropper.scss";

const ImageCropper = ({ onCropComplete, initialImage }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropCompleteHandler = useCallback(
    (croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(initialImage, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="image-cropper">
      <div className="crop-container">
        <Cropper
          image={initialImage}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropCompleteHandler}
        />
      </div>
      <div className="controls">
        <input
          type="range"
          value={zoom}
          min="1"
          max="3"
          step="0.1"
          aria-labelledby="Zoom"
          onChange={(e) => {
            setZoom(e.target.value);
          }}
          className="zoom-range"
        />
        <button type="button" onClick={handleCrop}>
          Обрезать изображение
        </button>
      </div>
    </div>
  );
};

ImageCropper.propTypes = {
  onCropComplete: PropTypes.func.isRequired,
  initialImage: PropTypes.string,
};

ImageCropper.defaultProps = {
  initialImage: null,
};

export default ImageCropper;
