import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiHelpCircle } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import toast from 'react-hot-toast';

const faqs = [
  {
    question: 'How do I become a consultant on Blawise?',
    answer: "Click 'Become a Consultant' in the header, fill out your profile with your expertise, set your rates, and upload verification documents. We'll review and approve within 48 hours.",
  },
  {
    question: 'How does the payment system work?',
    answer: "Add money to your Blawise wallet. Your balance auto-deducts per minute during sessions. Secure encrypted payments.",
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer: "Yes! If you're unhappy within the first 5 minutes of a session, contact support for a full refund.",
  },
  {
    question: 'What types of consultations are available?',
    answer: "We offer text, voice, and video calls. You can connect instantly or schedule ahead.",
  },
];

export default function Contact() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle form submission here (e.g., send an email).
    toast.success("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div className="bg-background pt-24 md:pt-32 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-primary">Get in Touch</h1>
          <p className="mt-2 text-muted-foreground">We're here to help. Reach out to our team anytime.</p>
        </motion.div>

        {/* Form + Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <Card className="p-8">
            <h3 className="text-xl font-semibold mb-4">Send us a Message</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="flex gap-4">
                <Input type="text" placeholder="First Name" className="w-1/2" />
                <Input type="text" placeholder="Last Name" className="w-1/2" />
              </div>
              <Input type="email" placeholder="Email Address" />
              <Input type="text" placeholder="Subject" />
              <Textarea rows={4} placeholder="Your Message" />
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </Card>

          {/* Info from PDF */}
          <div className="space-y-6 pt-2">
            <div className="flex items-start gap-4">
              <FiMapPin className="text-xl mt-1 text-primary flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Our Address</h4>
                <p className="text-sm text-muted-foreground">
                  Operational Address: house no. 850, sector 7, gurgaon h.o, gurgaon, haryana, india, 122001, Gurgaon, HARYANA, PIN: 122001
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FiPhone className="text-xl mt-1 text-primary flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Telephone</h4>
                <p className="text-sm text-muted-foreground">9999879707</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FiMail className="text-xl mt-1 text-primary flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Email Support</h4>
                <p className="text-sm text-muted-foreground">info@toffeeteens.com</p>
              </div>
            </div>
             <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  <strong>Merchant Legal Entity Name:</strong> TOFFEETEENS LLP
                </p>
             </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold">Frequently Asked Questions</h3>
          <p className="text-muted-foreground mt-2 mb-8">Find quick answers to common questions</p>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-card rounded-lg shadow-sm mb-4 text-left cursor-pointer border"
                onClick={() => setActiveIndex(index === activeIndex ? null : index)}
              >
                <div className="flex items-center gap-3 p-4">
                  <FiHelpCircle className="text-primary" />
                  <p className="font-medium flex-1">{faq.question}</p>
                  <span className="text-lg font-semibold">{activeIndex === index ? '−' : '+'}</span>
                </div>
                {activeIndex === index && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-4 pb-4 border-t pt-4 text-muted-foreground"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}