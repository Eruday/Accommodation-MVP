import React, { useState, useEffect, useRef } from 'react';
import './Lightbox.css';

const Lightbox = ({ images, currentIndex, isOpen, onClose, onNext, onPrev }) => {
  const [zoom, setZoom] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  // Reset zoom when image changes
  useEffect(() => {
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
  }, [currentIndex]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 1));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
  };

  const handleMouseWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - translate.x,
        y: e.clientY - translate.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setTranslate({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1 && zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - translate.x,
        y: e.touches[0].clientY - translate.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && zoom > 1 && e.touches.length === 1) {
      e.preventDefault();
      setTranslate({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowRight':
        onNext();
        break;
      case 'ArrowLeft':
        onPrev();
        break;
      case 'Escape':
        onClose();
        break;
      case '+':
      case '=':
        handleZoomIn();
        break;
      case '-':
        handleZoomOut();
        break;
      case '0':
        handleResetZoom();
        break;
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isOpen, handleMouseMove, handleMouseUp, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <button className="lightbox-btn prev" onClick={onPrev}>&#10094;</button>
        
        <div className="image-container">
          <img
            ref={imageRef}
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className="lightbox-image"
            style={{
              transform: `scale(${zoom}) translate(${translate.x}px, ${translate.y}px)`,
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
            onWheel={handleMouseWheel}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            draggable={false}
          />
        </div>
        
        <button className="lightbox-btn next" onClick={onNext}>&#10095;</button>
        
        <div className="lightbox-counter">
          {currentIndex + 1} / {images.length}
        </div>
        
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={handleZoomIn}>+</button>
          <button className="zoom-btn" onClick={handleZoomOut}>−</button>
          <button className="zoom-btn" onClick={handleResetZoom}>⟲</button>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;