import React from 'react';

const styles = {
    ad: {
      margin: 'auto', 
      border: '1px solid #ccc',
      overflow: 'hidden',
      backgroundColor: '#f7f7f7',
    },
    adImage: {
      backgroundImage: 'url(/ad.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: '100%',
      height: '300px',
    },
};

const DemoAd = () => {
  return (
    <div style={styles.ad} className='demo'>
      <div style={styles.adImage}></div>
    </div>
  );
};

export default DemoAd;
