// src/app/page.tsx

import Banner from '@/components/Banner';
import NewArrivals from '@/components/NewArrivals';
import SpecialOffer from '@/components/SpecialOffer';
import React from 'react';


const Page = () => {

  return (
    <div className=''>
      <Banner />
      <div className=" ">
      <SpecialOffer />
      <NewArrivals />

      </div>

 
    </div>
  );
};

export default Page;
