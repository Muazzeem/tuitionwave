// src/components/BCSJobPreparation.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobPreparationService from "@/services/JobPreparationService";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/types/jobPreparation";
import Header from "./Header";
import TutorSearchResults from "./TutorSearchResults";

const BCSJobPreparation: React.FC = () => {
  const navigate = useNavigate();
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error,
  } = useQuery({
    queryKey: ["categories", 1],
    queryFn: () => JobPreparationService.getCategories(1),
  });

  useEffect(() => {
    if (categoriesData?.results) {
      setFilteredCategories(categoriesData.results);
    }
  }, [categoriesData]);

  return (
    <>
      {/* Page background (no image here) */}
      <div className="relative min-h-screen bg-gradient-to-br from-[#0b1220] via-[#0e1b2c] to-[#0b1220] overflow-hidden">
        <Header />
        <div className="absolute inset-0">
          <img
            src="/lovable-uploads/cover-image.jpg"
            alt="Tutor search background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-[#0b1220]/70" />
        </div>

        <div className="container mx-auto px-4 relative z-10" style={{ marginBottom: "21rem" }}>
          <div className="text-center mb-12 pt-8">
            <h2 className="text-2xl md:text-6xl font-bold text-white mb-4 font-unbounded">
              Exam • Preparation • Succeed
            </h2>
            <p className="text-xl text-gray-200">
              Bangladesh&apos;s hub for learning &amp; earning
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Become a Tutor */}
            <div className="bg-white/10 border border-white/15 backdrop-blur-lg shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.45)] transition rounded-3xl overflow-hidden flex flex-col p-4">
              <div className="pb-2">
                <h2 className="text-2xl font-bold mb-2 text-white font-unbounded">
                  Become a Tutor
                </h2>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 flex-1">
                {/* Left */}
                <div className="flex flex-col lg:w-1/2">
                  <div className="bg-white/10 border border-white/15 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                    <div className="text-2xl font-bold mb-2 text-white">
                      5,000+ Tutors
                    </div>
                    <p className="text-gray-300 text-sm">From Top University</p>
                  </div>

                  <div className="flex gap-3 justify-center">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        >
                          <div className="w-8 h-8 bg-gray-400/60 rounded-lg" />
                        </div>
                      ))}
                  </div>
                </div>

                <div className="lg:w-1/2 flex flex-col justify-between">
                  <div className="space-y-4 text-left">
                    {[
                      "Don't be unemployed - help yourself",
                      "Be proud of your own income without taking money from your parents.",
                      "Girls' safety first: Online Tuition is perfect & time-saving even if you don't go out at night.",
                    ].map((t, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="w-2 h-2 bg-white rounded-full mr-4 mt-2" />
                        <p className="text-gray-300 text-sm leading-relaxed">{t}</p>
                      </div>
                    ))}
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-2xl text-sm mt-8 transition-all duration-300 transform hover:scale-[1.02]">
                    Start Teaching
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/10 border border-white/15 backdrop-blur-lg shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.45)] transition rounded-3xl overflow-hidden flex flex-col p-4">
              <div className="pb-2">
                <h1 className="text-2xl font-bold mb-2 text-white font-unbounded">
                  Job Preparation
                </h1>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 flex-1">
                {/* Left */}
                <div className="flex flex-col lg:w-1/2">
                  <div className="bg-white/10 border border-white/15 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                    <div className="text-2xl font-bold mb-2 text-white">
                      130k+ Questions
                    </div>
                    <p className="text-gray-300 text-sm">From Top University</p>
                  </div>

                  <div className="flex gap-3 justify-center">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                      >
                        <div className="w-8 h-8 bg-gray-400/60 rounded-lg" />
                      </div>
                      ))}
                  </div>
                </div>

                {/* Right */}
                <div className="lg:w-1/2 flex flex-col justify-between">
                  <div className="space-y-4 text-left">
                    {[
                      "Don't be unemployed - help yourself",
                      "Be proud of your own income without taking money from your parents.",
                      "Girls' safety first: Online Tuition is perfect & time-saving even if you don't go out at night.",
                    ].map((t, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="w-2 h-2 bg-white rounded-full mr-4 mt-2" />
                        <p className="text-gray-300 text-sm leading-relaxed">{t}</p>
                      </div>
                      ))}
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-2xl text-sm mt-8 transition-all duration-300 transform hover:scale-[1.02]">
                    Start Preparation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="relative" style={{ marginTop: "-18rem" }}>
        <div className="relative z-10 container mx-auto p-0">
          <TutorSearchResults />
        </div>
      </section>
    </>
  );
};

export default BCSJobPreparation;
