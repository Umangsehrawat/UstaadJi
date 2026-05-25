import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Privacy() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600">Legal</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Privacy Policy</h1>
        <p className="mt-3 text-slate-500 font-semibold">Last updated: May 2026</p>

        <div className="mt-10 space-y-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          {[
            {
              title: "1. Information We Collect",
              body: "When you register on Ustaadji, we collect your full name, phone number, and city. When you post an ad, we collect your listing details including title, description, price, location, and any photos you upload. We do not collect payment information.",
            },
            {
              title: "2. How We Use Your Information",
              body: "Your information is used solely to operate the Ustaadji marketplace — to show your listings to other users, enable messaging between buyers and service providers, and send you relevant notifications about your account.",
            },
            {
              title: "3. Information Sharing",
              body: "We do not sell, trade, or rent your personal information to third parties. Your phone number is only visible to other users when you explicitly add it as a contact on a listing. Your name is shown on your public listings.",
            },
            {
              title: "4. Data Security",
              body: "Your password is stored as a secure hash (bcrypt) and is never readable by anyone, including our team. All data is transmitted over HTTPS. Images are stored securely on Cloudinary.",
            },
            {
              title: "5. Cookies",
              body: "Ustaadji uses browser localStorage to keep you logged in between sessions. We do not use tracking cookies or third-party advertising cookies.",
            },
            {
              title: "6. Your Rights",
              body: "You can delete your ads at any time from your Dashboard. To request deletion of your account and all associated data, contact us at support@ustaadji.in and we will process your request within 7 business days.",
            },
            {
              title: "7. Contact",
              body: "For any privacy-related questions, email us at support@ustaadji.in.",
            },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-black text-slate-900">{section.title}</h2>
              <p className="mt-2 leading-7 font-medium text-slate-600">{section.body}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
