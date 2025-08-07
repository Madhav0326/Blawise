import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";

interface Consultant {
  id: string;
  full_name: string;
  text_rate: number;
  voice_rate: number;
  video_rate: number;
}

interface BookingModalProps {
  consultant: Consultant;
  userId: string;
  onClose: () => void;
}

const consultationTypes = ["Text", "Voice", "Video"];

const BookingModal: React.FC<BookingModalProps> = ({
  consultant,
  userId,
  onClose,
}) => {
  const [consultationType, setConsultationType] = useState("Text");
  const [dateTime, setDateTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const getRatePerMinute = () => {
    let baseRate = 0;
    switch (consultationType) {
      case "Voice":
        baseRate = consultant.voice_rate;
        break;
      case "Video":
        baseRate = consultant.video_rate;
        break;
      default:
        baseRate = consultant.text_rate;
        break;
    }
    // Return the rate with 20% commission added
    return baseRate * 1.20;
  };

  const ratePerMinute = getRatePerMinute();
  const totalAmount = ratePerMinute * durationMinutes;

  const handleSubmit = async () => {
    if (!dateTime) {
      alert("Please select a date and time.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("bookings").insert([
      {
        user_id: userId,
        consultant_id: consultant.id,
        consultation_type: consultationType,
        scheduled_at: dateTime,
        rate_per_minute: ratePerMinute,
        total_amount: totalAmount,
        status: "pending",
        duration_minutes: durationMinutes,
        notes,
      },
    ]);

    setIsSubmitting(false);

    if (error) {
      console.error("Booking Error:", error);
      alert("Failed to book. Please try again.");
    } else {
      setConfirmationMessage("✅ Booking successful! We’ll notify you soon.");
      setTimeout(() => {
        setConfirmationMessage("");
        onClose();
      }, 2500);
    }
  };

  return (
    <Transition show={true} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
                <Dialog.Title className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">
                  Book with {consultant.full_name}
                </Dialog.Title>

                {confirmationMessage ? (
                  <p className="text-green-600 font-medium text-center">
                    {confirmationMessage}
                  </p>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    {/* Consultation Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Consultation Type
                      </label>
                      <select
                        value={consultationType}
                        onChange={(e) => setConsultationType(e.target.value)}
                        className="w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      >
                        {consultationTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date & Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Schedule Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        className="w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Duration (Minutes)
                      </label>
                      <input
                        type="number"
                        value={durationMinutes}
                        onChange={(e) =>
                          setDurationMinutes(parseInt(e.target.value, 10))
                        }
                        min={1}
                        className="w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Additional Notes
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                        placeholder="e.g., Specific topics to discuss"
                      />
                    </div>

                    {/* Pricing Summary */}
                    <div className="text-sm text-gray-700 dark:text-gray-400">
                      Rate: ₹{ratePerMinute.toFixed(2)}/min × {durationMinutes} min ={" "}
                      <strong>Total: ₹{totalAmount.toFixed(2)}</strong>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-md transition disabled:opacity-50"
                      >
                        {isSubmitting ? "Booking..." : "Book Now"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BookingModal;