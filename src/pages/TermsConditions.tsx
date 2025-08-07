import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const TermsConditions = () => {
  return (
    <div className="bg-background pt-24 md:pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-primary">Terms & Conditions</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated on {new Date('2025-08-04T11:43:55').toLocaleDateString()}
          </p>
        </motion.div>

        <Card>
          <CardContent className="p-8 space-y-6 text-muted-foreground">
            <p className="font-semibold text-foreground">
              These Terms and Conditions constitute a binding agreement by and between TOFFEETEENS LLP ("Website Owner" or "we") and you ("you" or "your") and relate to your use of our website and services. By using our website, you agree that you have read and accepted these Terms.
            </p>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">1. Use of Services</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>To access and use the Services, you agree to provide true, accurate and complete information to us during and after registration.</li>
                <li>Your use of our Services and the website is solely at your own risk and discretion.</li>
                <li>The contents of the Website and the Services are proprietary to Us and you will not have any authority to claim any intellectual property rights.</li>
                <li>You agree not to use the website for any purpose that is unlawful, illegal or forbidden by these Terms.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">2. Payments and Refunds</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>You agree to pay us the charges associated with availing the Services.</li>
                <li>You shall be entitled to claim a refund of the payment made by you in case we are not able to provide the Service, within the time period provided in our policies.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">3. Governing Law</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>These Terms and any dispute or claim relating to it shall be governed by and construed in accordance with the laws of India.</li>
                <li>All disputes shall be subject to the exclusive jurisdiction of the courts in Gurgaon, HARYANA.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">4. Communication</h3>
              <p className="text-sm">
                All concerns or communications relating to these Terms must be communicated to us using the contact information provided on this website.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsConditions;