import React from "react";

const cuisines = [
    {
        name: "Chinese 🇹🇼",
        link: "https://www.google.com/maps/search/Restaurants/@49.2238987,-122.9878782,14z/data=!3m1!4b1!4m4!2m3!5m1!6sgcid:chinese_restaurant!6e5?entry=ttu&g_ep=EgoyMDI1MDMyNC4wIKXMDSoASAFQAw%3D%3D",
    },
    {
        name: "Indian 🇮🇳",
        link: "https://www.google.com/maps/search/Restaurants/@49.2240559,-122.9881357,14z/data=!3m1!4b1!4m4!2m3!5m1!6sgcid:indian_restaurant!6e5?entry=ttu&g_ep=EgoyMDI1MDMyNC4wIKXMDSoASAFQAw%3D%3D",
    },
    {
        name: "Japanese 🇯🇵",
        link: "https://www.google.com/maps/search/Restaurants/@49.2241083,-122.9882215,14z/data=!3m1!4b1!4m4!2m3!5m1!6sgcid:japanese_restaurant!6e5?entry=ttu&g_ep=EgoyMDI1MDMyNC4wIKXMDSoASAFQAw%3D%3D",
    },
    {
        name: "Korean 🇰🇷",
        link: "https://www.google.com/maps/search/Restaurants/@49.2241607,-122.9883074,14z/data=!3m1!4b1!4m4!2m3!5m1!6sgcid:korean_restaurant!6e5?entry=ttu&g_ep=EgoyMDI1MDMyNC4wIKXMDSoASAFQAw%3D%3D",
    },
    {
        name: "Viet 🇻🇳",
        link: "https://www.google.com/maps/search/Restaurants/@49.2241607,-122.9883074,14z/data=!3m1!4b1!4m4!2m3!5m1!6sgcid:vietnamese_restaurant!6e5?entry=ttu&g_ep=EgoyMDI1MDMyNC4wIKXMDSoASAFQAw%3D%3D",
    },
    {
        name: "Thai 🇹🇭",
        link: "https://www.google.com/maps/search/Restaurants/@49.2241607,-122.9883074,14z/data=!3m1!4b1!4m4!2m3!5m1!6sgcid:thai_restaurant!6e5?entry=ttu&g_ep=EgoyMDI1MDMyNC4wIKXMDSoASAFQAw%3D%3D",
    },
    {
        name: "American 🇺🇸",
        link: "https://www.google.com/maps/search/Restaurants/@49.2241607,-122.9883074,14z/data=!3m1!4b1!4m4!2m3!5m1!6sgcid:american_restaurant!6e5?entry=ttu&g_ep=EgoyMDI1MDMyNC4wIKXMDSoASAFQAw%3D%3D",
    },
    {
        name: "Mexican 🇲🇽",
        link: "https://www.google.com/maps/search/Restaurants/@49.2242131,-122.9883932,14z/data=!4m4!2m3!5m1!6sgcid:mexican_restaurant!6e5?entry=ttu&g_ep=EgoyMDI1MDMyNC4wIKXMDSoASAFQAw%3D%3D",
    },
    {
        name: "Middle Eastern ﷼",
        link: "https://www.google.com/maps/search/Restaurants/@49.2241607,-122.9883074,14z/data=!3m1!4b1!4m4!2m3!5m1!6sgcid:middle_eastern_restaurant!6e5?entry=ttu&g_ep=EgoyMDI1MDMyNC4wIKXMDSoASAFQAw%3D%3D",
    },
    {
        name: "French 🇫🇷",
        link: "https://www.google.com/maps/search/Restaurants/@49.2241607,-122.9883074,14z/data=!3m1!4b1!4m4!2m3!5m1!6sgcid:french_restaurant!6e5?entry=ttu&g_ep=EgoyMDI1MDMyNC4wIKXMDSoASAFQAw%3D%3D",
    },
    {
        name: "Greek 🇬🇷",
        link: "https://www.google.com/maps/search/Restaurants/@49.2241607,-122.9883074,14z/data=!3m1!4b1!4m4!2m3!5m1!6sgcid:greek_restaurant!6e5?entry=ttu&g_ep=EgoyMDI1MDMyNC4wIKXMDSoASAFQAw%3D%3D",
    },
    {
        name: "Italian 🇮🇹",
        link: "https://www.google.com/maps/search/Restaurants/@49.2240035,-122.9880499,14z/data=!3m1!4b1!4m4!2m3!5m1!6sgcid:italian_restaurant!6e5?entry=ttu&g_ep=EgoyMDI1MDMyNC4wIKXMDSoASAFQAw%3D%3D",
    },
    {
        name: "Spanish 🇪🇸",
        link: "https://www.google.com/maps/search/Restaurants/@49.2240035,-122.9880499,14z/data=!3m1!4b1!4m4!2m3!5m1!6sgcid:spanish_restaurant!6e5?entry=ttu",
    },
    {
        name: "Singaporean 🇸🇬",
        link: "https://www.google.com/maps/search/Restaurants/@49.2240035,-122.9880499,14z/data=!3m1!4b1!4m4!2m3!5m1!6sgcid:singaporean_restaurant!6e5?entry=ttu",
    },
    {
        name: "Brazilian 🇧🇷",
        link: "https://www.google.com/maps/search/Restaurants/@49.2240035,-122.9880499,14z/data=!3m1!4b1!4m4!2m3!5m1!6sgcid:brazilian_restaurant!6e5?entry=ttu",
    },
    {
        name: "Caribbean 🇨🇺",
        link: "https://www.google.com/maps/search/Restaurants/@49.2240035,-122.9880499,14z/data=!3m1!4b1!4m4!2m3!5m1!6sgcid:caribbean_restaurant!6e5?entry=ttu",
    },
    {
        name: "German 🇩🇪",
        link: "https://www.google.com/maps/search/Restaurants/@49.2240035,-122.9880499,14z/data=!3m1!4b1!4m4!2m3!5m1!6sgcid:german_restaurant!6e5?entry=ttu",
    },
    {
        name: "British 🇬🇧",
        link: "https://www.google.com/maps/search/Restaurants/@49.2240035,-122.9880499,14z/data=!3m1!4b1!4m4!2m3!5m1!6sgcid:british_restaurant!6e5?entry=ttu",
    },
];

export default function CuisineList() {
return (
    <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {cuisines.map((cuisine, index) => (
            <a
                key={index}
                href={cuisine.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-gray-200 border-gray-300 p-4 text-center block transition-transform duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:shadow-2xl rounded-lg text-white border -translate-y-1 shadow-lg"
            >
                <div className="flex flex-col items-center">
                    <span>{cuisine.name}</span>
                </div>
            </a>
        ))}
    </div>
);
}
