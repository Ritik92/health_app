// app/appointments/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { format } from "date-fns";
import { Loader2, AlertCircle, Clock, Video, MessageSquare, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AppointmentsPage = () => {
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("/api/user/appointments");
        setAppointments(response.data);
      } catch (error) {
        setError(error.response?.data?.error || "Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchAppointments();
    }
  }, [status]);

  const getAppointmentTypeIcon = (type) => {
    switch (type) {
      case "Video Call":
        return <Video className="h-5 w-5 text-blue-500" />;
      case "Chat":
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case "In-Person":
        return <User className="h-5 w-5 text-purple-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  if (status === "unauthenticated") {
    return (
      <Alert variant="destructive" className="max-w-lg mx-auto mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please sign in to view your appointments.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {appointments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">You haven't booked any appointments yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{appointment.doctor.name}</h3>
                <div className="flex items-center gap-2">
                  {getAppointmentTypeIcon(appointment.type)}
                  <span className="text-sm text-gray-600">{appointment.type}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <strong>Specialty:</strong> {appointment.doctor.specialty}
                </p>
                <p className="text-gray-600">
                  <strong>Date:</strong>{" "}
                  {format(new Date(appointment.date), "PPP")}
                </p>
                <p className="text-gray-600">
                  <strong>Time:</strong>{" "}
                  {format(new Date(appointment.date), "p")}
                </p>
                <p className="text-gray-600">
                  <strong>Contact:</strong>{" "}
                  {appointment.doctor.email}
                  {appointment.doctor.phone && ` | ${appointment.doctor.phone}`}
                </p>
              </div>

              {new Date(appointment.date) > new Date() && (
                <div className="mt-4 pt-4 border-t">
                  <button 
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    onClick={() => window.open(`/room/${appointment.id}`, '_blank')}
                  >
                    Join Appointment
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;