import React, { useContext } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./OurTeam.css";
import Header from "../../common/Header/Header";
import HeaderMobile from "../../common/Header/HeaderMobile";
import { ThemeContext } from "../../../context/themeContext";
import { TextField } from "@material-ui/core";

const members = [
  {
    id: "56278",
    name: "Mayank Tripathi",
    photo: "/members/mt.png",
    domain: "Research & Development, Management",
  },
  {
    id: "56553",
    name: "Anmol Gangwar",
    photo: "/members/ag.jpg",
    domain: "Research & Development, Desiging",
  },
  {
    id: "56309",
    name: "Soni Danu",
    photo: "/members/sd.png",
    domain: "Chatbot & Documentation",
  },
  {
    id: "56305",
    name: "Sourav Chauhan",
    photo: "/members/sc.png",
    domain: "Testing",
  },
  {
    id: "57608",
    name: "Abhishek Verma",
    photo: "/members/av.png",
    domain: "Data Collection & Organization",
  },
];

export const OurTeam = () => {
  const { theme } = useContext(ThemeContext);

  const styleTheme =
    theme === "dark"
      ? { background: "#151515", color: "white" }
      : { background: "white", color: "black" };

  const BackgroundStyleTheme =
    theme === "dark"
      ? { backgroundColor: "black" }
      : { backgroundColor: "whitesmoke" };

  const clickStyleTheme =
    theme === "dark" ? { color: "#336A86ff" } : { color: "blue" };

  return (
    <div className="home">
      <HeaderMobile />
      <Header />
      <Container
        className="our-group-container mt-4"
        style={{ ...BackgroundStyleTheme }}
      >
        <h2 style={{ textAlign: "center", textTransform: "uppercase" }}>
          {"Team"}
        </h2>

        <Row className="justify-content-center">
          {members.slice(0, 3).map((member, index) => (
            <div key={index} className="text-center">
              <Card
                style={{
                  ...styleTheme,
                  width: "240px",
                  height: "320px",
                  borderRadius: "20px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  margin: "10px 20px 20px 20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px",
                  transition: "transform 0.3s ease",
                }}
                className="member-card"
              >
                <Card.Img
                  variant="top"
                  src={member.photo}
                  className="member-photo"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: "10px",
                    transition: "transform 0.3s ease",
                  }}
                />
                <Card.Body>
                  <Card.Title
                    style={{
                      fontSize: "15px",
                      marginBottom: "5px",
                    }}
                  >
                    <h5>{member.name}</h5>
                  </Card.Title>
                  <Card.Title
                    style={{
                      fontSize: "15px",
                      marginBottom: "10px",
                    }}
                  >
                    <h5>({member.id})</h5>
                  </Card.Title>
                  <Card.Text style={{ ...clickStyleTheme, fontSize: "13px" }}>
                    <p>{member.domain}</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Row>
        <Row className="justify-content-center">
          {members.slice(3, 5).map((member, index) => (
            <div key={index} className="text-center">
              <Card
                style={{
                  ...styleTheme,
                  width: "240px",
                  height: "320px",
                  borderRadius: "20px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  margin: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px",
                  transition: "transform 0.3s ease",
                }}
                className="member-card"
              >
                <Card.Img
                  variant="top"
                  src={member.photo}
                  className="member-photo"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: "10px",
                    transition: "transform 0.3s ease",
                  }}
                />
                <Card.Body>
                  <Card.Title
                    style={{
                      fontSize: "15px",
                      marginBottom: "5px",
                    }}
                  >
                    <h5>{member.name}</h5>
                  </Card.Title>
                  <Card.Title
                    style={{
                      fontSize: "15px",
                      marginBottom: "10px",
                    }}
                  >
                    <h5>({member.id})</h5>
                  </Card.Title>
                  <Card.Text style={{ ...clickStyleTheme, fontSize: "13px" }}>
                    <p>{member.domain}</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Row>
      </Container>
    </div>
  );
};
