import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { Shield, FileText, Eye, Lock, Phone, Mail, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/privacy-policy-2")({
  head: () => ({
    meta: [
      { title: "Privacy Policy - SMG Accountants, Bookkeepers & Advisors" },
      {
        name: "description",
        content:
          "Read SMG ABA's Privacy Policy to learn how we collect, use, protect, and safeguard your personal information when using our website.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Legal"
          title="Privacy Policy"
          description="Read SMG ABA's Privacy Policy to learn how we collect, use, protect, and safeguard your personal information when using our website."
        />

        <section className="section-y">
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <div className="card-surface p-8 sm:p-12">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-navy text-white shadow-md">
                  <Shield className="size-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-navy">Privacy Policy</h2>
                  <p className="text-xs text-muted-foreground">Last updated: July 8, 2026</p>
                </div>
              </div>

              <div className="prose prose-lg max-w-none space-y-8 text-foreground/90 leading-relaxed">
                {/* SMS Privacy Policy */}
                <div>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-navy mb-4">
                    <Phone className="size-6 text-primary" />
                    SMS Privacy Policy
                  </h2>
                  <p className="text-base leading-relaxed">
                    We respect and prioritize the privacy of our clients. The personal information collected through SMS communications will be handled with care and will not be shared, sold, or distributed to third parties for marketing or promotional purposes. No mobile information, including phone numbers, will be disclosed to third parties or affiliates for advertising purposes. Furthermore, any data related to text messaging originator opt-in consent will remain strictly confidential and will not be shared with any external entities. Our commitment to your privacy means that all SMS-related interactions adhere to strict security protocols to ensure the protection of your information. If you have any questions regarding this policy, please contact us.
                  </p>
                </div>

                {/* Information We Collect */}
                <div>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-navy mb-4">
                    <Eye className="size-6 text-primary" />
                    Information We Collect
                  </h2>
                  <p className="text-base leading-relaxed">
                    SMG ABA LLC ("SMG," "we," "us," or "our") collects information from you when you visit our website, fill out a form, subscribe to our newsletter, or contact us directly. The types of information we may collect include:
                  </p>
                  <ul className="mt-4 space-y-3 pl-2">
                    {[
                      "Personal identification information (name, email address, phone number, mailing address)",
                      "Business information (company name, industry, number of employees)",
                      "Financial information provided voluntarily for consultation purposes",
                      "Website usage data (IP address, browser type, pages visited, time spent on pages)",
                      "Cookies and similar tracking technologies",
                      "Information provided through contact forms, appointment requests, or consultation inquiries",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-base">
                        <span className="mt-2 size-2 shrink-0 rounded-full bg-blue-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* How We Use Your Information */}
                <div>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-navy mb-4">
                    <FileText className="size-6 text-primary" />
                    How We Use Your Information
                  </h2>
                  <p className="text-base leading-relaxed">
                    The information we collect may be used in the following ways:
                  </p>
                  <ul className="mt-4 space-y-3 pl-2">
                    {[
                      "To personalize your experience and respond to your individual needs",
                      "To improve our website and service offerings based on your feedback",
                      "To process transactions and deliver the services you have requested",
                      "To send periodic emails regarding your account, services, or industry updates",
                      "To follow up after correspondence (phone call, email, or live chat inquiry)",
                      "To comply with applicable laws, regulations, and legal processes",
                      "To administer contests, promotions, surveys, or other site features",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-base">
                        <span className="mt-2 size-2 shrink-0 rounded-full bg-blue-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* How We Protect Your Information */}
                <div>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-navy mb-4">
                    <Lock className="size-6 text-primary" />
                    How We Protect Your Information
                  </h2>
                  <p className="text-base leading-relaxed">
                    We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems. All sensitive information you supply is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our database to be only accessed as stated above.
                  </p>
                  <p className="mt-4 text-base leading-relaxed">
                    We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
                  </p>
                </div>

                {/* Cookies */}
                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">
                    Cookies
                  </h2>
                  <p className="text-base leading-relaxed">
                    We use cookies to understand and save your preferences for future visits, keep track of advertisements, and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future. We may contract with third-party service providers to assist us in better understanding our site visitors. These service providers are not permitted to use the information collected on our behalf except to help us conduct and improve our business.
                  </p>
                  <p className="mt-4 text-base leading-relaxed">
                    You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies through your browser settings. If you disable cookies, some features will be disabled and some of our services will not function properly.
                  </p>
                </div>

                {/* Third-Party Disclosure */}
                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">
                    Third-Party Disclosure
                  </h2>
                  <p className="text-base leading-relaxed">
                    We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. We may also release information when its release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.
                  </p>
                </div>

                {/* Third-Party Links */}
                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">
                    Third-Party Links
                  </h2>
                  <p className="text-base leading-relaxed">
                    Occasionally, at our discretion, we may include or offer third-party products or services on our website. These third-party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.
                  </p>
                </div>

                {/* Children's Online Privacy */}
                <div>
                  <h2 className="text-2xl font-bold text-navy mb-4">
                    Children's Online Privacy Protection
                  </h2>
                  <p className="text-base leading-relaxed">
                    We do not specifically market to children under the age of 13. Our website, products, and services are all directed to people who are at least 13 years old or older.
                  </p>
                </div>

                {/* Changes to This Policy */}
                <div>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-navy mb-4">
                    <AlertTriangle className="size-6 text-primary" />
                    Changes to This Privacy Policy
                  </h2>
                  <p className="text-base leading-relaxed">
                    SMG ABA LLC reserves the right to update or change our Privacy Policy at any time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                  </p>
                </div>

                {/* Contact Us */}
                <div>
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-navy mb-4">
                    <Mail className="size-6 text-primary" />
                    Contact Us
                  </h2>
                  <p className="text-base leading-relaxed">
                    If there are any questions regarding this privacy policy, you may contact us using the information below:
                  </p>
                  <div className="mt-4 rounded-2xl border border-border p-6 bg-mist/20">
                    <p className="font-bold text-navy text-lg">SMG ABA LLC</p>
                    <p className="mt-1 text-sm text-foreground/80">300 Corporate Plaza</p>
                    <p className="text-sm text-foreground/80">Islandia, NY 11749</p>
                    <p className="mt-2 text-sm text-foreground/80">
                      Phone: <a href="tel:6314818600" className="font-semibold text-primary hover:underline">(631) 481-8600</a>
                    </p>
                    <p className="text-sm text-foreground/80">
                      Email: <a href="mailto:info@smgaba.com" className="font-semibold text-primary hover:underline">info@smgaba.com</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
