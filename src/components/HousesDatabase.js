import React, { useState } from "react";
import styles from "../styles/HousesDatabase.module.css";

const HousesDatabase = () => {
  const houses = [
    { id: 1, name: "House 1", price: "$500,000", state: "California", propertyType: "Single Family", county: "Los Angeles", ownerType: "Owner Occupied", status: "Available" },
    { id: 2, name: "House 2", price: "$750,000", state: "Texas", propertyType: "Condo", county: "Harris", ownerType: "Investor", status: "Sold" },
    { id: 3, name: "House 3", price: "$1,000,000", state: "California", propertyType: "Multi-Family", county: "Orange", ownerType: "Owner Occupied", status: "Available" },
    { id: 4, name: "House 4", price: "$1,200,000", state: "Florida", propertyType: "Townhouse", county: "Miami-Dade", ownerType: "Investor", status: "Pending" },
  ];

  const [filters, setFilters] = useState({
    state: "",
    propertyType: "",
    county: "",
    ownerType: "",
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredHouses = houses.filter((house) => {
    return (
      (filters.state === "" || house.state === filters.state) &&
      (filters.propertyType === "" || house.propertyType === filters.propertyType) &&
      (filters.county === "" || house.county === filters.county) &&
      (filters.ownerType === "" || house.ownerType === filters.ownerType)
    );
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Houses Database</h1>

      {/* Filters Section */}
      <div className={styles.filters}>
        <select name="state" value={filters.state} onChange={handleFilterChange}>
          <option value="">Select State</option>
          <option value="California">California</option>
          <option value="Texas">Texas</option>
          <option value="Florida">Florida</option>
        </select>

        <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange}>
          <option value="">Select Property Type</option>
          <option value="Single Family">Single Family</option>
          <option value="Condo">Condo</option>
          <option value="Multi-Family">Multi-Family</option>
          <option value="Townhouse">Townhouse</option>
        </select>

        <select name="county" value={filters.county} onChange={handleFilterChange}>
          <option value="">Select County</option>
          <option value="Los Angeles">Los Angeles</option>
          <option value="Harris">Harris</option>
          <option value="Orange">Orange</option>
          <option value="Miami-Dade">Miami-Dade</option>
        </select>

        <select name="ownerType" value={filters.ownerType} onChange={handleFilterChange}>
          <option value="">Select Owner Type</option>
          <option value="Owner Occupied">Owner Occupied</option>
          <option value="Investor">Investor</option>
        </select>
      </div>

      {/* Houses Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>House Name</th>
            <th>Price</th>
            <th>State</th>
            <th>Property Type</th>
            <th>County</th>
            <th>Owner Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredHouses.map((house) => (
            <tr key={house.id}>
              <td>{house.id}</td>
              <td>{house.name}</td>
              <td>{house.price}</td>
              <td>{house.state}</td>
              <td>{house.propertyType}</td>
              <td>{house.county}</td>
              <td>{house.ownerType}</td>
              <td className={`${styles.status} ${styles[house.status.toLowerCase()]}`}>
                {house.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HousesDatabase;