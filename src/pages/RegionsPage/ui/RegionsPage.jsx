import React, { useEffect } from "react";
import "./regionsPage.scss";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { getPersons } from "../../../app/providers/StoreProvider/personSlice";
import { Card } from "../../../shared/ui/Card";
import { fetchRegions } from "../../../app/providers/StoreProvider/regionSlice";

export function RegionsPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const persons = useSelector((state) => state.persons.persons);
  const regions = useSelector((state) => state.regions.regions);

  useEffect(() => {
    dispatch(getPersons());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);

  const filteredPersons = persons.filter(
    (person) => person.regionRegionId === Number(id)
  );
  const regionName = regions.find(
    (region) => region.region_id === Number(id)
  )?.region_name;

  if (!regions.length) {
    return (
      <div className="loader">
        <BarLoader />
      </div>
    );
  }

  return (
    <div className="regions_page">
      <div>
        <p className="region_name">{regionName}</p>
        <div className="regions_container">
          {filteredPersons.map((item) => {
            return <Card key={item.person_id} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
}
