import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const RefundPolicy = () => {
  return (
    <div className="bg-background pt-24 md:pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-primary">Cancellation & Refund Policy</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated on {new Date('2025-08-04T11:45:05').toLocaleDateString()}
          </p>
        </motion.div>

        <Card>
          <CardContent className="p-8 space-y-6 text-muted-foreground">
            <p className="font-semibold text-foreground">
              TOFFEETEENS LLP believes in helping its customers as far as possible, and has therefore a liberal cancellation policy.
            </p>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Cancellations</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Cancellations will be considered only if the request is made immediately after placing the order.</li>
                <li>A cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping.</li>
                <li>TOFFEETEENS LLP does not accept cancellation requests for perishable items.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Refunds and Replacements</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>In case of receipt of damaged or defective items please report the same to our Customer Service team within 2 Days of receipt.</li>
                <li>If you feel that the product received is not as shown on the site, you must bring it to the notice of our customer service within 2 Days of receiving the product.</li>
                <li>In case of any Refunds approved by TOFFEETEENS LLP, it will take 9-15 Days for the refund to be processed.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RefundPolicy;