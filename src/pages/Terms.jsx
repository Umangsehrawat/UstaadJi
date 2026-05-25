import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Terms() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600">Legal</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Terms of Service</h1>
        <p className="mt-3 text-slate-500 font-semibold">Last updated: May 2026</p>

        <div className="mt-10 space-y-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          {[
            {
              title: "1. Acceptance of Terms",
              body: "By creating an account or using Ustaadji, you agree to these Terms of Service. If you do not agree, please do not use the platform.",
            },
            {
              title: "2. Eligibility",
              body: "You must be at least 18 years old to use Ustaadji. By registering, you confirm that the information you provide is accurate and that you are legally capable of entering into agreements.",
            },
            {
              title: "3. Listing Rules",
              body: "You may only post listings for legal services and products. Prohibited listings include weapons, drugs, counterfeit goods, adult content, and anything illegal under Indian law. Ustaadji reserves the right to remove any listing that violates these rules without prior notice.",
            },
            {
              title: "4. Honest Representation",
              body: "All listings must accurately represent the service or product being offered. Misleading descriptions, fake photos, or inflated prices to deceive users are strictly prohibited and may result in account suspension.",
            },
            {
              title: "5. Transactions",
              body: "Ustaadji is a platform that connects buyers and service providers. We are not a party to any transaction between users. We do not handle payments, set prices, or guarantee the quality of any service. All transactions are at your own risk.",
            },
            {
              title: "6. Limitation of Liability",
              body: "Ustaadji is not liable for any loss, injury, or damage resulting from a transaction made through the platform. We strongly encourage users to follow our Safety Guidelines before hiring any service provider.",
            },
            {
              title: "7. Account Termination",
              body: "We reserve the right to suspend or terminate accounts that violate these terms, post fraudulent listings, or engage in abusive behaviour toward other users.",
            },
            {
              title: "8. Changes to Terms",
              body: "We may update these terms at any time. Continued use of Ustaadji after changes are posted constitutes your acceptance of the updated terms.",
            },
            {
              title: "9. Contact",
              body: "For questions about these terms, contact us at support@ustaadji.in.",
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
