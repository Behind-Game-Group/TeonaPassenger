import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Comment Teona Passenger trouve-t-il des prix de vols aussi bas ?",
    answer:
      "Teona Passenger parcourt des centaines de sites de voyage et de compagnies aériennes, qu'il s'agisse de grands sites de réservation ou de petites agences, pour que vous puissiez facilement comparer les options de vols et trouver un billet d'avion pas cher.",
  },
  {
    question: "Comment trouver un billet d'avion au meilleur prix ?",
    answer:
      "Pour trouver un billet au meilleur prix, nous vous recommandons d'utiliser des filtres adaptés à vos besoins et de réserver à l'avance.",
  },
  {
    question: "Comment puis-je économiser grâce à Mix & Match ?",
    answer:
      "Grâce à Mix & Match, Teona Passenger vous aide à combiner des billets d’avion de compagnies différentes pour trouver la meilleure offre.",
  },
  {
    question: "Comment m'assurer de ne pas manquer une bonne affaire de vol ?",
    answer:
      "Activez les alertes de prix pour ne jamais manquer une bonne affaire de vol.",
  },
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index); // Ouvre/ferme la section
  };

  return (
    <section className="py-10 text-white">
      <h2 className="text-3xl font-bold text-center mb-6">
        Comment trouver des vols pas chers sur notre site ?
      </h2>
      <div className="max-w-5xl mx-auto  transition-all">
        {faqData.map((item, index) => (
          <div key={index} className="border-b border-gray-300 py-4">
            <button
              className="accordion w-full text-left font-bold text-lg flex justify-between"
              onClick={() => toggleAccordion(index)}
            >
              <span>{item.question}</span>
              <span className="arrow">
                {openIndex === index ? "▲" : "▼"}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-gray-700 mt-2">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
