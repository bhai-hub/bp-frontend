import React from "react";

type Props = {
  type: "terms" | "privacy";
  onClose: () => void;
};

const content = {
  terms: {
    title: "Terms & Conditions",
    effective: "Effective Date: 1 September 2026",
    sections: [
      {
        heading: "1. Acceptance of Terms",
        body: "By accessing or using the Brownie Points enterprise recognition platform ('Service'), you agree to be bound by these Terms and Conditions ('Terms'). If you do not agree, you must not use the Service. These Terms apply to all users, including administrators, HR managers, and employees.",
      },
      {
        heading: "2. Description of Service",
        body: "Brownie Points provides a blockchain-anchored employee recognition and points management system. The Service enables organisations to issue, track, and audit recognition points on an immutable ledger. All transactions are recorded with tamper-evident cryptographic hashes and verifiable merkle roots.",
      },
      {
        heading: "3. Account Responsibilities",
        body: "You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. You must notify us immediately of any unauthorised use. Administrators bear responsibility for the accuracy of point allocations and the suitability of award rationales entered into the system.",
      },
      {
        heading: "4. Acceptable Use",
        body: "You agree not to use the Service to award points for discriminatory, retaliatory, or fraudulent purposes. All point awards must be accompanied by a genuine, documented rationale. Brownie Points reserves the right to suspend accounts found to be manipulating the ledger or circumventing audit controls.",
      },
      {
        heading: "5. Data and Blockchain Records",
        body: "Once a transaction is committed to the blockchain ledger, it cannot be altered or deleted. This immutability is a core feature of the Service and a design requirement for audit compliance. Organisations must ensure that all data entered is accurate before submission.",
      },
      {
        heading: "6. Intellectual Property",
        body: "All software, algorithms, user interface designs, and documentation comprising the Brownie Points platform are the exclusive intellectual property of Brownie Points Enterprise Inc. You are granted a limited, non-exclusive, non-transferable licence to use the Service for your organisation's internal purposes only.",
      },
      {
        heading: "7. Limitation of Liability",
        body: "To the maximum extent permitted by applicable law, Brownie Points Enterprise Inc. shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of the Service, including but not limited to loss of data, revenue, or business opportunity.",
      },
      {
        heading: "8. Termination",
        body: "Either party may terminate the agreement upon 30 days' written notice. Upon termination, you will retain read-only access to your transaction history for a period of 90 days. Blockchain records will remain permanently immutable and accessible via the public audit endpoint.",
      },
      {
        heading: "9. Governing Law",
        body: "These Terms shall be governed by and construed in accordance with the laws of England and Wales. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.",
      },
      {
        heading: "10. Changes to Terms",
        body: "We reserve the right to modify these Terms at any time. We will provide 14 days' notice of material changes via email and in-platform notification. Continued use of the Service after such notice constitutes your acceptance of the updated Terms.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    effective: "Effective Date: 1 September 2026",
    sections: [
      {
        heading: "1. Introduction",
        body: "Brownie Points Enterprise Inc. ('we', 'our', 'us') is committed to protecting the personal data of all users of our platform. This Privacy Policy explains what data we collect, how we use it, and your rights in relation to it. We comply fully with the UK GDPR and, where applicable, the EU General Data Protection Regulation.",
      },
      {
        heading: "2. Data We Collect",
        body: "We collect the following categories of personal data: (a) Identity data — employee names, job titles, and employee reference codes provided by your organisation; (b) Transaction data — point award records including recipient, award reason, category, timestamp, and cryptographic hash; (c) Usage data — login timestamps, IP addresses, and session metadata for security and audit purposes; (d) Account data — email addresses and hashed passwords for authentication.",
      },
      {
        heading: "3. How We Use Your Data",
        body: "We use personal data solely for: operating and improving the Service; generating audit-grade transaction records; fulfilling contractual obligations to your organisation; complying with legal and regulatory requirements; and communicating service updates and security notices. We do not use your data for advertising or sell it to third parties under any circumstances.",
      },
      {
        heading: "4. Blockchain Data and Immutability",
        body: "Certain data — specifically transaction hashes, point values, award rationales, and timestamps — is written to our blockchain ledger as part of the core audit function. Due to the immutable nature of blockchain records, this data cannot be erased once committed. Organisations are advised to anonymise employee identifiers before submission if long-term immutability is a GDPR concern. We provide pseudonymisation tooling for this purpose.",
      },
      {
        heading: "5. Data Sharing",
        body: "We do not share personal data with third parties except: (a) authorised sub-processors who assist in operating the Service, bound by strict data processing agreements; (b) where required by law, regulation, or valid legal process; (c) in the event of a merger or acquisition, subject to equivalent data protection commitments from the acquiring party.",
      },
      {
        heading: "6. Data Retention",
        body: "We retain active account data for the duration of your subscription plus 12 months. Audit ledger records are retained for 7 years to comply with standard financial record-keeping requirements. You may request early deletion of non-ledger personal data, subject to our legal retention obligations.",
      },
      {
        heading: "7. Your Rights",
        body: "Under UK GDPR you have the right to: access a copy of your personal data; correct inaccurate data; request deletion of data we are not legally obliged to retain; restrict or object to processing; and data portability. To exercise these rights, contact our Data Protection Officer at dpo@browniepoints.io. We will respond within 30 days.",
      },
      {
        heading: "8. Cookies",
        body: "The Service uses strictly necessary session cookies for authentication and security. We do not use tracking, advertising, or analytics cookies without your explicit consent. You may manage cookie preferences through your browser settings without affecting core functionality.",
      },
      {
        heading: "9. Security",
        body: "We implement industry-standard technical and organisational measures to protect your data, including AES-256 encryption at rest, TLS 1.3 in transit, role-based access controls, and regular third-party penetration testing. We maintain SOC 2 Type II certification.",
      },
      {
        heading: "10. Contact",
        body: "For any privacy-related queries, please contact our Data Protection Officer at dpo@browniepoints.io or by post at Brownie Points Enterprise Inc., 22 Finsbury Square, London EC2A 1DX, United Kingdom.",
      },
    ],
  },
};

export default function LegalModal({ type, onClose }: Props) {
  const data = content[type];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "40px 16px",
        overflowY: "auto",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 5,
          width: "100%",
          maxWidth: 680,
          border: "1px solid var(--border)",
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "var(--navy)",
            padding: "20px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>{data.title}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 3 }}>{data.effective}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              borderRadius: 4,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            <i className="bi bi-x" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "28px 28px 32px", maxHeight: "65vh", overflowY: "auto" }}>
          {data.sections.map((s) => (
            <div key={s.heading} style={{ marginBottom: 22 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--navy)",
                  marginBottom: 6,
                  borderLeft: "3px solid var(--amber)",
                  paddingLeft: 10,
                }}
              >
                {s.heading}
              </div>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.75, margin: 0, paddingLeft: 13 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            background: "var(--bg)",
            borderTop: "1px solid var(--border)",
            padding: "14px 28px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            className="btn btn-navy btn-sm"
            onClick={onClose}
            style={{
              background: "var(--navy)",
              border: "none",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              padding: "8px 20px",
              borderRadius: 4,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
