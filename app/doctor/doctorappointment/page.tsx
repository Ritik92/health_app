"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

const DoctorAppointments = () => {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.post("/api/doctor", {
          doctorId: 'ff835cae-c50c-4865-8be8-6785de08a1f9' 
        });
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchAppointments();
    }
  }, [session?.user?.id]);

  if (!session) {
    return <div className="p-4">Please sign in to view your appointments.</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Appointments</h1>

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments found.</p>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    Patient: {appointment.user.name}
                  </h3>
                  <p className="text-gray-600">
                    Date: {new Date(appointment.date).toLocaleString()}
                  </p>
                  <p className="text-gray-600">
                    Type: {appointment.type}
                  </p>
                </div>
                {appointment.type === 'Video Call' && (
                  <button
                    onClick={() => window.open('/room/' + appointment.id, '_blank')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Join Call
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;