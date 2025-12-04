
import {
    getFirestore,
    doc,
    getDoc,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    collection,
    query,
    where,
    getDocs,
    serverTimestamp,
} from "firebase/firestore";
import { firebaseApp } from "../../core/config/firebaseConfig";
import { type Vehicle } from "../../domain/model/VehicleInterface";
import { VehicleFactory } from "../../domain/model/VehicleFactory";

import type { VehicleRepositoryInterface } from "../../domain/repository/VehicleRepositoryInterface";

const db = getFirestore(firebaseApp);

export class VehicleRepositoryFirebase implements VehicleRepositoryInterface {
    private vehicleCollection = collection(db, "vehicles");

    //LISTAR VEHICULOS POR OWNERID
    async getVehiclesByOwnerId(ownerId: string): Promise<Vehicle[]> {
        const q = query(this.vehicleCollection, where("ownerId", "==", ownerId));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((d) => {
            const data = d.data() as any;
            const type = data.type;
            console.log("Vehicle type from Firestore:", type);
            console.log("Vehicle data from Firestore:", data);

            switch (type.toLowerCase()) {
                case "bike":
                    return VehicleFactory.createVehicle("bike", data.name, undefined, data.consumption);

                case "walking":
                    return VehicleFactory.createVehicle("walking", data.name, undefined, data.consumption);

                case "fuelcar":
                    return VehicleFactory.createVehicle("fuelCar", data.name, data.fuelType, data.consumption);

                case "electriccar":
                    return VehicleFactory.createVehicle("electricCar", data.name, data.fuelType, data.consumption);

                default:
                    console.error("Unknown vehicle type in Firestore:", data);
                    return null;
            }
        }).filter(v => v !== null);
    }




    async deleteVehicle(ownerId: string, vehicleName: string): Promise<void> {
        const q = query(this.vehicleCollection, where("ownerId", "==", ownerId), where("name", "==", vehicleName));
        const snapshot = await getDocs(q);
        if (snapshot.empty) throw new Error("VehicleNotFoundException");

        snapshot.docs.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });
    }

    //guardar un vehiculo 
    async saveVehicle(ownerId: string, vehicle: Vehicle): Promise<void> {
        await addDoc(this.vehicleCollection, {
            ownerId,
            type: vehicle.type,
            name: vehicle.name,
            fuelType: vehicle.fuelType,
            consumption: vehicle.consumption,
            createdAt: serverTimestamp(),
        });
    }
}

