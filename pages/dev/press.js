import Layout from "../../components/Layout"
import EmailLink from '../../components/subcomponents/EmailLink'

const Press = () => (
  <Layout pageTitle="Vaccination Sites">
    <div id="press-page">
      <h1>In the press</h1>
      <h6>Are you a reporter and want to contact us? Shoot us an email at{" "}<EmailLink/></h6>
      <h2>Boston Globe</h2>
      <a href="https://www.bostonglobe.com/2021/02/08/business/another-coder-has-built-covid-vaccine-appointment-website-mass-residents/" target="_blank">
        Another coder has built a COVID vaccine appointment website for Mass. residents
      </a>
      <h2>Vice</h2>
      <a href="https://www.vice.com/en/article/wx8kv5/private-citizens-are-trying-to-make-it-easier-to-get-a-covid-vaccine-appointment" target="_blank">
        The COVID Vaccine Rollout Has Been So Chaotic People Are Making Their Own Websites to Find Appointments
      </a>
      <h2>Harvard GSAS</h2>
      <a href="https://gsas.harvard.edu/news/stories/bringing-vaccination-online" target="_blank">
        Bringing Vaccination Online
      </a>
      <h2>WCVB</h2>
      <a href="https://www.wcvb.com/article/volunteers-create-alternative-listing-of-covid-19-vaccination-sites-in-massachusetts/35462794" target="_blank">
        Volunteers create alternative listing of COVID-19 vaccination sites in Massachusetts
      </a>
      <h2>Framingham Source</h2>
      <a href="https://framinghamsource.com/index.php/2021/02/10/framingham-high-graduates-helping-people-book-covid-vaccines-through-vaccinatema-com-website/" target="_blank">
        Framingham High Graduates Helping People Book COVID Vaccines Through VaccinateMA.com Website
      </a>
    </div>
  </Layout>
);

export default Press;