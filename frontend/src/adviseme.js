import { useState } from "react";
import { handleLogOut } from "./home";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function AdviseMe() {
  const navigate = useNavigate();


  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogOut() {
    //make an API call to add the token to the blacklist
    try {
      const response = await fetch('http://localhost:3001/addtokentoblacklist', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          },
          body: JSON.stringify({
              token: localStorage.getItem('jwt')
          }),
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success:', data);
  } catch (error) {
      console.error('Error:', error);
  }
  localStorage.removeItem('jwt');
  navigate('/login');
    
}
  

  async function handleRecommendationButtonClick() {
    setRecommendation(null);
    setLoading(true);
    const response = await fetch("http://localhost:3001/recommendation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      },
      body: JSON.stringify({ userId: localStorage.getItem('userId') }),  
    });
    if (response.ok) {
      const data = await response.json();
      console.log('Recommendation:', data);
      setRecommendation(data.recommendation);
      setLoading(false);
      // Display the recommendation to the user

    } else {
      console.log("Recommendation failed");
    }
  }
  return (
    <div>
      <section className='media-section h-screen bg-default-bg-color'>

      <div className="nav-bar">
          <div className = "w-screen h-24 overflow-hidden relative">
          <img src="/Pasted_Graphic.svg" className="w-screen opacity-50 absolute h-full w-full object-cover"></img>
          <div className="button-container">
          <button className="absolute right-10 top-8 z-10 button-container justify-center rounded-md border bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={() => handleLogOut()}>Log out</button>
          </div>
          </div>
          
        </div>
      <h1 className="mt-24 text-4xl font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-6xl">adviseMe</h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">Find your new favourite book, film or TV show based on your past titles</p>
      <p className="mt-6 text-lg leading-8 text-gray-600">Click the adviseMe button below to get a recommendation</p>
      <div className="options-container">
        <button className="button-container justify-center rounded-md border bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={(handleRecommendationButtonClick)}>AdviseMe</button>
      <button className="button-container justify-center rounded-md border bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={() => navigate('/home')}>Take me home</button>
      </div>
      <div id="loading">
        {loading && <p>Loading...</p>}
      </div>
      <div id="recommendation">
        {recommendation && <p>{recommendation}</p>} 
      </div>
      </section>
    </div>
  );
}