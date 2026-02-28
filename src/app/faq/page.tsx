"use client";

import FAQItem from "@/components/FAQ/FAQItem";
import { FAQ_DATA } from "@/constants";
import { useEffect, useState } from "react";

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("General");

  const scrollToCategory = (category: string) => {
    const element = document.getElementById(
      `category-${category.toLowerCase().replace(/\s+/g, "-")}`
    );
    if (element) {
      const offset = 100; // Offset for header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveCategory(category);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const categories = FAQ_DATA.map((cat) => ({
        id: `category-${cat.category.toLowerCase().replace(/\s+/g, "-")}`,
        category: cat.category,
      }));

      for (let i = categories.length - 1; i >= 0; i--) {
        const element = document.getElementById(categories[i].id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveCategory(categories[i].category);
            break;
          }
        }
      }
    };

    // Set initial active category
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="mt-20">
      <div className="flex max-md:flex-col md:items-center justify-between p-8">
        <h1 className="text-4xl font-bold">FAQ</h1>
        <p className="text-sm opacity-60 md:text-right max-md:mt-2">
          Frequently asked questions about CheckDot Lending.
        </p>
      </div>
      <div className="flex gap-6 my-4 relative">
        <div className="flex-1 flex flex-col gap-8">
          {FAQ_DATA.map((category) => (
            <div
              key={category.category}
              id={`category-${category.category.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex flex-col gap-2 scroll-mt-24 px-4"
            >
              <h2 className="text-2xl font-semibold mb-2 px-4">
                {category.category}
              </h2>
              {category.items.map((item, itemIndex) => (
                <FAQItem
                  key={`${category.category}-${item.q}-${itemIndex}`}
                  q={item.q}
                  a={item.a}
                />
              ))}
            </div>
          ))}
        </div>
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <div className="bg-white dark:bg-[#080811] rounded-xl p-4 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <nav className="flex flex-col gap-2">
                {FAQ_DATA.map((category) => (
                  <button
                    key={category.category}
                    onClick={() => scrollToCategory(category.category)}
                    className={`text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                      activeCategory === category.category
                        ? "bg-[#33f693] text-black font-semibold"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {category.category}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FAQPage;
