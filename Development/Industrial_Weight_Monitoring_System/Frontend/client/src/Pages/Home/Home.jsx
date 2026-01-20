import React from 'react'
import InventoryCount from './InventoryCount'
import SystemArchitecture from './SystemArchitecture'
import WhyUs from './WhyUs'
import IndiustryVerticals from './IndustryVerticals'
import InvueWork from './InvueWork'
import ProductFeatures from './ProductFeatures'
import Bottombanner from './Bottombanner'
import DownloadApp from './DownloadApp'

const Home = () => {
  return (
    <div>
        <InventoryCount />
        <SystemArchitecture />
        <WhyUs />
        <IndiustryVerticals />
        <InvueWork />
        <ProductFeatures />
        <Bottombanner />
        <DownloadApp />
    </div>
  )
}

export default Home