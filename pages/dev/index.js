// TODO: Rename this index.js when react migration is complete

import Layout from "../../components/Layout"
import Map from "../../components/Map"

const Home = () => (
  <Layout pageTitle="Home">
    <div>
      <div class="jumbotron">
        <h2>COVID-19 Vaccine Availability</h2>
        <p class="lead">For <a href="/eligibility"> eligible individuals </a>, find an appointment from the map below or</p>
        <div class="btn-group" style={{width: "100%", display:"flex", alignItems: "center", justifyContent: "center"}}>
          <a class="btn btn-success"  data-toggle="modal" href="/search" style={{justifyContent: "center"}}>Find Locations Near You</a>
        </div>
        
      </div>
      <Map />
      <p> <b> Red star: </b> Mass Vaccination Sites (high volume, large venue sites) </p>
      <p> <b> Green star: </b> General Vaccination Sites (healthcare locations) </p>
      <p> <b> Blue star: </b> Local Vaccination Site (open to select cities/towns) </p>
      <p> <b> Gray dot: </b> No availability currently </p>
      <p> Seeking volunteers, reach out to <a href="mailto:vaccinatema@gmail.com"> vaccinatema@gmail.com </a> to help out.</p>
    </div>
  </Layout>
);

export default Home;