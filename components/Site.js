import Pin from "./Pin"

const Site = ({data}) => (
    <li className="list-group-item">
    <h4>{data.locationName}</h4>
    <div>
        <div className="site_address mb-2 flex flex-row items-center">
            <Pin />
            <a id = "site_address_1" className="underline" href={"https://maps.google.com/?q=" + data.address} target="_blank">{data.address}</a>
        </div>
        <div>
            <div className="" id = "latest_report_1">Latest report: {data.lastUpdated}</div>
            <dt className="">Details</dt>
            <dd className="" id = "details_1">{data.populationsServed}</dd>
            <dt className="">Availability</dt>
            <dd className="" id = "latest_info_1">{data.vaccineAvailability}</dd>
            <dt className="">Book Now</dt>
            <dd className="" id = "book_1">{data.bookAppointmentInformation}</dd>
        </div>
    </div>
    </li>
);

export default Site;
