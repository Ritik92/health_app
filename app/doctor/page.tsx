"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useSession } from "next-auth/react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DoctorList = () => {
  const { data: session, status } = useSession();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [appointmentType, setAppointmentType] = useState("Video Call");

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("/api/doctor");
        setDoctors(response.data);
      } catch (error) {
        setError("Failed to fetch doctors. Please try again later.");
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowCalendar(true);
  };

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setBookingLoading(true);

    try {
      await axios.post("/api/book-appointment", {
        doctorId: selectedDoctor.id,
        date,// @ts-ignore
        userId: session?.user?.id,
        type: appointmentType
      });
      
      // Reset states
      setShowCalendar(false);
      setSelectedDoctor(null);
      setSelectedDate(null);
      
      // Show success message
      alert("Appointment booked successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to book the appointment.";
      setError(errorMessage);
    } finally {
      setBookingLoading(false);
    }
  };

  if (status === "unauthenticated") {
    return (
      <Alert variant="destructive" className="max-w-lg mx-auto mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please sign in to book appointments.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="doctor-list p-4">
      <h1 className="text-2xl font-bold mb-4">Available Doctors</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="p-6 border rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold">{doctor.name}</h3>
            <p className="text-gray-600 mb-2">{doctor.specialty}</p>
            <p className="text-sm text-gray-500 mb-4">
              Contact: {doctor.email}
              {doctor.phone && ` | ${doctor.phone}`}
            </p>
            <button
              onClick={() => handleBookAppointment(doctor)}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              disabled={bookingLoading}
            >
              {bookingLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                "Book Appointment"
              )}
            </button>
          </div>
        ))}
      </div>

      {showCalendar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Schedule Appointment</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Type
              </label>
              <select
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="Video Call">Video Call</option>
                <option value="Chat">Chat</option>
                <option value="In-Person">In-Person</option>
              </select>
            </div>

            <Calendar
              date={new Date()}
              onChange={handleDateSelect}
              minDate={new Date()}
              className="mb-4"
            />
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCalendar(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={bookingLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDateSelect(selectedDate)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={!selectedDate || bookingLoading}
              >
                {bookingLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;