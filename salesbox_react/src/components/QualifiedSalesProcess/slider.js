import React, { useState } from 'react';
import './slider.less';

const slider = ({ width }) => {
  const [slider, setSlider] = useState([]);
  return (
    <div className="sale-slider-wrapper" style={{ width }}>
      <div className="box-sale-method"></div>
    </div>
  );
};

export default slider;
