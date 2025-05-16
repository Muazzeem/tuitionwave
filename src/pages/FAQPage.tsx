
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQPage: React.FC = () => {
  const faqs = [
    {
      question: "How do I find a tutor on Tuitionwave?",
      answer: "You can find a tutor by navigating to the 'Find Tutors' page, where you can filter tutors based on subject, location, rating, and other criteria. Once you find a suitable tutor, you can view their profile and send them a tuition request."
    },
    {
      question: "How does payment work on Tuitionwave?",
      answer: "Tuitionwave acts as a platform connecting tutors and students. Payment terms are agreed upon between the tutor and student/guardian directly after a contract is established. We recommend discussing payment methods and schedules when finalizing your tutoring arrangement."
    },
    {
      question: "Can I become a tutor on Tuitionwave?",
      answer: "Yes! If you're interested in becoming a tutor, you can register as a teacher on our platform. You'll need to complete your profile, including your educational background, subjects you can teach, and preferred teaching locations. Once verified, you can start receiving tuition requests."
    },
    {
      question: "What happens after I send a tuition request?",
      answer: "After sending a request, the tutor will review your requirements. If they're interested, they'll accept your request, and you'll both receive a notification. You can then discuss the specifics and arrange your first session."
    },
    {
      question: "How are tutors verified on the platform?",
      answer: "All tutors undergo a verification process that includes document verification (such as academic credentials and ID), background checks, and a review of their teaching experience. This helps ensure that only qualified tutors are available on our platform."
    },
    {
      question: "Can I request a trial session before committing?",
      answer: "Yes, many tutors offer trial sessions. You can request this when sending your tuition request or discuss it directly with the tutor after they accept your request."
    },
    {
      question: "What if I'm not satisfied with my tutor?",
      answer: "If you're not satisfied with your tutor, you can end the contract and look for another tutor on our platform. We encourage providing feedback to help improve the experience for all users."
    },
    {
      question: "How can I contact Tuitionwave support?",
      answer: "You can contact our support team through the 'Contact' page or by sending an email to support@tuitionwave.com. We're here to help with any questions or issues you might have."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">Frequently Asked Questions</h1>
          
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 dark:border-gray-700 rounded-lg px-4">
                  <AccordionTrigger className="text-left font-medium text-gray-800 dark:text-white py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Still have questions? <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact our support team</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
