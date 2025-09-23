import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import Accordion from '../Common/Accordion';
import TOC from '../Common/TOC';
import FeeCalculator from '../Common/FeeCalculator';
import './TermsAndConditions.css';

const TermsAndConditions = ({ onAccept, accepted, onDecline }) => {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50;
    setScrolledToBottom(isAtBottom);
  };

  return (
    <div className="terms-container">
      <div className="terms-header">
        <h2>Hostel Manager Terms and Conditions</h2>
        <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      {/* TOC using reusable component */}
      <TOC
        title="Contents"
        items={[
          { href: '#service-overview', label: '1. Service Overview' },
          { href: '#service-charges', label: '2. Service Charges' },
          { href: '#payment-terms', label: '3. Payment Terms' },
          { href: '#manager-responsibilities', label: '4. Hostel Manager Responsibilities' },
          { href: '#student-payments', label: '5. Student Payments' },
          { href: '#cancellation', label: '6. Cancellation and Refund Policy' },
          { href: '#privacy', label: '7. Privacy Policy' },
          { href: '#termination', label: '8. Termination of Service' },
          { href: '#law', label: '9. Governing Law' },
        ]}
      />

      <div className="terms-content" onScroll={handleScroll}>
        <Accordion id="service-overview" title="1. Service Overview" defaultOpen>
          <p>
            Welcome to Hostel Manager, a comprehensive platform designed to help you manage your hostel operations efficiently. 
            By using our services, you agree to these terms and conditions. Please read them carefully.
          </p>
        </Accordion>

        <section id="service-charges" className="terms-section important-notice">
          <Accordion id="service-charges-accordion" title="2. Service Charges" defaultOpen>
            <div className="highlight-box">
              <h4>Important Notice Regarding Service Fees</h4>
              <p>
                A service charge of <strong>4%</strong> will be applied to the total room amount for each booking. 
                This fee is <strong>automatically added on top</strong> of the student's payment and is non-negotiable.
                It is <strong>not deducted</strong> from your specified room price; your base price remains intact.
              </p>
              <p>
                Example: For a room priced at GHS 1,000, the service charge will be GHS 40, making the total amount 
                payable by the student GHS 1,040.
              </p>
            </div>
            <FeeCalculator
              feeRate={0.04}
              currencyPrefix="GHS "
              inputPlaceholder="Enter room price (e.g., 1000)"
              onCopy={() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            />
            {copied && <span className="scroll-reminder">Copied!</span>}
          </Accordion>
        </section>

        <Accordion id="payment-terms" title="3. Payment Terms">
          <ul>
            <li>All service charges are non-refundable once a booking is confirmed.</li>
            <li>Payments are processed securely through our payment partners.</li>
            <li>You will receive your payment for room bookings, minus the service charge, according to our payment schedule.</li>
            <li><strong>Annual billing:</strong> Room stays are billed yearly. The annual billing cycle ends on <strong>30 September</strong> each year.</li>
            <li>Your specified room price is the base price. The 4% service fee is added on top for the student and not deducted from your base price.</li>
          </ul>
        </Accordion>

        <Accordion id="manager-responsibilities" title="4. Hostel Manager Responsibilities">
          <p>As a Hostel Manager, you agree to:</p>
          <ul>
            <li>Provide accurate and up-to-date information about your hostel and rooms.</li>
            <li>Maintain the quality of accommodations as described in your listing.</li>
            <li>Respond promptly to booking inquiries and student communications.</li>
            <li>Comply with all local laws and regulations regarding hostel operations.</li>
          </ul>
        </Accordion>

        <Accordion id="student-payments" title="5. Student Payments">
          <ul>
            <li>Students will make payments directly through the Hostel Manager platform.</li>
            <li>The platform will automatically calculate and add the 4% service charge to each transaction.</li>
            <li>Payment confirmation will be sent to both you and the student upon successful transaction.</li>
          </ul>
        </Accordion>

        <Accordion id="cancellation" title="6. Cancellation and Refund Policy">
          <p>For cancellations:</p>
          <ul>
            <li>Cancellations made more than 7 days before check-in: Full refund of room charges (service fee non-refundable).</li>
            <li>Cancellations made within 7 days of check-in: 50% refund of room charges (service fee non-refundable).</li>
            <li>No-shows will be charged the full amount.</li>
          </ul>
        </Accordion>

        <Accordion id="privacy" title="7. Privacy Policy">
          <p>
            We are committed to protecting your privacy. Your personal and financial information will be handled 
            in accordance with our Privacy Policy and applicable data protection laws.
          </p>
        </Accordion>

        <Accordion id="termination" title="8. Termination of Service">
          <p>
            Either party may terminate this agreement with 30 days' written notice. Upon termination, all outstanding 
            payments will be settled according to our payment schedule.
          </p>
        </Accordion>

        <Accordion id="law" title="9. Governing Law">
          <p>
            These terms and conditions shall be governed by and construed in accordance with the laws of [Your Country/State]. 
            Any disputes shall be resolved in the courts of [Your Jurisdiction].
          </p>
        </Accordion>

        <div className="terms-acceptance">
          <div className="form-check">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={accepted}
              onChange={(e) => e.target.checked ? onAccept() : onDecline()}
              disabled={!scrolledToBottom}
            />
            <label htmlFor="acceptTerms">
              I have read, understood, and agree to be bound by these Terms and Conditions.
              {!scrolledToBottom && (
                <span className="scroll-reminder">
                  (Please scroll to the bottom to accept)
                </span>
              )}
            </label>
          </div>
          {accepted && (
            <div className="accepted-message">
              <CheckCircle className="check-icon" />
              <span>Terms and Conditions accepted</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
