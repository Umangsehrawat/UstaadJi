import { Mail, MessageCircle, ShieldCheck, HelpCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const faqs = [
  {
    q: "How do I post an ad on Ustaadji?",
    a: "Click 'Post Ad' in the top navigation bar. Fill in your service title, category, description, price, and location. You can upload up to 5 photos. Click 'Publish Ad' and your listing will go live immediately.",
  },
  {
    q: "How do I contact a service provider?",
    a: "Open any listing and click 'Message Seller' to start a chat. You can also call them directly if they've added a phone number to the listing.",
  },
  {
    q: "Is Ustaadji free to use?",
    a: "Yes, posting and browsing ads on Ustaadji is completely free for everyone.",
  },
  {
    q: "How do I delete my ad?",
    a: "Go to your Dashboard, find the ad you want to remove, and click the 'Delete Ad' button. The listing will be permanently removed.",
  },
  {
    q: "I found a suspicious or fake listing. What should I do?",
    a: "Open the listing and click 'Report this ad' at the bottom right. Select the reason and submit. Our team reviews all reports and takes action within 24 hours.",
  },
  {
    q: "How do I change my password?",
    a: "Password reset is currently being built. Please contact us at ustaadji.info@gmail.com and we will help you reset your password manually.",
  },
  {
    q: "Can I edit my ad after posting?",
    a: "Yes. Go to your Dashboard, find the ad, and click 'Edit Ad'. You can update the title, description, price, location, and contact details.",
  },
  {
    q: "How do I stay safe when hiring someone?",
    a: "Always verify the professional's credentials before hiring. Never pay the full amount upfront. Stay present during the work. Use digital payments for traceability. Read our full Safety Guidelines on the home page.",
  },
];

export default function Support() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600">Help Centre</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Support</h1>
        <p className="mt-3 font-semibold text-slate-500">
          Find answers to common questions or get in touch with our team.
        </p>

        {/* Contact cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <a
            href="mailto:ustaadji.info@gmail.com"
            className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:border-emerald-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Mail size={22} />
            </div>
            <h3 className="font-black text-slate-900">Email us</h3>
            <p className="text-sm font-semibold text-emerald-600">ustaadji.info@gmail.com</p>
          </a>

          <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <MessageCircle size={22} />
            </div>
            <h3 className="font-black text-slate-900">Response time</h3>
            <p className="text-sm font-semibold text-slate-500">Within 24 hours on business days</p>
          </div>

          <a
            href="/#safety"
            className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:border-emerald-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <ShieldCheck size={22} />
            </div>
            <h3 className="font-black text-slate-900">Safety tips</h3>
            <p className="text-sm font-semibold text-slate-500">View our safety guidelines</p>
          </a>
        </div>

        {/* FAQ */}
        <div className="mt-14">
          <div className="mb-6 flex items-center gap-3">
            <HelpCircle size={22} className="text-emerald-600" />
            <h2 className="text-2xl font-black">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 font-black text-slate-900 marker:hidden list-none">
                  {faq.q}
                  <span className="shrink-0 text-slate-400 transition group-open:rotate-180">▼</span>
                </summary>
                <p className="border-t border-slate-100 px-6 py-4 font-medium leading-7 text-slate-600">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
