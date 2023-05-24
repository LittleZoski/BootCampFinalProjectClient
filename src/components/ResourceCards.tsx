import { Button, Card, CardBody, CardFooter, Heading, Stack } from '@chakra-ui/react'
import React from 'react'
import { FaPaw } from 'react-icons/fa'

function ResourceCards() {
  
  return (
    <div>
     <h1 className='card-header'>Tips, Tricks and Care For The:</h1>
      <div className="main">
  <ul className="cards">
    <li className="cards_item">
      <div className="card">
        <div className="card_image"><img className='dog-pic' src="https://images.unsplash.com/photo-1470390356535-d19bbf47bacb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHVwcHklMjBsb3ZlfGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60"/></div>
        <div className="card_content">
          <h2 className="card_title">First Time Dog Owner</h2>
         <a href='https://www.dailypaws.com/dogs-puppies/dog-adoption/first-time-dog-owner-tips'><button className="btn card_btn">Read More</button></a> 
        </div>
      </div>
    </li>
    <li className="cards_item">
      <div className="card">
        <div className="card_image"><img className='dog-pic' src="https://images.unsplash.com/photo-1494947665470-20322015e3a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGFjayUyMG9mJTIwZG9nc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60"/></div>
        <div className="card_content">
          <h2 className="card_title">Dog Rescuer</h2>
         <a href='https://craftycanineclub.com/adopting-a-rescue-dog-how-to-help-them-adjust-to-the-first-3-days-in-a-new-home/'><button className="btn card_btn">Read More</button></a> 
        </div>
      </div>
    </li>
    <li className="cards_item">
      <div className="card">
        <div className="card_image"><img className='dog-pic' src="https://images.unsplash.com/photo-1541888050297-a615ca315e96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZG9nJTIwdHJhaW5lcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60" /></div>
        <div className="card_content">
          <h2 className="card_title">Dog Trainer</h2>
          <a className='dog-pic' href='https://www.thekennelclub.org.uk/dog-training/getting-started-in-dog-training/dog-training-and-games/?gad=1&gclid=Cj0KCQjwmZejBhC_ARIsAGhCqncY7CwWY7cTr7HDX6va33HlLZzENZBtLMBV5OkHw4CFGeVSB4ZX4U0aAhqfEALw_wcB'><button className="btn card_btn">Read More</button></a>
        </div>
      </div>
    </li>
    <li className="cards_item">
      <div className="card">
        <div className="card_image"><img className='dog-pic' src="https://images.unsplash.com/photo-1583511666407-5f06533f2113?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZWF0aW5nJTIwZG9nfGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60"/></div>
        <div className="card_content">
          <h2 className="card_title">Dog That Is a Picky Eater</h2>
         <a href='https://vcahospitals.com/know-your-pet/feeding-canine-picky-eaters#:~:text=One%20approach%20is%20to%20offer,works%20best%20with%20dry%20kibble.'><button className="btn card_btn">Read More</button></a> 
        </div>
      </div>
    </li>
    <li className="cards_item">
      <div className="card">
        <div className="card_image"><img className='dog-pic'src="https://images.unsplash.com/photo-1422565096762-bdb997a56a84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGNvbXBldGl0aW9uJTIwZG9nfGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60"/></div>
        <div className="card_content">
          <h2 className="card_title">Competion Ready Pups</h2>
        <a href='https://www.akc.org/sports/events/'><button className="btn card_btn">Read More</button></a>  
        </div>
      </div>
    </li>
    <li className="cards_item">
      <div className="card">
        <div className="card_image"><img className='dog-pic' src="https://images.unsplash.com/photo-1581597359121-0f69057e2fb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2VydmljZSUyMGRvZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60"/></div>
        <div className="card_content">
          <h2 className="card_title">Service Dogs</h2>
          <a href='https://www.akc.org/expert-advice/training/service-dog-training-101/'><button className="btn card_btn">Read More</button></a>
        </div>
      </div>
    </li>
  </ul>
</div>
<div className="text-divider"><FaPaw className="divider-paw1"/><FaPaw className="divider-paw"/><FaPaw className="divider-paw2"/></div>
    </div>
    
  )
}

export default ResourceCards
