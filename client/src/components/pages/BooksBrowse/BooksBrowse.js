import React from 'react';
import { Container } from 'react-bootstrap';
import './BooksBrowse.css';
import Header from "../../common/Header/Header";
import HeaderMobile from "../../common/Header/HeaderMobile";

export const BooksBrowse = () => {
  return (
    <div className="home">
        <HeaderMobile />
        <Header />
        <Container fluid className="iframe-container">
        <iframe
          src="https://www.wikipedia.org/"
          frameborder="0"
          style={{ width: '100%', height: '100%' }}
        ></iframe>
      </Container>
    </div>
  );
}