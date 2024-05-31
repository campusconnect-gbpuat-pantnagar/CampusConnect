import React, { useContext } from "react";
import Header from "../../common/Header/Header";
import {
	Card,
	CardContent,
	CardMedia,
	Container,
	Grid,
	Typography,
} from "@material-ui/core";
import "./AboutUniversity.css";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import { AuthContext } from "../../../context/authContext/authContext";
import HeaderMobile from "../../common/Header/HeaderMobile";

export const AboutUniversity = () => {
	const authContext = useContext(AuthContext)
	const styleTheme =
		authContext.theme === "dark"
			? { background: "#121212", color: "whitesmoke" }
			: null
	const clickStyleTheme =
		authContext.theme === "dark"
			? { color: "#03DAC6" }
			: { color: "blue" }

	return (
		<div className="home">
			<HeaderMobile />
			<Header />
			<div className="container top-margin" id="aboutContainer">
				<Grid container justifyContent="center">
					<Grid item xs={10}>
						<Card variant="outlined" style={styleTheme}>
							<Grid
								container
								justifyContent="center"
								alignItems="flex-start"
								className="p-3 ">
								<Grid item xs={8} md={4}>
									<Grid
										container
										justifyContent="center"
										alignContent="center">
										<CardMedia
											component="img"
											style={{ maxWidth: "150px" }}
											image="gbpuatLogo.png"
											label={"Logo"}
										/>
									</Grid>
								</Grid>
								<Grid item xs={12} md={12}>
									<Grid container justifyContent="center">
										<CardContent className="text-center">
											<Typography
												gutterBottom
												variant="h3"
												component="h2">
												{"G. B. Pant University of Agriculture & Technology"}
											</Typography>
											<Typography
												gutterBottom
												variant="subtitle1">
												<a
													href="https://www.gbpuat.ac.in/"
													target="_blank"
													rel="noreferrer noopener" style={clickStyleTheme}>
													{
														"Official University Website"
													}
													<OpenInNewIcon fontSize="small" />
												</a>
											</Typography>
										</CardContent>
									</Grid>
								</Grid>
							</Grid>
						</Card>
					</Grid>
				</Grid>
				<Grid container justifyContent="center" className="my-3">
					<Grid item xs={10}>
						<Card variant="outlined" style={styleTheme}>
							<Container className="px-5 py-4">
								<Typography
									variant="h4"
									className="text-center pb-3">
									About University
								</Typography>
								<Typography variant="body2">
									{
										"After independence, development of the rural sector was considered the primary concern of the Government of India. In 1949, with the appointment of the Radhakrishnan University Education Commission, imparting of agricultural education through the setting up of rural universities became the focal point. Later, in 1954 an Indo-American team led by Dr. K.R. Damle, the Vice-President of ICAR, was constituted that arrived at the idea of establishing a Rural University on the land-grant pattern of USA. As a consequence a contract between the Government of India, the Technical Cooperation Mission and some land-grant universities of USA, was signed to promote agricultural education in the country. The US universities included the universities of Tennessee, the Ohio State University, the Kansas State University, The University of Illinois, the Pennsylvania State University and the University of Missouri. The task of assisting Uttar Pradesh in establishing an agricultural university was assigned to the University of Illinois which signed a contract in 1959 to establish an agricultural University in the State. Dean, H.W. Hannah, of the University of Illinois prepared a blueprint for a Rural University to be set up at the Tarai State Farm in the district Nainital, UP. In the initial stage the University of Illinois also offered the services of its scientists and teachers. Thus, in 1960, the first agricultural university of India, UP Agricultural University, came into being by an Act of legislation, UP Act XI-V of 1958. The Act was later amended under UP Universities Re-enactment and Amendment Act 1972 and the University was rechristened as Govind Ballabh Pant University of Agriculture and Technology keeping in view the contributions of Pt. Govind Ballabh Pant, the then Chief Minister of UP. The University was dedicated to the Nation by the first Prime Minister of India Pt Jawaharlal Nehru on 17 November 1960."
									}
								</Typography>
								<br />
								<Typography variant="body2">
									{
										"The G.B. Pant University is a symbol of successful partnership between India and the United States. The establishment of this university brought about a revolution in agricultural education, research and extension. It paved the way for setting up of 31 other agricultural universities in the country."
									}
								</Typography>
								<br />
								<Typography variant="body2">
									{
										"The credit for starting the functioning of the University without losing any time goes to the warm and resourceful personality of the first Vice-Chancellor, late Dr. Kenneth Anthony Parker Stevenson (1-12-58 to 2-1-64), who could keep people fruitfully engaged on the university farm, the labs and the classrooms despite the lurking fear of wild animals roaming the area."
									}
								</Typography>
								<br />
								<Typography variant="body2">
									{
										"The Campus appears impressive today with its well-tended fields, a network of roads, housing colonies, street lighting, a telephone exchange, hospitals, marketing centres, a water supply section, 6 primary schools and 3 secondary schools. The main campus lies in Udham Singh Nagar district of Uttarakhand at 29 N latitude and 79 E longitude at an elevation of 243.8 m above the mean sea level. This main campus has the area responsibility for the entire Uttarakhand representing plains, Tarai, Bhabar and hill areas. However, to provide service to the hill region its other stations are situated at Ranichauri (Tehri district), Majhera (Nainital district) and at Lohaghat-Sui (Champavat district). There are 763 teachers and officers 59 technical staff, 631 administrative and ministerial personnel and 1425 class III employees, amounting to a total strength of 2878. The number of students in the University ranges between 4200-4400. Thus, the teacher taught ratio is about 1:6."
									}
								</Typography>
							</Container>
						</Card>
					</Grid>
				</Grid>
			</div>
		</div>
	);
};
