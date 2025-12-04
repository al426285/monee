import React, { useState, useMemo } from "react";
import EditDeleteActions from "./EditDeleteActions";
import { VehicleViewModel } from "../../viewmodel/VehicleViewModel";
import Swal from "sweetalert2";
import { isValidVehicleName } from "../../core/utils/validators";
export default function VehiclesPage() {
  const {
    vehicles,
    loading,
    error,
    loadVehicles,
    addVehicle,
    deleteVehicle,
  } = VehicleViewModel();

  const PLUS_ICON_PATH =
    "M12 2a1 1 0 0 1 1 1v8h8a1 1 0 1 1 0 2h-8v8a1 1 0 1 1-2 0v-8H3a1 1 0 1 1 0-2h8V3a1 1 0 0 1 1-1z";

  // separamos por por tipo
  // console.log("aquiiii", vehicles[0]);
  const bikes = useMemo(() => vehicles.filter((v) => v.type === "Bike"), [vehicles]);
  const walkings = useMemo(() => vehicles.filter((v) => v.type === "Walking"), [vehicles]);
  const regularVehicles = useMemo(() => vehicles.filter((v) => v.type !== "Bike" && v.type !== "Walking"), [vehicles]);


  const getVehicleImage = (vehicle) => {
    switch (vehicle.type) {
      case "Bike":
        return "../../../resources/iconBicicle.png";
      case "Walking":
        return "../../../resources/iconWalking.png";
      default:
        return "../../../resources/iconVehicle.png";
    }
  };

  //provisional, currarme un modal con formulario sweetalert2
  const handleAddClick = async () => {
    let res;
    const { value: name } = await Swal.fire({
      title: "Vehicle name",
      input: "text",
      inputPlaceholder: "Enter vehicle name",
      showCancelButton: true,
      background: "#CCD5B9",
      color: "#585233",
      customClass: {
        confirmButton: "my-confirm-btn",
        cancelButton: "my-cancel-btn",
        input: "my-input"
      },


      inputValidator: (value) => {
        if (!value) return "You need to write something!";
        if (!isValidVehicleName(value)) return "Invalid name format, cannot contain special characters or letter 'ñ'.";
        return null;
      }
    });

    if (!name) return;

    const { value: type } = await Swal.fire({
      title: "Vehicle type",
      inputOptions: {
        bike: "Bike",
        walking: "Walking",
        fuelCar: "Fuel Car",
        electricCar: "Electric Car",
      },
      html: `
    <select id="vehicleType" class="my-select">
      <option value="" disabled selected>Select vehicle type</option>
      <option value="bike">Bike</option>
      <option value="walking">Walking</option>
      <option value="fuelCar">Fuel Car</option>
      <option value="electricCar">Electric Car</option>
    </select>
  `,
      background: "#CCD5B9",
      color: "#585233",
      customClass: {
        confirmButton: "my-confirm-btn",
        cancelButton: "my-cancel-btn"
      },

      inputPlaceholder: "Select vehicle type",
      showCancelButton: true,
      focusConfirm: false,// para que no haga focus en el botón y deje seleccionar
      preConfirm: () => {
        res = Swal.getPopup().querySelector('#vehicleType');
        return res.value;
      },
      inputValidator: (value) => !value && "You must select a type"
    });

    //console.log(type);
    if (!type) return;

    let fuelType;
    let consumption;

    if (type === "fuelCar") {
      const { value: fuel } = await Swal.fire({
        title: "Fuel Type",
        inputOptions: {
          gasoline: "Gasoline",
          diesel: "Diesel",
        },
        background: "#CCD5B9",
        color: "#585233",
        customClass: {
          confirmButton: "my-confirm-btn",
          cancelButton: "my-cancel-btn"
        },
        html: `
      <select id="fuelType" class="my-select">
        <option value="" disabled selected>Select fuel type</option>
        <option value="gasoline">Gasoline</option>
        <option value="diesel">Diesel</option>
      </select>
    `,
        background: "#CCD5B9",
        color: "#585233",
        focusConfirm: false,// para que no haga focus en el botón y deje seleccionar
        preConfirm: () => {
          res = Swal.getPopup().querySelector('#fuelType');
          return res.value;
        },
        showCancelButton: true,
        inputValidator: (value) => !value && "Select a fuel type",
      });

      if (!fuel) return;
      fuelType = fuel;

      const { value: cons } = await Swal.fire({
        title: "Consumption (L/100km)",
        input: "number",
        inputPlaceholder: "Enter consumption",
        inputAttributes: { min: "0", step: "0.1" },
        background: "#CCD5B9",
        color: "#585233",
        customClass: {
          confirmButton: "my-confirm-btn",
          cancelButton: "my-cancel-btn",
          input: "my-input"
        },

        showCancelButton: true,
        inputValidator: (value) =>
          !value || parseFloat(value) <= 0
            ? "Consumption must be greater than 0"
            : null,
      });

      if (!cons) return;
      consumption = parseFloat(cons);
    }
    else if (type === 'electricCar') {
      fuelType = "electric";
      const { value: cons } = await Swal.fire({
        title: "Consumption (kWh/100km)",
        input: "number",
        inputPlaceholder: "Enter consumption",
        inputAttributes: { min: "0", step: "0.1" },
        showCancelButton: true,
        background: "#CCD5B9",
        color: "#585233",
        customClass: {
          confirmButton: "my-confirm-btn",
          cancelButton: "my-cancel-btn",
          input: "my-input"
        },

        inputValidator: (value) =>
          !value || parseFloat(value) <= 0
            ? "Consumption must be greater than 0"
            : null,
      });
      if (!cons) return;
      consumption = parseFloat(cons);
    }
    else if (type === 'walking' || type === 'bike') {
      fuelType = null;
      const { value: cons } = await Swal.fire({
        title: "Consumption (Kcal/min)",
        input: "number",
        inputPlaceholder: "Enter consumption",
        inputAttributes: { min: "0", step: "0.1" },
        showCancelButton: true,
        background: "#CCD5B9",
        color: "#585233",
        customClass: {
          confirmButton: "my-confirm-btn",
          cancelButton: "my-cancel-btn",
          input: "my-input"
        },

        inputValidator: (value) =>
          !value || parseFloat(value) <= 0
            ? "Consumption must be greater than 0"
            : null,
      });
      if (!cons) return;
      consumption = parseFloat(cons);
    }
    // llamar al viewmodel
    await addVehicle(type, name, fuelType, consumption);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${id}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      background: "#E0E6D5",
      color: "#585233",
      customClass: {
        confirmButton: "my-confirm-btn",
        cancelButton: "my-cancel-btn"
      }
    });

    // solo si confirma borramos
    if (result.isConfirmed) {
      await deleteVehicle(id);

      // mensaje de OK
      await Swal.fire({
        title: "Deleted!",
        text: `"${id}" has been removed successfully.`,
        icon: "success",
        background: "#E0E6D5",
        color: "#585233",
        customClass: {
          confirmButton: "my-confirm-btn",
        }
      });
    }
  };

  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);


  const renderList = (list) => {
    if (loading) return <li className="item-card item-card--empty">Loading...</li>;
    if (!list.length) return <li className="item-card item-card--empty">No items found</li>;

    //  console.log("Rendering list:", list[0].constructor.name);


    return list.map((v) => (
      <li key={v.id} className="item-card">
        <div className="item-card__icon" aria-hidden>
          <img src={getVehicleImage(v)}
            className="item-icon" alt="bici" />

        </div>

        <div className="item-card__content">
          <div className="item-card__title">{v.name}</div>
          <div className="item-card__meta">

            {v.fuelType ? `  ${capitalize(v.fuelType)} •` : ""}

            {v.consumption?.amount?.amount
              ? `  ${v.consumption.amount.amount} ${v.consumption.amount.unit}`
              : ""}
          </div>
        </div>

        <EditDeleteActions
          id={v.name}
          editTarget={"/edit-vehicle"}
          onDelete={handleDelete}
        />
      </li>
    ));
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">My Mobility Methods</h1>

        <button
          className="btn btn-primary btn-add"
          onClick={handleAddClick}
          disabled={loading}
        >
          <svg className="add-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d={PLUS_ICON_PATH} />
          </svg>
          Add Vehicle
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <section className="list-section">
        <h2 className="section-title">Bikes</h2>
        <ul className="item-list">{renderList(bikes)}</ul>
      </section>

      <section className="list-section">
        <h2 className="section-title">Walking</h2>
        <ul className="item-list">{renderList(walkings)}</ul>
      </section>

      <section className="list-section">
        <h2 className="section-title">Vehicles</h2>
        <ul className="item-list">{renderList(regularVehicles)}</ul>
      </section>
    </div>
  );
}
