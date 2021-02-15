import Layout from "../../components/Layout";
import { withTranslation } from "../../i18n";

const Eligibility = ({t}) => (
  <Layout pageTitle="Eligibility">
    <div>{t("eligibility")}</div>
  </Layout>
);

export default withTranslation("common")(Eligibility);
