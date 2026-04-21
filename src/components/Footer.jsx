const Footer = () => {
  return (
    <footer id="contact" className="border-t border-white/10 bg-obsidian">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <h4 className="mb-4 text-xl font-semibold text-brushedGold">Sijo Plastics Pvt. Ltd.</h4>
          <p className="text-base text-textSoft">Premium Bath & Kitchen Hardware</p>
          <p className="text-base text-textSoft">India</p>
        </div>
        <div>
          <h4 className="mb-4 text-xl font-semibold text-brushedGold">Contact</h4>
          <p className="text-base text-textSoft">+91 88798 48479</p>
          <p className="text-base text-textSoft">WhatsApp: +91 88798 48479</p>
        </div>
        <div>
          <h4 className="mb-4 text-xl font-semibold text-brushedGold">Hours</h4>
          <p className="text-base text-textSoft">Mon - Sat: 10:00 AM - 8:00 PM</p>
          <p className="text-base text-textSoft">Sunday: By Appointment</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-white/50">
        © 2026 Sijo Plastics Pvt. Ltd. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
