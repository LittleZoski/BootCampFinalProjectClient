import ResourceCards from '@/components/ResourceCards'
import ResourceHero from '@/components/ResourceHero'
import VideoCard from '@/components/VideoCard'
import React from 'react'

function resources() {
  return (
    <div className='tip-page'>
        <ResourceHero />
        <ResourceCards />
        <VideoCard />
    </div>
  )
}

export default resources
