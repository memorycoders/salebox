import React from 'react';
import _l from 'lib/i18n';

const ProductExample = () => {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '5px', marginBottom: '10px' }}>
      <div style={{ padding: '15px 16px', borderBottom: '1px solid #c0c1c2' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#6D6E70' }}>{_l`Example`}</p>
      </div>
      <div style={{ padding: '27px 16px 27px 20px' }}>
        <img
          style={{ display: 'block', width: '100%', maxWidth: '100%', height: 'auto' }}
          src="https://qa.salesbox.com/desktop/assets/img/product-group-example.png"
        />
      </div>
    </div>
  );
};

export default ProductExample;
