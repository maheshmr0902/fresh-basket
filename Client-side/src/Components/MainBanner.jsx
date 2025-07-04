import React from 'react'
import { assets } from '../assets/assets'
import {Link} from 'react-router-dom' // Corrected import path

const MainBanner = () => {
  return (
  <div className="relative w-full flex justify-center">
  <img
    src={assets.main_banner2_png}
    alt="banner"
    className="w-[95%] aspect-[2.80] hidden md:block rounded-xl"
  />
  <img
    src={assets.main_banner_bg_sm}
    alt="banner"
    className="w-full aspect-[1.5] md:hidden"
  />
  <div className='absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24'> {/* Corrected pd-24 to pb-24 */}
    <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-72 md:max-w-105 leading-tight lg:leading-15'>Freshness You can Trust, Savings you will love!</h1> {/* Corrected 'wiil' to 'will' */}


  <div  className='flex items-center mt-6 font-medium'> {/* Corrected front-medium to font-medium */}

    <Link to={'/products'} className='group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer'>Shop now
    <img  className='md:hidden transition'src={assets.white_arrow_icon} alt="arrow"/> {/* Removed unnecessary group-focus and corrected trasition */}
    </Link>
    <Link to={'/products'} className='group hidden md:flex items-center gap-2 px-9 py-3 text-white cursor-pointer'>Explore deals
    <img  className='transition group-focus:translate-x-1'src={assets.black_arrow_icon} alt="arrow"/> {/* Corrected trasition */}
    </Link>
  </div>
  </div>
</div>

  )
}

export default MainBanner