import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function MyCarsTab() {
  const [cars, setCars] = useState([]);
  const [speedWarnings, setSpeedWarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCars = async () => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      console.log("Decoded token:", decodedToken);
      const userCompany = decodedToken.company;
      const carId = decodedToken.carId || null;
      console.log("Car ID from token:", carId);
      console.log("User company from token:", userCompany);
      const response = await axios.get(
        "https://firestore-service-dot-cloud-app-455515.lm.r.appspot.com/api/cars",
      );
      console.log("Fetched cars:", response.data);
      if (Array.isArray(response.data)) {
        if (userCompany != null) {
          const filteredCars = response.data.filter(car => car.company_id === userCompany);
          console.log("Filtered cars for company", userCompany, ":", filteredCars);
          setCars(filteredCars);
        } else {
          const filteredCars = response.data.filter(car => car.license_plate === carId);
          console.log("Filtered cars for car ID", carId, ":", filteredCars);
          setCars(filteredCars);
        }
      } else {
        console.error("Fetched data is not an array:", response.data);
        setCars([]);
      }
    } catch (error) {
      console.error("Failed to fetch cars", error);
      setCars([]);
    }
  };

  // const fetchSpeedWarnings = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.get(
  //       "https://cars-dot-cloud-app-455515.lm.r.appspot.com/api/speed-warnings",
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     setSpeedWarnings(response.data.speedWarnings);
  //   } catch (error) {
  //     console.error("Failed to fetch speed warnings", error);
  //   }
  // };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchCars()]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          My Cars
        </h3>
        {cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cars.map((car) => (
              <div key={car.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-lg">
                  {car.make} {car.model}
                </h4>
                <p className="text-gray-600">Year: {car.year}</p>
                <p className="text-gray-600">License: {car.license_plate}</p>
                <p className="text-gray-600">Status: {car.status && car.status.trim() ? car.status : 'N/A'}</p>
                <p className="text-gray-600">Mileage: {car.total_mileage} miles</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No cars assigned to you.</p>
        )}

        {/* Speed Warnings Section */}
        <div className="mt-8">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Recent Speed Warnings
          </h4>
          {speedWarnings.length > 0 ? (
            <div className="space-y-3">
              {speedWarnings.map((warning) => (
                <div
                  key={warning._id}
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                >
                  <p className="text-sm">
                    <span className="font-medium">Speed:</span> {warning.speed} mph
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Location:</span> {warning.location}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(warning.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No speed warnings.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyCarsTab;
