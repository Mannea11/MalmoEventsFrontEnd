import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './BillettoComponent.css';

const ApiComponent = ({ apiUrl }) => {
  const [events, setEvents] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [uniqueVenueNames, setUniqueVenueNames] = useState([]);

  useEffect(() => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log('API Response:', data);
        const sortedEvents = data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        setEvents(sortedEvents);
        const venues = [...new Set(data.map(event => event.venueName))];
        setUniqueVenueNames(venues);
      })
      .catch(error => console.error('Error:', error));
  }, [apiUrl]);

  const isTitleLong = (title) => title.length > 20;

  const handleVenueChange = (event) => {
    setSelectedVenue(event.target.value);
  };

  const handleDateFilterChange = (event) => {
    setSelectedDateFilter(event.target.value);
  };

  const isToday = (dateString) => {
    const eventDate = new Date(dateString);
    const currentDate = new Date();
    return eventDate.toDateString() === currentDate.toDateString();
  };

  const isWithinComingWeek = (dateString) => {
    const eventDate = new Date(dateString);
    const currentDate = new Date();
    const oneWeekLater = new Date(currentDate);
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);
    return eventDate >= currentDate && eventDate <= oneWeekLater;
  };

  const isWithinComingMonth = (dateString) => {
    const eventDate = new Date(dateString);
    const currentDate = new Date();
    const oneMonthLater = new Date(currentDate);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    return eventDate >= currentDate && eventDate <= oneMonthLater;
  };

  const filteredEvents = events.filter((event) => {
    const venueFilter = selectedVenue.toLowerCase();
    const title = event.venueName.toLowerCase();

    if (selectedVenue && title.indexOf(venueFilter) === -1) {
      return false;
    }

    switch (selectedDateFilter) {
      case 'today':
        return isToday(event.startDate || event.dateTime);
      case 'week':
        return isWithinComingWeek(event.startDate || event.dateTime);
      case 'month':
        return isWithinComingMonth(event.startDate || event.dateTime);
      default:
        return true;
    }
  });

  return (
    <div>
      <div className="filter-container">
        <div>
          <select id="venueFilter" onChange={handleVenueChange} value={selectedVenue}>
            <option value="">Alla lokaler</option>
            {uniqueVenueNames.map((venue, index) => (
              <option key={index} value={venue}>
                {venue}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select id="dateFilter" onChange={handleDateFilterChange} value={selectedDateFilter}>
            <option value="all">Alla datum</option>
            <option value="today">Idag</option>
            <option value="week">Inom 7 dagar</option>
            <option value="month">Inom 30 dagar</option>
          </select>
        </div>
      </div>
      <div className="events-container">
        <ul className="event-list">
          {filteredEvents.map(event => (
            <li key={event.id} className="event-item">
              <Link to={`/BillettoEvent/${event.id}`} className="event-link">
                <div className="event-content">
                  <img src={event.image} alt={event.title} className="event-image" />
                  <h3 className={`event-title ${isTitleLong(event.title) ? 'event-title-small' : ''}`}>
                    {event.title}
                  </h3>
                  <p className="event-info">{event.venueName || ''}</p>
                  <p className="event-info">{formatDate(event.startDate || '')}</p>
                  <p className="event-info">{event.endDate ? formatDate(event.endDate) : ''}</p>
                  <button className="more-info-button">Mer Info</button>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
  return new Date(dateString).toLocaleString(undefined, options);
};

export default ApiComponent;
