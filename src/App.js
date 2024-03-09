
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainMenu from './MainMenu';
import BillettoComponent from './BillettoComponent';
import EventComponent from './EventComponent';
import TicketMasterComponent from './TicketMasterComponent';
import TicksterComponent from './TicksterComponent';
import BillettoEventDetail from './BillettoEventDetail';
import TicketMasterEventDetail from './TicketMasterEventDetail';
import TicksterEventDetail from './TicksterEventDetail'
import About from './About';
import './App.css';



const App = () => {
  const billettoApiUrl = 'https://events.agreeableflower-86273736.northeurope.azurecontainerapps.io/billetto/event';
  const ticketMasterApiUrl = 'https://events.agreeableflower-86273736.northeurope.azurecontainerapps.io/ticketmaster/event';
  const ticksterApiUrl = 'https://events.agreeableflower-86273736.northeurope.azurecontainerapps.io/tickster/event';

  const billettoMusicUrl = 'https://events.agreeableflower-86273736.northeurope.azurecontainerapps.io/billetto/category/music'
  const billettoFoodUrl = 'https://events.agreeableflower-86273736.northeurope.azurecontainerapps.io/billetto/category/food_drink'
  const billettoPerformingArtsUrl = 'https://events.agreeableflower-86273736.northeurope.azurecontainerapps.io/billetto/category/performing_arts'
  const billettoMoviesUrl = 'https://events.agreeableflower-86273736.northeurope.azurecontainerapps.io/billetto/category/film_media'

  const ticksterMusicUrl = 'https://events.agreeableflower-86273736.northeurope.azurecontainerapps.io/tickster/category/music'
  const ticksterPerformingArtsUrl = 'https://events.agreeableflower-86273736.northeurope.azurecontainerapps.io/tickster/category/scenkonst'

  const ticketmasterMusicUrl = 'https://events.agreeableflower-86273736.northeurope.azurecontainerapps.io/ticketmaster/category/KZFzniwnSyZfZ7v7nJ'
  const ticketmasterSportUrl = 'https://events.agreeableflower-86273736.northeurope.azurecontainerapps.io/ticketmaster/category/KZFzniwnSyZfZ7v7nE'
  const ticketmasterPerformingArtsUrl = 'https://events.agreeableflower-86273736.northeurope.azurecontainerapps.io/ticketmaster/category/KZFzniwnSyZfZ7v7na'

  return (
    <Router>
      <div className="app-container">
        <MainMenu />
        <Routes>
          <Route path="/allEvents" element={<EventComponent apiUrls={[billettoApiUrl, ticketMasterApiUrl, ticksterApiUrl]} />} />
          <Route path="/billetto" element={<BillettoComponent apiUrl={billettoApiUrl} />} />
          <Route path="/ticketmaster" element={<TicketMasterComponent apiUrl={ticketMasterApiUrl} />} />
          <Route path="/tickster" element={<TicksterComponent apiUrl={ticksterApiUrl} />} />
          <Route path="/musik" element={<EventComponent apiUrls={[billettoMusicUrl,ticksterMusicUrl,ticketmasterMusicUrl]} />} />
          <Route path="/mat" element={<EventComponent apiUrls={[billettoFoodUrl]} />} />
          <Route path="/scenkonst" element={<EventComponent apiUrls={[billettoPerformingArtsUrl, ticksterPerformingArtsUrl,ticketmasterPerformingArtsUrl]} />} />
          <Route path="/film" element={<EventComponent apiUrls={[billettoMoviesUrl]} />} />
          <Route path="/sport" element={<EventComponent apiUrls={[ticketmasterSportUrl]} />} />
          <Route path="/" element={<EventComponent apiUrls={[billettoApiUrl, ticketMasterApiUrl, ticksterApiUrl]} />} />
          <Route path="/BillettoEvent/:eventId" element={<BillettoEventDetail/>} />
          <Route path="/ticketmasterEvent/:eventId" element={<TicketMasterEventDetail />} />
          <Route path="/ticksterEvent/:eventId" element={<TicksterEventDetail />} />
          <Route path="/om" element={<About />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;
