import { MessageCircleMore } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/918879848479"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition hover:scale-105 hover:brightness-110"
    >
      <MessageCircleMore size={26} />
    </a>
  );
};

export default WhatsAppButton;
