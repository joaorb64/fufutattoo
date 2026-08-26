import { useEffect, useState } from "react";

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateSplashCards = (flashItems) => {
  const quantity = 3;
  const selected = [...flashItems]
    .sort(() => 0.5 - Math.random())
    .slice(0, quantity);

  return selected.map((item, idx) => ({
    id: `${item.id}-${Date.now()}-${idx}`,
    src: item.thumbnail,
    initialRotate: 10,
    finalRotate: -50 + idx * 20,
    delay: 0.15 + idx * 0.12,
  }));
};

export default function FlashSplash() {
  const [cards, setCards] = useState([]);
  const [splashCards, setSplashCards] = useState([]);
  const [revealId, setRevealId] = useState(0);

  useEffect(() => {
    fetch("/flashes.json")
      .then((res) => res.json())
      .then((data) => {
        const list = Object.entries(data)
          .map(([id, flash]) => ({
            id,
            name: flash.name?.en || flash.name?.pt || "Untitled",
            thumbnail:
              flash.images?.[0]?.thumbnail ||
              flash.images?.[0]?.watermarked ||
              flash.images?.[0]?.original,
          }))
          .filter((flash) => flash.thumbnail);
        setCards(list);
      })
      .catch(() => setCards([]));
  }, []);

  useEffect(() => {
    if (!cards.length) return;

    const deal = () => {
      setSplashCards(generateSplashCards(cards));
      setRevealId((prev) => prev + 1);
    };

    deal();
    const timer = setInterval(deal, 5000);

    return () => clearInterval(timer);
  }, [cards]);

  if (!splashCards.length) return null;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 w-70 h-65 overflow-visible">
      {splashCards.map((card, idx) => (
        <div
          key={`${card.id}-${revealId}`}
          className="absolute origin-bottom-right bg-white shadow-[0_15px_38px_rgba(0,0,0,0.3)] border border-zinc-200"
          style={{
            width: "200px",
            height: "300px",
            bottom: 0,
            right: `${100 - idx * 80}px`,
            transform: `translateX(120%) rotate(${card.initialRotate}deg)`,
            animation: `polaroidDeal 1s ease-out ${card.delay}s forwards`,
            zIndex: 100 + idx,
            "--card-initial-rotate": `${card.initialRotate}deg`,
            "--card-final-rotate": `${card.finalRotate}deg`,
          }}
        >
          <div
            className="w-full h-full bg-white border border-zinc-100 shadow-inner"
            style={{ padding: "10px" }}
          >
            <div
              className="w-full h-full bg-white rounded-sm overflow-hidden"
              style={{ padding: "4px" }}
            >
              <img
                src={card.src}
                alt="flash card"
                className="w-full h-full object-cover"
                style={{ borderRadius: "2px" }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
