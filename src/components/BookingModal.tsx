import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import toast from 'react-hot-toast';

interface Consultant {
  id: string;
  user_id: string; // Important for correct booking
  full_name: string;
  text_rate: number;
  voice_rate: number;
  video_rate: number;
}

interface BookingModalProps {
  isOpen: boolean; // Add this prop to control visibility
  consultant: Consultant;
  userId: string;
  onClose: () => void;
}

const consultationTypes = ["Text", "Voice", "Video"];

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen, // Use this prop
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
      case "Voice": baseRate = consultant.voice_rate; break;
      case "Video": baseRate = consultant.video_rate; break;
      default: baseRate = consultant.text_rate; break;
    }
    return baseRate * 1.20;
  };

  const ratePerMinute = getRatePerMinute();
  const totalAmount = ratePerMinute * durationMinutes;

  const handleSubmit = async () => {
    if (!dateTime) {
      toast.error("Please select a date and time.");
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.from("bookings").insert([
      {
        user_id: userId,
        consultant_id: consultant.user_id,
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
      toast.error("Failed to book. Please try again.");
    } else {
      setConfirmationMessage("✅ Booking successful!");
      setTimeout(() => {
        setConfirmationMessage("");
        onClose();
      }, 2500);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
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
              <Dialog.Panel className="w-full max-w-md rounded-lg bg-card p-6 shadow-xl">
                <Dialog.Title className="text-xl font-bold text-center text-foreground mb-4">
                  Book with {consultant.full_name}
                </Dialog.Title>
                {confirmationMessage ? (
                  <p className="text-green-600 font-medium text-center py-8">{confirmationMessage}</p>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Consultation Type</label>
                      <select value={consultationType} onChange={(e) => setConsultationType(e.target.value)} className="input w-full">
                        {consultationTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Schedule Date & Time</label>
                      <Input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Duration (Minutes)</label>
                      <Input type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))} min={1}/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Additional Notes</label>
                      <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="e.g., Specific topics to discuss" />
                    </div>
                    <div className="text-sm text-foreground bg-secondary/30 p-3 rounded-md text-center">
                      Rate: <span className="font-semibold">₹{ratePerMinute.toFixed(2)}/min</span> × {durationMinutes} min ={" "}
                      <strong className="text-lg">Total: ₹{totalAmount.toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? "Booking..." : "Book Now"}</Button>
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