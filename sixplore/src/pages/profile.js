import React, { useState, useEffect, useRef } from "react";
import './profile.css'
import Navbar from '../components/navbar/nav'
import ContentBox from '../components/ContentBox/ContentBox';
import Modal from '../components/modal/modal';
import unlike from '../assets/xSmall.svg'
import { Button } from '../components/button/Button'
import { useUser } from '../UserSession'
import { useNavigate } from 'react-router-dom';

const Plans = ["Last Minute Day Trips", "Date Night ideas", "@ AM Food Runs", "FUN",];

var name = "Gary Deng"
var email = "gary.deng@torontomu.ca"
var phoneNumber = "(647) 999-9999"



// const events = [
//   {
//     eventID: 1,
//     name: "EXAMPLE EVENT",
//     name: "EXAMPLE EVENT",
//     location: "123 One Piece Avenue, Konoha A1B2C3",
//     genres: ["bar/club", "fast food", "fine dining", "escape room", "physical activity"]
//   },

//   {
//     eventID: 2,
//     name: "EXAMPLE EVENT",
//     location: "123 One Piece Avenue, Konoha A1B2C3",
//     genres: ["bar/club", "fast food", "fine dining", "escape room", "physical activity"]
//   },

//   {
//     eventID: 3,
//     name: "EXAMPLE EVENT",
//     location: "123 One Piece Avenue, Konoha A1B2C3",
//     genres: ["bar/club", "fast food", "fine dining", "escape room", "physical activity"]
//   },
//   {
//     eventID: 4,
//     name: "EXAMPLE EVENT",
//     location: "123 One Piece Avenue, Konoha A1B2C3",
//     genres: ["bar/club", "fast food", "fine dining", "escape room", "physical activity"]
//   },

//   {
//     eventID: 5,
//     name: "EXAMPLE EVENT",
//     location: "123 One Piece Avenue, Konoha A1B2C3",
//     genres: ["bar/club", "fast food", "fine dining", "escape room", "physical activity"]
//   },
//   {
//     eventID: 6,
//     name: "EXAMPLE EVENT",
//     location: "123 One Piece Avenue, Konoha A1B2C3",
//     genres: ["bar/club", "fast food", "fine dining", "escape room", "physical activity"]
//   },

//   {
//     eventID: 7,
//     name: "EXAMPLE EVENT",
//     location: "123 One Piece Avenue, Konoha A1B2C3",
//     genres: ["bar/club", "fast food", "fine dining", "escape room", "physical activity"]
//   },
  
// ]

export default function Profile() {

  let [modal, setModal] = useState(false);
  let [plan, setPlan] = useState(null);
  let [isClickable, setIsClickable] = useState(true);
  let [userEvents, setUserEvents] = useState(null);
  const {user} = useUser();
  const navigate = useNavigate();

  if(user == null) {
    navigate('/about');
  }

  useEffect (() =>{
    const fetchUserLikedEvents = async () => {
      try {
          const resp = await fetch(`http://localhost:5000/users/${user}/getFavourites`);
          const json = await resp.json();
          console.log("RAWRESPONSE: ", json);

          const formattedEvents = json.map(event => ({
            eventID: event._id,
            name: event.name,
            description: event.description,
            location: event.address,
            genres: event.tags
          }));
          console.log("Formatted Events: ", formattedEvents);
          setUserEvents(formattedEvents);
          console.log("UserEvents: ", userEvents);
      } catch (error) {
          console.log("error", error);
      }
    }; 
    fetchUserLikedEvents();
  }, [userEvents]);

  const clickModal = (Plan) => {
    //console.log(modal);
    setModal(true);
    setPlan(Plan);
    setIsClickable(false);
  }

  const exitModal = () => {
    setModal(false);
    setIsClickable(true);
  }

  return (
    <div>
      <Navbar />

      <div className="profile" id="profile">
        <div className="profile-bigDiv">
          <div className="leftDiv">

            <div className="profile-h2">
              Profile Information
            </div>
            <div className="profile-scaleBox">
              <h1>{name}</h1>
              <h1>{email}</h1>
              <h1>{phoneNumber}</h1>
            </div>

            <div className="profile-h2">
              <div>Plans</div>
            </div> 
            <div className="profile-scaleBox3">

              {Plans.map((Plan) => (
                <div>
                <h1 style={{cursor: 'pointer'}} onClick={() => clickModal(Plan)}> {Plan} </h1>
                <Modal isOpen={modal} onClose={exitModal}>
                  <div className="profile-modal-title">{plan}</div>
                  <div>Put events here</div>

                  <Button buttonColor='primary' buttonSize='btn-medium' buttonStyle='btn-primary' >
                    Delete Plan
                  </Button>
                </Modal>
                </div>
              ))}

            </div>
          </div>

          <div className="profile-rightDiv">
            <div className="profile-h2">Liked Destinations</div>
            <div className="profile-scaleBox2">
              {userEvents?.map(({ eventID, name, genres, location }) => {
                return (
                  <div>
                    <ContentBox plans={Plans} eventID={eventID} location={location} name={name} genres={genres} clickable={isClickable} sendClickable={setIsClickable} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
