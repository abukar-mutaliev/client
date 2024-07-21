import React, { useEffect } from "react";
import "./regionsPage.scss";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import {
  getPersons,
  pinPerson,
} from "../../../app/providers/StoreProvider/personSlice";
import { Card } from "../../../shared/ui/Card";
import { fetchRegions } from "../../../app/providers/StoreProvider/regionSlice";

export function RegionsPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const persons = useSelector((state) => state.persons.persons);
  const regions = useSelector((state) => state.regions.regions);
  const admin = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getPersons());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);

  const filteredPersons = persons
    .filter((person) => person.regionRegionId === Number(id))
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return a.person_name.localeCompare(b.person_name);
    });

  const regionName = regions
    .slice()
    .sort((a, b) => a.region_name.localeCompare(b.region_name))
    .find((region) => region.region_id === Number(id))?.region_name;

  if (!regions.length) {
    return (
      <div className="loader">
        <BarLoader />
      </div>
    );
  }

  const handlePinClick = (personId) => {
    dispatch(pinPerson(personId));
  };

  return (
    <div className="regions_page">
      <p className="region_name">{regionName}</p>
      <div className="regions_container">
        {filteredPersons.map((item) => (
          <Card
            key={item.person_id}
            item={item}
            admin={admin}
            onPinClick={handlePinClick}
          />
        ))}
      </div>
    </div>
  );
}
